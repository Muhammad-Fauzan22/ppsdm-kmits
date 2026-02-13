'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { KnowledgeItem } from '@/lib/knowledge/types';

/**
 * FloatingKnowledgeWidget — Bottom-right floating button that shows "Fakta Teknik Hari Ini"
 * Non-intrusive, can be dismissed, links to full /knowledge page.
 */
export default function FloatingKnowledgeWidget() {
    const [fact, setFact] = useState<KnowledgeItem | null>(null);
    const [open, setOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check if user dismissed today
        const dismissedDate = localStorage.getItem('knowledge-widget-dismissed');
        if (dismissedDate === new Date().toDateString()) {
            setDismissed(true);
        }
    }, []);

    const fetchFact = async () => {
        if (fact) {
            setOpen(true);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/knowledge/random');
            const json = await res.json();
            if (json.success && json.data) {
                setFact(json.data);
                setOpen(true);
            }
        } catch (err) {
            console.error('Failed to fetch knowledge fact:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = () => {
        setDismissed(true);
        setOpen(false);
        localStorage.setItem('knowledge-widget-dismissed', new Date().toDateString());
    };

    const handleRefresh = async () => {
        setFact(null);
        setLoading(true);
        try {
            const res = await fetch('/api/knowledge/random');
            const json = await res.json();
            if (json.success && json.data) {
                setFact(json.data);
            }
        } catch (err) {
            console.error('Failed to refresh:', err);
        } finally {
            setLoading(false);
        }
    };

    if (dismissed) return null;

    const categoryIcons: Record<string, string> = {
        formula: '📐', material: '🔩', manufacturing: '🏭',
        mechatronics: '🤖', energy: '⚡', standards: '📋',
        industry4: '🌐', news: '📰', general: '💡',
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence mode="wait">
                {open && fact ? (
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/30 w-[340px] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-4 border-b border-slate-700/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💡</span>
                                    <h4 className="text-sm font-bold text-white">Fakta Teknik Hari Ini</h4>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={handleRefresh}
                                        className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-700/50"
                                        title="Refresh"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-1.5 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-700/50"
                                        title="Minimize"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleDismiss}
                                        className="p-1.5 text-slate-400 hover:text-red-400 transition rounded-lg hover:bg-slate-700/50"
                                        title="Dismiss for today"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">{categoryIcons[fact.category] || '💡'}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    {fact.category}
                                </span>
                            </div>

                            <h5 className="text-white font-semibold text-sm leading-snug mb-2">
                                {fact.title}
                            </h5>

                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-4">
                                {fact.summary || fact.content?.substring(0, 200)}
                            </p>

                            {/* Tags */}
                            {fact.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                    {fact.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 pb-4 flex gap-2">
                            <Link
                                href="/knowledge"
                                className="flex-1 text-center text-xs py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition font-medium"
                            >
                                Jelajahi Knowledge Hub →
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="button"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchFact}
                        disabled={loading}
                        className="relative bg-gradient-to-br from-blue-600 to-violet-600 text-white p-4 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-shadow"
                    >
                        {loading ? (
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        )}

                        {/* Pulse dot */}
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
