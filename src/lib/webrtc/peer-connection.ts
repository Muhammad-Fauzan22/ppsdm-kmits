/**
 * WebRTC Peer Connection Manager
 */

const STUN_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

export class PeerConnectionManager {
  private peerConnection: RTCPeerConnection
  private localStream: MediaStream | null = null

  public onTrack: ((stream: MediaStream, peerId: string) => void) | null = null
  public onIceCandidate: ((candidate: RTCIceCandidate) => void) | null = null
  public onConnectionStateChange: ((state: RTCPeerConnectionState) => void) | null = null

  constructor() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: STUN_SERVERS,
    })

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.onIceCandidate) {
        this.onIceCandidate(event.candidate)
      }
    }

    this.peerConnection.ontrack = (event) => {
      if (this.onTrack && event.streams[0]) {
        this.onTrack(event.streams[0], '')
      }
    }

    this.peerConnection.onconnectionstatechange = () => {
      if (this.onConnectionStateChange) {
        this.onConnectionStateChange(this.peerConnection.connectionState)
      }
    }
  }

  /**
   * Create an SDP offer
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    await this.peerConnection.setLocalDescription(offer)
    return offer
  }

  /**
   * Create an SDP answer from a received offer
   */
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await this.peerConnection.createAnswer()
    await this.peerConnection.setLocalDescription(answer)
    return answer
  }

  /**
   * Set remote description from received answer
   */
  async setRemoteAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
  }

  /**
   * Add an ICE candidate from the remote peer
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
  }

  /**
   * Add local media stream tracks to the connection
   */
  addTrack(stream: MediaStream): void {
    this.localStream = stream
    stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, stream)
    })
  }

  /**
   * Replace video track (for screen sharing)
   */
  async replaceVideoTrack(newTrack: MediaStreamTrack): Promise<void> {
    const sender = this.peerConnection
      .getSenders()
      .find((s) => s.track?.kind === 'video')

    if (sender) {
      await sender.replaceTrack(newTrack)
    }
  }

  /**
   * Get connection state
   */
  getConnectionState(): RTCPeerConnectionState {
    return this.peerConnection.connectionState
  }

  /**
   * Close the peer connection
   */
  close(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
    this.peerConnection.close()
  }
}
