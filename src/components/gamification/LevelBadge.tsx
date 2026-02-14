
import React from 'react';
import { cn } from "@/lib/utils";
import { Shield, Crown, Medal, Award, Star } from "lucide-react";

interface LevelBadgeProps {
    level: number;
    title?: string; // Optional title override
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    showTitle?: boolean;
}

export function LevelBadge({
    level,
    title,
    size = 'md',
    className,
    showTitle = true
}: LevelBadgeProps) {

    // Icon selection based on level ranges (matching seed data approximate)
    const getIcon = () => {
        if (level >= 7) return Crown; // Legend+
        if (level >= 5) return Medal; // Expert+
        if (level >= 3) return Star; // Explorer+
        return Shield; // Novice/Apprentice
    };

    const Icon = getIcon();

    // Size mappings
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-base"
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-1", className)}>
            <div className={cn(
                "relative flex items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-lg", // Base
                sizeClasses[size],
                level >= 7 && "border-brand-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]", // Gold glow for high levels
                className
            )}>
                <Icon className={cn("text-slate-400", level >= 7 ? "text-brand-gold" : "text-brand-blue", iconSizes[size])} />

                {/* Level Number Pill */}
                <div className="absolute -bottom-1 -right-1 bg-brand-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 shadow-sm">
                    {level}
                </div>
            </div>

            {showTitle && title && (
                <span className={cn(
                    "font-bold text-slate-200",
                    size === 'sm' ? "text-[10px]" : "text-xs",
                    level >= 7 && "text-brand-gold"
                )}>
                    {title}
                </span>
            )}
        </div>
    );
}
