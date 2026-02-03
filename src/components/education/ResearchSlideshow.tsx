"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, BookOpen, BarChart2, Quote, Activity } from 'lucide-react';

export interface ResearchSlide {
    id: string;
    title: string;
    subtitle?: string;
    type: 'cover' | 'concept' | 'process' | 'data' | string;
    content?: any;
    steps?: string[];
    table?: any[];
    note?: string;
}

interface ResearchSlideshowProps {
    slides: ResearchSlide[];
    onComplete?: () => void;
}

export default function ResearchSlideshow({ slides, onComplete }: ResearchSlideshowProps) {
    const [current, setCurrent] = useState(0);

    if (!slides || slides.length === 0) return null;

    const slide = slides[current];
    const total = slides.length;

    const next = () => setCurrent(prev => Math.min(prev + 1, total - 1));
    const prev = () => setCurrent(prev => Math.max(prev - 1, 0));

    const handleNext = () => {
        if (current === total - 1) {
            if (onComplete) onComplete();
        } else {
            next();
        }
    };

    // Calculate progress for progress bar
    const progress = ((current + 1) / total) * 100;

    return (
        <div className="w-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-[500px] shadow-2xl">
            {/* Header / Toolbar */}
            <div className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-10 relative">
                <div className="flex items-center gap-2 text-cyan-400">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-wider uppercase">Scientific Basis</span>
                </div>
                <div className="flex gap-1.5 align-middle items-center">
                    {/* Simplified dot indicators for many slides */}
                    <div className="text-xs text-slate-500 font-mono mr-2">
                        {current + 1}/{total}
                    </div>
                </div>
            </div>

            {/* Slide Content */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="h-full flex flex-col justify-center max-w-4xl mx-auto"
                    >
                        {/* Slide Type: Cover */}
                        {slide.type === 'cover' && (
                            <div className="text-center space-y-8">
                                <motion.div
                                    initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                                    className="inline-block px-4 py-1.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-bold mb-4"
                                >
                                    RESEARCH REPORT & VALIDATION
                                </motion.div>
                                <h2 className="text-4xl md:text-5xl font-black text-white">{slide.title}</h2>
                                <p className="text-xl text-slate-400 font-light">{slide.subtitle}</p>

                                {slide.content?.stats && (
                                    <div className="grid grid-cols-3 gap-6 mt-12">
                                        {slide.content.stats.map((stat: any, i: number) => (
                                            <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                                                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                                <div className="text-xs text-cyan-400 font-bold uppercase">{stat.label}</div>
                                                <div className="text-[10px] text-slate-500 mt-1">{stat.sub}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Slide Type: Concept */}
                        {slide.type === 'concept' && (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                                        <Quote className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white">{slide.title}</h2>
                                </div>
                                <div className="text-lg md:text-xl text-slate-300 leading-relaxed pl-4 border-l-4 border-cyan-500 italic">
                                    &quot;{slide.content.definition}&quot;
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div className="p-5 rounded-lg bg-slate-800 border border-slate-700">
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <Activity className="w-4 h-4 text-emerald-400" /> Framework / Theory
                                        </h4>
                                        <p className="text-sm text-slate-400">{slide.content.framework || slide.content.impact}</p>
                                    </div>
                                    <div className="p-5 rounded-lg bg-slate-800 border border-slate-700">
                                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                            <BarChart2 className="w-4 h-4 text-purple-400" /> Validation Evidence
                                        </h4>
                                        <p className="text-sm text-slate-400">{slide.content.validation || slide.content.context}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slide Type: Process */}
                        {slide.type === 'process' && slide.steps && (
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-8">{slide.title}</h2>
                                <div className="space-y-4">
                                    {slide.steps.map((step: string, i: number) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-sm shrink-0">
                                                {i + 1}
                                            </div>
                                            <div className="text-slate-200 font-medium">{step}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Slide Type: Data */}
                        {slide.type === 'data' && slide.table && (
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-8">{slide.title}</h2>
                                <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-slate-400 text-xs uppercase">
                                            <tr>
                                                <th className="p-4">Percentile</th>
                                                <th className="p-4">Score Threshold</th>
                                                <th className="p-4">Interpretation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700 text-slate-300">
                                            {slide.table.map((row: any, i: number) => (
                                                <tr key={i} className="hover:bg-slate-700/50 transition-colors">
                                                    <td className="p-4 font-mono text-cyan-400">{row.percentile}</td>
                                                    <td className="p-4 font-bold">{row.score}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                                            ${row.label === 'Exceptional' || row.label.includes('High') ? 'bg-emerald-500/20 text-emerald-400' :
                                                                row.label === 'Excellent' || row.label.includes('Very Good') ? 'bg-cyan-500/20 text-cyan-400' :
                                                                    row.label === 'Average' || row.label.includes('Moderate') ? 'bg-blue-500/20 text-blue-400' :
                                                                        'bg-slate-700 text-slate-400'}`}>
                                                            {row.label}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 text-center italic">{slide.note}</p>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div className="h-16 bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 z-10 relative">
                <button
                    onClick={prev}
                    disabled={current === 0}
                    className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" /> Previous
                </button>

                {/* Progress Bar */}
                <div className="flex-1 mx-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>

                <button
                    onClick={handleNext}
                    disabled={current === total - 1 && !onComplete}
                    className="flex items-center gap-2 text-white font-bold hover:text-cyan-400 disabled:opacity-30 transition-colors"
                >
                    {current === total - 1 ? (onComplete ? 'Start Assessment' : 'Finish') : 'Next'} <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
