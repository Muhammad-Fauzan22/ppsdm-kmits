/**
 * Goals API Route
 * 
 * GET: List user goals
 * POST: Create new goal
 * PATCH: Update goal progress
 * DELETE: Delete goal
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, requireAuth, handleSupabaseError } from '@/lib/supabase/server'
import { goalInputSchema, goalUpdateSchema, validateMilestones } from '@/lib/db/schema'
import { z } from 'zod'

/**
 * GET /api/goals
 * List user goals with optional filtering
 */
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Get query parameters
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Build query
        let query = supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (status) {
            query = query.eq('status', status)
        }

        if (category) {
            query = query.eq('category', category)
        }

        const { data: goals, error } = await query

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        // Get total count
        const { count, error: countError } = await supabase
            .from('goals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        if (countError) {
            }

        return NextResponse.json({
            success: true,
            data: goals || [],
            meta: {
                total: count || 0,
                limit,
                offset,
            },
        })
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
 * POST /api/goals
 * Create new goal
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Parse and validate request body
        const body = await request.json()
        const validationResult = goalInputSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request data',
                    details: validationResult.error.errors,
                },
                { status: 400 }
            )
        }

        const goalData = validationResult.data

        // Validate milestones if provided
        if (goalData.milestones && goalData.milestones.length > 0) {
            const validation = validateMilestones(goalData.milestones)
            if (!validation.valid) {
                return NextResponse.json(
                    { success: false, error: validation.error },
                    { status: 400 }
                )
            }
        }

        // Create the goal
        const { data: goal, error } = await supabase
            .from('goals')
            .insert({
                user_id: user.id,
                ...goalData,
            })
            .select()
            .single()

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        // Log activity
        await supabase.from('activities').insert({
            user_id: user.id,
            type: 'goal_created',
            title: 'New Goal Created',
            description: goal.title,
            xp_earned: 20,
            related_entity_type: 'goal',
            related_entity_id: goal.id,
            metadata: {
                category: goal.category,
                target_dimension: goal.target_dimension,
            },
        })

        return NextResponse.json({ success: true, data: goal }, { status: 201 })
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
 * PATCH /api/goals
 * Update goal progress or other fields
 */
export async function PATCH(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Parse and validate request body
        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Goal ID is required' },
                { status: 400 }
            )
        }

        const validationResult = goalUpdateSchema.safeParse(updateData)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request data',
                    details: validationResult.error.errors,
                },
                { status: 400 }
            )
        }

        // Validate milestones if provided
        if (updateData.milestones && updateData.milestones.length > 0) {
            const validation = validateMilestones(updateData.milestones)
            if (!validation.valid) {
                return NextResponse.json(
                    { success: false, error: validation.error },
                    { status: 400 }
                )
            }
        }

        // Update the goal
        const { data: goal, error } = await supabase
            .from('goals')
            .update({
                ...validationResult.data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('user_id', user.id) // Ensure user owns this goal
            .select()
            .single()

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        // Log activity based on what was updated
        let activityType = 'goal_updated'
        let xpEarned = 5
        let title = 'Goal Updated'

        if (updateData.status === 'completed') {
            activityType = 'goal_completed'
            xpEarned = 50
            title = 'Goal Completed!'
        } else if (updateData.milestones) {
            const completedCount = updateData.milestones.filter((m: { completed: boolean }) => m.completed).length
            if (completedCount > 0) {
                activityType = 'milestone_reached'
                xpEarned = 15
                title = 'Milestone Reached'
            }
        }

        await supabase.from('activities').insert({
            user_id: user.id,
            type: activityType,
            title,
            description: goal.title,
            xp_earned: xpEarned,
            related_entity_type: 'goal',
            related_entity_id: goal.id,
            metadata: {
                progress: goal.progress,
                status: goal.status,
            },
        })

        return NextResponse.json({ success: true, data: goal })
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
 * DELETE /api/goals
 * Delete a goal
 */
export async function DELETE(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Get goal ID from query params
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Goal ID is required' },
                { status: 400 }
            )
        }

        // Delete the goal (RLS will ensure user owns it)
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        return NextResponse.json({
            success: true,
            data: { message: 'Goal deleted successfully' },
        })
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
