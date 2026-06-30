
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage,BaseMessage,AIMessage,SystemMessage
from dotenv import load_dotenv
from  typing import TypedDict,Annotated,Sequence,List,Dict
from agents.service.llm_service import LLM_provider
import os
load_dotenv()
groq_api_key= os.environ["GROQ_API"]
if not groq_api_key:
    raise ValueError("groq api is undefined")


class Agent_state(TypedDict):
    
    messages:Annotated[Sequence[BaseMessage],add_messages]

llm_parser = LLM_provider(api_key=groq_api_key,model_name="llama-3.1-8b-instant")

system_prompt = """"
You are an AI real estate receptionist.

Rules:
- Keep every response under 2 sentences unless the user explicitly asks for more details.
- Speak naturally like a human on a phone call.
- Never give long lists unless the user asks.
- Ask one question at a time.
- Keep responses under 50 words.
- Wait for the user's answer before continuing."""

def chatnode(state:Agent_state):
    user_msg = state['messages'][-1].content
    llm = llm_parser.llm()
    response = llm.invoke([SystemMessage(content=system_prompt),HumanMessage(content=user_msg)])
    return {
        "messages":[response]
    }
