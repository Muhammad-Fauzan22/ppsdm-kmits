"use client";

import { useEffect, useState } from "react";
import { BookOpen, Brain, Sparkles, Workflow, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/library/StatCard";
import { createClient } from "@/lib/supabase/client"; // Use standard client
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function LibraryDashboard() {
    const [stats, setStats] = useState({
        totalResources: 0,
        aiGenerated: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
    });

    const [recentBooks, setRecentBooks] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        fetchStats();
        // Polling setiap 5 detik untuk melihat update Real-time dari Orchestrator
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        // 1. Ambil Statistik dari tabel 'learning_resources'
        const [all, completed, pending, processing, failed] = await Promise.all([
            supabase.from("learning_resources").select("id", { count: "exact", head: true }),
            supabase.from("learning_resources").select("id", { count: "exact", head: true }).eq("processing_status", "completed"),
            supabase.from("learning_resources").select("id", { count: "exact", head: true }).eq("processing_status", "pending"),
            supabase.from("learning_resources").select("id", { count: "exact", head: true }).eq("processing_status", "processing"),
            supabase.from("learning_resources").select("id", { count: "exact", head: true }).eq("processing_status", "failed"),
        ]);

        setStats({
            totalResources: all.count || 0,
            aiGenerated: completed.count || 0, // Asumsi completed berarti sudah ada konten AI
            pending: pending.count || 0,
            processing: processing.count || 0,
            completed: completed.count || 0,
            failed: failed.count || 0,
        });

        // 2. Ambil 6 Buku Terakhir
        const { data } = await supabase
            .from("learning_resources")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(6);

        if (data) setRecentBooks(data);
    };

    return (
        <div className="space-y-8 p-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-its-blue">Quantum Library</h2>
                    <p className="text-muted-foreground">Pusat transformasi materi belajar berbasis AI.</p>
                </div>
                {/* Note: /library/upload might need to be implemented or linked to Drive upload instruction */}
                <Link href="#">
                    {/* For now disable link or point to dummy if upload page doesn't exist yet, 
                         but keeping button as requested */}
                    <Button className="bg-its-blue hover:bg-blue-800" onClick={() => alert("Silakan upload file ke Google Drive Folder Anda. Sistem akan memprosesnya otomatis.")}>
                        Upload Materi Baru
                    </Button>
                </Link>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total Materi"
                    value={stats.totalResources}
                    subtitle="Database Aset"
                    icon={BookOpen}
                    variant="primary"
                />
                <StatCard
                    title="AI Enhanced"
                    value={stats.aiGenerated}
                    subtitle="Multi-Modal Ready"
                    icon={Brain}
                    variant="success"
                />
                <StatCard
                    title="Antrian"
                    value={stats.pending}
                    subtitle="Menunggu GAS"
                    icon={Sparkles}
                    variant="warning"
                />
                <StatCard
                    title="Sedang Diproses"
                    value={stats.processing}
                    subtitle="AI Bekerja..."
                    icon={Workflow}
                    variant="primary"
                />
                <StatCard
                    title="Selesai"
                    value={stats.completed}
                    subtitle="Siap Akses"
                    icon={CheckCircle2}
                    variant="success"
                />
                <StatCard
                    title="Gagal"
                    value={stats.failed}
                    subtitle="Perlu Review"
                    icon={AlertCircle}
                    variant="destructive"
                />
            </div>

            {/* RECENTLY PROCESSED LIST */}
            <div>
                <h3 className="text-xl font-semibold mb-4">Materi Terbaru</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentBooks.map((book) => (
                        <Link href={`/library/${book.id}`} key={book.id}>
                            <Card className="h-full hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-its-blue group cursor-pointer overflow-hidden">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                            {book.category || "Umum"}
                                        </Badge>
                                        {book.processing_status === 'completed' && (
                                            <Sparkles className="size-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-lg line-clamp-1 group-hover:text-its-blue transition-colors">
                                            {book.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            by {book.author || "Unknown"}
                                        </p>
                                    </div>

                                    {/* AI Features Preview */}
                                    <div className="flex gap-2 text-xs text-slate-500 pt-2 border-t">
                                        <span className="flex items-center"><Brain className="size-3 mr-1" /> Pintar</span>
                                        <span className="flex items-center"><Workflow className="size-3 mr-1" /> Interaktif</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                    {recentBooks.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500">
                            Belum ada materi. Upload PDF ke Google Drive untuk memulai!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
