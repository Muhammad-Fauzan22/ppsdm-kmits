import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance - Data Deletion Endpoint
 * Implements soft delete with 14-day grace period
 * 
 * @route POST /api/user/delete
 * @param {string} reason - Optional deletion reason
 * @param {boolean} confirm - Must be true to confirm deletion
 * @returns {Object} Deletion status and grace period info
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
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body
    const body = await request.json();
    const { reason, confirm } = body;

    if (!confirm) {
      return NextResponse.json(
        { 
          error: 'Confirmation required',
          message: 'Please set confirm: true to proceed with account deletion',
          warning: 'This action will schedule your account for deletion with a 14-day grace period'
        },
        { status: 400 }
      );
    }

    // Check if already scheduled for deletion
    const { data: existingDeletion } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingDeletion) {
      const scheduledDate = new Date(existingDeletion.scheduled_deletion_at);
      const daysRemaining = Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      return NextResponse.json(
        {
          message: 'Account already scheduled for deletion',
          scheduledDeletionDate: existingDeletion.scheduled_deletion_at,
          daysRemaining,
          canCancel: true,
          cancelUrl: '/api/user/delete/cancel'
        },
        { status: 409 }
      );
    }

    // Calculate deletion date (14 days from now)
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + 14);

    // Create deletion request
    const { error: deletionError } = await supabase
      .from('deletion_requests')
      .insert({
        user_id: userId,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: scheduledDeletionDate.toISOString(),
        status: 'pending',
        reason: reason || null,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    if (deletionError) {
      return NextResponse.json(
        { error: 'Failed to schedule account deletion' },
        { status: 500 }
      );
    }

    // Log the deletion request for compliance audit
    await supabase.from('compliance_audit_logs').insert({
      user_id: userId,
      action: 'DELETION_REQUESTED',
      resource: 'user_account',
      metadata: {
        scheduled_deletion_at: scheduledDeletionDate.toISOString(),
        reason: reason || null
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    });

    // Send confirmation email (in production, this would trigger an email)
    // await sendDeletionConfirmationEmail(user.email, scheduledDeletionDate);

    return NextResponse.json({
      success: true,
      message: 'Account deletion scheduled successfully',
      scheduledDeletionDate: scheduledDeletionDate.toISOString(),
      daysRemaining: 14,
      canCancel: true,
      cancelUrl: '/api/user/delete/cancel',
      whatWillBeDeleted: [
        'Profile information',
        'Assessment responses and results',
        'Progress data',
        'Achievements',
        'Session history'
      ],
      whatWillBeRetained: [
        'Anonymized assessment data for research (without PII)',
        'System logs for security compliance'
      ],
      nextSteps: [
        'You have 14 days to cancel this request',
        'After 14 days, your account will be permanently deleted',
        'You will receive email reminders before deletion'
      ]
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET method to check deletion status
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: deletionRequest } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (!deletionRequest) {
      return NextResponse.json({
        isScheduledForDeletion: false,
        message: 'No pending deletion request found'
      });
    }

    const scheduledDate = new Date(deletionRequest.scheduled_deletion_at);
    const daysRemaining = Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return NextResponse.json({
      isScheduledForDeletion: true,
      scheduledDeletionDate: deletionRequest.scheduled_deletion_at,
      daysRemaining: Math.max(0, daysRemaining),
      requestedAt: deletionRequest.requested_at,
      reason: deletionRequest.reason,
      canCancel: true,
      cancelUrl: '/api/user/delete/cancel'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
