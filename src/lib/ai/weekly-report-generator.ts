/**
 * AI Weekly Report Generator
 * Generates personalized weekly learning reports using AI
 */

import { createAdminClient } from '@/lib/supabase/server'
import { startOfWeek, endOfWeek, format, subWeeks } from 'date-fns'

export interface WeeklyReportData {
  summary: string
  achievements: string[]
  areasToImprove: string[]
  nextWeekGoals: string[]
  motivationalQuote: string
  stats: {
    pomodoroCount: number
    studyMinutes: number
    habitCompletionRate: number
    assessmentScores: Record<string, number>
  }
}

export interface WeeklyReport {
  id: string
  user_id: string
  week_start: string
  week_end: string
  report_data: WeeklyReportData
  generated_at: string
}

/**
 * Collect user's weekly data for report generation
 */
async function collectWeeklyData(userId: string, weekStart: Date, weekEnd: Date) {
  const supabase = createAdminClient()

  // Fetch pomodoro sessions
  const { data: pomodoroSessions } = await supabase
    .from('pomodoro_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'working')
    .gte('completed_at', weekStart.toISOString())
    .lte('completed_at', weekEnd.toISOString())

  // Fetch habit completions
  const { data: habitCompletions } = await supabase
    .from('habit_completions')
    .select('*, habits(name, frequency)')
    .eq('user_id', userId)
    .gte('completed_date', format(weekStart, 'yyyy-MM-dd'))
    .lte('completed_date', format(weekEnd, 'yyyy-MM-dd'))

  // Fetch habits for completion rate
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)

  // Fetch assessment scores
  const { data: assessmentScores } = await supabase
    .from('dimension_scores')
    .select('*')
    .eq('user_id', userId)
    .single()

  const pomodoroCount = pomodoroSessions?.length ?? 0
  const studyMinutes = pomodoroCount * 25

  // Calculate habit completion rate
  const totalExpectedCompletions = (habits?.length ?? 0) * 7
  const actualCompletions = habitCompletions?.length ?? 0
  const habitCompletionRate =
    totalExpectedCompletions > 0
      ? Math.round((actualCompletions / totalExpectedCompletions) * 100)
      : 0

  return {
    pomodoroCount,
    studyMinutes,
    habitCompletionRate,
    assessmentScores: assessmentScores ?? {},
    habitCompletions: habitCompletions ?? [],
    habits: habits ?? [],
  }
}

/**
 * Generate weekly report using AI
 */
export async function generateWeeklyReport(
  userId: string,
  weekOffset = 0
): Promise<WeeklyReport | null> {
  try {
    const now = new Date()
    const targetWeek = subWeeks(now, weekOffset)
    const weekStart = startOfWeek(targetWeek, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(targetWeek, { weekStartsOn: 1 })

    const weeklyData = await collectWeeklyData(userId, weekStart, weekEnd)

    // Build AI prompt
    const prompt = `You are a supportive learning coach for Indonesian university students (ITS - Institut Teknologi Sepuluh Nopember).

Generate a personalized weekly learning report based on this data:
- Pomodoro sessions completed: ${weeklyData.pomodoroCount}
- Total study time: ${weeklyData.studyMinutes} minutes
- Habit completion rate: ${weeklyData.habitCompletionRate}%
- Week: ${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}

Respond in JSON format with these fields:
{
  "summary": "2-3 sentence overview of the week",
  "achievements": ["achievement 1", "achievement 2", "achievement 3"],
  "areasToImprove": ["area 1", "area 2"],
  "nextWeekGoals": ["goal 1", "goal 2", "goal 3"],
  "motivationalQuote": "An inspiring quote relevant to their progress"
}

Be encouraging, specific, and culturally appropriate for Indonesian students. Use Bahasa Indonesia or English.`

    let reportData: WeeklyReportData

    try {
      // Try to use OpenAI
      const openaiApiKey = process.env.OPENAI_API_KEY
      if (openaiApiKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            max_tokens: 500,
          }),
        })

        if (response.ok) {
          const aiResponse = await response.json() as {
            choices: Array<{ message: { content: string } }>
          }
          const content = aiResponse.choices[0]?.message?.content ?? '{}'
          const parsed = JSON.parse(content) as Partial<WeeklyReportData>

          reportData = {
            summary: parsed.summary ?? 'Great week of learning!',
            achievements: parsed.achievements ?? [],
            areasToImprove: parsed.areasToImprove ?? [],
            nextWeekGoals: parsed.nextWeekGoals ?? [],
            motivationalQuote: parsed.motivationalQuote ?? 'Keep going!',
            stats: {
              pomodoroCount: weeklyData.pomodoroCount,
              studyMinutes: weeklyData.studyMinutes,
              habitCompletionRate: weeklyData.habitCompletionRate,
              assessmentScores: {},
            },
          }
        } else {
          throw new Error('AI API failed')
        }
      } else {
        throw new Error('No AI API key')
      }
    } catch {
      // Fallback: generate basic report without AI
      reportData = generateFallbackReport(weeklyData)
    }

    // Save to database
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('weekly_reports')
      .upsert({
        user_id: userId,
        week_start: weekStart.toISOString(),
        week_end: weekEnd.toISOString(),
        report_data: reportData,
        generated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,week_start',
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving weekly report:', error)
      return null
    }

    return data as WeeklyReport
  } catch (error) {
    console.error('Error generating weekly report:', error)
    return null
  }
}

/**
 * Fallback report generation without AI
 */
function generateFallbackReport(data: {
  pomodoroCount: number
  studyMinutes: number
  habitCompletionRate: number
}): WeeklyReportData {
  const achievements: string[] = []
  const areasToImprove: string[] = []

  if (data.pomodoroCount >= 10) {
    achievements.push(`Completed ${data.pomodoroCount} pomodoro sessions this week!`)
  }
  if (data.habitCompletionRate >= 70) {
    achievements.push(`Maintained ${data.habitCompletionRate}% habit completion rate`)
  }
  if (data.studyMinutes >= 120) {
    achievements.push(`Studied for ${Math.round(data.studyMinutes / 60)} hours this week`)
  }

  if (data.pomodoroCount < 5) {
    areasToImprove.push('Try to complete at least 5 pomodoro sessions per day')
  }
  if (data.habitCompletionRate < 50) {
    areasToImprove.push('Focus on maintaining your daily habits consistently')
  }

  return {
    summary: `This week you completed ${data.pomodoroCount} focus sessions totaling ${data.studyMinutes} minutes of study time. Your habit completion rate was ${data.habitCompletionRate}%.`,
    achievements: achievements.length > 0 ? achievements : ['You showed up and made progress!'],
    areasToImprove: areasToImprove.length > 0 ? areasToImprove : ['Keep building on your momentum'],
    nextWeekGoals: [
      'Complete at least 25 pomodoro sessions',
      'Maintain 80% habit completion rate',
      'Review your learning path progress',
    ],
    motivationalQuote: '"The secret of getting ahead is getting started." - Mark Twain',
    stats: {
      pomodoroCount: data.pomodoroCount,
      studyMinutes: data.studyMinutes,
      habitCompletionRate: data.habitCompletionRate,
      assessmentScores: {},
    },
  }
}

/**
 * Get the latest weekly report for a user
 */
export async function getLatestWeeklyReport(userId: string): Promise<WeeklyReport | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('weekly_reports')
    .select('*')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data as WeeklyReport
}
