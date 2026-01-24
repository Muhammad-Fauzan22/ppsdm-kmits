'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Search, BookOpen, Filter, Loader2, Sparkles, TrendingUp, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Types
type Book = {
    id: string;
    title: string;
    author: string;
    category: string;
    cover_url: string | null;
    description: string;
    page_count: number;
    created_at: string;
};

export default function LibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        fetchBooks();
    }, []);

    async function fetchBooks() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setBooks(data);
                const uniqueCats = Array.from(new Set(data.map((b: Book) => b.category || 'Uncategorized')));
                setCategories(['All', ...uniqueCats]);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
                {/* HERO SECTION */}
                <header className="mb-16 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-100 dark:border-indigo-800">
                            <Sparkles className="w-3 h-3" /> PPSDM Knowledge Hub
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-2">
                            Discover. Learn. <br />
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                Elevate Potential.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Akses ribuan wawasan dari koleksi buku terpilih untuk pengembangan diri dan profesional Anda di PPSDM.
                        </p>
                    </motion.div>

                    {/* SEARCH BAR (Floating Glass) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative flex items-center bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2">
                            <Search className="w-6 h-6 text-slate-400 ml-3" />
                            <input
                                type="text"
                                placeholder="Cari judul buku, penulis, atau topik..."
                                className="w-full bg-transparent border-none focus:ring-0 text-lg px-4 py-2 placeholder:text-slate-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="pr-2">
                                <kbd className="hidden md:inline-flex h-8 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* FILTERS & STATS */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                    <div className="flex gap-2 overflow-x-auto pb-2 max-w-full no-scrollbar mask-gradient-x">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${selectedCategory === cat
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-105'
                                        : 'bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900/50 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <AnimatePresence mode='wait'>
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col justify-center items-center h-64"
                        >
                            <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                            <p className="text-slate-500 text-sm animate-pulse">Memuat koleksi...</p>
                        </motion.div>
                    ) : filteredBooks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800"
                        >
                            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Tidak ada buku ditemukan</h3>
                            <p className="text-slate-500">Coba kata kunci lain atau ubah filter kategori Anda.</p>
                        </motion.div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' : 'grid-cols-1'}`}>
                            {filteredBooks.map((book, i) => (
                                <BookCard key={book.id} book={book} index={i} viewMode={viewMode} />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function BookCard({ book, index, viewMode }: { book: Book, index: number, viewMode: 'grid' | 'list' }) {
    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group flex gap-6 bg-white dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
            >
                <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md transform group-hover:scale-105 transition-transform duration-500">
                    {book.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <BookOpen className="w-8 h-8" />
                        </div>
                    )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">
                                {book.category || 'General'}
                            </span>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                {book.title}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-3">{book.author}</p>
                        </div>
                        <div className="hidden md:block">
                            <Link href={`/perpustakaan/${book.id}`} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:scale-105 transition-transform">
                                Baca
                            </Link>
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 max-w-2xl">
                        {book.description || "Tidak ada deskripsi tersedia untuk buku ini."}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {book.page_count} Halaman</span>
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Populer</span>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -8 }}
            className="group relative bg-white dark:bg-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
        >
            {/* Image Container with Dynamic Shadow */}
            <div className="aspect-[2/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                {book.cover_url ? (
                    <>
                        {/* Blur Backlayer for Glow Effect */}
                        <div
                            className="absolute -inset-4 bg-cover bg-center blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                            style={{ backgroundImage: `url(${book.cover_url})` }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={book.cover_url}
                            alt={book.title}
                            className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/50">
                        <BookOpen className="w-12 h-12 mb-3 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{book.category}</span>
                    </div>
                )}

                {/* Modern Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 z-20" />

                {/* Floating Action Button */}
                <div className="absolute bottom-4 right-4 z-30 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link
                        href={`/perpustakaan/${book.id}`}
                        className="flex items-center justify-center w-10 h-10 bg-white text-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        <BookOpen className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Content Info */}
            <div className="relative p-5 z-20 -mt-12 group-hover:-mt-16 transition-all duration-300">
                <span className="inline-block px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-bold uppercase tracking-wider mb-2 border border-white/10">
                    {book.category || 'General'}
                </span>
                <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 mb-1 group-hover:text-indigo-200 transition-colors" title={book.title}>
                    {book.title}
                </h3>
                <p className="text-sm text-slate-300 line-clamp-1 group-hover:text-white transition-colors">{book.author}</p>

                {/* Expanded Info on Hover */}
                <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-300">
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-300/80">
                        <span>{book.page_count} Pages</span>
                        <span>{new Date(book.created_at).getFullYear()}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
