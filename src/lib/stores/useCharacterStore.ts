import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface Strength {
    id: string;
    name: string;
    category: 'Wisdom' | 'Courage' | 'Humanity' | 'Justice' | 'Temperance' | 'Transcendence';
    score: number; // 0-100
}

export interface IntegrityLog {
    id: string;
    date: string;
    scenario: string;
    decision: string;
    reflection: string;
}

export interface EthicsCase {
    id: string;
    title: string;
    description: string;
    status: 'new' | 'solved';
    userAnswer?: string;
}

export interface CharacterState {
    strengths: Strength[];
    integrityLogs: IntegrityLog[];
    ethicsCases: EthicsCase[];

    // Actions
    setStrengthScore: (id: string, score: number) => void;
    logIntegrity: (log: Omit<IntegrityLog, 'id'>) => void;
    solveCase: (id: string, answer: string) => void;
    initializeStrengths: () => void;
}

const INITIAL_STRENGTHS: Strength[] = [
    { id: 'creativity', name: 'Creativity', category: 'Wisdom', score: 50 },
    { id: 'curiosity', name: 'Curiosity', category: 'Wisdom', score: 50 },
    { id: 'bravery', name: 'Bravery', category: 'Courage', score: 50 },
    { id: 'perseverance', name: 'Perseverance', category: 'Courage', score: 50 },
    { id: 'kindness', name: 'Kindness', category: 'Humanity', score: 50 },
    { id: 'fairness', name: 'Fairness', category: 'Justice', score: 50 },
    { id: 'leadership', name: 'Leadership', category: 'Justice', score: 50 },
    { id: 'forgiveness', name: 'Forgiveness', category: 'Temperance', score: 50 },
    { id: 'humility', name: 'Humility', category: 'Temperance', score: 50 },
    { id: 'gratitude', name: 'Gratitude', category: 'Transcendence', score: 50 },
];

const INITIAL_CASES: EthicsCase[] = [
    { id: 'bridge-safety', title: 'The Unsafe Bridge', description: 'You discover a minor calculation error in a bridge design that is already being built. It meets legal minimums but is below your personal safety standard. What do you do?', status: 'new' },
    { id: 'data-privacy', title: 'Data Privacy Leak', description: 'Your company is quietly selling user data to a third party without explicit consent, which is technically legal in your region but ethically gray. Do you blow the whistle?', status: 'new' },
];

export const useCharacterStore = create<CharacterState>()(
    persist(
        (set, get) => ({
            strengths: INITIAL_STRENGTHS,
            integrityLogs: [],
            ethicsCases: INITIAL_CASES,

            initializeStrengths: () => {
                const current = get().strengths;
                if (current.length === 0) {
                    set({ strengths: INITIAL_STRENGTHS });
                }
            },

            setStrengthScore: (id, score) => {
                set((state) => ({
                    strengths: state.strengths.map(s => s.id === id ? { ...s, score } : s)
                }));
            },

            logIntegrity: (log) => {
                set((state) => ({
                    integrityLogs: [{ ...log, id: crypto.randomUUID() }, ...state.integrityLogs]
                }));
                useGamificationStore.getState().addXP(25, 'Integrity Reflection');
            },

            solveCase: (id, answer) => {
                set((state) => ({
                    ethicsCases: state.ethicsCases.map(c => c.id === id ? { ...c, status: 'solved', userAnswer: answer } : c)
                }));
                useGamificationStore.getState().addXP(40, 'Ethics Case Solved');
            }
        }),
        {
            name: 'character-store',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.initializeStrengths();
            }
        }
    )
);
