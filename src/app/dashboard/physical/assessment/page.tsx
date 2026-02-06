"use client";

import React, { useState } from 'react';
import ResearchSlideshow from '@/components/education/ResearchSlideshow';
import PhysicalAssessment from '@/components/assessment/PhysicalAssessment';
import { PHYSICAL_RESEARCH_SLIDES } from '@/data/research_physical';
import { Activity } from 'lucide-react';

export default function PhysicalAssessmentPage() {
    const [showAssessment, setShowAssessment] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-rose-100 p-2 rounded-lg">
                                <Activity className="h-6 w-6 text-rose-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Physical Health & Vitality</h1>
                                <p className="text-xs text-gray-500">Scientific Assessment Module 4.0</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 hidden sm:block">
                                PPSDM KMITS Integration
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {!showAssessment ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center max-w-3xl mx-auto mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
                                The Science of Vitality
                            </h2>
                            <p className="text-lg text-gray-600">
                                Sebelum memulai assessment, pelajari landasan ilmiah tentang bagaimana kesehatan fisik, tidur, dan nutrisi mempengaruhi performa akademik Anda.
                            </p>
                        </div>

                        <ResearchSlideshow
                            slides={PHYSICAL_RESEARCH_SLIDES}
                            onComplete={() => setShowAssessment(true)}
                        />
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 duration-500">
                        <PhysicalAssessment />
                    </div>
                )}
            </main>
        </div>
    );
}
