'use client'

import { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { Play, Pause, Trash2, FileText } from 'lucide-react'

export interface VoiceJournalEntry {
  id: string
  audio_url: string
  transcript: string
  duration: number
  mood: number
  created_at: string
}

interface JournalEntryProps {
  entry: VoiceJournalEntry
  onDelete: (id: string) => void
}

const MOOD_EMOJIS = ['', '😔', '😐', '🙂', '😊', '🤩']
const MOOD_LABELS = ['', 'Sad', 'Neutral', 'Good', 'Happy', 'Amazing']

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function JournalEntry({ entry, onDelete }: JournalEntryProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio] = useState(() => new Audio(entry.audio_url))
  const [showTranscript, setShowTranscript] = useState(false)

  const handlePlayPause = () => {
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
      audio.onended = () => setIsPlaying(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })
  const dateStr = format(new Date(entry.created_at), 'MMM d, yyyy HH:mm')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label={`Mood: ${MOOD_LABELS[entry.mood]}`}>
              {MOOD_EMOJIS[entry.mood]}
            </span>
            <span className="text-sm font-medium text-gray-700">{MOOD_LABELS[entry.mood]}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5" title={dateStr}>{timeAgo}</p>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Audio player */}
      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 mb-3">
        <button
          onClick={handlePlayPause}
          className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full w-0" />
          </div>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">{formatDuration(entry.duration)}</span>
      </div>

      {/* Transcript */}
      {entry.transcript && (
        <div>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <FileText className="w-3.5 h-3.5" />
            {showTranscript ? 'Hide' : 'Show'} transcript
          </button>
          {showTranscript && (
            <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
              {entry.transcript}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
