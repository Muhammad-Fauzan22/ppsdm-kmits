
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, CheckCircle, Loader2, RefreshCw } from "lucide-react";

export default function BooksPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [scanning, setScanning] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
        if (data) setBooks(data);
    };

    const scanDrive = async () => {
        setScanning(true);
        try {
            const res = await fetch("/api/library/scan", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                alert(`Scanned ${data.scanned} files. Found ${data.new} new.`);
                fetchBooks();
            } else {
                alert("Scan failed: " + data.error);
            }
        } catch (e) {
            alert("Scan error");
        } finally {
            setScanning(false);
        }
    };

    const processBook = async (id: string) => {
        setProcessing(id);
        try {
            const res = await fetch("/api/library/process", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: id }),
            });
            const data = await res.json();
            if (data.success) {
                // Optimistic update
                setBooks(books.map(b => b.id === id ? { ...b, processing_status: 'completed' } : b));
            } else {
                alert("Processing failed: " + data.error);
            }
        } catch (e) {
            alert("Error processing book");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="space-y-6 container py-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Library Books</h2>
                    <p className="text-muted-foreground">Manage and process your digital library.</p>
                </div>
                <Button onClick={scanDrive} disabled={scanning}>
                    {scanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Scan Drive
                </Button>
            </div>

            <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-4 font-medium text-sm">
                    <div className="col-span-4">Title</div>
                    <div className="col-span-2">Author</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                {books.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No books found. Scan Drive to begin.</div>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className="grid grid-cols-12 items-center border-b p-4 text-sm hover:bg-muted/50 transition-colors">
                            <div className="col-span-4 font-medium flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="truncate">{book.title || book.original_filename}</span>
                            </div>
                            <div className="col-span-2 truncate text-muted-foreground">{book.authors?.[0] || "-"}</div>
                            <div className="col-span-2 text-muted-foreground">{new Date(book.created_at).toLocaleDateString()}</div>
                            <div className="col-span-2">
                                <Badge variant={
                                    book.processing_status === 'completed' ? 'success' :
                                        book.processing_status === 'processing' ? 'default' :
                                            book.processing_status === 'failed' ? 'destructive' : 'secondary'
                                }>
                                    {book.processing_status}
                                </Badge>
                            </div>
                            <div className="col-span-2 text-right">
                                {book.processing_status !== 'completed' && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        disabled={processing === book.id || book.processing_status === 'processing'}
                                        onClick={() => processBook(book.id)}
                                    >
                                        {processing === book.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 text-green-600" />}
                                        <span className="sr-only">Process</span>
                                    </Button>
                                )}
                                {book.processing_status === 'completed' && (
                                    <Button size="sm" variant="ghost" disabled>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
