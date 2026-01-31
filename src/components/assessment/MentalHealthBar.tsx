import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Brain } from 'lucide-react';

interface MentalHealthBarProps {
    data: {
        emotionalWellbeing: number;
        psychologicalWellbeing: number;
        socialWellbeing: number;
        resilience: number;
        stress: number; // Low is bad for this chart (inverted representation)
        mindfulness: number;
        lifeSatisfaction: number;
    };
    className?: string;
}

export const MentalHealthBar: React.FC<MentalHealthBarProps> = ({ data, className }) => {
    const chartData = [
        { name: 'Emotional', value: data.emotionalWellbeing, fill: '#3b82f6' },
        { name: 'Psychological', value: data.psychologicalWellbeing, fill: '#8b5cf6' },
        { name: 'Social', value: data.socialWellbeing, fill: '#10b981' },
        { name: 'Resilience', value: data.resilience, fill: '#f59e0b' },
        { name: 'Stress Mfg', value: data.stress, fill: '#ef4444' }, // Higher bar = better management
        { name: 'Mindfulness', value: data.mindfulness, fill: '#06b6d4' },
        { name: 'Satisfaction', value: data.lifeSatisfaction, fill: '#eab308' },
    ];

    return (
        <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Brain className="w-6 h-6 text-purple-500" />
                        Mental Health Indicators
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Indikator kesejahteraan mental dan psikologis
                    </p>
                </div>
            </div>

            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                        <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
                        <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={80} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                        <ReferenceLine x={50} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold', fill: '#64748b', fontSize: 10 }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
