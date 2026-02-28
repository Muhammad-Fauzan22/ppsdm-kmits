'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Target } from 'lucide-react'
import { HabitCard } from './HabitCard'
import { AddHabitModal } from './AddHabitModal'
import {
  fetchHabits,
  fetchHabitCompletions,
  deleteHabit,
  type Habit,
  type HabitCompletion,
} from '@/lib/habits/habit-service'
import { format } from 'date-fns'

interface HabitWithCompletions {
  habit: Habit
  completions: HabitCompletion[]
}

export function HabitTracker() {
  const [habitsData, setHabitsData] = useState<HabitWithCompletions[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const loadHabits = useCallback(async () => {
    setIsLoading(true)
    try {
      const habits = await fetchHabits()
      const habitsWithCompletions = await Promise.all(
        habits.map(async (habit) => {
          const completions = await fetchHabitCompletions(habit.id)
          return { habit, completions }
        })
      )
      setHabitsData(habitsWithCompletions)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  const handleDelete = async (habitId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this habit?')
    if (!confirmed) return

    const success = await deleteHabit(habitId)
    if (success) {
      setHabitsData((prev) => prev.filter((h) => h.habit.id !== habitId))
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const completedToday = habitsData.filter((h) =>
    h.completions.some((c) => c.completed_date === today)
  ).length
  const totalHabits = habitsData.length
  const completionPercentage = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Habit Tracker</h2>
          <p className="text-sm text-gray-500 mt-0.5">Build consistent daily habits</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      {/* Today's Progress */}
      {totalHabits > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Today&apos;s Progress</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-blue-100 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
              role="progressbar"
              aria-valuenow={completionPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedToday} of {totalHabits} habits completed today
          </p>
        </div>
      )}

      {/* Habits List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : habitsData.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No habits yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Start building positive habits to track your progress
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {habitsData.map(({ habit, completions }) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completions={completions}
              onDelete={handleDelete}
              onUpdate={loadHabits}
            />
          ))}
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <AddHabitModal
          onClose={() => setShowAddModal(false)}
          onCreated={loadHabits}
        />
      )}
    </div>
  )
}
