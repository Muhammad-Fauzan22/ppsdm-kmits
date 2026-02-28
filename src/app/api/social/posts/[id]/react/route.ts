import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

type ReactionType = 'motivate' | 'relatable' | 'helpful' | 'support'

/**
 * POST /api/social/posts/[id]/react - Add or remove a reaction
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { reactionType: ReactionType }

    if (!body.reactionType) {
      return NextResponse.json({ error: 'Missing reactionType' }, { status: 400 })
    }

    const validReactions: ReactionType[] = ['motivate', 'relatable', 'helpful', 'support']
    if (!validReactions.includes(body.reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    // Generate anonymous ID
    const anonymousId = createHash('sha256')
      .update(user.id + (process.env.ANONYMOUS_SALT ?? 'ppsdm-kmits-salt'))
      .digest('hex')
      .substring(0, 16)

    // Check if reaction already exists
    const { data: existing } = await supabase
      .from('post_reactions')
      .select('id')
      .eq('post_id', postId)
      .eq('anonymous_id', anonymousId)
      .eq('reaction_type', body.reactionType)
      .maybeSingle()

    if (existing) {
      // Remove reaction
      await supabase
        .from('post_reactions')
        .delete()
        .eq('id', existing.id)

      // Decrement reaction count in post
      const { data: post } = await supabase
        .from('social_posts')
        .select('reactions')
        .eq('id', postId)
        .single()

      if (post) {
        const reactions = post.reactions as Record<string, number>
        reactions[body.reactionType] = Math.max(0, (reactions[body.reactionType] ?? 0) - 1)
        await supabase
          .from('social_posts')
          .update({ reactions })
          .eq('id', postId)
      }

      return NextResponse.json({ success: true, action: 'removed' })
    }

    // Add reaction
    await supabase
      .from('post_reactions')
      .insert({
        post_id: postId,
        anonymous_id: anonymousId,
        reaction_type: body.reactionType,
      })

    // Increment reaction count in post
    const { data: post } = await supabase
      .from('social_posts')
      .select('reactions')
      .eq('id', postId)
      .single()

    if (post) {
      const reactions = post.reactions as Record<string, number>
      reactions[body.reactionType] = (reactions[body.reactionType] ?? 0) + 1
      await supabase
        .from('social_posts')
        .update({ reactions })
        .eq('id', postId)
    }

    return NextResponse.json({ success: true, action: 'added' })
  } catch (error) {
    console.error('POST /api/social/posts/[id]/react error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
