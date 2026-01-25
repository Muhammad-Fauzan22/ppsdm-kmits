'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchBooks() {
        try {
            // Use environment variables or fallback
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hyszrracdysqgyfpwflu.supabase.co';
            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jdFxbjWbuitaWjblDEnKbA_04MrSCjr';

            const response = await fetch(`${supabaseUrl}/rest/v1/processed_books?select=*&order=created_at.desc`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            const data = await response.json();
            setBooks(data || []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBooks();
        const interval = setInterval(fetchBooks, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold mb-6">📚 BUKA BUKU - Simple Dashboard</h1>

            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h2 className="font-bold text-blue-800 mb-2">Status Sistem</h2>
                <p>✅ Google Apps Script: Running</p>
                <p>✅ API Endpoint: <code>/api/process</code></p>
                <p>✅ Supabase Database: Connected</p>
                <p className="mt-2 text-sm">Upload PDF ke Google Drive untuk memulai processing</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Daftar Buku Diproses ({books.length})</h2>
                    <button
                        onClick={fetchBooks}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Memuat data...</p>
                    </div>
                ) : books.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Belum ada buku diproses. Upload PDF ke Google Drive folder.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {books.map((book) => (
                            <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{book.file_name}</h3>
                                        <p className="text-sm text-gray-600">ID: {book.file_id}</p>
                                        <p className="text-sm text-gray-600">
                                            Status: <span className={`font-semibold ${book.status === 'COMPLETED' ? 'text-green-600' :
                                                    book.status === 'PROCESSING' || book.status === 'QUEUED' ? 'text-yellow-600' :
                                                        'text-red-600'
                                                }`}>{book.status}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {new Date(book.created_at).toLocaleString('id-ID')}
                                        </p>
                                        {book.processing_time && (
                                            <p className="text-sm text-gray-600">
                                                {Math.round(book.processing_time / 1000)} detik
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {book.summary && (
                                    <div className="mt-3 pt-3 border-t">
                                        <h4 className="font-semibold text-gray-800 mb-1">Ringkasan:</h4>
                                        <p className="text-gray-600 text-sm">
                                            {typeof book.summary === 'object'
                                                ? JSON.stringify(book.summary).substring(0, 200) + '...'
                                                : String(book.summary).substring(0, 200) + '...'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Sistem BUKA BUKU • API: /api/process • Auto-refresh setiap 10 detik</p>
            </div>
        </div>
    );
}
