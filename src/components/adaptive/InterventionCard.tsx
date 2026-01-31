'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap, CheckCircle2, ArrowRight, BarChart } from 'lucide-react';
import { Intervention } from '@/lib/adaptive/library';

interface InterventionCardProps {
    intervention: Intervention;
    onAccept?: () => void;
    onComplete?: () => void;
}

export const InterventionCard: React.FC<InterventionCardProps> = ({ intervention, onAccept, onComplete }) => {
    const [status, setStatus] = useState<'idle' | 'active' | 'completed'>('idle');

    const handleAction = () => {
        if (status === 'idle') setStatus('active');
        else if (status === 'active') setStatus('completed');
    };

    const difficultyColors = {
        easy: 'text-green-400 bg-green-400/10 border-green-400/20',
        medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
        hard: 'text-red-400 bg-red-400/10 border-red-400/20'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative overflow-hidden rounded-2xl border ${status === 'completed' ? 'border-green-500/50 bg-green-900/10' : 'border-white/10 bg-slate-900/50'} p-5 transition-all w-full`}
        >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full blur-3xl transition-colors duration-500 ${status === 'active' ? 'bg-blue-500/20' : 'bg-white/5'}`}></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-start justify-between mb-3">
                        <span className={`text-xs px-2 py-1 rounded-md border font-bold uppercase tracking-wider ${difficultyColors[intervention.difficulty]}`}>
                            {intervention.difficulty}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded-full">
                            <Clock className="w-3 h-3" /> {intervention.durationMinutes}m
                        </span>
                    </div>

                    <h3 className={`font-bold text-lg mb-2 ${status === 'completed' ? 'text-green-400 line-through decoration-green-500/50' : 'text-white'}`}>
                        {intervention.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        {intervention.description}
                    </p>
                </div>

                <div className="mt-2">
                    {status === 'idle' && (
                        <button
                            onClick={handleAction}
                            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg font-medium transition-colors group-hover:border-white/20"
                        >
                            <Zap className="w-4 h-4 text-yellow-500" /> Accept Challenge
                        </button>
                    )}

                    {status === 'active' && (
                        <button
                            onClick={handleAction}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
                        >
                            Mark Complete <ArrowRight className="w-4 h-4" />
                        </button>
                    )}

                    {status === 'completed' && (
                        <div className="w-full flex items-center justify-center gap-2 bg-green-500/20 text-green-400 py-2 rounded-lg font-bold">
                            <CheckCircle2 className="w-5 h-5" /> Completed
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
