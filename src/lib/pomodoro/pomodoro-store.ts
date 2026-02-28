/**
 * Pomodoro Timer Zustand Store
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TimerState = 'idle' | 'working' | 'short-break' | 'long-break'

export interface PomodoroSettings {
  workDuration: number      // minutes
  shortBreakDuration: number // minutes
  longBreakDuration: number  // minutes
  pomodorosBeforeLongBreak: number
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
  soundEnabled: boolean
  notificationsEnabled: boolean
}

export interface PomodoroSession {
  id: string
  type: TimerState
  duration: number
  taskLabel: string
  completedAt: string
}

export interface PomodoroStore {
  // Timer state
  timerState: TimerState
  timeRemaining: number // seconds
  isRunning: boolean
  completedPomodoros: number
  currentTaskLabel: string

  // Settings
  settings: PomodoroSettings

  // Today's sessions
  todaySessions: PomodoroSession[]

  // Actions
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  skipToNext: () => void
  tick: () => void
  setTaskLabel: (label: string) => void
  updateSettings: (settings: Partial<PomodoroSettings>) => void
  addSession: (session: PomodoroSession) => void
  setTodaySessions: (sessions: PomodoroSession[]) => void
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  pomodorosBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: true,
}

function getDurationForState(state: TimerState, settings: PomodoroSettings): number {
  switch (state) {
    case 'working':
      return settings.workDuration * 60
    case 'short-break':
      return settings.shortBreakDuration * 60
    case 'long-break':
      return settings.longBreakDuration * 60
    default:
      return settings.workDuration * 60
  }
}

function getNextState(
  currentState: TimerState,
  completedPomodoros: number,
  settings: PomodoroSettings
): TimerState {
  if (currentState === 'working') {
    const newCount = completedPomodoros + 1
    if (newCount % settings.pomodorosBeforeLongBreak === 0) {
      return 'long-break'
    }
    return 'short-break'
  }
  return 'working'
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      timerState: 'idle',
      timeRemaining: DEFAULT_SETTINGS.workDuration * 60,
      isRunning: false,
      completedPomodoros: 0,
      currentTaskLabel: '',
      settings: DEFAULT_SETTINGS,
      todaySessions: [],

      startTimer: () => {
        const { timerState, settings } = get()
        const newState = timerState === 'idle' ? 'working' : timerState
        set({
          timerState: newState,
          isRunning: true,
          timeRemaining:
            timerState === 'idle'
              ? getDurationForState('working', settings)
              : get().timeRemaining,
        })
      },

      pauseTimer: () => {
        set({ isRunning: false })
      },

      resetTimer: () => {
        const { settings } = get()
        set({
          timerState: 'idle',
          timeRemaining: getDurationForState('working', settings),
          isRunning: false,
        })
      },

      skipToNext: () => {
        const { timerState, completedPomodoros, settings } = get()
        const nextState = getNextState(timerState, completedPomodoros, settings)
        const newCount =
          timerState === 'working' ? completedPomodoros + 1 : completedPomodoros

        set({
          timerState: nextState,
          timeRemaining: getDurationForState(nextState, settings),
          isRunning: false,
          completedPomodoros: newCount,
        })
      },

      tick: () => {
        const { timeRemaining, timerState, completedPomodoros, settings, currentTaskLabel } = get()

        if (timeRemaining <= 1) {
          // Timer completed
          const newCount =
            timerState === 'working' ? completedPomodoros + 1 : completedPomodoros
          const nextState = getNextState(timerState, completedPomodoros, settings)

          // Add completed session
          if (timerState === 'working' || timerState === 'short-break' || timerState === 'long-break') {
            const session: PomodoroSession = {
              id: crypto.randomUUID(),
              type: timerState,
              duration: getDurationForState(timerState, settings),
              taskLabel: currentTaskLabel,
              completedAt: new Date().toISOString(),
            }
            get().addSession(session)
          }

          const autoStart =
            nextState !== 'working'
              ? settings.autoStartBreaks
              : settings.autoStartPomodoros

          set({
            timerState: nextState,
            timeRemaining: getDurationForState(nextState, settings),
            isRunning: autoStart,
            completedPomodoros: newCount,
          })
        } else {
          set({ timeRemaining: timeRemaining - 1 })
        }
      },

      setTaskLabel: (label: string) => {
        set({ currentTaskLabel: label })
      },

      updateSettings: (newSettings: Partial<PomodoroSettings>) => {
        const { settings, timerState, isRunning } = get()
        const updated = { ...settings, ...newSettings }
        set({ settings: updated })

        // Update time remaining if not running
        if (!isRunning) {
          set({ timeRemaining: getDurationForState(timerState === 'idle' ? 'working' : timerState, updated) })
        }
      },

      addSession: (session: PomodoroSession) => {
        set((state) => ({
          todaySessions: [...state.todaySessions, session],
        }))
      },

      setTodaySessions: (sessions: PomodoroSession[]) => {
        set({ todaySessions: sessions })
      },
    }),
    {
      name: 'pomodoro-store',
      partialize: (state) => ({
        settings: state.settings,
        completedPomodoros: state.completedPomodoros,
      }),
    }
  )
)
