/**
 * useDashboard Hook
 * 
 * Fetches and manages dashboard data with caching and revalidation
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardData, type DashboardData, ApiError, isAuthError, getErrorMessage } from '@/lib/api/client';

// Cache mechanism
const cache = new Map<string, { data: DashboardData; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export interface UseDashboardReturn {
  data: DashboardData | null;
  isLoading: boolean;
  isValidating: boolean;
  error: Error | null;
  errorMessage: string;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage dashboard data
 */
export function useDashboard(): UseDashboardReturn {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    if (!isBackground) {
      setIsLoading(true);
    } else {
      setIsValidating(true);
    }
    setError(null);

    try {
      // Check cache first
      const cached = cache.get('dashboard');
      if (cached && Date.now() - cached.timestamp < CACHE_TTL && !isBackground) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      const freshData = await getDashboardData();
      
      // Update cache
      cache.set('dashboard', { data: freshData, timestamp: Date.now() });
      setData(freshData);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      
      // Redirect to login if auth error
      if (isAuthError(err)) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [router]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Revalidate on focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData]);

  // Polling every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isValidating,
    error,
    errorMessage: error ? getErrorMessage(error) : '',
    refetch,
  };
}

/**
 * Hook to get user stats from dashboard data
 */
export function useUserStats() {
  const { data, ...rest } = useDashboard();

  return {
    stats: data?.stats,
    user: data?.user,
    ...rest,
  };
}

/**
 * Hook to get dimension scores from dashboard data
 */
export function useDashboardDimensions() {
  const { data, ...rest } = useDashboard();

  return {
    dimensionScores: data?.dimensionScores,
    ...rest,
  };
}

/**
 * Hook to get recent activities from dashboard data
 */
export function useRecentActivities() {
  const { data, ...rest } = useDashboard();

  return {
    activities: data?.recentActivities || [],
    ...rest,
  };
}

/**
 * Hook to get active goals from dashboard data
 */
export function useActiveGoals() {
  const { data, ...rest } = useDashboard();

  return {
    goals: data?.activeGoals || [],
    ...rest,
  };
}

/**
 * Hook to get achievements from dashboard data
 */
export function useRecentAchievements() {
  const { data, ...rest } = useDashboard();

  return {
    achievements: data?.recentAchievements || [],
    ...rest,
  };
}
