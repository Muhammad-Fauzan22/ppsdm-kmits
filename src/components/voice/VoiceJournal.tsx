'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Search, Loader2 } from 'lucide-react'
import { VoiceRecorderComponent } from './VoiceRecorder'
import { JournalEntry, type VoiceJournalEntry } from './JournalEntry'
import { transcribeAudio } from '@/lib/voice/transcription-service'

const MOOD_EMOJIS = ['😔', '😐', '🙂', '😊', '🤩']

export function VoiceJournal() {
  const [entries, setEntries] = useState<VoiceJournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedMood, setSelectedMood] = useState(3)
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingRecording, setPendingRecording] = useState<{
    blob: Blob
    url: string
    duration: number
  } | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/voice/journal')
      if (response.ok) {
        const data = await response.json() as { entries: VoiceJournalEntry[] }
        setEntries(data.entries ?? [])
      }
    } catch (error) {
      console.error('Failed to fetch journal entries:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecordingComplete = async (blob: Blob, url: string, duration: number) => {
    setPendingRecording({ blob, url, duration })
  }

  const handleSaveEntry = async () => {
    if (!pendingRecording) return

    setIsSaving(true)
    setIsTranscribing(true)

    try {
      // Transcribe audio
      let transcript = ''
      try {
        const result = await transcribeAudio(pendingRecording.blob)
        transcript = result.text
      } catch (error) {
        console.warn('Transcription failed, saving without transcript:', error)
      }
      setIsTranscribing(false)

      // Save to API
      const formData = new FormData()
      formData.append('audio', pendingRecording.blob, 'recording.webm')
      formData.append('transcript', transcript)
      formData.append('duration', String(pendingRecording.duration))
      formData.append('mood', String(selectedMood))

      const response = await fetch('/api/voice/journal', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json() as { entry: VoiceJournalEntry }
        setEntries((prev) => [data.entry, ...prev])
        setPendingRecording(null)
      }
    } catch (error) {
      console.error('Failed to save journal entry:', error)
    } finally {
      setIsSaving(false)
      setIsTranscribing(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/voice/journal?id=${id}`, { method: 'DELETE' })
      if (response.ok) {
        setEntries((prev) => prev.filter((e) => e.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete entry:', error)
    }
  }

  const filteredEntries = entries.filter((entry) =>
    searchQuery
      ? entry.transcript.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-900">Voice Journal</h2>
      </div>

      {/* Recorder */}
      <VoiceRecorderComponent
        onRecordingComplete={handleRecordingComplete}
        onError={(error) => console.error('Recording error:', error)}
      />

      {/* Pending recording - mood selector and save */}
      {pendingRecording && (
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4 space-y-3">
          <p className="text-sm font-medium text-purple-800">Recording ready! How are you feeling?</p>

          {/* Mood selector */}
          <div className="flex gap-3 justify-center">
            {MOOD_EMOJIS.map((emoji, i) => (
              <button
                key={i}
                onClick={() => setSelectedMood(i + 1)}
                className={`text-2xl p-2 rounded-full transition-all ${
                  selectedMood === i + 1
                    ? 'bg-purple-200 scale-125'
                    : 'hover:bg-purple-100'
                }`}
                aria-label={`Mood ${i + 1}`}
                aria-pressed={selectedMood === i + 1}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPendingRecording(null)}
              className="flex-1 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSaveEntry}
              disabled={isSaving}
              className="flex-1 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isTranscribing ? 'Transcribing...' : 'Saving...'}
                </>
              ) : (
                'Save Entry'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transcripts..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Search journal entries"
        />
      </div>

      {/* Entries list */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {searchQuery ? 'No entries match your search' : 'No journal entries yet. Start recording!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <JournalEntry key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
