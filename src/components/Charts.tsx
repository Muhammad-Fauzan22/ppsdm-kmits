"use client";

import { useState, useEffect } from "react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface GrowthChartProps {
    data: { month: string; score: number }[];
    color?: string;
}

// Hook to handle client-side only rendering for charts
function useClientOnly() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

export function GrowthLineChart({ data, color = "#330066" }: GrowthChartProps) {
    const mounted = useClientOnly();

    if (!mounted) {
        return <div style={{ height: 200, width: '100%' }} className="bg-gray-100 animate-pulse rounded-lg" />;
    }

    return (
        <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#111" }}
                    />
                    <Area type="monotone" dataKey="score" stroke={color} strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

interface RadarChartData {
    dimension: string;
    score: number;
    fullMark: number;
}

interface DimensionRadarProps {
    data: RadarChartData[];
    color?: string;
}

export function DimensionRadarChart({ data, color = "#3B82F6" }: DimensionRadarProps) {
    const mounted = useClientOnly();

    if (!mounted) {
        return <div style={{ height: 280, width: '100%' }} className="bg-gray-100 animate-pulse rounded-lg" />;
    }

    return (
        <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#e5e7eb" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="score" stroke={color} fill={color} fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}

interface ProgressBarProps {
    value: number;
    max?: number;
    color?: string;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}

export function ProgressBar({ value, max = 100, color = "bg-primary", showLabel = true, size = "md" }: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);
    const heights = { sm: "h-1.5", md: "h-2", lg: "h-3" };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-bold text-gray-700">{Math.round(percentage)}%</span>
                </div>
            )}
            <div className={`w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden ${heights[size]}`}>
                <div
                    className={`${heights[size]} ${color} rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon?: React.ReactNode;
}

export function StatCard({ title, value, change, changeType = "neutral", icon }: StatCardProps) {
    const changeColors = {
        positive: "text-green-600 bg-green-100",
        negative: "text-red-600 bg-red-100",
        neutral: "text-gray-600 bg-gray-100",
    };

    return (
        <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-border-light dark:border-border-dark shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</span>
                {icon && <span className="text-primary text-xl flex items-center">{icon}</span>}
            </div>
            <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
                {change && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${changeColors[changeType]}`}>
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
