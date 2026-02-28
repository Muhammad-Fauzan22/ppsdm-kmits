'use client'

import { forwardRef } from 'react'
import type { CardData } from '@/lib/sharing/card-generator'

export type CardTheme = 'dark' | 'light' | 'gradient'
export type CardSize = 'story' | 'square'

interface ProgressCardProps {
  cardData: CardData
  theme: CardTheme
  size: CardSize
}

const THEME_STYLES: Record<CardTheme, {
  wrapper: string
  title: string
  subtitle: string
  text: string
  subtext: string
  statBg: string
  statText: string
  progressBg: string
  progressFill: string
  quoteBg: string
  quoteText: string
  badge: string
}> = {
  dark: {
    wrapper: 'bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900',
    title: 'text-white',
    subtitle: 'text-blue-300',
    text: 'text-white',
    subtext: 'text-gray-400',
    statBg: 'bg-white/10',
    statText: 'text-white',
    progressBg: 'bg-white/20',
    progressFill: 'bg-blue-400',
    quoteBg: 'bg-white/5 border border-white/10',
    quoteText: 'text-gray-300',
    badge: 'bg-blue-600 text-white',
  },
  light: {
    wrapper: 'bg-white',
    title: 'text-gray-900',
    subtitle: 'text-blue-600',
    text: 'text-gray-900',
    subtext: 'text-gray-500',
    statBg: 'bg-gray-100',
    statText: 'text-gray-900',
    progressBg: 'bg-gray-200',
    progressFill: 'bg-blue-600',
    quoteBg: 'bg-blue-50 border border-blue-100',
    quoteText: 'text-gray-600',
    badge: 'bg-blue-600 text-white',
  },
  gradient: {
    wrapper: 'bg-gradient-to-br from-[#003087] via-[#0050c8] to-[#0080ff]',
    title: 'text-white',
    subtitle: 'text-blue-200',
    text: 'text-white',
    subtext: 'text-blue-200',
    statBg: 'bg-white/15',
    statText: 'text-white',
    progressBg: 'bg-white/20',
    progressFill: 'bg-white',
    quoteBg: 'bg-white/10 border border-white/20',
    quoteText: 'text-blue-100',
    badge: 'bg-white text-blue-700',
  },
}

export const ProgressCard = forwardRef<HTMLDivElement, ProgressCardProps>(
  ({ cardData, theme, size }, ref) => {
    const styles = THEME_STYLES[theme]
    const isStory = size === 'story'

    return (
      <div
        ref={ref}
        className={`${styles.wrapper} ${isStory ? 'w-[360px] h-[640px]' : 'w-[400px] h-[400px]'} rounded-2xl p-6 flex flex-col relative overflow-hidden`}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 bg-white transform -translate-x-8 translate-y-8" />

        {/* Header */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${styles.subtitle}`}>
                PPSDM KMITS
              </p>
              <h1 className={`text-lg font-bold ${styles.title}`}>Learning Progress</h1>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles.badge}`}>
              {cardData.period}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {cardData.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className={`font-bold text-sm ${styles.text}`}>{cardData.username}</p>
              <p className={`text-xs ${styles.subtext}`}>ITS Student</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-2 mb-4">
          <div className={`${styles.statBg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${styles.statText}`}>{cardData.totalStudyHours}</p>
            <p className={`text-xs ${styles.subtext}`}>Study Hours</p>
          </div>
          <div className={`${styles.statBg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${styles.statText}`}>{cardData.streakRecord}</p>
            <p className={`text-xs ${styles.subtext}`}>Best Streak</p>
          </div>
          <div className={`${styles.statBg} rounded-xl p-3 text-center`}>
            <p className={`text-xl font-bold ${styles.statText}`}>{cardData.achievementsCount}</p>
            <p className={`text-xs ${styles.subtext}`}>Achievements</p>
          </div>
        </div>

        {/* Top Dimensions */}
        {cardData.topDimensions.length > 0 && (
          <div className="relative z-10 mb-4">
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${styles.subtext}`}>
              Top Dimensions
            </p>
            <div className="space-y-2">
              {cardData.topDimensions.map((dim) => (
                <div key={dim.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${styles.text}`}>{dim.name}</span>
                    <span className={`text-xs font-bold ${styles.text}`}>{dim.score}%</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${styles.progressBg}`}>
                    <div
                      className={`h-1.5 rounded-full ${styles.progressFill} transition-all`}
                      style={{ width: `${Math.min(100, dim.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Quote */}
        <div className={`relative z-10 mt-auto ${styles.quoteBg} rounded-xl p-3`}>
          <p className={`text-xs italic leading-relaxed ${styles.quoteText}`}>
            &ldquo;{cardData.motivationalQuote}&rdquo;
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-3 flex items-center justify-between">
          <p className={`text-xs ${styles.subtext}`}>kmits.its.ac.id</p>
          <p className={`text-xs ${styles.subtext}`}>🎓 PPSDM KMITS LMS</p>
        </div>
      </div>
    )
  }
)

ProgressCard.displayName = 'ProgressCard'
