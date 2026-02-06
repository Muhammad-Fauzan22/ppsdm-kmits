/**
 * Dashboard Redis Cache Implementation
 * Uses Upstash Redis (free tier) for caching dashboard data
 * Cache TTL: 5 minutes (300 seconds)
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Cache configuration
const CACHE_TTL = 300; // 5 minutes in seconds
const CACHE_PREFIX = 'dashboard:';

/**
 * Dashboard data interface
 */
export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    level?: number;
  };
  radarData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
  greeting: string;
  stats: {
    overallScore: number;
    completedAssessments: number;
    streakDays: number;
    totalXp: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    timestamp: string;
  }>;
}

/**
 * Get cached dashboard data
 */
export async function getCachedDashboard(userId: string): Promise<DashboardData | null> {
  try {
    const cacheKey = `${CACHE_PREFIX}${userId}`;
    const cached = await redis.get<DashboardData>(cacheKey);
    return cached;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set dashboard data in cache
 */
export async function setCachedDashboard(userId: string, data: DashboardData): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${userId}`;
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

/**
 * Invalidate dashboard cache
 */
export async function invalidateDashboardCache(userId: string): Promise<void> {
  try {
    const cacheKey = `${CACHE_PREFIX}${userId}`;
    await redis.del(cacheKey);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

/**
 * Cache wrapper for dashboard data fetching
 */
export async function getDashboardDataWithCache(
  userId: string,
  fetchFn: () => Promise<DashboardData>
): Promise<DashboardData> {
  // Try to get from cache first
  const cached = await getCachedDashboard(userId);
  if (cached) {
    console.log(`[Cache] Dashboard data served from cache for user ${userId}`);
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  await setCachedDashboard(userId, data);
  console.log(`[Cache] Dashboard data cached for user ${userId}`);
  
  return data;
}

/**
 * Check Redis connection health
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  connected: boolean;
  keys: number;
}> {
  try {
    const connected = await checkRedisHealth();
    // Count dashboard keys
    const keys = await redis.keys(`${CACHE_PREFIX}*`);
    return {
      connected,
      keys: keys.length,
    };
  } catch (error) {
    return {
      connected: false,
      keys: 0,
    };
  }
}
