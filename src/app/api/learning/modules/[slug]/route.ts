import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        throw new Error('Supabase credentials not configured');
    }
    return createClient(url, key);
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const supabase = getSupabaseClient();

        // Fetch module with all related data
        const { data: module, error } = await supabase
            .from('learning_modules')
            .select(`
                *,
                module_formats (
                    id,
                    format_type,
                    file_url,
                    duration_seconds,
                    page_count,
                    file_size_bytes
                ),
                module_quizzes (
                    id,
                    title,
                    question_count,
                    passing_score,
                    time_limit_seconds
                )
            `)
            .eq('slug', slug)
            .single();

        if (error || !module) {
            return NextResponse.json(
                { success: false, error: 'Module not found' },
                { status: 404 }
            );
        }

        // Get related modules (same dimension)
        const { data: related } = await supabase
            .from('learning_modules')
            .select('id, title, slug, description, difficulty, estimated_minutes')
            .eq('dimension', module.dimension)
            .neq('id', module.id)
            .eq('status', 'published')
            .limit(3);

        return NextResponse.json({
            success: true,
            data: {
                ...module,
                related_modules: related || []
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Server error' },
            { status: 500 }
        );
    }
}
