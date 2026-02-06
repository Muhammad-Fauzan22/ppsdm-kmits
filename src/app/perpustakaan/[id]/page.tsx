'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, BookOpen, Clock, Calendar, Share2, Download, AlertCircle, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type BookDetail = {
    id: string;
    title: string;
    author: string;
    category: string;
    cover_url: string | null;
    file_url: string | null;
    description: string;
    page_count: number;
    created_at: string;
    publisher?: string;
    year?: number;
};

export default function BookReaderPage() {
    const params = useParams();
    const [book, setBook] = useState<BookDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (params?.id) {
            fetchBookDetail(params.id as string);
        }
    }, [params]);

    async function fetchBookDetail(id: string) {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setBook(data);
        } catch (error) {
            console.error('Error fetching book:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-48 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
                <AlertCircle className="w-12 h-12 mb-4" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Buku tidak ditemukan</h2>
                <Link href="/perpustakaan" className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium">
                    Kembali ke Perpustakaan
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* BACK NAVIGATION */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link
                        href="/perpustakaan"
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded">
                            {book.category || 'General'}
                        </span>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: Metadata & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Book Cover */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
                        >
                            {book.cover_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                                    <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                                    <span className="text-sm font-bold uppercase tracking-widest">{book.category}</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Title & Author */}
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                                {book.title}
                            </h1>
                            <p className="text-xl text-indigo-600 dark:text-indigo-400 font-medium mb-6">
                                {book.author}
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Halaman</div>
                                        <div className="font-semibold">{book.page_count || '-'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tahun</div>
                                        <div className="font-semibold">{book.year || new Date(book.created_at).getFullYear()}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            {book.file_url && (
                                <a
                                    href={book.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:scale-[1.02] transition-all"
                                >
                                    <Download className="w-5 h-5" /> Download PDF
                                </a>
                            )}
                            <button className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                <Share2 className="w-5 h-5" /> Bagikan
                            </button>
                        </div>

                        {/* AI Summary Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 border border-indigo-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                                <Quote className="w-5 h-5" />
                                <h3 className="font-bold text-sm uppercase tracking-wider">AI Summary</h3>
                            </div>
                            <div className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
                                {book.description ? (
                                    // Render markdown if available, or plain text
                                    <p>{book.description}</p>
                                ) : (
                                    <p className="italic text-slate-400">Belum ada ringkasan AI untuk buku ini.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Reader */}
                    <div className="lg:col-span-8">
                        <div className="bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner h-[800px] relative">
                            {book.file_url ? (
                                <iframe
                                    src={book.file_url.replace('/view', '/preview')}
                                    className="w-full h-full border-0"
                                    allow="autoplay"
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <p>File PDF tidak tersedia untuk pratinjau</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
