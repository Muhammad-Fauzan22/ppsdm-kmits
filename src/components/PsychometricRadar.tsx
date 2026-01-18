"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { subject: 'Cognitive', A: 120, fullMark: 150 },
    { subject: 'Affective', A: 98, fullMark: 150 },
    { subject: 'Psychomotor', A: 86, fullMark: 150 },
    { subject: 'Social', A: 99, fullMark: 150 },
    { subject: 'Spiritual', A: 85, fullMark: 150 },
    { subject: 'Financial', A: 65, fullMark: 150 },
];

interface PsychometricRadarProps {
    data: { subject: string; value: number }[];
    title?: string;
    description?: string;
}

export function PsychometricRadar({ data, title = "9 Dimensi Kecerdasan", description = "Analisis potensi diri mahasiswa" }: PsychometricRadarProps) {
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
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                        />
                        <Radar
                            name="Score"
                            dataKey="value"
                            stroke="var(--primary)"
                            fill="var(--primary)"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
