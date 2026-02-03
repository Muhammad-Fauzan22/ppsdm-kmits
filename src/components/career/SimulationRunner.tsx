'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MessageSquare, Zap, RefreshCw, ChevronRight } from 'lucide-react';
import { SimulationModule, SimulationNode } from '@/data/career/simulations';

interface SimulationRunnerProps {
    module: SimulationModule;
    onComplete?: (score: number) => void;
}

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({ module, onComplete }) => {
    const [currentNodeId, setCurrentNodeId] = useState(module.startNodeId);
    const [history, setHistory] = useState<string[]>([module.startNodeId]);
    const [accumulatedSkills, setAccumulatedSkills] = useState<Record<string, number>>({});
    const [lastFeedback, setLastFeedback] = useState<string | null>(null);

    const currentNode = module.nodes[currentNodeId];
    const isEndNode = currentNode.options.length === 0;

    const handleOptionClick = (nextNodeId: string, skillImpact: Record<string, number>, feedback: string) => {
        setLastFeedback(feedback);

        // Update skills
        const newSkills = { ...accumulatedSkills };
        Object.entries(skillImpact).forEach(([skill, val]) => {
            newSkills[skill] = (newSkills[skill] || 0) + val;
        });
        setAccumulatedSkills(newSkills);

        // Move to next node
        setCurrentNodeId(nextNodeId);
        setHistory([...history, nextNodeId]);
    };

    const resetSimulation = () => {
        setCurrentNodeId(module.startNodeId);
        setHistory([module.startNodeId]);
        setAccumulatedSkills({});
        setLastFeedback(null);
    };

    return (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden max-w-4xl mx-auto shadow-2xl">
            {/* Header */}
            <div className="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">
                        <Briefcase className="w-4 h-4" /> Career Simulator
                    </div>
                    <h2 className="text-2xl font-bold text-white">{module.title}</h2>
                    <p className="text-slate-400 text-sm">{module.role} at {module.company}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500">Live Impact</span>
                    <div className="flex gap-2 mt-1">
                        {Object.entries(accumulatedSkills).map(([skill, val]) => (
                            <span key={skill} className={`text-xs px-2 py-1 rounded bg-slate-700 ${val > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {skill} {val > 0 ? '+' : ''}{val}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-8 min-h-[400px] flex flex-col justify-center relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentNodeId}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Feedback Toast */}
                        {lastFeedback && (
                            <div className="bg-blue-900/30 border border-blue-500/30 text-blue-200 p-4 rounded-xl flex items-start gap-3">
                                <Zap className="w-5 h-5 mt-0.5 shrink-0" />
                                <p className="italic">{lastFeedback}</p>
                            </div>
                        )}

                        {/* Scenario Text */}
                        <div className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light">
                            &quot;{currentNode.text}&quot;
                        </div>

                        {/* Options */}
                        {!isEndNode ? (
                            <div className="grid gap-4 mt-8">
                                {currentNode.options.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleOptionClick(option.nextNodeId, option.skillImpact, option.feedback)}
                                        className="group bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 p-6 rounded-xl text-left transition-all flex justify-between items-center"
                                    >
                                        <span className="text-lg text-slate-300 group-hover:text-white font-medium">
                                            {option.text}
                                        </span>
                                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={resetSimulation}
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-shadow hover:shadow-lg hover:shadow-indigo-500/25"
                                >
                                    <RefreshCw className="w-4 h-4" /> Replay Simulation
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
