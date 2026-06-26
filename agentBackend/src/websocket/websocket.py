from fastapi import WebSocket,APIRouter

websocketRouter = APIRouter()

@websocketRouter.websocket("/ws")
async def webSocketAudio(web: WebSocket):
    pass


