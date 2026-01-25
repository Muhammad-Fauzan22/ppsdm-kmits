import Image from "next/image";
import { Edit2, Sparkles } from "lucide-react";
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
        return <Skeleton className="h-[320px] w-full rounded-2xl bg-surface-100" />;
    }

    return (
        <Card className="relative overflow-hidden border border-slate-100 rounded-2xl bg-white/80 shadow-soft backdrop-blur-sm transition-shadow hover:shadow-lg dark:bg-slate-900/80 dark:border-slate-800">

            {/* 1. Header Gradient yang "Menyatu" */}
            <div className="h-28 bg-gradient-to-br from-its-DEFAULT via-blue-700 to-indigo-800 relative">
                {/* Pattern Overlay tipis agar tidak flat */}
                <div className="absolute inset-0 bg-its-pattern opacity-10"></div>

                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 text-white/90 hover:bg-white/20 hover:text-white rounded-xl transition-colors"
                    aria-label="Edit Profile"
                >
                    <Edit2 className="size-4" />
                </Button>
            </div>

            <div className="flex flex-col items-center -mt-14 px-6 pb-8">
                {/* 2. Avatar dengan Hover Zoom Effect */}
                <div className="group relative mb-4">
                    <div className="relative size-28 overflow-hidden rounded-full border-[4px] border-white shadow-md transition-transform duration-300 ease-out group-hover:scale-105 group-hover:shadow-glow dark:border-slate-900">
                        <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 120px"
                            priority
                        />
                    </div>
                    {/* Status Badge Kecil */}
                    <div className="absolute bottom-1 right-1 size-6 rounded-full bg-emerald-500 border-[3px] border-white dark:border-slate-900" title="Online" />
                </div>

                {/* Typography Hierarchy */}
                <h3 className="text-xl font-bold text-its-dark tracking-tight">{user.name}</h3>
                <p className="text-sm text-slate-500 font-medium mb-6">{user.role}</p>

                {/* Score Section Modern */}
                <div className="w-full bg-surface-50 p-4 rounded-xl border border-slate-100 dark:bg-slate-800/50 dark:border-slate-700">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="size-3 text-its-gold" /> Holistic Score
                        </span>
                        <span className="text-2xl font-bold text-its-DEFAULT">{user.holisticScore}<span className="text-sm text-slate-400 font-normal">/100</span></span>
                    </div>

                    {/* Custom Progress Bar */}
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden dark:bg-slate-700">
                        <div
                            className="bg-gradient-to-r from-its-light to-its-DEFAULT h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,85,204,0.5)]"
                            style={{ width: `${user.holisticScore}%` }}
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-3 text-center">
                        You are in the <span className="font-bold text-its-DEFAULT">Top {user.cohortRank}%</span> of your cohort.
                    </p>
                </div>
            </div>
        </Card>
    );
}
