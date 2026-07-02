from llama_index.core import SimpleDirectoryReader
import os
from llama_parse import LlamaParse
from dotenv import load_dotenv
load_dotenv()
from llama_index.core.indices.property_graph import PropertyGraphIndex
from llama_index.core.graph_stores.simple_labelled import SimplePropertyGraphStore
class rag_serive:
    def __init__(self,api_key):
        if not api_key:
            raise ValueError("llama_parser api key is undefined")
        self.api_key = api_key
        self.graph = self.load_graph()
        self.retriver = self.retriver()
        pass
    def load_graph(self):
        pdf = r"C:\Users\nani9\OneDrive\Desktop\Projects\Agents\advanceVoiceAssistant\agentBackend\src\rag\Green_Valley_Residency_Brochure.pdf"
        if not os.path.exists(pdf):
            raise FileNotFoundError("file not found")
        parser = LlamaParse(
            api_key=self.api_key,
              result_type="markdown"
        )
        document = parser.load_data(file_path=[pdf])
        print(document[0])
        print("len",len(document))
    def retriver(self):
        pass
api_key = os.environ["LLAMAPARSER_API_KEY"]
rag = rag_serive(api_key=api_key)
print(rag.load_graph())