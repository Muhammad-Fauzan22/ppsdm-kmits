"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function RealtimeListener({ userId }: { userId: string }) {
    const { toast } = useToast();
    const supabase = createClient();

    useEffect(() => {
        if (!userId) return;

        // Listen ke tabel Activities
        const channel = supabase
            .channel('public:activities')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'activities',
                    filter: `user_id=eq.${userId}`
                },
                (payload: any) => {
                    // Cek jika status berubah jadi approved
                    if (payload.new.status === 'approved' && payload.old.status !== 'approved') {
                        // Trigger Toast Notifikasi
                        toast({
                            title: "🎉 Aktivitas Disetujui!",
                            description: `Poin untuk "${payload.new.title}" telah ditambahkan ke profilmu.`,
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, toast]);

    return null; // Komponen ini tidak me-render UI, hanya logic background
}
