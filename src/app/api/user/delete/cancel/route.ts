import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance - Cancel Deletion Endpoint
 * Allows users to cancel their account deletion request within the grace period
 * 
 * @route POST /api/user/delete/cancel
 * @returns {Object} Cancellation status
 */
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
          setAll(cookiesToSet: any) {
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

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Check if there's a pending deletion request
    const { data: deletionRequest, error: fetchError } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (fetchError || !deletionRequest) {
      return NextResponse.json(
        {
          error: 'No pending deletion request found',
          message: 'There is no active deletion request to cancel'
        },
        { status: 404 }
      );
    }

    // Update deletion request status to cancelled
    const { error: updateError } = await supabase
      .from('deletion_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: userId
      })
      .eq('id', deletionRequest.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to cancel deletion request' },
        { status: 500 }
      );
    }

    // Log the cancellation for compliance audit
    await supabase.from('compliance_audit_logs').insert({
      user_id: userId,
      action: 'DELETION_CANCELLED',
      resource: 'user_account',
      metadata: {
        original_request_date: deletionRequest.requested_at,
        scheduled_deletion_date: deletionRequest.scheduled_deletion_at
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      message: 'Account deletion request cancelled successfully',
      originalScheduledDate: deletionRequest.scheduled_deletion_at,
      cancelledAt: new Date().toISOString(),
      accountStatus: 'active'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
