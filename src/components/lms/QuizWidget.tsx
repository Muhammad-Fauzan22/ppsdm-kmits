"use client"

import { useState, Dispatch, SetStateAction } from "react"
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizQuestion {
  id: string
  question: string
  options: {
    id: string
    text: string
  }[]
  correctOptionId: string
  explanation?: string
  xpReward?: number
}

interface QuizWidgetProps {
  questions: QuizQuestion[]
  onComplete?: (score: number, totalXp: number) => Promise<void>
  className?: string
}

interface QuestionState {
  questionIndex: number
  selectedAnswers: Record<string, string> // questionId -> selectedOptionId
  completed: boolean
  score: number
  totalXp: number
}

/**
 * Interactive quiz widget with:
 * - Multiple choice questions
 * - Immediate feedback (correct/incorrect)
 * - Progress tracking
 * - XP reward calculation
 * - Save to backend on completion
 */
export function QuizWidget({
  questions,
  onComplete,
  className,
}: QuizWidgetProps) {
  const [state, setState] = useState<QuestionState>({
    questionIndex: 0,
    selectedAnswers: {},
    completed: false,
    score: 0,
    totalXp: 0,
  })
  const [loading, setLoading] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  if (!questions || questions.length === 0) {
    return (
      <div className={cn("rounded-lg bg-slate-100 p-4", className)}>
        <p className="text-slate-600">No quiz questions available</p>
      </div>
    )
  }

  const currentQuestion = questions[state.questionIndex]
  const selectedOptionId = state.selectedAnswers[currentQuestion.id]
  const isAnswered = selectedOptionId !== undefined
  const isCorrect = selectedOptionId === currentQuestion.correctOptionId
  const progress = ((state.questionIndex + 1) / questions.length) * 100

  const handleSelectAnswer = (optionId: string) => {
    if (isAnswered) return // Don't allow changing answer

    const newAnswers = {
      ...state.selectedAnswers,
      [currentQuestion.id]: optionId,
    }

    const isCorrectAnswer = optionId === currentQuestion.correctOptionId
    const xpEarned = isCorrectAnswer ? (currentQuestion.xpReward || 10) : 0

    setState((prev) => ({
      ...prev,
      selectedAnswers: newAnswers,
      score: prev.score + (isCorrectAnswer ? 1 : 0),
      totalXp: prev.totalXp + xpEarned,
    }))

    setShowExplanation(true)
  }

  const handleNext = async () => {
    if (state.questionIndex < questions.length - 1) {
      // Move to next question
      setState((prev) => ({
        ...prev,
        questionIndex: prev.questionIndex + 1,
      }))
      setShowExplanation(false)
    } else {
      // Quiz completed - save to backend
      setLoading(true)
      try {
        if (onComplete) {
          await onComplete(state.score, state.totalXp)
        }
        setState((prev) => ({
          ...prev,
          completed: true,
        }))
      } catch (error) {
        console.error("Failed to save quiz completion:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRestart = () => {
    setState({
      questionIndex: 0,
      selectedAnswers: {},
      completed: false,
      score: 0,
      totalXp: 0,
    })
    setShowExplanation(false)
  }

  // Completion screen
  if (state.completed) {
    const percentage = Math.round((state.score / questions.length) * 100)

    return (
      <div className={cn("rounded-lg border border-slate-200 bg-white p-8", className)}>
        <div className="space-y-6 text-center">
          <div>
            <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Quiz Complete!
            </h2>
          </div>

          <div className="space-y-2">
            <p className="text-4xl font-bold text-blue-600">{percentage}%</p>
            <p className="text-slate-600">
              {state.score} out of {questions.length} correct
            </p>
          </div>

          <div className="rounded-lg bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              You earned{" "}
              <span className="text-lg font-bold text-amber-600">
                +{state.totalXp} XP
              </span>
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  // Quiz progress bar
  return (
    <div className={cn("space-y-6 rounded-lg border border-slate-200 bg-white p-6", className)}>
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">
            Question {state.questionIndex + 1} of {questions.length}
          </span>
          <span className="text-xs font-medium text-slate-600">
            {state.score} correct
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((option) => {
            const selected = selectedOptionId === option.id
            const correct = isCorrect && option.id === currentQuestion.correctOptionId
            const incorrect = isAnswered && selected && !isCorrect

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={isAnswered}
                className={cn(
                  "w-full rounded-lg border-2 p-3 text-left transition-all",
                  !isAnswered &&
                    "cursor-pointer border-slate-200 hover:border-blue-300 hover:bg-blue-50",
                  selected && !isAnswered && "border-blue-400 bg-blue-50",
                  correct && "border-green-500 bg-green-50",
                  incorrect && "border-red-500 bg-red-50",
                  isAnswered && !selected && "border-slate-200 opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium",
                    correct && "text-green-700",
                    incorrect && "text-red-700"
                  )}>
                    {option.text}
                  </span>
                  {correct && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {incorrect && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && currentQuestion.explanation && (
        <div className={cn(
          "rounded-lg p-3 text-sm",
          isCorrect
            ? "border-l-4 border-green-500 bg-green-50 text-green-700"
            : "border-l-4 border-orange-500 bg-orange-50 text-orange-700"
        )}>
          <p className="font-semibold">
            {isCorrect ? "Correct!" : "Incorrect"}
          </p>
          <p className="mt-1">{currentQuestion.explanation}</p>
          {!isCorrect && (
            <p className="mt-2 text-xs">+0 XP</p>
          )}
          {isCorrect && (
            <p className="mt-2 text-xs font-semibold">
              +{currentQuestion.xpReward || 10} XP
            </p>
          )}
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {state.questionIndex === questions.length - 1
            ? "Complete Quiz"
            : "Next Question"}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
