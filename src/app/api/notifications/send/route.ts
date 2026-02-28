import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

interface SendNotificationBody {
  userId: string
  type: 'achievement' | 'reminder' | 'social' | 'system'
  title: string
  message: string
  metadata?: Record<string, unknown>
}

/**
 * POST /api/notifications/send - Send a notification to a user
 * This endpoint creates a notification in the database (triggers realtime)
 * and optionally sends a web push notification
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as SendNotificationBody

    if (!body.userId || !body.type || !body.title || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Use admin client to insert notification (bypasses RLS for server-side sends)
    const adminClient = createAdminClient()

    const { data: notification, error: insertError } = await adminClient
      .from('notifications')
      .insert({
        user_id: body.userId,
        type: body.type,
        title: body.title,
        message: body.message,
        read: false,
        metadata: body.metadata ?? {},
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating notification:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Try to send web push notification
    try {
      const { data: subscriptions } = await adminClient
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', body.userId)

      if (subscriptions && subscriptions.length > 0) {
        // Send push to all subscriptions
        const pushPayload = JSON.stringify({
          title: body.title,
          body: body.message,
          icon: '/favicon.ico',
          data: { notificationId: notification.id, type: body.type },
        })

        // Note: In production, use web-push library with VAPID keys
        // For now, we log the intent
        console.log(`Would send push to ${subscriptions.length} subscription(s):`, pushPayload)
      }
    } catch (pushError) {
      // Push failure shouldn't fail the whole request
      console.warn('Push notification failed:', pushError)
    }

    return NextResponse.json({
      success: true,
      notification,
    })
  } catch (error) {
    console.error('POST /api/notifications/send error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
