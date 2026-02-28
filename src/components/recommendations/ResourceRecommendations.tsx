'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Sparkles } from 'lucide-react'
import { ResourceCard } from './ResourceCard'
import { recordFeedback, type LearningResource, type ResourceType } from '@/lib/recommendations/recommendation-engine'

type FilterTab = 'all' | ResourceType

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'video', label: 'Video' },
  { value: 'article', label: 'Article' },
  { value: 'book', label: 'Book' },
  { value: 'tool', label: 'Tool' },
]

export function ResourceRecommendations() {
  const [resources, setResources] = useState<LearningResource[]>([])
  const [userFeedback, setUserFeedback] = useState<Record<string, boolean>>({})
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const fetchResources = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeFilter !== 'all') params.set('type', activeFilter)
      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      params.set('limit', '24')

      const response = await fetch(`/api/recommendations?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch recommendations')

      const json = await response.json() as { data: LearningResource[]; feedback: Record<string, boolean> }
      setResources(json.data ?? [])
      setUserFeedback(json.feedback ?? {})
    } catch (err) {
      console.error('Error fetching recommendations:', err)
    } finally {
      setIsLoading(false)
    }
  }, [activeFilter, searchQuery])

  useEffect(() => {
    const timer = setTimeout(fetchResources, searchQuery ? 400 : 0)
    return () => clearTimeout(timer)
  }, [fetchResources, searchQuery])

  const handleFeedback = async (resourceId: string, liked: boolean) => {
    // Optimistic update
    setUserFeedback((prev) => ({ ...prev, [resourceId]: liked }))

    try {
      await recordFeedback(resourceId, liked)
    } catch {
      // Revert on error
      setUserFeedback((prev) => {
        const updated = { ...prev }
        delete updated[resourceId]
        return updated
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-xl">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Recommendations</h2>
          <p className="text-sm text-gray-500">Personalized learning resources for you</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === tab.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-52 animate-pulse" />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No resources found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : 'No resources available for this filter.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">{resources.length} resources found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                userFeedback={userFeedback[resource.id] ?? null}
                onFeedback={handleFeedback}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
