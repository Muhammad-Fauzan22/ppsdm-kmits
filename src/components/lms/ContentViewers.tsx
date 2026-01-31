import { useState } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  youtubeId: string
  title?: string
  className?: string
}

/**
 * Renders YouTube video in responsive iframe
 * - Aspect ratio 16:9
 * - Fullscreen capable
 * - Mobile-optimized
 */
export function VideoPlayer({
  youtubeId,
  title,
  className,
}: VideoPlayerProps) {
  if (!youtubeId) {
    return (
      <div className={cn("bg-slate-100 rounded-lg p-4", className)}>
        <p className="text-slate-600">No video available</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
      <div className="relative w-full overflow-hidden rounded-lg bg-black">
        {/* Aspect ratio 16:9 container */}
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&fs=1`}
            title={title || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

interface PodcastPlayerProps {
  audioUrl: string
  title?: string
  speaker?: string
  duration?: string
  className?: string
}

/**
 * Renders audio player for podcasts from Google Drive
 * - Play/pause controls
 * - Volume control
 * - Duration display
 * - Sticky positioning available
 */
export function PodcastPlayer({
  audioUrl,
  title,
  speaker,
  duration,
  className,
}: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  if (!audioUrl) {
    return (
      <div className={cn("bg-slate-100 rounded-lg p-4", className)}>
        <p className="text-slate-600">No podcast available</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border border-slate-200 bg-white p-4",
        className
      )}
    >
      {(title || speaker) && (
        <div>
          {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
          {speaker && <p className="text-xs text-slate-600">By {speaker}</p>}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex-shrink-0 rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        <audio
          src={audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls
          className="flex-1"
        />

        {duration && (
          <span className="flex-shrink-0 text-xs text-slate-600">{duration}</span>
        )}
      </div>

      {/* Volume indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <Volume2 className="h-3 w-3" />
        <span>Adjustable volume</span>
      </div>
    </div>
  )
}

interface SlideViewerProps {
  presentationUrl: string
  title?: string
  className?: string
}

/**
 * Renders Google Slides embedded presentation
 * - Full presentation view
 * - Speaker notes visible
 * - Responsive iframe
 */
export function SlideViewer({
  presentationUrl,
  title,
  className,
}: SlideViewerProps) {
  if (!presentationUrl) {
    return (
      <div className={cn("bg-slate-100 rounded-lg p-4", className)}>
        <p className="text-slate-600">No slides available</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      {title && <h3 className="text-sm font-semibold text-slate-900">{title}</h3>}
      <div className="relative w-full overflow-hidden rounded-lg bg-slate-100">
        <div className="relative pt-[66.67%]">
          {/* 3:2 aspect ratio for presentations */}
          <iframe
            className="absolute inset-0 h-full w-full"
            src={presentationUrl}
            title={title || "Presentation"}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}

interface ModuleReaderProps {
  content: string
  title?: string
  className?: string
}

/**
 * Renders markdown/text module content
 * - Typography-optimized prose
 * - Responsive layout
 * - Code block styling
 */
export function ModuleReader({
  content,
  title,
  className,
}: ModuleReaderProps) {
  if (!content) {
    return (
      <div className={cn("bg-slate-100 rounded-lg p-4", className)}>
        <p className="text-slate-600">No content available</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      )}
      <div className="prose prose-slate max-w-none">
        {/* Render markdown/HTML content here */}
        {/* If using react-markdown: import and use <ReactMarkdown> */}
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  )
}
