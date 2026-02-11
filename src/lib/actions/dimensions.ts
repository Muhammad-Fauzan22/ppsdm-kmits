/**
 * Server Actions for PPSDM KMM 9 Dimensions System
 * 
 * These server actions handle mutations for:
 * - submitAssessment(): Submit new assessment scores
 * - updateGoalProgress(): Update goal progress
 * - logActivity(): Log new activity
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createActionClient, handleSupabaseError } from '@/lib/supabase/server'
import {
    dimensionScoreInputSchema,
    goalUpdateSchema,
    activityInputSchema,
    calculateOverallIndex,
    validateMilestones,
    type DimensionScoreInput,
    type GoalUpdate,
    type ActivityInput,
    type Milestone,
} from '@/lib/db/schema'

/**
 * Server Action: Submit assessment scores
 * Updates dimension scores and creates assessment record
 */
export async function submitAssessment(
    scores: DimensionScoreInput,
    assessmentData?: {
        dimension: string
        title: string
        description?: string
        responses?: Record<string, unknown>
        metadata?: Record<string, unknown>
        durationSeconds?: number
    }
) {
    try {
        const supabase = await createActionClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Validate scores
        const validationResult = dimensionScoreInputSchema.safeParse(scores)
        if (!validationResult.success) {
            return {
                success: false,
                error: 'Invalid scores data',
                details: validationResult.error.errors,
            }
        }

        const validatedScores = validationResult.data
        const overallIndex = calculateOverallIndex(validatedScores)

        // Check if user has existing dimension scores
        const { data: existingScores } = await supabase
            .from('dimension_scores')
            .select('id')
            .eq('user_id', user.id)
            .single()

        let dimensionResult
        if (existingScores) {
            // Update existing scores
            const { data, error } = await supabase
                .from('dimension_scores')
                .update({
                    ...validatedScores,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', user.id)
                .select()
                .single()

            if (error) {
                return handleSupabaseError(error)
            }
            dimensionResult = data
        } else {
            // Insert new scores
            const { data, error } = await supabase
                .from('dimension_scores')
                .insert({
                    user_id: user.id,
                    ...validatedScores,
                })
                .select()
                .single()

            if (error) {
                return handleSupabaseError(error)
            }
            dimensionResult = data
        }

        // Create assessment record if provided
        if (assessmentData) {
            const { error: assessmentError } = await supabase
                .from('assessments')
                .insert({
                    user_id: user.id,
                    dimension: assessmentData.dimension,
                    title: assessmentData.title,
                    description: assessmentData.description,
                    score: validatedScores[assessmentData.dimension as keyof DimensionScoreInput] as number,
                    max_score: 100,
                    responses: assessmentData.responses || {},
                    metadata: assessmentData.metadata || {},
                    started_at: new Date(Date.now() - (assessmentData.durationSeconds || 0) * 1000).toISOString(),
                    completed_at: new Date().toISOString(),
                    duration_seconds: assessmentData.durationSeconds,
                })

            if (assessmentError) {
                }
        }

        // Log activity
        await supabase.from('activities').insert({
            user_id: user.id,
            type: 'assessment_completed',
            title: 'Assessment Completed',
            description: `Overall index updated to ${overallIndex}`,
            xp_earned: 10,
            metadata: {
                overall_index: overallIndex,
                scores: validatedScores,
            },
        })

        // Revalidate dashboard
        revalidatePath('/dashboard')
        revalidatePath('/assessments')

        return {
            success: true,
            data: dimensionResult,
            overallIndex,
        }
    } catch (error) {
        return { success: false, error: 'Internal server error' }
    }
}

/**
 * Server Action: Update goal progress
 * Updates goal progress and milestones, handles completion
 */
export async function updateGoalProgress(
    goalId: string,
    updates: Partial<GoalUpdate> & { milestones?: Milestone[] }
) {
    try {
        const supabase = await createActionClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Validate updates
        const validationResult = goalUpdateSchema.safeParse(updates)
        if (!validationResult.success) {
            return {
                success: false,
                error: 'Invalid update data',
                details: validationResult.error.errors,
            }
        }

        // Validate milestones if provided
        if (updates.milestones) {
            const validation = validateMilestones(updates.milestones)
            if (!validation.valid) {
                return { success: false, error: validation.error }
            }

            // Calculate progress based on milestones
            const completedCount = updates.milestones.filter((m) => m.completed).length
            const totalCount = updates.milestones.length
            updates.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

            // Auto-complete if all milestones done
            if (updates.progress === 100 && !updates.status) {
                updates.status = 'completed'
            }
        }

        // Update the goal
        const { data: goal, error } = await supabase
            .from('goals')
            .update({
                ...validationResult.data,
                ...updates,
                updated_at: new Date().toISOString(),
                ...(updates.status === 'completed' && { completed_at: new Date().toISOString() }),
            })
            .eq('id', goalId)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            return handleSupabaseError(error)
        }

        // Determine activity type and XP
        let activityType = 'goal_updated'
        let xpEarned = 5
        let title = 'Goal Updated'

        if (updates.status === 'completed') {
            activityType = 'goal_completed'
            xpEarned = 50
            title = 'Goal Completed!'
        } else if (updates.milestones) {
            const completedCount = updates.milestones.filter((m) => m.completed).length
            if (completedCount > 0) {
                activityType = 'milestone_reached'
                xpEarned = 15
                title = 'Milestone Reached'
            }
        }

        // Log activity
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

        // Update user XP
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('total_xp, level')
            .eq('id', user.id)
            .single()

        if (profile) {
            const newTotalXp = (profile.total_xp || 0) + xpEarned
            const newLevel = calculateLevel(newTotalXp)

            const updateData: { total_xp: number; level?: number } = { total_xp: newTotalXp }
            if (newLevel > (profile.level || 1)) {
                updateData.level = newLevel

                // Log level up
                await supabase.from('activities').insert({
                    user_id: user.id,
                    type: 'level_up',
                    title: 'Level Up!',
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

        // Revalidate paths
        revalidatePath('/goals')
        revalidatePath('/dashboard')

        return { success: true, data: goal }
    } catch (error) {
        return { success: false, error: 'Internal server error' }
    }
}

/**
 * Server Action: Log new activity
 * Creates activity record and updates user XP
 */
export async function logActivity(activityData: ActivityInput) {
    try {
        const supabase = await createActionClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Validate activity data
        const validationResult = activityInputSchema.safeParse(activityData)
        if (!validationResult.success) {
            return {
                success: false,
                error: 'Invalid activity data',
                details: validationResult.error.errors,
            }
        }

        const validatedData = validationResult.data

        // Create activity
        const { data: activity, error } = await supabase
            .from('activities')
            .insert({
                user_id: user.id,
                ...validatedData,
            })
            .select()
            .single()

        if (error) {
            return handleSupabaseError(error)
        }

        // Update user XP if earned
        if (validatedData.xp_earned > 0) {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('total_xp, level')
                .eq('id', user.id)
                .single()

            if (profile) {
                const newTotalXp = (profile.total_xp || 0) + validatedData.xp_earned
                const newLevel = calculateLevel(newTotalXp)

                const updateData: { total_xp: number; level?: number } = { total_xp: newTotalXp }
                if (newLevel > (profile.level || 1)) {
                    updateData.level = newLevel

                    // Log level up
                    await supabase.from('activities').insert({
                        user_id: user.id,
                        type: 'level_up',
                        title: 'Level Up!',
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

        // Revalidate dashboard
        revalidatePath('/dashboard')

        return { success: true, data: activity }
    } catch (error) {
        return { success: false, error: 'Internal server error' }
    }
}

/**
 * Server Action: Create a new goal
 */
export async function createGoal(
    goalData: {
        title: string
        description?: string
        category: string
        target_dimension?: string
        priority?: number
        target_date?: string
        milestones?: Milestone[]
    }
) {
    try {
        const supabase = await createActionClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Validate milestones if provided
        if (goalData.milestones && goalData.milestones.length > 0) {
            const validation = validateMilestones(goalData.milestones)
            if (!validation.valid) {
                return { success: false, error: validation.error }
            }
        }

        // Create goal
        const { data: goal, error } = await supabase
            .from('goals')
            .insert({
                user_id: user.id,
                ...goalData,
                status: 'active',
                progress: 0,
            })
            .select()
            .single()

        if (error) {
            return handleSupabaseError(error)
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

        // Revalidate paths
        revalidatePath('/goals')
        revalidatePath('/dashboard')

        return { success: true, data: goal }
    } catch (error) {
        return { success: false, error: 'Internal server error' }
    }
}

/**
 * Server Action: Delete a goal
 */
export async function deleteGoal(goalId: string) {
    try {
        const supabase = await createActionClient()

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Unauthorized' }
        }

        // Delete goal
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', goalId)
            .eq('user_id', user.id)

        if (error) {
            return handleSupabaseError(error)
        }

        // Revalidate paths
        revalidatePath('/goals')
        revalidatePath('/dashboard')

        return { success: true, data: { message: 'Goal deleted successfully' } }
    } catch (error) {
        return { success: false, error: 'Internal server error' }
    }
}

/**
 * Calculate user level based on total XP
 */
function calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1
}
