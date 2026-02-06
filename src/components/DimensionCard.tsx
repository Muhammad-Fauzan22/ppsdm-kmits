"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DimensionCardProps {
    id: string;
    title: string;
    description: string;
    score: number | null;
    icon: any;
    colorClass?: string;
    href: string;
}

// Helper untuk mapping warna "Neon/Glow" untuk Dark Mode
const getColorScheme = (id: string) => {
    // Default Scheme (Cyan)
    let scheme = { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", glow: "shadow-cyan-500/20" };

    if (id.includes('intellectual')) scheme = { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/20" };
    if (id.includes('self_mgmt')) scheme = { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20", glow: "shadow-indigo-500/20" };
    if (id.includes('financial')) scheme = { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" };
    if (id.includes('physical')) scheme = { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", glow: "shadow-rose-500/20" };
    if (id.includes('mental')) scheme = { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/20" };
    if (id.includes('character')) scheme = { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", glow: "shadow-violet-500/20" };

    return scheme;
};

export function DimensionCard({ id, title, description, score, icon: Icon, href }: DimensionCardProps) {
    const colors = getColorScheme(id);
    const displayScore = score || 0;

    return (
        <Link
            href={href}
            className={cn(
                "group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0A0F1A]/40 border border-white/5 backdrop-blur-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-2xl hover:bg-[#0A0F1A]/60",
                `hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] ${colors.glow.replace('shadow-', 'shadow-')}`, // Dynamic colored glow
                "overflow-hidden"
            )}
        >
            {/* Background Gradient Mesh */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${colors.bg.replace('/10', '')}`} />

            <div className="flex justify-between items-start mb-4 relative z-10">
                {/* Neon Icon Background */}
                <div className={cn("p-3 rounded-xl transition-all duration-300 group-hover:scale-110", colors.bg, colors.text)}>
                    {Icon}
                </div>

                {/* Arrow Icon */}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-[-8px] group-hover:translate-y-[8px]">
                    <ArrowUpRight className="size-4 text-white" />
                </div>
            </div>

            <div className="space-y-2 mb-6 relative z-10">
                <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-cyan-200 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 font-light group-hover:text-slate-300">
                    {description}
                </p>
            </div>

            {/* Score Indicator */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-auto relative z-10">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_currentColor]", colors.text)}
                        style={{ width: `${displayScore}%`, backgroundColor: 'currentColor' }}
                    />
                </div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{displayScore}%</span>
            </div>
        </Link>
    );
}
