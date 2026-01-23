"use client";

import React from 'react';
import { Flag, Award, Briefcase, GraduationCap } from 'lucide-react';

const MILESTONES = [
    { year: 1, title: "Freshman Initiation", icon: Flag, active: true },
    { year: 2, title: "Organization Lead", icon: Award, active: true },
    { year: 3, title: "First Internship", icon: Briefcase, active: true },
    { year: 4, title: "Graduation", icon: GraduationCap, active: false },
    { year: 5, title: "Junior Engineer", icon: Briefcase, active: false },
    { year: 6, title: "Promotion", icon: Award, active: false },
    { year: 7, title: "Senior Role", icon: Briefcase, active: false },
    { year: 8, title: "Leadership", icon: Flag, active: false },
];

export default function DevelopmentTimeline() {
    return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="font-bold text-slate-300 text-sm uppercase tracking-wider mb-4">8-Year Master Plan</h3>

            <div className="relative pt-8 pb-4 horizontal-scroll-container overflow-x-auto">
                {/* Line */}
                <div className="absolute top-[4.5rem] left-0 right-0 h-1 bg-slate-800 rounded-full"></div>
                <div className="absolute top-[4.5rem] left-0 w-1/2 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full"></div>

                <div className="flex justify-between min-w-[800px] gap-8 px-4">
                    {MILESTONES.map((m, i) => (
                        <div key={i} className="flex flex-col items-center relative group z-10 w-24">
                            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center mb-4 transition-all
                                ${m.active ? 'bg-slate-900 border-cyan-500 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-800 border-slate-700 text-slate-600'}
                            `}>
                                <m.icon className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-slate-500 mb-1">Year {m.year}</div>
                                <div className={`text-xs font-bold leading-tight ${m.active ? 'text-white' : 'text-slate-600'}`}>{m.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
