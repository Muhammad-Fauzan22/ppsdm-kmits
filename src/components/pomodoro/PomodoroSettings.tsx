'use client'

import { useState } from 'react'
import { X, Settings } from 'lucide-react'
import { usePomodoroStore } from '@/lib/pomodoro/pomodoro-store'

export function PomodoroSettings() {
  const { settings, updateSettings } = usePomodoroStore()
  const [isOpen, setIsOpen] = useState(false)
  const [localSettings, setLocalSettings] = useState(settings)

  const handleOpen = () => {
    setLocalSettings(settings)
    setIsOpen(true)
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setIsOpen(false)
  }

  const handleChange = (key: keyof typeof settings, value: number | boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
        aria-label="Open settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-label="Pomodoro Settings"
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Timer Settings</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-5">
              {/* Duration settings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Time (minutes)</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="work-duration">
                      Focus
                    </label>
                    <input
                      id="work-duration"
                      type="number"
                      min={1}
                      max={60}
                      value={localSettings.workDuration}
                      onChange={(e) => handleChange('workDuration', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="short-break">
                      Short Break
                    </label>
                    <input
                      id="short-break"
                      type="number"
                      min={1}
                      max={30}
                      value={localSettings.shortBreakDuration}
                      onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" htmlFor="long-break">
                      Long Break
                    </label>
                    <input
                      id="long-break"
                      type="number"
                      min={1}
                      max={60}
                      value={localSettings.longBreakDuration}
                      onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pomodoros before long break */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pomodoros-count">
                  Pomodoros before long break
                </label>
                <input
                  id="pomodoros-count"
                  type="number"
                  min={1}
                  max={10}
                  value={localSettings.pomodorosBeforeLongBreak}
                  onChange={(e) => handleChange('pomodorosBeforeLongBreak', parseInt(e.target.value, 10))}
                  className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Toggle settings */}
              <div className="space-y-3">
                {[
                  { key: 'autoStartBreaks' as const, label: 'Auto-start breaks' },
                  { key: 'autoStartPomodoros' as const, label: 'Auto-start pomodoros' },
                  { key: 'soundEnabled' as const, label: 'Sound notifications' },
                  { key: 'notificationsEnabled' as const, label: 'Browser notifications' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{label}</span>
                    <button
                      role="switch"
                      aria-checked={localSettings[key] as boolean}
                      onClick={() => handleChange(key, !localSettings[key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        localSettings[key] ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          localSettings[key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
