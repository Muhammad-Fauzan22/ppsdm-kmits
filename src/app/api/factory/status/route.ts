import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Pipeline Status API
 * ====================
 * Returns current and historical pipeline run status.
 */

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase not configured');
    return createClient(url, key);
}

export async function GET() {
    try {
        const supabase = getSupabaseClient();

        // Get latest pipeline runs
        const { data: runs, error } = await supabase
            .from('pipeline_runs')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        // Get content statistics
        const [
            { count: rawCount },
            { count: modulesCount },
            { count: quizzesCount },
            { count: interventionsCount }
        ] = await Promise.all([
            supabase.from('raw_materials').select('*', { count: 'exact', head: true }),
            supabase.from('learning_modules').select('*', { count: 'exact', head: true }),
            supabase.from('module_quizzes').select('*', { count: 'exact', head: true }),
            supabase.from('interventions').select('*', { count: 'exact', head: true })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                current_status: runs?.[0]?.status || 'idle',
                last_run: runs?.[0] || null,
                history: runs || [],
                statistics: {
                    raw_materials: rawCount || 0,
                    learning_modules: modulesCount || 0,
                    quizzes: quizzesCount || 0,
                    interventions: interventionsCount || 0
                }
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to get status'
        }, { status: 500 });
    }
}
