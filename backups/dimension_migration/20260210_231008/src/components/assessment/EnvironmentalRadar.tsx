import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Leaf } from 'lucide-react';

interface EnvironmentalRadarProps {
    data: {
        awareness: number;
        behavior: number;
        workLifeBalance: number;
        digitalWellbeing: number;
        energy: number;
    };
    className?: string;
}

export const EnvironmentalRadar: React.FC<EnvironmentalRadarProps> = ({ data, className }) => {
    const chartData = [
        { name: 'Eco Awareness', value: data.awareness, full: 100 },
        { name: 'Eco Behavior', value: data.behavior, full: 100 },
        { name: 'Work-Life Bal.', value: data.workLifeBalance, full: 100 },
        { name: 'Digital Well.', value: data.digitalWellbeing, full: 100 },
        { name: 'Energy Cons.', value: data.energy, full: 100 },
    ];

    return (
        <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Leaf className="w-6 h-6 text-green-500" />
                        Environmental & Lifestyle
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Keseimbangan gaya hidup dan kesadaran lingkungan
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                        <Radar
                            name="Score"
                            dataKey="value"
                            stroke="#22c55e"
                            strokeWidth={2}
                            fill="#22c55e"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                        />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Eco-Conscious Level</span>
                    <span className="text-green-400 font-bold">
                        {((data.awareness + data.behavior + data.energy) / 3).toFixed(1)}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-slate-300 text-sm">Lifestyle Balance</span>
                    <span className="text-blue-400 font-bold">
                        {((data.workLifeBalance + data.digitalWellbeing) / 2).toFixed(1)}
                    </span>
                </div>
            </div>
        </div>
    );
};
