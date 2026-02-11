import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '@/lib/auth-cookies';
import { logger } from '@/lib/logger';
import { z } from 'zod';

/**
 * Performance Analytics API
 * Tracks and analyzes user performance metrics
 */

// Validation schema for performance tracking
const performanceSchema = z.object({
  userId: z.string().uuid().optional(),
  timeframe: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('month'),
  dimension: z.enum(['all', 'cognitive', 'emotional', 'social', 'physical', 'spiritual', 'character', 'financial', 'selfManagement']).default('all'),
});

/**
 * GET /api/performance
 * Get performance analytics for a user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const params = performanceSchema.parse({
      userId: searchParams.get('userId') || undefined,
      timeframe: searchParams.get('timeframe') || 'month',
      dimension: searchParams.get('dimension') || 'all',
    });

    // Use authenticated user's ID if not provided or if trying to access other user's data
    const targetUserId = params.userId && user.userId === params.userId ? params.userId : user.userId;

    const supabase = await createClient();

    // Calculate date range based on timeframe
    const endDate = new Date();
    const startDate = new Date();
    switch (params.timeframe) {
      case 'day':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // Fetch assessments for the user within timeframe
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select(`
        id,
        created_at,
        status,
        assessment_results!inner(
          dimension_id,
          raw_score,
          normalized_score,
          percentile_rank
        ),
        dimensions!inner(
          id,
          name,
          category
        )
      `)
      .eq('user_id', targetUserId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (assessmentsError) {
      logger.error('Error fetching assessments', { error: assessmentsError, userId: targetUserId });
      return NextResponse.json(
        { error: 'Failed to fetch performance data' },
        { status: 500 }
      );
    }

    // Fetch weekly plans completion data
    const { data: weeklyPlans, error: plansError } = await supabase
      .from('weekly_plans')
      .select(`
        id,
        week_start,
        week_end,
        status,
        completed_at,
        weekly_plan_activities(
          id,
          completed,
          completed_at
        )
      `)
      .eq('user_id', targetUserId)
      .gte('week_start', startDate.toISOString())
      .lte('week_end', endDate.toISOString())
      .order('week_start', { ascending: false });

    if (plansError) {
      logger.error('Error fetching weekly plans', { error: plansError, userId: targetUserId });
    }

    // Calculate performance metrics
    const metrics = calculatePerformanceMetrics(assessments || [], weeklyPlans || [], params.dimension);

    // Calculate trends
    const trends = calculateTrends(assessments || []);

    // Calculate completion rates
    const completionStats = calculateCompletionStats(weeklyPlans || []);

    logger.info('Performance data fetched', {
      userId: targetUserId,
      timeframe: params.timeframe,
      dimension: params.dimension,
      assessmentsCount: assessments?.length || 0,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: targetUserId,
        timeframe: params.timeframe,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        metrics,
        trends,
        completionStats,
        assessments: assessments?.slice(0, 10) || [], // Limit to recent 10
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (error) {
    logger.error('Error in performance API', { error });
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/performance/track
 * Track a performance metric
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const supabase = await createClient();

    // Log performance tracking event
    const { error: logError } = await supabase
      .from('performance_logs')
      .insert({
        user_id: user.userId,
        event_type: body.eventType,
        event_data: body.data,
        session_id: body.sessionId,
        metadata: {
          userAgent: request.headers.get('user-agent'),
          timestamp: new Date().toISOString(),
        },
      });

    if (logError) {
      logger.error('Error logging performance', { error: logError });
      return NextResponse.json(
        { error: 'Failed to track performance' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Performance tracked successfully',
    });

  } catch (error) {
    logger.error('Error tracking performance', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Calculate performance metrics from assessments
 */
function calculatePerformanceMetrics(
  assessments: any[],
  weeklyPlans: any[],
  dimensionFilter: string
): any {
  const dimensionScores: Record<string, number[]> = {};
  const dimensionPercentiles: Record<string, number[]> = {};

  assessments.forEach((assessment: any) => {
    assessment.assessment_results?.forEach((result: any) => {
      const dimName = result.dimensions?.name?.toLowerCase() || 'unknown';
      
      // Apply dimension filter
      if (dimensionFilter !== 'all' && dimName !== dimensionFilter.toLowerCase()) {
        return;
      }

      if (!dimensionScores[dimName]) {
        dimensionScores[dimName] = [];
        dimensionPercentiles[dimName] = [];
      }

      dimensionScores[dimName].push(result.normalized_score || 0);
      dimensionPercentiles[dimName].push(result.percentile_rank || 0);
    });
  });

  // Calculate averages
  const dimensionAverages: Record<string, any> = {};
  Object.keys(dimensionScores).forEach(dim => {
    const scores = dimensionScores[dim];
    const percentiles = dimensionPercentiles[dim];
    
    dimensionAverages[dim] = {
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      averagePercentile: percentiles.reduce((a, b) => a + b, 0) / percentiles.length,
      count: scores.length,
      latestScore: scores[scores.length - 1],
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
    };
  });

  // Calculate overall score
  const allScores = Object.values(dimensionScores).flat();
  const overallScore = allScores.length > 0
    ? allScores.reduce((a, b) => a + b, 0) / allScores.length
    : 0;

  return {
    overallScore: Math.round(overallScore * 10) / 10,
    totalAssessments: assessments.length,
    dimensionBreakdown: dimensionAverages,
  };
}

/**
 * Calculate trends from assessments
 */
function calculateTrends(assessments: any[]): any {
  if (assessments.length < 2) {
    return {
      direction: 'stable',
      change: 0,
      message: 'Not enough data for trend analysis',
    };
  }

  // Sort by date
  const sorted = [...assessments].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Calculate overall trend
  const firstScores: number[] = [];
  const lastScores: number[] = [];

  sorted[0].assessment_results?.forEach((result: any) => {
    firstScores.push(result.normalized_score || 0);
  });

  sorted[sorted.length - 1].assessment_results?.forEach((result: any) => {
    lastScores.push(result.normalized_score || 0);
  });

  const firstAvg = firstScores.reduce((a, b) => a + b, 0) / firstScores.length || 0;
  const lastAvg = lastScores.reduce((a, b) => a + b, 0) / lastScores.length || 0;

  const change = lastAvg - firstAvg;
  const percentChange = firstAvg > 0 ? (change / firstAvg) * 100 : 0;

  let direction = 'stable';
  let message = 'Performansi stabil';

  if (change > 5) {
    direction = 'improving';
    message = 'Performansi meningkat dengan baik';
  } else if (change < -5) {
    direction = 'declining';
    message = 'Performansi menurun, perlu perhatian';
  }

  return {
    direction,
    change: Math.round(change * 10) / 10,
    percentChange: Math.round(percentChange * 10) / 10,
    message,
    assessmentsCompared: sorted.length,
  };
}

/**
 * Calculate completion statistics from weekly plans
 */
function calculateCompletionStats(weeklyPlans: any[]): any {
  if (weeklyPlans.length === 0) {
    return {
      totalPlans: 0,
      completedPlans: 0,
      completionRate: 0,
      averageActivitiesPerWeek: 0,
    };
  }

  let totalActivities = 0;
  let completedActivities = 0;
  let completedPlans = 0;

  weeklyPlans.forEach((plan: any) => {
    if (plan.status === 'completed') {
      completedPlans++;
    }

    plan.weekly_plan_activities?.forEach((activity: any) => {
      totalActivities++;
      if (activity.completed) {
        completedActivities++;
      }
    });
  });

  return {
    totalPlans: weeklyPlans.length,
    completedPlans,
    completionRate: Math.round((completedPlans / weeklyPlans.length) * 100),
    totalActivities,
    completedActivities,
    activityCompletionRate: totalActivities > 0 
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0,
    averageActivitiesPerWeek: Math.round((totalActivities / weeklyPlans.length) * 10) / 10,
  };
}
