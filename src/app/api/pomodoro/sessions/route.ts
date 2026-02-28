import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfWeek, endOfWeek, format, eachDayOfInterval } from 'date-fns'

/**
 * POST /api/pomodoro/sessions - Save a completed pomodoro session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as {
      type: string
      duration: number
      taskLabel?: string
    }

    if (!body.type || !body.duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert({
        user_id: user.id,
        type: body.type,
        duration: body.duration,
        task_label: body.taskLabel ?? '',
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, session: data })
  } catch (error) {
    console.error('POST /api/pomodoro/sessions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/pomodoro/sessions - Get sessions with optional period filter
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') ?? 'today'

    const now = new Date()
    let startDate: Date
    let endDate: Date = now

    switch (period) {
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 })
        endDate = endOfWeek(now, { weekStartsOn: 1 })
        break
      case 'today':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
    }

    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'working')
      .gte('completed_at', startDate.toISOString())
      .lte('completed_at', endDate.toISOString())
      .order('completed_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (period === 'week') {
      // Build daily stats for the week
      const days = eachDayOfInterval({ start: startDate, end: endDate })
      const stats = days.map((day) => {
        const dayStr = format(day, 'yyyy-MM-dd')
        const daySessions = (data ?? []).filter((s) => {
          const sessionDate = format(new Date(s.completed_at), 'yyyy-MM-dd')
          return sessionDate === dayStr
        })
        return {
          date: dayStr,
          count: daySessions.length,
          totalMinutes: daySessions.reduce((sum, s) => sum + Math.floor(s.duration / 60), 0),
        }
      })

      return NextResponse.json({ stats, sessions: data ?? [] })
    }

    return NextResponse.json({
      sessions: data ?? [],
      count: data?.length ?? 0,
    })
  } catch (error) {
    console.error('GET /api/pomodoro/sessions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
