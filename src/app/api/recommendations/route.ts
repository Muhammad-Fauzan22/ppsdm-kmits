import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ResourceType } from '@/lib/recommendations/recommendation-engine'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as ResourceType | null
    const search = searchParams.get('search')
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)

    // Build resources query
    let query = supabase
      .from('learning_resources')
      .select('*')
      .order('relevance_score', { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq('type', type)
    }

    if (search?.trim()) {
      const searchTerm = `%${search.trim()}%`
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    }

    const { data: resources, error: resourcesError } = await query

    if (resourcesError) {
      return NextResponse.json({ error: resourcesError.message }, { status: 500 })
    }

    // Fetch user feedback
    const { data: feedbackData } = await supabase
      .from('resource_feedback')
      .select('resource_id, liked')
      .eq('user_id', user.id)

    const feedback = (feedbackData ?? []).reduce<Record<string, boolean>>((acc, item) => {
      acc[item.resource_id as string] = item.liked as boolean
      return acc
    }, {})

    return NextResponse.json({
      data: resources ?? [],
      feedback,
    })
  } catch (err) {
    console.error('GET /api/recommendations error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
