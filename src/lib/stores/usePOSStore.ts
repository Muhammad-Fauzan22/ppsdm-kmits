import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface Task {
    id: string;
    title: string;
    quadrant: 'do' | 'decide' | 'delegate' | 'delete';
    completed: boolean;
    createdAt: string;
}

export interface Decision {
    id: string;
    title: string;
    context: string;
    options: string[];
    selection: string;
    outcomePrediction: string;
    actualOutcome?: string;
    reviewDate: string;
    status: 'pending_review' | 'reviewed';
    createdAt: string;
}

export interface Habit {
    id: string;
    title: string;
    streak: number;
    history: Record<string, boolean>; // 'YYYY-MM-DD': true
}

export interface FocusSession {
    isActive: boolean;
    timeLeft: number; // in seconds
    mode: 'focus' | 'short_break' | 'long_break';
    totalFocusTime: number; // total seconds today
}

interface POSState {
    tasks: Task[];
    decisions: Decision[];
    habits: Habit[];
    focusSession: FocusSession;

    // Task Actions
    addTask: (title: string, quadrant: Task['quadrant']) => void;
    toggleTask: (id: string) => void;
    moveTask: (id: string, quadrant: Task['quadrant']) => void;
    deleteTask: (id: string) => void;

    // Decision Actions
    addDecision: (decision: Omit<Decision, 'id' | 'createdAt' | 'status' | 'actualOutcome'>) => void;
    reviewDecision: (id: string, actualOutcome: string) => void;

    // Habit Actions
    addHabit: (title: string) => void;
    toggleHabit: (id: string, date: string) => void;

    // Focus Actions
    startTimer: () => void;
    pauseTimer: () => void;
    resetTimer: (mode?: FocusSession['mode']) => void;
    tickTimer: () => void;
}

export const usePOSStore = create<POSState>()(
    persist(
        (set, get) => ({
            tasks: [],
            decisions: [],
            habits: [],
            focusSession: {
                isActive: false,
                timeLeft: 25 * 60,
                mode: 'focus',
                totalFocusTime: 0,
            },

            addTask: (title, quadrant) => set((state) => ({
                tasks: [...state.tasks, {
                    id: crypto.randomUUID(),
                    title,
                    quadrant,
                    completed: false,
                    createdAt: new Date().toISOString(),
                }]
            })),

            toggleTask: (id) => {
                const state = get();
                const task = state.tasks.find(t => t.id === id);
                if (task && !task.completed) {
                    useGamificationStore.getState().addXP(50);
                    useGamificationStore.getState().unlockAchievement('FIRST_BLOOD');
                }
                set((state) => ({
                    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
                }));
            },

            moveTask: (id, quadrant) => set((state) => ({
                tasks: state.tasks.map(t => t.id === id ? { ...t, quadrant } : t)
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(t => t.id !== id)
            })),

            addDecision: (decision) => {
                useGamificationStore.getState().addXP(100);
                useGamificationStore.getState().unlockAchievement('DECISION_MAKER');
                set((state) => ({
                    decisions: [...state.decisions, {
                        ...decision,
                        id: crypto.randomUUID(),
                        status: 'pending_review',
                        createdAt: new Date().toISOString(),
                    }]
                }));
            },

            reviewDecision: (id, actualOutcome) => set((state) => ({
                decisions: state.decisions.map(d => d.id === id ? { ...d, actualOutcome, status: 'reviewed' } : d)
            })),

            addHabit: (title) => set((state) => ({
                habits: [...state.habits, {
                    id: crypto.randomUUID(),
                    title,
                    streak: 0,
                    history: {}
                }]
            })),

            toggleHabit: (id, date) => {
                // Trigger generic XP for habit consistency works better here than in component
                useGamificationStore.getState().addXP(20);
                set((state) => ({
                    habits: state.habits.map(h => {
                        if (h.id !== id) return h;
                        const newHistory = { ...h.history, [date]: !h.history[date] };
                        return { ...h, history: newHistory };
                    })
                }));
            },

            startTimer: () => set((state) => ({
                focusSession: { ...state.focusSession, isActive: true }
            })),

            pauseTimer: () => set((state) => ({
                focusSession: { ...state.focusSession, isActive: false }
            })),

            resetTimer: (mode = 'focus') => set((state) => ({
                focusSession: {
                    ...state.focusSession,
                    isActive: false,
                    mode,
                    timeLeft: mode === 'focus' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60
                }
            })),

            tickTimer: () => {
                const state = get();
                const { timeLeft, isActive, totalFocusTime, mode } = state.focusSession;

                if (!isActive || timeLeft <= 0) return {};

                // Check if timer is just about to finish (1 second left)
                if (timeLeft === 1 && mode === 'focus') {
                    useGamificationStore.getState().addXP(100); // 100 XP for completing a session
                    useGamificationStore.getState().unlockAchievement('DEEP_WORKor');
                }

                set({
                    focusSession: {
                        ...state.focusSession,
                        timeLeft: timeLeft - 1,
                        totalFocusTime: mode === 'focus' ? totalFocusTime + 1 : totalFocusTime
                    }
                });
            },
        }),
        {
            name: 'pos-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
