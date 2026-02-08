"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapPage() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    // This data would eventually come from the backend
    const nodes = {
        'advanced-vis': {
            id: 'advanced-vis',
            title: 'Advanced Visualization',
            progress: 60,
            status: 'In Progress',
            description: 'Learn to create complex interactive visualizations using D3.js and WebGL. This node covers force-directed graphs, geospatial mapping, and large dataset rendering optimization.',
            prereqs: [
                { name: 'Foundational Literacy', status: 'verified', time: '2 months ago' },
                { name: 'Basic JS Logic', status: 'suggested', time: 'Optional' }
            ],
            resources: [
                { type: 'video', title: 'Module 4: Graph Theory Intro', duration: '15 mins' },
                { type: 'article', title: 'D3.js Documentation Guide', duration: '10 mins read' }
            ]
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
            {/* Canvas Elements Container (Simulated Pan/Zoom Area) */}
            <div className="absolute inset-0 flex items-center justify-center bg-grid-pattern">
                {/* Connection Lines (SVG Layer) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stopColor="#135bec" stopOpacity="1"></stop>
                            <stop offset="100%" stopColor="#135bec" stopOpacity="0.2"></stop>
                        </linearGradient>
                    </defs>
                    {/* Connections from Root */}
                    <path className="opacity-50" d="M50% 50% L30% 30%" stroke="#135bec" strokeWidth="2"></path>
                    <path className="opacity-50" d="M50% 50% L70% 30%" stroke="#135bec" strokeWidth="2"></path>
                    <path d="M50% 50% L50% 75%" stroke="#334155" strokeDasharray="5,5" strokeWidth="2"></path>
                    {/* Connections from Left Branch */}
                    <path className="opacity-30" d="M30% 30% L20% 15%" stroke="#135bec" strokeWidth="2"></path>
                    <path className="opacity-30" d="M30% 30% L40% 15%" stroke="#135bec" strokeWidth="2"></path>
                    {/* Connections from Right Branch */}
                    <path d="M70% 30% L60% 15%" stroke="#334155" strokeWidth="2"></path>
                    <path d="M70% 30% L80% 15%" stroke="#334155" strokeWidth="2"></path>
                </svg>
                {/* Nodes Layer */}
                <div className="relative w-full h-full z-10">
                    {/* Root Node (Center) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer" onClick={() => setSelectedNode(null)}>
                        <div className="relative flex items-center justify-center size-24 rounded-full bg-slate-900 border-2 border-blue-600 shadow-[0_0_10px_rgba(19,91,236,0.5),0_0_20px_rgba(19,91,236,0.3)] transition-transform group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(19,91,236,0.7),0_0_30px_rgba(19,91,236,0.5)]">
                            <span className="material-symbols-outlined text-4xl text-white">hub</span>
                            {/* Status Badge */}
                            <div className="absolute -bottom-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Mastered</div>
                        </div>
                        <span className="mt-4 text-white font-bold bg-black/50 px-3 py-1 rounded backdrop-blur-sm border border-blue-600/30">Foundational Literacy</span>
                    </motion.div>
                    {/* Branch Node A (Top Left - Verified) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[30%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                        <div className="relative flex items-center justify-center size-20 rounded-full bg-slate-900 border-2 border-blue-600 shadow-[0_0_10px_rgba(19,91,236,0.5),0_0_20px_rgba(19,91,236,0.3)] transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-3xl text-white">analytics</span>
                        </div>
                        <span className="mt-3 text-sm text-gray-200 font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Data Analysis</span>
                    </motion.div>
                    {/* Leaf Node A1 (Top Left Far - Verified) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[15%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer opacity-80 hover:opacity-100">
                        <div className="flex items-center justify-center size-16 rounded-full bg-slate-900 border border-blue-600/50 transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl text-blue-600">functions</span>
                        </div>
                        <span className="mt-2 text-xs text-gray-400">Statistics</span>
                    </motion.div>
                    {/* Leaf Node A2 (Top Left Center - Verified) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[15%] left-[40%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer opacity-80 hover:opacity-100">
                        <div className="flex items-center justify-center size-16 rounded-full bg-slate-900 border border-blue-600/50 transition-transform group-hover:scale-110">
                            <span className="material-symbols-outlined text-2xl text-blue-600">database</span>
                        </div>
                        <span className="mt-2 text-xs text-gray-400">SQL Basics</span>
                    </motion.div>
                    {/* Branch Node B (Top Right - Locked/In Progress) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer">
                        <div className="relative flex items-center justify-center size-20 rounded-full bg-slate-900 border-2 border-slate-700 transition-transform group-hover:scale-110 group-hover:border-white">
                            <span className="material-symbols-outlined text-3xl text-slate-500">brush</span>
                            <div className="absolute -top-1 -right-1 bg-slate-700 rounded-full p-1 border border-black">
                                <span className="material-symbols-outlined text-[12px] text-gray-300 block">lock</span>
                            </div>
                        </div>
                        <span className="mt-3 text-sm text-gray-500 font-medium">UI/UX Design</span>
                    </motion.div>
                    {/* Leaf Node B1 (Locked) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[15%] left-[60%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-50 grayscale">
                        <div className="flex items-center justify-center size-16 rounded-full bg-slate-900 border border-slate-700">
                            <span className="material-symbols-outlined text-2xl text-gray-500">contrast</span>
                        </div>
                        <span className="mt-2 text-xs text-gray-600">Color Theory</span>
                    </motion.div>
                    {/* Leaf Node B2 (Locked) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="absolute top-[15%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-50 grayscale">
                        <div className="flex items-center justify-center size-16 rounded-full bg-slate-900 border border-slate-700">
                            <span className="material-symbols-outlined text-2xl text-gray-500">accessibility_new</span>
                        </div>
                        <span className="mt-2 text-xs text-gray-600">A11y</span>
                    </motion.div>
                    {/* Branch Node C (Bottom Center - Selected/Active) */}
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} className="absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-20" onClick={() => setSelectedNode('advanced-vis')}>
                        {/* Pulsing Ring */}
                        <div className="absolute inset-0 rounded-full animate-ping border border-blue-600/50 opacity-75"></div>
                        <div className="relative flex items-center justify-center size-24 rounded-full bg-slate-900 border-2 border-dashed border-blue-600 shadow-[0_0_30px_rgba(19,91,236,0.3)] transition-transform group-hover:scale-105">
                            <span className="material-symbols-outlined text-4xl text-white">neurology</span>
                            <div className="absolute -bottom-3 bg-slate-900 border border-blue-600/50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                                In Progress
                            </div>
                        </div>
                        <span className="mt-5 text-blue-400 font-bold text-lg bg-black/60 px-4 py-1 rounded-lg backdrop-blur-md border border-blue-600/50">Advanced Visualization</span>
                    </motion.div>
                </div>
            </div>

            {/* Floating UI: Search Bar (Top Left) */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute top-6 left-6 z-30 w-80"
            >
                <div className="flex w-full items-stretch rounded-lg h-12 bg-white/5 backdrop-blur border border-white/10 shadow-lg group focus-within:border-blue-500/50 focus-within:shadow-[0_0_10px_rgba(19,91,236,0.5),0_0_20px_rgba(19,91,236,0.3)] transition-all">
                    <div className="text-slate-400 flex items-center justify-center pl-4">
                        <span className="material-symbols-outlined">search</span>
                    </div>
                    <input className="w-full bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-500 px-3 font-sans text-sm" placeholder="Search skills, nodes, or ID..." />
                    <div className="text-slate-500 flex items-center justify-center pr-3 text-xs font-mono">
                        CTRL+K
                    </div>
                </div>
            </motion.div>

            {/* Floating UI: Legend (Bottom Left) */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute bottom-6 left-6 z-30 bg-white/5 backdrop-blur border border-white/10 rounded-lg shadow-xl p-4 w-64"
            >
                <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Map Legend</h3>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 items-center">
                    <div className="w-8 h-0.5 bg-blue-600 shadow-[0_0_8px_rgba(19,91,236,0.8)]"></div>
                    <p className="text-gray-300 text-xs">Verified Path</p>
                    <div className="w-8 h-0.5 border-t-2 border-dashed border-blue-600"></div>
                    <p className="text-gray-300 text-xs">In Progress</p>
                    <div className="w-8 h-0.5 bg-slate-700"></div>
                    <p className="text-gray-400 text-xs">Locked / Future</p>
                    <div className="size-3 rounded-full border border-blue-600 shadow-[0_0_5px_rgba(19,91,236,1)] bg-blue-600/20"></div>
                    <p className="text-white text-xs">Available Node</p>
                </div>
            </motion.div>

            {/* Floating UI: Zoom Controls (Bottom Right) */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`absolute bottom-6 right-6 lg:right-[${selectedNode ? '420px' : '2rem'}] z-30 flex flex-col gap-2 transition-all duration-300`}
            >
                <button className="size-10 flex items-center justify-center bg-white/5 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-blue-500/50 active:scale-95 transition-all">
                    <span className="material-symbols-outlined">add</span>
                </button>
                <button className="size-10 flex items-center justify-center bg-white/5 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-blue-500/50 active:scale-95 transition-all">
                    <span className="material-symbols-outlined">remove</span>
                </button>
                <button className="size-10 flex items-center justify-center bg-white/5 backdrop-blur border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-blue-500/50 active:scale-95 transition-all" title="Reset View">
                    <span className="material-symbols-outlined">center_focus_strong</span>
                </button>
            </motion.div>

            {/* Info Sidebar (Right Side) */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-0 right-0 h-full w-full max-w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-40 flex flex-col shadow-2xl"
                    >
                        {/* Sidebar Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-600/30 uppercase">Skill Node #104</span>
                                    <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded border border-yellow-500/30 uppercase">High Priority</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white leading-tight">Advanced Visualization</h2>
                            </div>
                            <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setSelectedNode(null)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Progress Section */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-sm font-medium text-gray-300">Proficiency Progress</label>
                                    <span className="text-blue-500 font-bold text-lg">60%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 w-[60%] shadow-[0_0_10px_rgba(19,91,236,0.5)]"></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Finish 2 more modules to verify this skill.</p>
                            </div>
                            {/* Description */}
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-blue-500">info</span> About
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Learn to create complex interactive visualizations using D3.js and WebGL. This node covers force-directed graphs, geospatial mapping, and large dataset rendering optimization.
                                </p>
                            </div>
                            {/* Prerequisites */}
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-blue-500">account_tree</span> Prerequisites
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-blue-600/30">
                                        <span className="material-symbols-outlined text-blue-500 text-xl">check_circle</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white">Foundational Literacy</p>
                                            <p className="text-xs text-gray-500">Verified • 2 months ago</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 opacity-70">
                                        <span className="material-symbols-outlined text-gray-500 text-xl">lock_open</span>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-300">Basic JS Logic</p>
                                            <p className="text-xs text-gray-500">Suggested • Optional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Resources */}
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base text-blue-500">library_books</span> Learning Resources
                                </h4>
                                <div className="grid gap-2">
                                    <a className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors group" href="#">
                                        <div className="size-8 rounded bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined text-lg">play_circle</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate group-hover:text-blue-500 transition-colors">Module 4: Graph Theory Intro</p>
                                            <p className="text-xs text-gray-500">Video • 15 mins</p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-600 group-hover:text-white text-sm">open_in_new</span>
                                    </a>
                                    <a className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors group" href="#">
                                        <div className="size-8 rounded bg-white/5 group-hover:bg-white/10 flex items-center justify-center text-blue-500">
                                            <span className="material-symbols-outlined text-lg">article</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white truncate group-hover:text-blue-500 transition-colors">D3.js Documentation Guide</p>
                                            <p className="text-xs text-gray-500">Article • 10 mins read</p>
                                        </div>
                                        <span className="material-symbols-outlined text-gray-600 group-hover:text-white text-sm">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Sidebar Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-black/20">
                            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-[0_0_10px_rgba(19,91,236,0.5),0_0_20px_rgba(19,91,236,0.3)] hover:shadow-[0_0_15px_rgba(19,91,236,0.7),0_0_30px_rgba(19,91,236,0.5)] transition-all">
                                <span className="material-symbols-outlined">play_arrow</span>
                                Resume Learning
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .bg-grid-pattern {
            background-size: 40px 40px;
            background-image: 
                linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
        </div>
    );
}
