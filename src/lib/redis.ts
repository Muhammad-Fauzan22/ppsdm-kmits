import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function getFromRedis<T>(key: string): Promise<T | null> {
    try {
        return await redis.get<T>(key);
    } catch (error) {
        console.error('Redis error:', error);
        return null;
    }
}

export async function deleteFromRedis(key: string): Promise<void> {
    try {
        await redis.del(key);
    } catch (error) {
        console.error('Redis delete error:', error);
    }
}

export async function closeRedisConnection(): Promise<void> {
    // Upstash HTTP client is stateless, no connection to close
    return Promise.resolve();
}