from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage,BaseMessage,AIMessage,SystemMessage
from langgraph.graph.message import add_messages
from typing import TypedDict,Dict,List,Annotated,Sequence
from service.llm_service import LLM_provider
import os
from dotenv import load_dotenv
load_dotenv()
groq_api = os.getenv("GROQ_API")
parse = LLM_provider(api_key=groq_api,model_name="llama-3.1-8b-instant")
llm = parse.llm()

result = llm.invoke("hello i am nani will help to build the mutiagents using the langchain and the langgraph framworks")
print("---LLM Answer ---")
print(result.content)



