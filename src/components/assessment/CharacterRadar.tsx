import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Shield } from 'lucide-react';

interface CharacterRadarProps {
    data: {
        integrity: number;
        courage: number;
        fairness: number;
        responsibility: number;
        humility: number;
        academicIntegrity: number;
        professionalEthics: number;
        socialResponsibility: number;
        ethicalLeadership: number;
        civicEngagement: number;
    };
    className?: string;
}

export const CharacterRadar: React.FC<CharacterRadarProps> = ({ data, className }) => {
    const chartData = [
        { name: 'Integrity', value: data.integrity, full: 100 },
        { name: 'Courage', value: data.courage, full: 100 },
        { name: 'Fairness', value: data.fairness, full: 100 },
        { name: 'Responsibility', value: data.responsibility, full: 100 },
        { name: 'Humility', value: data.humility, full: 100 },
        { name: 'Acad. Integrity', value: data.academicIntegrity, full: 100 },
        { name: 'Prof. Ethics', value: data.professionalEthics, full: 100 },
        { name: 'Social Resp.', value: data.socialResponsibility, full: 100 },
        { name: 'Leadership', value: data.ethicalLeadership, full: 100 },
        { name: 'Civic Eng.', value: data.civicEngagement, full: 100 },
    ];

    return (
        <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Shield className="w-6 h-6 text-yellow-500" />
                        Character & Ethics Radar
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Profil kekuatan karakter dan etika profesional
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                        <Radar
                            name="Score"
                            dataKey="value"
                            stroke="#eab308"
                            strokeWidth={2}
                            fill="#eab308"
                            fillOpacity={0.4}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                        />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
