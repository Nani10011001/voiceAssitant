import asyncio
import json
import os

from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect
import traceback
from agents.graph.graph import agent
from agents.service.conv_service import ConversationService
from Deepgram.service.deepgram_stt_service import DeepgramService
from Deepgram.service.deepgram_tts_serive import Deepgram_TTS_service
load_dotenv()

websocket_router = APIRouter()

deepgram_api_key = os.environ["DEEPGRAM_API_KEY"]


@websocket_router.websocket("/ws")
async def websocket_audio(websocket: WebSocket):
    await websocket.accept()

    deepgram = DeepgramService(api_key=deepgram_api_key)
    conversation = ConversationService(agent)
    tts = Deepgram_TTS_service(api_key=deepgram_api_key)
    await deepgram.connect_stt()

    # Cancellation support
    is_interrupted = False
    agent_task = None  # Track the active agent/TTS task
    task_lock = asyncio.Lock()  # Protect task access

    async def receive_audio():
        nonlocal is_interrupted, agent_task
        while True:
            message = await websocket.receive()

            if message["type"] == "websocket.disconnect":
                break

            if message.get("type") != "websocket.receive":
                continue

            # Handle interrupt signal from frontend
            if message.get("text"):
                try:
                    payload = json.loads(message["text"])

                    if payload.get("type") == "start":
                        greeting = (
        "Hello! Welcome to GREEN VALLEY RESIDENCY. "
        "I'm your AI real estate assistant. "
        "How can I help you today?"
    )
                        audio = await tts.speak(greeting)
                        await websocket.send_bytes(audio)
                        continue

                    # Handle interrupt message
                    if payload.get("type") == "interrupt":
                        print("Interrupt signal received - cancelling agent task")
                        is_interrupted = True
                        
                        # Cancel active agent task if it exists
                        async with task_lock:
                            if agent_task and not agent_task.done():
                                agent_task.cancel()
                                try:
                                    await agent_task
                                except asyncio.CancelledError:
                                    print("Agent task successfully cancelled")
                        
                        # Clear transcript queue to prevent stale input processing
                        while not deepgram.transcript_queue.empty():
                            try:
                                deepgram.transcript_queue.get_nowait()
                            except:
                                break
                        
                        is_interrupted = False
                        continue

                except json.JSONDecodeError:
                    continue

            if message.get("bytes"):
                try:
                    await deepgram.send_audio(message["bytes"])
                except Exception as e:
                    print(f"Error sending audio to Deepgram: {e}")
                    traceback.print_exc()
                    # Continue instead of breaking the connection

    async def process_transcripts():
        nonlocal is_interrupted, agent_task
        while True:
            transcript = await deepgram.transcript_queue.get()
            
            if is_interrupted:
                print("Skipping transcript due to interrupt")
                continue
            
            print(f"user: {transcript}")
            
            # Create task for agent response generation and TTS
            async def generate_and_speak():
                try:
                    ai_response = await conversation.chat(transcript)
                    audio = await tts.speak(ai_response)
                    print(f"agent: {ai_response}")
                    await websocket.send_bytes(audio)
                except asyncio.CancelledError:
                    print("Agent/TTS generation cancelled")
                    raise
                except Exception as e:
                    print(f"Error in agent response: {e}")
                    traceback.print_exc()
            
            # Create and track the task
            async with task_lock:
                agent_task = asyncio.create_task(generate_and_speak())
            
            try:
                await agent_task
            except asyncio.CancelledError:
                print("Agent task cancelled during execution")

    try:
        tasks = [
            asyncio.create_task(receive_audio()),
            asyncio.create_task(process_transcripts()),
        ]
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        for task in pending:
            task.cancel()
        await asyncio.gather(*pending, return_exceptions=True)

        # Surface exceptions from whichever task finished first
        for task in done:
            if task.exception():
                raise task.exception()

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        traceback.print_exc()
        print(f"Error: {e}")
    finally:
        await deepgram.close()