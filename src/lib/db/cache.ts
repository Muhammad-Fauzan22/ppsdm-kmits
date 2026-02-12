/**
 * PPSDM KMM - Query Caching Layer
 * 
 * This module provides caching utilities for database queries
 * using Next.js unstable_cache and React Query patterns.
 * 
 * Created: 2026-02-05
 */

import { unstable_cache } from 'next/cache';
import { revalidateTag } from 'next/cache';

// ============================================================================
// TYPES
// ============================================================================

export interface CacheOptions {
  tags?: string[];
  revalidate?: number; // seconds
}

// ============================================================================
// CACHED DATABASE FUNCTIONS
// ============================================================================

/**
 * Get cached user dimension scores
 * Revalidates every 60 seconds or when 'dimension-scores' tag is invalidated
 */
export const getCachedDimensionScores = unstable_cache(
  async (userId: string, db: any) => {
    const { getDimensionScoresOptimized } = await import('./queries');

    return await getDimensionScoresOptimized(db, userId);
  },
  ['dimension-scores'],
  {
    tags: ['dimension-scores', 'user-data'],
    revalidate: 60,
  }
);

/**
 * Get cached user profile
 * Revalidates every 5 minutes
 */
export const getCachedUserProfile = unstable_cache(
  async (userId: string, db: any) => {
    const { getUserProfileOptimized } = await import('./queries');

    return await getUserProfileOptimized(db, userId);
  },
  ['user-profile'],
  {
    tags: ['user-profile', 'user-data'],
    revalidate: 300,
  }
);

/**
 * Get cached dashboard stats
 * Revalidates every 30 seconds
 */
export const getCachedDashboardStats = unstable_cache(
  async (userId: string, db: any) => {
    const { getDashboardStats } = await import('./queries');
    return await getDashboardStats(db, userId);
  },
  ['dashboard-stats'],
  {
    tags: ['dashboard', 'user-data'],
    revalidate: 30,
  }
);

/**
 * Get cached recent activities
 */
export const getCachedRecentActivities = unstable_cache(
  async (userId: string, limit = 20, db: any) => {
    const { getRecentActivitiesOptimized } = await import('./queries');
    return await getRecentActivitiesOptimized(db, userId, limit);
  },
  ['recent-activities'],
  {
    tags: ['activities', 'user-data'],
    revalidate: 60,
  }
);

/**
 * Get cached active goals
 */
export const getCachedActiveGoals = unstable_cache(
  async (userId: string, limit = 10, db: any) => {
    const { getActiveGoalsOptimized } = await import('./queries');
    return await getActiveGoalsOptimized(db, userId, limit);
  },
  ['active-goals'],
  {
    tags: ['goals', 'user-data'],
    revalidate: 120,
  }
);

/**
 * Get cached user achievements
 */
export const getCachedUserAchievements = unstable_cache(
  async (userId: string, limit = 20, db: any) => {
    const { getUserAchievementsWithDetails } = await import('./queries');
    return await getUserAchievementsWithDetails(db, userId, limit);
  },
  ['user-achievements'],
  {
    tags: ['achievements', 'user-data'],
    revalidate: 300,
  }
);

// ============================================================================
// CACHE INVALIDATION HELPERS
// ============================================================================

/**
 * Invalidate all user-related caches
 */
export function invalidateUserCaches(userId: string) {
  // @ts-expect-error - revalidateTag expects string
  revalidateTag('user-data');
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`dimension-scores-${userId}`);
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`user-profile-${userId}`);
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`dashboard-${userId}`);
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`activities-${userId}`);
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`goals-${userId}`);
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`achievements-${userId}`);
}

/**
 * Invalidate dimension scores cache
 */
export function invalidateDimensionScores(userId: string) {
  // @ts-expect-error - revalidateTag expects string
  revalidateTag('dimension-scores');
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`dimension-scores-${userId}`);
}

/**
 * Invalidate dashboard cache
 */
export function invalidateDashboard(userId: string) {
  // @ts-expect-error - revalidateTag expects string
  revalidateTag('dashboard');
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`dashboard-stats-${userId}`);
}

/**
 * Invalidate activities cache
 */
export function invalidateActivities(userId: string) {
  // @ts-expect-error - revalidateTag expects string
  revalidateTag('activities');
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`recent-activities-${userId}`);
}

/**
 * Invalidate goals cache
 */
export function invalidateGoals(userId: string) {
  // @ts-expect-error - revalidateTag expects string
  revalidateTag('goals');
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`active-goals-${userId}`);
}

/**
 * Invalidate achievements cache
 */
export function invalidateAchievements(userId: string) {
  // @ts-expect-error - revalidateTag expects string
  revalidateTag('achievements');
  // @ts-expect-error - revalidateTag expects string
  revalidateTag(`user-achievements-${userId}`);
}

// ============================================================================
// MEMOIZATION HELPERS (For Client-Side)
// ============================================================================

/**
 * Create a memoized selector for React Query
 */
export function createMemoizedSelector<T>(
  key: string,
  selector: (data: any) => T
) {
  const cache: Map<string, { data: any; result: T }> = new Map();

  return (input: any): T => {
    const keyString = typeof input === 'object'
      ? JSON.stringify(input)
      : String(input);

    const cached = cache.get(keyString);
    if (cached) return cached.result;

    const result = selector(input);
    cache.set(keyString, { data: input, result });
    return result;
  };
}

// ============================================================================
// QUERY DEDUPLICATION
// ============================================================================

/**
 * Simple promise deduplication to prevent N+1 queries
 */
const promiseCache = new Map<string, Promise<any>>();

export async function dedupePromise<T>(
  key: string,
  factory: () => Promise<T>
): Promise<T> {
  const existing = promiseCache.get(key);
  if (existing) return existing;

  const promise = factory()
    .finally(() => {
      // Keep promise in cache briefly for deduplication
      setTimeout(() => promiseCache.delete(key), 100);
    });

  promiseCache.set(key, promise);
  return promise;
}

// ============================================================================
// CONNECTION POOL CONFIGURATION
// ============================================================================

/**
 * Supabase client configuration with optimized connection pooling
 */
export const supabaseConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-connection-pool': 'optimized',
    },
  },
};

/**
 * Get connection pool statistics (for monitoring)
 */
export async function getPoolStats(db: any) {
  return {
    totalConnections: db.$client?.pool?.totalCount || 'N/A',
    idleConnections: db.$client?.pool?.idleCount || 'N/A',
    waitingConnections: db.$client?.pool?.waitCount || 'N/A',
  };
}

// ============================================================================
// QUERY TIMEOUT CONFIGURATION
// ============================================================================

export const queryTimeouts = {
  read: 10000, // 10 seconds for read queries
  write: 30000, // 30 seconds for write queries
  analytics: 60000, // 60 seconds for analytics queries
};

/**
 * Execute query with timeout
 */
export async function queryWithTimeout<T>(
  db: any,
  query: () => Promise<T>,
  timeout: number = queryTimeouts.read
): Promise<T> {
  return Promise.race([
    query(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Query timeout after ${timeout}ms`)), timeout)
    ),
  ]);
}

// ============================================================================
// ERROR BOUNDARY FOR QUERIES
// ============================================================================

export interface QueryError {
  message: string;
  code?: string;
  stack?: string;
  timestamp: Date;
}

/**
 * Wrap query with error tracking
 */
export async function trackedQuery<T>(
  db: any,
  query: () => Promise<T>,
  queryName: string
): Promise<{ data: T | null; error: QueryError | null }> {
  try {
    const data = await query();
    return { data, error: null };
  } catch (err: any) {
    const error: QueryError = {
      message: err.message,
      code: err.code,
      stack: err.stack,
      timestamp: new Date(),
    };

    return { data: null, error };
  }
}