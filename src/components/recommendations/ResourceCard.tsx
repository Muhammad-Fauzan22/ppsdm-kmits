'use client'

import { ExternalLink, ThumbsUp, ThumbsDown, BookOpen, Video, Wrench, FileText } from 'lucide-react'
import type { LearningResource, ResourceType } from '@/lib/recommendations/recommendation-engine'

interface ResourceCardProps {
  resource: LearningResource
  userFeedback?: boolean | null
  onFeedback: (resourceId: string, liked: boolean) => void
}

const TYPE_CONFIG: Record<ResourceType, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  video: {
    label: 'Video',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: <Video className="w-3 h-3" />,
  },
  article: {
    label: 'Article',
    color: 'text-blue-700',
    bg: 'bg-blue-100',
    icon: <FileText className="w-3 h-3" />,
  },
  book: {
    label: 'Book',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <BookOpen className="w-3 h-3" />,
  },
  tool: {
    label: 'Tool',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    icon: <Wrench className="w-3 h-3" />,
  },
}

export function ResourceCard({ resource, userFeedback, onFeedback }: ResourceCardProps) {
  const typeConfig = TYPE_CONFIG[resource.type]
  const relevancePercent = Math.min(100, Math.max(0, resource.relevance_score))

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}
            >
              {typeConfig.icon}
              {typeConfig.label}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
            {resource.title}
          </h3>
        </div>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
          aria-label={`Open ${resource.title}`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
        {resource.description}
      </p>

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{resource.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Relevance Score */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Relevance</span>
          <span className="text-xs font-medium text-gray-700">{relevancePercent}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all"
            style={{ width: `${relevancePercent}%` }}
            role="progressbar"
            aria-valuenow={relevancePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-500 flex-1">Was this helpful?</span>
        <button
          onClick={() => onFeedback(resource.id, true)}
          className={`p-1.5 rounded-lg transition-colors ${
            userFeedback === true
              ? 'bg-green-100 text-green-600'
              : 'hover:bg-gray-100 text-gray-400 hover:text-green-600'
          }`}
          aria-label="Thumbs up"
          aria-pressed={userFeedback === true}
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onFeedback(resource.id, false)}
          className={`p-1.5 rounded-lg transition-colors ${
            userFeedback === false
              ? 'bg-red-100 text-red-600'
              : 'hover:bg-gray-100 text-gray-400 hover:text-red-600'
          }`}
          aria-label="Thumbs down"
          aria-pressed={userFeedback === false}
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
