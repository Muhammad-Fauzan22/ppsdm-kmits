"use client";

import React, { useState, useEffect } from 'react';
import { useMentalStore } from '@/lib/stores/useMentalStore';
import { Wind, Headphones, Smartphone, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

const MEDITATIONS = [
    { title: '5-Minute Morning Calm', duration: 300 },
    { title: 'Stress Relief Scan', duration: 600 },
    { title: 'Pre-Exam Focus', duration: 180 },
];

export default function MindfulnessSuite() {
    const { logMeditation } = useMentalStore();
    const [activeTab, setActiveTab] = useState<'breathe' | 'listen'>('breathe');

    // Breathing State
    const [breathingState, setBreathingState] = useState('Idle');
    const [isBreathing, setIsBreathing] = useState(false);

    // Audio State
    const [currentTrack, setCurrentTrack] = useState<typeof MEDITATIONS[0] | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Breathing Logic (Box Breathing: 4-4-4-4)
    useEffect(() => {
        if (!isBreathing) {
            setBreathingState('Idle');
            return;
        }

        const cycle = async () => {
            while (isBreathing) {
                setBreathingState('Inhale');
                await new Promise(r => setTimeout(r, 4000));
                if (!isBreathing) break;
                setBreathingState('Hold');
                await new Promise(r => setTimeout(r, 4000));
                if (!isBreathing) break;
                setBreathingState('Exhale');
                await new Promise(r => setTimeout(r, 4000));
                if (!isBreathing) break;
                setBreathingState('Hold');
                await new Promise(r => setTimeout(r, 4000));
            }
        };

        cycle();
    }, [isBreathing]);

    const handleStopBreathing = () => {
        setIsBreathing(false);
        setBreathingState('Idle');
        logMeditation({
            type: 'breathing',
            duration: 60, // Dummy duration
            sessionTitle: 'Box Breathing',
            date: new Date().toISOString()
        });
    };

    const toggleAudio = (track: typeof MEDITATIONS[0]) => {
        if (currentTrack?.title === track.title && isPlaying) {
            setIsPlaying(false);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Wind className="w-6 h-6 text-sky-500" />
                    Mindfulness Suite
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('breathe')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'breathe' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Breathe</button>
                    <button onClick={() => setActiveTab('listen')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'listen' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Listen</button>
                </div>
            </div>

            {activeTab === 'breathe' ? (
                <div className="flex-1 flex flex-col items-center justify-center relative">
                    <motion.div
                        animate={{
                            scale: breathingState === 'Inhale' ? 1.5 : breathingState === 'Exhale' ? 1 : 1.2,
                            rotate: isBreathing ? 360 : 0
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className={`w-48 h-48 rounded-full flex items-center justify-center mb-8 shadow-2xl transition-colors duration-1000
                            ${breathingState === 'Inhale' ? 'bg-sky-200' : breathingState === 'Hold' ? 'bg-sky-100' : breathingState === 'Exhale' ? 'bg-indigo-100' : 'bg-gray-100'}
                        `}
                    >
                        <span className="text-2xl font-black text-sky-900/50">{breathingState}</span>
                    </motion.div>

                    <button
                        onClick={() => isBreathing ? handleStopBreathing() : setIsBreathing(true)}
                        className={`px-8 py-3 rounded-full font-bold shadow-lg transition
                            ${isBreathing ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-sky-500 text-white hover:bg-sky-600'}
                        `}
                    >
                        {isBreathing ? 'Stop Session' : 'Start Box Breathing'}
                    </button>
                    <p className="mt-6 text-xs text-gray-400 max-w-xs text-center">Box Breathing: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s. Used by Navy SEALs to reduce stress.</p>
                </div>
            ) : (
                <div className="flex-1 space-y-4">
                    {MEDITATIONS.map((track, i) => (
                        <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition group hover:border-sky-300 cursor-pointer ${currentTrack?.title === track.title && isPlaying ? 'bg-sky-50 border-sky-200' : 'bg-white'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${currentTrack?.title === track.title && isPlaying ? 'bg-sky-200 text-sky-700' : 'bg-gray-100 text-gray-500'}`}>
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-800">{track.title}</div>
                                    <div className="text-xs text-gray-500">{Math.floor(track.duration / 60)} min</div>
                                </div>
                            </div>
                            <button onClick={() => toggleAudio(track)} className="p-2 rounded-full hover:bg-black/5">
                                {currentTrack?.title === track.title && isPlaying ? <Pause className="w-5 h-5 text-sky-600" /> : <Play className="w-5 h-5 text-gray-400 group-hover:text-sky-600" />}
                            </button>
                        </div>
                    ))}

                    {currentTrack && isPlaying && (
                        <div className="mt-4 p-4 bg-sky-900 rounded-xl text-white flex items-center justify-between animate-pulse">
                            <div className="text-sm font-medium">Now Playing: {currentTrack.title}</div>
                            <div className="flex gap-1">
                                <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1 h-5 bg-white/50 rounded-full animate-bounce delay-150"></div>
                                <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
