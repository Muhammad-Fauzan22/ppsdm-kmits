import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance: Account Deletion Endpoint (Pasal 38-40)
 * Implements soft delete with 14-day grace period
 */

const GRACE_PERIOD_DAYS = 14;

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
        { error: 'Unauthorized. Please login to delete your account.' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body for confirmation
    const body = await request.json();
    const { confirmDelete, reason } = body;

    if (!confirmDelete) {
      return NextResponse.json(
        { error: 'Confirmation required to delete account' },
        { status: 400 }
      );
    }

    // Check if deletion already requested
    const { data: existingRequest } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { 
          error: 'Deletion already requested',
          scheduledDate: existingRequest.scheduled_deletion_date,
          message: 'You already have a pending deletion request. You can cancel it within the grace period.'
        },
        { status: 409 }
      );
    }

    // Calculate scheduled deletion date (14 days from now)
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + GRACE_PERIOD_DAYS);

    // Create deletion request
    const { error: insertError } = await supabase
      .from('account_deletion_requests')
      .insert({
        user_id: userId,
        email: user.email,
        reason: reason || 'Not specified',
        status: 'pending',
        requested_at: new Date().toISOString(),
        scheduled_deletion_date: scheduledDeletionDate.toISOString(),
        grace_period_days: GRACE_PERIOD_DAYS,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent'),
      });

    if (insertError) {
      console.error('Error creating deletion request:', insertError);
      return NextResponse.json(
        { error: 'Failed to process deletion request' },
        { status: 500 }
      );
    }

    // Log the deletion request for compliance audit
    await supabase.from('compliance_audit_logs').insert({
      user_id: userId,
      action: 'ACCOUNT_DELETION_REQUESTED',
      resource: 'account_deletion_requests',
      metadata: {
        scheduled_deletion_date: scheduledDeletionDate.toISOString(),
        grace_period_days: GRACE_PERIOD_DAYS,
        reason: reason || 'Not specified'
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent'),
    });

    // Send notification email (async, don't wait)
    // This would typically call an email service
    // await sendDeletionNotificationEmail(user.email, scheduledDeletionDate);

    return NextResponse.json({
      success: true,
      message: 'Account deletion scheduled successfully',
      scheduledDeletionDate: scheduledDeletionDate.toISOString(),
      gracePeriodDays: GRACE_PERIOD_DAYS,
      cancelUrl: '/api/user/delete/cancel',
      instructions: [
        `Your account will be permanently deleted on ${scheduledDeletionDate.toLocaleDateString('id-ID')}`,
        'You can cancel this request at any time before the deletion date',
        'During the grace period, your data will be preserved but marked for deletion',
        'After deletion, some anonymized data may be retained for research purposes'
      ]
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to process account deletion. Please try again later.' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check deletion status
 */
export async function GET(request: NextRequest) {
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
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get deletion request status
    const { data: deletionRequest } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .order('requested_at', { ascending: false })
      .limit(1)
      .single();

    if (!deletionRequest) {
      return NextResponse.json({
        hasPendingDeletion: false,
        message: 'No deletion request found'
      });
    }

    const now = new Date();
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_date);
    const daysRemaining = Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      hasPendingDeletion: deletionRequest.status === 'pending',
      status: deletionRequest.status,
      requestedAt: deletionRequest.requested_at,
      scheduledDeletionDate: deletionRequest.scheduled_deletion_date,
      daysRemaining: Math.max(0, daysRemaining),
      reason: deletionRequest.reason,
      canCancel: deletionRequest.status === 'pending' && daysRemaining > 0
    });

  } catch (error) {
    console.error('Error checking deletion status:', error);
    return NextResponse.json(
      { error: 'Failed to check deletion status' },
      { status: 500 }
    );
  }
}
