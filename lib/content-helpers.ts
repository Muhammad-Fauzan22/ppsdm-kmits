// Helper functions for Google Drive & YouTube URL conversion
// Used for Hybrid CDN content delivery

/**
 * Convert Google Drive share/preview link to direct stream URL
 * Allows HTML5 audio/video players to stream without opening Google Drive
 *
 * Input:  https://drive.google.com/file/d/1abc123/view?usp=sharing
 * Output: https://drive.google.com/uc?export=download&id=1abc123
 */
export function convertDriveToDirectLink(shareLink: string): string {
  if (!shareLink) return ""

  // Extract file ID from various Google Drive URL formats
  let fileId = ""

  if (shareLink.includes("/d/")) {
    // Format: https://drive.google.com/file/d/FILE_ID/view
    fileId = shareLink.split("/d/")[1]?.split("/")[0] || ""
  } else if (shareLink.includes("id=")) {
    // Format: https://drive.google.com/open?id=FILE_ID
    fileId = shareLink.split("id=")[1]?.split("&")[0] || ""
  }

  if (!fileId) return shareLink // Return original if parsing fails

  // Return direct stream URL
  return `https://drive.google.com/uc?export=download&id=${fileId}`
}

/**
 * Extract YouTube video ID from various URL formats
 *
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - VIDEO_ID (raw ID)
 */
export function extractYouTubeId(url: string): string {
  if (!url) return ""

  // If it's already just an ID (11 characters, alphanumeric + - _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  // Extract from youtube.com/watch?v=
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  if (match1?.[1]) return match1[1]

  // Extract from youtube.com/embed/
  const match2 = url.match(/youtube\.com\/embed\/([^&\n?#]+)/)
  if (match2?.[1]) return match2[1]

  return url // Return original if parsing fails
}

/**
 * Get Google Slides embed URL from a published slides link
 *
 * Input:  https://docs.google.com/presentation/d/1abc123/edit
 * Output: https://docs.google.com/presentation/d/1abc123/embed
 */
export function convertGoogleSlidesToEmbed(shareLink: string): string {
  if (!shareLink) return ""

  // Extract presentation ID
  let presentationId = ""
  if (shareLink.includes("/d/")) {
    presentationId = shareLink.split("/d/")[1]?.split("/")[0] || ""
  }

  if (!presentationId) return shareLink

  // Return embed URL
  return `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false`
}

/**
 * Check if a URL is a Google Drive link
 */
export function isGoogleDriveUrl(url: string): boolean {
  return url?.includes("drive.google.com") ?? false
}

/**
 * Check if a URL is a Google Slides link
 */
export function isGoogleSlidesUrl(url: string): boolean {
  return url?.includes("docs.google.com/presentation") ?? false
}

/**
 * Check if a URL is a YouTube link or ID
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    /^[a-zA-Z0-9_-]{11}$/.test(url) // Raw YouTube ID
  )
}

export default {
  convertDriveToDirectLink,
  extractYouTubeId,
  convertGoogleSlidesToEmbed,
  isGoogleDriveUrl,
  isGoogleSlidesUrl,
  isYouTubeUrl,
}
