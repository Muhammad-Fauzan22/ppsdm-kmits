"use client";

import React, { useState } from 'react';
import { useMentalStore } from '@/lib/stores/useMentalStore';
import { Heart, Activity, Battery, Phone, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOOODS = [
    { label: 'Great', emoji: '🤩', color: 'bg-green-100 text-green-600' },
    { label: 'Good', emoji: '🙂', color: 'bg-blue-100 text-blue-600' },
    { label: 'Okay', emoji: '😐', color: 'bg-gray-100 text-gray-600' },
    { label: 'Low', emoji: '😔', color: 'bg-orange-100 text-orange-600' },
    { label: 'Bad', emoji: '😫', color: 'bg-red-100 text-red-600' },
];

const CRISIS_RESOURCES = [
    { name: 'Layanan Sejiwa (HIMPSI)', number: '119 ext 8' },
    { name: 'Into The Light Indonesia', number: 'pendampingan.intothelightid.org' },
    { name: 'ITS Counseling Center', number: '0811-333-xxxx' },
];

export default function WellnessCompanion() {
    const { checkins, logCheckIn } = useMentalStore();
    const [step, setStep] = useState(0); // 0: Idle, 1: Mood, 2: Anxiety, 3: Energy, 4: Note
    const [entry, setEntry] = useState<any>({});
    const [showCrisis, setShowCrisis] = useState(false);

    const handleNext = (key: string, value: any) => {
        setEntry({ ...entry, [key]: value });
        setStep(step + 1);
    };

    const handleSubmit = () => {
        logCheckIn({
            mood: entry.mood,
            anxietyLevel: entry.anxiety,
            energyLevel: entry.energy,
            note: entry.note || '',
            date: new Date().toISOString()
        });
        setStep(0);
        setEntry({});
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px] relative overflow-hidden">

            {/* Crisis Overlay */}
            <AnimatePresence>
                {showCrisis && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-50 z-50 p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-red-600 flex items-center gap-2">
                                <Phone className="w-6 h-6" /> Crisis Support
                            </h2>
                            <button onClick={() => setShowCrisis(false)} className="p-2 bg-white rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <p className="text-gray-700 mb-6 font-medium">You are not alone. Reach out for help immediately.</p>
                        <div className="space-y-4">
                            {CRISIS_RESOURCES.map((res, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex justify-between items-center">
                                    <span className="font-bold text-gray-800">{res.name}</span>
                                    <span className="text-red-500 font-mono font-bold">{res.number}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Heart className="w-6 h-6 text-rose-500" />
                    Wellness Companion
                </h2>
                <button onClick={() => setShowCrisis(true)} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100 hover:bg-red-100 transition animate-pulse">
                    Crisis Help
                </button>
            </div>

            {step === 0 ? (
                <div className="flex flex-col h-full">
                    {/* Hero CTA */}
                    <div className="bg-rose-50 rounded-2xl p-8 text-center mb-6 border border-rose-100">
                        <h3 className="text-xl font-bold text-rose-900 mb-2">How are you feeling right now?</h3>
                        <p className="text-rose-700/70 mb-6 text-sm">Take a moment to check in with yourself.</p>
                        <button
                            onClick={() => setStep(1)}
                            className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition"
                        >
                            Start Daily Check-in
                        </button>
                    </div>

                    {/* Check-in History */}
                    <div className="flex-1 overflow-y-auto">
                        <h4 className="text-sm font-bold text-gray-400 mb-3">Recent Check-ins</h4>
                        <div className="space-y-3">
                            {checkins.length === 0 && <div className="text-center text-gray-300 italic pt-4">No check-ins yet.</div>}
                            {checkins.slice(0, 5).map(log => (
                                <div key={log.id} className="flex items-center gap-4 p-3 border rounded-xl hover:bg-gray-50 transition">
                                    <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full border">
                                        {MOOODS.find(m => m.label === log.mood)?.emoji || '😐'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-gray-700 text-sm">{log.mood}</span>
                                            <span className="text-xs text-gray-400">{new Date(log.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Activity className="w-3 h-3 text-purple-400" /> Anx: {log.anxietyLevel}/10</span>
                                            <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-green-400" /> Enr: {log.energyLevel}/10</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-center">
                    {/* Step 1: Mood */}
                    {step === 1 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <h3 className="text-center font-bold text-lg mb-6">Choose your mood</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {MOOODS.map(m => (
                                    <button key={m.label} onClick={() => handleNext('mood', m.label)} className={`flex flex-col items-center p-3 rounded-xl border hover:scale-105 transition gap-2 ${entry.mood === m.label ? 'ring-2 ring-rose-300 bg-rose-50' : ''}`}>
                                        <span className="text-3xl">{m.emoji}</span>
                                        <span className="text-xs font-medium text-gray-600">{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Anxiety */}
                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-8">
                            <h3 className="text-center font-bold text-lg mb-6">Anxiety Level (1-10)</h3>
                            <input
                                type="range" min="1" max="10"
                                className="w-full accent-purple-500 mb-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                onChange={(e) => setEntry({ ...entry, anxiety: parseInt(e.target.value) })}
                            />
                            <div className="text-center font-black text-4xl text-purple-600 mb-6">{entry.anxiety || 5}</div>
                            <div className="flex justify-center">
                                <button onClick={() => handleNext('anxiety', entry.anxiety || 5)} className="px-6 py-2 bg-purple-600 text-white rounded-full font-bold">Next</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Energy */}
                    {step === 3 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="px-8">
                            <h3 className="text-center font-bold text-lg mb-6">Energy Level (1-10)</h3>
                            <input
                                type="range" min="1" max="10"
                                className="w-full accent-green-500 mb-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                onChange={(e) => setEntry({ ...entry, energy: parseInt(e.target.value) })}
                            />
                            <div className="text-center font-black text-4xl text-green-600 mb-6">{entry.energy || 5}</div>
                            <div className="flex justify-center">
                                <button onClick={() => handleNext('energy', entry.energy || 5)} className="px-6 py-2 bg-green-600 text-white rounded-full font-bold">Next</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Note */}
                    {step === 4 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <h3 className="text-center font-bold text-lg mb-4">Add a quick note?</h3>
                            <textarea
                                className="w-full p-4 border rounded-xl bg-gray-50 mb-4 h-32 resize-none outline-none focus:ring-2 focus:ring-rose-200"
                                placeholder="What's on your mind? (Optional)"
                                onChange={(e) => setEntry({ ...entry, note: e.target.value })}
                            />
                            <button onClick={handleSubmit} className="w-full py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition">
                                Complete Check-in
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
}
