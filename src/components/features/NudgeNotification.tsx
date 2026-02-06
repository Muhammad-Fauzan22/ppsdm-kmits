'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Zap, Users, Trophy } from 'lucide-react';
import { NudgeEngine } from '@/lib/nudges/engine';
import { Nudge } from '@/lib/nudges/library';
import Link from 'next/link';

export const NudgeNotification = () => {
    const [nudge, setNudge] = useState<Nudge | null>(null);

    useEffect(() => {
        // Initial check after 3 seconds
        const timer = setTimeout(() => {
            const nextNudge = NudgeEngine.getNextNudge();
            if (nextNudge) {
                setNudge(nextNudge);
                NudgeEngine.markAsShown(nextNudge.id);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!nudge) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'social_proof': return <Users className="w-5 h-5 text-blue-400" />;
            case 'streak': return <Zap className="w-5 h-5 text-yellow-400" />;
            case 'achievement': return <Trophy className="w-5 h-5 text-purple-400" />;
            default: return <span className="text-xl">{nudge.icon || '💡'}</span>;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="fixed bottom-4 right-4 z-50 max-w-sm w-full"
            >
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-2xl relative overflow-hidden">
                    {/* Progress bar effect for "autoclose" feel or just aesthetic */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50" />

                    <button
                        onClick={() => setNudge(null)}
                        className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shrink-0 border border-slate-700">
                            {getIcon(nudge.type)}
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm mb-1">{nudge.title}</h4>
                            <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                                {nudge.message}
                            </p>

                            {nudge.actionLink && (
                                <Link
                                    href={nudge.actionLink}
                                    onClick={() => setNudge(null)}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    {nudge.actionLabel || 'Check it out'}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
