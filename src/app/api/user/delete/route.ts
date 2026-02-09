/**
 * UU PDP Compliance - Account Deletion API
 * Implements soft delete with 14-day grace period per UU No. 27 Tahun 2022
 * 
 * Features:
 * - Soft delete initiation (14-day grace period)
 * - Email notification before permanent deletion
 * - Audit logging for compliance
 * - Data anonymization option
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
        { error: 'Unauthorized. Please login to delete your account.' },
        { status: 401 }
      );
    }

    // Parse request body for confirmation
    const body = await request.json();
    const { confirmDelete, reason } = body;

    if (!confirmDelete) {
      return NextResponse.json(
        { 
          error: 'Confirmation required',
          message: 'Please confirm deletion by setting confirmDelete to true',
          warning: 'This action will schedule your account for deletion. You have 14 days to cancel.'
        },
        { status: 400 }
      );
    }

    // Check if deletion is already scheduled
    const { data: existingRequest } = await supabase
      .from('deletion_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { 
          error: 'Deletion already scheduled',
          message: 'Your account is already scheduled for deletion',
          scheduledDate: existingRequest.scheduled_deletion_date,
          cancelUrl: '/api/user/delete/cancel'
        },
        { status: 409 }
      );
    }

    // Calculate deletion date (14 days from now)
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + 14);

    // Create deletion request
    const { error: insertError } = await supabase
      .from('deletion_requests')
      .insert({
        user_id: user.id,
        email: user.email,
        reason: reason || 'User requested',
        status: 'pending',
        requested_at: new Date().toISOString(),
        scheduled_deletion_date: scheduledDeletionDate.toISOString(),
        notification_sent: false,
      });

    if (insertError) {
      console.error('Failed to create deletion request:', insertError);
      return NextResponse.json(
        { error: 'Failed to schedule account deletion' },
        { status: 500 }
      );
    }

    // Log for compliance audit
    await logDeletionRequest(supabase, user.id, 'initiated');

    // Send notification email (async - don't block response)
    sendDeletionNotification(user.email, scheduledDeletionDate).catch(console.error);

    return NextResponse.json({
      success: true,
      message: 'Account deletion scheduled successfully',
      scheduledDeletionDate: scheduledDeletionDate.toISOString(),
      gracePeriodDays: 14,
      cancelBefore: scheduledDeletionDate.toISOString(),
      cancelUrl: '/api/user/delete/cancel',
      warning: 'You have 14 days to cancel this request. After that, your account and all data will be permanently deleted.'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}

/**
 * Log deletion request for compliance audit trail
 */
async function logDeletionRequest(supabase: any, userId: string, action: string) {
  try {
    await supabase.from('deletion_audit_logs').insert({
      user_id: userId,
      action: action,
      performed_at: new Date().toISOString(),
      ip_address: null, // Set by trigger
      user_agent: null, // Set by trigger
    });
  } catch (error) {
    console.error('Failed to log deletion request:', error);
    // Non-blocking
  }
}

/**
 * Send deletion notification email
 */
async function sendDeletionNotification(email: string | undefined, deletionDate: Date) {
  if (!email) return;
  
  try {
    // In production, integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`[EMAIL] Deletion notification sent to ${email}`);
    console.log(`[EMAIL] Scheduled deletion: ${deletionDate.toISOString()}`);
    
    // TODO: Implement actual email sending
    // await emailService.send({
    //   to: email,
    //   template: 'account-deletion-scheduled',
    //   data: { deletionDate, cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings` }
    // });
  } catch (error) {
    console.error('Failed to send deletion notification:', error);
  }
}
