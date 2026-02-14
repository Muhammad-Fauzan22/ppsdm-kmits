
'use client';

import React, { useEffect, useRef } from 'react';
import { GamificationService } from '@/lib/gamification/service';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

export function GamificationManager() {
    const { toast } = useToast();
    const hasCheckedLogin = useRef(false);

    useEffect(() => {
        // Daily Login Check
        const checkLogin = async () => {
            if (hasCheckedLogin.current) return;
            hasCheckedLogin.current = true; // Prevent double firing in React strict mode or re-renders

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            try {
                // Check Streak
                const { streakContinued, newStreak } = await GamificationService.checkDailyLogin(user.id);

                // Track Quest Progress for Login
                await GamificationService.updateQuestProgress(user.id, 'login', 1);

                if (streakContinued && newStreak > 1) {
                    toast({
                        title: "🔥 Streak Continued!",
                        description: `You're on a ${newStreak} day streak! Keep it up!`,
                        variant: "default",
                    });
                } else if (newStreak === 1) {
                    // First login or reset, maybe welcome back?
                    // Don't spam unless it's a milestone.
                }

                // Check for Level Up (if login gives XP? Usually not much, but let's give 10 XP for daily login)
                // Actually, let's give 10 XP daily login bonus directly here?
                // Or rely on the quest 'Login Harian'?
                // The service updateQuestProgress handles quest progress.
                // The quest reward claim handles the XP.
                // So we don't auto-award XP here unless we want an instant bonus.
                // Let's stick to Quest claiming for now to encourage interaction with Quest Board.

            } catch (error) {
                console.error("Gamification error:", error);
            }
        };

        checkLogin();
    }, [toast]);

    return null; // Headless component
}
