"use client";

import React, { Suspense, lazy } from "react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { AssetConfig } from "@/lib/dynamicAssets";
import PsychometricRadar from "@/components/PsychometricRadar";


// Lazy load heavy components for better performance
const UserProfileCard = lazy(() => import("@/features/dashboard/components/UserProfileCard").then(mod => ({ default: mod.UserProfileCard })));
const WelcomeBanner = lazy(() => import("@/features/dashboard/components/WelcomeBanner").then(mod => ({ default: mod.WelcomeBanner })));
const DimensionGrid = lazy(() => import("@/features/dashboard/components/DimensionGrid").then(mod => ({ default: mod.DimensionGrid })));
const LiveProcessingFeed = lazy(() => import("@/components/dashboard/LiveProcessingFeed").then(mod => ({ default: mod.LiveProcessingFeed })));

// Components
import { FadeIn } from "@/components/Animations";

// Skeleton components for loading states
const ProfileSkeleton = () => (
  <div className="rounded-2xl bg-[#0A0F1A]/50 p-6 shadow-xl border border-white/5 backdrop-blur-sm animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-700/50" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700/50 rounded w-3/4" />
        <div className="h-3 bg-slate-700/50 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const BannerSkeleton = () => (
  <div className="rounded-2xl bg-gradient-to-r from-[#003366]/20 to-[#1A4D80]/20 p-6 border border-white/5 animate-pulse">
    <div className="h-6 bg-slate-700/30 rounded w-1/3 mb-2" />
    <div className="h-4 bg-slate-700/30 rounded w-2/3" />
  </div>
);

const GridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="aspect-square rounded-xl bg-[#0A0F1A]/50 border border-white/5" />
    ))}
  </div>
);

const FeedSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-12 bg-[#0A0F1A]/30 rounded-lg" />
    ))}
  </div>
);

interface DashboardClientProps {
    assets: AssetConfig;
}

export function DashboardClient({ assets }: DashboardClientProps) {
    const { user, loading, radarData, greeting } = useDashboardData();

    return (
        <div className="w-full max-w-[1600px] mx-auto pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                {/* === LEFT COLUMN (Sidebar Profile) === */}
                <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                    <FadeIn delay={0.1}>
                        <Suspense fallback={<ProfileSkeleton />}>
                            <UserProfileCard user={user} loading={loading} />
                        </Suspense>
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
                        <Suspense fallback={<BannerSkeleton />}>
                            <WelcomeBanner
                                greeting={greeting}
                                name={user?.name || "Mahasiswa"}
                                suggestion="Tingkatkan Literasi Finansial Anda minggu ini."
                            />
                        </Suspense>
                    </FadeIn>

                    {/* 2. Live Feed (Hidden on mobile maybe, or reduced) */}
                    <FadeIn delay={0.4}>
                        <div className="bg-[#0A0F1A]/30 border border-white/5 rounded-2xl p-6">
                            <Suspense fallback={<FeedSkeleton />}>
                                <LiveProcessingFeed />
                            </Suspense>
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
                            <Suspense fallback={<GridSkeleton />}>
                                <DimensionGrid />
                            </Suspense>
                        </div>
                    </FadeIn>

                </section>
            </div>
        </div>
    );
}

// Export with React.memo for performance optimization
export default React.memo(DashboardClient);
