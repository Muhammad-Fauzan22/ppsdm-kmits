import { NextResponse } from 'next/server';
import { getKnowledgeResources } from '@/lib/google-sheets/sheets-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const difficulty = searchParams.get('difficulty');
        const search = searchParams.get('q');

        let data = await getKnowledgeResources();

        if (category) data = data.filter((k) => k.Kategori?.toLowerCase() === category.toLowerCase());
        if (difficulty) data = data.filter((k) => k.Tingkat?.toLowerCase() === difficulty.toLowerCase());
        if (search) {
            const q = search.toLowerCase();
            data = data.filter((k) =>
                k.Judul?.toLowerCase().includes(q) ||
                k.Tag?.some((t) => t.toLowerCase().includes(q)) ||
                k.Kategori?.toLowerCase().includes(q)
            );
        }

        return NextResponse.json({
            success: true,
            data,
            meta: {
                source: 'sheets',
                fetchedAt: new Date().toISOString(),
                sheetName: 'Knowledge',
                totalRecords: data.length,
            },
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' },
        });
    } catch (error) {
        console.error('[API] /api/sheets/knowledge error:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Failed to fetch knowledge resources' },
            { status: 500 }
        );
    }
}
