import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { resourceId: string; liked: boolean }
    const { resourceId, liked } = body

    if (!resourceId) {
      return NextResponse.json({ error: 'resourceId is required' }, { status: 400 })
    }

    if (typeof liked !== 'boolean') {
      return NextResponse.json({ error: 'liked must be a boolean' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('resource_feedback')
      .upsert({
        user_id: user.id,
        resource_id: resourceId,
        liked,
      }, {
        onConflict: 'user_id,resource_id',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/recommendations/feedback error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
