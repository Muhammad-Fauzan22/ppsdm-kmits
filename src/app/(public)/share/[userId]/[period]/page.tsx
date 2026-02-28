import { ProgressCard } from '@/components/sharing/ProgressCard'
import type { CardData } from '@/lib/sharing/card-generator'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ userId: string; period: string }>
}

const MOTIVATIONAL_QUOTES = [
  'Every expert was once a beginner. Keep going!',
  'Learning is not attained by chance, it must be sought with ardor.',
  'The beautiful thing about learning is that no one can take it away from you.',
  'Education is the most powerful weapon which you can use to change the world.',
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

async function getCardData(userId: string): Promise<CardData | null> {
  try {
    const supabase = await createClient()

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, username')
      .eq('id', userId)
      .single()

    if (!profile) return null

    const { data: pomodoroSessions } = await supabase
      .from('pomodoro_sessions')
      .select('duration_minutes')
      .eq('user_id', userId)
      .eq('completed', true)

    const totalMinutes = (pomodoroSessions ?? []).reduce(
      (sum: number, s: Record<string, unknown>) => sum + ((s.duration_minutes as number) ?? 25),
      0
    )
    const totalStudyHours = Math.round(totalMinutes / 60)

    const { data: habitCompletions } = await supabase
      .from('habit_completions')
      .select('completed_date')
      .eq('user_id', userId)

    const streakRecord = calculateMaxStreak(
      (habitCompletions ?? []).map((h: Record<string, unknown>) => h.completed_date as string)
    )

    const { data: scores } = await supabase
      .from('dimension_scores')
      .select('*')
      .eq('user_id', userId)
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
      (profile?.username as string | null) ?? 'Student'

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
  } catch {
    return null
  }
}

export default async function SharePage({ params }: PageProps) {
  const { userId } = await params
  const cardData = await getCardData(userId)

  if (!cardData) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <h1 className="text-xl font-semibold mb-2">Profile not found</h1>
          <p className="text-sm">This progress card is not available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          {cardData.username}&apos;s Learning Progress
        </h1>
        <p className="text-gray-400 text-sm">PPSDM KMITS LMS · {cardData.period}</p>
      </div>

      {/* Card */}
      <ProgressCard
        cardData={cardData}
        theme="dark"
        size="square"
      />

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm mb-3">
          Track your own learning journey
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          🎓 Join PPSDM KMITS LMS
        </a>
      </div>
    </div>
  )
}
