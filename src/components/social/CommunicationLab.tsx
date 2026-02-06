"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSocialStore } from '@/lib/stores/useSocialStore';
import { Mic, Video, StopCircle, Play, MessageSquare, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunicationLab() {
    const { speakingLogs, logCommunicationSession } = useSocialStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Camera access denied or unavailable. Using simulation mode.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const toggleRecording = () => {
        if (!isRecording) {
            startCamera();
            setIsRecording(true);
            setTimer(0);
        } else {
            stopCamera();
            setIsRecording(false);
            // Simulate Analysis
            const score = Math.floor(Math.random() * (95 - 70) + 70);
            logCommunicationSession({
                type: 'speech',
                duration: timer,
                score,
                feedback: 'Good eye contact. Try to reduce filler words like &quot;um&quot;.',
                date: new Date().toISOString()
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Mic className="w-6 h-6 text-purple-500" />
                    Communication Mastery
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Simulator */}
                <div className="w-full md:w-2/3 bg-gray-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center min-h-[400px]">
                    {stream ? (
                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                            <Video className="w-16 h-16 mb-4 opacity-50" />
                            <p>Camera is off</p>
                        </div>
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                        <button
                            onClick={toggleRecording}
                            className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition shadow-lg
                                ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}
                            `}
                        >
                            {isRecording ? <><StopCircle className="w-5 h-5" /> Stop & Analyze</> : <><Play className="w-5 h-5" /> Start Practice</>}
                        </button>
                    </div>

                    {isRecording && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-mono animate-pulse">
                            REC {formatTime(timer)}
                        </div>
                    )}
                </div>

                {/* Sidebar: Feedback & History */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                        <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Recent Feedback
                        </h3>
                        {speakingLogs.length > 0 ? (
                            <div className="space-y-3">
                                <div className="text-3xl font-bold text-purple-700">{speakingLogs[0].score}/100</div>
                                <p className="text-sm text-gray-600 italic">&quot;{speakingLogs[0].feedback}&quot;</p>
                                <div className="text-xs text-gray-400 mt-2">
                                    Duration: {formatTime(speakingLogs[0].duration)} • {new Date(speakingLogs[0].date).toLocaleDateString()}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-400 italic">Complete a session to get AI feedback.</div>
                        )}
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-xl p-5 border border-gray-100 overflow-y-auto">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm">Session History</h3>
                        <div className="space-y-2">
                            {speakingLogs.slice(0, 10).map(log => (
                                <div key={log.id} className="p-3 bg-white rounded-lg border text-sm flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-blue-400" />
                                        <span>{log.type === 'speech' ? 'Speaking' : 'Listening'}</span>
                                    </div>
                                    <div className="font-bold text-green-600">{log.score}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
