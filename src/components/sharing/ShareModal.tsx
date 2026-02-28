'use client'

import { useState, useRef } from 'react'
import { X, Copy, Check, MessageCircle } from 'lucide-react'
import { ProgressCard, type CardTheme, type CardSize } from './ProgressCard'
import { CardExporter } from './CardExporter'
import type { CardData } from '@/lib/sharing/card-generator'

interface ShareModalProps {
  cardData: CardData
  userId: string
  onClose: () => void
}

const THEMES: { value: CardTheme; label: string; preview: string }[] = [
  { value: 'dark', label: 'Dark', preview: 'bg-gray-900' },
  { value: 'light', label: 'Light', preview: 'bg-white border border-gray-200' },
  { value: 'gradient', label: 'Gradient', preview: 'bg-gradient-to-br from-blue-800 to-blue-500' },
]

const SIZES: { value: CardSize; label: string; description: string }[] = [
  { value: 'story', label: 'Story', description: '9:16 ratio' },
  { value: 'square', label: 'Square', description: '1:1 ratio' },
]

export function ShareModal({ cardData, userId, onClose }: ShareModalProps) {
  const [theme, setTheme] = useState<CardTheme>('dark')
  const [size, setSize] = useState<CardSize>('square')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${userId}/current`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy link')
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `🎓 Check out my learning progress on PPSDM KMITS LMS!\n\n` +
      `📚 ${cardData.totalStudyHours} study hours\n` +
      `🔥 ${cardData.streakRecord} day streak record\n` +
      `🏆 ${cardData.achievementsCount} achievements\n\n` +
      `View my full progress: ${shareUrl}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Share Progress Card</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
            <div className="flex gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    theme === t.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  aria-pressed={theme === t.value}
                >
                  <div className={`w-4 h-4 rounded-full ${t.preview}`} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Size</label>
            <div className="flex gap-3">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                    size === s.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  aria-pressed={size === s.value}
                >
                  <span>{s.label}</span>
                  <span className="text-xs opacity-70">{s.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Preview</label>
            <div className="flex justify-center bg-gray-100 rounded-xl p-6 overflow-auto">
              <ProgressCard
                ref={cardRef}
                cardData={cardData}
                theme={theme}
                size={size}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Download */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Download PNG</p>
                <p className="text-xs text-gray-500">Save card as image</p>
              </div>
              <CardExporter
                cardRef={cardRef}
                filename={`ppsdm-kmits-progress-${cardData.username.toLowerCase().replace(/\s+/g, '-')}`}
              />
            </div>

            {/* WhatsApp */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-900">Share to WhatsApp</p>
                <p className="text-xs text-gray-500">Send progress summary</p>
              </div>
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
            </div>

            {/* Copy Link */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex-1 min-w-0 mr-3">
                <p className="text-sm font-medium text-gray-900">Copy Link</p>
                <p className="text-xs text-gray-500 truncate">{shareUrl}</p>
              </div>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
