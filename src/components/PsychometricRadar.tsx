"use client";

import { useState, useEffect, memo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Hook to handle client-side only rendering for charts
function useClientOnly() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

interface PsychometricRadarProps {
    data: { subject: string; value: number; fullMark?: number }[];
    title?: string;
    description?: string;
}

const getHealthColor = (score: number) => {
    if (score < 60) return "#ef4444"; // Red-500 (Destructive/Danger)
    if (score < 80) return "#eab308"; // Yellow-500 (Warning)
    return "#22c55e"; // Green-500 (Healthy)
};

function PsychometricRadarComponent({ 
    data, 
    title = "9 Dimensi Kecerdasan", 
    description = "Analisis potensi diri mahasiswa" 
}: PsychometricRadarProps) {
    const mounted = useClientOnly();

    // Calculate average score
    const averageScore = data.reduce((acc, curr) => acc + curr.value, 0) / (data.length || 1);
    const radarColor = getHealthColor(averageScore);

    if (!mounted) {
        return (
            <Card className="w-full h-full min-h-[400px]">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div style={{ width: '100%', height: '350px' }} className="bg-gray-100 animate-pulse rounded-lg" />
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
            <CardContent>
                <div style={{ width: '100%', height: '350px' }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
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
                </div>
            </CardContent>
        </Card>
    );
}

// Memoize PsychometricRadar to prevent unnecessary re-renders
const PsychometricRadar = memo(PsychometricRadarComponent, (prevProps, nextProps) => {
  // Only re-render if data, title, or description changes
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});

export default PsychometricRadar;
