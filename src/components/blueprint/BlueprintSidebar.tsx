"use client";

import React from 'react';
import { Activity, Server, ShieldCheck, Clock } from 'lucide-react';

const SYSTEM_METRICS = [
    { label: 'System Integrity', value: '99.8%', color: 'text-emerald-400' },
    { label: 'Data Processing', value: '12ms', color: 'text-cyan-400' },
    { label: 'Module Active', value: '9/9', color: 'text-purple-400' },
    { label: 'Next Maintenance', value: '48h', color: 'text-amber-400' },
];

const MODULE_STATUS = [
    { name: 'Core Engine (Next.js)', status: 'Optimal', load: '12%' },
    { name: 'Assessment (Gamified)', status: 'Optimal', load: '45%' },
    { name: 'Analytics (Recharts)', status: 'Optimal', load: '28%' },
    { name: 'Storage (Zustand)', status: 'Active', load: '8%' },
];

export default function BlueprintSidebar() {
    return (
        <div className="h-full bg-slate-900/50 border-l border-slate-800 p-6 backdrop-blur-md overflow-y-auto w-80 flex flex-col gap-8">

            {/* Header */}
            <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Technical Specs</h3>
                <div className="text-2xl font-black text-white flex items-center gap-2">
                    NEXUS OS <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">v2.4.0</span>
                </div>
            </div>

            {/* Main Metrics */}
            <div className="grid grid-cols-2 gap-4">
                {SYSTEM_METRICS.map((metric, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                        <div className="text-[10px] text-slate-400 uppercase mb-1">{metric.label}</div>
                        <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                    </div>
                ))}
            </div>

            {/* Module Status */}
            <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">
                    <Server className="w-4 h-4 text-cyan-500" />
                    Module Diagnostics
                </h4>
                <div className="space-y-3">
                    {MODULE_STATUS.map((mod, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <div>
                                <div className="text-slate-200 font-medium">{mod.name}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    {mod.status}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-500">LOAD</div>
                                <div className="font-mono text-cyan-400">{mod.load}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Security Protocols
                </h4>
                <div className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="text-xs text-emerald-200">
                            <strong>Local-First Encryption</strong><br />
                            Data sovereignty verified. All sensitive user logs persisted locally via Zustand Storage.
                        </div>
                    </div>
                </div>
            </div>

            {/* Maintenance */}
            <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Optimization Cycle
                </h4>
                <div className="space-y-2">
                    <div className="text-xs text-slate-400 flex justify-between">
                        <span>Database Pruning</span>
                        <span className="text-slate-200">Auto (Weekly)</span>
                    </div>
                    <div className="text-xs text-slate-400 flex justify-between">
                        <span>Cache Revalidation</span>
                        <span className="text-slate-200">15s Global</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
