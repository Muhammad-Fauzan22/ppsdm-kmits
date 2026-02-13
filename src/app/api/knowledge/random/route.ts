import { NextResponse } from 'next/server';
import { getKnowledgeSupabase } from '@/lib/knowledge/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/knowledge/random — Single random knowledge item for the floating widget
 */
export async function GET() {
    try {
        const supabase = getKnowledgeSupabase();

        // Get total count
        const { count } = await supabase
            .from('knowledge_items')
            .select('*', { count: 'exact', head: true })
            .eq('is_current', true);

        if (!count || count === 0) {
            return NextResponse.json({ success: true, data: null });
        }

        // Get random offset
        const randomOffset = Math.floor(Math.random() * count);

        const { data, error } = await supabase
            .from('knowledge_items')
            .select('*')
            .eq('is_current', true)
            .order('published_at', { ascending: false })
            .range(randomOffset, randomOffset)
            .single();

        if (error) throw error;

        return NextResponse.json(
            { success: true, data },
            { headers: { 'Cache-Control': 'no-cache, no-store' } }
        );
    } catch (error) {
        console.error('[API] /api/knowledge/random error:', error);
        return NextResponse.json(
            { success: false, data: null, error: 'Failed to fetch random item' },
            { status: 500 }
        );
    }
}
