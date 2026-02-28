/**
 * Card Generator - Fetches user stats for shareable progress cards
 */

import { createClient } from '@/lib/supabase/client'

export interface DimensionScore {
  name: string
  score: number
}

export interface CardData {
  username: string
  totalStudyHours: number
  streakRecord: number
  topDimensions: DimensionScore[]
  achievementsCount: number
  motivationalQuote: string
  period: string
}

const MOTIVATIONAL_QUOTES = [
  'Every expert was once a beginner. Keep going!',
  'Learning is not attained by chance, it must be sought with ardor.',
  'The beautiful thing about learning is that no one can take it away from you.',
  'Education is the most powerful weapon which you can use to change the world.',
  'The more that you read, the more things you will know.',
  'An investment in knowledge pays the best interest.',
  'Live as if you were to die tomorrow. Learn as if you were to live forever.',
  'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.',
]

const DIMENSION_LABELS: Record<string, string> = {
  intellectual: 'Intellectual',
  emotional: 'Emotional',
  social: 'Social',
  spiritual: 'Spiritual',
  physical: 'Physical',
  financial: 'Financial',
  environmental: 'Environmental',
  career: 'Career',
  character: 'Character',
}

/**
 * Generate card data for a user
 */
export async function generateCardData(userId?: string): Promise<CardData | null> {
  const supabase = createClient()

  let targetUserId = userId
  if (!targetUserId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    targetUserId = user.id
  }

  try {
    // Fetch user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, username')
      .eq('id', targetUserId)
      .single()

    // Fetch pomodoro sessions for total study hours
    const { data: pomodoroSessions } = await supabase
      .from('pomodoro_sessions')
      .select('duration_minutes')
      .eq('user_id', targetUserId)
      .eq('completed', true)

    const totalMinutes = (pomodoroSessions ?? []).reduce(
      (sum, s) => sum + ((s.duration_minutes as number) ?? 25),
      0
    )
    const totalStudyHours = Math.round(totalMinutes / 60)

    // Fetch habit completions for streak record
    const { data: habitCompletions } = await supabase
      .from('habit_completions')
      .select('completed_date')
      .eq('user_id', targetUserId)
      .order('completed_date', { ascending: false })

    const streakRecord = calculateMaxStreak(
      (habitCompletions ?? []).map((h) => h.completed_date as string)
    )

    // Fetch dimension scores
    const { data: scores } = await supabase
      .from('dimension_scores')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    const topDimensions: DimensionScore[] = []
    if (scores) {
      const dimensionEntries = Object.entries(DIMENSION_LABELS)
        .map(([key, label]) => ({
          name: label,
          score: (scores[key] as number) ?? 0,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)

      topDimensions.push(...dimensionEntries)
    }

    // Count achievements (completed habits + pomodoro milestones)
    const achievementsCount = Math.floor(totalStudyHours / 10) + Math.floor(streakRecord / 7)

    const username = (profile?.full_name as string | null) ??
      (profile?.username as string | null) ??
      'Student'

    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]

    const now = new Date()
    const period = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`

    return {
      username,
      totalStudyHours,
      streakRecord,
      topDimensions,
      achievementsCount,
      motivationalQuote: randomQuote,
      period,
    }
  } catch (err) {
    console.error('Error generating card data:', err)
    return null
  }
}

function calculateMaxStreak(dates: string[]): number {
  if (dates.length === 0) return 0

  const sorted = [...new Set(dates)].sort((a, b) => b.localeCompare(a))
  let maxStreak = 1
  let currentStreak = 1

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i])
    const next = new Date(sorted[i + 1])
    const diffDays = Math.round((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 1
    }
  }

  return maxStreak
}
