/**
 * PPSDM KMM 9 Dimensions System - Database Schema Types and Zod Schemas
 * 
 * This file contains TypeScript types and Zod validation schemas for:
 * - UserProfiles (extends auth.users)
 * - DimensionScores (9 dimensions scores per user)
 * - Assessments (assessment sessions)
 * - Goals (user goals with milestones)
 * - Activities (user activity log)
 * - Achievements (badge system)
 */

import { z } from 'zod';

// ============================================================================
// ENUMS AND CONSTANTS
// ============================================================================

export const DIMENSIONS = [
  'cognitive',
  'emotional',
  'spiritual',
  'physical',
  'creative',
  'professional',
  'leadership',
  'financial',
  'environmental',
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const GOAL_STATUS = ['active', 'completed', 'archived', 'cancelled'] as const;
export type GoalStatus = (typeof GOAL_STATUS)[number];

export const GOAL_CATEGORIES = [
  'cognitive',
  'emotional',
  'spiritual',
  'physical',
  'creative',
  'professional',
  'leadership',
  'financial',
  'environmental',
  'holistic',
] as const;
export type GoalCategory = (typeof GOAL_CATEGORIES)[number];

export const ACTIVITY_TYPES = [
  'assessment_completed',
  'goal_created',
  'goal_updated',
  'goal_completed',
  'milestone_reached',
  'achievement_unlocked',
  'level_up',
  'streak_updated',
  'resource_accessed',
  'course_completed',
  'login',
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const ACHIEVEMENT_RARITY = ['common', 'rare', 'epic', 'legendary'] as const;
export type AchievementRarity = (typeof ACHIEVEMENT_RARITY)[number];

export const TIME_RANGES = ['3m', '6m', '1y', 'all'] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

// ============================================================================
// ZOD SCHEMAS - DIMENSION SCORES
// ============================================================================

export const dimensionScoreSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  cognitive: z.number().int().min(0).max(100),
  emotional: z.number().int().min(0).max(100),
  spiritual: z.number().int().min(0).max(100),
  physical: z.number().int().min(0).max(100),
  creative: z.number().int().min(0).max(100),
  professional: z.number().int().min(0).max(100),
  leadership: z.number().int().min(0).max(100),
  financial: z.number().int().min(0).max(100),
  environmental: z.number().int().min(0).max(100),
  overall_index: z.number().int().min(0).max(100).optional(),
  created_at: z.string().datetime().optional(),
});

export const dimensionScoreInputSchema = dimensionScoreSchema.omit({
  id: true,
  user_id: true,
  overall_index: true,
  created_at: true,
});

// ============================================================================
// ZOD SCHEMAS - USER PROFILES
// ============================================================================

export const milestoneSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  target_date: z.string().datetime().optional(),
  completed: z.boolean().default(false),
  completed_at: z.string().datetime().optional(),
  order_index: z.number().int().default(0),
});

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1).max(100).optional().nullable(),
  nim: z.string().regex(/^[0-9]{9,12}$/).optional().nullable(),
  faculty: z.string().max(100).optional().nullable(),
  study_program: z.string().max(100).optional().nullable(),
  level: z.number().int().min(1).default(1),
  current_streak: z.number().int().min(0).default(0),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const userProfileInputSchema = userProfileSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// ============================================================================
// ZOD SCHEMAS - ASSESSMENTS
// ============================================================================

export const assessmentSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  dimension: z.enum(DIMENSIONS),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  score: z.number().int().min(0).max(100),
  max_score: z.number().int().default(100),
  responses: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  started_at: z.string().datetime(),
  completed_at: z.string().datetime().optional(),
  duration_seconds: z.number().int().min(0).optional(),
  created_at: z.string().datetime().optional(),
});

export const assessmentInputSchema = assessmentSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

// ============================================================================
// ZOD SCHEMAS - GOALS
// ============================================================================

export const goalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(GOAL_CATEGORIES),
  target_dimension: z.enum(DIMENSIONS).optional(),
  status: z.enum(GOAL_STATUS).default('active'),
  progress: z.number().int().min(0).max(100).default(0),
  priority: z.number().int().min(1).max(5).default(3),
  target_date: z.string().datetime().optional(),
  milestones: z.array(milestoneSchema).default([]),
  completed_at: z.string().datetime().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const goalInputSchema = goalSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
  completed_at: true,
});

export const goalUpdateSchema = goalSchema.partial().omit({
  id: true,
  user_id: true,
  created_at: true,
});

// ============================================================================
// ZOD SCHEMAS - ACTIVITIES
// ============================================================================

export const activitySchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.enum(ACTIVITY_TYPES),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  xp_earned: z.number().int().min(0).default(0),
  related_entity_type: z.string().max(50).optional(),
  related_entity_id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
});

export const activityInputSchema = activitySchema.omit({
  id: true,
  user_id: true,
  created_at: true,
});

// ============================================================================
// ZOD SCHEMAS - ACHIEVEMENTS
// ============================================================================

export const achievementSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  icon_url: z.string().url().optional(),
  rarity: z.enum(ACHIEVEMENT_RARITY).default('common'),
  xp_reward: z.number().int().min(0).default(0),
  criteria: z.record(z.string(), z.unknown()),
  created_at: z.string().datetime().optional(),
});

export const userAchievementSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  achievement_id: z.string().uuid(),
  unlocked_at: z.string().datetime(),
  viewed: z.boolean().default(false),
});

// ============================================================================
// ZOD SCHEMAS - API REQUESTS/RESPONSES
// ============================================================================

export const progressQuerySchema = z.object({
  timeRange: z.enum(TIME_RANGES).default('6m'),
});

export const dashboardSummarySchema = z.object({
  user: userProfileSchema,
  dimensionScores: dimensionScoreSchema,
  recentActivities: z.array(activitySchema),
  activeGoals: z.array(goalSchema),
  achievements: z.array(userAchievementSchema),
  stats: z.object({
    totalAssessments: z.number().int(),
    completedGoals: z.number().int(),
    currentStreak: z.number().int(),
    level: z.number().int(),
    overallIndex: z.number().int(),
  }),
});

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type DimensionScore = z.infer<typeof dimensionScoreSchema>;
export type DimensionScoreInput = z.infer<typeof dimensionScoreInputSchema>;

export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserProfileInput = z.infer<typeof userProfileInputSchema>;

export type Assessment = z.infer<typeof assessmentSchema>;
export type AssessmentInput = z.infer<typeof assessmentInputSchema>;

export type Milestone = z.infer<typeof milestoneSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type GoalInput = z.infer<typeof goalInputSchema>;
export type GoalUpdate = z.infer<typeof goalUpdateSchema>;

export type Activity = z.infer<typeof activitySchema>;
export type ActivityInput = z.infer<typeof activityInputSchema>;

export type Achievement = z.infer<typeof achievementSchema>;
export type UserAchievement = z.infer<typeof userAchievementSchema>;

export type DashboardSummary = z.infer<typeof dashboardSummarySchema>;
export type ProgressQuery = z.infer<typeof progressQuerySchema>;

// ============================================================================
// DATABASE TABLE NAMES (for type-safe queries)
// ============================================================================

export const TABLES = {
  USER_PROFILES: 'user_profiles',
  DIMENSION_SCORES: 'dimension_scores',
  ASSESSMENTS: 'assessments',
  GOALS: 'goals',
  ACTIVITIES: 'activities',
  ACHIEVEMENTS: 'achievements',
  USER_ACHIEVEMENTS: 'user_achievements',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate overall index from dimension scores
 */
export function calculateOverallIndex(scores: Omit<DimensionScoreInput, keyof { id: string; user_id: string; created_at: string }>): number {
  const values = [
    scores.cognitive,
    scores.emotional,
    scores.spiritual,
    scores.physical,
    scores.creative,
    scores.professional,
    scores.leadership,
    scores.financial,
    scores.environmental,
  ];
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

/**
 * Get dimension name in Indonesian
 */
export function getDimensionName(dimension: Dimension): string {
  const names: Record<Dimension, string> = {
    cognitive: 'Kognitif',
    emotional: 'Emosional',
    spiritual: 'Spiritual',
    physical: 'Fisik',
    creative: 'Kreatif',
    professional: 'Profesional',
    leadership: 'Kepemimpinan',
    financial: 'Finansial',
    environmental: 'Lingkungan',
  };
  return names[dimension];
}

/**
 * Get dimension color for UI
 */
export function getDimensionColor(dimension: Dimension): string {
  const colors: Record<Dimension, string> = {
    cognitive: '#3B82F6',    // Blue
    emotional: '#EC4899',    // Pink
    spiritual: '#8B5CF6',    // Purple
    physical: '#EF4444',     // Red
    creative: '#F59E0B',     // Amber
    professional: '#10B981', // Emerald
    leadership: '#6366F1',   // Indigo
    financial: '#14B8A6',    // Teal
    environmental: '#22C55E', // Green
  };
  return colors[dimension];
}

/**
 * Validate milestone completion
 */
export function validateMilestones(milestones: Milestone[]): { valid: boolean; error?: string } {
  // Check for duplicate IDs
  const ids = milestones.map(m => m.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    return { valid: false, error: 'Duplicate milestone IDs found' };
  }

  // Check for duplicate order indices
  const orders = milestones.map(m => m.order_index);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    return { valid: false, error: 'Duplicate milestone order indices found' };
  }

  return { valid: true };
}

/**
 * Create a new milestone
 */
export function createMilestone(
  title: string,
  options?: Partial<Omit<Milestone, 'id' | 'title'>>
): Milestone {
  return {
    id: crypto.randomUUID(),
    title,
    description: options?.description,
    target_date: options?.target_date,
    completed: options?.completed ?? false,
    completed_at: options?.completed_at,
    order_index: options?.order_index ?? 0,
  };
}

// Default export for convenience
export default {
  DIMENSIONS,
  GOAL_STATUS,
  GOAL_CATEGORIES,
  ACTIVITY_TYPES,
  ACHIEVEMENT_RARITY,
  TIME_RANGES,
  TABLES,
  calculateOverallIndex,
  getDimensionName,
  getDimensionColor,
  validateMilestones,
  createMilestone,
};
