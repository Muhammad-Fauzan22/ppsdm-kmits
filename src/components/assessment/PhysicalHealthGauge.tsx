"use client";

import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip, PolarAngleAxis } from 'recharts';
import { Activity, Moon, Apple, Heart } from 'lucide-react';

interface PhysicalHealthGaugeProps {
    data: {
        physicalActivity: number;
        sleepQuality: number;
        nutrition: number;
        vitality: number;
    };
    className?: string;
}

// Hook to handle client-side only rendering for charts
function useClientOnly() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    return mounted;
}

export const PhysicalHealthGauge: React.FC<PhysicalHealthGaugeProps> = ({ data, className }) => {
    const mounted = useClientOnly();
    const chartData = [
        { name: 'Physical Activity', value: data.physicalActivity, fill: '#ef4444' },
        { name: 'Sleep Quality', value: data.sleepQuality, fill: '#8b5cf6' },
        { name: 'Nutrition', value: data.nutrition, fill: '#10b981' },
        { name: 'Vitality', value: data.vitality, fill: '#f59e0b' },
    ];

    if (!mounted) {
        return (
            <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-500" />
                            Physical Health Gauge
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">
                            Indikator vitalitas dan kesehatan fisik
                        </p>
                    </div>
                </div>
                <div className="h-[400px] bg-gray-800/50 animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Heart className="w-6 h-6 text-red-500" />
                        Physical Health Gauge
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Indikator vitalitas dan kesehatan fisik
                    </p>
                </div>
            </div>

            <div className="h-[400px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="20%"
                        outerRadius="100%"
                        barSize={20}
                        data={chartData}
                        startAngle={180}
                        endAngle={0}
                        cx="50%"
                        cy="70%"
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            dataKey="value"
                            cornerRadius={10}
                        />
                        <Legend
                            iconSize={10}
                            layout="vertical"
                            verticalAlign="middle"
                            wrapperStyle={{
                                top: '50%',
                                right: 0,
                                transform: 'translate(0, -50%)',
                                lineHeight: '24px'
                            }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                            cursor={{ fill: 'transparent' }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                {/* Central Score Display */}
                <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <div className="text-4xl font-bold text-white">
                        {Math.round((data.physicalActivity + data.sleepQuality + data.nutrition + data.vitality) / 4)}
                    </div>
                    <div className="text-xs text-slate-400">Total Score</div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-[-40px]">
                <div className="text-center">
                    <Activity className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <div className="text-sm text-slate-300">{data.physicalActivity.toFixed(0)}</div>
                    <div className="text-[10px] text-slate-500">Activity</div>
                </div>
                <div className="text-center">
                    <Moon className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <div className="text-sm text-slate-300">{data.sleepQuality.toFixed(0)}</div>
                    <div className="text-[10px] text-slate-500">Sleep</div>
                </div>
                <div className="text-center">
                    <Apple className="w-5 h-5 text-green-500 mx-auto mb-1" />
                    <div className="text-sm text-slate-300">{data.nutrition.toFixed(0)}</div>
                    <div className="text-[10px] text-slate-500">Nutrition</div>
                </div>
                <div className="text-center">
                    <Heart className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                    <div className="text-sm text-slate-300">{data.vitality.toFixed(0)}</div>
                    <div className="text-[10px] text-slate-500">Vitality</div>
                </div>
            </div>
        </div>
    );
};
