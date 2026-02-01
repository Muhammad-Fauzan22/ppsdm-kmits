/**
 * Progress API Route
 * 
 * GET: Get progress history over time
 * Query params: timeRange (3m, 6m, 1y, all)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient, requireAuth, handleSupabaseError } from '@/lib/supabase/server'
import { progressQuerySchema, TIME_RANGES, type TimeRange, type Dimension } from '@/lib/db/schema'

/**
 * Calculate date range based on timeRange parameter
 */
function getDateRange(timeRange: TimeRange): { startDate: Date; endDate: Date } {
    const endDate = new Date()
    const startDate = new Date()

    switch (timeRange) {
        case '3m':
            startDate.setMonth(startDate.getMonth() - 3)
            break
        case '6m':
            startDate.setMonth(startDate.getMonth() - 6)
            break
        case '1y':
            startDate.setFullYear(startDate.getFullYear() - 1)
            break
        case 'all':
            // Use a very old date for "all" time
            startDate.setFullYear(2000)
            break
    }

    return { startDate, endDate }
}

/**
 * Process dimension scores into progress data points
 */
function processProgressData(
    assessments: Array<{
        dimension: Dimension
        score: number
        created_at: string
    }>,
    timeRange: TimeRange
) {
    // Group assessments by date (monthly for 3m/6m, quarterly for 1y, yearly for all)
    const groupedData = new Map<string, Map<Dimension, number[]>>()

    assessments.forEach((assessment) => {
        const date = new Date(assessment.created_at)
        let key: string

        switch (timeRange) {
            case '3m':
            case '6m':
                // Group by month
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
                break
            case '1y':
                // Group by quarter
                const quarter = Math.floor(date.getMonth() / 3) + 1
                key = `${date.getFullYear()}-Q${quarter}`
                break
            case 'all':
                // Group by year
                key = `${date.getFullYear()}`
                break
        }

        if (!groupedData.has(key)) {
            groupedData.set(key, new Map())
        }

        const dimensionMap = groupedData.get(key)!
        if (!dimensionMap.has(assessment.dimension)) {
            dimensionMap.set(assessment.dimension, [])
        }

        dimensionMap.get(assessment.dimension)!.push(assessment.score)
    })

    // Calculate averages and format data
    const labels: string[] = []
    const datasets: Record<Dimension, number[]> = {
        cognitive: [],
        emotional: [],
        spiritual: [],
        physical: [],
        creative: [],
        professional: [],
        leadership: [],
        financial: [],
        environmental: [],
    }

    // Sort keys chronologically
    const sortedKeys = Array.from(groupedData.keys()).sort()

    sortedKeys.forEach((key) => {
        labels.push(key)
        const dimensionMap = groupedData.get(key)!

        ;(
            [
                'cognitive',
                'emotional',
                'spiritual',
                'physical',
                'creative',
                'professional',
                'leadership',
                'financial',
                'environmental',
            ] as Dimension[]
        ).forEach((dimension) => {
            const scores = dimensionMap.get(dimension)
            if (scores && scores.length > 0) {
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                datasets[dimension].push(avg)
            } else {
                datasets[dimension].push(0)
            }
        })
    })

    return { labels, datasets }
}

/**
 * GET /api/progress
 * Get progress history over time
 */
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()
        const supabase = await createClient()

        // Parse and validate query parameters
        const { searchParams } = new URL(request.url)
        const timeRangeParam = searchParams.get('timeRange') || '6m'

        const validationResult = progressQuerySchema.safeParse({ timeRange: timeRangeParam })

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid timeRange parameter. Must be one of: 3m, 6m, 1y, all',
                },
                { status: 400 }
            )
        }

        const { timeRange } = validationResult.data
        const { startDate, endDate } = getDateRange(timeRange)

        // Fetch assessments within date range
        const { data: assessments, error } = await supabase
            .from('assessments')
            .select('dimension, score, created_at')
            .eq('user_id', user.id)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: true })

        if (error) {
            const { error: errMsg, status: errStatus } = handleSupabaseError(error)
            return NextResponse.json({ success: false, error: errMsg }, { status: errStatus })
        }

        // Process data into progress format
        const progressData = processProgressData(assessments || [], timeRange)

        // Calculate summary statistics
        const latestScores: Record<string, number> = {}
        const improvements: Record<string, number> = {}

        // Get latest scores from dimension_scores table
        const { data: currentScores } = await supabase
            .from('dimension_scores')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (currentScores) {
            ;(
                [
                    'cognitive',
                    'emotional',
                    'spiritual',
                    'physical',
                    'creative',
                    'professional',
                    'leadership',
                    'financial',
                    'environmental',
                ] as Dimension[]
            ).forEach((dimension) => {
                latestScores[dimension] = currentScores[dimension] || 0
            })
        }

        // Calculate improvements (compare first vs last data points)
        if (progressData.labels.length >= 2) {
            ;(
                [
                    'cognitive',
                    'emotional',
                    'spiritual',
                    'physical',
                    'creative',
                    'professional',
                    'leadership',
                    'financial',
                    'environmental',
                ] as Dimension[]
            ).forEach((dimension) => {
                const data = progressData.datasets[dimension]
                const firstValue = data.find((v) => v > 0)
                const lastValue = [...data].reverse().find((v) => v > 0)

                if (firstValue && lastValue) {
                    improvements[dimension] = lastValue - firstValue
                } else {
                    improvements[dimension] = 0
                }
            })
        }

        // Get overall trend
        const overallIndex = currentScores?.overall_index || 0

        return NextResponse.json({
            success: true,
            data: {
                timeRange,
                period: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                },
                chartData: progressData,
                latestScores,
                improvements,
                overallIndex,
                totalAssessments: assessments?.length || 0,
            },
        })
    } catch (error) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }
        console.error('Error fetching progress:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
