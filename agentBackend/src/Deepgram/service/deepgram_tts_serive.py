from deepgram import DeepgramClient
class Deepgram_TTS_service:
    def __init__(self,api_key: str):
        if not api_key:
            raise ValueError("Deepgram API key is required")
        
        self.client = DeepgramClient(api_key=api_key)

    async def speak(self, text:str) -> bytes:
        """ initial the TTS for agent voice"""
       
        response = self.client.speak.v1.audio.generate(
            text=text,
            model="aura-2-athena-en"
        )
        for chunk in response:
            print(type(chunk))
            print(chunk)
            break
        
        return response