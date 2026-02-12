import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { calculateDimensionScore, calculateHolisticScore } from '@/lib/assessment/scoring-engine';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: any[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }: any) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from server component
            }
          },
        },
      }
    );

    const body = await request.json();
    const { sessionId, dimension } = body;

    if (!sessionId || !dimension) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Get all responses for this session and dimension
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select('*')
      .eq('session_id', sessionId)
      .eq('dimension', dimension);

    if (responsesError) {
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json(
        { error: 'No responses found for this dimension' },
        { status: 400 }
      );
    }

    // Get questions for this dimension
    const { data: questions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('dimension', dimension);

    if (questionsError || !questions) {
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: 500 }
      );
    }

    // Calculate scores using the assessment engine
    const dimensionResult = calculateDimensionScore(responses, questions, dimension);

    // Save results
    const { error: resultError } = await supabase
      .from('assessment_results')
      .upsert({
        user_id: user?.id || null,
        session_id: sessionId,
        dimension,
        raw_score: dimensionResult.rawScore,
        normalized_score: dimensionResult.normalizedScore,
        percentile: dimensionResult.percentile,
        sub_dimension_scores: dimensionResult.subDimensionScores,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,session_id,dimension'
      });

    if (resultError) {
      return NextResponse.json(
        { error: 'Failed to save results' },
        { status: 500 }
      );
    }

    // Update progress
    const { error: progressError } = await supabase
      .from('assessment_progress')
      .upsert({
        user_id: user?.id || null,
        dimension,
        status: 'completed',
        score: dimensionResult.normalizedScore,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,dimension'
      });

    if (progressError) {
    }

    // Check if all dimensions are completed
    const { data: allProgress } = await supabase
      .from('assessment_progress')
      .select('dimension, status')
      .eq('user_id', user?.id || 'anonymous');

    const completedDimensions = allProgress?.filter((p: any) => p.status === 'completed').length || 0;
    const totalDimensions = 9;

    // If all dimensions completed, calculate holistic score
    if (completedDimensions >= totalDimensions) {
      const { data: allResults } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('session_id', sessionId);

      if (allResults && allResults.length === totalDimensions) {
        const holisticResult = calculateHolisticScore(allResults);

        await supabase
          .from('holistic_assessment_results')
          .upsert({
            user_id: user?.id || null,
            session_id: sessionId,
            overall_score: holisticResult.overallScore,
            dimension_scores: holisticResult.dimensionScores,
            profile_type: holisticResult.profileType,
            strengths: holisticResult.strengths,
            growth_areas: holisticResult.growthAreas,
            recommendations: holisticResult.recommendations,
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,session_id'
          });
      }
    }

    // Update session status
    await supabase
      .from('assessment_sessions')
      .update({
        status: completedDimensions >= totalDimensions ? 'completed' : 'in_progress',
        completed_at: completedDimensions >= totalDimensions ? new Date().toISOString() : null
      })
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      result: dimensionResult,
      progress: {
        completed: completedDimensions,
        total: totalDimensions,
        isComplete: completedDimensions >= totalDimensions
      }
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
