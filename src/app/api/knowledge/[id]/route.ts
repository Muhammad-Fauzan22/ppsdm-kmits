import { NextResponse } from 'next/server';
import { getKnowledgeSupabase } from '@/lib/knowledge/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/knowledge/[id] — Single knowledge item detail
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = getKnowledgeSupabase();
        const { id } = await params;

        const { data, error } = await supabase
            .from('knowledge_items')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!data) {
            return NextResponse.json(
                { success: false, data: null, error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data },
            { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' } }
        );
    } catch (error) {
        console.error('[API] /api/knowledge/[id] error:', error);
        return NextResponse.json(
            { success: false, data: null, error: 'Failed to fetch item' },
            { status: 500 }
        );
    }
}
