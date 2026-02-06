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
    const { sessionId, dimension, questionId, responseValue, timeSpentMs } = body;
    
    // Validate required fields
    if (!sessionId || !dimension || !questionId || responseValue === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check if session exists or create new one
    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('id, user_id')
      .eq('id', sessionId)
      .single();
    
    if (sessionError || !session) {
      // Create new session if not exists
      const { data: newSession, error: createError } = await supabase
        .from('assessment_sessions')
        .insert({
          id: sessionId,
          user_id: user?.id || null,
          started_at: new Date().toISOString(),
          status: 'in_progress'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating session:', createError);
        return NextResponse.json(
          { error: 'Failed to create assessment session' },
          { status: 500 }
        );
      }
    }
    
    // Upsert response (insert or update)
    const { error: responseError } = await supabase
      .from('assessment_responses')
      .upsert({
        user_id: user?.id || null,
        session_id: sessionId,
        dimension,
        question_id: questionId,
        response_value: responseValue,
        time_spent_ms: timeSpentMs || 0,
        answered_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,session_id,question_id'
      });
    
    if (responseError) {
      console.error('Error saving response:', responseError);
      return NextResponse.json(
        { error: 'Failed to save response' },
        { status: 500 }
      );
    }
    
    // Update progress
    const { error: progressError } = await supabase
      .from('assessment_progress')
      .upsert({
        user_id: user?.id || null,
        dimension,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,dimension'
      });
    
    if (progressError) {
      console.error('Error updating progress:', progressError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Response saved successfully'
    });
    
  } catch (error) {
    console.error('Assessment submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
