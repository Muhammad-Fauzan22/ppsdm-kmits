// Zustand Store with Persistence
// Keeps assessment responses and scores even after page refresh
// FREE implementation using localStorage

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================
// ASSESSMENT STORE
// Persists assessment responses and scores
// ============================================

interface AssessmentResponse {
    itemId: string;
    value: number;
    timestamp: string;
}

interface AssessmentResult {
    dimension: string;
    score: number;
    percentile: number;
    category: string;
    completedAt: string;
    responses: AssessmentResponse[];
}

interface AssessmentState {
    // Current session responses (being filled)
    currentResponses: Record<string, AssessmentResponse[]>;

    // Completed assessment results
    completedAssessments: AssessmentResult[];

    // Dimension scores (latest)
    dimensionScores: Record<string, number>;

    // Actions
    setResponse: (dimension: string, itemId: string, value: number) => void;
    clearCurrentResponses: (dimension: string) => void;
    saveAssessmentResult: (result: AssessmentResult) => void;
    getAllScores: () => Record<string, number>;
    getAssessmentHistory: (dimension: string) => AssessmentResult[];
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set, get) => ({
            currentResponses: {},
            completedAssessments: [],
            dimensionScores: {},

            setResponse: (dimension, itemId, value) => set(state => ({
                currentResponses: {
                    ...state.currentResponses,
                    [dimension]: [
                        ...(state.currentResponses[dimension] || []).filter(r => r.itemId !== itemId),
                        { itemId, value, timestamp: new Date().toISOString() },
                    ],
                },
            })),

            clearCurrentResponses: (dimension) => set(state => ({
                currentResponses: {
                    ...state.currentResponses,
                    [dimension]: [],
                },
            })),

            saveAssessmentResult: (result) => set(state => ({
                completedAssessments: [...state.completedAssessments, result],
                dimensionScores: {
                    ...state.dimensionScores,
                    [result.dimension]: result.score,
                },
                currentResponses: {
                    ...state.currentResponses,
                    [result.dimension]: [],
                },
            })),

            getAllScores: () => get().dimensionScores,

            getAssessmentHistory: (dimension) =>
                get().completedAssessments.filter(a => a.dimension === dimension),
        }),
        {
            name: 'ppsdm-assessment-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ============================================
// GAMIFICATION STORE
// Persists XP, badges, and streaks
// ============================================

interface GamificationState {
    totalXP: number;
    level: number;
    earnedBadges: string[];
    streakDays: number;
    lastActivityDate: string | null;
    completedActivities: number;

    // Actions
    addXP: (amount: number) => void;
    awardBadge: (badgeId: string) => void;
    updateStreak: () => void;
    incrementActivities: () => void;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            totalXP: 0,
            level: 1,
            earnedBadges: [],
            streakDays: 0,
            lastActivityDate: null,
            completedActivities: 0,

            addXP: (amount) => set(state => {
                const newXP = state.totalXP + amount;
                // Level calculation: every 100 XP = 1 level (simplified)
                const newLevel = Math.floor(newXP / 100) + 1;
                return { totalXP: newXP, level: newLevel };
            }),

            awardBadge: (badgeId) => set(state => {
                if (state.earnedBadges.includes(badgeId)) return state;
                return { earnedBadges: [...state.earnedBadges, badgeId] };
            }),

            updateStreak: () => set(state => {
                const today = new Date().toISOString().split('T')[0];
                const lastDate = state.lastActivityDate;

                if (!lastDate) {
                    return { streakDays: 1, lastActivityDate: today };
                }

                const lastDateObj = new Date(lastDate);
                const todayObj = new Date(today);
                const diffDays = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));

                if (diffDays === 0) {
                    return state; // Same day
                } else if (diffDays === 1) {
                    return { streakDays: state.streakDays + 1, lastActivityDate: today };
                } else {
                    return { streakDays: 1, lastActivityDate: today }; // Streak broken
                }
            }),

            incrementActivities: () => set(state => ({
                completedActivities: state.completedActivities + 1,
            })),
        }),
        {
            name: 'ppsdm-gamification-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ============================================
// USER PREFERENCES STORE
// Dark mode, language, etc.
// ============================================

interface PreferencesState {
    darkMode: boolean;
    language: 'id' | 'en';
    notifications: boolean;

    // Actions
    toggleDarkMode: () => void;
    setLanguage: (lang: 'id' | 'en') => void;
    toggleNotifications: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
    persist(
        (set) => ({
            darkMode: false,
            language: 'id',
            notifications: true,

            toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
            setLanguage: (lang) => set({ language: lang }),
            toggleNotifications: () => set(state => ({ notifications: !state.notifications })),
        }),
        {
            name: 'ppsdm-preferences-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ============================================
// WEEKLY PLAN STORE
// Persists completed activities
// ============================================

interface WeeklyPlanState {
    completedDays: string[];
    weekStartDate: string;

    // Actions
    toggleDay: (day: string) => void;
    resetWeek: () => void;
}

export const useWeeklyPlanStore = create<WeeklyPlanState>()(
    persist(
        (set) => ({
            completedDays: [],
            weekStartDate: getMonday().toISOString(),

            toggleDay: (day) => set(state => ({
                completedDays: state.completedDays.includes(day)
                    ? state.completedDays.filter(d => d !== day)
                    : [...state.completedDays, day],
            })),

            resetWeek: () => set({
                completedDays: [],
                weekStartDate: getMonday().toISOString(),
            }),
        }),
        {
            name: 'ppsdm-weekly-plan-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// Helper function
function getMonday(): Date {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
}
