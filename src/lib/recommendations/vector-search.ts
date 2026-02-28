/**
 * Vector Search - Full-text search for learning resources
 */

import { createClient } from '@/lib/supabase/client'
import type { LearningResource } from './recommendation-engine'

/**
 * Search for similar resources using full-text search
 */
export async function searchSimilarResources(
  query: string,
  limit = 20
): Promise<LearningResource[]> {
  if (!query.trim()) return []

  const supabase = createClient()
  const searchTerm = `%${query.trim().toLowerCase()}%`

  const { data, error } = await supabase
    .from('learning_resources')
    .select('*')
    .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order('relevance_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching resources:', error)
    return []
  }

  // Score results based on match quality
  const results = (data ?? []) as LearningResource[]
  const queryLower = query.toLowerCase()

  return results
    .map((resource) => {
      let score = resource.relevance_score
      const titleLower = resource.title.toLowerCase()
      const descLower = resource.description.toLowerCase()

      // Boost score for title matches
      if (titleLower.includes(queryLower)) {
        score += 20
      }
      // Boost for exact word matches
      if (titleLower.split(' ').includes(queryLower)) {
        score += 10
      }
      // Boost for description matches
      if (descLower.includes(queryLower)) {
        score += 5
      }
      // Boost for tag matches
      if (resource.tags.some((tag) => tag.toLowerCase().includes(queryLower))) {
        score += 15
      }

      return { ...resource, relevance_score: score }
    })
    .sort((a, b) => b.relevance_score - a.relevance_score)
}

/**
 * Search resources by tags
 */
export async function searchByTags(
  tags: string[],
  limit = 20
): Promise<LearningResource[]> {
  if (tags.length === 0) return []

  const supabase = createClient()

  const { data, error } = await supabase
    .from('learning_resources')
    .select('*')
    .contains('tags', tags)
    .order('relevance_score', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching by tags:', error)
    return []
  }

  return (data ?? []) as LearningResource[]
}
