/**
 * Dimensions API Route
 * 
 * GET: Get user's current dimension scores
 * POST: Submit new assessment scores
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, requireAuth, handleSupabaseError } from '@/lib/supabase/server'
import { dimensionScoreInputSchema, calculateOverallIndex } from '@/lib/db/schema'
import { z } from 'zod'

/**
 * GET /api/dimensions
 * Get user's current dimension scores
 */
export async function GET() {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        const { data: scores, error } = await supabase
            .from('dimension_scores')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (error) {
            // If no scores found, create default scores
            if (error.code === 'PGRST116') {
                const { data: newScores, error: createError } = await supabase
                    .from('dimension_scores')
                    .insert({
                        user_id: user.id,
                        cognitive: 0,
                        emotional: 0,
                        spiritual: 0,
                        physical: 0,
                        creative: 0,
                        professional: 0,
                        leadership: 0,
                        financial: 0,
                        environmental: 0,
                    })
                    .select()
                    .single()

                if (createError) {
                    const { error: errMsg, status } = handleSupabaseError(createError)
                    return NextResponse.json({ success: false, error: errMsg }, { status })
                }

                return NextResponse.json({ success: true, data: newScores })
            }

            const { error: errMsg, status } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status })
        }

        return NextResponse.json({ success: true, data: scores })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/dimensions
 * Submit new assessment scores
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Parse and validate request body
        const body = await request.json()
        const validationResult = dimensionScoreInputSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Invalid request data',
                    details: validationResult.error.errors 
                },
                { status: 400 }
            )
        }

        const scores = validationResult.data
        const overallIndex = calculateOverallIndex(scores)

        // Check if user already has dimension scores
        const { data: existingScores } = await supabase
            .from('dimension_scores')
            .select('id')
            .eq('user_id', user.id)
            .single()

        let result
        if (existingScores) {
            // Update existing scores
            const { data, error } = await supabase
                .from('dimension_scores')
                .update({
                    ...scores,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
                .select()
                .single()

            if (error) {
                const { error: errMsg, status } = handleSupabaseError(error)
                return NextResponse.json({ success: false, error: errMsg }, { status })
            }

            result = data
        } else {
            // Insert new scores
            const { data, error } = await supabase
                .from('dimension_scores')
                .insert({
                    user_id: user.id,
                    ...scores,
                })
                .select()
                .single()

            if (error) {
                const { error: errMsg, status } = handleSupabaseError(error)
                return NextResponse.json({ success: false, error: errMsg }, { status })
            }

            result = data
        }

        // Log activity
        await supabase.from('activities').insert({
            user_id: user.id,
            type: 'assessment_completed',
            title: 'Assessment Updated',
            description: `Overall index: ${overallIndex}`,
            xp_earned: 10,
            metadata: {
                overall_index: overallIndex,
                scores,
            },
        })

        return NextResponse.json({ success: true, data: result })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: 'Invalid request data', details: error.errors },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
