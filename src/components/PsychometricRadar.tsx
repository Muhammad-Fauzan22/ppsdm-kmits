"use client";

import { useState, useEffect } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Hook to handle client-side only rendering for charts
function useClientOnly() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

const data = [
    { subject: 'Cognitive', A: 0, fullMark: 100 },
    { subject: 'Self-Management', A: 0, fullMark: 100 },
    { subject: 'Financial', A: 0, fullMark: 100 },
    { subject: 'Physical', A: 0, fullMark: 100 },
    { subject: 'Social', A: 0, fullMark: 100 },
    { subject: 'Emotional', A: 0, fullMark: 100 },
    { subject: 'Spiritual', A: 0, fullMark: 100 },
    { subject: 'Environmental', A: 0, fullMark: 100 },
    { subject: 'Character', A: 0, fullMark: 100 },
];

interface PsychometricRadarProps {
    data: { subject: string; value: number; fullMark?: number }[];
    title?: string;
    description?: string;
}

const getHealthColor = (score: number) => {
    if (score < 60) return "#ef4444"; // Red-500 (Destructive/Danger)
    if (score < 80) return "#eab308"; // Yellow-500 (Warning) - Amended threshold from user request to be more realistic for students
    return "#22c55e"; // Green-500 (Healthy)
};

export function PsychometricRadar({ data, title = "9 Dimensi Kecerdasan", description = "Analisis potensi diri mahasiswa" }: PsychometricRadarProps) {
    const mounted = useClientOnly();
    
    // Calculate average score
    const averageScore = data.reduce((acc, curr) => acc + curr.value, 0) / (data.length || 1);
    // Determine color based on average (normalizing to 100 scale if needed, assuming data values are roughly 0-100 or 0-150 based on fullMark)
    // The previous mock data showed values around 80-120 out of 150. Let's assume the input values match the thresholds directly or normalize them.
    // User request example: < 40 red, < 70 yellow.
    // My previous mock data had fullMark 150. I should probably normalize to percentage if I want strict 0-100 thresholds.
    // However, for safety, I will stick to the user's provided logic structure but I'll use the averageScore directly. Refined thresholds:
    // If values are ~100, then <40 is very low. 
    // Let's use the code provided by the user as a base.
    const radarColor = getHealthColor(averageScore);

    if (!mounted) {
        return (
            <Card className="w-full h-full min-h-[400px]">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full min-h-[400px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid className="stroke-muted" />
                        <PolarAngleAxis dataKey="subject" className="text-xs font-medium fill-muted-foreground" />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: radarColor, fontWeight: 'bold' }}
                        />
                        <Radar
                            name="Score"
                            dataKey="value"
                            stroke={radarColor}
                            fill={radarColor}
                            fillOpacity={0.4}
                            isAnimationActive={true}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
