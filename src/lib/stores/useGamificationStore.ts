import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Rank = 'Novice' | 'Apprentice' | 'Adept' | 'Expert' | 'Master' | 'Grandmaster';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
}

interface GamificationState {
    xp: number;
    level: number;
    rank: Rank;
    achievements: Achievement[];

    // Actions
    addXP: (amount: number) => void;
    unlockAchievement: (id: string) => void;
}

const calculateLevel = (xp: number) => Math.floor(Math.sqrt(xp / 100)) + 1;

const getRank = (level: number): Rank => {
    if (level >= 50) return 'Grandmaster';
    if (level >= 40) return 'Master';
    if (level >= 30) return 'Expert';
    if (level >= 20) return 'Adept';
    if (level >= 10) return 'Apprentice';
    return 'Novice';
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
    { id: 'FIRST_BLOOD', title: 'First Blood', description: 'Complete your first task', icon: '⚔️' },
    { id: 'DEEP_WORKor', title: 'Deep Worker', description: 'Complete a 25m Focus Session', icon: '🧠' },
    { id: 'STREAK_3', title: 'Hat Trick', description: 'Maintain a habit streak of 3 days', icon: '🔥' },
    { id: 'DECISION_MAKER', title: 'Strategist', description: 'Log your first decision', icon: '♟️' },
];

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            rank: 'Novice',
            achievements: ACHIEVEMENTS_LIST,

            addXP: (amount) => set((state) => {
                const newXP = state.xp + amount;
                const newLevel = calculateLevel(newXP);
                const newRank = getRank(newLevel);

                // Check for level up
                if (newLevel > state.level) {
                    // You could trigger a confetti event or toast here via a separate UI subscription
                    console.log(`Level Up! ${state.level} -> ${newLevel}`);
                }

                return { xp: newXP, level: newLevel, rank: newRank };
            }),

            unlockAchievement: (id) => set((state) => {
                const achievement = state.achievements.find(a => a.id === id);
                if (!achievement || achievement.unlockedAt) return state; // Already unlocked or invalid

                return {
                    achievements: state.achievements.map(a =>
                        a.id === id ? { ...a, unlockedAt: new Date().toISOString() } : a
                    )
                };
            }),
        }),
        {
            name: 'gamification-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
