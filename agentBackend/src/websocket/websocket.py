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
    tts =Deepgram_TTS_service(api_key=deepgram_api_key)
    await deepgram.connect_stt()

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

                    if payload.get("type") == "start":
                        greeting = (
        "Hello! Welcome to Sunshine Realty. "
        "I'm your AI real estate assistant. "
        "How can I help you today?"
    )
                    audio = await tts.speak(greeting)
                    await websocket.send_bytes(audio)
                    continue

                except json.JSONDecodeError:
                    continue

            if message.get("bytes"):
                await deepgram.send_audio(message["bytes"])

    async def process_transcripts():
        while True:
            transcript = await deepgram.transcript_queue.get()
            
            
            print(f"user: {transcript}")
            
            ai_reponse = await conversation.chat(transcript)
            audio = await tts.speak(ai_reponse)
            print(f"agent: {ai_reponse}")

            await websocket.send_bytes(audio)

    try:
        await asyncio.gather(
            receive_audio(),
            process_transcripts()
        )

    except WebSocketDisconnect:
        print("Client disconnected")

    except Exception as e:
        traceback.print_exc()
        print(f"Error: {e}")

    finally:
        await deepgram.close()