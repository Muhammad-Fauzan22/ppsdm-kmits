
"use client";

import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Clock, Workflow, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/library/StatCard";
import { supabase } from "@/lib/supabaseClient";

export default function LibraryDashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalModules: 0,
        pendingBooks: 0,
        processingBooks: 0,
        completedBooks: 0,
        failedBooks: 0,
    });

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        const [books, modules, pending, processing, completed, failed] = await Promise.all([
            supabase.from("books").select("id", { count: "exact", head: true }),
            supabase.from("modules").select("id", { count: "exact", head: true }),
            supabase.from("books").select("id", { count: "exact", head: true }).eq("processing_status", "pending"),
            supabase.from("books").select("id", { count: "exact", head: true }).eq("processing_status", "processing"),
            supabase.from("books").select("id", { count: "exact", head: true }).eq("processing_status", "completed"),
            supabase.from("books").select("id", { count: "exact", head: true }).eq("processing_status", "failed"),
        ]);

        setStats({
            totalBooks: books.count || 0,
            totalModules: modules.count || 0,
            pendingBooks: pending.count || 0,
            processingBooks: processing.count || 0,
            completedBooks: completed.count || 0,
            failedBooks: failed.count || 0,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Library Automation</h2>
                    <p className="text-muted-foreground">Automated pipeline for resource ingestion and synthesis.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total Books"
                    value={stats.totalBooks}
                    subtitle="In Database"
                    icon={BookOpen}
                    variant="primary"
                />
                <StatCard
                    title="Modules Created"
                    value={stats.totalModules}
                    subtitle="AI Synthesized"
                    icon={GraduationCap}
                    variant="success"
                />
                <StatCard
                    title="Pending"
                    value={stats.pendingBooks}
                    subtitle="In Queue"
                    icon={Clock}
                    variant="warning"
                />
                <StatCard
                    title="Processing"
                    value={stats.processingBooks}
                    subtitle="Active"
                    icon={Workflow}
                    variant="primary"
                />
                <StatCard
                    title="Completed"
                    value={stats.completedBooks}
                    subtitle="Ready"
                    icon={CheckCircle2}
                    variant="success"
                />
                <StatCard
                    title="Web Intel"
                    value="Active"
                    subtitle="SerpAPI Connected"
                    icon={BookOpen}
                    variant="primary"
                />
                <StatCard
                    title="Failed"
                    value={stats.failedBooks}
                    subtitle="Needs Attention"
                    icon={AlertCircle}
                    variant="destructive"
                />
            </div>
        </div>
    );
}
