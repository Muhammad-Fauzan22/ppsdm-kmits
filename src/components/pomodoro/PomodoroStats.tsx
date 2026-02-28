'use client'

import { useEffect, useState } from 'react'
import { BarChart2, Clock, Target, Flame } from 'lucide-react'
import { usePomodoroStore } from '@/lib/pomodoro/pomodoro-store'

interface DailyStats {
  date: string
  count: number
  totalMinutes: number
}

export function PomodoroStats() {
  const { todaySessions, completedPomodoros, settings } = usePomodoroStore()
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const todayPomodoros = todaySessions.filter((s) => s.type === 'working').length
  const todayMinutes = todayPomodoros * settings.workDuration

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/pomodoro/sessions?period=week')
        if (response.ok) {
          const data = await response.json() as { stats: DailyStats[] }
          setWeeklyStats(data.stats ?? [])
        }
      } catch (error) {
        console.error('Failed to fetch weekly stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklyStats()
  }, [completedPomodoros])

  const maxCount = Math.max(...weeklyStats.map((s) => s.count), 1)

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-blue-500" />
        Statistics
      </h3>

      {/* Today's stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">{todayPomodoros}</p>
          <p className="text-xs text-gray-500">Today</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{todayMinutes}</p>
          <p className="text-xs text-gray-500">Minutes</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600">{completedPomodoros}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-3">This Week</p>
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex items-end gap-2 h-20">
            {dayLabels.map((day, i) => {
              const stat = weeklyStats[i]
              const height = stat ? (stat.count / maxCount) * 100 : 0
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-red-400 rounded-t transition-all duration-300"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={stat ? `${stat.count} pomodoros` : '0 pomodoros'}
                  />
                  <span className="text-xs text-gray-400">{day}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
