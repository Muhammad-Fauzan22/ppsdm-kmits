'use client'

import { useEffect, useRef } from 'react'
import { MicOff, VideoOff } from 'lucide-react'

interface ParticipantVideoProps {
  stream: MediaStream | null
  name: string
  isMuted: boolean
  isVideoOff: boolean
  isLocal?: boolean
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ParticipantVideo({
  stream,
  name,
  isMuted,
  isVideoOff,
  isLocal = false,
}: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
      {/* Video element */}
      {!isVideoOff && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Avatar when video is off */
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{getInitials(name)}</span>
          </div>
          {isVideoOff && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <VideoOff className="w-3.5 h-3.5" />
              <span>Camera off</span>
            </div>
          )}
        </div>
      )}

      {/* Name badge */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
          {name}{isLocal ? ' (You)' : ''}
        </span>
      </div>

      {/* Mute indicator */}
      {isMuted && (
        <div className="absolute top-2 right-2">
          <div className="bg-red-500 rounded-full p-1">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        </div>
      )}

      {/* Local indicator */}
      {isLocal && (
        <div className="absolute top-2 left-2">
          <span className="bg-blue-600/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
            You
          </span>
        </div>
      )}
    </div>
  )
}
