/**
 * Generic Assessment Runner Component
 * Configuration-driven assessment engine untuk semua 9 dimensi PPSDM
 * Menggantikan 90% code duplication di existing codebase
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DimensionConfig,
  AssessmentSession,
  AssessmentResponse,
  QuestionConfig,
  ResponseScale,
  ScoreInterpretation
} from '../core/types';
// import { getResponseScale } from '../config/dimensions'; // Removed invalid import
import { ProgressTracker, QuestionRenderer, Navigation, Timer } from './index';
import { useAssessmentEngine, useValidation } from '../hooks';


// ============================================================================
// Types
// ============================================================================

interface AssessmentRunnerProps {
  dimensionConfig: DimensionConfig;
  sessionId: string;
  userId?: string | null;
  sessionToken?: string | null;
  onComplete: (result: AssessmentResult) => void;
  onExit: () => void;
  onSaveProgress?: (progress: SaveProgressData) => void;
  initialResponses?: Record<string, AssessmentResponse>;
  allowAnonymous?: boolean;
  showTimer?: boolean;
  theme?: 'default' | 'minimal' | 'gamified';
}

interface AssessmentResult {
  sessionId: string;
  dimensionId: string;
  scores: {
    total: number;
    normalized: number;
    byCategory?: Record<string, number>;
  };
  interpretation: ScoreInterpretation;
  completedAt: string;
  timeSpentMs: number;
}

interface SaveProgressData {
  sessionId: string;
  currentItemIndex: number;
  responses: Record<string, AssessmentResponse>;
  percentageComplete: number;
}

// ============================================================================
// Component
// ============================================================================

export function AssessmentRunner({
  dimensionConfig,
  sessionId,
  userId,
  sessionToken,
  onComplete,
  onExit,
  onSaveProgress,
  initialResponses = {},
  allowAnonymous = true,
  showTimer = true,
  theme = 'default'
}: AssessmentRunnerProps) {
  // State
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, AssessmentResponse>>(initialResponses);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for next

  // Refs
  const startTimeRef = useRef(Date.now());
  const itemStartTimeRef = useRef(Date.now());
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Custom hooks
  const {
    submitResponse,
    completeAssessment,
    saveProgress,
    state: engineState
  } = useAssessmentEngine({
    sessionId,
    dimension: dimensionConfig,
    userId,
    sessionToken
  });

  const { validateResponse, errors: validationErrors, clearErrors } = useValidation();



  // Generate questions from instruments
  const questions = React.useMemo(() => {
    const allQuestions: QuestionConfig[] = [];
    (dimensionConfig.instruments || []).forEach(instrument => {
      for (let i = 0; i < instrument.items; i++) {
        allQuestions.push({
          id: `${instrument.id}_q${i + 1}`,
          instrumentId: instrument.id,
          text: getQuestionText(instrument.id, i),
          responseScale: instrument.responseScale,
          reverseScored: instrument.scoring.reverseScored?.[i] || false,
          weight: instrument.scoring.weights?.[i] || 1,
          category: instrument.scoring.categories?.[i % (instrument.scoring.categories?.length || 1)]
        });
      }
    });
    return allQuestions;
  }, [dimensionConfig]);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentItemIndex];
  const progressPercentage = Math.round((currentItemIndex / totalQuestions) * 100);
  const isFirstQuestion = currentItemIndex === 0;
  const isLastQuestion = currentItemIndex === totalQuestions - 1;
  const hasAnsweredCurrent = !!responses[currentQuestion?.id];

  // Auto-save progress
  useEffect(() => {
    if (onSaveProgress) {
      autoSaveIntervalRef.current = setInterval(() => {
        onSaveProgress({
          sessionId,
          currentItemIndex,
          responses,
          percentageComplete: progressPercentage
        });
      }, 30000); // Auto-save every 30 seconds
    }

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [sessionId, currentItemIndex, responses, progressPercentage, onSaveProgress]);

  // Reset item timer when question changes
  useEffect(() => {
    itemStartTimeRef.current = Date.now();
  }, [currentItemIndex]);

  // Handle response submission
  const handleResponse = useCallback(async (value: number | string | boolean) => {
    const timeSpentMs = Date.now() - itemStartTimeRef.current;

    const response: AssessmentResponse = {
      questionId: currentQuestion.id,
      instrumentId: currentQuestion.instrumentId,
      dimensionId: dimensionConfig.id,
      value,
      answeredAt: new Date().toISOString(),
      timeSpentMs
    };

    // Validate
    const validation = validateResponse(currentQuestion, value);
    if (!validation.valid) {
      setError(validation.errors[0]?.message || 'Invalid response');
      return;
    }


    // Update local state
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: response
    }));
    setError(null);

    // Submit to server
    try {
      await submitResponse(
        currentQuestion.id,
        value,
        timeSpentMs
      );
    } catch (err) {
      // Continue locally even if server fails
    }


    // Auto-advance if not last question
    if (!isLastQuestion) {
      setDirection(1);
      setCurrentItemIndex(prev => prev + 1);
    }
  }, [currentQuestion, isLastQuestion, sessionId, submitResponse, validateResponse]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!hasAnsweredCurrent) {
      setError('Silakan jawab pertanyaan ini terlebih dahulu');
      return;
    }

    if (isLastQuestion) {
      handleComplete();
    } else {
      setDirection(1);
      setCurrentItemIndex(prev => prev + 1);
    }
  }, [hasAnsweredCurrent, isLastQuestion]);

  const handlePrevious = useCallback(() => {
    if (!isFirstQuestion) {
      setDirection(-1);
      setCurrentItemIndex(prev => prev - 1);
    }
  }, [isFirstQuestion]);

  const handleComplete = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const totalTimeSpent = Date.now() - startTimeRef.current;

      // Calculate scores
      const scores = calculateScores(responses, questions, dimensionConfig);

      // Get interpretation
      const interpretation = getScoreInterpretation(scores.normalized, dimensionConfig);

      // Complete assessment on server
      const result = await completeAssessment();


      const assessmentResult: AssessmentResult = {
        sessionId,
        dimensionId: dimensionConfig.id,
        scores,
        interpretation,
        completedAt: new Date().toISOString(),
        timeSpentMs: totalTimeSpent
      };

      onComplete(assessmentResult);

      // GAMIFICATION INTEGRATION
      if (userId) {
        try {
          // Dynamic import to avoid circular deps if any, or just direct use
          const { GamificationService } = await import('@/lib/gamification/service');
          await GamificationService.addXP(userId, 200); // Award 200 XP
          await GamificationService.updateQuestProgress(userId, 'assessment_complete', 1);
        } catch (err) {
          console.error('Failed to award XP:', err);
        }
      }
    } catch (err) {
      setError('Gagal menyelesaikan assessment. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, responses, questions, dimensionConfig, sessionId, completeAssessment, onComplete]);

  const handleExit = useCallback(() => {
    if (Object.keys(responses).length > 0) {
      setShowExitConfirm(true);
    } else {
      onExit();
    }
  }, [responses, onExit]);

  const confirmExit = useCallback(async () => {
    // Save progress before exiting
    if (onSaveProgress) {
      await onSaveProgress({
        sessionId,
        currentItemIndex,
        responses,
        percentageComplete: progressPercentage
      });
    }
    onExit();
  }, [sessionId, currentItemIndex, responses, progressPercentage, onSaveProgress, onExit]);

  // Get response scale for current question
  const responseScale = getResponseScale(currentQuestion?.responseScale || 'likert5')!;


  // Theme styles
  const themeStyles = getThemeStyles(theme, dimensionConfig.color);

  return (
    <div className={`min-h-screen ${themeStyles.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${themeStyles.header} border-b`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: dimensionConfig.color }}
              >
                {dimensionConfig.order}
              </div>
              <div>
                <h1 className={`font-semibold ${themeStyles.text}`}>
                  {dimensionConfig.title}
                </h1>
                <p className={`text-sm ${themeStyles.subtext}`}>
                  {currentItemIndex + 1} dari {totalQuestions} pertanyaan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {showTimer && (
                <Timer
                  startTime={new Date(startTimeRef.current)}
                  className={themeStyles.subtext}
                />
              )}

              <button
                onClick={handleExit}
                className={`p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors ${themeStyles.text}`}
                aria-label="Keluar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <ProgressTracker
            current={currentItemIndex}
            total={totalQuestions}
            percentage={progressPercentage}
            color={dimensionConfig.color}
            className="mt-4"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentItemIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <QuestionRenderer
              question={currentQuestion}
              responseScale={responseScale}
              currentValue={responses[currentQuestion.id]?.value}
              onResponse={handleResponse}
              error={error}
              theme={theme}
              accentColor={dimensionConfig.color}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <Navigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          onComplete={handleComplete}
          isFirst={isFirstQuestion}
          isLast={isLastQuestion}
          hasAnswered={hasAnsweredCurrent}
          isSubmitting={isSubmitting}
          theme={theme}
          accentColor={dimensionConfig.color}
        />
      </main>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`${themeStyles.card} rounded-xl p-6 max-w-md mx-4 shadow-2xl`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${themeStyles.text}`}>
              Simpan Progress?
            </h3>
            <p className={`${themeStyles.subtext} mb-6`}>
              Anda telah menjawab {Object.keys(responses).length} dari {totalQuestions} pertanyaan.
              Progress akan disimpan dan bisa dilanjutkan nanti.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className={`flex-1 px-4 py-2 rounded-lg border ${themeStyles.border} ${themeStyles.text} hover:bg-opacity-5 hover:bg-gray-500 transition-colors`}
              >
                Lanjutkan
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Keluar & Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function getQuestionText(instrumentId: string, index: number): string {
  // In production, this would fetch from database or config
  // For now, return placeholder based on instrument
  const templates: Record<string, string[]> = {
    ctds: [
      'Saya suka mengeksplorasi berbagai sudut pandang sebelum mengambil keputusan',
      'Saya selalu mencari bukti sebelum menerima informasi baru',
      'Saya menikmati memecahkan masalah yang kompleks',
      'Saya sering mempertanyakan asumsi yang ada',
      'Saya percaya pada intuisi saya lebih dari analisis',
      'Saya suka berdiskusi untuk menguji ide-ide saya',
      'Saya cenderung menerima informasi tanpa verifikasi',
      'Saya merasa tidak nyaman dengan ketidakpastian'
    ],
    creativity: [
      'Saya sering menghasilkan ide-ide unik dan orisinal',
      'Saya menikmati mencoba pendekatan baru dalam menyelesaikan masalah',
      'Saya tidak takut untuk berpikir di luar kotak',
      'Saya sering menemukan solusi yang tidak biasa',
      'Saya suka menggabungkan ide dari berbagai bidang',
      'Saya merasa terstimulasi oleh tantangan kreatif'
    ]
    // Add more templates for other instruments...
  };

  const instrumentTemplates = templates[instrumentId] || ['Pertanyaan ' + (index + 1)];
  return instrumentTemplates[index % instrumentTemplates.length] || `Pertanyaan ${index + 1} untuk ${instrumentId}`;
}

function calculateScores(
  responses: Record<string, AssessmentResponse>,
  questions: QuestionConfig[],
  config: DimensionConfig
) {
  let totalRaw = 0;
  let totalWeight = 0;
  const byCategory: Record<string, { sum: number; count: number }> = {};
  const byInstrument: Record<string, { sum: number; count: number; max: number }> = {};

  // Initialize instrument trackers
  (config.instruments || []).forEach(inst => {
    byInstrument[inst.id] = { sum: 0, count: 0, max: inst.items * 5 }; // Assuming max 5 per item
  });

  questions.forEach(question => {
    const response = responses[question.id];
    if (!response) return;

    let value = typeof response.value === 'number' ? response.value : 0;

    // Handle reverse scoring
    if (question.reverseScored) {
      value = 6 - value; // Reverse for 1-5 scale
    }

    const weight = question.weight || 1;
    totalRaw += value * weight;
    totalWeight += weight;

    // Category tracking
    if (question.category) {
      if (!byCategory[question.category]) {
        byCategory[question.category] = { sum: 0, count: 0 };
      }
      byCategory[question.category].sum += value;
      byCategory[question.category].count += 1;
    }

    // Instrument tracking
    if (byInstrument[question.instrumentId]) {
      byInstrument[question.instrumentId].sum += value;
      byInstrument[question.instrumentId].count += 1;
    }
  });

  // Calculate normalized score (0-100)
  const maxPossible = totalWeight * 5; // Assuming 5 is max per item
  const normalized = totalWeight > 0 ? Math.round((totalRaw / maxPossible) * 100) : 0;

  // Calculate category scores
  const categoryScores: Record<string, number> = {};
  Object.entries(byCategory).forEach(([cat, data]) => {
    categoryScores[cat] = data.count > 0 ? Math.round((data.sum / (data.count * 5)) * 100) : 0;
  });

  // Calculate instrument scores
  const instrumentScores: Record<string, number> = {};
  Object.entries(byInstrument).forEach(([inst, data]) => {
    instrumentScores[inst] = data.max > 0 ? Math.round((data.sum / data.max) * 100) : 0;
  });

  return {
    total: totalRaw,
    normalized,
    byCategory: categoryScores,
    byInstrument: instrumentScores,
    raw: totalRaw,
    maxPossible
  };
}

function getScoreInterpretation(score: number, config: DimensionConfig): ScoreInterpretation {
  const thresholds = config.thresholds || config.scoring?.thresholds;

  if (!thresholds) {
    return {
      level: 'low',
      label: 'Unknown',
      description: 'Score could not be interpreted due to missing configuration.',
      color: '#9CA3AF'
    };
  }

  const recommendations = config.recommendations || { low: [], medium: [], high: [] };

  if (score <= thresholds.low.max) {
    return {
      level: 'low',
      label: thresholds.low.label,
      description: `Skor Anda (${score}) menunjukkan area yang perlu pengembangan. ${recommendations.low?.[0] || ''}`,
      color: thresholds.low.color || '#EF4444'
    };
  } else if (score <= thresholds.medium.max) {
    return {
      level: 'medium',
      label: thresholds.medium.label,
      description: `Skor Anda (${score}) menunjukkan level yang cukup baik. ${recommendations.medium?.[0] || ''}`,
      color: thresholds.medium.color || '#F59E0B'
    };
  } else {
    return {
      level: 'high',
      label: thresholds.high.label,
      description: `Skor Anda (${score}) menunjukkan level yang sangat baik! ${recommendations.high?.[0] || ''}`,
      color: thresholds.high.color || '#10B981'
    };
  }
}

function getThemeStyles(theme: string, accentColor: string) {
  const themes = {
    default: {
      background: 'bg-slate-50',
      header: 'bg-white',
      text: 'text-slate-900',
      subtext: 'text-slate-500',
      card: 'bg-white',
      border: 'border-slate-200'
    },
    minimal: {
      background: 'bg-white',
      header: 'bg-white',
      text: 'text-gray-900',
      subtext: 'text-gray-400',
      card: 'bg-gray-50',
      border: 'border-gray-100'
    },
    gamified: {
      background: 'bg-gradient-to-br from-slate-900 to-slate-800',
      header: 'bg-slate-900/80 backdrop-blur',
      text: 'text-white',
      subtext: 'text-slate-400',
      card: 'bg-slate-800',
      border: 'border-slate-700'
    }
  };

  return themes[theme as keyof typeof themes] || themes.default;
}

function getResponseScale(type: string): ResponseScale | undefined {
  const scales: Record<string, ResponseScale> = {
    likert5: {
      type: 'likert5',
      min: 1,
      max: 5,
      labels: {
        1: 'Sangat Tidak Setuju',
        2: 'Tidak Setuju',
        3: 'Netral',
        4: 'Setuju',
        5: 'Sangat Setuju'
      }
    },
    likert7: {
      type: 'likert7',
      min: 1,
      max: 7,
      labels: {
        1: 'Sangat Tidak Setuju',
        7: 'Sangat Setuju'
      }
    },
    yesno: {
      type: 'yesno',
      min: 0,
      max: 1,
      labels: {
        0: 'Tidak',
        1: 'Ya'
      }
    },
    frequency: {
      type: 'frequency',
      min: 1,
      max: 5,
      labels: {
        1: 'Tidak Pernah',
        2: 'Jarang',
        3: 'Kadang-kadang',
        4: 'Sering',
        5: 'Selalu'
      }
    }
  };
  return scales[type];
}
