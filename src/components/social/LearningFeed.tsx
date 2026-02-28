'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Users } from 'lucide-react'
import {
  fetchFeedPosts,
  createPost,
  addReaction,
  getUserReactions,
  type SocialPost,
  type ReactionType,
  type PostType,
} from '@/lib/social/feed-service'
import { FeedPost } from './FeedPost'
import { CreatePost } from './CreatePost'

export function LearningFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [userReactions, setUserReactions] = useState<Record<string, ReactionType[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadPosts = useCallback(async (cursor?: string) => {
    if (cursor) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }

    try {
      const { posts: newPosts, nextCursor: newCursor } = await fetchFeedPosts(cursor)

      if (cursor) {
        setPosts((prev) => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }

      setNextCursor(newCursor)
      setHasMore(newCursor !== null)

      // Fetch user reactions for new posts
      if (newPosts.length > 0) {
        const reactions = await getUserReactions(newPosts.map((p) => p.id))
        setUserReactions((prev) => ({ ...prev, ...reactions }))
      }
    } catch (error) {
      console.error('Failed to load posts:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Infinite scroll with IntersectionObserver
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !isLoadingMore) {
          loadPosts(nextCursor)
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [hasMore, nextCursor, isLoadingMore, loadPosts])

  const handlePost = async (type: PostType, content: string) => {
    const newPost = await createPost({ type, content })
    if (newPost) {
      setPosts((prev) => [newPost, ...prev])
    }
  }

  const handleReact = async (postId: string, reactionType: ReactionType) => {
    const isAdded = await addReaction(postId, reactionType)

    // Optimistic update
    setUserReactions((prev) => {
      const current = prev[postId] ?? []
      if (isAdded) {
        return { ...prev, [postId]: [...current, reactionType] }
      } else {
        return { ...prev, [postId]: current.filter((r) => r !== reactionType) }
      }
    })

    // Update post reaction count
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post
        const delta = isAdded ? 1 : -1
        return {
          ...post,
          reactions: {
            ...post.reactions,
            [reactionType]: Math.max(0, (post.reactions[reactionType] ?? 0) + delta),
          },
        }
      })
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">Learning Community</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Anonymous</span>
      </div>

      {/* Create post */}
      <CreatePost onPost={handlePost} />

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-2 bg-gray-200 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedPost
              key={post.id}
              post={post}
              userReactions={userReactions[post.id] ?? []}
              onReact={handleReact}
            />
          ))}

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="py-2">
            {isLoadingMore && (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <p className="text-center text-xs text-gray-400">You've seen all posts</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
