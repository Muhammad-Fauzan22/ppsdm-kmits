import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, username')
      .eq('id', user.id)
      .single()

    // Fetch pomodoro sessions
    const { data: pomodoroSessions } = await supabase
      .from('pomodoro_sessions')
      .select('duration_minutes')
      .eq('user_id', user.id)
      .eq('completed', true)

    const totalMinutes = (pomodoroSessions ?? []).reduce(
      (sum: number, s: Record<string, unknown>) => sum + ((s.duration_minutes as number) ?? 25),
      0
    )
    const totalStudyHours = Math.round(totalMinutes / 60)

    // Fetch habit completions
    const { data: habitCompletions } = await supabase
      .from('habit_completions')
      .select('completed_date')
      .eq('user_id', user.id)

    const streakRecord = calculateMaxStreak(
      (habitCompletions ?? []).map((h: Record<string, unknown>) => h.completed_date as string)
    )

    // Fetch dimension scores
    const { data: scores } = await supabase
      .from('dimension_scores')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const topDimensions: { name: string; score: number }[] = []
    if (scores) {
      const entries = Object.entries(DIMENSION_LABELS)
        .map(([key, label]) => ({
          name: label,
          score: (scores[key] as number) ?? 0,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
      topDimensions.push(...entries)
    }

    const achievementsCount = Math.floor(totalStudyHours / 10) + Math.floor(streakRecord / 7)
    const username = (profile?.full_name as string | null) ??
      (profile?.username as string | null) ??
      user.email?.split('@')[0] ?? 'Student'

    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
    const now = new Date()
    const period = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`

    return NextResponse.json({
      data: {
        username,
        totalStudyHours,
        streakRecord,
        topDimensions,
        achievementsCount,
        motivationalQuote: randomQuote,
        period,
        userId: user.id,
      }
    })
  } catch (err) {
    console.error('GET /api/sharing/generate error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
