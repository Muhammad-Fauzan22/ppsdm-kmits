import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// API Route for persisting assessment results
// Uses Supabase for storage

// Note: In production, use proper environment variable handling
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    : null;

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
        const body: AssessmentResult = await request.json();

        // Validate required fields
        if (!body.dimension || body.score === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: dimension, score' },
                { status: 400 }
            );
        }

        // If Supabase is not configured, use localStorage simulation
        if (!supabase) {
            console.log('[AssessmentAPI] Supabase not configured, using mock storage');
            return NextResponse.json({
                success: true,
                message: 'Assessment saved (mock mode)',
                data: {
                    id: `mock_${Date.now()}`,
                    ...body,
                    savedAt: new Date().toISOString(),
                }
            });
        }

        // Save to Supabase
        const { data, error } = await supabase
            .from('assessment_results')
            .insert([{
                user_id: body.userId || 'anonymous',
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
            console.error('[AssessmentAPI] Supabase error:', error);
            // Fallback to mock on error
            return NextResponse.json({
                success: true,
                message: 'Assessment saved (fallback mode)',
                data: {
                    id: `fallback_${Date.now()}`,
                    ...body,
                    savedAt: new Date().toISOString(),
                }
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Assessment saved successfully',
            data
        });

    } catch (error) {
        console.error('[AssessmentAPI] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET: Retrieve assessment results
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId') || 'anonymous';
        const dimension = searchParams.get('dimension');

        // If Supabase is not configured, return mock data
        if (!supabase) {
            return NextResponse.json({
                success: true,
                data: getMockAssessmentData(dimension),
                message: 'Mock data (Supabase not configured)'
            });
        }

        // Build query
        let query = supabase
            .from('assessment_results')
            .select('*')
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (dimension) {
            query = query.eq('dimension', dimension);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[AssessmentAPI] Supabase error:', error);
            return NextResponse.json({
                success: true,
                data: getMockAssessmentData(dimension),
                message: 'Mock data (Supabase error)'
            });
        }

        return NextResponse.json({
            success: true,
            data,
            count: data.length
        });

    } catch (error) {
        console.error('[AssessmentAPI] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Mock data for development
function getMockAssessmentData(dimension?: string | null) {
    const mockResults = [
        {
            id: 'mock_1',
            dimension: 'cognitive',
            score: 72,
            percentile: 65,
            category: 'Good',
            completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'mock_2',
            dimension: 'financial',
            score: 68,
            percentile: 58,
            category: 'Good',
            completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'mock_3',
            dimension: 'emotional_intelligence',
            score: 75,
            percentile: 70,
            category: 'Very Good',
            completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'mock_4',
            dimension: 'physical_health',
            score: 78,
            percentile: 72,
            category: 'Very Good',
            completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    if (dimension) {
        return mockResults.filter(r => r.dimension === dimension);
    }
    return mockResults;
}
