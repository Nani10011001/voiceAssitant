from langgraph.graph import StateGraph,START,END
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage,BaseMessage,AIMessage,SystemMessage
from dotenv import load_dotenv
from  typing import TypedDict,Annotated,Sequence,List,Dict
from Agents.service.llm_service import LLM_provider
import os
load_dotenv()
groq_api_key= os.environ["GROQ_API"]
if not groq_api_key:
    raise ValueError("groq api is undefined")


class Agent_state(TypedDict):
    
    messages:Annotated[Sequence[BaseMessage],add_messages]

llm_parser = LLM_provider(api_key=groq_api_key,model_name="llama-3.1-8b-instant")


def chatnode(state:Agent_state):
    user_msg = state['messages'][-1].content
    llm = llm_parser.llm()
    response = llm.invoke([SystemMessage(content="your intelligent real estate agent give tip and information"),HumanMessage(content=user_msg)])
    return {
        "messages":[response]
    }
