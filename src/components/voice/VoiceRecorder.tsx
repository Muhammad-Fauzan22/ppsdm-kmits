'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, Square, Pause, Play } from 'lucide-react'
import { VoiceRecorder as VoiceRecorderLib } from '@/lib/voice/voice-recorder'

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, url: string, duration: number) => void
  onError?: (error: Error) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function VoiceRecorderComponent({ onRecordingComplete, onError }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>(Array(32).fill(0))
  const recorderRef = useRef<VoiceRecorderLib | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const isSupported = VoiceRecorderLib.isSupported()

  const handleStop = useCallback((blob: Blob, url: string) => {
    setIsRecording(false)
    setIsPaused(false)
    onRecordingComplete(blob, url, duration)
  }, [duration, onRecordingComplete])

  useEffect(() => {
    recorderRef.current = new VoiceRecorderLib({
      onDurationUpdate: (d) => setDuration(d),
      onWaveformData: (data) => {
        // Downsample to 32 bars
        const bars: number[] = []
        const step = Math.floor(data.length / 32)
        for (let i = 0; i < 32; i++) {
          bars.push(data[i * step] / 255)
        }
        setWaveformData(bars)
      },
      onStop: handleStop,
      onError: (error) => {
        setIsRecording(false)
        onError?.(error)
      },
    })

    return () => {
      recorderRef.current?.stop()
    }
  }, [handleStop, onError])

  const handleStart = async () => {
    if (!recorderRef.current) return
    setDuration(0)
    await recorderRef.current.start()
    setIsRecording(true)
  }

  const handleStop = () => {
    recorderRef.current?.stop()
  }

  const handlePauseResume = () => {
    if (!recorderRef.current) return
    if (isPaused) {
      recorderRef.current.resume()
      setIsPaused(false)
    } else {
      recorderRef.current.pause()
      setIsPaused(true)
    }
  }

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500">Voice recording is not supported in this browser</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
      {/* Waveform visualization */}
      <div className="flex items-center gap-0.5 h-12 w-full max-w-xs">
        {waveformData.map((value, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-75 ${
              isRecording && !isPaused ? 'bg-red-400' : 'bg-gray-300'
            }`}
            style={{
              height: `${Math.max(4, value * 100)}%`,
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <div className={`text-2xl font-mono font-bold ${isRecording ? 'text-red-500' : 'text-gray-400'}`}>
        {formatDuration(duration)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-medium rounded-full hover:bg-red-600 transition-colors shadow-lg"
            aria-label="Start recording"
          >
            <Mic className="w-5 h-5" />
            Record
          </button>
        ) : (
          <>
            <button
              onClick={handlePauseResume}
              className="p-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
              aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={handleStop}
              className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Stop recording"
            >
              <Square className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-red-400 animate-pulse'}`} />
          {isPaused ? 'Paused' : 'Recording...'}
        </p>
      )}
    </div>
  )
}
