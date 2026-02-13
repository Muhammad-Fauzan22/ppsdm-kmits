/**
 * Alumni Directory API
 * GET /api/campus/alumni?search=toyota&angkatan=2016&department=Teknik+Mesin
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCampusSupabase } from '@/lib/campus/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const angkatan = searchParams.get('angkatan');
        const isMentor = searchParams.get('mentor');
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');

        const supabase = getCampusSupabase();
        let query = supabase
            .from('alumni_profiles')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('angkatan', { ascending: false });

        // Full-text search
        if (search) {
            query = query.or(
                `name.ilike.%${search}%,company.ilike.%${search}%,job_title.ilike.%${search}%,department.ilike.%${search}%`
            );
        }

        if (angkatan) {
            query = query.eq('angkatan', angkatan);
        }

        if (isMentor === 'true') {
            query = query.eq('is_mentor', true);
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        // Get unique angkatan values for filter dropdown
        const { data: angkatanList } = await supabase
            .from('alumni_profiles')
            .select('angkatan')
            .eq('is_active', true)
            .not('angkatan', 'is', null)
            .order('angkatan', { ascending: false });

        const uniqueAngkatan = [...new Set((angkatanList || []).map((a: { angkatan: string }) => a.angkatan))];

        return NextResponse.json({
            success: true,
            data: data || [],
            total: count || 0,
            limit,
            offset,
            filters: {
                angkatan: uniqueAngkatan,
            },
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (err) {
        console.error('Alumni API error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch alumni' },
            { status: 500 }
        );
    }
}
