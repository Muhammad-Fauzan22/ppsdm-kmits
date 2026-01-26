"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminCommandCenter() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [nodes, setNodes] = useState<{ id: number; x: number; y: number; active: boolean }[]>([]);

    // Simulate traffic data
    const data = [
        { time: "10:00", val: 30 },
        { time: "10:01", val: 40 },
        { time: "10:02", val: 35 },
        { time: "10:03", val: 50 },
        { time: "10:04", val: 45 },
        { time: "10:05", val: 70 },
        { time: "10:06", val: 65 },
        { time: "10:07", val: 85 },
        { time: "10:08", val: 75 },
        { time: "10:09", val: 90 },
        { time: "10:10", val: 100 },
    ];

    // Generate random map nodes on mount
    useEffect(() => {
        const newNodes = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            active: Math.random() > 0.3,
        }));
        setNodes(newNodes);
    }, []);

    return (
        <div className="flex h-screen bg-[#0F1218] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#181B21] border-r border-[#2A2E37] flex flex-col p-4">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="size-8 rounded bg-blue-600 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-sm">security</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-wide">PPSDM KMM</h1>
                        <p className="text-[10px] text-gray-500 tracking-wider">ADMIN CONSOLE</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {[
                        { id: "dashboard", icon: "dashboard", label: "Dashboard" },
                        { id: "orchestrator", icon: "hub", label: "Orchestrator" },
                        { id: "users", icon: "group", label: "User Management" },
                        { id: "analytics", icon: "analytics", label: "Analytics" },
                        { id: "logs", icon: "terminal", label: "System Logs" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "text-gray-400 hover:bg-[#2A2E37] hover:text-gray-200"
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto px-4 py-4 bg-[#21242C] rounded-xl flex items-center gap-3 border border-[#2A2E37]">
                    <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-400 text-sm">person</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white">Admin User</p>
                        <p className="text-[10px] text-gray-500">Super Admin</p>
                    </div>
                    <button className="ml-auto text-gray-500 hover:text-white">
                        <span className="material-symbols-outlined text-sm">logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <p className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">System Overview</p>
                        <h2 className="text-3xl font-bold text-white">COMMAND CENTER</h2>
                        <p className="text-gray-400 text-sm mt-1">System Orchestration & Health Monitoring</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1.5 rounded bg-[#1C2622] border border-[#2D4537] flex items-center gap-2">
                            <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-green-500 uppercase">System Operational</span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">v4.2.0-stable</span>
                    </div>
                </header>

                {/* Top Widgets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Widget 1: Database */}
                    <div className="bg-[#181B21] p-6 rounded-xl border border-[#2A2E37] relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Database</span>
                            <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Online - 14ms</h3>
                        <p className="text-[10px] text-green-500 font-bold tracking-wide">+99.9% uptime</p>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[#2A2E37] mt-6 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[98%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                    </div>

                    {/* Widget 2: AI Engine */}
                    <div className="bg-[#181B21] p-6 rounded-xl border border-[#2A2E37] relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Engine</span>
                            <span className="material-symbols-outlined text-blue-500 text-sm animate-spin-slow">smart_toy</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Processing</h3>
                        <p className="text-[10px] text-blue-500 font-bold tracking-wide">24 Active Jobs</p>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[#2A2E37] mt-6 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        </div>
                    </div>

                    {/* Widget 3: Crawler */}
                    <div className="bg-[#181B21] p-6 rounded-xl border border-[#2A2E37] relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crawler Service</span>
                            <span className="material-symbols-outlined text-yellow-500 text-sm">pause_circle</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Idle</h3>
                        <p className="text-[10px] text-yellow-500 font-bold tracking-wide">Paused by User</p>

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[#2A2E37] mt-6 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 w-[0%] rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">

                    {/* Map Area */}
                    <div className="lg:col-span-2 bg-[#181B21] rounded-xl border border-[#2A2E37] p-1 flex flex-col relative overflow-hidden">
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400 text-sm">public</span>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Live Node Map - ITS Campus</span>
                        </div>

                        <div className="absolute top-4 right-4 z-10">
                            <div className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-[10px] text-blue-400 font-bold">ACTIVE NODES: 1,240</div>
                        </div>

                        {/* Fake Map Background */}
                        <div className="flex-1 bg-[#232730] rounded-lg relative overflow-hidden opacity-80"
                            style={{
                                backgroundImage: 'radial-gradient(circle at center, #2A2E37 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}>
                            {/* Map Nodes */}
                            {nodes.map(node => (
                                <div
                                    key={node.id}
                                    className="absolute size-3 rounded-full"
                                    style={{
                                        top: `${node.y}%`,
                                        left: `${node.x}%`,
                                        backgroundColor: node.active ? '#3B82F6' : '#22C55E'
                                    }}
                                >
                                    <span className={`absolute inset-0 rounded-full ${node.active ? 'bg-blue-500' : 'bg-green-500'} animate-ping opacity-75`}></span>
                                </div>
                            ))}

                            {/* Decorative Map Label */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                                <h3 className="text-4xl font-bold text-white/5 uppercase tracking-[1em]">Surabaya</h3>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Traffic & Logs */}
                    <div className="flex flex-col gap-6">

                        {/* Traffic Chart */}
                        <div className="bg-[#181B21] rounded-xl border border-[#2A2E37] p-6 flex flex-col h-[45%]">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Traffic (Req/Min)</span>
                                <span className="text-[10px] text-gray-500">Live</span>
                            </div>
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-white font-mono">2,405</span>
                                <span className="text-xs text-gray-500 ml-1">RPM</span>
                                <p className="text-[10px] text-green-500 font-bold mt-1">+12% vs last 10m</p>
                            </div>

                            <div className="flex-1 -mx-2 -mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Logs Console */}
                        <div className="bg-[#0D1117] rounded-xl border border-[#2A2E37] flex flex-col flex-1 overflow-hidden font-mono text-[10px]">
                            <div className="bg-[#181B21] px-4 py-2 border-b border-[#2A2E37] flex justify-between items-center">
                                <span className="flex items-center gap-2 text-gray-400">
                                    <span className="material-symbols-outlined text-[14px]">terminal</span>
                                    system_logs.log
                                </span>
                                <div className="flex gap-1.5">
                                    <div className="size-2 rounded-full bg-red-500"></div>
                                    <div className="size-2 rounded-full bg-yellow-500"></div>
                                    <div className="size-2 rounded-full bg-green-500"></div>
                                </div>
                            </div>

                            <div className="p-4 space-y-2 overflow-y-auto text-gray-400">
                                <p><span className="text-gray-600">[10:10:45]</span> <span className="text-white">User #4922</span> authenticated via OAuth.</p>
                                <p><span className="text-gray-600">[10:10:42]</span> <span className="text-green-500">DB_Connection: Pool connection established.</span></p>
                                <p><span className="text-gray-600">[10:10:30]</span> Orchestrator: <span className="text-blue-400">Job #991 started.</span></p>
                                <p><span className="text-gray-600">[10:10:15]</span> <span className="text-yellow-500">WARN: Crawler service latency {'>'} 200ms.</span></p>
                                <p><span className="text-gray-600">[10:09:55]</span> API Gateway: Rate limit updated.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex gap-4">
                    {['Clear Cache', 'Restart Services', 'Export Logs'].map((action, i) => (
                        <button key={i} className="px-4 py-2 bg-[#181B21] border border-[#2A2E37] rounded-lg text-xs font-medium text-gray-300 hover:bg-[#2A2E37] hover:text-white transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">{i === 0 ? 'cached' : i === 1 ? 'restart_alt' : 'download'}</span>
                            {action}
                        </button>
                    ))}
                </div>

            </main>
        </div>
    );
}
