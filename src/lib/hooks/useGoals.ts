/**
 * useGoals Hook
 * 
 * Fetches and manages goals data with CRUD operations
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getGoals, 
  createGoal as apiCreateGoal,
  updateGoal as apiUpdateGoal,
  deleteGoal as apiDeleteGoal,
  updateGoalProgress as apiUpdateProgress,
  type GoalsListResponse,
  isAuthError, 
  getErrorMessage 
} from '@/lib/api/client';
import type { Goal, GoalInput, GoalUpdate } from '@/lib/db/schema';

// Cache mechanism
const cache = new Map<string, { data: GoalsListResponse; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export interface UseGoalsOptions {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface UseGoalsReturn {
  goals: Goal[];
  totalCount: number;
  isLoading: boolean;
  isMutating: boolean;
  error: Error | null;
  errorMessage: string;
  refetch: () => Promise<void>;
  createGoal: (goalData: GoalInput) => Promise<Goal>;
  updateGoal: (goalId: string, updates: GoalUpdate) => Promise<Goal>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateProgress: (goalId: string, progress: number) => Promise<Goal>;
  toggleMilestone: (goalId: string, milestoneId: string, completed: boolean) => Promise<Goal>;
}

/**
 * Hook to fetch and manage goals
 */
export function useGoals(options: UseGoalsOptions = {}): UseGoalsReturn {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cacheKey = `goals-${JSON.stringify(options)}`;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setGoals(cached.data.goals);
        setTotalCount(cached.data.meta.total);
        setIsLoading(false);
        return;
      }

      const response = await getGoals(options);
      
      // Update cache
      cache.set(cacheKey, { data: response, timestamp: Date.now() });
      setGoals(response.goals);
      setTotalCount(response.meta.total);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      
      if (isAuthError(err)) {
        router.push('/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, options]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const createGoal = useCallback(async (goalData: GoalInput) => {
    setIsMutating(true);
    try {
      const newGoal = await apiCreateGoal(goalData);
      
      // Update local state
      setGoals(prev => [newGoal, ...prev]);
      setTotalCount(prev => prev + 1);
      
      // Invalidate cache
      cache.clear();
      
      return newGoal;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateGoal = useCallback(async (goalId: string, updates: GoalUpdate) => {
    setIsMutating(true);
    try {
      const updatedGoal = await apiUpdateGoal(goalId, updates);
      
      // Update local state
      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? updatedGoal : goal)
      );
      
      // Invalidate cache
      cache.clear();
      
      return updatedGoal;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteGoal = useCallback(async (goalId: string) => {
    setIsMutating(true);
    try {
      await apiDeleteGoal(goalId);
      
      // Update local state
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      setTotalCount(prev => Math.max(0, prev - 1));
      
      // Invalidate cache
      cache.clear();
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateProgress = useCallback(async (goalId: string, progress: number) => {
    setIsMutating(true);
    try {
      const updatedGoal = await apiUpdateProgress(goalId, progress);
      
      // Update local state
      setGoals(prev => 
        prev.map(goal => goal.id === goalId ? updatedGoal : goal)
      );
      
      // Invalidate cache
      cache.clear();
      
      return updatedGoal;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const toggleMilestone = useCallback(async (
    goalId: string, 
    milestoneId: string, 
    completed: boolean
  ) => {
    setIsMutating(true);
    try {
      // For now, use updateGoal to update milestones
      // This should be enhanced when the API is ready
      const goal = goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');

      const updatedMilestones = goal.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed } : m
      );

      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

      const updatedGoal = await updateGoal(goalId, {
        milestones: updatedMilestones,
        progress: newProgress,
      });

      // Update local state
      setGoals(prev => 
        prev.map(g => g.id === goalId ? updatedGoal : g)
      );

      return updatedGoal;
    } finally {
      setIsMutating(false);
    }
  }, [goals, updateGoal]);

  return {
    goals,
    totalCount,
    isLoading,
    isMutating,
    error,
    errorMessage: error ? getErrorMessage(error) : '',
    refetch,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    toggleMilestone,
  };
}

/**
 * Hook to get goals by status
 */
export function useGoalsByStatus(status: string) {
  return useGoals({ status });
}

/**
 * Hook to get active goals only
 */
export function useActiveGoals() {
  return useGoals({ status: 'active' });
}

/**
 * Hook to get completed goals only
 */
export function useCompletedGoals() {
  return useGoals({ status: 'completed' });
}

/**
 * Calculate goal progress percentage
 */
export function calculateGoalProgress(milestones: Goal['milestones']): number {
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter(m => m.completed).length;
  return Math.round((completed / milestones.length) * 100);
}

/**
 * Check if goal is overdue
 */
export function isGoalOverdue(goal: Goal): boolean {
  if (!goal.target_date || goal.status === 'completed') return false;
  return new Date(goal.target_date) < new Date();
}

/**
 * Get days remaining until goal target date
 */
export function getDaysRemaining(targetDate: string | undefined): number | null {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
