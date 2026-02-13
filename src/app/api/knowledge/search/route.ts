import { NextResponse } from 'next/server';
import { getKnowledgeSupabase } from '@/lib/knowledge/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/knowledge/search?q=... — Full-text search across knowledge items
 */
export async function GET(request: Request) {
    try {
        const supabase = getKnowledgeSupabase();
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q')?.trim();
        const limit = Math.min(20, Math.max(1, parseInt(searchParams.get('limit') || '10')));

        if (!q || q.length < 2) {
            return NextResponse.json(
                { success: false, data: [], error: 'Query must be at least 2 characters' },
                { status: 400 }
            );
        }

        // Use Postgres full-text search with the generated tsvector column
        const { data, error } = await supabase
            .from('knowledge_items')
            .select('*')
            .eq('is_current', true)
            .textSearch('fts', q, { type: 'websearch', config: 'indonesian' })
            .limit(limit);

        if (error) {
            // Fallback to ILIKE search if FTS fails
            console.warn('[API] FTS failed, falling back to ILIKE:', error.message);

            const { data: fallbackData, error: fallbackError } = await supabase
                .from('knowledge_items')
                .select('*')
                .eq('is_current', true)
                .or(`title.ilike.%${q}%,summary.ilike.%${q}%,content.ilike.%${q}%`)
                .limit(limit);

            if (fallbackError) throw fallbackError;

            return NextResponse.json({
                success: true,
                data: fallbackData || [],
                meta: { query: q, method: 'ilike' },
            });
        }

        return NextResponse.json({
            success: true,
            data: data || [],
            meta: { query: q, method: 'fts' },
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
        });
    } catch (error) {
        console.error('[API] /api/knowledge/search error:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Search failed' },
            { status: 500 }
        );
    }
}
