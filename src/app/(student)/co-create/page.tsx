"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

export default function CoCreatePage() {
    const [nodes, setNodes] = useState([
        { id: 1, type: "main", text: "Renewable Energy", x: 400, y: 300, color: "bg-[#1E1E2E]" },
        { id: 2, type: "sub", text: "Solar Infrastructure", x: 150, y: 200, color: "bg-[#1E1E2E]" },
        { id: 3, type: "sub", text: "Wind Farm Policy", x: 650, y: 400, color: "bg-[#1E1E2E]" },
    ]);

    const [activeNode, setActiveNode] = useState<number | null>(null);

    // Fake AI Chat
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm ready to help you brainstorm on Renewable Energy. Would you like to generate a mind map or draft an outline first?" },
    ]);

    return (
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">

            {/* 1. Header */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-[#0A0A0A] border-b border-[#222] flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-blue-700 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">hub</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold">PPSDM KMM | Co-Create</h1>
                        <div className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-green-500"></span>
                            <span className="text-[10px] text-gray-400">Seno AI Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-xs text-gray-400 hover:text-white">File</button>
                    <button className="text-xs text-gray-400 hover:text-white">View</button>
                    <button className="text-xs text-gray-400 hover:text-white">Export</button>
                    <div className="h-4 w-px bg-[#333]"></div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">share</span> Share
                    </button>
                    <div className="size-8 rounded-full bg-gray-700 border border-gray-600"></div>
                </div>
            </header>

            {/* 2. Main Canvas (Infinite Grid) */}
            <main className="flex-1 relative pt-14 overflow-hidden cursor-grab active:cursor-grabbing bg-[#050505]">
                {/* Dot Grid Background */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Nodes Layer */}
                <div className="relative w-full h-full">

                    {/* Connection Lines (SVGs or simplified divs) */}
                    <svg className="absolute inset-0 pointer-events-none w-full h-full z-0 overflow-visible">
                        <line x1="400" y1="300" x2="150" y2="200" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                        <line x1="400" y1="300" x2="650" y2="400" stroke="#333" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>

                    {nodes.map((node) => (
                        <div
                            key={node.id}
                            className={`absolute p-4 rounded-xl border ${node.id === 1
                                    ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]'
                                    : 'border-[#333] hover:border-gray-500'
                                } ${node.color} w-64 cursor-grab z-10 transition-all`}
                            style={{ left: node.x, top: node.y }}
                            onClick={() => setActiveNode(node.id)}
                        >
                            {/* Generative Label for Subs */}
                            {node.type === 'sub' && (
                                <div className="flex items-center gap-1 mb-2">
                                    <span className="material-symbols-outlined text-yellow-500 text-[14px]">sparkle</span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">GENERATED</span>
                                </div>
                            )}

                            {/* Icon for Main */}
                            {node.type === 'main' && (
                                <div className="size-10 rounded-lg bg-blue-600 flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-white">eco</span>
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-white mb-1">{node.text}</h3>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                {node.type === 'main'
                                    ? 'Main Focus: Sustainable implementation in developing regions.'
                                    : 'Regulatory frameworks and compliance details for this sector.'}
                            </p>

                            {/* Active State Actions */}
                            {node.id === 1 && (
                                <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                                    <button className="flex-1 bg-blue-600/20 text-blue-400 text-[10px] py-1 rounded hover:bg-blue-600/30 font-bold">Expand</button>
                                    <button className="flex-1 bg-white/5 text-gray-300 text-[10px] py-1 rounded hover:bg-white/10">Edit</button>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Sticker / Note */}
                    <div className="absolute top-[500px] left-[350px] bg-[#FFF9C4] text-black w-48 p-3 rounded-lg shadow-xl -rotate-2 font-handwriting text-xs leading-5">
                        Don't forget to include the recent case study from East Java!
                    </div>

                </div>

                {/* Floating Toolbar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] p-1.5 rounded-xl border border-[#333] flex items-center gap-1 shadow-2xl">
                    {['arrow_selector_tool', 'text_fields', 'sticky_note_2', 'chat_bubble', 'auto_awesome'].map((icon, i) => (
                        <button key={i} className={`size-9 rounded-lg flex items-center justify-center hover:bg-[#333] transition-colors ${i === 0 ? 'bg-white/10 text-white' : 'text-gray-400'}`}>
                            <span className="material-symbols-outlined text-[20px]">{icon}</span>
                        </button>
                    ))}
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-8 right-8 flex flex-col gap-1 bg-[#1A1A1A] rounded-lg border border-[#333] p-1">
                    <button className="size-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] rounded"><span className="material-symbols-outlined text-sm">add</span></button>
                    <div className="h-px bg-[#333] w-full"></div>
                    <button className="size-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333] rounded"><span className="material-symbols-outlined text-sm">remove</span></button>
                </div>
            </main>

            {/* 3. Right Sidebar (Seno AI) */}
            <aside className="w-80 bg-[#0A0A0A] border-l border-[#222] flex flex-col">
                <div className="p-4 border-b border-[#222] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-500">smart_toy</span>
                        <span className="font-bold text-sm">Seno AI Companion</span>
                    </div>
                    <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-sm">more_horiz</span></button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {/* AI Message */}
                    <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                        </div>
                        <div className="bg-[#1A1A1A] p-3 rounded-2xl rounded-tl-none border border-[#333]">
                            <p className="text-xs text-gray-300 leading-relaxed">
                                Hello! I'm ready to help you brainstorm on <span className="text-white font-bold">Renewable Energy</span>. Would you like to generate a mind map or draft an outline first?
                            </p>
                            <p className="text-[10px] text-gray-600 mt-2">10:42 AM</p>
                        </div>
                    </div>

                    {/* Insight Card */}
                    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 p-3 rounded-xl relative overflow-hidden">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <span className="material-symbols-outlined text-xs">lightbulb</span>
                                <span className="text-[10px] font-bold uppercase">Live Insight</span>
                            </div>
                            <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-xs">close</span></button>
                        </div>
                        <p className="text-xs text-gray-300 mb-3">
                            Since you added "Wind Energy", consider including a section on <span className="text-white font-bold">noise pollution impact</span> and mitigation strategies.
                        </p>
                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-sm">add_circle</span> Add Node
                        </button>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-xs">person</span>
                        </div>
                        <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none text-white">
                            <p className="text-xs leading-relaxed">
                                Create a sub-branch for "Micro-Hydro" systems in rural Indonesia.
                            </p>
                            <p className="text-[10px] text-blue-200 mt-2">10:45 AM</p>
                        </div>
                    </div>

                    {/* Loading State */}
                    <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-xs">smart_toy</span>
                        </div>
                        <div className="bg-[#1A1A1A] px-4 py-3 rounded-full border border-[#333] flex items-center gap-2">
                            <div className="flex gap-1">
                                <span className="size-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="size-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                <span className="size-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                            <span className="text-xs text-gray-500">Generating nodes...</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[#222]">
                    <div className="flex gap-2 mb-3">
                        {['Summarize Canvas', 'Find Sources', 'Suggest Layout'].map(tag => (
                            <button key={tag} className="px-3 py-1 bg-[#1A1A1A] border border-[#333] rounded-full text-[10px] text-gray-400 hover:text-white hover:border-gray-500 transition-colors whitespace-nowrap">
                                {tag}
                            </button>
                        ))}
                    </div>
                    <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-2">
                        <textarea
                            className="w-full bg-transparent text-xs text-white placeholder-gray-600 resize-none outline-none p-2 h-16"
                            placeholder="Ask Seno to create, refine, or explain..."
                        ></textarea>
                        <div className="flex justify-between items-center px-1 pb-1">
                            <button className="text-gray-500 hover:text-white"><span className="material-symbols-outlined text-sm">image</span></button>
                            <button className="size-8 bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">send</span></button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
