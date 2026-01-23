"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu } from 'lucide-react';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

export default function DetailModal({ isOpen, onClose, title, subtitle, children }: DetailModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <motion.div
                            className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl pointer-events-auto relative flex flex-col"
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                                        <Cpu className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                                        {subtitle && <p className="text-sm text-cyan-500 font-mono">{subtitle}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50 text-slate-300">
                                {children}
                            </div>

                            {/* Footer / Status Bar */}
                            <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500 uppercase">
                                <div>System Architecture Level 2</div>
                                <div>Status: ONLINE</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
