"use client";

import React, { useState } from 'react';
import ResearchSlideshow from '@/components/education/ResearchSlideshow';
import { AssessmentRunner } from '@/features/assessment-engine';
import { getDimensionById } from '@/features/assessment-engine/config/dimensions';

import { CHARACTER_RESEARCH_SLIDES } from '@/data/research_character';
import { ShieldCheck } from 'lucide-react';

export default function CharacterAssessmentPage() {
    const [showAssessment, setShowAssessment] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-xl">
                                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Character & Ethics</h1>
                                <p className="text-xs text-gray-500 font-medium">Scientific Assessment Module 7.0</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-gray-400 hidden sm:block">
                                PPSDM KMITS Integration
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!showAssessment ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                Building Your <span className="text-indigo-600">Moral Compass</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Karakter adalah fondasi kepemimpinan. Pahami kekuatan integritas dan etika Anda
                                melalui penilaian ilmiah yang mendalam.
                            </p>
                        </div>

                        <ResearchSlideshow
                            slides={CHARACTER_RESEARCH_SLIDES}
                            onComplete={() => setShowAssessment(true)}
                        />
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 duration-500">
                        <AssessmentRunner config={getDimensionById('character')!} />


                    </div>
                )}
            </main>
        </div>
    );
}
