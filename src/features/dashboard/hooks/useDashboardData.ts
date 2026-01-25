import { useState, useEffect } from 'react';
import { useHolisticStore, RadarPoint } from '@/lib/stores/useHolisticStore';
import { useHolisticSync } from '@/hooks/useHolisticSync';

// Interface untuk User Profile agar type-safe
export interface UserProfile {
    name: string;
    role: string;
    avatarUrl: string;
    holisticScore: number;
    cohortRank: number; // Top X%
}

// Custom Hook untuk memisahkan Logic dari View
export function useDashboardData() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);

    // Mengambil data dari Global Store (Zustand)
    const radarData = useHolisticStore((state) => state.radarData);
    const updateScore = useHolisticStore((state) => state.updateScore); // Note: we should use the sync hook for updates, but fetching triggers might be needed

    // Activate sync
    useHolisticSync();

    useEffect(() => {
        // Simulasi fetch data user (bisa diganti call API Supabase)
        const fetchData = async () => {
            setLoading(true);
            try {
                // Simulasi data user
                // In a real app, calculate score from radarData or fetch from DB
                const calculatedScore = radarData.length > 0
                    ? Math.round(radarData.reduce((acc, curr) => acc + curr.value, 0) / radarData.length)
                    : 82;

                setUser({
                    name: "Rian Santoso",
                    role: "Informatics Engineering",
                    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI",
                    holisticScore: calculatedScore,
                    cohortRank: 15
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [radarData]); // Re-run when radar data changes to update score

    // Helper untuk greeting time-based
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return {
        loading,
        user,
        radarData,
        greeting: getGreeting()
    };
}
