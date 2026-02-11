import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Supabase not configured');
    return createClient(url, key);
}

export async function GET(request: NextRequest) {
    try {
        const supabase = getSupabaseClient();
        const { searchParams } = new URL(request.url);
        const dimension = searchParams.get('dimension');
        const difficulty = searchParams.get('difficulty');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Build query
        let query = supabase
            .from('learning_modules')
            .select(`
        id,
        title,
        slug,
        description,
        dimension,
        topics,
        difficulty,
        estimated_minutes,
        quality_score,
        created_at,
        module_formats (
          format_type,
          file_url,
          duration_seconds,
          page_count
        )
      `)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

        // Apply filters
        if (dimension) {
            query = query.eq('dimension', dimension);
        }

        if (difficulty) {
            query = query.eq('difficulty', difficulty);
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: data || [],
            pagination: {
                offset,
                limit,
                total: count
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
