import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { generateWeeklyReport } from '@/lib/ai/weekly-report-generator'

/**
 * POST /api/cron/weekly-report
 * Cron endpoint - runs every Monday at 8am
 * Configure in vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/weekly-report", "schedule": "0 8 * * 1" }]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Get all active users
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(100) // Process in batches

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 })
    }

    const results = {
      total: users?.length ?? 0,
      success: 0,
      failed: 0,
    }

    // Generate reports for all users
    for (const user of users ?? []) {
      try {
        const report = await generateWeeklyReport(user.id, 1) // Previous week
        if (report) {
          results.success++
        } else {
          results.failed++
        }
      } catch (error) {
        console.error(`Failed to generate report for user ${user.id}:`, error)
        results.failed++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${results.success}/${results.total} weekly reports`,
      results,
    })
  } catch (error) {
    console.error('Cron weekly-report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET /api/cron/weekly-report - Manual trigger for testing
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await import('@/lib/supabase/server').then((m) => m.createClient())
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate report for current user (previous week)
    const report = await generateWeeklyReport(user.id, 1)

    if (!report) {
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
    }

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error('GET /api/cron/weekly-report error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
