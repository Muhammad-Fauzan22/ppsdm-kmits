"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

// Definisi Tipe Data sesuai Schema Database 'learning_resources'
export interface LearningResource {
    id: string;
    created_at: string;
    title: string;
    author: string | null;
    category: string | null;
    status: 'queued' | 'processing' | 'completed' | 'failed';
    file_url: string | null;
    cover_image: string | null;
    description: string | null;
    metadata: any; // Kolom JSONB untuk data tambahan dari AI
}

export function useQuantumLibrary() {
    const [books, setBooks] = useState<LearningResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // 1. Fungsi Fetch Data Utama
    const fetchBooks = async () => {
        try {
            // setIsLoading(true); // Opsional: Jangan set loading true saat refresh realtime agar UX smooth
            const { data, error } = await supabase
                .from("learning_resources")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setBooks(data as LearningResource[]);
        } catch (err: any) {
            console.error("Error fetching library:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Setup Realtime Subscription
    useEffect(() => {
        fetchBooks();

        const channel = supabase
            .channel("library-changes")
            .on(
                "postgres_changes",
                {
                    event: "*", // Listen: INSERT, UPDATE, DELETE
                    schema: "public",
                    table: "learning_resources",
                },
                (payload) => {
                    console.log("⚡ Realtime Update Detected:", payload);
                    // Strategi sederhana: Refetch ulang untuk konsistensi data
                    fetchBooks();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // 3. Hitung Statistik secara Dinamis (Memoized)
    const stats = useMemo(() => {
        return {
            total: books.length,
            aiReady: books.filter((b) => b.status === "completed").length,
            processing: books.filter((b) => ["processing", "queued"].includes(b.status)).length,
            // Mockup logika streak (bisa dihubungkan ke tabel user_activity nanti)
            learningStreak: "5 Hari",
        };
    }, [books]);

    return { books, stats, isLoading, error, refresh: fetchBooks };
}
