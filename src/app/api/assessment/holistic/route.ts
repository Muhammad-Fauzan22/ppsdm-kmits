/**
 * Holistic Assessment API Route
 * 
 * Handles scoring for all 9 dimensions of holistic development
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import {
  scoreDimension,
  HolisticAssessmentInput,
  AssessmentResponse
} from '@/lib/assessment/scoring-engine';
import { z } from 'zod';

// Strict schema for holistic assessment input
const assessmentResponseSchema = z.union([
  z.record(z.string(), z.union([z.number().min(1).max(10), z.string().max(1000)])),
  z.array(z.object({
    questionId: z.string().min(1).max(100),
    answer: z.union([z.number().min(1).max(10), z.string().max(1000)]),
    timestamp: z.string().datetime().optional(),
  }).strict()).min(1).max(200),
]);

const userContextSchema = z.object({
  age: z.number().int().min(13).max(100).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  department: z.string().max(100).optional(),
  year: z.number().int().min(1).max(7).optional(),
  faculty: z.string().max(100).optional(),
}).strict().optional();

const holisticAssessmentSchema = z.object({
  dimensionId: z.number().int().min(1).max(9, 'Dimension ID must be between 1 and 9'),
  responses: assessmentResponseSchema,
  userContext: userContextSchema,
}).strict();

// ============================================================================
// POST /api/assessment/holistic/submit
// Submit assessment responses and get scoring results
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input with Zod schema
    const validationResult = holisticAssessmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { dimensionId, responses, userContext } = validationResult.data;

    // Score the dimension
    const result: AssessmentResponse = scoreDimension({
      dimensionId,
      responses,
      userContext
    });

    // Save assessment result to database
    const { data: assessmentData, error: saveError } = await supabase
      .from('holistic_assessments')
      .insert({
        user_id: user.id,
        dimension_id: dimensionId,
        dimension_slug: result.dimensionSlug,
        composite_score: result.scoring.compositeScore,
        subdimension_scores: result.scoring.subdimensionScores,
        percentile: result.scoring.percentile,
        level: result.scoring.level,
        confidence_interval: result.scoring.confidenceInterval,
        reliability_index: result.scoring.reliabilityIndex,
        strengths: result.feedback.strengths,
        growth_areas: result.feedback.growthAreas,
        recommendations: result.feedback.recommendations,
        development_path: result.feedback.developmentPath,
        responses: responses,
        user_context: userContext,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving assessment:', saveError);
      return NextResponse.json(
        { error: 'Failed to save assessment result' },
        { status: 500 }
      );
    }

    // Update user XP and badges
    await updateUserProgress(supabase, user.id, dimensionId, result.scoring.compositeScore);

    return NextResponse.json({
      success: true,
      data: {
        assessment: assessmentData,
        scoring: result.scoring,
        feedback: result.feedback
      }
    });

  } catch (error) {
    console.error('Holistic assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/assessment/holistic/results
// Get all assessment results for the current user
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all assessment results for user
    const { data: assessments, error } = await supabase
      .from('holistic_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessment results' },
        { status: 500 }
      );
    }

    // Calculate overall holistic score
    const overallScore = calculateOverallScore(assessments || []);

    return NextResponse.json({
      success: true,
      data: {
        assessments,
        overallScore,
        dimensionsCompleted: assessments?.length || 0
      }
    });

  } catch (error) {
    console.error('Fetch assessments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/assessment/holistic/dimensions/:id
// Get assessment results for a specific dimension
// ============================================================================

async function GET_BY_DIMENSION(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const dimensionId = parseInt(params.id);

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get assessment results for specific dimension
    const { data: assessments, error } = await supabase
      .from('holistic_assessments')
      .select('*')
      .eq('user_id', user.id)
      .eq('dimension_id', dimensionId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching dimension assessment:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assessment result' },
        { status: 500 }
      );
    }

    if (!assessments || assessments.length === 0) {
      return NextResponse.json(
        { error: 'No assessment found for this dimension' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: assessments[0]
    });

  } catch (error) {
    console.error('Fetch dimension assessment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/assessment/holistic/overview
// Get holistic overview with all dimensions
// ============================================================================

async function GET_OVERVIEW(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get latest assessment for each dimension
    const dimensionsOverview = [];

    for (let i = 1; i <= 9; i++) {
      const { data: assessments } = await supabase
        .from('holistic_assessments')
        .select('*')
        .eq('user_id', user.id)
        .eq('dimension_id', i)
        .order('created_at', { ascending: false })
        .limit(1);

      if (assessments && assessments.length > 0) {
        dimensionsOverview.push({
          dimensionId: i,
          ...assessments[0]
        });
      } else {
        dimensionsOverview.push({
          dimensionId: i,
          completed: false
        });
      }
    }

    // Calculate overall metrics
    const completedDimensions = dimensionsOverview.filter(d => d.completed !== false);
    const overallScore = calculateOverallScore(completedDimensions);
    const balanceIndex = calculateBalanceIndex(completedDimensions);
    const growthAreas = identifyGrowthAreas(completedDimensions);
    const strengths = identifyStrengths(completedDimensions);

    return NextResponse.json({
      success: true,
      data: {
        dimensions: dimensionsOverview,
        overallScore,
        balanceIndex,
        growthAreas,
        strengths,
        completionRate: (completedDimensions.length / 9) * 100
      }
    });

  } catch (error) {
    console.error('Fetch overview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/assessment/holistic/gap-analysis
// Get gap analysis for all dimensions
// ============================================================================

async function GET_GAP_ANALYSIS(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all assessments
    const { data: assessments } = await supabase
      .from('holistic_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!assessments || assessments.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          criticalGaps: [],
          moderateGaps: [],
          overallGapScore: 0
        }
      });
    }

    // Analyze gaps
    const gapAnalysis = analyzeGaps(assessments);

    return NextResponse.json({
      success: true,
      data: gapAnalysis
    });

  } catch (error) {
    console.error('Gap analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/assessment/holistic/roadmap
// Get personalized development roadmap
// ============================================================================

async function GET_ROADMAP(request: NextRequest) {
  try {
    const supabase = createClient();

    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all assessments
    const { data: assessments } = await supabase
      .from('holistic_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!assessments || assessments.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          currentPhase: 'Foundation',
          phases: [],
          weeklyPlan: []
        }
      });
    }

    // Generate roadmap
    const roadmap = generateRoadmap(assessments);

    return NextResponse.json({
      success: true,
      data: roadmap
    });

  } catch (error) {
    console.error('Roadmap error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function updateUserProgress(
  supabase: any,
  userId: string,
  dimensionId: number,
  score: number
) {
  // Calculate XP earned
  const xpEarned = calculateXPEarned(dimensionId, score);

  // Update user XP
  const { data: userData } = await supabase
    .from('user_profiles')
    .select('xp, level, badges')
    .eq('user_id', userId)
    .single();

  if (userData) {
    const newXP = (userData.xp || 0) + xpEarned;
    const newLevel = calculateLevel(newXP);
    const newBadges = checkForBadges(dimensionId, score, userData.badges || []);

    await supabase
      .from('user_profiles')
      .update({
        xp: newXP,
        level: newLevel,
        badges: newBadges,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }
}

function calculateXPEarned(dimensionId: number, score: number): number {
  // Base XP for completing assessment
  let xp = 50;

  // Bonus XP for high scores
  if (score >= 85) xp += 50;
  else if (score >= 70) xp += 30;
  else if (score >= 55) xp += 15;

  return xp;
}

function calculateLevel(xp: number): number {
  // Level calculation: Level = floor(sqrt(XP / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function checkForBadges(
  dimensionId: number,
  score: number,
  currentBadges: string[]
): string[] {
  const newBadges = [...currentBadges];

  // Check for dimension-specific badges
  if (score >= 85) {
    const badgeName = `dimension_${dimensionId}_expert`;
    if (!newBadges.includes(badgeName)) {
      newBadges.push(badgeName);
    }
  }

  // Check for overall achievement badges
  const dimensionBadges = currentBadges.filter(b => b.startsWith('dimension_'));
  if (dimensionBadges.length >= 9 && !newBadges.includes('holistic_master')) {
    newBadges.push('holistic_master');
  }

  return newBadges;
}

function calculateOverallScore(assessments: any[]): number {
  if (assessments.length === 0) return 0;

  const totalScore = assessments.reduce((sum, a) => sum + a.composite_score, 0);
  return Math.round(totalScore / assessments.length);
}

function calculateBalanceIndex(assessments: any[]): number {
  if (assessments.length < 2) return 0;

  const scores = assessments.map(a => a.composite_score);
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Balance index: 1 - (stdDev / 100)
  return Math.max(0, Math.min(1, 1 - (stdDev / 100)));
}

function identifyGrowthAreas(assessments: any[]): string[] {
  const growthAreas: string[] = [];

  assessments.forEach(assessment => {
    if (assessment.growth_areas && Array.isArray(assessment.growth_areas)) {
      growthAreas.push(...assessment.growth_areas);
    }
  });

  return growthAreas;
}

function identifyStrengths(assessments: any[]): string[] {
  const strengths: string[] = [];

  assessments.forEach(assessment => {
    if (assessment.strengths && Array.isArray(assessment.strengths)) {
      strengths.push(...assessment.strengths);
    }
  });

  return strengths;
}

function analyzeGaps(assessments: any[]): any {
  const criticalGaps: any[] = [];
  const moderateGaps: any[] = [];

  assessments.forEach(assessment => {
    const { dimension_id, composite_score, subdimension_scores } = assessment;

    // Check subdimension scores
    Object.entries(subdimension_scores || {}).forEach(([subdim, score]) => {
      if ((score as number) < 40) {
        criticalGaps.push({
          dimensionId: dimension_id,
          subdimension: subdim,
          score,
          severity: 'critical'
        });
      } else if ((score as number) < 55) {
        moderateGaps.push({
          dimensionId: dimension_id,
          subdimension: subdim,
          score,
          severity: 'moderate'
        });
      }
    });
  });

  // Calculate overall gap score
  const avgScore = assessments.reduce((sum, a) => sum + a.composite_score, 0) / assessments.length;
  const overallGapScore = Math.max(0, 100 - avgScore);

  return {
    criticalGaps,
    moderateGaps,
    overallGapScore,
    totalGaps: criticalGaps.length + moderateGaps.length
  };
}

function generateRoadmap(assessments: any[]): any {
  const avgScore = assessments.reduce((sum, a) => sum + a.composite_score, 0) / assessments.length;

  // Determine current phase
  let currentPhase = 'Foundation';
  if (avgScore >= 70) currentPhase = 'Integration';
  else if (avgScore >= 55) currentPhase = 'Development';

  // Generate phases
  const phases = [
    {
      name: 'Foundation',
      description: 'Bangun pemahaman dasar di semua dimensi',
      status: avgScore >= 55 ? 'completed' : 'in_progress',
      dimensions: assessments.map(a => ({
        id: a.dimension_id,
        score: a.composite_score,
        target: 55
      }))
    },
    {
      name: 'Development',
      description: 'Kembangkan keterampilan pada area yang lemah',
      status: avgScore >= 70 ? 'completed' : (avgScore >= 55 ? 'in_progress' : 'pending'),
      dimensions: assessments.map(a => ({
        id: a.dimension_id,
        score: a.composite_score,
        target: 70
      }))
    },
    {
      name: 'Integration',
      description: 'Integrasikan semua dimensi untuk keseimbangan',
      status: avgScore >= 85 ? 'completed' : (avgScore >= 70 ? 'in_progress' : 'pending'),
      dimensions: assessments.map(a => ({
        id: a.dimension_id,
        score: a.composite_score,
        target: 85
      }))
    },
    {
      name: 'Mastery',
      description: 'Capai level expert di semua dimensi',
      status: avgScore >= 85 ? 'in_progress' : 'pending',
      dimensions: assessments.map(a => ({
        id: a.dimension_id,
        score: a.composite_score,
        target: 95
      }))
    }
  ];

  // Generate weekly plan
  const weeklyPlan = generateWeeklyPlan(assessments);

  return {
    currentPhase,
    phases,
    weeklyPlan,
    estimatedCompletion: estimateCompletionTime(avgScore)
  };
}

function generateWeeklyPlan(assessments: any[]): any[] {
  const weeklyPlan: any[] = [];

  // Focus on dimensions with lowest scores
  const sortedAssessments = [...assessments].sort((a, b) => a.composite_score - b.composite_score);
  const focusDimensions = sortedAssessments.slice(0, 3);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  days.forEach((day, index) => {
    const focusDim = focusDimensions[index % focusDimensions.length];
    weeklyPlan.push({
      day,
      focusDimension: focusDim.dimension_id,
      focusDimensionName: getDimensionName(focusDim.dimension_id),
      activities: getActivitiesForDimension(focusDim.dimension_id),
      estimatedTime: '30-45 menit'
    });
  });

  return weeklyPlan;
}

function getDimensionName(dimensionId: number): string {
  const names: Record<number, string> = {
    1: 'Kognitif & Intelektual',
    2: 'Manajemen Diri & Produktivitas',
    3: 'Kecerdasan Finansial',
    4: 'Kesehatan Fisik & Vitalitas',
    5: 'Kecerdasan Emosional & Sosial',
    6: 'Kesehatan Mental & Psikologis',
    7: 'Karakter & Etika',
    8: 'Pengembangan Spiritual',
    9: 'Manajemen Lingkungan & Gaya Hidup'
  };

  return names[dimensionId] || `Dimensi ${dimensionId}`;
}

function getActivitiesForDimension(dimensionId: number): string[] {
  const activities: Record<number, string[]> = {
    1: ['Latih critical thinking dengan case study', 'Baca artikel ilmiah', 'Praktikkan metacognition'],
    2: ['Gunakan teknik Pomodoro', 'Buat to-do list harian', 'Praktikkan deep work'],
    3: ['Catat pengeluaran harian', 'Buat anggaran bulanan', 'Pelajari investasi dasar'],
    4: ['Lakukan olahraga 30 menit', 'Tidur 7-8 jam', 'Konsumsi sayur dan buah'],
    5: ['Praktikkan jurnal emosi', 'Latih empati dengan mendengarkan aktif', 'Gunakan teknik STOP'],
    6: ['Praktikkan mindfulness', 'Tulis gratitude journal', 'Hubungi konselor jika perlu'],
    7: ['Praktikkan kejujuran', 'Lakukan satu tindakan kebaikan', 'Terima kritik dengan terbuka'],
    8: ['Tulis personal mission statement', 'Praktikkan rasa syukur', 'Ikuti kegiatan sosial'],
    9: ['Bawa tumbler sendiri', 'Gunakan transportasi umum', 'Donasi barang tidak terpakai']
  };

  return activities[dimensionId] || ['Review assessment results', 'Set development goals'];
}

function estimateCompletionTime(currentScore: number): string {
  if (currentScore >= 85) return '1-2 bulan';
  if (currentScore >= 70) return '2-3 bulan';
  if (currentScore >= 55) return '3-6 bulan';
  return '6-12 bulan';
}
