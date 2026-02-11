import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// API Route for persisting assessment results
// Uses Supabase for storage with proper authentication

// Assessment result interface
interface AssessmentResult {
    userId: string;
    dimension: string;
    score: number;
    percentile: number;
    category: string;
    responses: Record<string, number>;
    subdimensions?: Record<string, number>;
    completedAt: string;
}

// POST: Save assessment result
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignore if called from server component
                        }
                    },
                },
            }
        );

        // Get current user - require authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login to save assessment results' },
                { status: 401 }
            );
        }

        const body: AssessmentResult = await request.json();

        // Validate required fields
        if (!body.dimension || body.score === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: dimension, score' },
                { status: 400 }
            );
        }

        // Save to Supabase with authenticated user_id
        const { data, error } = await supabase
            .from('assessment_results')
            .insert([{
                user_id: user.id, // Use authenticated user ID
                dimension: body.dimension,
                score: body.score,
                percentile: body.percentile,
                category: body.category,
                responses: body.responses,
                subdimensions: body.subdimensions,
                completed_at: body.completedAt || new Date().toISOString(),
            }])
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: 'Failed to save assessment result' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Assessment saved successfully',
            data
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: Retrieve assessment results
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Ignore if called from server component
                        }
                    },
                },
            }
        );

        // Get current user - require authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login to view assessment results' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const dimension = searchParams.get('dimension');

        // Build query - only fetch results for the authenticated user
        let query = supabase
            .from('assessment_results')
            .select('*')
            .eq('user_id', user.id) // Use authenticated user ID
            .order('completed_at', { ascending: false });

        if (dimension) {
            query = query.eq('dimension', dimension);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: 'Failed to fetch assessment results' },
                { status: 500 }
            );
        }

        // Return empty array if no results (user hasn't taken any assessments)
        return NextResponse.json({
            success: true,
            data: data || [],
            count: data?.length || 0
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
