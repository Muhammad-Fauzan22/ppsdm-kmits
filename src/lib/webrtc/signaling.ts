/**
 * Signaling service using Supabase Realtime
 */

import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

export type SignalingMessageType = 'offer' | 'answer' | 'ice-candidate' | 'join' | 'leave'

export interface SignalingMessage {
  type: SignalingMessageType
  from: string
  to?: string
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit | { userId: string }
}

export type SignalingCallback = (message: SignalingMessage) => void

let activeChannel: RealtimeChannel | null = null

/**
 * Join a signaling channel for a study session
 */
export function joinSignalingChannel(
  sessionId: string,
  userId: string,
  onMessage: SignalingCallback
): RealtimeChannel {
  const supabase = createClient()
  const channelName = `study-session:${sessionId}`

  // Leave existing channel if any
  if (activeChannel) {
    void supabase.removeChannel(activeChannel)
  }

  const channel = supabase.channel(channelName, {
    config: { broadcast: { self: false } },
  })

  channel
    .on('broadcast', { event: 'signaling' }, ({ payload }) => {
      const message = payload as SignalingMessage
      // Only process messages intended for this user or broadcast messages
      if (!message.to || message.to === userId) {
        onMessage(message)
      }
    })
    .subscribe()

  // Announce joining
  void channel.send({
    type: 'broadcast',
    event: 'signaling',
    payload: {
      type: 'join',
      from: userId,
      payload: { userId },
    } satisfies SignalingMessage,
  })

  activeChannel = channel
  return channel
}

/**
 * Leave a signaling channel
 */
export async function leaveSignalingChannel(
  sessionId: string,
  userId: string
): Promise<void> {
  const supabase = createClient()

  if (activeChannel) {
    await activeChannel.send({
      type: 'broadcast',
      event: 'signaling',
      payload: {
        type: 'leave',
        from: userId,
        payload: { userId },
      } satisfies SignalingMessage,
    })
    await supabase.removeChannel(activeChannel)
    activeChannel = null
  }
}

/**
 * Send an SDP offer to a specific peer
 */
export async function sendOffer(
  sessionId: string,
  fromUserId: string,
  targetUserId: string,
  offer: RTCSessionDescriptionInit
): Promise<void> {
  if (!activeChannel) {
    console.error('No active signaling channel for session:', sessionId)
    return
  }

  await activeChannel.send({
    type: 'broadcast',
    event: 'signaling',
    payload: {
      type: 'offer',
      from: fromUserId,
      to: targetUserId,
      payload: offer,
    } satisfies SignalingMessage,
  })
}

/**
 * Send an SDP answer to a specific peer
 */
export async function sendAnswer(
  sessionId: string,
  fromUserId: string,
  targetUserId: string,
  answer: RTCSessionDescriptionInit
): Promise<void> {
  if (!activeChannel) {
    console.error('No active signaling channel for session:', sessionId)
    return
  }

  await activeChannel.send({
    type: 'broadcast',
    event: 'signaling',
    payload: {
      type: 'answer',
      from: fromUserId,
      to: targetUserId,
      payload: answer,
    } satisfies SignalingMessage,
  })
}

/**
 * Send an ICE candidate to a specific peer
 */
export async function sendIceCandidate(
  sessionId: string,
  fromUserId: string,
  targetUserId: string,
  candidate: RTCIceCandidateInit
): Promise<void> {
  if (!activeChannel) {
    console.error('No active signaling channel for session:', sessionId)
    return
  }

  await activeChannel.send({
    type: 'broadcast',
    event: 'signaling',
    payload: {
      type: 'ice-candidate',
      from: fromUserId,
      to: targetUserId,
      payload: candidate,
    } satisfies SignalingMessage,
  })
}
