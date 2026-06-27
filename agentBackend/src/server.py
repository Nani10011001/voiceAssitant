from fastapi import FastAPI
from Agents.service.AgentService import AgentRouter,AgentVapi
from websocket.websocket import websocketRouter


app = FastAPI()


app.include_router(AgentRouter)
app.include_router(AgentVapi)
app.include_router(websocketRouter)

@app.get("/hello-docs")
def get_data(): 
    return {
        "Greeting":"hi i am Nani"
    }