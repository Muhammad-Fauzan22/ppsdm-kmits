'use client'

import { useState } from 'react'
import { Send, Trophy, HelpCircle, Lightbulb, Heart } from 'lucide-react'
import type { PostType } from '@/lib/social/feed-service'

interface CreatePostProps {
  onPost: (type: PostType, content: string) => Promise<void>
}

const POST_TYPES: Array<{ type: PostType; label: string; icon: React.ReactNode; placeholder: string }> = [
  {
    type: 'achievement',
    label: 'Achievement',
    icon: <Trophy className="w-4 h-4" />,
    placeholder: 'Share something you accomplished today...',
  },
  {
    type: 'question',
    label: 'Question',
    icon: <HelpCircle className="w-4 h-4" />,
    placeholder: 'Ask the community something...',
  },
  {
    type: 'tip',
    label: 'Tip',
    icon: <Lightbulb className="w-4 h-4" />,
    placeholder: 'Share a useful tip or insight...',
  },
  {
    type: 'struggle',
    label: 'Struggle',
    icon: <Heart className="w-4 h-4" />,
    placeholder: 'Share something you\'re finding difficult...',
  },
]

export function CreatePost({ onPost }: CreatePostProps) {
  const [selectedType, setSelectedType] = useState<PostType>('achievement')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const maxLength = 500
  const remaining = maxLength - content.length
  const selectedConfig = POST_TYPES.find((t) => t.type === selectedType)!

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return

    setError(null)
    setIsSubmitting(true)

    try {
      await onPost(selectedType, content.trim())
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl" role="img" aria-label="Your avatar">🎓</span>
        <p className="text-sm font-medium text-gray-700">Share anonymously as Mahasiswa ITS</p>
      </div>

      {/* Post type selector */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {POST_TYPES.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedType === type
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-pressed={selectedType === type}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Content textarea */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={selectedConfig.placeholder}
          maxLength={maxLength}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Post content"
        />

        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs ${remaining < 50 ? 'text-red-500' : 'text-gray-400'}`}>
            {remaining} characters remaining
          </span>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting || content.length > maxLength}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
