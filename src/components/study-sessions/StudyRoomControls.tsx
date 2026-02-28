'use client'

import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from 'lucide-react'

interface StudyRoomControlsProps {
  isMuted: boolean
  isVideoOff: boolean
  isScreenSharing: boolean
  onToggleMic: () => void
  onToggleVideo: () => void
  onShareScreen: () => void
  onLeave: () => void
}

export function StudyRoomControls({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleMic,
  onToggleVideo,
  onShareScreen,
  onLeave,
}: StudyRoomControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-gray-900 border-t border-gray-700">
      {/* Mic Toggle */}
      <button
        onClick={onToggleMic}
        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
          isMuted
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        aria-pressed={isMuted}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        <span className="text-xs">{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      {/* Camera Toggle */}
      <button
        onClick={onToggleVideo}
        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
          isVideoOff
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        aria-label={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        aria-pressed={isVideoOff}
      >
        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        <span className="text-xs">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
      </button>

      {/* Screen Share */}
      <button
        onClick={onShareScreen}
        className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
          isScreenSharing
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
        aria-pressed={isScreenSharing}
      >
        <Monitor className="w-5 h-5" />
        <span className="text-xs">{isScreenSharing ? 'Stop Share' : 'Share'}</span>
      </button>

      {/* Leave Room */}
      <button
        onClick={onLeave}
        className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all ml-4"
        aria-label="Leave room"
      >
        <PhoneOff className="w-5 h-5" />
        <span className="text-xs">Leave</span>
      </button>
    </div>
  )
}
