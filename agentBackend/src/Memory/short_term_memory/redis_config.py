from upstash_redis import Redis



class RedisServer:
    def __init__(self,url,api_key):
        if not api_key or not url:
            raise ValueError("redis api_key and url is undefined")
     
        self.api_key = api_key
        self.url = url
        self.redis =Redis(url=self.url,token=self.api_key)

    def redis_set(self,session_id ,user_msg,ttl:int = 1800):
        key = f"session: {session_id}"
        self.redis.set(key,user_msg,ex=ttl)
        print("data is redis set")

    def redis_get(self,session_id):
        key = f"session: {session_id}"
        return self.redis.get(key=key)

    def redis_delete(self,session_id):
        key = f"session: {session_id}"
        self.redis.delete(key)

