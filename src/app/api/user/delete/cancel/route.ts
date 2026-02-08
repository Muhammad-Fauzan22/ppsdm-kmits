import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance: Cancel Account Deletion Endpoint
 * Allows users to cancel deletion request within grace period
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

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to cancel deletion.' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Find pending deletion request
    const { data: deletionRequest, error: findError } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (findError || !deletionRequest) {
      return NextResponse.json(
        { error: 'No pending deletion request found' },
        { status: 404 }
      );
    }

    // Check if still within grace period
    const now = new Date();
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_date);
    
    if (now > scheduledDate) {
      return NextResponse.json(
        { error: 'Grace period has expired. Account deletion cannot be cancelled.' },
        { status: 410 }
      );
    }

    // Update deletion request status
    const { error: updateError } = await supabase
      .from('account_deletion_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: 'User requested cancellation'
      })
      .eq('id', deletionRequest.id);

    if (updateError) {
      console.error('Error cancelling deletion:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel deletion request' },
        { status: 500 }
      );
    }

    // Log cancellation for compliance audit
    await supabase.from('compliance_audit_logs').insert({
      user_id: userId,
      action: 'ACCOUNT_DELETION_CANCELLED',
      resource: 'account_deletion_requests',
      metadata: {
        original_request_id: deletionRequest.id,
        original_scheduled_date: deletionRequest.scheduled_deletion_date,
        cancelled_at: new Date().toISOString()
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
    });

    return NextResponse.json({
      success: true,
      message: 'Account deletion cancelled successfully',
      originalScheduledDate: deletionRequest.scheduled_deletion_date,
      cancelledAt: new Date().toISOString(),
      instructions: [
        'Your account deletion has been cancelled',
        'All your data remains intact and accessible',
        'You can continue using the platform normally'
      ]
    });

  } catch (error) {
    console.error('Cancel deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel deletion. Please try again later.' },
      { status: 500 }
    );
  }
}
