import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface DigitalHabits {
    screenTimeGoal: number; // minutes
    appsLimited: string[];
    zenMode: boolean;
}

export interface CarbonData {
    transport: 'bike' | 'public' | 'car' | 'walk';
    electricityBill: number; // kwh estimate or cost
    consumptionScore: number; // 1-10 (1=minimalist, 10=consumerist)
    totalFootprint: number; // kg CO2 estimate
}

export interface SustainabilityAction {
    id: string;
    date: string;
    action: string;
    impact: 'low' | 'medium' | 'high';
}

export interface BalanceLog {
    id: string;
    date: string;
    workHours: number;
    leisureHours: number;
    sleepHours: number;
    mood: string;
}

export interface LifestyleState {
    digitalHabits: DigitalHabits;
    carbonFootprint: CarbonData;
    sustainabilityLogs: SustainabilityAction[];
    balanceLogs: BalanceLog[];

    // Actions
    updateDigitalHabits: (habits: Partial<DigitalHabits>) => void;
    updateCarbon: (data: Partial<CarbonData>) => void;
    logSustainableAction: (action: string, impact: 'low' | 'medium' | 'high') => void;
    logBalance: (log: Omit<BalanceLog, 'id'>) => void;
}

const calculateFootprint = (data: CarbonData) => {
    let score = 0;
    // Rough estimates
    if (data.transport === 'car') score += 200;
    if (data.transport === 'bike') score += 50;
    if (data.transport === 'public') score += 80;

    score += data.electricityBill * 0.5;
    score += data.consumptionScore * 20;

    return score;
};

export const useLifestyleStore = create<LifestyleState>()(
    persist(
        (set, get) => ({
            digitalHabits: { screenTimeGoal: 120, appsLimited: [], zenMode: false },
            carbonFootprint: { transport: 'bike', electricityBill: 100, consumptionScore: 5, totalFootprint: 0 },
            sustainabilityLogs: [],
            balanceLogs: [],

            updateDigitalHabits: (habits) => {
                set((state) => ({ digitalHabits: { ...state.digitalHabits, ...habits } }));
            },

            updateCarbon: (data) => {
                set((state) => {
                    const newData = { ...state.carbonFootprint, ...data };
                    const totalFootprint = calculateFootprint(newData);
                    return { carbonFootprint: { ...newData, totalFootprint } };
                });
            },

            logSustainableAction: (action, impact) => {
                set((state) => ({
                    sustainabilityLogs: [{ id: crypto.randomUUID(), date: new Date().toISOString(), action, impact }, ...state.sustainabilityLogs]
                }));
                useGamificationStore.getState().addXP(impact === 'high' ? 30 : 10, 'Green Action');
            },

            logBalance: (log) => {
                set((state) => ({
                    balanceLogs: [{ ...log, id: crypto.randomUUID() }, ...state.balanceLogs]
                }));
                useGamificationStore.getState().addXP(15, 'Balance Log');
            }
        }),
        {
            name: 'lifestyle-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
