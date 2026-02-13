import { NextResponse } from 'next/server';
import { getMembers } from '@/lib/google-sheets/sheets-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const department = searchParams.get('department');
        const divisi = searchParams.get('divisi');

        let data = await getMembers();

        if (year) data = data.filter((m) => m.Angkatan === year);
        if (department) data = data.filter((m) => m.Departemen?.toLowerCase().includes(department.toLowerCase()));
        if (divisi) data = data.filter((m) => m.Divisi?.toLowerCase().includes(divisi.toLowerCase()));

        return NextResponse.json({
            success: true,
            data,
            meta: {
                source: 'sheets',
                fetchedAt: new Date().toISOString(),
                sheetName: 'Members',
                totalRecords: data.length,
            },
        }, {
            headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=120' },
        });
    } catch (error) {
        console.error('[API] /api/sheets/members error:', error);
        return NextResponse.json(
            { success: false, data: [], error: 'Failed to fetch members' },
            { status: 500 }
        );
    }
}
