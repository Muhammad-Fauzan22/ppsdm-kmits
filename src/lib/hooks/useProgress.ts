/**
 * useProgress Hook
 * 
 * Fetches and manages progress history data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getProgress,
  type ProgressData,
  isAuthError, 
  getErrorMessage 
} from '@/lib/api/client';
import type { TimeRange, Dimension } from '@/lib/db/schema';

// Cache mechanism
const cache = new Map<string, { data: ProgressData; timestamp: number }>();
const CACHE_TTL = 60000; // 60 seconds

export interface UseProgressReturn {
  data: ProgressData | null;
  isLoading: boolean;
  error: Error | null;
  errorMessage: string;
  refetch: () => Promise<void>;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
}

/**
 * Hook to fetch and manage progress history
 */
export function useProgress(initialTimeRange: TimeRange = '6m'): UseProgressReturn {
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = `progress-${timeRange}`;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      const freshData = await getProgress(timeRange);
      
      // Update cache
      cache.set(cacheKey, { data: freshData, timestamp: Date.now() });
      setData(freshData);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      
      if (isAuthError(err)) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, timeRange]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

  return {
    data,
    isLoading,
    error,
    errorMessage: error ? getErrorMessage(error) : '',
    refetch,
    timeRange,
    setTimeRange: handleTimeRangeChange,
  };
}

/**
 * Calculate improvement from progress data
 */
export function calculateImprovement(
  progressData: ProgressData | null,
  dimension: Dimension
): number {
  if (!progressData || !progressData.datasets[dimension]) return 0;
  
  const values = progressData.datasets[dimension];
  if (values.length < 2) return 0;
  
  const first = values[0];
  const last = values[values.length - 1];
  
  if (first === 0) return 0;
  
  return Math.round(((last - first) / first) * 100);
}

/**
 * Get trend direction
 */
export function getTrendDirection(improvement: number): 'up' | 'down' | 'stable' {
  if (improvement > 5) return 'up';
  if (improvement < -5) return 'down';
  return 'stable';
}

/**
 * Format progress data for charts
 */
export function formatChartData(progressData: ProgressData | null) {
  if (!progressData) return { labels: [], datasets: [] };

  const dimensionColors: Record<Dimension, string> = {
    cognitive: '#3b82f6',      // blue
    emotional: '#ec4899',      // pink
    spiritual: '#8b5cf6',      // violet
    physical: '#22c55e',       // green
    creative: '#f59e0b',       // amber
    professional: '#0ea5e9',   // sky
    leadership: '#ef4444',     // red
    financial: '#10b981',      // emerald
    environmental: '#84cc16',  // lime
  };

  const datasets = Object.entries(progressData.datasets).map(([dimension, scores]) => ({
    label: dimension.charAt(0).toUpperCase() + dimension.slice(1),
    data: scores,
    borderColor: dimensionColors[dimension as Dimension],
    backgroundColor: dimensionColors[dimension as Dimension] + '20', // 20% opacity
    tension: 0.4,
  }));

  return {
    labels: progressData.labels,
    datasets,
  };
}

/**
 * Get time range label
 */
export function getTimeRangeLabel(timeRange: TimeRange): string {
  switch (timeRange) {
    case '3m':
      return 'Last 3 Months';
    case '6m':
      return 'Last 6 Months';
    case '1y':
      return 'Last Year';
    case 'all':
      return 'All Time';
    default:
      return 'Last 6 Months';
  }
}

/**
 * Time range options for UI
 */
export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: 'all', label: 'All Time' },
];
