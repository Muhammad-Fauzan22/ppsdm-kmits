import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance: Cancel Account Deletion Endpoint
 * Allows users to cancel deletion request within grace period
 * Reference: UU No. 27 Tahun 2022, Pasal 38
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

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body
    const body = await request.json();
    const { deletionId, reason } = body;

    if (!deletionId) {
      return NextResponse.json(
        { error: 'Deletion ID is required' },
        { status: 400 }
      );
    }

    // Verify the deletion request belongs to this user and is still pending
    const { data: deletionRequest, error: fetchError } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('id', deletionId)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (fetchError || !deletionRequest) {
      return NextResponse.json(
        { 
          error: 'Deletion request not found or already processed',
          code: 'NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if grace period is still valid
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_date);
    const now = new Date();
    
    if (now > scheduledDate) {
      return NextResponse.json(
        {
          error: 'Grace period has expired. Account deletion cannot be cancelled.',
          code: 'GRACE_PERIOD_EXPIRED',
          scheduledDeletionDate: deletionRequest.scheduled_deletion_date
        },
        { status: 410 }
      );
    }

    // Cancel the deletion request
    const { error: cancelError } = await supabase
      .from('account_deletion_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || 'User requested cancellation'
      })
      .eq('id', deletionId);

    if (cancelError) {
      console.error('Error cancelling deletion:', cancelError);
      return NextResponse.json(
        { error: 'Failed to cancel deletion request' },
        { status: 500 }
      );
    }

    // Log the cancellation for compliance audit
    await supabase.from('compliance_audit_logs').insert({
      user_id: userId,
      action: 'ACCOUNT_DELETION_CANCELLED',
      resource: 'account_deletion_requests',
      resource_id: deletionId,
      metadata: {
        original_scheduled_date: deletionRequest.scheduled_deletion_date,
        cancellation_reason: reason || 'User requested cancellation',
        days_remaining: Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({
      success: true,
      message: 'Account deletion cancelled successfully',
      deletionId,
      cancelledAt: new Date().toISOString(),
      legalNotice: 'Your account deletion request has been cancelled. Your data will be retained and you can continue using the platform normally.'
    });

  } catch (error) {
    console.error('Cancel deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
