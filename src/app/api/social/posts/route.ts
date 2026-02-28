import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

/**
 * GET /api/social/posts - List posts for the feed
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') ?? '10', 10)

    let query = supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (cursor) {
      query = query.lt('created_at', cursor)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const posts = data ?? []
    const nextCursor = posts.length === limit ? posts[posts.length - 1].created_at : null

    return NextResponse.json({ posts, nextCursor })
  } catch (error) {
    console.error('GET /api/social/posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/social/posts - Create a new post
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { type: string; content: string }

    if (!body.type || !body.content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (body.content.length > 500) {
      return NextResponse.json({ error: 'Content exceeds 500 character limit' }, { status: 400 })
    }

    // Generate anonymous ID from user ID (one-way hash)
    const anonymousId = createHash('sha256')
      .update(user.id + process.env.ANONYMOUS_SALT ?? 'ppsdm-kmits-salt')
      .digest('hex')
      .substring(0, 16)

    const { data, error } = await supabase
      .from('social_posts')
      .insert({
        anonymous_id: anonymousId,
        type: body.type,
        content: body.content,
        reactions: { motivate: 0, relatable: 0, helpful: 0, support: 0 },
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, post: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/social/posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
