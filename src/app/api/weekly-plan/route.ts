import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-cookies';
import { z } from 'zod';

// Validation schema
const generatePlanSchema = z.object({
  focusAreas: z.array(z.number()).min(1).max(3),
  intensity: z.enum(['light', 'moderate', 'intensive']).default('moderate')
});

interface WeeklyActivity {
  day: string;
  activities: string[];
  focus: string;
  duration: string;
}

interface WeeklyPlan {
  week: number;
  startDate: string;
  endDate: string;
  goals: string[];
  schedule: WeeklyActivity[];
  recommendations: string[];
}

/**
 * GET /api/weekly-plan
 * Get current week's plan based on user assessment scores
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth();
    const userId = session.userId;

    const supabase = await createClient();

    // Get user's latest assessment scores
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (id, name, description)
      `)
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (assessmentError) {
      return NextResponse.json(
        { error: 'Failed to fetch assessment data' },
        { status: 500 }
      );
    }

    // Get user's current weekly plan
    const { data: existingPlan, error: planError } = await supabase
      .from('weekly_plans')
      .select('*')
      .eq('user_id', userId)
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (planError && planError.code !== 'PGRST116') {
      console.error('Error fetching weekly plan:', planError);
    }

    if (existingPlan) {
      return NextResponse.json({
        success: true,
        data: existingPlan.plan_data
      });
    }

    // Generate new plan if none exists
    const plan = generateWeeklyPlan(assessments || []);

    // Save the plan
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const { error: saveError } = await supabase
      .from('weekly_plans')
      .insert({
        user_id: userId,
        week_number: getWeekNumber(weekStart),
        start_date: weekStart.toISOString(),
        end_date: weekEnd.toISOString(),
        plan_data: plan,
        created_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('Error saving weekly plan:', saveError);
      // Don't fail - return plan anyway
    }

    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/weekly-plan
 * Generate a custom weekly plan
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth();
    const userId = session.userId;

    const body = await request.json();
    
    // Validate input
    const { focusAreas, intensity } = generatePlanSchema.parse(body);

    const supabase = await createClient();

    // Get assessment data for focus areas
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (id, name, description)
      `)
      .eq('user_id', userId)
      .in('dimension_id', focusAreas)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (assessmentError) {
      return NextResponse.json(
        { error: 'Failed to fetch assessment data' },
        { status: 500 }
      );
    }

    // Generate custom plan
    const plan = generateCustomWeeklyPlan(assessments || [], intensity);

    // Save the plan
    const weekStart = new Date();
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const { error: saveError } = await supabase
      .from('weekly_plans')
      .insert({
        user_id: userId,
        week_number: getWeekNumber(weekStart),
        start_date: weekStart.toISOString(),
        end_date: weekEnd.toISOString(),
        plan_data: plan,
        is_custom: true,
        focus_areas: focusAreas,
        intensity,
        created_at: new Date().toISOString()
      });

    if (saveError) {
      console.error('Error saving custom weekly plan:', saveError);
    }

    // Log audit event
    console.log('Custom weekly plan generated:', {
      userId,
      focusAreas,
      intensity,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate weekly plan based on assessments
function generateWeeklyPlan(assessments: any[]): WeeklyPlan {
  // Identify lowest scoring dimensions
  const sortedAssessments = assessments
    .filter(a => a.dimensions)
    .sort((a, b) => (a.score || 0) - (b.score || 0));
  
  const lowestDimensions = sortedAssessments.slice(0, 3);
  
  // Generate activities based on lowest dimensions
  const schedule: WeeklyActivity[] = [
    {
      day: 'Monday',
      activities: ['Morning reflection', 'Focus session', 'Skill practice'],
      focus: lowestDimensions[0]?.dimensions?.name || 'Self Development',
      duration: '2 hours'
    },
    {
      day: 'Tuesday',
      activities: ['Reading', 'Exercise', 'Social connection'],
      focus: lowestDimensions[1]?.dimensions?.name || 'Physical Health',
      duration: '2.5 hours'
    },
    {
      day: 'Wednesday',
      activities: ['Learning new skill', 'Meditation', 'Journaling'],
      focus: lowestDimensions[2]?.dimensions?.name || 'Mental Health',
      duration: '2 hours'
    },
    {
      day: 'Thursday',
      activities: ['Project work', 'Networking', 'Review progress'],
      focus: 'Intellectual Growth',
      duration: '3 hours'
    },
    {
      day: 'Friday',
      activities: ['Creative activity', 'Self-care', 'Planning'],
      focus: 'Holistic Balance',
      duration: '2 hours'
    },
    {
      day: 'Saturday',
      activities: ['Rest', 'Hobbies', 'Family time'],
      focus: 'Recovery & Relationships',
      duration: 'Flexible'
    },
    {
      day: 'Sunday',
      activities: ['Weekly review', 'Goal setting', 'Preparation'],
      focus: 'Reflection & Planning',
      duration: '1.5 hours'
    }
  ];

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    week: getWeekNumber(now),
    startDate: weekStart.toISOString().split('T')[0],
    endDate: weekEnd.toISOString().split('T')[0],
    goals: [
      `Improve ${lowestDimensions[0]?.dimensions?.name || 'overall development'}`,
      `Practice ${lowestDimensions[1]?.dimensions?.name || 'key skills'}`,
      'Maintain balance across all 9 dimensions'
    ],
    schedule,
    recommendations: [
      'Start each day with a 10-minute meditation',
      'Track your progress daily',
      'Connect with a study group for accountability',
      'Review and adjust plan weekly'
    ]
  };
}

// Helper function to generate custom weekly plan
function generateCustomWeeklyPlan(assessments: any[], intensity: string): WeeklyPlan {
  const basePlan = generateWeeklyPlan(assessments);
  
  // Adjust based on intensity
  const intensityMultiplier = {
    light: 0.7,
    moderate: 1,
    intensive: 1.5
  }[intensity];

  const adjustedSchedule = basePlan.schedule.map(day => ({
    ...day,
    activities: intensity === 'intensive' 
      ? [...day.activities, 'Extra practice', 'Deep work session']
      : intensity === 'light'
      ? day.activities.slice(0, 2)
      : day.activities
  }));

  return {
    ...basePlan,
    schedule: adjustedSchedule,
    recommendations: [
      ...basePlan.recommendations,
      `Intensity level: ${intensity}`,
      intensity === 'intensive' 
        ? 'Remember to take breaks and avoid burnout'
        : intensity === 'light'
        ? 'Gradually increase intensity as you build habits'
        : 'Maintain this balanced approach'
    ]
  };
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
