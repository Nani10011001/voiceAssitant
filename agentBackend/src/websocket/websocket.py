import asyncio
import json
import os
import traceback

from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect

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

    agent_task: asyncio.Task | None = None
    task_lock = asyncio.Lock()

    async def stop_current_response():
        """Cancel in-flight agent/TTS generation and tell the frontend to stop playback."""
        nonlocal agent_task
        async with task_lock:
            if agent_task and not agent_task.done():
                agent_task.cancel()
                try:
                    await agent_task
                except asyncio.CancelledError:
                    print("Agent task cancelled")
        try:
            await websocket.send_text(json.dumps({"type": "stop_audio"}))
        except Exception as e:
            print("Failed to send stop_audio to frontend:", e)

    deepgram.on_user_speaking = stop_current_response

    async def receive_audio():
        while True:
            message = await websocket.receive()

            if message["type"] == "websocket.disconnect":
                break
            if message.get("type") != "websocket.receive":
                continue

            if message.get("text"):
                try:
                    payload = json.loads(message["text"])
                except json.JSONDecodeError:
                    continue

                """  if payload.get("type") == "start":
                    greeting = (
                        "Hello! Welcome to GREEN VALLEY RESIDENCY. "
                        "I'm your AI real estate assistant. "
                        "How can I help you today?"
                    )
                    
                    await tts.speak(text=greeting)
                    continue
                """
                if payload.get("type") == "interrupt":
                    print("Interrupt signal received")
                    await stop_current_response()
                    while not deepgram.transcript_queue.empty():
                        try:
                            deepgram.transcript_queue.get_nowait()
                        except Exception:
                            break
                    continue

            if message.get("bytes"):
                try:
                    await deepgram.send_audio(message["bytes"])
                except Exception as e:
                    print(f"Error sending audio to Deepgram: {e}")
                    traceback.print_exc()

    async def process_transcripts():
        nonlocal agent_task
        while True:
            transcript = await deepgram.transcript_queue.get()
            print(f"user: {transcript}")

          

            async def generate_and_speak():
                try:
                    ai_response = await conversation.chat(transcript)
                    
                    print(f"agent: {ai_response}")

                    await tts.speak(text=ai_response)
                except asyncio.CancelledError:
                    print("Agent/TTS generation cancelled")
                    raise
                except Exception as e:
                    print(f"Error in agent response: {e}")
                    traceback.print_exc()

            async with task_lock:
                agent_task = asyncio.create_task(generate_and_speak())

            try:
                await agent_task
            except asyncio.CancelledError:
                pass

    try:
        tasks = [
            asyncio.create_task(receive_audio()),
            asyncio.create_task(process_transcripts()),
        ]
        done, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
        for t in pending:
            t.cancel()
        await asyncio.gather(*pending, return_exceptions=True)
        for t in done:
            if t.exception():
                raise t.exception()

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        traceback.print_exc()
        print(f"Error: {e}")
    finally:
        await stop_current_response()
        await deepgram.close()