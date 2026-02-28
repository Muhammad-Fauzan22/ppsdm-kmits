'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { usePomodoroStore, type TimerState } from '@/lib/pomodoro/pomodoro-store'

const STATE_LABELS: Record<TimerState, string> = {
  idle: 'Ready',
  working: 'Focus Time',
  'short-break': 'Short Break',
  'long-break': 'Long Break',
}

const STATE_COLORS: Record<TimerState, string> = {
  idle: '#3B82F6',
  working: '#EF4444',
  'short-break': '#10B981',
  'long-break': '#8B5CF6',
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function playBeep(audioCtx: AudioContext): void {
  const oscillator = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioCtx.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime)
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5)

  oscillator.start(audioCtx.currentTime)
  oscillator.stop(audioCtx.currentTime + 0.5)
}

export function PomodoroTimer() {
  const {
    timerState,
    timeRemaining,
    isRunning,
    completedPomodoros,
    currentTaskLabel,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToNext,
    tick,
    setTaskLabel,
  } = usePomodoroStore()

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const prevRunningRef = useRef(isRunning)
  const prevTimeRef = useRef(timeRemaining)

  // Play sound when timer completes
  useEffect(() => {
    if (prevTimeRef.current > 0 && timeRemaining === 0 && settings.soundEnabled) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext()
      }
      playBeep(audioCtxRef.current)
    }
    prevTimeRef.current = timeRemaining
  }, [timeRemaining, settings.soundEnabled])

  // Show browser notification when timer completes
  useEffect(() => {
    if (prevTimeRef.current > 1 && timeRemaining <= 1 && settings.notificationsEnabled) {
      if (Notification.permission === 'granted') {
        new Notification(
          timerState === 'working' ? '🍅 Pomodoro Complete!' : '⏰ Break Over!',
          {
            body:
              timerState === 'working'
                ? 'Great work! Time for a break.'
                : 'Break time is over. Ready to focus?',
            icon: '/favicon.ico',
          }
        )
      }
    }
  }, [timeRemaining, timerState, settings.notificationsEnabled])

  // Timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick()
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    prevRunningRef.current = isRunning

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, tick])

  // Save session to API when completed
  const saveSession = useCallback(async () => {
    try {
      await fetch('/api/pomodoro/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: timerState,
          duration: settings.workDuration * 60,
          taskLabel: currentTaskLabel,
        }),
      })
    } catch (error) {
      console.error('Failed to save pomodoro session:', error)
    }
  }, [timerState, settings.workDuration, currentTaskLabel])

  // Calculate progress for circular indicator
  const totalDuration = (() => {
    switch (timerState) {
      case 'working': return settings.workDuration * 60
      case 'short-break': return settings.shortBreakDuration * 60
      case 'long-break': return settings.longBreakDuration * 60
      default: return settings.workDuration * 60
    }
  })()

  const progress = timerState === 'idle' ? 0 : (totalDuration - timeRemaining) / totalDuration
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference * (1 - progress)
  const color = STATE_COLORS[timerState]

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* State label */}
      <div className="text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: color }}
        >
          {STATE_LABELS[timerState]}
        </span>
      </div>

      {/* Circular progress */}
      <div className="relative">
        <svg width="220" height="220" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-900 tabular-nums">
            {formatTime(timeRemaining)}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            #{completedPomodoros + (timerState === 'working' ? 1 : 0)}
          </span>
        </div>
      </div>

      {/* Task label input */}
      <input
        type="text"
        value={currentTaskLabel}
        onChange={(e) => setTaskLabel(e.target.value)}
        placeholder="What are you working on?"
        className="w-full max-w-xs px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
        aria-label="Current task"
      />

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={isRunning ? pauseTimer : startTimer}
          className="p-4 rounded-full text-white transition-colors shadow-lg"
          style={{ backgroundColor: color }}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={() => {
            if (timerState === 'working') saveSession()
            skipToNext()
          }}
          className="p-3 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Skip to next"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Pomodoro dots */}
      <div className="flex gap-2">
        {Array.from({ length: settings.pomodorosBeforeLongBreak }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < completedPomodoros % settings.pomodorosBeforeLongBreak
                ? 'bg-red-500'
                : 'bg-gray-200'
            }`}
            aria-label={`Pomodoro ${i + 1} ${i < completedPomodoros % settings.pomodorosBeforeLongBreak ? 'completed' : 'pending'}`}
          />
        ))}
      </div>

      {/* Today's count */}
      <p className="text-sm text-gray-500">
        Today: <span className="font-semibold text-gray-700">{completedPomodoros}</span> pomodoros completed
      </p>
    </div>
  )
}
