"use client";

import React, { useState } from 'react';
import { useKnowledgeStore, Idea } from '@/lib/stores/useKnowledgeStore';
import { Lightbulb, Plus, Zap, ArrowRight, Trash2, Archive, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SCAMPER_STEPS = [
    { id: 'S', title: 'Substitute', prompt: 'What rules, ingredients, or components can you change?' },
    { id: 'C', title: 'Combine', prompt: 'What can you combine to maximize uses?' },
    { id: 'A', title: 'Adapt', prompt: 'What else is like this? What can you copy?' },
    { id: 'M', title: 'Modify', prompt: 'Can you change the meaning, color, motion, or form?' },
    { id: 'P', title: 'Put to another use', prompt: 'Where else could this be used?' },
    { id: 'E', title: 'Eliminate', prompt: 'What can you streamline or remove?' },
    { id: 'R', title: 'Rearrange', prompt: 'What if you reversed the process or sequence?' },
];

export default function CreativityLab() {
    const { ideas, addIdea, moveIdeaStage, deleteIdea } = useKnowledgeStore();
    const [activeMode, setActiveMode] = useState<'board' | 'scamper'>('board');
    const [scamperIndex, setScamperIndex] = useState(0);
    const [scamperInputs, setScamperInputs] = useState<Record<string, string>>({});

    // Kanban Columns
    const columns = [
        { id: 'raw', title: 'Raw Ideas', color: 'bg-yellow-50 text-yellow-700' },
        { id: 'developing', title: 'Developing', color: 'bg-blue-50 text-blue-700' },
        { id: 'prototyping', title: 'Prototyping', color: 'bg-green-50 text-green-700' },
    ];

    const handleScamperSubmit = () => {
        // Generate an idea from SCAMPER inputs
        const summary = Object.entries(scamperInputs)
            .map(([key, val]) => `${key}: ${val}`)
            .join('\n');

        addIdea({
            title: `SCAMPER Session: ${new Date().toLocaleDateString()}`,
            description: summary,
            scamperTags: Object.keys(scamperInputs),
        });

        setScamperInputs({});
        setScamperIndex(0);
        setActiveMode('board');
    };

    const handleNextScamper = () => {
        if (scamperIndex < SCAMPER_STEPS.length - 1) {
            setScamperIndex(prev => prev + 1);
        } else {
            handleScamperSubmit();
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" /> Creativity Lab
                </h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveMode('board')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeMode === 'board' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        Idea Board
                    </button>
                    <button
                        onClick={() => setActiveMode('scamper')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeMode === 'scamper' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                    >
                        SCAMPER Wizard
                    </button>
                </div>
            </div>

            {activeMode === 'board' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    {columns.map((col) => (
                        <div key={col.id} className="bg-gray-50 rounded-xl p-4 flex flex-col">
                            <h3 className={`font-bold mb-3 ${col.color.replace('bg-', 'text-')}`}>{col.title}</h3>
                            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar min-h-[200px]">
                                {ideas.filter(i => i.stage === col.id).map(idea => (
                                    <motion.div
                                        layoutId={idea.id}
                                        key={idea.id}
                                        className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-semibold text-sm text-gray-800 mb-1">{idea.title}</h4>
                                            <button onClick={() => deleteIdea(idea.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-3 whitespace-pre-line">{idea.description}</p>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                            {col.id !== 'raw' && (
                                                <button onClick={() => moveIdeaStage(idea.id, col.id === 'prototyping' ? 'developing' : 'raw')} className="text-gray-400 hover:bg-gray-100 p-1 rounded">
                                                    <ArrowRight className="w-3 h-3 rotate-180" />
                                                </button>
                                            )}
                                            <span className="text-[10px] text-gray-400">{new Date(idea.createdAt).toLocaleDateString()}</span>
                                            {col.id !== 'prototyping' && (
                                                <button onClick={() => moveIdeaStage(idea.id, col.id === 'raw' ? 'developing' : 'prototyping')} className="text-gray-400 hover:bg-gray-100 p-1 rounded">
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Quick Add for Raw Ideas */}
                                {col.id === 'raw' && (
                                    <button
                                        onClick={() => addIdea({ title: 'New Idea', description: 'What\'s on your mind?', scamperTags: [] })}
                                        className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:text-gray-600 hover:border-gray-300 transition text-sm flex items-center justify-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Validasi Ide
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={scamperIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full bg-indigo-50 rounded-3xl p-8 mb-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Zap className="w-32 h-32 text-indigo-900" />
                            </div>
                            <span className="text-6xl font-black text-indigo-900/10 absolute top-4 left-6 select-none">
                                {SCAMPER_STEPS[scamperIndex].id}
                            </span>

                            <h3 className="text-2xl font-bold text-indigo-900 mb-2 relative z-10">
                                {SCAMPER_STEPS[scamperIndex].title}
                            </h3>
                            <p className="text-indigo-600 font-medium mb-6 relative z-10 text-lg">
                                {SCAMPER_STEPS[scamperIndex].prompt}
                            </p>

                            <textarea
                                className="w-full rounded-xl border border-indigo-100 p-4 h-32 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white relative z-10 shadow-sm"
                                placeholder="Type your thoughts here..."
                                value={scamperInputs[SCAMPER_STEPS[scamperIndex].title] || ''}
                                onChange={(e) => setScamperInputs({ ...scamperInputs, [SCAMPER_STEPS[scamperIndex].title]: e.target.value })}
                                autoFocus
                            />
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex items-center gap-4 w-full">
                        <div className="flex-1 flex gap-1">
                            {SCAMPER_STEPS.map((step, i) => (
                                <div key={step.id} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= scamperIndex ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                        <button
                            onClick={handleNextScamper}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {scamperIndex === SCAMPER_STEPS.length - 1 ? (
                                <>Finish <Check className="w-5 h-5" /></>
                            ) : (
                                <>Next <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
