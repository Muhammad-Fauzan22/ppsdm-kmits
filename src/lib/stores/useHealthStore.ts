import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useGamificationStore } from './useGamificationStore';

export interface NutritionLog {
    id: string;
    foodName: string;
    calories: number;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface ExerciseLog {
    id: string;
    activity: string;
    duration: number; // minutes
    date: string;
    caloriesBurned: number;
}

export interface MentalLog {
    id: string;
    stressLevel: number; // 1-10
    date: string;
    note: string;
}

export interface HealthState {
    metrics: {
        steps: number;
        sleep: number;
        water: number;
    };
    // Nutrition
    dailyCalorieGoal: number;
    waterIntake: number; // glasses
    nutritionLogs: NutritionLog[];

    // Exercise
    exerciseLogs: ExerciseLog[];

    // Sleep & Mental
    sleepHours: number;
    sleepQuality: number; // 1-5
    stressLogs: MentalLog[];

    // Preventive
    riskScore: number;
    checkups: string[]; // List of completed checkup types

    // Community
    bookedFacilities: string[];
    activeChallenges: string[];

    // Actions
    logNutrition: (log: Omit<NutritionLog, 'id'>) => void;
    incrementWater: () => void;
    logExercise: (log: Omit<ExerciseLog, 'id'>) => void;
    setSleep: (hours: number, quality: number) => void;
    logStress: (stress: number, note: string) => void;
    bookFacility: (facility: string) => void;
    joinChallenge: (challenge: string) => void;
}

export const useHealthStore = create<HealthState>()(
    persist(
        (set, get) => ({
            metrics: {
                steps: 0,
                sleep: 0,
                water: 0
            },
            dailyCalorieGoal: 2000,
            waterIntake: 0,
            nutritionLogs: [],
            exerciseLogs: [],
            sleepHours: 7,
            sleepQuality: 3,
            stressLogs: [],
            riskScore: 0,
            checkups: [],
            bookedFacilities: [],
            activeChallenges: [],

            logNutrition: (log) => {
                set((state) => ({
                    nutritionLogs: [{ ...log, id: crypto.randomUUID() }, ...state.nutritionLogs]
                }));
                useGamificationStore.getState().addXP(5, 'Healthy Eating');
            },

            incrementWater: () => {
                set((state) => ({ waterIntake: state.waterIntake + 1 }));
                useGamificationStore.getState().addXP(2, 'Hydration');
            },

            logExercise: (log) => {
                set((state) => ({
                    exerciseLogs: [{ ...log, id: crypto.randomUUID() }, ...state.exerciseLogs]
                }));
                useGamificationStore.getState().addXP(20, 'Workout Logged');
            },

            setSleep: (hours, quality) => {
                set({ sleepHours: hours, sleepQuality: quality });
                if (hours >= 7 && quality >= 3) {
                    useGamificationStore.getState().addXP(15, 'Good Sleep');
                }
            },

            logStress: (stress, note) => {
                set((state) => ({
                    stressLogs: [{ id: crypto.randomUUID(), stressLevel: stress, note, date: new Date().toISOString() }, ...state.stressLogs]
                }));
                if (stress < 5) useGamificationStore.getState().addXP(5, 'Stress Management');
            },

            bookFacility: (facility) => {
                set((state) => ({
                    bookedFacilities: [facility, ...state.bookedFacilities]
                }));
                useGamificationStore.getState().addXP(10, 'Facility Booking');
            },

            joinChallenge: (challenge) => {
                set((state) => {
                    if (state.activeChallenges.includes(challenge)) return state;
                    return { activeChallenges: [challenge, ...state.activeChallenges] };
                });
                useGamificationStore.getState().addXP(10, 'Challenge Joined');
            }
        }),
        {
            name: 'health-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
