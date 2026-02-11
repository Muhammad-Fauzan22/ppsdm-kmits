

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase not configured');
    return createClient(url, key);
}

export async function GET() {
    try {
        const supabase = getSupabaseClient();
        // Get counts for each dimension
        const dimensions = [
            'cognitive', 'self_management', 'financial', 'physical',
            'emotional', 'mental_health', 'character', 'spiritual', 'environmental'
        ];

        const stats = {
            total_modules: 0,
            total_interventions: 0,
            total_quizzes: 0,
            total_audio: 0,
            total_pdf: 0,
            by_dimension: {} as Record<string, any>
        };

        // Get module counts
        const { count: modulesCount } = await supabase
            .from('learning_modules')
            .select('*', { count: 'exact', head: true });
        stats.total_modules = modulesCount || 0;

        // Get intervention counts
        const { count: interventionsCount } = await supabase
            .from('interventions')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);
        stats.total_interventions = interventionsCount || 0;

        // Get quiz counts
        const { count: quizCount } = await supabase
            .from('module_quizzes')
            .select('*', { count: 'exact', head: true });
        stats.total_quizzes = quizCount || 0;

        // Get format counts
        const { count: audioCount } = await supabase
            .from('module_formats')
            .select('*', { count: 'exact', head: true })
            .eq('format_type', 'audio');
        stats.total_audio = audioCount || 0;

        const { count: pdfCount } = await supabase
            .from('module_formats')
            .select('*', { count: 'exact', head: true })
            .eq('format_type', 'pdf');
        stats.total_pdf = pdfCount || 0;

        // Get per-dimension stats
        for (const dim of dimensions) {
            const { count: dimModules } = await supabase
                .from('learning_modules')
                .select('*', { count: 'exact', head: true })
                .eq('dimension', dim);

            const { count: dimInterventions } = await supabase
                .from('interventions')
                .select('*', { count: 'exact', head: true })
                .eq('dimension', dim)
                .eq('is_active', true);

            stats.by_dimension[dim] = {
                modules: dimModules || 0,
                interventions: dimInterventions || 0
            };
        }

        return NextResponse.json({
            success: true,
            data: stats,
            generated_at: new Date().toISOString()
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
