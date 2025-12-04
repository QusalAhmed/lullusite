import { createClient } from 'redis';

export const redisClient = await createClient({ url: process.env.REDIS_URL }).connect();