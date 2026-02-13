'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TermTooltip from './TermTooltip';
import QuizModal from './QuizModal';
import type { KnowledgeItem, InteractiveMetadataJSON } from '@/lib/knowledge/types';

interface InteractiveCardProps {
    item: KnowledgeItem;
    index?: number;
}

const categoryIcons: Record<string, string> = {
    formula: '📐',
    material: '🔩',
    manufacturing: '🏭',
    mechatronics: '🤖',
    energy: '⚡',
    standards: '📋',
    industry4: '🌐',
    news: '📰',
    general: '💡',
    definition: '📖',
};

const categoryColors: Record<string, string> = {
    formula: 'from-violet-600/20 to-indigo-600/20 border-violet-500/30',
    material: 'from-amber-600/20 to-yellow-600/20 border-amber-500/30',
    manufacturing: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30',
    mechatronics: 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30',
    energy: 'from-orange-600/20 to-red-600/20 border-orange-500/30',
    standards: 'from-indigo-600/20 to-purple-600/20 border-indigo-500/30',
    industry4: 'from-pink-600/20 to-rose-600/20 border-pink-500/30',
    news: 'from-blue-600/20 to-sky-600/20 border-blue-500/30',
    general: 'from-slate-600/20 to-gray-600/20 border-slate-500/30',
    definition: 'from-teal-600/20 to-green-600/20 border-teal-500/30',
};

/**
 * InteractiveCard — Renders a knowledge item with expandable content,
 * enriched term tooltips, statistics, and quiz trigger.
 */
export default function InteractiveCard({ item, index = 0 }: InteractiveCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);

    const metadata = (item.interactive_metadata || {}) as InteractiveMetadataJSON;
    const hasQuiz = (metadata.quiz_candidates?.length || 0) > 0;
    const hasStats = (metadata.statistics?.length || 0) > 0;
    const readingTime = metadata.reading_time_minutes || 1;

    // Render content with term tooltips
    const renderEnrichedContent = (text: string) => {
        if (!metadata.terms?.length) return <p className="text-slate-300 text-sm leading-relaxed">{text}</p>;

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;

        // Sort terms by position to process in order
        const sortedTerms = [...metadata.terms].sort((a, b) => a.position[0] - b.position[0]);

        for (const term of sortedTerms) {
            const termLower = term.term.toLowerCase();
            const textLower = text.toLowerCase();
            const idx = textLower.indexOf(termLower, lastIndex);

            if (idx === -1) continue;

            // Add text before the term
            if (idx > lastIndex) {
                parts.push(text.substring(lastIndex, idx));
            }

            // Add tooltip-wrapped term
            parts.push(
                <TermTooltip
                    key={`${term.term}-${idx}`}
                    term={term.term}
                    definition={term.definition}
                    definitionId={term.definitionId}
                    category={term.category}
                >
                    {text.substring(idx, idx + term.term.length)}
                </TermTooltip>
            );

            lastIndex = idx + term.term.length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return <p className="text-slate-300 text-sm leading-relaxed">{parts}</p>;
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`bg-gradient-to-br ${categoryColors[item.category] || categoryColors.general} border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group`}
            >
                {/* Header */}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{categoryIcons[item.category] || '💡'}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {item.category}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {readingTime} min
                        </div>
                    </div>

                    <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-blue-300 transition-colors">
                        {item.title}
                    </h3>

                    {/* Summary or expandable content */}
                    {expanded && item.content ? (
                        <div className="mt-2">
                            {renderEnrichedContent(item.content)}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                            {item.summary || item.content?.substring(0, 200)}
                        </p>
                    )}

                    {/* Statistics bar */}
                    {hasStats && expanded && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                            {metadata.statistics!.slice(0, 4).map((stat, i) => (
                                <div key={i} className="bg-slate-800/50 rounded-lg p-2.5 text-center">
                                    <div className="text-lg font-bold text-blue-400">{stat.value}</div>
                                    <div className="text-[10px] text-slate-500 uppercase">{stat.unit}</div>
                                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tags */}
                    {item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.tags.slice(0, 4).map(tag => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/30"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-5 pb-4 flex items-center gap-2">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition font-medium"
                    >
                        {expanded ? '▲ Ringkas' : '▼ Baca Selengkapnya'}
                    </button>

                    {hasQuiz && (
                        <button
                            onClick={() => setQuizOpen(true)}
                            className="text-xs px-2.5 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg transition font-medium border border-blue-500/20"
                        >
                            🧠 Kuis
                        </button>
                    )}

                    {item.url && (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:text-slate-300 transition ml-auto"
                        >
                            🔗 Sumber
                        </a>
                    )}
                </div>
            </motion.div>

            {/* Quiz Modal */}
            {hasQuiz && (
                <QuizModal
                    questions={metadata.quiz_candidates!}
                    isOpen={quizOpen}
                    onClose={() => setQuizOpen(false)}
                />
            )}
        </>
    );
}
