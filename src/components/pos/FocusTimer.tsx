"use client";

import React, { useEffect } from 'react';
import { usePOSStore } from '@/lib/stores/usePOSStore';
import { Play, Pause, RotateCcw, Coffee, Brain, BatteryCharging } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FocusTimer() {
    const { focusSession, startTimer, pauseTimer, resetTimer, tickTimer } = usePOSStore();
    const { timeLeft, isActive, mode, totalFocusTime } = focusSession;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                tickTimer();
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            pauseTimer();
            // Optional: Play sound here
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, tickTimer, pauseTimer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getModeColor = () => {
        switch (mode) {
            case 'focus': return 'text-red-600 bg-red-50 border-red-200';
            case 'short_break': return 'text-green-600 bg-green-50 border-green-200';
            case 'long_break': return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const getProgress = () => {
        const total = mode === 'focus' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60;
        return 100 - (timeLeft / total) * 100;
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col items-center justify-center">
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => resetTimer('focus')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition ${mode === 'focus' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Brain className="w-4 h-4" /> Focus
                </button>
                <button
                    onClick={() => resetTimer('short_break')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition ${mode === 'short_break' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Coffee className="w-4 h-4" /> Short Break
                </button>
                <button
                    onClick={() => resetTimer('long_break')}
                    className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition ${mode === 'long_break' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <BatteryCharging className="w-4 h-4" /> Long Break
                </button>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                <svg className="w-full h-full -rotate-90">
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-100"
                    />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 120}
                        strokeDashoffset={2 * Math.PI * 120 * (1 - getProgress() / 100)}
                        className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'text-red-500' : mode === 'short_break' ? 'text-green-500' : 'text-blue-500'}`}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-6xl font-bold tabular-nums tracking-tighter text-gray-800">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-sm text-gray-400 mt-2 uppercase tracking-widest font-medium">
                        {isActive ? 'Running' : 'Paused'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isActive ? (
                    <button
                        onClick={pauseTimer}
                        className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center hover:bg-amber-200 transition shadow-sm"
                    >
                        <Pause className="w-8 h-8 fill-current" />
                    </button>
                ) : (
                    <button
                        onClick={startTimer}
                        className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                        <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                )}
                <button
                    onClick={() => resetTimer(mode)}
                    className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-8 pt-6 border-t w-full flex justify-between items-center text-sm text-gray-500">
                <span>Daily Focus</span>
                <span className="font-mono font-bold text-gray-900">{Math.floor(totalFocusTime / 60)}m</span>
            </div>
        </div>
    );
}
