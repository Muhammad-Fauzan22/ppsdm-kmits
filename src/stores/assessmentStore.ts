/**
 * Assessment Store - State Management untuk 9 Dimensi Assessment
 * Menggunakan Zustand untuk manajemen state yang efisien
 * 
 * Features:
 * - Track progress 9 dimensi secara independen
 * - Simpan jawaban sementara (localStorage + Supabase)
 * - Non-linear navigation (urutan bebas)
 * - Completion tracking
 * - Popup reminder triggers
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export interface DimensionProgress {
  dimensionId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  answers: number[]; // Array of 8 answers (0-4, representing 1-5 Likert)
  score?: number; // Calculated score 0-100
  completedAt?: Date;
  startedAt?: Date;
}

export interface AssessmentState {
  // Session info
  sessionId: string | null;
  userId: string | null;
  startedAt: Date | null;
  
  // Progress tracking for all 9 dimensions
  dimensionsProgress: Record<string, DimensionProgress>;
  
  // Current active dimension
  currentDimensionId: string | null;
  currentQuestionIndex: number;
  
  // UI state
  showCompletionReminder: boolean;
  lastReminderShownAt: Date | null;
  
  // Computed values
  getCompletedDimensions: () => string[];
  getInProgressDimensions: () => string[];
  getCompletionRate: () => number;
  getAllDimensionsCompleted: () => boolean;
  
  // Actions
  startSession: (userId: string) => void;
  startDimension: (dimensionId: string) => void;
  saveAnswer: (dimensionId: string, questionIndex: number, answer: number) => void;
  completeDimension: (dimensionId: string, score: number) => void;
  pauseAssessment: () => void;
  resumeAssessment: (dimensionId: string) => void;
  resetDimension: (dimensionId: string) => void;
  showReminder: () => void;
  dismissReminder: () => void;
  clearAllProgress: () => void;
}

// Initial state
const initialState = {
  sessionId: null,
  userId: null,
  startedAt: null,
  dimensionsProgress: {},
  currentDimensionId: null,
  currentQuestionIndex: 0,
  showCompletionReminder: false,
  lastReminderShownAt: null,
};

// Generate session ID
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create store with persistence
export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Computed values
      getCompletedDimensions: () => {
        const { dimensionsProgress } = get();
        return Object.values(dimensionsProgress)
          .filter(d => d.status === 'completed')
          .map(d => d.dimensionId);
      },
      
      getInProgressDimensions: () => {
        const { dimensionsProgress } = get();
        return Object.values(dimensionsProgress)
          .filter(d => d.status === 'in_progress')
          .map(d => d.dimensionId);
      },
      
      getCompletionRate: () => {
        const completed = get().getCompletedDimensions().length;
        return (completed / 9) * 100;
      },
      
      getAllDimensionsCompleted: () => {
        return get().getCompletedDimensions().length === 9;
      },
      
      // Actions
      startSession: (userId: string) => set({
        sessionId: generateSessionId(),
        userId,
        startedAt: new Date(),
        dimensionsProgress: {},
      }),
      
      startDimension: (dimensionId: string) => set((state) => {
        const existing = state.dimensionsProgress[dimensionId];
        
        // If already completed, don't reset
        if (existing?.status === 'completed') {
          return { currentDimensionId: dimensionId };
        }
        
        return {
          currentDimensionId: dimensionId,
          currentQuestionIndex: existing?.answers?.length || 0,
          dimensionsProgress: {
            ...state.dimensionsProgress,
            [dimensionId]: {
              dimensionId,
              status: 'in_progress',
              answers: existing?.answers || [],
              startedAt: existing?.startedAt || new Date(),
            }
          }
        };
      }),
      
      saveAnswer: (dimensionId: string, questionIndex: number, answer: number) => set((state) => {
        const existing = state.dimensionsProgress[dimensionId];
        const newAnswers = [...(existing?.answers || [])];
        newAnswers[questionIndex] = answer;
        
        return {
          dimensionsProgress: {
            ...state.dimensionsProgress,
            [dimensionId]: {
              ...existing,
              dimensionId,
              status: 'in_progress' as const,
              answers: newAnswers,
            }
          }
        };
      }),
      
      completeDimension: (dimensionId: string, score: number) => set((state) => {
        const existing = state.dimensionsProgress[dimensionId];
        
        return {
          dimensionsProgress: {
            ...state.dimensionsProgress,
            [dimensionId]: {
              ...existing,
              dimensionId,
              status: 'completed' as const,
              score,
              completedAt: new Date(),
            }
          },
          currentDimensionId: null,
          currentQuestionIndex: 0,
        };
      }),
      
      pauseAssessment: () => set({
        currentDimensionId: null,
      }),
      
      resumeAssessment: (dimensionId: string) => set((state) => {
        const progress = state.dimensionsProgress[dimensionId];
        return {
          currentDimensionId: dimensionId,
          currentQuestionIndex: progress?.answers?.length || 0,
        };
      }),
      
      resetDimension: (dimensionId: string) => set((state) => {
        const { [dimensionId]: _, ...rest } = state.dimensionsProgress;
        return {
          dimensionsProgress: rest,
          currentDimensionId: state.currentDimensionId === dimensionId ? null : state.currentDimensionId,
        };
      }),
      
      showReminder: () => set({
        showCompletionReminder: true,
        lastReminderShownAt: new Date(),
      }),
      
      dismissReminder: () => set({
        showCompletionReminder: false,
      }),
      
      clearAllProgress: () => set(initialState),
    }),
    {
      name: 'ppsdm-assessment-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist specific fields
      partialize: (state) => ({
        sessionId: state.sessionId,
        userId: state.userId,
        startedAt: state.startedAt,
        dimensionsProgress: state.dimensionsProgress,
        lastReminderShownAt: state.lastReminderShownAt,
      }),
    }
  )
);

// Selector hooks for better performance
export const useDimensionProgress = (dimensionId: string) => {
  return useAssessmentStore((state) => state.dimensionsProgress[dimensionId]);
};

export const useCompletedDimensions = () => {
  return useAssessmentStore((state) => state.getCompletedDimensions());
};

export const useCompletionRate = () => {
  return useAssessmentStore((state) => state.getCompletionRate());
};

export const useAllDimensionsCompleted = () => {
  return useAssessmentStore((state) => state.getAllDimensionsCompleted());
};

export default useAssessmentStore;
