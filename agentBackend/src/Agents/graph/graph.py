from langgraph.graph import START,StateGraph,END
from Agents.ai_agents.chat_agent import Agent_state,chatnode
graph = StateGraph(Agent_state)
graph.add_node("chatagent",chatnode)
graph.add_edge(START,"chatagent")
graph.add_edge("chatagent",END)
agent = graph.compile()
