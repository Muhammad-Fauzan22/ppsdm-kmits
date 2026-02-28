'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Clock, BookOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface StudySession {
  id: string
  title: string
  topic: string
  host_name: string
  participant_count: number
  max_participants: number
  status: 'active' | 'ended'
  created_at: string
}

interface CreateRoomForm {
  title: string
  topic: string
  maxParticipants: number
}

export function StudyRoomList() {
  const router = useRouter()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<CreateRoomForm>({
    title: '',
    topic: '',
    maxParticipants: 4,
  })
  const [isCreating, setIsCreating] = useState(false)

  const fetchSessions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/study-sessions')
      if (!response.ok) throw new Error('Failed to fetch sessions')
      const json = await response.json() as { data: StudySession[] }
      setSessions(json.data ?? [])
    } catch (err) {
      console.error('Error fetching study sessions:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchSessions()
  }, [])

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createForm.title.trim()) return

    setIsCreating(true)
    try {
      const response = await fetch('/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })

      if (!response.ok) throw new Error('Failed to create session')
      const json = await response.json() as { data: StudySession }
      router.push(`/study-sessions/${json.data.id}`)
    } catch (err) {
      console.error('Error creating study session:', err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoin = (sessionId: string) => {
    router.push(`/study-sessions/${sessionId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Sessions</h2>
          <p className="text-sm text-gray-500 mt-0.5">Join or create collaborative study rooms</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Room
        </button>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Study Room</h3>
          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label htmlFor="room-title" className="block text-sm font-medium text-gray-700 mb-1">
                Room Title <span className="text-red-500">*</span>
              </label>
              <input
                id="room-title"
                type="text"
                value={createForm.title}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Calculus Study Group"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="room-topic" className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <input
                id="room-topic"
                type="text"
                value={createForm.topic}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Integration techniques"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="max-participants" className="block text-sm font-medium text-gray-700 mb-1">
                Max Participants
              </label>
              <select
                id="max-participants"
                value={createForm.maxParticipants}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, maxParticipants: parseInt(e.target.value, 10) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} participants</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || !createForm.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create & Join'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-xl h-24 animate-pulse" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No active study rooms</h3>
          <p className="text-sm text-gray-500 mb-4">Be the first to create a study room!</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Room
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{session.title}</h3>
                    <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      Live
                    </span>
                  </div>
                  {session.topic && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                      {session.topic}
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {session.participant_count}/{session.max_participants}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                    </div>
                    <span>Host: {session.host_name}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleJoin(session.id)}
                  disabled={session.participant_count >= session.max_participants}
                  className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {session.participant_count >= session.max_participants ? 'Full' : 'Join'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
