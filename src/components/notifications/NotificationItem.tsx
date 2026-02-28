'use client'

import { formatDistanceToNow } from 'date-fns'
import { Bell, Trophy, Clock, Users, Settings } from 'lucide-react'
import type { Notification, NotificationType } from '@/lib/notifications/notification-service'

interface NotificationItemProps {
  notification: Notification
  onMarkRead: (id: string) => void
}

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string }> = {
  achievement: {
    icon: <Trophy className="w-4 h-4" />,
    color: 'text-yellow-500 bg-yellow-50',
  },
  reminder: {
    icon: <Clock className="w-4 h-4" />,
    color: 'text-blue-500 bg-blue-50',
  },
  social: {
    icon: <Users className="w-4 h-4" />,
    color: 'text-green-500 bg-green-50',
  },
  system: {
    icon: <Settings className="w-4 h-4" />,
    color: 'text-gray-500 bg-gray-50',
  },
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const config = typeConfig[notification.type] ?? {
    icon: <Bell className="w-4 h-4" />,
    color: 'text-gray-500 bg-gray-50',
  }

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
        !notification.read ? 'bg-blue-50/50' : ''
      }`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          !notification.read && onMarkRead(notification.id)
        }
      }}
      aria-label={`Notification: ${notification.title}`}
    >
      <div className={`flex-shrink-0 p-2 rounded-full ${config.color}`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="flex-shrink-0 w-2 h-2 mt-1 rounded-full bg-blue-500" aria-label="Unread" />
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>
      </div>
    </div>
  )
}
