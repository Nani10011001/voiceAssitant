from langgraph.graph import START,StateGraph,END
from agents.ai_agents.chat_agent import Agent_state,chatnode,classifyIntent,retriveNodeChat,routerDiside

graph = StateGraph(Agent_state)
graph.add_node("general_chat",chatnode)
graph.add_node("classify",classifyIntent)

graph.add_node("green_valley_real_estate",retriveNodeChat)

graph.add_edge(START,"classify")
graph.add_conditional_edges("classify",routerDiside)
graph.add_edge("green_valley_real_estate",END)
graph.add_edge("general_chat",END)
agent = graph.compile()
