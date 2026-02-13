'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermTooltipProps {
    term: string;
    definition: string;
    definitionId: string;
    category: string;
    children: React.ReactNode;
}

/**
 * TermTooltip — Shows engineering term definition on hover.
 * Displays bilingual definition (English + Bahasa Indonesia).
 */
export default function TermTooltip({ term, definition, definitionId, category, children }: TermTooltipProps) {
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setPosition({ x: rect.left + rect.width / 2, y: rect.top });
        setShow(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setShow(false);
    }, []);

    const categoryColors: Record<string, string> = {
        Material: '#f59e0b',
        Thermodynamics: '#ef4444',
        'Fluid Mechanics': '#3b82f6',
        Mechanics: '#8b5cf6',
        Manufacturing: '#10b981',
        Mechatronics: '#06b6d4',
        Energy: '#f97316',
        Standards: '#6366f1',
        'Industry 4.0': '#ec4899',
        Design: '#14b8a6',
        Analysis: '#a855f7',
    };

    return (
        <span className="relative inline">
            <span
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="cursor-help border-b-2 border-dotted border-blue-400/60 text-blue-300 hover:text-blue-200 transition-colors"
            >
                {children}
            </span>

            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-[100] pointer-events-none"
                        style={{
                            left: `${Math.min(position.x, window.innerWidth - 320)}px`,
                            top: `${position.y - 8}px`,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 shadow-2xl max-w-[300px]">
                            {/* Category badge */}
                            <div className="flex items-center gap-2 mb-1.5">
                                <span
                                    className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                    style={{
                                        backgroundColor: `${categoryColors[category] || '#6b7280'}20`,
                                        color: categoryColors[category] || '#9ca3af',
                                    }}
                                >
                                    {category}
                                </span>
                                <span className="text-xs font-semibold text-white">{term}</span>
                            </div>

                            {/* English definition */}
                            <p className="text-xs text-slate-300 leading-relaxed">{definition}</p>

                            {/* Indonesian definition */}
                            <p className="text-[11px] text-slate-400 mt-1 italic leading-relaxed">
                                🇮🇩 {definitionId}
                            </p>

                            {/* Arrow */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
                                <div className="w-2.5 h-2.5 bg-slate-900/95 border-r border-b border-slate-700/50 rotate-45 -mt-1.5" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
