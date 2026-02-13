import { NextResponse } from 'next/server';
import { getFinances, getFinanceSummary } from '@/lib/google-sheets/sheets-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const summary = searchParams.get('summary');
        const category = searchParams.get('category');

        if (summary === 'true') {
            const data = await getFinanceSummary();
            return NextResponse.json({
                success: true,
                data,
                meta: {
                    source: 'sheets',
                    fetchedAt: new Date().toISOString(),
                    sheetName: 'Finances',
                    totalRecords: data.transaksiTerakhir.length,
                },
            });
        }

        let data = await getFinances();

        if (category) {
            data = data.filter((f) => f.Kategori?.toLowerCase() === category.toLowerCase());
        }

        return NextResponse.json({
            success: true,
            data,
            meta: {
                source: 'sheets',
                fetchedAt: new Date().toISOString(),
                sheetName: 'Finances',
                totalRecords: data.length,
            },
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
        });
    } catch (error) {
        console.error('[API] /api/sheets/finances error:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Failed to fetch finances' },
            { status: 500 }
        );
    }
}
