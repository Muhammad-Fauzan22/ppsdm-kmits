'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ReaderPage() {
    const { id } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function getBook() {
            if (!id) return;
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setBook(data);
            setLoading(false);
        }
        getBook();
    }, [id]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <span className="ml-3 font-medium">Memuat Buku...</span>
        </div>
    );

    if (!book || !book.drive_url) return notFound();

    // Convert generic Drive URL to Embed URL (preview)
    // Ensure we use the /preview endpoint for embeddability
    const embedUrl = book.drive_url.replace('/view', '/preview').replace('/edit', '/preview');

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden relative">

            {/* Top Bar - Distraction Free */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md z-10 shrink-0 h-16">
                <div className="flex items-center gap-4">
                    <Link href={`/perpustakaan/${id}`} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-bold text-sm md:text-base line-clamp-1">{book.title}</h1>
                        <p className="text-xs text-slate-400 hidden md:block">{book.author}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <a href={book.drive_url} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors">
                        Buka di Drive <ArrowUpRight size={12} />
                    </a>
                </div>
            </div>

            {/* Main Reader Area */}
            <div className="flex-1 bg-black w-full h-full relative">
                <iframe
                    src={embedUrl}
                    className="w-full h-full border-0 absolute inset-0"
                    allow="autoplay"
                    title={book.title}
                ></iframe>
            </div>

        </div>
    );
}
