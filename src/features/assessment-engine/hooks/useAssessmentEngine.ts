/**
 * useAssessmentEngine Hook
 * Core hook for managing assessment state and logic
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  DimensionConfig,
  InstrumentConfig,
  QuestionConfig,
  AssessmentResponse,
  AssessmentState,
  AssessmentProgress,
  DimensionId,
  UseAssessmentEngineReturn,
  SessionMetadata,
  ValidationResult,
  AssessmentResult,
  AssessmentError
} from '../core/types';
import { calculateScore, ScoringResult } from '../utils/scoring';

// Local type definitions
interface UseAssessmentEngineProps {
  dimension: DimensionConfig;
  sessionId: string;
  userId?: string | null;
  sessionToken?: string | null;
  onComplete?: (result: ScoringResult) => void;
  onError?: (error: Error) => void;
  autoSave?: boolean;
}

export function useAssessmentEngine({
  dimension,
  sessionId,
  userId,
  sessionToken,
  onComplete,
  onError,
  autoSave = true
}: UseAssessmentEngineProps): UseAssessmentEngineReturn {
  // Flatten all questions from all instruments
  const allQuestions = useRef<QuestionConfig[]>([]);
  const allInstruments = useRef<InstrumentConfig[]>([]);

  useEffect(() => {
    const questions: QuestionConfig[] = [];
    const instruments: InstrumentConfig[] = [];

    (dimension.instruments || []).forEach((instrument) => {
      instruments.push(instrument);
      // Generate questions from instrument items
      for (let i = 0; i < instrument.items; i++) {
        questions.push({
          id: `${instrument.id}_q${i + 1}`,
          instrumentId: instrument.id,
          text: `Question ${i + 1} for ${instrument.name}`,
          responseScale: instrument.responseScale,
          reverseScored: instrument.scoring.reverseScored?.[i] || false,
          weight: instrument.scoring.weights?.[i] || 1
        });
      }
    });

    allQuestions.current = questions;
    allInstruments.current = instruments;
  }, [dimension]);

  // State - using the proper AssessmentState from types.ts
  const [state, setState] = useState<AssessmentState>({
    session: null,
    currentQuestionIndex: 0,
    responses: {},
    status: 'idle',
    error: null,
    isLoading: false,
    isSubmitting: false,
    canGoBack: false,
    canGoForward: false,
    isComplete: false,
    progress: 0,
    validation: { valid: true, errors: [], warnings: [] }
  });

  const [responsesMap, setResponsesMap] = useState<Map<string, AssessmentResponse>>(new Map());
  const [localError, setLocalError] = useState<string | null>(null);

  // Derived state
  const currentQuestion = allQuestions.current[state.currentQuestionIndex] || null;

  const progress: AssessmentProgress = {
    currentItem: state.currentQuestionIndex,
    totalItems: allQuestions.current.length,
    answeredItems: responsesMap.size,
    percentComplete: allQuestions.current.length > 0
      ? Math.round((responsesMap.size / allQuestions.current.length) * 100)
      : 0,
    estimatedTimeRemainingMinutes: Math.ceil((allQuestions.current.length - responsesMap.size) * 0.5)
  };

  // Start assessment
  const startAssessment = useCallback(async (dimensionId: DimensionId, metadata?: SessionMetadata) => {
    setState(prev => ({
      ...prev,
      status: 'in_progress',
      isLoading: true
    }));

    try {
      // Initialize session on server
      const res = await fetch('/api/assessment/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dimensionId,
          userId,
          sessionToken,
          metadata
        })
      });

      if (!res.ok) {
        throw new Error('Failed to start assessment');
      }

      const session = await res.json();

      setState(prev => ({
        ...prev,
        session,
        status: 'in_progress',
        isLoading: false,
        canGoForward: true
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLocalError(errorMessage);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: { code: 'START_ERROR', message: errorMessage, recoverable: true },
        isLoading: false
      }));
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    }
  }, [userId, sessionToken, onError]);

  // Submit response
  const submitResponse = useCallback(async (questionId: string, value: number | string | boolean, timeSpentMs: number = 0) => {
    const question = allQuestions.current.find(q => q.id === questionId);
    if (!question) return;

    const response: AssessmentResponse = {
      questionId,
      instrumentId: question.instrumentId,
      dimensionId: dimension.id,
      value,
      answeredAt: new Date().toISOString(),
      timeSpentMs
    };

    // Update local state
    setResponsesMap(prev => {
      const newMap = new Map(prev);
      newMap.set(questionId, response);
      return newMap;
    });

    setState(prev => ({
      ...prev,
      responses: { ...prev.responses, [questionId]: response },
      canGoForward: true
    }));

    // Auto-save if enabled
    if (autoSave) {
      try {
        const res = await fetch('/api/assessment/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            dimension: dimension.id,
            questionId: response.questionId,
            responseValue: response.value,
            timeSpentMs: response.timeSpentMs,
            sessionToken
          })
        });

        if (!res.ok) {
          throw new Error('Failed to save response');
        }
      } catch (err) {
        // Don't block user, just log error
      }
    }
  }, [dimension.id, sessionId, sessionToken, autoSave]);

  // Navigation
  const goToNext = useCallback(() => {
    if (state.currentQuestionIndex >= allQuestions.current.length - 1) return;

    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, allQuestions.current.length - 1),
      canGoBack: true,
      canGoForward: responsesMap.has(allQuestions.current[prev.currentQuestionIndex + 1]?.id)
    }));
  }, [state.currentQuestionIndex, responsesMap]);

  const goToPrevious = useCallback(() => {
    if (state.currentQuestionIndex <= 0) return;

    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
      canGoBack: prev.currentQuestionIndex > 1,
      canGoForward: true
    }));
  }, [state.currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index < 0 || index >= allQuestions.current.length) return;

    setState(prev => ({
      ...prev,
      currentQuestionIndex: index,
      canGoBack: index > 0,
      canGoForward: responsesMap.has(allQuestions.current[index]?.id)
    }));
  }, [responsesMap]);

  // Pause/Resume
  const pauseAssessment = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'paused'
    }));
  }, []);

  const resumeAssessment = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'in_progress'
    }));
  }, []);

  // Complete assessment
  const completeAssessment = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isSubmitting: true,
      status: 'submitting'
    }));

    try {
      // Calculate scores
      const scoringResult = calculateScore(
        dimension,
        Array.from(responsesMap.values())
      );

      // Submit completion
      const res = await fetch('/api/assessment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          dimension: dimension.id,
          responses: Array.from(responsesMap.values()),
          scores: scoringResult,
          sessionToken
        })
      });

      if (!res.ok) {
        throw new Error('Failed to complete assessment');
      }

      const result: AssessmentResult = await res.json();

      setState(prev => ({
        ...prev,
        status: 'completed',
        isComplete: true,
        isSubmitting: false,
        progress: 100
      }));

      // Call callback
      onComplete?.(scoringResult);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setLocalError(errorMessage);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: { code: 'COMPLETE_ERROR', message: errorMessage, recoverable: true },
        isSubmitting: false
      }));
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    }
  }, [dimension, responsesMap, sessionId, sessionToken, onComplete, onError]);

  // Abandon assessment
  const abandonAssessment = useCallback(() => {
    setState(prev => ({
      ...prev,
      status: 'abandoned'
    }));
  }, []);

  // Save progress
  const saveProgress = useCallback(async () => {
    try {
      await fetch('/api/assessment/save-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          currentItemIndex: state.currentQuestionIndex,
          responses: Object.fromEntries(responsesMap),
          sessionToken
        })
      });
    } catch (err) {
    }
  }, [sessionId, state.currentQuestionIndex, responsesMap, sessionToken]);

  // Helpers
  const getCurrentQuestion = useCallback(() => currentQuestion, [currentQuestion]);

  const getQuestionStatus = useCallback((questionId: string): 'unanswered' | 'answered' | 'current' | 'review' => {
    if (questionId === currentQuestion?.id) return 'current';
    if (responsesMap.has(questionId)) return 'answered';
    return 'unanswered';
  }, [currentQuestion, responsesMap]);

  const validateCurrentResponse = useCallback((): ValidationResult => {
    if (!currentQuestion) {
      return { valid: false, errors: [{ field: 'none', message: 'No current question', code: 'NO_QUESTION' }], warnings: [] };
    }

    const response = responsesMap.get(currentQuestion.id);
    if (!response) {
      return { valid: false, errors: [{ field: currentQuestion.id, message: 'No response provided', code: 'REQUIRED' }], warnings: [] };
    }

    return { valid: true, errors: [], warnings: [] };
  }, [currentQuestion, responsesMap]);

  return {
    state,
    progress,
    startAssessment,
    submitResponse,
    goToNext,
    goToPrevious,
    goToQuestion,
    pauseAssessment,
    resumeAssessment,
    completeAssessment,
    abandonAssessment,
    saveProgress,
    getCurrentQuestion,
    getQuestionStatus,
    validateCurrentResponse
  };
}
