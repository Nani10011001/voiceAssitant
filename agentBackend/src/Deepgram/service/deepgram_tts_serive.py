from deepgram import AsyncDeepgramClient

class Deepgram_TTS_service:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Deepgram API key is required")
        self.client = AsyncDeepgramClient(api_key=api_key)

    async def speak(self, text: str) -> bytes:
        chunks = []
        async for chunk in self.client.speak.v1.audio.generate(
            text=text,
            model="aura-2-athena-en",
            encoding="mp3"
        ):
            chunks.append(chunk)
        return b"".join(chunks)