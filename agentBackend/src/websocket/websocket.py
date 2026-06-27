from fastapi import WebSocket,APIRouter

websocketRouter = APIRouter()

@websocketRouter.websocket("/ws")
async def webSocketAudio(web: WebSocket):
    await web.accept()
    try:
       while True:
         data = await web.receive_text()
         print(data)

         await web.send_text("Connected")

    except  Exception as e:
       print("Client disconnection")
       
      



