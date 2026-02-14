'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LayoutDashboard, Library, RefreshCw, CheckCircle, AlertCircle, RotateCw, FileText, Inbox } from 'lucide-react';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RealDashboard() {
    const [books, setBooks] = useState<any[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        processing: 0,
        completed: 0,
        failed: 0
    });

    useEffect(() => {
        fetchBooks();

        // Realtime subscription
        const channel = supabase
            .channel('processed_books')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'processed_books' },
                () => fetchBooks()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchBooks() {
        const { data, error } = await supabase
            .from('processed_books')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (!error && data) {
            setBooks(data);

            // Calculate stats
            setStats({
                total: data.length,
                processing: data.filter(b => b.processing_status === 'processing').length,
                completed: data.filter(b => b.processing_status === 'completed').length,
                failed: data.filter(b => b.processing_status === 'error').length
            });
        }
    }

    return (
        <div className="p-8 w-full min-h-screen bg-background-dark text-white">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-brand-blue/20 rounded-lg">
                    <LayoutDashboard className="text-brand-blue w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold font-heading">LMS Processing Center</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="text-slate-400 text-sm font-medium mb-1">Total Books</div>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{stats.total}</div>
                    </div>
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Library className="w-16 h-16" />
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-brand-blue/20">
                    <div className="relative z-10">
                        <div className="text-blue-300 text-sm font-medium mb-1">Processing</div>
                        <div className="text-3xl font-bold text-brand-blue">{stats.processing}</div>
                    </div>
                    <div className="absolute right-0 top-0 p-4 opacity-10 text-brand-blue group-hover:opacity-20 transition-opacity">
                        <RefreshCw className="w-16 h-16" />
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-green-500/20">
                    <div className="relative z-10">
                        <div className="text-green-300 text-sm font-medium mb-1">Completed</div>
                        <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
                    </div>
                    <div className="absolute right-0 top-0 p-4 opacity-10 text-green-400 group-hover:opacity-20 transition-opacity">
                        <CheckCircle className="w-16 h-16" />
                    </div>
                </div>
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group border-red-500/20">
                    <div className="relative z-10">
                        <div className="text-red-300 text-sm font-medium mb-1">Failed</div>
                        <div className="text-3xl font-bold text-red-400">{stats.failed}</div>
                    </div>
                    <div className="absolute right-0 top-0 p-4 opacity-10 text-red-400 group-hover:opacity-20 transition-opacity">
                        <AlertCircle className="w-16 h-16" />
                    </div>
                </div>
            </div>

            {/* Books Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Recent Uploads</h3>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white" onClick={fetchBooks}>
                            <RotateCw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">File Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Progress</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Outputs</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-slate-500 w-5 h-5" />
                                            <div className="font-medium text-slate-200">{book.file_name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${book.processing_status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            book.processing_status === 'processing' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20 animate-pulse' :
                                                'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {book.processing_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap w-48">
                                        <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-500 ${book.processing_status === 'completed' ? 'bg-green-500' :
                                                    book.processing_status === 'error' ? 'bg-red-500' : 'bg-brand-blue'
                                                    }`}
                                                style={{ width: `${book.processing_progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-slate-500 text-right">{book.processing_progress}%</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {book.outputs && (
                                            <div className="flex gap-1.5 flex-wrap max-w-xs">
                                                {Object.entries(book.outputs).map(([key, value]: [string, any]) => (
                                                    <span key={key} title={key} className={`px-2 py-0.5 text-[10px] uppercase tracking-wide rounded border ${value.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                                                        }`}>
                                                        {key.substring(0, 3)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                                        {book.processing_time_ms ? `${(book.processing_time_ms / 1000).toFixed(1)}s` : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {books.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <Inbox className="w-10 h-10 mb-2 opacity-50 mx-auto" />
                        <p>No books processed yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
