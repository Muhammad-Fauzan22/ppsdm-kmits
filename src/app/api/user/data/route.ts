import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * GET /api/user/data - Export all user data (UU PDP Compliance)
 * Returns JSON dump of all user assessments and profile data
 */
export async function GET(request: NextRequest) {
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

        // Fetch all user data
        const [
            { data: profile },
            { data: sessions },
            { data: responses },
            { data: results },
            { data: holisticResults },
            { data: progress }
        ] = await Promise.all([
            supabase.from('user_profiles').select('*').eq('id', user.id).single(),
            supabase.from('assessment_sessions').select('*').eq('user_id', user.id),
            supabase.from('assessment_responses').select('*').eq('user_id', user.id),
            supabase.from('assessment_results').select('*').eq('user_id', user.id),
            supabase.from('holistic_assessment_results').select('*').eq('user_id', user.id),
            supabase.from('assessment_progress').select('*').eq('user_id', user.id)
        ]);

        // Compile export data
        const exportData = {
            exportDate: new Date().toISOString(),
            exportVersion: '1.0',
            platform: 'PPSDM KMITS',
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.created_at,
                profile: profile || null
            },
            assessments: {
                sessions: sessions || [],
                responses: responses || [],
                results: results || [],
                holisticResults: holisticResults || [],
                progress: progress || []
            },
            metadata: {
                totalSessions: sessions?.length || 0,
                totalResponses: responses?.length || 0,
                dimensionsCompleted: [...new Set(results?.map(r => r.dimension) || [])].length
            }
        };

        // Log the data export for audit (non-blocking)
        try {
            const ip = request.headers.get('x-forwarded-for') || 'unknown';
            const userAgent = request.headers.get('user-agent') || 'unknown';

            await supabase.from('security_audit_logs').insert({
                user_id: user.id,
                action: 'DATA_EXPORT_GENERATED',
                resource: 'user_data_export',
                severity: 'warning', // Exporting all data is sensitive
                ip_address: ip,
                user_agent: userAgent,
                details: {
                    exportedMetadata: exportData.metadata,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (e) { /* Non-blocking */ }

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="ppsdm-kmits-data-export-${new Date().toISOString().split('T')[0]}.json"`
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/user/data - Request account deletion (UU PDP Compliance)
 * Implements 14-day soft delete with grace period
 */
export async function DELETE(request: NextRequest) {
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

        // Check for confirmation in request body
        const body = await request.json().catch(() => ({}));
        const { confirmDeletion, reason } = body;

        if (!confirmDeletion) {
            return NextResponse.json({
                error: 'Please confirm deletion by sending { confirmDeletion: true }',
                warning: 'This action will schedule your account for deletion in 14 days. All your data will be permanently removed.',
                gracePeriodDays: 14
            }, { status: 400 });
        }

        // Calculate deletion date (14-day grace period)
        const deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 14);

        // Mark user for deletion (soft delete)
        const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
                deletion_requested_at: new Date().toISOString(),
                deletion_scheduled_for: deletionDate.toISOString(),
                deletion_reason: reason || 'User requested',
                status: 'pending_deletion'
            })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to process deletion request' },
                { status: 500 }
            );
        }

        // Log the deletion request for audit (non-blocking)
        try {
            const ip = request.headers.get('x-forwarded-for') || 'unknown';
            const userAgent = request.headers.get('user-agent') || 'unknown';

            await supabase.from('security_audit_logs').insert({
                user_id: user.id,
                action: 'ACCOUNT_DELETION_REQUESTED',
                resource: 'user_profile',
                resource_id: user.id,
                severity: 'critical',
                ip_address: ip,
                user_agent: userAgent,
                details: {
                    reason: reason || 'User requested',
                    scheduledFor: deletionDate.toISOString(),
                    requestedAt: new Date().toISOString()
                }
            });
        } catch { /* Audit log failure shouldn't block request */ }

        return NextResponse.json({
            success: true,
            message: 'Account deletion scheduled',
            deletionScheduledFor: deletionDate.toISOString(),
            gracePeriodDays: 14,
            cancelUrl: '/api/user/data/cancel-deletion',
            note: 'You can cancel this request within 14 days by logging in and visiting the cancel URL.'
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process deletion request' },
            { status: 500 }
        );
    }
}
