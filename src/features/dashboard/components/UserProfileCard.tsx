"use client";

import Image from "next/image";
import { Edit2, Sparkles, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfile } from "../hooks/useDashboardData";

interface UserProfileCardProps {
    user: UserProfile | null;
    loading: boolean;
}

export function UserProfileCard({ user, loading }: UserProfileCardProps) {
    if (loading || !user) {
        return <Skeleton className="h-[320px] w-full rounded-2xl bg-white/5" />;
    }

    return (
        <div className="relative overflow-hidden border border-white/5 rounded-2xl bg-[#0A0F1A] shadow-xl backdrop-blur-sm group">

            {/* 1. Header Gradient */}
            <div className="h-32 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 text-white/90 hover:bg-black/20 hover:text-white rounded-xl transition-colors backdrop-blur-md"
                    aria-label="Edit Profile"
                >
                    <Edit2 className="size-4" />
                </Button>
            </div>

            <div className="flex flex-col items-center -mt-16 px-6 pb-8 relative z-10">
                {/* 2. Avatar with Glow */}
                <div className="group/avatar relative mb-4">
                    <div className="relative size-32 overflow-hidden rounded-full border-[6px] border-[#0A0F1A] shadow-2xl transition-transform duration-500 ease-out group-hover/avatar:scale-105 group-hover/avatar:shadow-cyan-500/20">
                        <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 120px"
                            priority
                        />
                    </div>
                    {/* Status Badge */}
                    <div className="absolute bottom-2 right-2 size-6 rounded-full bg-emerald-500 border-[4px] border-[#0A0F1A]" title="Online" />
                </div>

                {/* Typography Hierarchy */}
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1">{user.name}</h3>
                <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300 backdrop-blur-md">
                        {user.role}
                    </span>
                    <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-medium text-amber-500 backdrop-blur-md flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Rank #{user.cohortRank}
                    </span>
                </div>

                {/* Score Section Modern */}
                <div className="w-full bg-gradient-to-b from-white/[0.03] to-transparent p-5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="size-3" /> Holistic Score
                        </span>
                        <span className="text-3xl font-bold text-white tracking-tight">{user.holisticScore}</span>
                    </div>

                    {/* Custom Progress Bar */}
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
                        <div
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            style={{ width: `${user.holisticScore}%` }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Cohort Average: 72</span>
                        <span className="text-emerald-400">+12% vs avg</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
