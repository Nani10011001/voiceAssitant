from llama_index.core import SimpleDirectoryReader,VectorStoreIndex,StorageContext,load_index_from_storage
import os
from llama_parse import LlamaParse
from dotenv import load_dotenv
from llama_index.core import Settings

from llama_index.embeddings.huggingface import HuggingFaceEmbedding

load_dotenv()
import logging
logger = logging.getLogger(__name__)

hf_token =os.environ["HF_TOKEN"]
if not hf_token:
    raise ValueError("hf_token is undefined")


Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
class rag_serive:
    def __init__(self,api_key,persit_dir,file_path):
        if not api_key:
            raise ValueError("llama_parser api key is undefined")
        if not os.path.exists(persit_dir):
            raise ValueError("persit_dir path is undefined")
        if not os.path.exists(file_path):
            raise ValueError("file_apth is undefined")
        self.api_key = api_key
        self.persit_dir = persit_dir
        self.file_path = file_path
        self.index =  self.load_or_build_index()

    def load_pdf_parser(self):
        parser = LlamaParse(
            api_key=self.api_key,
            result_type="markdown"
        )
        document = parser.load_data(file_path=[self.file_path])
        if not document or not document[0].text.strip():
            raise ValueError("Parsed document is  empty - check Llamaparse output")

        logging.info("Parsed documents :",len(document),self.file_path)
        return document
    
    def load_or_build_index(self):
        docstore_path = os.path.join(self.persit_dir,"docstore.json")

        if os.path.exists(docstore_path):
            logger.info("loading existing index from: ",self.persit_dir)
            storage_context = StorageContext.from_defaults(persist_dir=self.persit_dir)
            return load_index_from_storage(storage_context=storage_context)
        logger.info("No existing index found building new one")

        documents = self.load_pdf_parser()
        index = VectorStoreIndex.from_documents(documents=documents,show_progress=True)
        index.storage_context.persist(persist_dir=self.persit_dir)
        logger.info("index built and persisted to: ",self.persit_dir)
        return index
    def get_query_engine(self, top_k: int = 3):
        return self.index.as_retriever(similarity_top_k=top_k)
    def get_context_text(self, query:str, top_k: int = 3):
        retrive = self.get_query_engine(top_k=top_k)
        nodes = retrive.retrieve(query)
        return "\n\n".join(node.get_content() for node in nodes)



        
      
        
 