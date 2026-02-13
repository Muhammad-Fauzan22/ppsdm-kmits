import { NextResponse } from 'next/server';
import { getActivities } from '@/lib/google-sheets/sheets-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let data = await getActivities();

        if (status) {
            data = data.filter((a) => a.Status === status);
        }

        return NextResponse.json({
            success: true,
            data,
            meta: {
                source: 'sheets',
                fetchedAt: new Date().toISOString(),
                sheetName: 'Activities',
                totalRecords: data.length,
            },
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
        });
    } catch (error) {
        console.error('[API] /api/sheets/activities error:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Failed to fetch activities' },
            { status: 500 }
        );
    }
}
