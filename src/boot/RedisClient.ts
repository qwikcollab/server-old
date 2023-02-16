import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

class RedisClient {
  public db: Redis;
  constructor() {
    const port = process.env.REDIS_PORT ?? '6379';
    const host = process.env.REDIS_HOST ?? 'localhost';
    if (process.env.NODE_ENV === 'test') {
      this.db = new RedisMock(parseInt(port), host);
    } else {
      this.db = new Redis(parseInt(port), host);
    }
  }
}

const instance = new RedisClient();

export default instance.db;
