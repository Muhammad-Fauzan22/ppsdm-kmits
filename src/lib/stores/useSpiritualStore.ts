import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface IkigaiData {
    passion: string;
    mission: string;
    vocation: string;
    profession: string;
}

export interface Reflection {
    id: string;
    date: string;
    prompt: string;
    content: string;
}

export interface VolunteerLog {
    id: string;
    date: string;
    activity: string;
    hours: number;
    impact: string;
}

export interface SpiritualState {
    ikigai: IkigaiData;
    coreValues: string[];
    reflections: Reflection[];
    volunteerLogs: VolunteerLog[];

    // Actions
    updateIkigai: (key: keyof IkigaiData, value: string) => void;
    setCoreValues: (values: string[]) => void;
    logReflection: (prompt: string, content: string) => void;
    logVolunteer: (log: Omit<VolunteerLog, 'id'>) => void;
}

export const useSpiritualStore = create<SpiritualState>()(
    persist(
        (set) => ({
            ikigai: { passion: '', mission: '', vocation: '', profession: '' },
            coreValues: [],
            reflections: [],
            volunteerLogs: [],

            updateIkigai: (key, value) => {
                set((state) => ({
                    ikigai: { ...state.ikigai, [key]: value }
                }));
                useGamificationStore.getState().addXP(5, 'Ikigai Refinement');
            },

            setCoreValues: (values) => {
                set({ coreValues: values });
                useGamificationStore.getState().addXP(20, 'Values Clarification');
            },

            logReflection: (prompt, content) => {
                set((state) => ({
                    reflections: [{ id: crypto.randomUUID(), date: new Date().toISOString(), prompt, content }, ...state.reflections]
                }));
                useGamificationStore.getState().addXP(15, 'Daily Reflection');
            },

            logVolunteer: (log) => {
                set((state) => ({
                    volunteerLogs: [{ ...log, id: crypto.randomUUID() }, ...state.volunteerLogs]
                }));
                useGamificationStore.getState().addXP(50, 'Volunteer Contribution');
            }
        }),
        {
            name: 'spiritual-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
