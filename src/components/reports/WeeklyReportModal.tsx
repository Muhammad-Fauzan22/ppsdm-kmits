'use client'

import { X, Trophy, TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import type { WeeklyReport } from '@/lib/ai/weekly-report-generator'

interface WeeklyReportModalProps {
  report: WeeklyReport
  onClose: () => void
}

export function WeeklyReportModal({ report, onClose }: WeeklyReportModalProps) {
  const weekStart = format(new Date(report.week_start), 'MMMM d')
  const weekEnd = format(new Date(report.week_end), 'MMMM d, yyyy')
  const { report_data } = report

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Weekly Report"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Weekly Report</h2>
              <p className="text-blue-100 text-sm mt-0.5">{weekStart} – {weekEnd}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
              aria-label="Close report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{report_data.stats.pomodoroCount}</p>
              <p className="text-xs text-blue-100">Pomodoros</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">
                {Math.round(report_data.stats.studyMinutes / 60)}h
              </p>
              <p className="text-xs text-blue-100">Study Time</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{report_data.stats.habitCompletionRate}%</p>
              <p className="text-xs text-blue-100">Habits Done</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Summary */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Summary</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{report_data.summary}</p>
          </div>

          {/* Achievements */}
          {report_data.achievements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <h3 className="font-semibold text-gray-900">Achievements</h3>
              </div>
              <ul className="space-y-2">
                {report_data.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 text-xs flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas to Improve */}
          {report_data.areasToImprove.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {report_data.areasToImprove.map((area, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <ArrowRight className="flex-shrink-0 w-4 h-4 text-orange-400 mt-0.5" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Week Goals */}
          {report_data.nextWeekGoals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-green-500" />
                <h3 className="font-semibold text-gray-900">Next Week Goals</h3>
              </div>
              <ul className="space-y-2">
                {report_data.nextWeekGoals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-sm text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Motivational Quote */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-700 italic">{report_data.motivationalQuote}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  )
}
