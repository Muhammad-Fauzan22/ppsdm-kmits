"use client";

import React, { useState } from 'react';
import { useCharacterStore } from '@/lib/stores/useCharacterStore';
import { Scale, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function EthicsLab() {
    const { ethicsCases, solveCase } = useCharacterStore();
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [answer, setAnswer] = useState('');

    const activeCase = ethicsCases.find(c => c.id === selectedCaseId);

    const handleSubmit = () => {
        if (!selectedCaseId || !answer) return;
        solveCase(selectedCaseId, answer);
        setAnswer('');
        setSelectedCaseId(null);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Scale className="w-6 h-6 text-slate-700" />
                Professional Ethics Lab
            </h2>

            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* Case List */}
                <div className="w-full md:w-1/3 space-y-3">
                    {ethicsCases.map(ec => (
                        <button
                            key={ec.id}
                            onClick={() => setSelectedCaseId(ec.id)}
                            className={`w-full text-left p-4 rounded-xl border transition group
                                ${selectedCaseId === ec.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white hover:bg-slate-50 border-slate-200'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm">{ec.title}</span>
                                {ec.status === 'solved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                            <div className={`text-xs line-clamp-2 ${selectedCaseId === ec.id ? 'text-slate-300' : 'text-gray-500'}`}>
                                {ec.description}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Workspace */}
                <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-200 flex flex-col relative">
                    {activeCase ? (
                        <>
                            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold border-b border-slate-200 pb-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Ethical Dilemma
                            </div>
                            <p className="text-slate-700 mb-6 leading-relaxed">
                                {activeCase.description}
                            </p>

                            {activeCase.status === 'solved' ? (
                                <div className="bg-green-100 text-green-800 p-4 rounded-lg text-sm">
                                    <div className="font-bold mb-1">Your Solution:</div>
                                    &quot;{activeCase.userAnswer}&quot;
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col">
                                    <label className="text-xs font-bold text-slate-500 mb-2">My Analysis & Decision</label>
                                    <textarea
                                        className="flex-1 p-4 rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 outline-none resize-none mb-4 font-mono text-sm"
                                        placeholder="Applying the Code of Ethics, I would..."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        className="w-full py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2"
                                    >
                                        Submit Analysis <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <Scale className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a case to begin analysis</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
