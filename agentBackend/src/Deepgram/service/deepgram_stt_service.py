import asyncio
from typing import Awaitable, Callable
from deepgram import AsyncDeepgramClient
from deepgram.core.events import EventType
from deepgram.listen.v1.types.listen_v1results import ListenV1Results
from websockets.exceptions import ConnectionClosedError


class DeepgramService:

    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Deepgram API key is required")
        self.client = AsyncDeepgramClient(api_key=api_key)
        self.connection = None
        self._listen_task = None
        self._cm = None
        self._keepalive_task = None

        self.transcript_queue = asyncio.Queue()
        self.on_user_speaking: Callable[[], Awaitable[None]] | None = None

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
        self._keepalive_task = asyncio.create_task(self._send_keepalive())
        print("Deepgram Connected")

    async def _send_keepalive(self):
        """Keep the socket alive during silence (e.g. while the agent is speaking)."""
        try:
            while True:
                await asyncio.sleep(5)  # comfortably under Deepgram's 10s timeout
                if self.connection:
                    await self.connection.send_keep_alive()
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print("Keepalive error:", e)

    async def send_audio(self, audio: bytes):
        """Send microphone audio to Deepgram with auto-reconnect on connection loss."""
        if not self.connection:
            print("Connection not available, attempting to reconnect...")
            await self.connect_stt()

        try:
            if self.connection:
                await self.connection.send_media(audio)
        except ConnectionClosedError as e:
            print(f"Deepgram connection lost: {e}. Attempting to reconnect...")
            await self._teardown_connection()
            await asyncio.sleep(0.5)
            await self.connect_stt()

            if self.connection:
                await self.connection.send_media(audio)

    async def _teardown_connection(self):
        """Cancel background tasks and close the underlying connection cleanly."""
        if self._listen_task:
            self._listen_task.cancel()
        if self._keepalive_task:
            self._keepalive_task.cancel()
        if self._cm:
            try:
                await self._cm.__aexit__(None, None, None)
            except Exception:
                pass

        self.connection = None
        self._listen_task = None
        self._keepalive_task = None
        self._cm = None

    async def close(self):
        """Close Deepgram connection."""
        await self._teardown_connection()

    async def _on_open(self, *_):
        print("Deepgram Connected")

    async def _on_message(self, *args, **kwargs):
        result = kwargs.get("data") or (args[0] if args else None)

        if not isinstance(result, ListenV1Results):
            return

        transcript = result.channel.alternatives[0].transcript

        if not transcript:
            return

        if not result.is_final:
            if len(transcript.strip()) >= 3 and self.on_user_speaking:
                try:
                    await self.on_user_speaking()
                except asyncio.CancelledError:
                    raise
                except Exception as e:
                    print("Deepgram on_user_speaking callback error:", e)
            return

        if not result.speech_final:
            return

        print(f"Transcript: '{transcript}'")
        await self.transcript_queue.put(transcript)

    async def _on_error(self, *args, **kwargs):
        error = kwargs.get("data") or (args[0] if args else args)
        print("Deepgram Error:", error)

    async def _on_close(self, *_):
        print("Deepgram Closed")