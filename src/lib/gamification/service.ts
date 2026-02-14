
import { supabase } from '@/lib/supabase/client';
import { UserProgress, Level, Quest, UserQuest, Badge, UserBadge } from './types';

export class GamificationService {

    // --- USER PROGRESS ---

    static async getUserProgress(userId: string): Promise<UserProgress | null> {
        const { data, error } = await supabase
            .from('user_progress')
            .select(`
                *,
                level_details:levels!current_level(*)
            `)
            .eq('user_id', userId)
            .single();

        if (error) {
            console.error('Error fetching user progress:', error);
            return null;
        }
        return data as UserProgress;
    }

    static async addXP(userId: string, amount: number): Promise<{ newXP: number; levelUp: boolean; newLevel?: number }> {
        // 1. Get current progress
        const progress = await this.getUserProgress(userId);
        if (!progress) throw new Error('User progress not found');

        const currentXP = progress.current_xp || 0;
        const currentLevel = progress.current_level || 1;
        const newXP = currentXP + amount;

        // 2. Check for Level Up
        // Fetch all levels to determine new level
        const { data: levels } = await supabase
            .from('levels')
            .select('*')
            .order('level', { ascending: true });

        let newLevel = currentLevel;
        if (levels) {
            // Find highest level where xp_required <= newXP
            const qualifingLevel = levels
                .filter((l: Level) => l.xp_required <= newXP)
                .pop(); // Last one is highest

            if (qualifingLevel && qualifingLevel.level > currentLevel) {
                newLevel = qualifingLevel.level;
            }
        }

        const levelUp = newLevel > currentLevel;

        // 3. Update User Progress
        const { error } = await supabase
            .from('user_progress')
            .update({
                current_xp: newXP,
                current_level: newLevel,
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (error) throw error;

        return { newXP, levelUp, newLevel: levelUp ? newLevel : undefined };
    }

    // --- STREAKS ---

    static async checkDailyLogin(userId: string): Promise<{ streakContinued: boolean; newStreak: number }> {
        const progress = await this.getUserProgress(userId);
        if (!progress) return { streakContinued: false, newStreak: 0 };

        const lastActivity = progress.last_activity_date ? new Date(progress.last_activity_date) : null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today

        let newStreak = progress.current_streak;
        let streakContinued = false;

        if (lastActivity) {
            const lastDate = new Date(lastActivity.getFullYear(), lastActivity.getMonth(), lastActivity.getDate());
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Streak continues
                newStreak += 1;
                streakContinued = true;
            } else if (diffDays > 1) {
                // Streak broken
                newStreak = 1; // Reset to 1 (today is fresh start)
            } else {
                // Already logged in today, do nothing
                return { streakContinued: true, newStreak };
            }
        } else {
            // First time
            newStreak = 1;
            streakContinued = true;
        }

        // Update streak and last_activity
        await supabase
            .from('user_progress')
            .update({
                current_streak: newStreak,
                longest_streak: Math.max(newStreak, progress.longest_streak),
                last_activity_date: new Date().toISOString()
            })
            .eq('user_id', userId);

        return { streakContinued, newStreak };
    }

    // --- QUESTS ---

    static async getActiveQuests(userId: string): Promise<UserQuest[]> {
        // Fetch valid quests. Joined with user_quests to see progress.
        // For simplicity, fetching active quests definition, then progress.

        // 1. Get definitions
        const { data: quests } = await supabase
            .from('quests')
            .select('*')
            .eq('is_active', true);

        if (!quests) return [];
        const activeQuests = quests as Quest[];

        // 2. Get user progress
        const { data: userQuests } = await supabase
            .from('user_quests')
            .select('*')
            .eq('user_id', userId);

        const myQuests = (userQuests || []) as UserQuest[];

        // Merge logic (client side for now)
        // Ensure every active quest has a user_quest entry or default
        const result: UserQuest[] = activeQuests.map((q) => {
            const uq = myQuests.find((uq) => uq.quest_id === q.id);
            return {
                id: uq?.id || 'temp-' + q.id,
                user_id: userId,
                quest_id: q.id,
                current_progress: uq?.current_progress || 0,
                is_completed: uq?.is_completed || false,
                is_claimed: uq?.is_claimed || false,
                quest_details: q as Quest
            };
        });

        return result;
    }

    static async updateQuestProgress(userId: string, actionType: string, increment: number = 1) {
        // Find quests matching actionType
        const { data: quests } = await supabase
            .from('quests')
            .select('*')
            .eq('action_type', actionType)
            .eq('is_active', true);

        if (!quests || quests.length === 0) return;

        for (const q of quests) {
            // Get or Create user_quest entry
            let { data: uq } = await supabase
                .from('user_quests')
                .select('*')
                .eq('user_id', userId)
                .eq('quest_id', q.id)
                .single();

            if (!uq) {
                const { data: newUq, error } = await supabase
                    .from('user_quests')
                    .insert({
                        user_id: userId,
                        quest_id: q.id,
                        current_progress: 0
                    })
                    .select()
                    .single();
                if (error) continue;
                uq = newUq;
            }

            if (uq.is_completed) continue;

            const newProgress = uq.current_progress + increment;
            const isCompleted = newProgress >= q.target_count;

            await supabase
                .from('user_quests')
                .update({
                    current_progress: newProgress,
                    is_completed: isCompleted,
                    completed_at: isCompleted ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', uq.id);
        }
    }

    static async claimQuestReward(userId: string, userQuestId: string): Promise<number> {
        // 1. Verify completion and not claimed
        const { data: uq } = await supabase
            .from('user_quests')
            .select(`*, quest:quests(*)`)
            .eq('id', userQuestId)
            .eq('user_id', userId)
            .single();

        if (!uq || !uq.is_completed || uq.is_claimed) {
            throw new Error('Quest not eligible for claim');
        }

        const xpReward = uq.quest.xp_reward;

        // 2. Mark claimed
        const { error } = await supabase
            .from('user_quests')
            .update({ is_claimed: true })
            .eq('id', userQuestId);

        if (error) throw error;

        // 3. Award XP
        await this.addXP(userId, xpReward);


        return xpReward;
    }

    // --- LEADERBOARD ---

    static async getLeaderboard(limit: number = 10): Promise<any[]> {
        const { data, error } = await supabase
            .from('user_progress')
            .select(`
                *,
                user:users(full_name, avatar_url, department),
                level_details:levels!current_level(*)
            `)
            .order('current_xp', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }

        // Apply Privacy Filter
        return (data || []).map((entry: any) => ({
            ...entry,
            user: entry.is_public ? entry.user : {
                full_name: 'Pengguna Anonim',
                avatar_url: null,
                department: 'Rahasia'
            }
        }));
    }

    static async togglePrivacy(userId: string, isPublic: boolean): Promise<boolean> {
        const { error } = await supabase
            .from('user_progress')
            .update({ is_public: isPublic })
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating privacy:', error);
            return false;
        }
        return true;
    }
}

