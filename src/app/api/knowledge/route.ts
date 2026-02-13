import { NextResponse } from 'next/server';
import { getKnowledgeSupabase } from '@/lib/knowledge/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/knowledge — Paginated list of knowledge items
 * Query params: page, limit, category
 */
export async function GET(request: Request) {
    try {
        const supabase = getKnowledgeSupabase();
        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')));
        const category = searchParams.get('category');
        const offset = (page - 1) * limit;

        let query = supabase
            .from('knowledge_items')
            .select('*', { count: 'exact' })
            .eq('is_current', true)
            .order('published_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (category && category !== 'all') {
            query = query.eq('category', category);
        }

        const { data, count, error } = await query;

        if (error) throw error;

        const total = count || 0;

        return NextResponse.json({
            success: true,
            data: data || [],
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
        });
    } catch (error) {
        console.error('[API] /api/knowledge error:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Failed to fetch knowledge items' },
            { status: 500 }
        );
    }
}
