"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    getAllFreeContent,
    searchContent,
    getContentByDimension,
    FREE_COURSE_PROVIDERS,
    LearningContent,
} from "@/lib/freeContent";

export default function FreeResourcesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDimension, setSelectedDimension] = useState<string>('all');

    const allContent = getAllFreeContent();

    const filteredContent = searchQuery
        ? searchContent(searchQuery)
        : selectedDimension === 'all'
            ? allContent
            : getContentByDimension(selectedDimension);

    const dimensions = [
        { id: 'all', name: 'Semua', icon: '📚' },
        { id: 'cognitive', name: 'Cognitive', icon: '🧠' },
        { id: 'financial', name: 'Financial', icon: '💰' },
        { id: 'emotional_intelligence', name: 'Emotional', icon: '💚' },
        { id: 'mental_health', name: 'Mental', icon: '🧘' },
        { id: 'physical_health', name: 'Physical', icon: '💪' },
        { id: 'character_ethics', name: 'Character', icon: '⚔️' },
        { id: 'spiritual', name: 'Spiritual', icon: '🕊️' },
        { id: 'environmental', name: 'Environmental', icon: '🌍' },
    ];

    const typeIcons: Record<string, string> = {
        video: '🎬',
        article: '📄',
        course: '🎓',
        book: '📖',
        interactive: '🎮',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                🆓 Free Learning Resources
                            </h1>
                            <p className="text-green-100 mt-1">100% gratis dari Coursera, edX, Khan Academy & lebih</p>
                        </div>
                        <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-6 grid grid-cols-4 gap-4">
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{allContent.length}+</div>
                            <div className="text-green-200 text-sm">Free Resources</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">{Object.keys(FREE_COURSE_PROVIDERS).length}</div>
                            <div className="text-green-200 text-sm">Providers</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">9</div>
                            <div className="text-green-200 text-sm">Dimensions</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold">$0</div>
                            <div className="text-green-200 text-sm">Cost / Month</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Provider Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(FREE_COURSE_PROVIDERS).map(([key, provider]) => (
                        <span
                            key={key}
                            className="bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100"
                        >
                            {provider.name} <span className="text-green-600">(Free)</span>
                        </span>
                    ))}
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Cari resource gratis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {dimensions.map(dim => (
                            <button
                                key={dim.id}
                                onClick={() => {
                                    setSelectedDimension(dim.id);
                                    setSearchQuery('');
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition ${selectedDimension === dim.id
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span>{dim.icon}</span>
                                <span>{dim.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContent.map((content, index) => (
                        <motion.a
                            key={content.id}
                            href={content.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                        >
                            {/* Header */}
                            <div className="h-16 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-between px-5">
                                <span className="text-3xl">{typeIcons[content.type] || '📄'}</span>
                                <span className="bg-white/20 px-2 py-1 rounded text-white text-xs">
                                    {content.provider}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition line-clamp-2">
                                    {content.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {content.description}
                                </p>

                                <div className="flex items-center gap-2 mt-4">
                                    {content.duration && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            ⏱️ {content.duration}
                                        </span>
                                    )}
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                        🆓 FREE
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        {content.language === 'id' ? '🇮🇩' : content.language === 'en' ? '🇺🇸' : '🌐'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-1 mt-3">
                                    {content.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs text-gray-500">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {filteredContent.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">🔍</div>
                        <p>Tidak ditemukan resource</p>
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white text-center">
                    <h2 className="text-2xl font-bold">Belajar Gratis, Tumbuh Tanpa Batas 🚀</h2>
                    <p className="text-green-100 mt-2">
                        Semua resource di atas 100% gratis. Gunakan mode audit di Coursera/edX untuk akses penuh.
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                        <Link
                            href="/ai-tutor"
                            className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition"
                        >
                            🤖 Ask AI Tutor
                        </Link>
                        <Link
                            href="/learning-paths"
                            className="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition"
                        >
                            📚 Learning Paths
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
