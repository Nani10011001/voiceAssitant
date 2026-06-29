from fastapi import APIRouter
from pydantic import BaseModel
class request(BaseModel):
    name:str
    phoneNumber:str

AgentRouter = APIRouter()
@AgentRouter.post("/v1/chat")

async def AgentChat(req:dict):
    

    try:
        if not req.name or not req.phoneNumber:
                ValueError("all value are required")
                
    except Exception as e:
         print(f"error at the agentRouter: {e}")
         raise

    return {
      "messages":"data recieved successfully",
      "name":req.name,
      "phoneNumber":req.phoneNumber

    }
AgentVapi = APIRouter()

@AgentVapi.post("/vapi/v1/chat")
async def chat(req: dict):

    user_message = req.get("userMessage", "")

    return {
        "say": f"You said: {user_message}",
        "done": False
    }