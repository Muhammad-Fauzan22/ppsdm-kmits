"use client";

import React from "react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { AssetConfig } from "@/lib/dynamicAssets";
import PsychometricRadar from "@/components/PsychometricRadar";


// Components
import { UserProfileCard } from "@/features/dashboard/components/UserProfileCard";
import { WelcomeBanner } from "@/features/dashboard/components/WelcomeBanner";
import { DimensionGrid } from "@/features/dashboard/components/DimensionGrid";
import { LiveProcessingFeed } from "@/components/dashboard/LiveProcessingFeed";
import { FadeIn } from "@/components/Animations";

interface DashboardClientProps {
    assets: AssetConfig;
}

export default function DashboardClient({ assets }: DashboardClientProps) {
    const { user, loading, radarData, greeting } = useDashboardData();

    return (
        <div className="w-full max-w-[1600px] mx-auto pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* === LEFT COLUMN (Sidebar Profile) === */}
                <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                    <FadeIn delay={0.1}>
                        <UserProfileCard user={user} loading={loading} />
                    </FadeIn>

                    {/* Radar Chart Card */}
                    <FadeIn delay={0.2}>
                        <div className="rounded-2xl bg-[#0A0F1A]/50 p-6 shadow-xl border border-white/5 backdrop-blur-sm">
                            <h3 className="text-sm font-bold text-slate-400 mb-6 px-2 uppercase tracking-wide flex items-center justify-between">
                                <span>Holistic Balance</span>
                                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full">LIVE</span>
                            </h3>
                            <div className="h-[300px] w-full">
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
                <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">

                    {/* 1. Welcome Banner */}
                    <FadeIn delay={0.3}>
                        <WelcomeBanner
                            greeting={greeting}
                            name={user?.name || "Mahasiswa"}
                            suggestion="Tingkatkan Literasi Finansial Anda minggu ini."
                        />
                    </FadeIn>

                    {/* 2. Live Feed (Hidden on mobile maybe, or reduced) */}
                    <FadeIn delay={0.4}>
                        <div className="bg-[#0A0F1A]/30 border border-white/5 rounded-2xl p-6">
                            <LiveProcessingFeed />
                        </div>
                    </FadeIn>

                    {/* 3. Dimension Grid */}
                    <FadeIn delay={0.5}>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-1">
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        The 9 Dimensions
                                    </h2>
                                    <p className="text-sm text-slate-500">Track your holistic growth progress</p>
                                </div>
                                <button className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 py-2 rounded-lg">
                                    View All Metrics &rarr;
                                </button>
                            </div>
                            <DimensionGrid />
                        </div>
                    </FadeIn>

                </section>
            </div>
        </div>
    );
}
