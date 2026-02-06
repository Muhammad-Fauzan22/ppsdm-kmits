import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface CheckIn {
    id: string;
    date: string;
    mood: 'Great' | 'Good' | 'Okay' | 'Low' | 'Bad';
    anxietyLevel: number; // 1-10
    energyLevel: number; // 1-10
    note: string;
}

export interface MeditationLog {
    id: string;
    date: string;
    type: 'breathing' | 'guided' | 'silent';
    duration: number; // seconds
    sessionTitle: string;
}

export interface JournalEntry {
    id: string;
    date: string;
    title: string;
    content: string;
    type: 'free' | 'cbt' | 'gratitude';
}

export interface MentalState {
    checkins: CheckIn[];
    meditationLogs: MeditationLog[];
    journalEntries: JournalEntry[];

    logCheckIn: (data: Omit<CheckIn, 'id'>) => void;
    logMeditation: (data: Omit<MeditationLog, 'id'>) => void;
    addJournalEntry: (data: Omit<JournalEntry, 'id'>) => void;
}

export const useMentalStore = create<MentalState>()(
    persist(
        (set) => ({
            checkins: [],
            meditationLogs: [],
            journalEntries: [],

            logCheckIn: (data) => {
                set((state) => ({
                    checkins: [{ ...data, id: crypto.randomUUID() }, ...state.checkins]
                }));
                useGamificationStore.getState().addXP(10, 'Daily Check-in');
            },

            logMeditation: (data) => {
                set((state) => ({
                    meditationLogs: [{ ...data, id: crypto.randomUUID() }, ...state.meditationLogs]
                }));
                useGamificationStore.getState().addXP(15, 'Mindfulness Session');
            },

            addJournalEntry: (data) => {
                set((state) => ({
                    journalEntries: [{ ...data, id: crypto.randomUUID() }, ...state.journalEntries]
                }));
                useGamificationStore.getState().addXP(20, 'Journaling');
            }
        }),
        {
            name: 'mental-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
