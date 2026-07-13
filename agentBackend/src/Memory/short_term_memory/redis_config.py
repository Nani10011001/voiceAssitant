import asyncio
from upstash_redis.asyncio import Redis
import logging

logger = logging.getLogger(__name__)

class RedisServer:
    def __init__(self,url,api_key):
        if not api_key or not url:
            raise ValueError("redis api_key and url is undefined")
     
        self.api_key = api_key
        self.url = url
        self.redis =Redis(url=self.url,token=self.api_key)

    async def redis_set(self,session_id ,user_msg,ttl:int = 1800):
        try:

            key = f"session: {session_id}"
            pipe = self.redis.pipeline()
            pipe.lpush(key, user_msg)
            pipe.expire(key,ttl)
            await pipe.exec()
            logger.info("data is redis set done")
        except Exception as e:
            logger.error("error at push the message")
            raise


    async def redis_get(self,session_id):
        try:
            key = f"session: {session_id}"
            return await self.redis.lrange(key, -10, -1)
        except Exception as e:
            logger.error("--error at redis_get--",e)
            raise

        
    

    async def redis_delete(self,session_id):
        key = f"session: {session_id}"
        await self.redis.delete(key)

async def main():
    redis = RedisServer()
 
   
    pop_message = await redis.redis_delete(session_id="nani1234")
    get_message = await redis.redis_get(session_id="nani123")
    print(get_message)
    print(pop_message)
if __name__ == "__main__":
    asyncio.run(main())