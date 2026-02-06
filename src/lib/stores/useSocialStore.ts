import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface MoodLog {
    id: string;
    emotion: string; // e.g., 'Happy', 'Anxious', 'Confident'
    intensity: number; // 1-10
    date: string;
    note: string;
    context: string; // e.g., 'Work', 'Social', 'Study'
}

export interface CommunicationLog {
    id: string;
    type: 'speech' | 'listening';
    duration: number; // seconds
    score: number; // 0-100
    feedback: string;
    date: string;
}

export interface LeadershipProject {
    id: string;
    name: string;
    role: string;
    status: 'active' | 'completed';
    date: string;
}

export interface SocialState {
    // Emotional Intelligence
    moodLogs: MoodLog[];

    // Communication
    speakingLogs: CommunicationLog[];

    // Leadership
    leadershipStyle: string | null;
    projects: LeadershipProject[];

    // Actions
    logMood: (log: Omit<MoodLog, 'id'>) => void;
    logCommunicationSession: (log: Omit<CommunicationLog, 'id'>) => void;
    setLeadershipStyle: (style: string) => void;
    addLeadershipProject: (project: Omit<LeadershipProject, 'id'>) => void;
}

export const useSocialStore = create<SocialState>()(
    persist(
        (set, get) => ({
            moodLogs: [],
            speakingLogs: [],
            leadershipStyle: null,
            projects: [],

            logMood: (log) => {
                set((state) => ({
                    moodLogs: [{ ...log, id: crypto.randomUUID() }, ...state.moodLogs]
                }));
                useGamificationStore.getState().addXP(5, 'Mood Analysis');
            },

            logCommunicationSession: (log) => {
                set((state) => ({
                    speakingLogs: [{ ...log, id: crypto.randomUUID() }, ...state.speakingLogs]
                }));
                useGamificationStore.getState().addXP(25, 'Communication Practice');
            },

            setLeadershipStyle: (style) => {
                set({ leadershipStyle: style });
                useGamificationStore.getState().addXP(50, 'Leadership Assessed');
            },

            addLeadershipProject: (project) => {
                set((state) => ({
                    projects: [{ ...project, id: crypto.randomUUID() }, ...state.projects]
                }));
                useGamificationStore.getState().addXP(20, 'New Project');
            }

        }),
        {
            name: 'social-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
