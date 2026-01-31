
"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface CompleteModuleInput {
    moduleId: string
    userId: string
    score?: number
    xpEarned: number
}

interface CompleteModuleResult {
    success: boolean
    newXpTotal?: number
    levelUp?: boolean
    newLevel?: number
    message?: string
}

/**
 * Server action to record module completion and award XP
 * - Updates user_progress table
 * - Increments XP in profiles table
 * - Handles level-ups (every 100 XP = 1 level)
 * - Revalidates dashboard cache
 */
export async function completeModule(
    input: CompleteModuleInput
): Promise<CompleteModuleResult> {
    try {
        const supabase = await createClient()

        // 1. Update user_progress table
        const { error: progressError } = await supabase
            .from("user_progress")
            .upsert(
                {
                    user_id: input.userId,
                    module_id: input.moduleId,
                    completed_at: new Date().toISOString(),
                    quiz_score: input.score || 0,
                    xp_earned: input.xpEarned,
                },
                {
                    onConflict: "user_id,module_id",
                }
            )
            .single()

        if (progressError) {
            console.error("Progress update error:", progressError)
            throw new Error("Failed to update progress")
        }

        // 2. Get current XP from profiles
        const { data: profile, error: fetchError } = await supabase
            .from("profiles")
            .select("xp, level")
            .eq("user_id", input.userId)
            .single()

        if (fetchError) {
            console.error("Fetch profile error:", fetchError)
            throw new Error("Failed to fetch profile")
        }

        const currentXp = profile?.xp || 0
        const currentLevel = profile?.level || 1
        const newXpTotal = currentXp + input.xpEarned

        // 3. Calculate level-up (100 XP per level)
        const newLevel = Math.floor(newXpTotal / 100) + 1
        const leveledUp = newLevel > currentLevel

        // 4. Update profile with new XP and level
        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                xp: newXpTotal,
                level: newLevel,
                updated_at: new Date().toISOString(),
            })
            .eq("user_id", input.userId)

        if (updateError) {
            console.error("Profile update error:", updateError)
            throw new Error("Failed to update profile")
        }

        // 5. If level-up, create achievement badge
        if (leveledUp) {
            const { error: badgeError } = await supabase
                .from("badges")
                .insert({
                    user_id: input.userId,
                    name: `Level ${newLevel}`,
                    description: `Reached level ${newLevel} with ${newXpTotal} total XP`,
                    icon_url: "🏆",
                    awarded_at: new Date().toISOString(),
                })
        }

        // 6. Revalidate dashboard to show new progress
        revalidatePath("/(dashboard)/home")

        return {
            success: true,
            newXpTotal,
            levelUp: leveledUp,
            newLevel,
            message: leveledUp
                ? `🎉 Level up! You're now level ${newLevel}`
                : `✅ Module completed! +${input.xpEarned} XP`,
        }
    } catch (error) {
        console.error("completeModule error:", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown error",
        }
    }
}

/**
 * Get user's current XP and level
 */
export async function getUserStats(userId: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("profiles")
            .select("xp, level")
            .eq("user_id", userId)
            .single()

        if (error) throw error

        return {
            xp: data?.xp || 0,
            level: data?.level || 1,
            xpToNextLevel: 100 - ((data?.xp || 0) % 100),
        }
    } catch (error) {
        console.error("getUserStats error:", error)
        return {
            xp: 0,
            level: 1,
            xpToNextLevel: 100,
        }
    }
}

/**
 * Get all user badges/achievements
 */
export async function getUserBadges(userId: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("badges")
            .select("*")
            .eq("user_id", userId)
            .order("awarded_at", { ascending: false })

        if (error) throw error

        return data || []
    } catch (error) {
        console.error("getUserBadges error:", error)
        return []
    }
}

/**
 * Get leaderboard (top 10 users by XP)
 */
export async function getLeaderboard() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from("profiles")
            .select("user_id, full_name, xp, level, avatar_url")
            .order("xp", { ascending: false })
            .limit(10)

        if (error) throw error

        return (data || []).map((entry, index) => ({
            rank: index + 1,
            userId: entry.user_id,
            name: entry.full_name || "Anonymous",
            xp: entry.xp || 0,
            level: entry.level || 1,
            avatar: entry.avatar_url,
        }))
    } catch (error) {
        console.error("getLeaderboard error:", error)
        return []
    }
}
