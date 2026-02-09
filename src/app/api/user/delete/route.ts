import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * UU PDP Compliance: Data Deletion Endpoint
 * Implements soft delete with 14-day grace period
 * User can cancel deletion within grace period
 */

const GRACE_PERIOD_DAYS = 14;

// Helper function to get client IP from headers
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

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
        { error: 'Deletion not confirmed. Set confirmDelete to true.' },
        { status: 400 }
      );
    }

    // Check if user already has a pending deletion
    const { data: existingDeletion } = await supabase
      .from('user_deletion_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingDeletion) {
      return NextResponse.json(
        { 
          error: 'Deletion already requested',
          message: `Your account is already scheduled for deletion on ${new Date(existingDeletion.scheduled_deletion_at).toLocaleDateString('id-ID')}`,
          scheduledDeletionDate: existingDeletion.scheduled_deletion_at,
          daysRemaining: Math.ceil((new Date(existingDeletion.scheduled_deletion_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        },
        { status: 409 }
      );
    }

    // Calculate scheduled deletion date (14 days from now)
    const scheduledDeletionAt = new Date();
    scheduledDeletionAt.setDate(scheduledDeletionAt.getDate() + GRACE_PERIOD_DAYS);

    // Get client IP
    const clientIP = getClientIP(request);

    // Create deletion request record
    const { error: deletionError } = await supabase
      .from('user_deletion_requests')
      .insert({
        user_id: userId,
        email: user.email,
        requested_at: new Date().toISOString(),
        scheduled_deletion_at: scheduledDeletionAt.toISOString(),
        status: 'pending',
        reason: reason || null,
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    if (deletionError) {
      console.error('Error creating deletion request:', deletionError);
      return NextResponse.json(
        { error: 'Failed to process deletion request. Please try again later.' },
        { status: 500 }
      );
    }

    // Mark user for deletion in auth metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        deletion_requested_at: new Date().toISOString(),
        scheduled_deletion_at: scheduledDeletionAt.toISOString(),
        deletion_status: 'pending'
      }
    });

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
    }

    // Log the deletion request for compliance audit
    await supabase
      .from('compliance_audit_logs')
      .insert({
        user_id: userId,
        action: 'DELETION_REQUESTED',
        resource: 'user_account',
        metadata: {
          scheduled_deletion_at: scheduledDeletionAt.toISOString(),
          grace_period_days: GRACE_PERIOD_DAYS,
          reason: reason || null
        },
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent') || 'unknown'
      });

    return NextResponse.json({
      success: true,
      message: 'Account deletion requested successfully',
      scheduledDeletionDate: scheduledDeletionAt.toISOString(),
      daysRemaining: GRACE_PERIOD_DAYS,
      cancelUrl: '/api/user/delete/cancel',
      note: 'You can cancel this deletion within 14 days by visiting the cancel URL or contacting support.'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request. Please try again later.' },
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
              // Ignore
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

    // Check for pending deletion
    const { data: deletionRequest } = await supabase
      .from('user_deletion_requests')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (!deletionRequest) {
      return NextResponse.json({
        hasPendingDeletion: false,
        message: 'No pending deletion request found'
      });
    }

    const daysRemaining = Math.ceil(
      (new Date(deletionRequest.scheduled_deletion_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      hasPendingDeletion: true,
      requestedAt: deletionRequest.requested_at,
      scheduledDeletionDate: deletionRequest.scheduled_deletion_at,
      daysRemaining: Math.max(0, daysRemaining),
      reason: deletionRequest.reason,
      canCancel: daysRemaining > 0
    });

  } catch (error) {
    console.error('Error checking deletion status:', error);
    return NextResponse.json(
      { error: 'Failed to check deletion status' },
      { status: 500 }
    );
  }
}
