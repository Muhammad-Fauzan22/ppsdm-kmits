"use client";

import React, { useState } from 'react';
import { useFinancialStore } from '@/lib/stores/useFinancialStore';
import { BookOpen, CheckCircle, Play, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

const MODULES = [
    {
        id: 'fin-101',
        title: 'Financial Health Basics',
        desc: 'Understanding Assets, Liabilities, and Net Worth.',
        xp: 100,
        content: `
            # Financial Health 101
            
            Financial health is about more than just how much money you make. It's about your net worth.
            
            **Net Worth = Assets - Liabilities**
            
            *   **Assets**: Things you own (Cash, Stocks, House).
            *   **Liabilities**: Things you owe (Loans, Credit Card Debt).
            
            To improve your financial health, you need to increase assets and decrease liabilities.
        `
    },
    {
        id: 'fin-102',
        title: 'Budgeting 50/30/20',
        desc: 'The golden rule of budgeting for students and fresh grads.',
        xp: 150,
        content: `
            # The 50/30/20 Rule
            
            A simple way to budget your income:
            
            *   **50% Needs**: Essential costs like rent, food, transport.
            *   **30% Wants**: Entertainment, hobbies, dining out.
            *   **20% Savings**: Emergency fund, investments, debt repayment.
        `
    },
    {
        id: 'fin-103',
        title: 'Investing in Indonesia',
        desc: 'Reksadana, Stocks, and SBN. What to choose?',
        xp: 200,
        content: `
            # Investment Instruments in Indonesia
            
            1.  **Reksadana (Mutual Funds)**: Managed by professionals. Good for beginners.
            2.  **SBN (Surat Berharga Negara)**: Government bonds. Very safe, moderate return.
            3.  **Stocks (Saham)**: High risk, high reward. Requires analysis.
            4.  **Crypto**: Very high risk. Only for money you can afford to lose.
        `
    },
];

export default function FinancialAcademy() {
    const { completedModules, completeModule } = useFinancialStore();
    const [activeModule, setActiveModule] = useState<string | null>(null);

    const selectedModule = MODULES.find(m => m.id === activeModule);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-indigo-600" />
                Financial Academy
            </h2>

            <div className="flex flex-col md:flex-row gap-6 h-full">
                <div className="w-full md:w-1/3 space-y-4">
                    {MODULES.map((module, index) => {
                        const isCompleted = completedModules.includes(module.id);
                        const isLocked = index > 0 && !completedModules.includes(MODULES[index - 1].id);

                        return (
                            <button
                                key={module.id}
                                disabled={isLocked}
                                onClick={() => setActiveModule(module.id)}
                                className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between group
                                ${activeModule === module.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'hover:bg-gray-50 border-gray-200'}
                                ${isLocked ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                            `}
                            >
                                <div>
                                    <div className="font-bold text-gray-800 text-sm mb-1">{module.title}</div>
                                    <div className="text-xs text-gray-500 line-clamp-1">{module.desc}</div>
                                </div>
                                <div>
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : isLocked ? (
                                        <Lock className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <Play className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600" />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex-1 bg-gray-50 rounded-xl p-8 border border-gray-100 relative">
                    {selectedModule ? (
                        <motion.div
                            key={selectedModule.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="prose prose-sm max-w-none text-gray-700"
                        >
                            {/* Rendering Markdown-like content safely */}
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedModule.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/# (.*?)(<br\/>|$)/, '<h2 class="text-2xl font-bold mb-4 text-indigo-900">$1</h2>')) }} />

                            {!completedModules.includes(selectedModule.id) && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            completeModule(selectedModule.id);
                                            setActiveModule(null);
                                        }}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                    >
                                        Complete & Claim {selectedModule.xp} XP
                                    </button>
                                </div>
                            )}
                            {completedModules.includes(selectedModule.id) && (
                                <div className="mt-8 flex items-center gap-2 text-green-600 font-bold bg-green-100 px-4 py-2 rounded-lg w-fit">
                                    <CheckCircle className="w-5 h-5" /> Module Completed
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a module to start learning</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
