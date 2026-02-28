'use client'

import { formatDistanceToNow } from 'date-fns'
import { Trophy, HelpCircle, Lightbulb, Heart } from 'lucide-react'
import {
  type SocialPost,
  type ReactionType,
  REACTION_EMOJIS,
  getAnonymousAvatar,
} from '@/lib/social/feed-service'

interface FeedPostProps {
  post: SocialPost
  userReactions: ReactionType[]
  onReact: (postId: string, reactionType: ReactionType) => void
}

const POST_TYPE_CONFIG = {
  achievement: { icon: <Trophy className="w-3.5 h-3.5" />, label: 'Achievement', color: 'text-yellow-600 bg-yellow-50' },
  question: { icon: <HelpCircle className="w-3.5 h-3.5" />, label: 'Question', color: 'text-blue-600 bg-blue-50' },
  tip: { icon: <Lightbulb className="w-3.5 h-3.5" />, label: 'Tip', color: 'text-green-600 bg-green-50' },
  struggle: { icon: <Heart className="w-3.5 h-3.5" />, label: 'Struggle', color: 'text-red-600 bg-red-50' },
}

const REACTION_LABELS: Record<ReactionType, string> = {
  motivate: 'Motivate',
  relatable: 'Relatable',
  helpful: 'Helpful',
  support: 'Support',
}

export function FeedPost({ post, userReactions, onReact }: FeedPostProps) {
  const typeConfig = POST_TYPE_CONFIG[post.type]
  const avatar = getAnonymousAvatar(post.anonymous_id)
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="Anonymous avatar">
            {avatar}
          </span>
          <div>
            <p className="text-sm font-medium text-gray-900">Mahasiswa ITS</p>
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
          {typeConfig.icon}
          {typeConfig.label}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{post.content}</p>

      {/* Reactions */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((reactionType) => {
          const isActive = userReactions.includes(reactionType)
          const count = post.reactions[reactionType] ?? 0

          return (
            <button
              key={reactionType}
              onClick={() => onReact(post.id, reactionType)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
              aria-label={`${REACTION_LABELS[reactionType]}: ${count}`}
              aria-pressed={isActive}
            >
              <span>{REACTION_EMOJIS[reactionType]}</span>
              <span>{count > 0 ? count : REACTION_LABELS[reactionType]}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
