'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Target, Lightbulb, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import type { WeeklyReport } from '@/lib/ai/weekly-report-generator'
import { WeeklyReportModal } from './WeeklyReportModal'

export function WeeklyReportCard() {
  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    fetchLatestReport()
  }, [])

  const fetchLatestReport = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/reports/weekly')
      if (response.ok) {
        const data = await response.json() as { report: WeeklyReport | null }
        setReport(data.report)
      }
    } catch (error) {
      console.error('Failed to fetch weekly report:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/cron/weekly-report')
      if (response.ok) {
        await fetchLatestReport()
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Weekly Report</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          No report generated yet. Generate your first weekly learning report!
        </p>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-2 px-4 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
    )
  }

  const weekStart = format(new Date(report.week_start), 'MMM d')
  const weekEnd = format(new Date(report.week_end), 'MMM d, yyyy')

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Weekly Report</h3>
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {weekStart} - {weekEnd}
          </span>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {report.report_data.summary}
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-blue-600">
              {report.report_data.stats.pomodoroCount}
            </p>
            <p className="text-xs text-gray-500">Pomodoros</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-green-600">
              {Math.round(report.report_data.stats.studyMinutes / 60)}h
            </p>
            <p className="text-xs text-gray-500">Study Time</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-orange-600">
              {report.report_data.stats.habitCompletionRate}%
            </p>
            <p className="text-xs text-gray-500">Habits</p>
          </div>
        </div>

        {/* Top achievement */}
        {report.report_data.achievements.length > 0 && (
          <div className="flex items-start gap-2 mb-4 bg-white rounded-lg p-3">
            <Target className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">{report.report_data.achievements[0]}</p>
          </div>
        )}

        {/* Motivational quote */}
        <div className="flex items-start gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 italic line-clamp-2">
            {report.report_data.motivationalQuote}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2 px-4 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Full Report →
        </button>
      </div>

      {isModalOpen && (
        <WeeklyReportModal
          report={report}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
