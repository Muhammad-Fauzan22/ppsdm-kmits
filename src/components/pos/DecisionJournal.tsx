"use client";

import React, { useState } from 'react';
import { usePOSStore, Decision } from '@/lib/stores/usePOSStore';
import { Plus, ChevronDown, ChevronUp, Scale, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DecisionJournal() {
    const { decisions, addDecision, reviewDecision } = usePOSStore();
    const [activeTab, setActiveTab] = useState<'new' | 'journal'>('new');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Form State
    const [form, setForm] = useState({
        title: '',
        context: '',
        options: [''],
        selection: '',
        outcomePrediction: '',
    });

    const handleAddOption = () => {
        setForm({ ...form, options: [...form.options, ''] });
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm({ ...form, options: newOptions });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.selection) return;

        addDecision({
            ...form,
            reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 week review
        });

        setForm({
            title: '',
            context: '',
            options: [''],
            selection: '',
            outcomePrediction: '',
        });
        setActiveTab('journal');
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Scale className="w-6 h-6" /> Decision Intelligence
                    </h2>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                    <button
                        onClick={() => setActiveTab('new')}
                        className={`px-3 py-1 rounded-full transition ${activeTab === 'new' ? 'bg-white text-violet-600' : 'text-violet-200 hover:text-white'}`}
                    >
                        New Entry
                    </button>
                    <button
                        onClick={() => setActiveTab('journal')}
                        className={`px-3 py-1 rounded-full transition ${activeTab === 'journal' ? 'bg-white text-violet-600' : 'text-violet-200 hover:text-white'}`}
                    >
                        Journal History
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'new' ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Decision Title</label>
                            <input
                                type="text"
                                required
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Should I switch majors?"
                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Context (The "Why")</label>
                            <textarea
                                value={form.context}
                                onChange={(e) => setForm({ ...form, context: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none h-24 resize-none"
                                placeholder="What triggered this decision? What are the constraints?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Options Considered</label>
                            <div className="space-y-2">
                                {form.options.map((opt, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                        placeholder={`Option ${idx + 1}`}
                                        className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none bg-gray-50"
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="text-sm text-violet-600 font-medium hover:underline flex items-center gap-1"
                                >
                                    <Plus className="w-3 h-3" /> Add Option
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chosen Path</label>
                            <select
                                required
                                value={form.selection}
                                onChange={(e) => setForm({ ...form, selection: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none"
                            >
                                <option value="">Select chosen option...</option>
                                {form.options.filter(o => o.trim()).map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Outcome (Prediction)</label>
                            <textarea
                                value={form.outcomePrediction}
                                onChange={(e) => setForm({ ...form, outcomePrediction: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-violet-500 outline-none h-20 resize-none"
                                placeholder="What do you expect to happen? Be specific."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!form.title || !form.selection}
                            className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 disabled:opacity-50 transition"
                        >
                            Log Decision
                        </button>
                    </form>
                ) : (
                    <div className="space-y-3">
                        {decisions.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                No decisions logged yet. Start your journal!
                            </div>
                        )}
                        {decisions.slice().reverse().map((decision) => (
                            <div key={decision.id} className="border rounded-2xl p-4 hover:shadow-md transition bg-white">
                                <div
                                    onClick={() => setExpandedId(expandedId === decision.id ? null : decision.id)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${decision.status === 'reviewed' ? 'bg-green-500' : 'bg-amber-500'}`} />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{decision.title}</h3>
                                            <p className="text-xs text-gray-400">{new Date(decision.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {expandedId === decision.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>

                                <AnimatePresence>
                                    {expandedId === decision.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 border-t mt-4 space-y-3 text-sm text-gray-600">
                                                <div>
                                                    <span className="font-semibold block text-xs uppercase text-gray-400 tracking-wider">Context</span>
                                                    {decision.context || 'No context provided.'}
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                                    <div>
                                                        <span className="font-semibold block text-xs uppercase text-gray-400 tracking-wider">Choice</span>
                                                        <span className="text-violet-700 font-medium">{decision.selection}</span>
                                                    </div>
                                                    <ArrowRight className="w-4 h-4 text-gray-300" />
                                                    <div className="text-right">
                                                        <span className="font-semibold block text-xs uppercase text-gray-400 tracking-wider">Prediction</span>
                                                        <span className="italic">{decision.outcomePrediction}</span>
                                                    </div>
                                                </div>

                                                {decision.status === 'pending_review' ? (
                                                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                                        <h4 className="flex items-center gap-2 font-semibold text-amber-800 mb-2">
                                                            <AlertCircle className="w-4 h-4" /> Review Required
                                                        </h4>
                                                        <p className="mb-3 text-amber-700">How did it actually turn out?</p>
                                                        <input
                                                            type="text"
                                                            placeholder="Actual outcome..."
                                                            className="w-full px-3 py-2 rounded-lg border border-amber-200 mb-2"
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    reviewDecision(decision.id, (e.target as HTMLInputElement).value);
                                                                }
                                                            }}
                                                        />
                                                        <p className="text-xs text-amber-600">Press Enter to save review</p>
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                                                        <span className="font-semibold block text-xs uppercase text-green-700 tracking-wider mb-1">Actual Outcome</span>
                                                        <p className="text-green-800">{decision.actualOutcome}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
