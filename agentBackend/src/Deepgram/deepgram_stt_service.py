import asyncio
from deepgram import AsyncDeepgramClient
from deepgram.core.events import EventType
from deepgram.listen.v1.types.listen_v1results import ListenV1Results
from langchain_core.messages import  HumanMessage
class DeepgramService:

    def __init__(self, api_key: str, websocket=None, agent=None):
        if not api_key:
            raise ValueError("Deepgram API key is required")
        self.client = AsyncDeepgramClient(api_key=api_key)
        self.connection = None
        self._listen_task = None
        self._cm = None
        self.websocket = websocket
        self.agent = agent

    async def connect_stt(self):
        """Connect to Deepgram Speech-to-Text."""
        self._cm = self.client.listen.v1.connect(
            model="nova-3",
            encoding="opus",
        )
        self.connection = await self._cm.__aenter__()

        self.connection.on(EventType.OPEN, self._on_open)
        self.connection.on(EventType.MESSAGE, self._on_message)
        self.connection.on(EventType.ERROR, self._on_error)
        self.connection.on(EventType.CLOSE, self._on_close)

        self._listen_task = asyncio.create_task(self.connection.start_listening())
        print("Deepgram Connected")

    async def send_audio(self, audio: bytes):
        """Send microphone audio to Deepgram."""
        if self.connection:
            await self.connection.send_media(audio)

    async def close(self):
        """Close Deepgram connection."""
        if self._listen_task:
            self._listen_task.cancel()
        if self._cm:
            await self._cm.__aexit__(None, None, None)

    async def _on_open(self, *_):
        print("Deepgram Connected")

    async def _on_message(self, *args, **kwargs):
        result = kwargs.get("data") or (args[0] if args else None)
        if not isinstance(result, ListenV1Results):
            return

        transcript = result.channel.alternatives[0].transcript
        if not transcript:
            return

        print("User:", transcript)

        # Only invoke agent on final results, not interim
        if not result.is_final:
            return

        if self.agent and self.websocket:
            response = self.agent.invoke({
                "messages": [HumanMessage(content=transcript)]
            })
            ai_text = response["messages"][-1].content
            print("Agent:", ai_text)
            await self.websocket.send_text(ai_text)

    async def _on_error(self, *args, **kwargs):
        error = kwargs.get("data") or (args[0] if args else args)
        print("Deepgram Error:", error)

    async def _on_close(self, *_):
        print("Deepgram Closed")