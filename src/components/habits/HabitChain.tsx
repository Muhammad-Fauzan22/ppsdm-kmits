'use client'

import { format, subDays } from 'date-fns'

interface HabitChainProps {
  completionDates: string[]
  color: string
  days?: number
}

export function HabitChain({ completionDates, color, days = 30 }: HabitChainProps) {
  const completionSet = new Set(completionDates)

  // Generate last N days
  const daySquares = Array.from({ length: days }, (_, i) => {
    const date = format(subDays(new Date(), days - 1 - i), 'yyyy-MM-dd')
    const isCompleted = completionSet.has(date)
    const isToday = date === format(new Date(), 'yyyy-MM-dd')

    return { date, isCompleted, isToday }
  })

  return (
    <div className="flex flex-wrap gap-1" role="list" aria-label="Habit completion chain">
      {daySquares.map(({ date, isCompleted, isToday }) => (
        <div
          key={date}
          role="listitem"
          title={`${date}: ${isCompleted ? 'Completed' : 'Not completed'}`}
          className={`w-4 h-4 rounded-sm transition-all ${
            isToday ? 'ring-2 ring-offset-1 ring-gray-400' : ''
          }`}
          style={{
            backgroundColor: isCompleted ? color : '#E5E7EB',
            opacity: isCompleted ? 1 : 0.5,
          }}
          aria-label={`${date}: ${isCompleted ? 'completed' : 'not completed'}`}
        />
      ))}
    </div>
  )
}
