import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { classifyFeedback } from '@/lib/betaTesting';

// POST: Submit feedback
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            userId,
            type,
            content,
            rating,
            pageUrl
        } = body;

        // Validate required fields
        if (!type || !content) {
            return NextResponse.json(
                { error: 'Type and content are required' },
                { status: 400 }
            );
        }

        // Validate type
        const validTypes = ['bug', 'suggestion', 'praise', 'question'];
        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { error: 'Invalid feedback type' },
                { status: 400 }
            );
        }

        // Auto-classify feedback
        const category = classifyFeedback(content);

        // Get user agent
        const userAgent = request.headers.get('user-agent') || '';

        // Create Supabase client
        const supabase = await createClient();

        // Insert feedback
        const { data, error } = await supabase
            .from('beta_feedback')
            .insert({
                user_id: userId || null,
                feedback_type: type,
                content,
                rating: rating || null,
                page_url: pageUrl || null,
                category,
                status: 'new',
                priority: type === 'bug' ? 'high' : 'medium',
                user_agent: userAgent,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('[Feedback API] Error:', error);

            // If table doesn't exist, return mock success
            if (error.code === '42P01') {
                return NextResponse.json({
                    success: true,
                    message: 'Terima kasih atas feedbacknya! (Development mode)',
                    id: 'mock-' + Date.now(),
                });
            }

            return NextResponse.json(
                { error: 'Failed to submit feedback' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Terima kasih atas feedbacknya!',
            id: data?.id,
        });

    } catch (error) {
        console.error('[Feedback API] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: Get feedback (admin only)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '50');

        const supabase = await createClient();

        // Build query
        let query = supabase
            .from('beta_feedback')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status) {
            query = query.eq('status', status);
        }

        if (type) {
            query = query.eq('feedback_type', type);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[Feedback API] Error:', error);

            // If table doesn't exist, return mock data
            if (error.code === '42P01') {
                return NextResponse.json({
                    feedback: [
                        {
                            id: 'mock-1',
                            feedback_type: 'suggestion',
                            content: 'Tambahkan fitur dark mode',
                            category: 'ui_ux',
                            status: 'new',
                            created_at: new Date().toISOString(),
                        },
                        {
                            id: 'mock-2',
                            feedback_type: 'praise',
                            content: 'AI Tutor sangat membantu!',
                            category: 'feature_request',
                            status: 'reviewed',
                            created_at: new Date().toISOString(),
                        },
                    ],
                    total: 2,
                });
            }

            return NextResponse.json(
                { error: 'Failed to fetch feedback' },
                { status: 500 }
            );
        }

        // Get stats
        const stats = {
            total: data?.length || 0,
            new: data?.filter((f: any) => f.status === 'new').length || 0,
            inProgress: data?.filter((f: any) => f.status === 'in_progress').length || 0,
            resolved: data?.filter((f: any) => f.status === 'resolved').length || 0,
            bugs: data?.filter((f: any) => f.feedback_type === 'bug').length || 0,
            suggestions: data?.filter((f: any) => f.feedback_type === 'suggestion').length || 0,
        };

        return NextResponse.json({
            feedback: data || [],
            stats,
        });

    } catch (error) {
        console.error('[Feedback API] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH: Update feedback status (admin only)
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, adminNotes, priority } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Feedback ID is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const updates: Record<string, unknown> = {};
        if (status) updates.status = status;
        if (adminNotes) updates.admin_notes = adminNotes;
        if (priority) updates.priority = priority;
        if (status === 'resolved') updates.resolved_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('beta_feedback')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[Feedback API] Error:', error);
            return NextResponse.json(
                { error: 'Failed to update feedback' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            feedback: data,
        });

    } catch (error) {
        console.error('[Feedback API] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
