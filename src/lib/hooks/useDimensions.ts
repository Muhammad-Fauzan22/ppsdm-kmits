/**
 * useDimensions Hook
 * 
 * Fetches and manages dimension scores data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getDimensionScores, 
  submitDimensionScores,
  type DimensionData,
  isAuthError, 
  getErrorMessage 
} from '@/lib/api/client';
import type { DimensionScore } from '@/lib/db/schema';

// Cache mechanism
const cache = new Map<string, { data: DimensionData; timestamp: number }>();
const CACHE_TTL = 60000; // 60 seconds

export interface UseDimensionsReturn {
  data: DimensionData | null;
  isLoading: boolean;
  error: Error | null;
  errorMessage: string;
  refetch: () => Promise<void>;
  submitScores: (scores: Partial<DimensionData>) => Promise<DimensionData>;
}

/**
 * Hook to fetch and manage dimension scores
 */
export function useDimensions(): UseDimensionsReturn {
  const router = useRouter();
  const [data, setData] = useState<DimensionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = cache.get('dimensions');
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setData(cached.data);
        setIsLoading(false);
        return;
      }

      const freshData = await getDimensionScores();
      
      // Update cache
      cache.set('dimensions', { data: freshData, timestamp: Date.now() });
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
  }, [router]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const submitScores = useCallback(async (scores: Partial<DimensionData>) => {
    const result = await submitDimensionScores(scores);
    
    // Update cache and state with new scores
    cache.set('dimensions', { data: result, timestamp: Date.now() });
    setData(result);
    
    return result;
  }, []);

  return {
    data,
    isLoading,
    error,
    errorMessage: error ? getErrorMessage(error) : '',
    refetch,
    submitScores,
  };
}

/**
 * Get dimension statistics
 */
export function useDimensionStats(dimensions: DimensionData | null) {
  return {
    get stats() {
      if (!dimensions) return null;

      const scores = [
        { name: 'Cognitive', score: dimensions.cognitive, category: 'hard' },
        { name: 'Emotional', score: dimensions.emotional, category: 'soft' },
        { name: 'Spiritual', score: dimensions.spiritual, category: 'soft' },
        { name: 'Physical', score: dimensions.physical, category: 'hard' },
        { name: 'Creative', score: dimensions.creative, category: 'soft' },
        { name: 'Professional', score: dimensions.professional, category: 'hard' },
        { name: 'Leadership', score: dimensions.leadership, category: 'soft' },
        { name: 'Financial', score: dimensions.financial, category: 'hard' },
        { name: 'Environmental', score: dimensions.environmental, category: 'hard' },
      ];

      const sorted = [...scores].sort((a, b) => b.score - a.score);
      const hardSkills = scores.filter(d => d.category === 'hard');
      const softSkills = scores.filter(d => d.category === 'soft');

      const avgScore = Math.round(scores.reduce((sum, d) => sum + d.score, 0) / scores.length);
      const hardAvg = Math.round(hardSkills.reduce((sum, d) => sum + d.score, 0) / hardSkills.length) || 0;
      const softAvg = Math.round(softSkills.reduce((sum, d) => sum + d.score, 0) / softSkills.length) || 0;

      return {
        avgScore,
        strongest: sorted[0],
        weakest: sorted[sorted.length - 1],
        hardAvg,
        softAvg,
        hardCount: hardSkills.length,
        softCount: softSkills.length,
        allDimensions: scores,
      };
    }
  };
}

/**
 * Format dimension score for display
 */
export function formatDimensionScore(score: number): string {
  return `${Math.round(score)}/100`;
}

/**
 * Get dimension color based on score
 */
export function getDimensionColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-blue-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

/**
 * Get dimension status label
 */
export function getDimensionStatus(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Developing';
  return 'Needs Attention';
}
