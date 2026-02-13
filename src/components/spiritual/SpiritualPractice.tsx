"use client";

import React, { useState, useEffect } from 'react';
import { useSpiritualStore } from '@/lib/stores/useSpiritualStore';
import { BookOpen, Play, Square, Loader } from 'lucide-react';

import { motion } from 'framer-motion';

const REFLECTION_PROMPTS = [
    "What gave me a sense of meaning today?",
    "How did I help someone else today?",
    "What am I most grateful for right now?",
    "Where did I see beauty today?",
    "What lesson did I learn the hard way?"
];

export default function SpiritualPractice() {
    const { reflections, logReflection } = useSpiritualStore();
    const [activeTab, setActiveTab] = useState<'reflect' | 'contemplate'>('reflect');

    // Reflection
    const [prompt, setPrompt] = useState(REFLECTION_PROMPTS[0]);
    const [content, setContent] = useState('');

    // Timer
    const [duration, setDuration] = useState(5); // Minutes
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            // Play gentle chime?
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const handleLog = () => {
        if (!content) return;
        logReflection(prompt, content);
        setContent('');
        setPrompt(REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]);
    };

    const startTimer = () => {
        setTimeLeft(duration * 60);
        setIsRunning(true);
    };

    const formatTime = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-violet-500" />
                    Spiritual Practice
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('reflect')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'reflect' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Reflect</button>
                    <button onClick={() => setActiveTab('contemplate')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'contemplate' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Contemplate</button>
                </div>
            </div>

            {activeTab === 'reflect' ? (
                <div className="flex-1 flex flex-col gap-4">
                    <div className="bg-violet-50 p-4 rounded-xl border border-violet-100">
                        <div className="text-xs font-bold text-violet-400 uppercase mb-2">Daily Prompt</div>
                        <h3 className="text-lg font-serif text-violet-900 italic">"{prompt}"</h3>
                        <button
                            onClick={() => setPrompt(REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)])}
                            className="text-xs text-violet-500 underline mt-2"
                        >
                            Shuffle Prompt
                        </button>
                    </div>

                    <textarea
                        className="flex-1 p-4 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-violet-200 outline-none resize-none font-serif text-gray-700"
                        placeholder="Write your thoughts here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <button
                        onClick={handleLog}
                        className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition"
                    >
                        Save Reflection
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Background Animation */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="w-96 h-96 rounded-full border-[20px] border-violet-500 border-dashed"
                        />
                    </div>

                    <div className="z-10 text-center">
                        <div className="text-6xl font-thin font-mono text-gray-800 mb-8 tabular-nums">
                            {isRunning ? formatTime(timeLeft) : `${duration}:00`}
                        </div>

                        {!isRunning ? (
                            <div className="space-y-6">
                                <div className="flex justify-center gap-4">
                                    {[5, 10, 20].map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setDuration(m)}
                                            className={`w-12 h-12 rounded-full border font-bold transition flex items-center justify-center
                                                ${duration === m ? 'bg-violet-100 border-violet-500 text-violet-700' : 'hover:bg-gray-50 text-gray-500'}
                                            `}
                                        >
                                            {m}m
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={startTimer}
                                    className="px-10 py-4 bg-violet-600 text-white rounded-full font-bold shadow-xl hover:bg-violet-700 transition flex items-center gap-2 mx-auto"
                                >
                                    <Play className="w-5 h-5" /> Begin Silence
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsRunning(false)}
                                className="px-10 py-4 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition flex items-center gap-2 mx-auto"
                            >
                                <Square className="w-4 h-4" /> Stop
                            </button>
                        )}
                        <p className="mt-8 text-sm text-gray-400 italic">"Silence is a source of great strength." - Lao Tzu</p>
                    </div>
                </div>
            )}
        </div>
    );
}
