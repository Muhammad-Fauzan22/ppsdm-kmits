"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { curatedFreeResources, FreeResource } from "@/lib/freeResources";

const sourceColors: Record<string, string> = {
    khan_academy: 'bg-green-500',
    youtube: 'bg-red-500',
    coursera: 'bg-blue-600',
    freecodecamp: 'bg-purple-600',
    mit_ocw: 'bg-red-700',
    indonesiax: 'bg-orange-500',
    rumah_belajar: 'bg-teal-500',
};

const typeIcons: Record<string, string> = {
    video: '🎬',
    course: '📚',
    article: '📄',
    interactive: '🎮',
    quiz: '📝',
};

export default function ResourcesPage() {
    const [filter, setFilter] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [language, setLanguage] = useState<'both' | 'id' | 'en'>('both');
    const [resources, setResources] = useState<FreeResource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResources() {
            setLoading(true);
            try {
                // Construct query params
                const params = new URLSearchParams();
                if (filter !== 'all') params.append('dimension', filter);
                if (language !== 'both') params.append('language', language);
                if (search) params.append('q', search);

                const res = await fetch(`/api/resources?${params.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setResources(data.resources);
                }
            } catch (error) {
                console.error("Failed to fetch resources", error);
                setResources(curatedFreeResources); // Fallback
            } finally {
                setLoading(false);
            }
        }

        const timeoutId = setTimeout(fetchResources, 300);
        return () => clearTimeout(timeoutId);
    }, [filter, search, language]);

    const dimensions = [
        { id: 'all', name: 'Semua', icon: '📋' },
        { id: 'cognitive', name: 'Kognitif', icon: '🧠' },
        { id: 'emotional', name: 'Emosional', icon: '💚' },
        { id: 'social', name: 'Sosial', icon: '👥' },
        { id: 'physical', name: 'Fisik', icon: '💪' },
        { id: 'financial', name: 'Finansial', icon: '💰' },
        { id: 'character', name: 'Karakter', icon: '⭐' },
        { id: 'spiritual', name: 'Spiritual', icon: '🕊️' },
        { id: 'environmental', name: 'Lingkungan', icon: '🌿' },
        { id: 'career', name: 'Karir', icon: '💼' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)] text-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">📚 Free Learning Resources</h1>
                            <p className="text-blue-100 mt-1">
                                {loading ? 'Memuat...' : `${resources.length} materi gratis dari sumber terpercaya`}
                            </p>
                        </div>
                        <Link href="/dashboard" className="px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition">
                            ← Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 space-y-4">
                    {/* Search */}
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Cari resource..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[var(--its-blue)] focus:border-transparent"
                        />
                    </div>

                    {/* Dimension Pills */}
                    <div className="flex flex-wrap gap-2">
                        {dimensions.map((dim) => (
                            <button
                                key={dim.id}
                                onClick={() => setFilter(dim.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === dim.id
                                    ? 'bg-[var(--its-blue)] text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {dim.icon} {dim.name}
                            </button>
                        ))}
                    </div>

                    {/* Language Toggle */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Bahasa:</span>
                        {(['both', 'id', 'en'] as const).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-3 py-1 rounded-lg text-sm ${language === lang ? 'bg-[var(--its-blue)] text-white' : 'bg-gray-100'
                                    }`}
                            >
                                {lang === 'both' ? '🌐 Semua' : lang === 'id' ? '🇮🇩 Indonesia' : '🇬🇧 English'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resources Grid */}
            <main className="max-w-6xl mx-auto px-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resources.map((resource, index) => (
                                <motion.a
                                    key={resource.id}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group relative"
                                >
                                    {/* Thumbnail */}
                                    <div className={`h-32 ${sourceColors[resource.source] || 'bg-gray-400'} flex items-center justify-center`}>
                                        <span className="text-6xl opacity-50">{typeIcons[resource.type] || '📄'}</span>
                                    </div>

                                    {/* Quantum Badge */}
                                    {(resource as any).is_quantum_recommended && (
                                        <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                            ✨ High Match {Math.round((resource as any).match_score * 100)}%
                                        </div>
                                    )}

                                    <div className="p-4">
                                        {/* Source & Type */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-500 uppercase">
                                                {resource.source.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                {resource.language === 'id' ? '🇮🇩' : '🇬🇧'} {resource.type}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="font-semibold text-gray-800 group-hover:text-[var(--its-blue)] transition line-clamp-2">
                                            {resource.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                            {resource.description}
                                        </p>

                                        {/* Meta */}
                                        <div className="flex items-center justify-between mt-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <span>⏱️</span>
                                                <span>{resource.duration_minutes} menit</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <span>⭐</span>
                                                <span>{resource.rating.toFixed(1)}</span>
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {resource.skills.slice(0, 3).map((skill) => (
                                                <span key={skill} className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Free Badge */}
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                ✅ 100% Gratis
                                            </span>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {resources.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-gray-700">Tidak ada hasil</h3>
                                <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex justify-around">
                        {[
                            { href: '/dashboard', icon: '🏠', label: 'Home' },
                            { href: '/gap-analysis', icon: '📊', label: 'Gap' },
                            { href: '/learning-resources', icon: '📚', label: 'Resources', active: true },
                            { href: '/profile', icon: '👤', label: 'Profile' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center ${item.active ? 'text-[var(--its-blue)]' : 'text-gray-500'}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
