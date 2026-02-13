'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import InteractiveCard from './InteractiveCard';
import type { KnowledgeItem } from '@/lib/knowledge/types';

const CATEGORIES = [
    { value: 'all', label: 'Semua', icon: '📚' },
    { value: 'formula', label: 'Rumus', icon: '📐' },
    { value: 'material', label: 'Material', icon: '🔩' },
    { value: 'manufacturing', label: 'Manufaktur', icon: '🏭' },
    { value: 'mechatronics', label: 'Mekatronika', icon: '🤖' },
    { value: 'energy', label: 'Energi', icon: '⚡' },
    { value: 'standards', label: 'Standar', icon: '📋' },
    { value: 'industry4', label: 'Industri 4.0', icon: '🌐' },
    { value: 'news', label: 'Berita', icon: '📰' },
];

/**
 * KnowledgeGrid — Main grid view with search, category filters, and pagination.
 */
export default function KnowledgeGrid() {
    const [items, setItems] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const searchTimer = useRef<NodeJS.Timeout>();

    const fetchItems = useCallback(async (p: number, cat: string, q?: string) => {
        setLoading(true);
        try {
            let url: string;
            if (q && q.length >= 2) {
                url = `/api/knowledge/search?q=${encodeURIComponent(q)}&limit=12`;
            } else {
                url = `/api/knowledge?page=${p}&limit=12${cat !== 'all' ? `&category=${cat}` : ''}`;
            }

            const res = await fetch(url);
            const json = await res.json();

            if (json.success) {
                setItems(json.data || []);
                if (json.meta) {
                    setTotalPages(json.meta.totalPages || 1);
                    setTotal(json.meta.total || json.data?.length || 0);
                }
            }
        } catch (err) {
            console.error('Failed to fetch knowledge items:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems(page, category);
    }, [page, category, fetchItems]);

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);

        searchTimer.current = setTimeout(() => {
            setPage(1);
            if (value.length >= 2) {
                fetchItems(1, category, value);
            } else {
                fetchItems(1, category);
            }
        }, 400);
    };

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setPage(1);
        setSearchQuery('');
    };

    return (
        <div>
            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Cari pengetahuan teknik... (misal: CNC, thermodynamics, welding)"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm transition"
                />
                {searchQuery && (
                    <button
                        onClick={() => { setSearchQuery(''); fetchItems(1, category); }}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategoryChange(cat.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${category === cat.value
                                ? 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                                : 'bg-slate-800/50 text-slate-400 border-slate-700/30 hover:bg-slate-700/50'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-slate-500">
                    {total} item pengetahuan
                </p>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 animate-pulse">
                            <div className="h-3 bg-slate-700 rounded w-1/4 mb-3" />
                            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-700 rounded w-full mb-1" />
                            <div className="h-3 bg-slate-700 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                >
                    <span className="text-4xl mb-3 block">🔍</span>
                    <h3 className="text-lg font-semibold text-white mb-1">Tidak ditemukan</h3>
                    <p className="text-slate-400 text-sm">Coba kata kunci lain atau pilih kategori berbeda</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, i) => (
                        <InteractiveCard key={item.id} item={item} index={i} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !searchQuery && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700/50 rounded-lg disabled:opacity-30 text-slate-300 hover:bg-slate-700 transition"
                    >
                        ← Sebelumnya
                    </button>
                    <span className="text-xs text-slate-500">
                        Halaman {page} dari {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1.5 text-sm bg-slate-800 border border-slate-700/50 rounded-lg disabled:opacity-30 text-slate-300 hover:bg-slate-700 transition"
                    >
                        Selanjutnya →
                    </button>
                </div>
            )}
        </div>
    );
}
