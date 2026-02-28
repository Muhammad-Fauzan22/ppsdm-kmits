'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { StudyRoom } from '@/components/study-sessions/StudyRoom'

interface StudySession {
  id: string
  title: string
  topic: string
  status: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function StudyRoomPage({ params }: PageProps) {
  const { id } = use(params)
  const [session, setSession] = useState<StudySession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/study-sessions/${id}`)
        if (!response.ok) {
          setError('Study session not found')
          return
        }
        const json = await response.json() as { data: StudySession }
        setSession(json.data)
      } catch {
        setError('Failed to load study session')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchSession()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center text-gray-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p>Loading study room...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center text-gray-400">
          <p className="text-xl mb-2">⚠️</p>
          <p>{error || 'Session not found'}</p>
        </div>
      </div>
    )
  }

  if (session.status === 'ended') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center text-gray-400">
          <p className="text-xl mb-2">🔒</p>
          <p>This study session has ended</p>
        </div>
      </div>
    )
  }

  return (
    <StudyRoom
      sessionId={session.id}
      sessionTitle={session.title}
    />
  )
}
