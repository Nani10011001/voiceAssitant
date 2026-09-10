
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage,BaseMessage,AIMessage,SystemMessage
from dotenv import load_dotenv
from  typing import TypedDict,Annotated,Sequence,List,Dict
from agents.service.llm_service import LLM_provider
from agents.prompts.chat_prompt import chat_prompt,rag_prompt
from Memory.short_term_memory.redis_config import RedisServer
import os
from rag.rag_service import rag_serive
from langsmith import traceable
load_dotenv()
groq_api_key= os.environ["GROQ_API"]
if not groq_api_key:
    raise ValueError("groq api is undefined")

llm_parser = LLM_provider(api_key=groq_api_key,model_name="openai/gpt-oss-20b")#gpt-oss-20b
api_key = os.environ["LLAMAPARSER_API_KEY"]
pdf_path = r"C:\Users\nani9\OneDrive\Desktop\Projects\Agents\advanceVoiceAssistant\agentBackend\src\rag\Green_Valley_Residency_Brochure.pdf"
redis_url = os.environ["UPSTASH_REDIS_REST_URL"]
redis_api_key = os.environ["UPSTASH_REDIS_REST_TOKEN"]
    
rag = rag_serive(api_key=api_key,file_path=pdf_path,persit_dir=r"C:\Users\nani9\OneDrive\Desktop\Projects\Agents\advanceVoiceAssistant\agentBackend\src\rag\rag_storage")

redis = RedisServer(url=redis_url,api_key=redis_api_key)


class Agent_state(TypedDict):
    
    messages:Annotated[Sequence[BaseMessage],add_messages]
    session_id:str
    name: str
    phone_number: str
    
    intent:str
    






INTENT = {
    "general_chat": "User conversation with hello, hi, or unknown/small-talk content",
    "green_valley_real_estate": "About the building, 2BHK or 3BHK units, location, or availability of units",
}

@traceable(name="intent_content_prompt")
def classifyIntentPrompty(user_message:str):

    intent_definition = "\n".join(
    f"{key}- {desc}"    for key, desc in INTENT.items()
    )
    return f"""
You are an intent classifier for a Real estate voiceAssitant.

Return ONLY one intent label from the list below.
No explanation. No punctuation. Just the label.

Intents:
{intent_definition}

User message: "{user_message}"

Intent:
""".strip()
@traceable(name="classifyIntentNode")
def classifyIntent(user_msg):

   
    llm = llm_parser.llm()
    response = llm.invoke(classifyIntentPrompty(user_msg))
    raw = response.content.strip().lower()

    intent = raw if raw in INTENT  else "general_chat"
    return {
        "intent":intent
    }



    
@traceable(name="routerdiside")
def routerDiside(state:Agent_state):
    intent_data = state.get("intent","general_chat")

    if intent_data == "green_valley_real_estate":
        return "green_valley_real_estate"
    else:
        return "general_chat"


@traceable(name="generalChatNode")
def chatnode(state:Agent_state):

    user_msg = state['messages'][-1].content
    user_name = state["name"]
    session_id = state["session_id"]
    phone_number = state["phone_number"]
    llm = llm_parser.llm()
    response = llm.invoke([SystemMessage(content=chat_prompt(name=user_name,session_id=session_id,phone_number=phone_number)),HumanMessage(content=user_msg)])
    return {
        "messages":[response]
    }
@traceable(name="retiveNode")
def retriveNodeChat(state: Agent_state):
    user_msg = state["messages"][-1].content
    user_name = state["name"]
    session_id = state["session_id"]
    phone_number = state["phone_number"]
    rag_context = rag.get_context_text(query=user_msg)
    llm = llm_parser.llm()
    response = llm.invoke([SystemMessage(content=rag_prompt(retrieved_context=rag_context,user_query=user_msg,name=user_name,phone_number=phone_number,session_id=session_id))])
    return {
        "messages":[response]

    }