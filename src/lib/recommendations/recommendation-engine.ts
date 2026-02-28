/**
 * Recommendation Engine - Personalized resource recommendations
 */

import { createClient } from '@/lib/supabase/client'

export type ResourceType = 'video' | 'article' | 'book' | 'tool'

export interface LearningResource {
  id: string
  title: string
  description: string
  url: string
  type: ResourceType
  tags: string[]
  relevance_score: number
  created_at?: string
}

export interface ResourceFeedback {
  id: string
  user_id: string
  resource_id: string
  liked: boolean
  created_at: string
}

/**
 * Get personalized recommendations for a user
 */
export async function getPersonalizedRecommendations(
  limit = 20,
  typeFilter?: ResourceType
): Promise<LearningResource[]> {
  const supabase = createClient()

  let query = supabase
    .from('learning_resources')
    .select('*')
    .order('relevance_score', { ascending: false })
    .limit(limit)

  if (typeFilter) {
    query = query.eq('type', typeFilter)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }

  return (data ?? []) as LearningResource[]
}

/**
 * Record user feedback for a resource
 */
export async function recordFeedback(
  resourceId: string,
  liked: boolean
): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('resource_feedback')
    .upsert({
      user_id: user.id,
      resource_id: resourceId,
      liked,
    }, {
      onConflict: 'user_id,resource_id',
    })

  if (error) {
    console.error('Error recording feedback:', error)
    return false
  }

  return true
}

/**
 * Get user's feedback for resources
 */
export async function getUserFeedback(): Promise<Record<string, boolean>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}

  const { data, error } = await supabase
    .from('resource_feedback')
    .select('resource_id, liked')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching user feedback:', error)
    return {}
  }

  return (data ?? []).reduce<Record<string, boolean>>((acc, item) => {
    acc[item.resource_id as string] = item.liked as boolean
    return acc
  }, {})
}
