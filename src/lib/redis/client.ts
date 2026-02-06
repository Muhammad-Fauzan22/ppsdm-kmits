/**
 * Redis Client Configuration for Upstash
 * Free Tier: 10,000 commands per day
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Check if Upstash credentials are available
const hasUpstashCredentials = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Create Redis client only if credentials are available
export const redis = hasUpstashCredentials
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Rate limiter configuration
// Free tier: 10 requests per 10 seconds
export const ratelimit = hasUpstashCredentials
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "ppsdm-kmits",
    })
  : null;

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  // Short-lived caches (1 minute)
  short: 60,
  // Medium-lived caches (5 minutes)
  medium: 300,
  // Long-lived caches (1 hour)
  long: 3600,
  // Very long-lived caches (24 hours)
  veryLong: 86400,
  // Assessment results (7 days)
  assessmentResults: 604800,
  // User preferences (30 days)
  userPreferences: 2592000,
};

// Helper function to set cache
export async function setCache<T>(key: string, data: T, ttl: number = CACHE_TTL.medium): Promise<void> {
  if (!redis) {
    console.warn('Redis not configured, skipping cache set');
    return;
  }

  try {
    await redis.set(key, data, { ex: ttl });
  } catch (error) {
    console.error('Failed to set cache:', error);
  }
}

// Helper function to get cache
export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    console.warn('Redis not configured, skipping cache get');
    return null;
  }

  try {
    const data = await redis.get<T>(key);
    return data;
  } catch (error) {
    console.error('Failed to get cache:', error);
    return null;
  }
}

// Helper function to delete cache
export async function deleteCache(key: string): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    await redis.del(key);
  } catch (error) {
    console.error('Failed to delete cache:', error);
  }
}

// Helper function to check if cache exists
export async function cacheExists(key: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error('Failed to check cache existence:', error);
    return false;
  }
}

// Helper function to get multiple keys
export async function getMultiple<T>(keys: string[]): Promise<(T | null)[]> {
  if (!redis) {
    return keys.map(() => null);
  }

  try {
    const values = await redis.mget(...keys);
    return values as (T | null)[];
  } catch (error) {
    console.error('Failed to get multiple keys:', error);
    return keys.map(() => null);
  }
}

// Helper function to set multiple keys
export async function setMultiple<T extends Record<string, any>>(
  data: T,
  ttl: number = CACHE_TTL.medium
): Promise<void> {
  if (!redis) {
    return;
  }

  try {
    const pipeline = redis.pipeline();
    
    for (const [key, value] of Object.entries(data)) {
      pipeline.set(key, value, { ex: ttl });
    }
    
    await pipeline.exec();
  } catch (error) {
    console.error('Failed to set multiple keys:', error);
  }
}

// Cache key generators
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userPreferences: (userId: string) => `user:${userId}:preferences`,
  assessment: (assessmentId: string) => `assessment:${assessmentId}`,
  assessmentResults: (userId: string, assessmentType: string) => 
    `assessment:${userId}:${assessmentType}:results`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  leaderboard: (type: string) => `leaderboard:${type}`,
  content: (contentId: string) => `content:${contentId}`,
  apiResponse: (endpoint: string, params: string) => 
    `api:${endpoint}:${params}`,
};

// Export Upstash QStash for background jobs (commented out due to module issues)
// import { Client as QStashClient } from '@upstash/qstash';
// export const qstash = process.env.QSTASH_TOKEN ? new QStashClient({ token: process.env.QSTASH_TOKEN }) : null;
