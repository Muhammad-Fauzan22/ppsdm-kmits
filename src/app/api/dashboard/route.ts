/**
 * Dashboard API Route
 * 
 * GET: Get dashboard summary data including:
 * - User stats (level, streak, XP)
 * - Current dimension scores
 * - Recent activities
 * - Active goals
 * - Recent achievements
 * 
 * Enhanced with Redis caching for improved performance
 */

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

import { NextResponse } from 'next/server'
import { createClient, requireAuth, handleSupabaseError } from '@/lib/supabase/server'
import { subDays, startOfDay } from 'date-fns'
import { 
  getCachedDashboardData, 
  setCachedDashboardData 
} from '@/lib/redis/dashboard-cache'

/**
 * Cached function to fetch dashboard data
 */
async function fetchDashboardData(userId: string) {
  const supabase = await createClient();
  
  // Fetch all dashboard data in parallel
  const [
    profileResult,
    scoresResult,
    activitiesResult,
    goalsResult,
    achievementsResult,
    assessmentsResult,
  ] = await Promise.all([
    // User profile
    supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single(),

    // Dimension scores
    supabase
      .from('dimension_scores')
      .select('*')
      .eq('user_id', userId)
      .single(),

    // Recent activities (last 10)
    supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10),

    // Active goals
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5),

    // Recent achievements
    supabase
      .from('user_achievements')
      .select(`
          *,
          achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(5),

    // Total assessments count
    supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  // Handle errors
  if (profileResult.error) {
    const { error: errMsg, status } = handleSupabaseError(profileResult.error);
    throw new Error(errMsg);
  }

  // Get completed goals count
  const { count: completedGoalsCount, error: completedGoalsError } = await supabase
    .from('goals')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'completed');

  if (completedGoalsError) {
    console.error('Error counting completed goals:', completedGoalsError);
  }

  // Get streak information
  const { data: streakData } = await supabase
    .from('activities')
    .select('created_at')
    .eq('user_id', userId)
    .eq('type', 'login')
    .order('created_at', { ascending: false })
    .limit(30);

  // Calculate streak
  const currentStreak = calculateStreak(streakData || []);

  // Get unread achievements count
  const { count: unreadAchievementsCount } = await supabase
    .from('user_achievements')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('viewed', false);

  // Calculate next level progress
  const totalXp = profileResult.data?.total_xp || 0;
  const currentLevel = profileResult.data?.level || 1;
  const nextLevelXp = Math.pow(currentLevel, 2) * 100;
  const prevLevelXp = Math.pow(currentLevel - 1, 2) * 100;
  const xpProgress = ((totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

  // Build dashboard response
  return {
    user: {
      id: userId,
      email: profileResult.data?.email || '',
      ...profileResult.data,
      current_streak: currentStreak,
    },
    stats: {
      level: currentLevel,
      totalXp,
      xpToNextLevel: nextLevelXp - totalXp,
      xpProgress: Math.round(xpProgress),
      currentStreak,
      totalAssessments: assessmentsResult.count || 0,
      completedGoals: completedGoalsCount || 0,
      activeGoalsCount: goalsResult.data?.length || 0,
      unreadAchievements: unreadAchievementsCount || 0,
      overallIndex: scoresResult.data?.overall_index || 0,
    },
    dimensionScores: scoresResult.data || {
      cognitive: 0,
      emotional: 0,
      spiritual: 0,
      physical: 0,
      creative: 0,
      professional: 0,
      leadership: 0,
      financial: 0,
      environmental: 0,
      overall_index: 0,
    },
    recentActivities: activitiesResult.data || [],
    activeGoals: goalsResult.data || [],
    recentAchievements: achievementsResult.data || [],
  };
}

/**
 * Calculate user streak based on consecutive days with activity
 */
function calculateStreak(activities: Array<{ created_at: string }>): number {
    if (activities.length === 0) return 0

    const today = startOfDay(new Date())
    const activityDates = new Set(
        activities.map((a) => startOfDay(new Date(a.created_at)).toISOString())
    )

    let streak = 0
    let checkDate = today

    // Check today first
    if (activityDates.has(checkDate.toISOString())) {
        streak++
    }

    // Check previous days
    while (true) {
        checkDate = subDays(checkDate, 1)
        if (activityDates.has(checkDate.toISOString())) {
            streak++
        } else {
            break
        }
    }

    return streak
}

/**
 * GET /api/dashboard
 * Get comprehensive dashboard data with Redis caching
 */
export async function GET() {
    try {
        const user = await requireAuth();
        
        // Try to get cached data first
        const cachedData = await getCachedDashboardData(user.id);
        if (cachedData) {
            return NextResponse.json({
                success: true,
                data: cachedData,
                cached: true,
            });
        }
        
        // Fetch fresh data if not cached
        const data = await fetchDashboardData(user.id);
        
        // Cache the data for future requests
        await setCachedDashboardData(user.id, data);

        return NextResponse.json({
            success: true,
            data,
            cached: false,
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }
        console.error('Error fetching dashboard:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
