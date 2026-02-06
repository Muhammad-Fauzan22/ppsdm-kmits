"use client";

// Prevent static generation - this page requires runtime data
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import ResearchSlideshow from '@/components/education/ResearchSlideshow';
import FinancialAssessment from '@/components/assessment/FinancialAssessment';
import { FINANCIAL_RESEARCH_SLIDES } from '@/data/research_financial';
import { Wallet, Sparkles } from 'lucide-react';

export default function FinancialAssessmentPage() {
    const [showAssessment, setShowAssessment] = useState(false);

    return (
        <div className="min-h-screen bg-blue-50/50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 transition-shadow hover:shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Financial Intelligence</h1>
                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Core Module 3.0</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-gray-400 hidden sm:block">
                                PPSDM KMITS Assessment
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {!showAssessment ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center max-w-2xl mx-auto mb-12">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Financial Future</span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed font-light">
                                Tingkatkan literasi, kelola aset, dan pelajari ekonomi teknik untuk masa depan profesional yang mapan.
                            </p>
                        </div>

                        <ResearchSlideshow
                            slides={FINANCIAL_RESEARCH_SLIDES}
                            onComplete={() => setShowAssessment(true)}
                        />
                    </div>
                ) : (
                    <div className="animate-in zoom-in-95 duration-500">
                        <FinancialAssessment />
                    </div>
                )}
            </main>
        </div>
    );
}
