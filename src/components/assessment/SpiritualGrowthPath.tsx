import React from 'react';
import { Star, Heart, Sun, Activity } from 'lucide-react';

interface SpiritualGrowthPathProps {
    data: {
        purpose: number;
        gratitude: number;
        connectedness: number;
        altruism: number;
        meaningMaking: number;
        mindfulness: number;
        forgiveness: number;
        contribution: number;
    };
    className?: string;
}

export const SpiritualGrowthPath: React.FC<SpiritualGrowthPathProps> = ({ data, className }) => {
    const steps = [
        { name: 'Purpose', value: data.purpose, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
        { name: 'Meaning', value: data.meaningMaking, icon: Sun, color: 'text-orange-400', bg: 'bg-orange-400/20' },
        { name: 'Connection', value: data.connectedness, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/20' },
        { name: 'Contribution', value: data.contribution, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/20' },
    ];

    return (
        <div className={`bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sun className="w-6 h-6 text-orange-500" />
                        Spiritual Growth Path
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        Perjalanan makna dan tujuan hidup
                    </p>
                </div>
            </div>

            <div className="relative py-8">
                {/* Connecting Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-700 ml-3"></div>

                <div className="space-y-8 relative">
                    {steps.map((step, idx) => (
                        <div key={step.name} className="flex items-center gap-6">
                            <div className={`w-8 h-8 rounded-full ${step.bg} border border-slate-600 flex items-center justify-center z-10 shrink-0`}>
                                <step.icon className={`w-4 h-4 ${step.color}`} />
                            </div>

                            <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-white">{step.name}</h4>
                                    <span className={`text-lg font-bold ${step.color}`}>{step.value}</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${step.color.replace('text-', 'bg-')}`}
                                        style={{ width: `${step.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{data.mindfulness}</div>
                    <div className="text-xs text-slate-400">Mindfulness Score</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{data.gratitude}</div>
                    <div className="text-xs text-slate-400">Gratitude Score</div>
                </div>
            </div>
        </div>
    );
};
