from langchain_core.messages import HumanMessage

class ConversationService:

    def __init__(self, agent):
        self.agent = agent

    async def chat(self, text: str):
        response = await self.agent.ainvoke({
            "messages": [
                HumanMessage(content=text)
            ]
        })

        return response["messages"][-1].content