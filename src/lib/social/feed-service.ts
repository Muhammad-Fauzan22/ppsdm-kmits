/**
 * Social Learning Feed Service
 * Anonymous social feed for ITS students
 */

import { createClient } from '@/lib/supabase/client'

export type PostType = 'achievement' | 'question' | 'tip' | 'struggle'
export type ReactionType = 'motivate' | 'relatable' | 'helpful' | 'support'

export interface SocialPost {
  id: string
  anonymous_id: string
  type: PostType
  content: string
  reactions: Record<ReactionType, number>
  created_at: string
  avatar_seed?: string
}

export interface CreatePostPayload {
  type: PostType
  content: string
}

const REACTION_EMOJIS: Record<ReactionType, string> = {
  motivate: '💪',
  relatable: '🎯',
  helpful: '💡',
  support: '❤️',
}

export { REACTION_EMOJIS }

const ANIMAL_AVATARS = [
  '🦁', '🐯', '🦊', '🐺', '🦝', '🐻', '🐼', '🦄', '🐸', '🦋',
  '🦅', '🦉', '🐬', '🦈', '🐙', '🦑', '🦚', '🦜', '🐧', '🦩',
]

/**
 * Get a deterministic animal avatar from anonymous_id
 */
export function getAnonymousAvatar(anonymousId: string): string {
  let hash = 0
  for (let i = 0; i < anonymousId.length; i++) {
    hash = ((hash << 5) - hash) + anonymousId.charCodeAt(i)
    hash |= 0
  }
  return ANIMAL_AVATARS[Math.abs(hash) % ANIMAL_AVATARS.length]
}

/**
 * Fetch posts for the feed
 */
export async function fetchFeedPosts(
  cursor?: string,
  limit = 10
): Promise<{ posts: SocialPost[]; nextCursor: string | null }> {
  const supabase = createClient()

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
    console.error('Error fetching feed posts:', error)
    return { posts: [], nextCursor: null }
  }

  const posts = (data ?? []) as SocialPost[]
  const nextCursor =
    posts.length === limit ? posts[posts.length - 1].created_at : null

  return { posts, nextCursor }
}

/**
 * Create a new post
 */
export async function createPost(payload: CreatePostPayload): Promise<SocialPost | null> {
  const supabase = createClient()

  // Validate content length
  if (payload.content.length > 500) {
    throw new Error('Content exceeds 500 character limit')
  }

  const { data, error } = await supabase
    .from('social_posts')
    .insert({
      type: payload.type,
      content: payload.content,
      reactions: { motivate: 0, relatable: 0, helpful: 0, support: 0 },
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    return null
  }

  return data as SocialPost
}

/**
 * Add a reaction to a post
 */
export async function addReaction(
  postId: string,
  reactionType: ReactionType
): Promise<boolean> {
  const supabase = createClient()

  // Check if user already reacted
  const { data: existing } = await supabase
    .from('post_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('reaction_type', reactionType)
    .maybeSingle()

  if (existing) {
    // Remove reaction (toggle)
    await supabase
      .from('post_reactions')
      .delete()
      .eq('id', existing.id)

    // Decrement count
    await supabase.rpc('decrement_reaction', {
      post_id: postId,
      reaction_key: reactionType,
    })

    return false
  }

  // Add reaction
  await supabase
    .from('post_reactions')
    .insert({
      post_id: postId,
      reaction_type: reactionType,
    })

  // Increment count
  await supabase.rpc('increment_reaction', {
    post_id: postId,
    reaction_key: reactionType,
  })

  return true
}

/**
 * Get user's reactions for a list of posts
 */
export async function getUserReactions(
  postIds: string[]
): Promise<Record<string, ReactionType[]>> {
  const supabase = createClient()

  const { data } = await supabase
    .from('post_reactions')
    .select('post_id, reaction_type')
    .in('post_id', postIds)

  const result: Record<string, ReactionType[]> = {}

  for (const reaction of data ?? []) {
    if (!result[reaction.post_id]) {
      result[reaction.post_id] = []
    }
    result[reaction.post_id].push(reaction.reaction_type as ReactionType)
  }

  return result
}
