from langchain_groq import ChatGroq
import os

import logging 
logger = logging.getLogger(__name__)
class LLM_provider:
    def __init__(self,api_key,model_name):

        if not api_key:
            raise ValueError("provide the api key for Groq")
        if not model_name:
            raise ValueError("---modelname should not empty-- ")
               
        self.api_key = api_key
        self.model_name = model_name
        
       
        self.llm_instance:ChatGroq | None = None
        logger.info("model info initialized successfully")
        
    def llm(self)-> ChatGroq:
        try:
           if self.llm_instance is None:
            self.llm_instance = ChatGroq(
                        model=self.model_name,
                        api_key=self.api_key
                    )
            logger.info("chatGroq is created successfully")
        except Exception as e:
            logger.error(f" error at loading the model instance things: {e}")
            raise
        return self.llm_instance