from langchain_core.messages import HumanMessage

class ConversationService:

    def __init__(self, agent):
        self.agent = agent

    async def chat(self, text: str,name:str ,phone_number:str,session_id:str):
        response = await self.agent.ainvoke({
            "messages": [
                HumanMessage(content=text)
            ],
            "session_id":session_id,
            "name": name,
            "phone_number":phone_number
        })

        return response["messages"][-1].content