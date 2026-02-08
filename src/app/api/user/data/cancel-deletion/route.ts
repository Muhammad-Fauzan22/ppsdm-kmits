import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * POST /api/user/data/cancel-deletion - Cancel scheduled account deletion
 */
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch { /* Ignore in server component */ }
                    },
                },
            }
        );

        // Verify user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Check if deletion was scheduled
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('deletion_scheduled_for, status')
            .eq('id', user.id)
            .single();

        if (!profile?.deletion_scheduled_for || profile.status !== 'pending_deletion') {
            return NextResponse.json(
                { error: 'No pending deletion request found' },
                { status: 400 }
            );
        }

        // Cancel deletion
        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
                deletion_requested_at: null,
                deletion_scheduled_for: null,
                deletion_reason: null,
                status: 'active'
            })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to cancel deletion' },
                { status: 500 }
            );
        }

        // Log cancellation for audit (non-blocking)
        try {
            await supabase.from('audit_logs').insert({
                user_id: user.id,
                action: 'ACCOUNT_DELETION_CANCELLED',
                details: {
                    cancelledAt: new Date().toISOString()
                }
            });
        } catch { /* Audit log failure shouldn't block request */ }

        return NextResponse.json({
            success: true,
            message: 'Account deletion cancelled successfully',
            status: 'active'
        });

    } catch (error) {
        console.error('Cancel deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to cancel deletion' },
            { status: 500 }
        );
    }
}
