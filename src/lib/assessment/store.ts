/**
 * Assessment Store - Zustand State Management
 * Handles assessment flow, answers, progress, and persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Answer {
  questionId: string;
  value: number;
  timestamp: number;
  timeSpent: number;
}

export interface DimensionProgress {
  dimension: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentQuestion: number;
  answers: Record<string, Answer>;
  startedAt: number | null;
  completedAt: number | null;
  timeSpent: number;
}

export interface AssessmentState {
  // Session
  sessionId: string | null;
  currentDimension: string | null;
  
  // Progress tracking
  dimensions: Record<string, DimensionProgress>;
  completedDimensions: string[];
  
  // Timer
  dimensionStartTime: number | null;
  questionStartTime: number;
  
  // Consent
  hasConsented: boolean;
  consentTimestamp: string | null;
  
  // Actions
  startSession: () => void;
  startDimension: (dimension: string) => void;
  setAnswer: (questionId: string, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  completeDimension: () => void;
  resetDimension: (dimension: string) => void;
  getProgress: (dimension: string) => { completed: number; total: number; percent: number };
  getAllProgress: () => { completed: number; total: number; percent: number };
  giveConsent: () => void;
  clearSession: () => void;
}

const TOTAL_QUESTIONS_PER_DIMENSION = 8;

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      currentDimension: null,
      dimensions: {},
      completedDimensions: [],
      dimensionStartTime: null,
      questionStartTime: Date.now(),
      hasConsented: false,
      consentTimestamp: null,
      
      startSession: () => {
        const sessionId = crypto.randomUUID();
        set({
          sessionId,
          currentDimension: null,
          dimensions: {},
          completedDimensions: [],
          hasConsented: false,
          consentTimestamp: null,
        });
      },
      
      startDimension: (dimension: string) => {
        const state = get();
        const now = Date.now();
        
        // Track time spent on previous dimension
        if (state.currentDimension && state.dimensionStartTime) {
          const timeSpent = now - state.dimensionStartTime;
          set((state) => ({
            dimensions: {
              ...state.dimensions,
              [state.currentDimension!]: {
                ...state.dimensions[state.currentDimension!],
                timeSpent: (state.dimensions[state.currentDimension!]?.timeSpent || 0) + timeSpent,
              },
            },
          }));
        }
        
        // Initialize dimension if not exists
        if (!state.dimensions[dimension]) {
          set((state) => ({
            dimensions: {
              ...state.dimensions,
              [dimension]: {
                dimension,
                status: 'in_progress',
                currentQuestion: 0,
                answers: {},
                startedAt: now,
                completedAt: null,
                timeSpent: 0,
              },
            },
          }));
        }
        
        set({
          currentDimension: dimension,
          dimensionStartTime: now,
          questionStartTime: now,
        });
      },
      
      setAnswer: (questionId: string, value: number) => {
        const state = get();
        const dimension = state.currentDimension;
        if (!dimension) return;
        
        const timeSpent = Date.now() - state.questionStartTime;
        
        set((state) => ({
          dimensions: {
            ...state.dimensions,
            [dimension]: {
              ...state.dimensions[dimension],
              answers: {
                ...state.dimensions[dimension].answers,
                [questionId]: {
                  questionId,
                  value,
                  timestamp: Date.now(),
                  timeSpent,
                },
              },
            },
          },
          questionStartTime: Date.now(),
        }));
      },
      
      nextQuestion: () => {
        const state = get();
        const dimension = state.currentDimension;
        if (!dimension) return;
        
        const currentQ = state.dimensions[dimension]?.currentQuestion || 0;
        if (currentQ < TOTAL_QUESTIONS_PER_DIMENSION - 1) {
          set((state) => ({
            dimensions: {
              ...state.dimensions,
              [dimension]: {
                ...state.dimensions[dimension],
                currentQuestion: currentQ + 1,
              },
            },
            questionStartTime: Date.now(),
          }));
        }
      },
      
      prevQuestion: () => {
        const state = get();
        const dimension = state.currentDimension;
        if (!dimension) return;
        
        const currentQ = state.dimensions[dimension]?.currentQuestion || 0;
        if (currentQ > 0) {
          set((state) => ({
            dimensions: {
              ...state.dimensions,
              [dimension]: {
                ...state.dimensions[dimension],
                currentQuestion: currentQ - 1,
              },
            },
            questionStartTime: Date.now(),
          }));
        }
      },
      
      completeDimension: () => {
        const state = get();
        const dimension = state.currentDimension;
        if (!dimension) return;
        
        const timeSpent = Date.now() - (state.dimensionStartTime || 0);
        
        set((state) => ({
          dimensions: {
            ...state.dimensions,
            [dimension]: {
              ...state.dimensions[dimension],
              status: 'completed',
              completedAt: Date.now(),
              timeSpent: (state.dimensions[dimension]?.timeSpent || 0) + timeSpent,
            },
          },
          completedDimensions: state.completedDimensions.includes(dimension)
            ? state.completedDimensions
            : [...state.completedDimensions, dimension],
          currentDimension: null,
          dimensionStartTime: null,
        }));
      },
      
      resetDimension: (dimension: string) => {
        set((state) => ({
          dimensions: {
            ...state.dimensions,
            [dimension]: {
              dimension,
              status: 'not_started',
              currentQuestion: 0,
              answers: {},
              startedAt: null,
              completedAt: null,
              timeSpent: 0,
            },
          },
          completedDimensions: state.completedDimensions.filter((d) => d !== dimension),
        }));
      },
      
      getProgress: (dimension: string) => {
        const state = get();
        const answers = state.dimensions[dimension]?.answers || {};
        const answeredCount = Object.keys(answers).length;
        return {
          completed: answeredCount,
          total: TOTAL_QUESTIONS_PER_DIMENSION,
          percent: (answeredCount / TOTAL_QUESTIONS_PER_DIMENSION) * 100,
        };
      },
      
      getAllProgress: () => {
        const state = get();
        const completed = state.completedDimensions.length;
        return {
          completed,
          total: 9,
          percent: (completed / 9) * 100,
        };
      },
      
      giveConsent: () => {
        set({
          hasConsented: true,
          consentTimestamp: new Date().toISOString(),
        });
      },
      
      clearSession: () => {
        set({
          sessionId: null,
          currentDimension: null,
          dimensions: {},
          completedDimensions: [],
          dimensionStartTime: null,
          hasConsented: false,
          consentTimestamp: null,
        });
      },
    }),
    {
      name: 'ppsdm-assessment-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        dimensions: state.dimensions,
        completedDimensions: state.completedDimensions,
        hasConsented: state.hasConsented,
        consentTimestamp: state.consentTimestamp,
      }),
    }
  )
);

// Export for use in components
export default useAssessmentStore;