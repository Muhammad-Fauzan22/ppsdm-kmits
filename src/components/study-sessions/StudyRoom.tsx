'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ParticipantVideo } from './ParticipantVideo'
import { StudyRoomControls } from './StudyRoomControls'
import { PeerConnectionManager } from '@/lib/webrtc/peer-connection'
import {
  joinSignalingChannel,
  leaveSignalingChannel,
  sendOffer,
  sendAnswer,
  sendIceCandidate,
  type SignalingMessage,
} from '@/lib/webrtc/signaling'
import { createClient } from '@/lib/supabase/client'

interface Participant {
  userId: string
  name: string
  stream: MediaStream | null
  isMuted: boolean
  isVideoOff: boolean
}

interface ChatMessage {
  id: string
  userId: string
  name: string
  text: string
  timestamp: Date
}

interface StudyRoomProps {
  sessionId: string
  sessionTitle: string
}

export function StudyRoom({ sessionId, sessionTitle }: StudyRoomProps) {
  const router = useRouter()
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [currentUserName, setCurrentUserName] = useState<string>('You')
  const [isConnecting, setIsConnecting] = useState(true)

  const peerConnections = useRef<Map<string, PeerConnectionManager>>(new Map())
  const screenStreamRef = useRef<MediaStream | null>(null)

  const handleSignalingMessage = useCallback(async (message: SignalingMessage) => {
    const { type, from, payload } = message

    if (type === 'join') {
      // New participant joined - create offer
      const pc = new PeerConnectionManager()
      peerConnections.current.set(from, pc)

      if (localStream) {
        pc.addTrack(localStream)
      }

      pc.onTrack = (stream) => {
        setParticipants((prev) => {
          const existing = prev.find((p) => p.userId === from)
          if (existing) {
            return prev.map((p) => p.userId === from ? { ...p, stream } : p)
          }
          return [...prev, { userId: from, name: `Participant`, stream, isMuted: false, isVideoOff: false }]
        })
      }

      pc.onIceCandidate = async (candidate) => {
        await sendIceCandidate(sessionId, currentUserId, from, candidate.toJSON())
      }

      const offer = await pc.createOffer()
      await sendOffer(sessionId, currentUserId, from, offer)

    } else if (type === 'offer') {
      const offer = payload as RTCSessionDescriptionInit
      const pc = new PeerConnectionManager()
      peerConnections.current.set(from, pc)

      if (localStream) {
        pc.addTrack(localStream)
      }

      pc.onTrack = (stream) => {
        setParticipants((prev) => {
          const existing = prev.find((p) => p.userId === from)
          if (existing) {
            return prev.map((p) => p.userId === from ? { ...p, stream } : p)
          }
          return [...prev, { userId: from, name: `Participant`, stream, isMuted: false, isVideoOff: false }]
        })
      }

      pc.onIceCandidate = async (candidate) => {
        await sendIceCandidate(sessionId, currentUserId, from, candidate.toJSON())
      }

      const answer = await pc.createAnswer(offer)
      await sendAnswer(sessionId, currentUserId, from, answer)

    } else if (type === 'answer') {
      const answer = payload as RTCSessionDescriptionInit
      const pc = peerConnections.current.get(from)
      if (pc) {
        await pc.setRemoteAnswer(answer)
      }

    } else if (type === 'ice-candidate') {
      const candidate = payload as RTCIceCandidateInit
      const pc = peerConnections.current.get(from)
      if (pc) {
        await pc.addIceCandidate(candidate)
      }

    } else if (type === 'leave') {
      const pc = peerConnections.current.get(from)
      if (pc) {
        pc.close()
        peerConnections.current.delete(from)
      }
      setParticipants((prev) => prev.filter((p) => p.userId !== from))
    }
  }, [sessionId, currentUserId, localStream])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)
      setCurrentUserName(user.email?.split('@')[0] ?? 'You')

      // Get local media
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setLocalStream(stream)
      } catch {
        console.warn('Could not get media devices')
      }

      // Join signaling channel
      joinSignalingChannel(sessionId, user.id, handleSignalingMessage)
      setIsConnecting(false)
    }

    void init()

    return () => {
      void leaveSignalingChannel(sessionId, currentUserId)
      peerConnections.current.forEach((pc) => pc.close())
      peerConnections.current.clear()
      localStream?.getTracks().forEach((t) => t.stop())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const handleToggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const handleToggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  const handleShareScreen = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop())
      screenStreamRef.current = null
      setIsScreenSharing(false)

      // Restore camera
      if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0]
        if (videoTrack) {
          peerConnections.current.forEach((pc) => {
            void pc.replaceVideoTrack(videoTrack)
          })
        }
      }
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        screenStreamRef.current = screenStream
        setIsScreenSharing(true)

        const screenTrack = screenStream.getVideoTracks()[0]
        peerConnections.current.forEach((pc) => {
          void pc.replaceVideoTrack(screenTrack)
        })

        screenTrack.onended = () => {
          setIsScreenSharing(false)
          screenStreamRef.current = null
        }
      } catch {
        console.warn('Screen sharing cancelled or not supported')
      }
    }
  }

  const handleLeave = async () => {
    await leaveSignalingChannel(sessionId, currentUserId)
    peerConnections.current.forEach((pc) => pc.close())
    localStream?.getTracks().forEach((t) => t.stop())
    router.push('/study-sessions')
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUserId,
      name: currentUserName,
      text: chatInput.trim(),
      timestamp: new Date(),
    }
    setChatMessages((prev) => [...prev, message])
    setChatInput('')
  }

  const allParticipants = [
    { userId: currentUserId, name: currentUserName, stream: localStream, isMuted, isVideoOff, isLocal: true },
    ...participants.map((p) => ({ ...p, isLocal: false })),
  ]

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div>
          <h1 className="text-white font-semibold text-sm">{sessionTitle}</h1>
          <p className="text-gray-400 text-xs">{allParticipants.length} participant{allParticipants.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowChat(!showChat)}
          className={`p-2 rounded-lg transition-colors ${showChat ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          aria-label="Toggle chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isConnecting ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p>Connecting...</p>
              </div>
            </div>
          ) : (
            <div className={`grid gap-3 h-full ${
              allParticipants.length === 1 ? 'grid-cols-1' :
              allParticipants.length === 2 ? 'grid-cols-2' :
              allParticipants.length <= 4 ? 'grid-cols-2' :
              'grid-cols-3'
            }`}>
              {allParticipants.map((p) => (
                <ParticipantVideo
                  key={p.userId}
                  stream={p.stream}
                  name={p.name}
                  isMuted={p.isMuted}
                  isVideoOff={p.isVideoOff}
                  isLocal={p.isLocal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-72 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <h2 className="text-white font-medium text-sm">Chat</h2>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 ? (
                <p className="text-gray-500 text-xs text-center mt-4">No messages yet</p>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className={`${msg.userId === currentUserId ? 'text-right' : ''}`}>
                    <p className="text-gray-400 text-xs mb-0.5">{msg.name}</p>
                    <span className={`inline-block px-3 py-1.5 rounded-xl text-sm ${
                      msg.userId === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}>
                      {msg.text}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-700 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendChat}
                disabled={!chatInput.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <StudyRoomControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleMic={handleToggleMic}
        onToggleVideo={handleToggleVideo}
        onShareScreen={handleShareScreen}
        onLeave={handleLeave}
      />
    </div>
  )
}
