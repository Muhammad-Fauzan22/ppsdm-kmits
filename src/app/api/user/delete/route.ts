import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance: Data Deletion Endpoint
 * Implements soft delete with 14-day grace period
 * Reference: UU No. 27 Tahun 2022, Pasal 38-40
 */

// Grace period in days before permanent deletion
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

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to delete your account.' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const deletionId = `DEL-${Date.now()}`;
    const requestedAt = new Date().toISOString();
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + GRACE_PERIOD_DAYS);

    // Parse request body for confirmation
    const body = await request.json();
    const { confirmation, reason, feedback } = body;

    // Validate confirmation
    if (confirmation !== 'DELETE_MY_ACCOUNT') {
      return NextResponse.json(
        { 
          error: 'Invalid confirmation. Please type "DELETE_MY_ACCOUNT" to confirm.',
          code: 'INVALID_CONFIRMATION'
        },
        { status: 400 }
      );
    }

    // Check if deletion is already scheduled
    const { data: existingDeletion } = await supabase
      .from('account_deletion_requests')
      .select('id, status, scheduled_deletion_date')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingDeletion) {
      return NextResponse.json(
        {
          error: 'Account deletion already scheduled',
          code: 'ALREADY_SCHEDULED',
          deletionId: existingDeletion.id,
          scheduledDate: existingDeletion.scheduled_deletion_date,
          daysRemaining: Math.ceil((new Date(existingDeletion.scheduled_deletion_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        },
        { status: 409 }
      );
    }

    // Create deletion request record
    const { error: deletionError } = await supabase
      .from('account_deletion_requests')
      .insert({
        id: deletionId,
        user_id: userId,
        email: user.email,
        requested_at: requestedAt,
        scheduled_deletion_date: scheduledDeletionDate.toISOString(),
        status: 'pending',
        reason: reason || 'Not specified',
        feedback: feedback || null,
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    if (deletionError) {
      console.error('Error creating deletion request:', deletionError);
      return NextResponse.json(
        { error: 'Failed to schedule account deletion' },
        { status: 500 }
      );
    }

    // Log the deletion request for compliance audit
    await supabase.from('compliance_audit_logs').insert({
      user_id: userId,
      action: 'ACCOUNT_DELETION_REQUESTED',
      resource: 'account_deletion_requests',
      resource_id: deletionId,
      metadata: {
        scheduled_deletion_date: scheduledDeletionDate.toISOString(),
        grace_period_days: GRACE_PERIOD_DAYS,
        reason: reason || 'Not specified'
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    });

    // Send confirmation email (in production, this would trigger an email)
    // For now, we just log it
    console.log(`[ACCOUNT DELETION] User ${user.email} (${userId}) scheduled for deletion on ${scheduledDeletionDate.toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Account deletion scheduled successfully',
      deletionId,
      scheduledDeletionDate: scheduledDeletionDate.toISOString(),
      gracePeriodDays: GRACE_PERIOD_DAYS,
      daysRemaining: GRACE_PERIOD_DAYS,
      canCancel: true,
      cancelUrl: '/api/user/delete/cancel',
      legalNotice: 'Under UU No. 27/2022, you have the right to request deletion of your personal data. Your account will be permanently deleted after the grace period.'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: deletionRequest } = await supabase
      .from('account_deletion_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })
      .limit(1)
      .single();

    if (!deletionRequest) {
      return NextResponse.json({
        hasPendingDeletion: false,
        message: 'No pending deletion requests'
      });
    }

    const now = new Date();
    const scheduledDate = new Date(deletionRequest.scheduled_deletion_date);
    const daysRemaining = Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      hasPendingDeletion: deletionRequest.status === 'pending',
      deletionId: deletionRequest.id,
      status: deletionRequest.status,
      requestedAt: deletionRequest.requested_at,
      scheduledDeletionDate: deletionRequest.scheduled_deletion_date,
      daysRemaining: Math.max(0, daysRemaining),
      canCancel: deletionRequest.status === 'pending' && daysRemaining > 0,
      reason: deletionRequest.reason
    });

  } catch (error) {
    console.error('Error checking deletion status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
