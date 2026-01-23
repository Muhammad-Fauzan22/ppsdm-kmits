"use client";

import React, { useEffect } from 'react';
import { useHolisticStore } from '@/lib/stores/useHolisticStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Loader } from 'lucide-react';

export default function PersonalDevelopmentRadar() {
    const { radarData, refreshData, loading } = useHolisticStore();

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    if (loading && radarData.length === 0) {
        return <div className="h-64 flex items-center justify-center"><Loader className="animate-spin text-cyan-500" /></div>;
    }

    return (
        <div className="w-full h-full min-h-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="My Growth"
                        dataKey="A"
                        stroke="#06b6d4" // Cyan-500
                        strokeWidth={3}
                        fill="#06b6d4"
                        fillOpacity={0.4}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#67e8f9' }}
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Center Logo Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse pointer-events-none"></div>
        </div>
    );
}
