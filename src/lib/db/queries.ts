/**
 * PPSDM KMM - Optimized Database Queries
 * 
 * This file contains optimized query patterns for the database:
 * - N+1 query prevention with eager loading
 * - Specific column selection (no SELECT *)
 * - Cursor-based pagination
 * - Batch operations
 * - Redis caching for performance optimization
 * 
 * Created: 2026-02-05
 */

// Note: This file is designed to work with Supabase client, not Drizzle ORM
// The project uses Supabase for database operations

import { getCache, setCache, cacheKeys, CACHE_TTL } from '@/lib/redis/client';

// ============================================================================
// TYPE DEFINITIONS FOR OPTIMIZED QUERIES
// ============================================================================

export interface AssessmentSelect {
  id: string;
  userId: string;
  dimension: string;
  title: string;
  score: number | null;
  createdAt: Date | null;
}

export interface GoalSelect {
  id: string;
  userId: string;
  title: string;
  category: string;
  status: string;
  progress: number;
  priority: number;
  targetDate: Date | null;
  createdAt: Date | null;
}

export interface ActivitySelect {
  id: string;
  userId: string;
  type: string;
  title: string;
  xpEarned: number;
  createdAt: Date | null;
}

export interface DimensionScoreSelect {
  id: string;
  userId: string;
  cognitive: number;
  emotional: number;
  spiritual: number;
  physical: number;
  creative: number;
  professional: number;
  leadership: number;
  financial: number;
  environmental: number;
  overallIndex: number | null;
  createdAt: Date | null;
}

// ============================================================================
// ASSESSMENT QUERIES (Optimized)
// ============================================================================

/**
 * Get user assessments with pagination and specific columns
 * Avoids N+1 by fetching all data at once
 */
export async function getUserAssessmentsOptimized(
  db: any,
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    dimension?: string;
    orderBy?: 'createdAt' | 'score';
  }
) {
  const { 
    limit = 20, 
    offset = 0, 
    dimension,
    orderBy = 'createdAt' 
  } = options || {};

  let query = db
    .from('assessments')
    .select('id, user_id, dimension, title, score, max_score, completed_at, created_at')
    .eq('user_id', userId);

  if (dimension) {
    query = query.eq('dimension', dimension);
  }

  query = query
    .order(orderBy === 'createdAt' ? 'created_at' : 'score', { ascending: false })
    .limit(limit)
    .offset(offset);

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching user assessments:', error);
    return [];
  }

  // Transform data to match expected format
  return data.map((assessment: any) => ({
    id: assessment.id,
    userId: assessment.user_id,
    dimension: assessment.dimension,
    title: assessment.title,
    score: assessment.score,
    maxScore: assessment.max_score,
    completedAt: assessment.completed_at,
    createdAt: assessment.created_at,
  }));
}

// ============================================================================
// DIMENSION SCORES QUERIES (Optimized)
// ============================================================================

/**
 * Get dimension scores with specific columns and caching
 */
export async function getDimensionScoresOptimized(
  db: any,
  userId: string
) {
  // Check cache first
  const cacheKey = cacheKeys.assessmentResults(userId, 'dimensions');
  const cachedData = await getCache(cacheKey);
  
  if (cachedData) {
    console.log('Cache hit for dimension scores:', userId);
    return cachedData;
  }

  console.log('Cache miss for dimension scores:', userId);
  
  const { data, error } = await db
    .from('dimension_scores')
    .select('id, cognitive, emotional, spiritual, physical, creative, professional, leadership, financial, environmental, overall_index, updated_at')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    console.error('Error fetching dimension scores:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const result = {
    id: data[0].id,
    cognitive: data[0].cognitive,
    emotional: data[0].emotional,
    spiritual: data[0].spiritual,
    physical: data[0].physical,
    creative: data[0].creative,
    professional: data[0].professional,
    leadership: data[0].leadership,
    financial: data[0].financial,
    environmental: data[0].environmental,
    overallIndex: data[0].overall_index,
    updatedAt: data[0].updated_at,
  };

  // Cache the result for 7 days
  await setCache(cacheKey, result, CACHE_TTL.assessmentResults);

  return result;
}

// ============================================================================
// USER PROFILE QUERIES (Optimized)
// ============================================================================

/**
 * Get user profile with essential columns only and caching
 */
export async function getUserProfileOptimized(
  db: any,
  userId: string
) {
  // Check cache first
  const cacheKey = cacheKeys.user(userId);
  const cachedData = await getCache(cacheKey);
  
  if (cachedData) {
    console.log('Cache hit for user profile:', userId);
    return cachedData;
  }

  console.log('Cache miss for user profile:', userId);
  
  const { data, error } = await db
    .from('user_profiles')
    .select('id, full_name, nim, faculty, level, current_streak, total_xp')
    .eq('id', userId)
    .limit(1);

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const result = {
    id: data[0].id,
    fullName: data[0].full_name,
    nim: data[0].nim,
    faculty: data[0].faculty,
    level: data[0].level,
    currentStreak: data[0].current_streak,
    totalXp: data[0].total_xp,
  };

  // Cache the result for 1 hour
  await setCache(cacheKey, result, CACHE_TTL.long);

  return result;
}

// ============================================================================
// ACTIVITY QUERIES (Optimized)
// ============================================================================

/**
 * Get recent activities with pagination
 */
export async function getRecentActivitiesOptimized(
  db: any,
  userId: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await db
    .from('activities')
    .select('id, type, title, description, xp_earned, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    .offset(offset);

  if (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }

  return data.map((activity: any) => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    description: activity.description,
    xpEarned: activity.xp_earned,
    createdAt: activity.created_at,
  }));
}

/**
 * Get active goals for user with priority sorting
 */
export async function getActiveGoalsOptimized(
  db: any,
  userId: string,
  limit = 10
) {
  const { data, error } = await db
    .from('goals')
    .select('id, user_id, title, category, status, progress, priority, target_date, created_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('priority', { ascending: false })
    .order('target_date', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching active goals:', error);
    return [];
  }

  return data.map((goal: any) => ({
    id: goal.id,
    userId: goal.user_id,
    title: goal.title,
    category: goal.category,
    status: goal.status,
    progress: goal.progress,
    priority: goal.priority,
    targetDate: goal.target_date,
    createdAt: goal.created_at,
  }));
}

// ============================================================================
// ACHIEVEMENT QUERIES (Optimized)
// ============================================================================

/**
 * Get user achievements with achievement details
 */
export async function getUserAchievementsWithDetails(
  db: any,
  userId: string,
  limit = 20,
  offset = 0
) {
  const { data, error } = await db
    .from('user_achievements')
    .select(`
      id,
      achievement_id,
      unlocked_at,
      viewed,
      achievements (
        id,
        code,
        name,
        description,
        rarity,
        xp_reward
      )
    `)
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: false })
    .limit(limit)
    .offset(offset);

  if (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }

  return data.map((userAchievement: any) => ({
    id: userAchievement.id,
    unlockedAt: userAchievement.unlocked_at,
    viewed: userAchievement.viewed,
    achievement: userAchievement.achievements ? {
      id: userAchievement.achievements.id,
      code: userAchievement.achievements.code,
      name: userAchievement.achievements.name,
      description: userAchievement.achievements.description,
      rarity: userAchievement.achievements.rarity,
      xpReward: userAchievement.achievements.xp_reward,
    } : null,
  }));
}

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

/**
 * Get dashboard summary stats in single query with caching
 */
export async function getDashboardStats(
  db: any,
  userId: string
) {
  // Check cache first
  const cacheKey = cacheKeys.dashboard(userId);
  const cachedData = await getCache(cacheKey);
  
  if (cachedData) {
    console.log('Cache hit for dashboard stats:', userId);
    return cachedData;
  }

  console.log('Cache miss for dashboard stats:', userId);
  
  const [profile, scores, goalsSummary, activitiesSummary] = await Promise.all([
    getUserProfileOptimized(db, userId),
    getDimensionScoresOptimized(db, userId),
    getGoalsSummary(db, userId),
    getActivityCountsByType(db, userId),
  ]);

  const totalXpEarned = activitiesSummary.reduce(
    (sum, a) => sum + (a.totalXp || 0),
    0
  );

  const result = {
    profile,
    dimensionScores: scores,
    goals: goalsSummary,
    totalXpEarned,
    recentActivityCount: activitiesSummary.length,
  };

  // Cache the result for 5 minutes
  await setCache(cacheKey, result, CACHE_TTL.medium);

  return result;
}

// Helper function to get goals summary (simplified for Supabase)
async function getGoalsSummary(db: any, userId: string) {
  const { data, error } = await db
    .from('goals')
    .select('status, progress');

  if (error) {
    console.error('Error fetching goals summary:', error);
    return { total: 0, active: 0, completed: 0, avgProgress: 0 };
  }

  const total = data.length;
  const active = data.filter((g: any) => g.status === 'active').length;
  const completed = data.filter((g: any) => g.status === 'completed').length;
  const avgProgress = total > 0 
    ? Math.round(data.reduce((sum: number, g: any) => sum + g.progress, 0) / total)
    : 0;

  return { total, active, completed, avgProgress };
}

// Helper function to get activity counts by type (simplified for Supabase)
async function getActivityCountsByType(db: any, userId: string, since?: Date) {
  let query = db
    .from('activities')
    .select('type, xp_earned')
    .eq('user_id', userId);

  if (since) {
    query = query.gte('created_at', since.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching activity counts:', error);
    return [];
  }

  const counts: any[] = [];
  const typeMap = new Map();

  data.forEach((activity: any) => {
    if (!typeMap.has(activity.type)) {
      typeMap.set(activity.type, { type: activity.type, count: 0, totalXp: 0 });
      counts.push(typeMap.get(activity.type));
    }
    typeMap.get(activity.type).count++;
    typeMap.get(activity.type).totalXp += activity.xp_earned || 0;
  });

  return counts;
}
