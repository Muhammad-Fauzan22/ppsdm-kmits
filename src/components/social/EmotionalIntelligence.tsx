"use client";

import React, { useState } from 'react';
import { useSocialStore } from '@/lib/stores/useSocialStore';
import { Smile, Frown, Meh, Heart, Brain, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const EMOTIONS = [
    { label: 'Happy', icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { label: 'Sad', icon: Frown, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: 'Anxious', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' },
    { label: 'Confident', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100' },
    { label: 'Neutral', icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100' },
    { label: 'Grateful', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
];

const SCENARIOS = [
    { title: 'The Group Project Conflict', desc: 'A team member is not pulling their weight. How do you address it?' },
    { title: 'The Failed Exam', desc: 'Your friend just failed a crucial exam and is devastated. What do you say?' },
    { title: 'The Public Speaking Jitters', desc: 'You are about to present to 100 people and feel panic. How do you cope?' },
];

export default function EmotionalIntelligence() {
    const { moodLogs, logMood } = useSocialStore();
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [intensity, setIntensity] = useState(5);
    const [note, setNote] = useState('');

    const handleLog = () => {
        if (!selectedEmotion) return;
        logMood({
            emotion: selectedEmotion,
            intensity,
            note,
            context: 'General',
            date: new Date().toISOString()
        });
        setSelectedEmotion(null);
        setNote('');
        setIntensity(5);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Brain className="w-6 h-6 text-pink-500" />
                    Emotional Intelligence
                </h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                {/* Mood Logger */}
                <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-pink-50/50 rounded-xl p-6 border border-pink-100">
                        <h3 className="font-bold text-gray-800 mb-4">How are you feeling today?</h3>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {EMOTIONS.map(emo => (
                                <button
                                    key={emo.label}
                                    onClick={() => setSelectedEmotion(emo.label)}
                                    className={`p-3 rounded-xl flex flex-col items-center gap-2 transition border-2
                                        ${selectedEmotion === emo.label ? `border-pink-500 ${emo.bg}` : 'border-transparent bg-white hover:bg-gray-50'}
                                    `}
                                >
                                    <emo.icon className={`w-8 h-8 ${emo.color}`} />
                                    <span className="text-xs font-bold text-gray-600">{emo.label}</span>
                                </button>
                            ))}
                        </div>

                        {selectedEmotion && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Intensity</span>
                                        <span>{intensity}/10</span>
                                    </div>
                                    <input
                                        type="range" min="1" max="10"
                                        value={intensity}
                                        onChange={(e) => setIntensity(parseInt(e.target.value))}
                                        className="w-full accent-pink-500"
                                    />
                                </div>
                                <textarea
                                    className="w-full p-3 rounded-lg border text-sm resize-none focus:ring-2 focus:ring-pink-200 outline-none"
                                    placeholder="Why do you feel this way?"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                <button
                                    onClick={handleLog}
                                    className="w-full py-2 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition"
                                >
                                    Log Emotion
                                </button>
                            </motion.div>
                        )}
                    </div>

                    {/* Recent History */}
                    <div className="flex-1 overflow-y-auto max-h-60">
                        <h4 className="text-sm font-bold text-gray-400 mb-2">Recent Logs</h4>
                        <div className="space-y-2">
                            {moodLogs.slice(0, 5).map(log => {
                                const emo = EMOTIONS.find(e => e.label === log.emotion) || EMOTIONS[4];
                                return (
                                    <div key={log.id} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                                        <div className={`p-2 rounded-full ${emo.bg}`}>
                                            <emo.icon className={`w-4 h-4 ${emo.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-sm">{log.emotion}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-1">{log.note || 'No note'}</p>
                                        </div>
                                        <div className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                                            {log.intensity}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Scenarios & Patterns */}
                <div className="w-full md:w-1/2 space-y-6">
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-2">Pattern Insight</h3>
                        <p className="text-sm text-indigo-700 italic">
                            &quot;You tend to feel <b>Confident</b> when you log entries in the morning.&quot;
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-800">Empathy Gym</h3>
                        {SCENARIOS.map((scene, i) => (
                            <div key={i} className="border p-4 rounded-xl hover:shadow-md transition bg-white cursor-pointer group">
                                <h4 className="font-bold text-gray-700 mb-1 group-hover:text-pink-600 transition">{scene.title}</h4>
                                <p className="text-xs text-gray-500 mb-3">{scene.desc}</p>
                                <button className="text-xs font-bold text-pink-500 border border-pink-200 px-3 py-1 rounded-full group-hover:bg-pink-50">
                                    Start Roleplay
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
