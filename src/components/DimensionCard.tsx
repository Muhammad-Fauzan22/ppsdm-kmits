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

// Helper untuk mapping warna "Soft/Pastel"
const getColorScheme = (id: string) => {
    // Default Scheme (Blue)
    let scheme = { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", ring: "group-hover:ring-blue-200" };

    // Note: We are using a simplified matching strategy here. 
    // In strict mode, we'd use the exact mapping from before, but pastel versions.
    if (id.includes('intellectual')) scheme = { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", ring: "group-hover:ring-blue-200" };
    if (id.includes('self_mgmt')) scheme = { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", ring: "group-hover:ring-indigo-200" };
    if (id.includes('financial')) scheme = { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", ring: "group-hover:ring-emerald-200" };
    if (id.includes('physical')) scheme = { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", ring: "group-hover:ring-rose-200" };
    if (id.includes('mental')) scheme = { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", ring: "group-hover:ring-amber-200" };
    if (id.includes('character')) scheme = { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100", ring: "group-hover:ring-violet-200" };

    return scheme;
};

export function DimensionCard({ id, title, description, score, icon: Icon, href }: DimensionCardProps) {
    const colors = getColorScheme(id);
    const hasScore = score !== null;
    const displayScore = score || 0;

    return (
        <Link
            href={href}
            className={cn(
                "group relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-soft hover:border-transparent", // Efek Lift
                `hover:ring-2 ${colors.ring}`, // Efek Ring halus saat hover
                "dark:bg-slate-900 dark:border-slate-800"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                {/* Soft Colored Icon Background */}
                <div className={cn("p-3 rounded-xl transition-colors", colors.bg, colors.text)}>
                    {/* Rendering Icon node directly or as component if simpler */}
                    {Icon}
                </div>

                {/* Arrow Icon yang muncul saat hover */}
                <ArrowUpRight className="size-5 text-slate-300 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-slate-400" />
            </div>

            <div className="space-y-1 mb-4">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-its-DEFAULT transition-colors dark:text-slate-100">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 dark:text-slate-400">
                    {description}
                </p>
            </div>

            {/* Score Indicator */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full", colors.text.replace('text-', 'bg-'))}
                        style={{ width: `${displayScore}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{displayScore}%</span>
            </div>
        </Link>
    );
}
