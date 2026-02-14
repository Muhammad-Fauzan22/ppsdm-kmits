
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface XPProgressBarProps {
    currentXP: number;
    nextLevelXP: number; // XP required for next level
    currentLevelXP: number; // XP required for current level (floor)
    className?: string;
    showLabel?: boolean;
}

export function XPProgressBar({
    currentXP,
    nextLevelXP,
    currentLevelXP,
    className,
    showLabel = true
}: XPProgressBarProps) {

    // Calculate percentage
    // Guard against division by zero or max level (nextLevelXP=0 or undefined?)
    // If nextLevelXP is <= currentLevelXP, implies max level or error.

    const isMaxLevel = nextLevelXP <= currentLevelXP;

    let progress = 0;
    if (!isMaxLevel) {
        const totalNeeded = nextLevelXP - currentLevelXP;
        const gained = currentXP - currentLevelXP;
        progress = Math.min(100, Math.max(0, (gained / totalNeeded) * 100));
    } else {
        progress = 100;
    }

    return (
        <div className={cn("w-full space-y-2", className)}>
            {showLabel && (
                <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-brand-gold" />
                        {currentXP.toLocaleString()} XP
                    </span>
                    <span>
                        {isMaxLevel ? 'MAX LEVEL' : `${nextLevelXP.toLocaleString()} XP`}
                    </span>
                </div>
            )}

            <div className="relative">
                <Progress value={progress} className="h-3 bg-slate-800" indicatorClassName="bg-gradient-to-r from-brand-blue to-brand-purple" />

                {/* Optional: XP Text Overlay on bar? No, sticking to clean look. */}
            </div>

            {showLabel && !isMaxLevel && (
                <p className="text-[10px] text-right text-slate-500">
                    {Math.round(nextLevelXP - currentXP).toLocaleString()} XP to next level
                </p>
            )}
        </div>
    );
}
