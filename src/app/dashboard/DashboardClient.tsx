"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { AssetConfig } from "@/lib/dynamicAssets";

// Components
import { DashboardHeader } from "@/features/dashboard/components/DashboardHeader";
import { UserProfileCard } from "@/features/dashboard/components/UserProfileCard";
import { WelcomeBanner } from "@/features/dashboard/components/WelcomeBanner";
import { DimensionGrid } from "@/features/dashboard/components/DimensionGrid";
import { LiveProcessingFeed } from "@/components/dashboard/LiveProcessingFeed";
import { FadeIn } from "@/components/Animations";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy Load Chart
const PsychometricRadar = dynamic(
    () => import('@/components/PsychometricRadar').then(mod => mod.PsychometricRadar),
    {
        loading: () => <Skeleton className="h-[400px] w-full rounded-2xl bg-surface-100" />,
        ssr: false
    }
);

interface DashboardClientProps {
    assets: AssetConfig;
}

export function DashboardClient({ assets }: DashboardClientProps) {
    const { user, loading, radarData, greeting } = useDashboardData();

    return (
        <div className="min-h-screen bg-surface-50 dark:bg-its-dark font-sans text-slate-900 pb-20">

            {/* Header Sticky - Pass assets */}
            <DashboardHeader assets={assets} />

            {/* Container Utama: Responsive Padding */}
            <main className="w-full max-w-[1440px] mx-auto px-4 py-6 md:px-6 lg:px-8 lg:py-8">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* === LEFT COLUMN (Sidebar Profile) === */}
                    <aside className="lg:col-span-4 flex flex-col gap-6">
                        <FadeIn delay={0.1}>
                            <UserProfileCard user={user} loading={loading} />
                        </FadeIn>

                        {/* Radar Chart Card */}
                        <FadeIn delay={0.2}>
                            <div className="rounded-2xl bg-white p-4 shadow-soft border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 px-2 uppercase tracking-wide">
                                    Holistic Balance
                                </h3>
                                <div className="h-[350px] w-full">
                                    <PsychometricRadar
                                        data={radarData}
                                        title=""
                                        description=""
                                    />
                                </div>
                            </div>
                        </FadeIn>
                    </aside>

                    {/* === RIGHT COLUMN (Main Content) === */}
                    <section className="lg:col-span-8 flex flex-col gap-8">

                        {/* 1. Welcome Banner */}
                        <FadeIn delay={0.3}>
                            <WelcomeBanner
                                greeting={greeting}
                                name={user?.name || "Mahasiswa"}
                                suggestion="Tingkatkan Literasi Finansial Anda minggu ini."
                            />
                        </FadeIn>

                        {/* 2. Live Feed (Optional) */}
                        <FadeIn delay={0.4}>
                            <LiveProcessingFeed />
                        </FadeIn>

                        {/* 3. Dimension Grid */}
                        <FadeIn delay={0.5}>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h2 className="text-xl font-bold text-its-dark dark:text-white">
                                        The 9 Dimensions
                                    </h2>
                                    <button className="text-sm font-medium text-its-light hover:text-its-DEFAULT transition-colors">
                                        View All Metrics &rarr;
                                    </button>
                                </div>
                                <DimensionGrid />
                            </div>
                        </FadeIn>

                    </section>
                </div>
            </main>
        </div>
    );
}
