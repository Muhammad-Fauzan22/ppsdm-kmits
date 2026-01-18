"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createPPSDMKnowledgeGraph, searchNodes, KnowledgeNode } from "@/lib/knowledgeGraph";

// Initialize knowledge graph
const knowledgeGraph = createPPSDMKnowledgeGraph();

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [searchResults, setSearchResults] = useState<KnowledgeNode[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const allNodes = Array.from(knowledgeGraph.nodes.values());

    const types = [
        { id: 'all', name: 'Semua', icon: '📚' },
        { id: 'competency', name: 'Competencies', icon: '🎯' },
        { id: 'concept', name: 'Concepts', icon: '💡' },
        { id: 'skill', name: 'Skills', icon: '⚡' },
        { id: 'resource', name: 'Resources', icon: '📖' },
    ];

    const handleSearch = () => {
        const type = selectedType === 'all' ? undefined : selectedType as KnowledgeNode['type'];
        const results = searchNodes(knowledgeGraph, searchQuery, type);
        setSearchResults(results);
        setHasSearched(true);
    };

    const displayNodes = hasSearched ? searchResults : allNodes.filter(n =>
        selectedType === 'all' || n.type === selectedType
    );

    const typeIcons: Record<string, string> = {
        competency: '🎯',
        concept: '💡',
        skill: '⚡',
        resource: '📖',
        person: '👤',
        project: '🔧',
    };

    const typeColors: Record<string, string> = {
        competency: 'from-purple-500 to-indigo-600',
        concept: 'from-blue-500 to-cyan-600',
        skill: 'from-green-500 to-teal-600',
        resource: 'from-orange-500 to-red-600',
        person: 'from-pink-500 to-rose-600',
        project: 'from-gray-500 to-slate-600',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📚 Knowledge Base
                            </h1>
                            <p className="text-slate-300 mt-1">Explore concepts, skills, and resources</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-4 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{allNodes.length}</div>
                            <div className="text-slate-300 text-sm">Total Nodes</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{allNodes.filter(n => n.type === 'competency').length}</div>
                            <div className="text-slate-300 text-sm">Competencies</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{allNodes.filter(n => n.type === 'concept').length}</div>
                            <div className="text-slate-300 text-sm">Concepts</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{knowledgeGraph.edges.length}</div>
                            <div className="text-slate-300 text-sm">Connections</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Search & Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Cari knowledge..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                        >
                            Search
                        </button>
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {types.map(type => (
                            <button
                                key={type.id}
                                onClick={() => {
                                    setSelectedType(type.id);
                                    setHasSearched(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${selectedType === type.id
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{type.icon}</span>
                                <span>{type.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Knowledge Graph Visualization (Simplified) */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🔗 Knowledge Graph</h2>
                    <div className="h-64 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {/* Simple visualization */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {/* Center node */}
                            <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                                PPSDM
                            </div>

                            {/* Surrounding nodes */}
                            {allNodes.filter(n => n.type === 'competency').slice(0, 9).map((node, i) => {
                                const angle = (i / 9) * 2 * Math.PI - Math.PI / 2;
                                const radius = 100;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;

                                return (
                                    <div
                                        key={node.id}
                                        className="absolute w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs shadow"
                                        style={{
                                            transform: `translate(${x}px, ${y}px)`,
                                        }}
                                    >
                                        {node.title.slice(0, 3)}
                                    </div>
                                );
                            })}

                            {/* Connection lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {allNodes.filter(n => n.type === 'competency').slice(0, 9).map((node, i) => {
                                    const angle = (i / 9) * 2 * Math.PI - Math.PI / 2;
                                    const radius = 100;
                                    const centerX = 50;
                                    const centerY = 50;
                                    const x = centerX + Math.cos(angle) * radius / 5;
                                    const y = centerY + Math.sin(angle) * radius / 5;

                                    return (
                                        <line
                                            key={node.id}
                                            x1="50%"
                                            y1="50%"
                                            x2={`${x}%`}
                                            y2={`${y}%`}
                                            stroke="#6366f1"
                                            strokeWidth="2"
                                            strokeOpacity="0.3"
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Knowledge Nodes Grid */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    {hasSearched ? `Search Results (${displayNodes.length})` : 'All Knowledge'}
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayNodes.map((node, index) => (
                        <motion.div
                            key={node.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                        >
                            <div className={`h-16 bg-gradient-to-r ${typeColors[node.type] || 'from-gray-500 to-gray-600'} flex items-center gap-3 px-5 text-white`}>
                                <span className="text-3xl">{typeIcons[node.type] || '📄'}</span>
                                <span className="text-sm uppercase tracking-wide opacity-80">{node.type}</span>
                            </div>

                            <div className="p-5">
                                <h3 className="font-bold text-gray-800">{node.title}</h3>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{node.description}</p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {node.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                    <span>👁️ {node.viewCount} views</span>
                                    <span>⭐ {node.qualityScore}%</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {displayNodes.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">🔍</div>
                        <p>Tidak ditemukan hasil</p>
                    </div>
                )}

                {/* Add Knowledge CTA */}
                <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <h2 className="text-2xl font-bold">Kontribusi Knowledge Baru</h2>
                    <p className="text-indigo-100 mt-2">Bagikan pengetahuan dan pengalamanmu untuk membantu mahasiswa lain</p>
                    <button className="mt-4 bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition">
                        ➕ Add New Knowledge
                    </button>
                </div>
            </main>
        </div>
    );
}
