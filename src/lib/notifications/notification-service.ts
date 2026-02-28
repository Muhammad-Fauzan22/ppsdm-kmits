/**
 * Real-time Notification Service
 * Uses Supabase Realtime channels for live updates
 */

import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type NotificationType = 'achievement' | 'reminder' | 'social' | 'system'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  created_at: string
  metadata: Record<string, unknown>
}

export interface NotificationPayload {
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, unknown>
}

let channel: RealtimeChannel | null = null

/**
 * Subscribe to real-time notifications for a user
 */
export function subscribeToNotifications(
  userId: string,
  onNotification: (notification: Notification) => void
): () => void {
  const supabase = createClient()

  channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNotification(payload.new as Notification)
      }
    )
    .subscribe()

  return () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }
}

/**
 * Fetch notifications for a user
 */
export async function fetchNotifications(
  userId: string,
  limit = 20
): Promise<Notification[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data as Notification[]
}

/**
 * Mark a notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Error marking notification as read:', error)
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }

  return count ?? 0
}

/**
 * Create a notification (server-side use)
 */
export async function createNotification(
  userId: string,
  payload: NotificationPayload
): Promise<Notification | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      read: false,
      metadata: payload.metadata ?? {},
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    return null
  }

  return data as Notification
}
