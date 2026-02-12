import { createClient } from 'redis';

export const redisClient = await createClient({ url: process.env.REDIS_URL }).connect();

console.log(redisClient ? 'Redis client connected successfully' : 'Failed to connect to Redis');