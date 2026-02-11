import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase not configured');
    return createClient(url, key);
}

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseClient();
        const { searchParams } = new URL(request.url);
        const dimension = searchParams.get('dimension');
        const userId = searchParams.get('userId');
        const scoreThreshold = parseInt(searchParams.get('score') || '100');

        // Build query for interventions
        let query = supabase
            .from('interventions')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        // Filter by dimension
        if (dimension) {
            query = query.eq('dimension', dimension);
        }

        // Filter by score threshold (for personalization)
        if (scoreThreshold < 100) {
            query = query.lte('min_score_threshold', scoreThreshold);
            query = query.or(`max_score_threshold.is.null,max_score_threshold.gte.${scoreThreshold}`);
        }

        const { data, error } = await query.limit(10);

        if (error) {
            throw error;
        }

        // Exclude completed interventions if userId provided
        let interventions = data || [];

        if (userId && interventions.length > 0) {
            const { data: completed } = await supabase
                .from('user_interactions')
                .select('content_id')
                .eq('user_id', userId)
                .eq('content_type', 'intervention')
                .eq('action', 'complete');

            const completedIds = new Set((completed || []).map(c => c.content_id));
            interventions = interventions.filter(i => !completedIds.has(i.id));
        }

        return NextResponse.json({
            success: true,
            data: interventions
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
