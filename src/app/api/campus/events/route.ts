/**
 * Campus Events API
 * GET /api/campus/events?month=3&year=2026&category=seminar
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCampusSupabase } from '@/lib/campus/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const supabase = getCampusSupabase();
        let query = supabase
            .from('campus_events')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .order('date_start', { ascending: true });

        // Filter by month/year
        if (month && year) {
            const startDate = `${year}-${month.padStart(2, '0')}-01`;
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            const endDateStr = `${year}-${month.padStart(2, '0')}-${endDate.getDate()}`;
            query = query.gte('date_start', startDate).lte('date_start', endDateStr);
        } else if (year) {
            query = query.gte('date_start', `${year}-01-01`).lte('date_start', `${year}-12-31`);
        }

        if (category && category !== 'semua') {
            query = query.eq('category', category);
        }

        if (status) {
            query = query.eq('status', status);
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data: data || [],
            total: count || 0,
            limit,
            offset,
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
            },
        });
    } catch (err) {
        console.error('Campus Events API error:', err);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}
