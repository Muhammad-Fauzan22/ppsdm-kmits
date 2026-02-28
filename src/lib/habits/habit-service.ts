/**
 * Habit Service - CRUD and streak calculation
 */

import { createClient } from '@/lib/supabase/client'
import { format, subDays, differenceInDays, parseISO } from 'date-fns'

export type HabitFrequency = 'daily' | 'weekly'
export type HabitCategory = 'Study' | 'Health' | 'Social' | 'Personal'

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string
  color: string
  icon: string
  frequency: HabitFrequency
  category: HabitCategory
  created_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  notes: string
}

export interface HabitWithStats extends Habit {
  currentStreak: number
  longestStreak: number
  completionDates: string[]
  weeklyCompletionRate: number
  completedToday: boolean
}

/**
 * Fetch all habits for a user
 */
export async function fetchHabits(): Promise<Habit[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching habits:', error)
    return []
  }

  return data as Habit[]
}

/**
 * Fetch habit completions for the last 30 days
 */
export async function fetchHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', user.id)
    .gte('completed_date', thirtyDaysAgo)
    .order('completed_date', { ascending: false })

  if (error) {
    console.error('Error fetching habit completions:', error)
    return []
  }

  return data as HabitCompletion[]
}

/**
 * Calculate streak from completion dates
 */
export function calculateStreak(completionDates: string[]): {
  currentStreak: number
  longestStreak: number
} {
  if (completionDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const sortedDates = [...completionDates].sort((a, b) => b.localeCompare(a))
  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Calculate current streak
  let currentStreak = 0
  let checkDate = sortedDates[0] === today || sortedDates[0] === yesterday ? sortedDates[0] : null

  if (checkDate) {
    for (const date of sortedDates) {
      const expectedDate = format(subDays(new Date(), currentStreak), 'yyyy-MM-dd')
      if (date === expectedDate) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0
  let tempStreak = 1

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = parseISO(sortedDates[i])
    const next = parseISO(sortedDates[i + 1])
    const diff = differenceInDays(current, next)

    if (diff === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  return { currentStreak, longestStreak }
}

/**
 * Mark a habit as complete for today
 */
export async function completeHabit(habitId: string, notes = ''): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const today = format(new Date(), 'yyyy-MM-dd')

  const { error } = await supabase
    .from('habit_completions')
    .upsert({
      habit_id: habitId,
      user_id: user.id,
      completed_date: today,
      notes,
    }, {
      onConflict: 'habit_id,user_id,completed_date',
    })

  if (error) {
    console.error('Error completing habit:', error)
    return false
  }

  return true
}

/**
 * Uncomplete a habit for today
 */
export async function uncompleteHabit(habitId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const today = format(new Date(), 'yyyy-MM-dd')

  const { error } = await supabase
    .from('habit_completions')
    .delete()
    .eq('habit_id', habitId)
    .eq('user_id', user.id)
    .eq('completed_date', today)

  if (error) {
    console.error('Error uncompleting habit:', error)
    return false
  }

  return true
}

/**
 * Create a new habit
 */
export async function createHabit(
  habit: Omit<Habit, 'id' | 'user_id' | 'created_at'>
): Promise<Habit | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('habits')
    .insert({ ...habit, user_id: user.id })
    .select()
    .single()

  if (error) {
    console.error('Error creating habit:', error)
    return null
  }

  return data as Habit
}

/**
 * Delete a habit
 */
export async function deleteHabit(habitId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting habit:', error)
    return false
  }

  return true
}

/**
 * Get streak milestone message
 */
export function getStreakMilestoneMessage(streak: number): string | null {
  const milestones: Record<number, string> = {
    7: '🔥 7-day streak! You\'re building momentum!',
    14: '⚡ 2 weeks strong! Incredible consistency!',
    30: '🏆 30-day streak! You\'re unstoppable!',
    60: '💎 60 days! You\'re a habit master!',
    100: '🌟 100 days! Legendary dedication!',
  }

  return milestones[streak] ?? null
}
