"use client";

import React, { useState } from 'react';
import { useMentalStore } from '@/lib/stores/useMentalStore';
import { PenTool, Sun, Book, Save } from 'lucide-react';

export default function TherapeuticToolkit() {
    const { addJournalEntry } = useMentalStore();
    const [activeTab, setActiveTab] = useState<'cbt' | 'gratitude'>('cbt');

    // CBT State
    const [cbtData, setCbtData] = useState({ situation: '', thought: '', emotion: '', balanced: '' });

    // Gratitude State
    const [gratitudeItems, setGratitudeItems] = useState(['', '', '']);

    const handleSaveCBT = () => {
        if (!cbtData.thought) return;
        addJournalEntry({
            date: new Date().toISOString(),
            type: 'cbt',
            title: 'Thought Record',
            content: JSON.stringify(cbtData)
        });
        setCbtData({ situation: '', thought: '', emotion: '', balanced: '' });
        alert("Thought record saved!");
    };

    const handleSaveGratitude = () => {
        const items = gratitudeItems.filter(i => i.trim());
        if (items.length === 0) return;
        addJournalEntry({
            date: new Date().toISOString(),
            type: 'gratitude',
            title: 'Daily Gratitude',
            content: items.join('\n')
        });
        setGratitudeItems(['', '', '']);
        alert("Gratitude saved! Great job.");
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <PenTool className="w-6 h-6 text-teal-500" />
                    Therapeutic Toolkit
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('cbt')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'cbt' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>CBT Tools</button>
                    <button onClick={() => setActiveTab('gratitude')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'gratitude' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Gratitude</button>
                </div>
            </div>

            {activeTab === 'cbt' ? (
                <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                    <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 text-sm text-teal-800 mb-2">
                        <b>Cognitive Reframing:</b> Challenge negative thoughts by examining the evidence and creating a balanced perspective.
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Situation (What happened?)</label>
                        <textarea
                            className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-teal-200 outline-none"
                            rows={2}
                            value={cbtData.situation}
                            onChange={(e) => setCbtData({ ...cbtData, situation: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Automatic Thought (What went through your mind?)</label>
                        <textarea
                            className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-teal-200 outline-none"
                            rows={2}
                            value={cbtData.thought}
                            onChange={(e) => setCbtData({ ...cbtData, thought: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Emotion (What did you feel?)</label>
                        <input
                            className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-teal-200 outline-none"
                            value={cbtData.emotion}
                            onChange={(e) => setCbtData({ ...cbtData, emotion: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">Balanced Thought (Is there another way to see this?)</label>
                        <textarea
                            className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-teal-200 outline-none"
                            rows={3}
                            placeholder="Try to be kinder to yourself..."
                            value={cbtData.balanced}
                            onChange={(e) => setCbtData({ ...cbtData, balanced: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={handleSaveCBT}
                        className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition flex items-center justify-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Save Record
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center">
                    <div className="text-center mb-6">
                        <Sun className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                        <h3 className="font-bold text-amber-900">What are you grateful for today?</h3>
                    </div>

                    <div className="w-full space-y-3 mb-8">
                        {gratitudeItems.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center">
                                <span className="font-bold text-amber-300 text-xl">{i + 1}.</span>
                                <input
                                    className="flex-1 p-3 border-b-2 border-amber-100 focus:border-amber-400 outline-none text-gray-700 placeholder-gray-300 transition"
                                    placeholder="I am grateful for..."
                                    value={item}
                                    onChange={(e) => {
                                        const newItems = [...gratitudeItems];
                                        newItems[i] = e.target.value;
                                        setGratitudeItems(newItems);
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSaveGratitude}
                        className="px-8 py-3 bg-amber-400 text-white rounded-full font-bold shadow-lg shadow-amber-100 hover:bg-amber-500 transition"
                    >
                        Save Gratitude
                    </button>
                </div>
            )}
        </div>
    );
}
