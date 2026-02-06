/**
 * Activities API Route
 * 
 * GET: Get recent activities
 * POST: Log new activity
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, requireAuth, handleSupabaseError } from '@/lib/supabase/server'
import { activityInputSchema, ACTIVITY_TYPES } from '@/lib/db/schema'
import { z } from 'zod'

/**
 * GET /api/activities
 * Get recent activities for the current user
 */
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Parse query parameters
        const { searchParams } = new URL(request.url)
        const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
        const offset = parseInt(searchParams.get('offset') || '0')
        const type = searchParams.get('type')
        const unreadOnly = searchParams.get('unread') === 'true'

        // Build query
        let query = supabase
            .from('activities')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (type) {
            query = query.eq('type', type)
        }

        const { data: activities, error } = await query

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        // Get total count
        let countQuery = supabase
            .from('activities')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        if (type) {
            countQuery = countQuery.eq('type', type)
        }

        const { count, error: countError } = await countQuery

        if (countError) {
            console.error('Error counting activities:', countError)
        }

        // Get activity summary by type
        const { data: summary, error: summaryError } = await supabase
            .from('activities')
            .select('type')
            .eq('user_id', user.id)

        const typeCounts: Record<string, number> = {}
        if (summary) {
            summary.forEach((activity: any) => {
                typeCounts[activity.type] = (typeCounts[activity.type] || 0) + 1
            })
        }

        return NextResponse.json({
            success: true,
            data: activities || [],
            meta: {
                total: count || 0,
                limit,
                offset,
                typeCounts,
            },
        })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }
        console.error('Error fetching activities:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/activities
 * Log a new activity
 */
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Parse and validate request body
        const body = await request.json()
        const validationResult = activityInputSchema.safeParse(body)

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

        const activityData = validationResult.data

        // Validate activity type
        if (!ACTIVITY_TYPES.includes(activityData.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Invalid activity type. Must be one of: ${ACTIVITY_TYPES.join(', ')}`,
                },
                { status: 400 }
            )
        }

        // Create the activity
        const { data: activity, error } = await supabase
            .from('activities')
            .insert({
                user_id: user.id,
                ...activityData,
            })
            .select()
            .single()

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        // Update user XP if XP was earned
        if (activityData.xp_earned && activityData.xp_earned > 0) {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('total_xp, level')
                .eq('id', user.id)
                .single()

            if (profile) {
                const newTotalXp = (profile.total_xp || 0) + activityData.xp_earned
                const newLevel = calculateLevel(newTotalXp)

                const updateData: { total_xp: number; level?: number } = { total_xp: newTotalXp }
                if (newLevel > (profile.level || 1)) {
                    updateData.level = newLevel

                    // Log level up activity
                    await supabase.from('activities').insert({
                        user_id: user.id,
                        type: 'level_up',
                        title: `Level Up!`,
                        description: `You reached level ${newLevel}`,
                        xp_earned: 0,
                        metadata: {
                            previous_level: profile.level,
                            new_level: newLevel,
                        },
                    })
                }

                await supabase.from('user_profiles').update(updateData).eq('id', user.id)
            }
        }

        return NextResponse.json({ success: true, data: activity }, { status: 201 })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }
        console.error('Error creating activity:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * Calculate user level based on total XP
 */
function calculateLevel(xp: number): number {
    // Simple level formula: level = floor(sqrt(xp / 100)) + 1
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    // etc.
    return Math.floor(Math.sqrt(xp / 100)) + 1
}
