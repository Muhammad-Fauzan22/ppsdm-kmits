import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from server component
            }
          },
        },
      }
    );

    // Parse request body
    const body = await request.json();
    const { sessionId, dimension, questionId, responseValue, timeSpentMs, sessionToken } = body;

    // Validate required fields
    if (!sessionId || !dimension || !questionId || responseValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || null;

    // Check if session exists or create new one
    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('id, user_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      // Create new session if not exists
      const { error: createError } = await supabase
        .from('assessment_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          session_token: !userId ? sessionToken : null, // Store token for anon
          started_at: new Date().toISOString(),
          status: 'in_progress'
        });

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create assessment session' },
          { status: 500 }
        );
      }
    }

    // Upsert response (using session_id + question_id uniqueness)
    const { error: responseError } = await supabase
      .from('assessment_responses')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        dimension,
        question_id: questionId,
        response_value: responseValue,
        time_spent_ms: timeSpentMs || 0,
        answered_at: new Date().toISOString()
      }, {
        onConflict: 'session_id,question_id' // Changed from user_id,session_id,question_id
      });

    if (responseError) {
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      );
    }

    // Update progress
    // For anonymous, we need a way to track uniqueness. 
    // If logged in: user_id + dimension.
    // If anon: session_token + dimension.

    const progressData: any = {
      dimension,
      status: 'in_progress',
      updated_at: new Date().toISOString()
    };

    let conflictTarget = '';

    if (userId) {
      progressData.user_id = userId;
      conflictTarget = 'user_id,dimension';
    } else if (sessionToken) {
      // Only update progress if we have a session token for anon
      progressData.session_token = sessionToken;
      conflictTarget = 'session_token,dimension';
    }

    if (conflictTarget) {
      const { error: progressError } = await supabase
        .from('assessment_progress')
        .upsert(progressData, {
          onConflict: conflictTarget
        });

      if (progressError) {
        }
    }

    return NextResponse.json({
      success: true,
      message: 'Response saved successfully'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
