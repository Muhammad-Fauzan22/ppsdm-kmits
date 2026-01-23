"use client";

import React, { useState } from 'react';
import CognitiveAssessment from '@/components/assessment/CognitiveAssessment';
import ResearchSlideshow from '@/components/education/ResearchSlideshow';
import { COGNITIVE_RESEARCH_SLIDES } from '@/data/research_dimensi_1';
import { Brain, FileText, Activity } from 'lucide-react';

export default function IntellectualAssessmentPage() {
    const [activeTab, setActiveTab] = useState<'assessment' | 'research'>('research');

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                            <Brain className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">Scientific Cognitive Assessment</h1>
                            <p className="text-slate-400">Dimensi 1: Perkembangan Kognitif & Intelektual</p>
                        </div>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-slate-900 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setActiveTab('research')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'research'
                                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Scientific Basis
                        </button>
                        <button
                            onClick={() => setActiveTab('assessment')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'assessment'
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Activity className="w-4 h-4" />
                            Start Assessment
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="animate-in fade-in duration-500">
                    {activeTab === 'research' ? (
                        <div className="space-y-6">
                            <ResearchSlideshow slides={COGNITIVE_RESEARCH_SLIDES} />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setActiveTab('assessment')}
                                    className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-cyan-50 transition-colors flex items-center gap-2"
                                >
                                    I've Reviewed the Research, Proceed to Assessment
                                </button>
                            </div>
                        </div>
                    ) : (
                        <CognitiveAssessment onComplete={() => { }} />
                    )}
                </div>
            </div>
        </div>
    );
}
