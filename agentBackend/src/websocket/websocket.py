import json
import os
from dotenv import load_dotenv
from fastapi import APIRouter, WebSocket
from fastapi.websockets import WebSocketDisconnect
from Agents.graph.graph import agent
from Deepgram.deepgram_stt_service import DeepgramService

load_dotenv()

websocket_router = APIRouter()
deepgram_api_key = os.environ["DEEPGRAM_API_KEY"]


@websocket_router.websocket("/ws")
async def websocket_audio(websocket: WebSocket):
    await websocket.accept()
    deepgram = DeepgramService(deepgram_api_key, websocket=websocket, agent=agent)
    await deepgram.connect_stt()

    try:
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

                if payload.get("type") == "start":
                    continue

            if message.get("bytes"):
                await deepgram.send_audio(message["bytes"])

    except WebSocketDisconnect:
        print("Client disconnected: WebSocketDisconnect")
    except Exception as e:
        print(f"Client disconnected: {type(e).__name__}: {e}")
    finally:
        await deepgram.close()