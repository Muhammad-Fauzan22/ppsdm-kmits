/**
 * Dashboard Redis Cache Implementation
 * Uses Upstash Redis (free tier) for caching dashboard data
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const CACHE_TTL = 300; // 5 minutes in seconds
const CACHE_KEY_PREFIX = 'dashboard:';

/**
 * Get cached dashboard data for a user
 */
export async function getCachedDashboardData(userId: string) {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return null; // Redis not configured, skip caching
    }
    
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached as string);
    }
    
    return null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null; // Fail silently, fetch fresh data
  }
}

/**
 * Set dashboard data in cache
 */
export async function setCachedDashboardData(userId: string, data: any) {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return; // Redis not configured, skip caching
    }
    
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error);
    // Fail silently
  }
}

/**
 * Invalidate dashboard cache for a user
 */
export async function invalidateDashboardCache(userId: string) {
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return;
    }
    
    const cacheKey = `${CACHE_KEY_PREFIX}${userId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Cache wrapper for any function
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number = CACHE_TTL
): T {
  return (async (...args: Parameters<T>) => {
    const cacheKey = keyGenerator(...args);
    
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached as string);
      }
    } catch (error) {
      console.error('Cache get error:', error);
    }
    
    const result = await fn(...args);
    
    try {
      await redis.setex(cacheKey, ttl, JSON.stringify(result));
    } catch (error) {
      console.error('Cache set error:', error);
    }
    
    return result;
  }) as T;
}
