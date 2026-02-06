"use client";

import React, { useState } from 'react';
import { useCharacterStore } from '@/lib/stores/useCharacterStore';
import { Shield, BookOpen, Edit3, Save } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function CharacterTracker() {
    const { strengths, integrityLogs, logIntegrity, setStrengthScore } = useCharacterStore();
    const [activeTab, setActiveTab] = useState<'strengths' | 'journal'>('strengths');

    // Journal State
    const [journalEntry, setJournalEntry] = useState({ scenario: '', decision: '', reflection: '' });

    const handleSaveJournal = () => {
        if (!journalEntry.scenario) return;
        logIntegrity({
            scenario: journalEntry.scenario,
            decision: journalEntry.decision,
            reflection: journalEntry.reflection,
            date: new Date().toISOString()
        });
        setJournalEntry({ scenario: '', decision: '', reflection: '' });
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-6 h-6 text-amber-600" />
                    Character Development
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setActiveTab('strengths')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'strengths' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Strengths</button>
                    <button onClick={() => setActiveTab('journal')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeTab === 'journal' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Integrity Journal</button>
                </div>
            </div>

            {activeTab === 'strengths' ? (
                <div className="flex flex-col md:flex-row h-full gap-6">
                    {/* Chart */}
                    <div className="flex-1 relative" style={{ width: '100%', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={strengths}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                <Radar name="My Strengths" dataKey="score" stroke="#d97706" fill="#d97706" fillOpacity={0.5} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Editor */}
                    <div className="w-full md:w-1/3 space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        <h3 className="font-bold text-gray-800 text-sm">Self-Assessment</h3>
                        {strengths.map(s => (
                            <div key={s.id} className="bg-gray-50 p-3 rounded-lg border">
                                <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                                    <span>{s.name}</span>
                                    <span>{s.score}/100</span>
                                </div>
                                <input
                                    type="range" min="0" max="100"
                                    value={s.score}
                                    onChange={(e) => setStrengthScore(s.id, parseInt(e.target.value))}
                                    className="w-full accent-amber-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{s.category}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full gap-4">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-sm text-amber-900">
                        <b>Integrity Check:</b> Document a tough choice you made recently. Did you align with your values?
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">The Dilemma (What happened?)</label>
                            <textarea
                                className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-amber-200 outline-none resize-none"
                                rows={2}
                                value={journalEntry.scenario}
                                onChange={(e) => setJournalEntry({ ...journalEntry, scenario: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Your Decision (What did you do?)</label>
                            <textarea
                                className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-amber-200 outline-none resize-none"
                                rows={2}
                                value={journalEntry.decision}
                                onChange={(e) => setJournalEntry({ ...journalEntry, decision: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Reflection (How do you feel about it now?)</label>
                            <textarea
                                className="w-full p-3 rounded-lg border bg-gray-50 text-sm focus:ring-2 focus:ring-amber-200 outline-none resize-none"
                                rows={2}
                                value={journalEntry.reflection}
                                onChange={(e) => setJournalEntry({ ...journalEntry, reflection: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={handleSaveJournal}
                            className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Log Integrity Check
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4">
                        <h3 className="font-bold text-gray-400 text-xs uppercase mb-2">Past Logs</h3>
                        <div className="space-y-3">
                            {integrityLogs.length === 0 && <div className="text-gray-400 text-sm italic">No entries yet.</div>}
                            {integrityLogs.map(log => (
                                <div key={log.id} className="p-3 border rounded-lg text-sm bg-gray-50">
                                    <div className="font-bold text-gray-800 mb-1">{log.scenario}</div>
                                    <div className="text-gray-600">Decision: {log.decision}</div>
                                    <div className="text-xs text-gray-400 mt-2">{new Date(log.date).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
