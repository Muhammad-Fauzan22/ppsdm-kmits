/**
 * UU PDP Compliance - Cancel Account Deletion API
 * Allows users to cancel their scheduled account deletion within the 14-day grace period
 */

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

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to cancel deletion.' },
        { status: 401 }
      );
    }

    // Find pending deletion request
    const { data: deletionRequest, error: findError } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (findError || !deletionRequest) {
      return NextResponse.json(
        { 
          error: 'No pending deletion found',
          message: 'There is no scheduled deletion to cancel'
        },
        { status: 404 }
      );
    }

    // Update deletion request status
    const { error: updateError } = await supabase
      .from('deletion_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', deletionRequest.id);

    if (updateError) {
      console.error('Failed to cancel deletion:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel deletion request' },
        { status: 500 }
      );
    }

    // Log cancellation for compliance audit
    await logCancellation(supabase, user.id);

    return NextResponse.json({
      success: true,
      message: 'Account deletion cancelled successfully',
      previouslyScheduled: deletionRequest.scheduled_deletion_date,
    });

  } catch (error) {
    console.error('Cancel deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to process cancellation' },
      { status: 500 }
    );
  }
}

/**
 * Log cancellation for compliance audit trail
 */
async function logCancellation(supabase: any, userId: string) {
  try {
    await supabase.from('deletion_audit_logs').insert({
      user_id: userId,
      action: 'cancelled',
      performed_at: new Date().toISOString(),
      ip_address: null,
      user_agent: null,
    });
  } catch (error) {
    console.error('Failed to log cancellation:', error);
  }
}
