"use client";

import React, { useState } from 'react';
import ResearchSlideshow from '@/components/education/ResearchSlideshow';
import { AssessmentRunner } from '@/features/assessment-engine';
import { getDimensionById } from '@/features/assessment-engine/config/dimensions';
import { PHYSICAL_RESEARCH_SLIDES } from '@/data/research_physical';
import { Activity } from 'lucide-react';

export default function PhysicalAssessmentPage() {
    const [showAssessment, setShowAssessment] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-xl">
                                <Activity className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Physical Health & Fitness</h1>
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
                                Build Your <span className="text-orange-600">Physical Foundation</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Kesehatan fisik adalah fondasi produktivitas dan kualitas hidup.
                                Mari evaluasi kondisi fisik Anda dengan pendekatan ilmiah.
                            </p>
                        </div>

                        <ResearchSlideshow
                            slides={PHYSICAL_RESEARCH_SLIDES}
                            onComplete={() => setShowAssessment(true)}
                        />
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 duration-500">
                        <AssessmentRunner config={getDimensionById('physical')!} />
                    </div>
                )}
            </main>
        </div>
    );
}
