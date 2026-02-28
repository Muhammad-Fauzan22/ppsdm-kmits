/**
 * Transcription Service - Whisper API integration
 */

export interface TranscriptionResult {
  text: string
  language?: string
  duration?: number
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
  const formData = new FormData()
  formData.append('file', audioBlob, 'recording.webm')
  formData.append('model', 'whisper-1')
  formData.append('language', 'id') // Indonesian language hint

  const response = await fetch('/api/voice/transcribe', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json() as { error: string }
    throw new Error(error.error ?? 'Transcription failed')
  }

  const result = await response.json() as TranscriptionResult
  return result
}

/**
 * Upload audio to Supabase Storage
 */
export async function uploadAudio(
  audioBlob: Blob,
  userId: string
): Promise<string | null> {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('userId', userId)

  const response = await fetch('/api/voice/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    console.error('Failed to upload audio')
    return null
  }

  const result = await response.json() as { url: string }
  return result.url
}
