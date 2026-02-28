/**
 * Voice Recorder - Web Speech API + MediaRecorder wrapper
 */

export interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  audioBlob: Blob | null
  audioUrl: string | null
}

export type RecorderEventType = 'start' | 'stop' | 'pause' | 'resume' | 'data' | 'error'

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  private stream: MediaStream | null = null
  private startTime: number = 0
  private durationInterval: ReturnType<typeof setInterval> | null = null
  private analyser: AnalyserNode | null = null
  private audioContext: AudioContext | null = null
  private source: MediaStreamAudioSourceNode | null = null

  public duration: number = 0
  public isRecording: boolean = false
  public isPaused: boolean = false

  private onDurationUpdate?: (duration: number) => void
  private onWaveformData?: (data: Uint8Array) => void
  private onStop?: (blob: Blob, url: string) => void
  private onError?: (error: Error) => void

  constructor(callbacks: {
    onDurationUpdate?: (duration: number) => void
    onWaveformData?: (data: Uint8Array) => void
    onStop?: (blob: Blob, url: string) => void
    onError?: (error: Error) => void
  }) {
    this.onDurationUpdate = callbacks.onDurationUpdate
    this.onWaveformData = callbacks.onWaveformData
    this.onStop = callbacks.onStop
    this.onError = callbacks.onError
  }

  /**
   * Start recording
   */
  async start(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio analyser for waveform
      this.audioContext = new AudioContext()
      this.analyser = this.audioContext.createAnalyser()
      this.analyser.fftSize = 256
      this.source = this.audioContext.createMediaStreamSource(this.stream)
      this.source.connect(this.analyser)

      // Set up MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType })
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: mimeType })
        const url = URL.createObjectURL(blob)
        this.onStop?.(blob, url)
      }

      this.mediaRecorder.start(100) // Collect data every 100ms
      this.isRecording = true
      this.isPaused = false
      this.startTime = Date.now()
      this.duration = 0

      // Update duration
      this.durationInterval = setInterval(() => {
        this.duration = Math.floor((Date.now() - this.startTime) / 1000)
        this.onDurationUpdate?.(this.duration)
      }, 1000)

      // Waveform animation
      this.animateWaveform()
    } catch (error) {
      this.onError?.(error instanceof Error ? error : new Error('Failed to start recording'))
    }
  }

  /**
   * Stop recording
   */
  stop(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop()
      this.isRecording = false
      this.isPaused = false
    }

    this.cleanup()
  }

  /**
   * Pause recording
   */
  pause(): void {
    if (this.mediaRecorder && this.isRecording && !this.isPaused) {
      this.mediaRecorder.pause()
      this.isPaused = true
      if (this.durationInterval) {
        clearInterval(this.durationInterval)
      }
    }
  }

  /**
   * Resume recording
   */
  resume(): void {
    if (this.mediaRecorder && this.isPaused) {
      this.mediaRecorder.resume()
      this.isPaused = false
      this.startTime = Date.now() - this.duration * 1000

      this.durationInterval = setInterval(() => {
        this.duration = Math.floor((Date.now() - this.startTime) / 1000)
        this.onDurationUpdate?.(this.duration)
      }, 1000)
    }
  }

  /**
   * Animate waveform using AnalyserNode
   */
  private animateWaveform(): void {
    if (!this.analyser || !this.isRecording) return

    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const animate = () => {
      if (!this.isRecording || !this.analyser) return

      this.analyser.getByteFrequencyData(dataArray)
      this.onWaveformData?.(dataArray)

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval)
      this.durationInterval = null
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.source) {
      this.source.disconnect()
      this.source = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.analyser = null
  }

  /**
   * Check if recording is supported
   */
  static isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'MediaRecorder' in window &&
      'mediaDevices' in navigator
    )
  }
}
