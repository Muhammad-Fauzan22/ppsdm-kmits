/**
 * Hooks Index
 * 
 * Central export for all custom hooks
 */

// Data fetching hooks
export { useDashboard, useUserStats, useRecentActivities, useDashboardDimensions, useRecentAchievements } from './useDashboard';
export type { UseDashboardReturn } from './useDashboard';

export { useDimensions, useDimensionStats, formatDimensionScore, getDimensionColor, getDimensionStatus } from './useDimensions';
export type { UseDimensionsReturn } from './useDimensions';

export { useGoals, useGoalsByStatus, useActiveGoals, useCompletedGoals, calculateGoalProgress, isGoalOverdue, getDaysRemaining } from './useGoals';
export type { UseGoalsReturn, UseGoalsOptions } from './useGoals';

export { useProgress, calculateImprovement, getTrendDirection, formatChartData, getTimeRangeLabel, TIME_RANGE_OPTIONS } from './useProgress';
export type { UseProgressReturn } from './useProgress';

// Re-export types from API client
export type { 
  DimensionData, 
  GoalsListResponse, 
  ProgressData, 
  DashboardData 
} from '../api/client';

// Re-export types from DB schema
export type { 
  Goal, 
  GoalInput, 
  GoalUpdate, 
  Dimension,
  TimeRange,
  Activity,
  UserAchievement
} from '../db/schema';

// Existing hooks
export { useAuth } from './useAuth';
