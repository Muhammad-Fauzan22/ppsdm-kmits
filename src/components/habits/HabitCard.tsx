'use client'

import { useState } from 'react'
import { Flame, Trophy, Check, Trash2 } from 'lucide-react'
import { HabitChain } from './HabitChain'
import {
  completeHabit,
  uncompleteHabit,
  calculateStreak,
  getStreakMilestoneMessage,
  type Habit,
  type HabitCompletion,
} from '@/lib/habits/habit-service'
import { format } from 'date-fns'

interface HabitCardProps {
  habit: Habit
  completions: HabitCompletion[]
  onDelete: (id: string) => void
  onUpdate: () => void
}

export function HabitCard({ habit, completions, onDelete, onUpdate }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [milestoneMessage, setMilestoneMessage] = useState<string | null>(null)

  const completionDates = completions.map((c) => c.completed_date)
  const today = format(new Date(), 'yyyy-MM-dd')
  const completedToday = completionDates.includes(today)
  const { currentStreak, longestStreak } = calculateStreak(completionDates)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      if (completedToday) {
        await uncompleteHabit(habit.id)
      } else {
        await completeHabit(habit.id)
        const newStreak = currentStreak + 1
        const message = getStreakMilestoneMessage(newStreak)
        if (message) {
          setMilestoneMessage(message)
          setTimeout(() => setMilestoneMessage(null), 3000)
        }
      }
      onUpdate()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
      style={{ borderLeftColor: habit.color, borderLeftWidth: 4 }}
    >
      {/* Milestone message */}
      {milestoneMessage && (
        <div className="mb-3 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800 font-medium animate-bounce">
          {milestoneMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={habit.name}>
            {habit.icon}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900">{habit.name}</h3>
            {habit.description && (
              <p className="text-xs text-gray-500">{habit.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              completedToday
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            } disabled:opacity-50`}
            aria-label={completedToday ? 'Mark as incomplete' : 'Mark as complete'}
            aria-pressed={completedToday}
          >
            <Check className="w-3.5 h-3.5" />
            {completedToday ? 'Done' : 'Do it'}
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Delete habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Streak stats */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-bold text-orange-600">{currentStreak}</span>
          <span className="text-xs text-gray-500">day streak</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-yellow-600">{longestStreak}</span>
          <span className="text-xs text-gray-500">best</span>
        </div>
        <span className="text-xs text-gray-400 capitalize">{habit.category}</span>
      </div>

      {/* Chain visualization */}
      <HabitChain completionDates={completionDates} color={habit.color} />
    </div>
  )
}
