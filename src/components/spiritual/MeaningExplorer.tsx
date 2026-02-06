"use client";

import React, { useState } from 'react';
import { useSpiritualStore } from '@/lib/stores/useSpiritualStore';
import { Compass, Star, Crosshair, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const CORE_VALUES_LIST = [
    "Integrity", "Freedom", "Respect", "Service", "Excellence", "Compassion", "Growth", "Family",
    "Creativity", "Knowledge", "Peace", "Justice", "Adventure", "Balance", "Wisdom", "Loyalty"
];

export default function MeaningExplorer() {
    const { ikigai, coreValues, updateIkigai, setCoreValues } = useSpiritualStore();
    const [activeTab, setActiveTab] = useState<'ikigai' | 'values'>('ikigai');

    const handleValueToggle = (val: string) => {
        if (coreValues.includes(val)) {
            setCoreValues(coreValues.filter(v => v !== val));
        } else {
            if (coreValues.length >= 5) return; // Max 5
            setCoreValues([...coreValues, val]);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Compass className="w-6 h-6 text-indigo-500" />
                    Meaning & Purpose
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('ikigai')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'ikigai' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Ikigai</button>
                    <button onClick={() => setActiveTab('values')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'values' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Values</button>
                </div>
            </div>

            {activeTab === 'ikigai' ? (
                <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-800 italic text-center">
                        &quot;Your reason for being is found at the intersection of what you love, what you are good at, what the world needs, and what you can be paid for.&quot;
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Passion (Love)</label>
                            <textarea
                                className="w-full p-3 rounded-xl border bg-pink-50 focus:ring-2 focus:ring-pink-200 outline-none text-sm resize-none h-24"
                                placeholder="What do you love doing?"
                                value={ikigai.passion}
                                onChange={(e) => updateIkigai('passion', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Mission (World Needs)</label>
                            <textarea
                                className="w-full p-3 rounded-xl border bg-green-50 focus:ring-2 focus:ring-green-200 outline-none text-sm resize-none h-24"
                                placeholder="What does the world need?"
                                value={ikigai.mission}
                                onChange={(e) => updateIkigai('mission', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Vocation (Paid For)</label>
                            <textarea
                                className="w-full p-3 rounded-xl border bg-blue-50 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none h-24"
                                placeholder="What can you be paid for?"
                                value={ikigai.vocation}
                                onChange={(e) => updateIkigai('vocation', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Profession (Good At)</label>
                            <textarea
                                className="w-full p-3 rounded-xl border bg-yellow-50 focus:ring-2 focus:ring-yellow-200 outline-none text-sm resize-none h-24"
                                placeholder="What are you good at?"
                                value={ikigai.profession}
                                onChange={(e) => updateIkigai('profession', e.target.value)}
                            />
                        </div>
                    </div>

                    {Object.values(ikigai).every(v => v.length > 5) && (
                        <div className="mt-auto bg-gray-900 text-white p-4 rounded-xl text-center animate-pulse">
                            <div className="font-bold flex items-center justify-center gap-2 mb-1">
                                <Crosshair className="w-4 h-4 text-cyan-400" /> Purpose Found
                            </div>
                            <div className="text-xs opacity-80">You are aligning with your true self.</div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <div className="mb-4 text-center">
                        <h3 className="font-bold text-gray-800 mb-1">Define Your Core</h3>
                        <p className="text-sm text-gray-500">Select up to 5 values that drive your life ({coreValues.length}/5).</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 overflow-y-auto max-h-[400px] p-1">
                        {CORE_VALUES_LIST.map(val => {
                            const isSelected = coreValues.includes(val);
                            return (
                                <button
                                    key={val}
                                    onClick={() => handleValueToggle(val)}
                                    className={`p-3 rounded-xl border text-sm font-bold transition flex items-center justify-between
                                        ${isSelected ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-50'}
                                    `}
                                >
                                    {val}
                                    {isSelected && <Check className="w-4 h-4" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">My Compass</h4>
                        <div className="flex flex-wrap gap-2">
                            {coreValues.map(v => (
                                <span key={v} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                                    {v}
                                </span>
                            ))}
                            {coreValues.length === 0 && <span className="text-xs text-gray-400 italic">No values selected yet.</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
