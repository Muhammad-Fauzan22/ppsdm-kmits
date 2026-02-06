"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CoCreatePage() {
    const [nodes, setNodes] = useState([
        { id: 1, type: "main", text: "Renewable Energy", x: 400, y: 300, color: "bg-card-dark" },
        { id: 2, type: "sub", text: "Solar Infrastructure", x: 150, y: 200, color: "bg-card-dark" },
        { id: 3, type: "sub", text: "Wind Farm Policy", x: 650, y: 400, color: "bg-card-dark" },
    ]);

    const [activeNode, setActiveNode] = useState<number | null>(null);

    // Fake AI Chat
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm ready to help you brainstorm on Renewable Energy. Would you like to generate a mind map or draft an outline first?" },
    ]);

    return (
        <div className="flex h-[calc(100vh-64px)] bg-background-dark text-white font-sans overflow-hidden">

            {/* 1. Header / Toolbar */}
            <header className="absolute top-0 left-0 right-0 h-14 bg-card-dark/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-brand-blue/20 flex items-center justify-center text-brand-blue ring-1 ring-brand-blue/30">
                        <span className="material-symbols-outlined text-sm">hub</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold font-grotesk text-white">Co-Create Canvas</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] text-slate-400">Seno AI Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-xs text-slate-400 hover:text-white transition-colors">File</button>
                    <button className="text-xs text-slate-400 hover:text-white transition-colors">View</button>
                    <button className="text-xs text-slate-400 hover:text-white transition-colors">Export</button>
                    <div className="h-4 w-px bg-white/10"></div>
                    <button className="bg-brand-blue hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all">
                        <span className="material-symbols-outlined text-[14px]">share</span> Share
                    </button>
                    <div className="size-8 rounded-full bg-slate-700 border border-white/10"></div>
                </div>
            </header>

            {/* 2. Main Canvas (Infinite Grid) */}
            <div className="flex-1 relative pt-14 overflow-hidden cursor-grab active:cursor-grabbing bg-background-dark">
                {/* Dot Grid Background */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Nodes Layer */}
                <div className="relative w-full h-full">

                    {/* Connection Lines (SVGs or simplified divs) */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
                        <motion.line
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            x1="400" y1="300" x2="150" y2="200" stroke="#334155" strokeWidth="2" strokeDasharray="5,5"
                        />
                        <motion.line
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            x1="400" y1="300" x2="650" y2="400" stroke="#334155" strokeWidth="2" strokeDasharray="5,5"
                        />
                    </svg>

                    <AnimatePresence>
                        {nodes.map((node, index) => (
                            <motion.div
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.1 }}
                                className={`absolute p-4 rounded-xl border ${node.id === 1
                                    ? 'border-brand-blue shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                                    : 'border-white/10 hover:border-slate-500'
                                    } ${node.color} w-64 cursor-grab z-10 transition-all glass-card`}
                                style={{ left: node.x, top: node.y }}
                                onClick={() => setActiveNode(node.id)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {/* Generative Label for Subs */}
                                {node.type === 'sub' && (
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="material-symbols-outlined text-amber-400 text-[14px]">sparkle</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">GENERATED</span>
                                    </div>
                                )}

                                {/* Icon for Main */}
                                {node.type === 'main' && (
                                    <div className="size-10 rounded-lg bg-brand-blue flex items-center justify-center mb-3 text-white shadow-lg shadow-brand-blue/20">
                                        <span className="material-symbols-outlined">eco</span>
                                    </div>
                                )}

                                <h3 className="text-sm font-bold text-white mb-1">{node.text}</h3>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                    {node.type === 'main'
                                        ? 'Main Focus: Sustainable implementation in developing regions.'
                                        : 'Regulatory frameworks and compliance details for this sector.'}
                                </p>

                                {/* Active State Actions */}
                                {node.id === 1 && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        className="flex gap-2 mt-4 pt-3 border-t border-white/10"
                                    >
                                        <button className="flex-1 bg-brand-blue/10 text-brand-blue text-[10px] py-1.5 rounded hover:bg-brand-blue/20 font-bold transition-colors">Expand</button>
                                        <button className="flex-1 bg-white/5 text-slate-300 text-[10px] py-1.5 rounded hover:bg-white/10 transition-colors">Edit</button>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Sticker / Note */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: -2, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-[500px] left-[350px] bg-yellow-100 text-black w-48 p-3 rounded-lg shadow-xl -rotate-2 font-handwriting text-xs leading-5"
                    >
                        Don&apos;t forget to include the recent case study from East Java!
                    </motion.div>

                </div>

                {/* Floating Toolbar */}
                <motion.div
                    initial={{ y: 50, opacity: 0, x: "-50%" }}
                    animate={{ y: 0, opacity: 1, x: "-50%" }}
                    className="absolute bottom-8 left-1/2 bg-card-dark/90 backdrop-blur-xl p-1.5 rounded-xl border border-white/10 flex items-center gap-1 shadow-2xl z-50"
                >
                    {['arrow_selector_tool', 'text_fields', 'sticky_note_2', 'chat_bubble', 'auto_awesome'].map((icon, i) => (
                        <button key={i} className={`size-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Zoom Controls */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="absolute bottom-8 right-8 flex flex-col gap-1 bg-card-dark/90 backdrop-blur-xl rounded-lg border border-white/10 p-1 z-50"
                >
                    <button className="size-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
                    <div className="h-px bg-white/10 w-full"></div>
                    <button className="size-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                </motion.div>
            </div>

            {/* 3. Right Sidebar (Seno AI) */}
            <aside className="w-80 bg-card-dark/50 border-l border-white/10 flex flex-col z-40 backdrop-blur-md">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-blue">smart_toy</span>
                        <span className="font-bold text-sm text-white">Seno AI Companion</span>
                    </div>
                    <button className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">more_horiz</span></button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {/* AI Message */}
                    <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0 shadow-lg shadow-brand-blue/20">
                            <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                Hello! I&apos;m ready to help you brainstorm on <span className="text-white font-bold">Renewable Energy</span>. Would you like to generate a mind map or draft an outline first?
                            </p>
                            <p className="text-[10px] text-slate-500 mt-2">10:42 AM</p>
                        </div>
                    </div>

                    {/* Insight Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-brand-blue/30 p-3 rounded-xl relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <span className="material-symbols-outlined text-xs">lightbulb</span>
                                <span className="text-[10px] font-bold uppercase">Live Insight</span>
                            </div>
                            <button className="text-slate-500 hover:text-white"><span className="material-symbols-outlined text-xs">close</span></button>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">
                            Since you added &quot;Wind Energy&quot;, consider including a section on <span className="text-white font-bold">noise pollution impact</span> and mitigation strategies.
                        </p>
                        <button className="w-full bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-blue/20">
                            <span className="material-symbols-outlined text-sm">add_circle</span> Add Node
                        </button>
                    </motion.div>

                    {/* User Message */}
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="size-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 ring-2 ring-white/10">
                            <span className="material-symbols-outlined text-white text-xs">person</span>
                        </div>
                        <div className="bg-brand-blue p-3 rounded-2xl rounded-tr-none text-white shadow-lg shadow-brand-blue/10">
                            <p className="text-xs leading-relaxed font-medium">
                                Create a sub-branch for &quot;Micro-Hydro&quot; systems in rural Indonesia.
                            </p>
                            <p className="text-[10px] text-blue-200 mt-2">10:45 AM</p>
                        </div>
                    </div>

                    {/* Loading State */}
                    <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0 bg-opacity-50">
                            <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                        </div>
                        <div className="bg-white/5 px-4 py-3 rounded-full border border-white/10 flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="size-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                <span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                <span className="size-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                            <span className="text-xs text-slate-500">Generating nodes...</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex gap-2 mb-3">
                        {['Summarize Canvas', 'Find Sources', 'Suggest Layout'].map(tag => (
                            <button key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-slate-400 hover:text-white hover:border-brand-blue/50 hover:bg-brand-blue/10 transition-all whitespace-nowrap">
                                {tag}
                            </button>
                        ))}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2 focus-within:ring-1 focus-within:ring-brand-blue/50 transition-all">
                        <textarea
                            className="w-full bg-transparent text-xs text-white placeholder-slate-600 resize-none outline-none p-2 h-16 font-medium"
                            placeholder="Ask Seno to create, refine, or explain..."
                        ></textarea>
                        <div className="flex justify-between items-center px-1 pb-1">
                            <button className="text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">image</span></button>
                            <button className="size-8 bg-brand-blue hover:bg-blue-600 rounded-lg flex items-center justify-center text-white transition-colors shadow-lg shadow-brand-blue/20"><span className="material-symbols-outlined text-sm">send</span></button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
