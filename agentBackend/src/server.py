from fastapi import FastAPI
from Agents.service.AgentService import AgentRouter,AgentVapi
app = FastAPI()

app.include_router(AgentRouter)
app.include_router(AgentVapi)
@app.get("/hello-docs")
def get_data(): 
    return {
        "Greeting":"hi i am Nani"
    }