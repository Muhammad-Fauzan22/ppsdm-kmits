"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Database,
    Bug,
    Cpu,
    Box,
    Play,
    Pause,
    RotateCcw,
    Trash2,
    FileText,
    Settings,
    Bell,
    HelpCircle,
    MoreVertical,
    CheckCircle,
    AlertCircle,
    Clock,
    Terminal,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";

// --- MOCK DATA ---
const QUEUE_ITEMS = [
    { id: "#1024", url: "https://example.com/docs/api/v2/endpoints", priority: "High", attempts: "1/3", status: "Processing", statusColor: "blue" },
    { id: "#1025", url: "https://example.com/blog/ai-trends-2024", priority: "Medium", attempts: "0/3", status: "Pending", statusColor: "gray" },
    { id: "#1023", url: "https://example.com/legal/terms", priority: "Low", attempts: "3/3", status: "Failed", statusColor: "red" },
    { id: "#1022", url: "https://internal-wiki/project-alpha", priority: "High", attempts: "0/3", status: "Completed", statusColor: "green" },
];

const LOGS = [
    { time: "14:02:18", level: "INFO", msg: "Connection restored. Data indexed successfully.", bg: "blue" },
    { time: "14:02:15", level: "ERR", msg: "Connection timeout to VectorDB instance (vdb-prod-02). Retrying...", bg: "red" },
    { time: "14:02:12", level: "EVENT", msg: "Chunking completed. 4 vectors generated. Sending to VectorDB.", bg: "purple" },
    { time: "14:02:08", level: "INFO", msg: "Resume crawling. Retry attempt 1/3 for source #1024.", bg: "blue" },
    { time: "14:02:05", level: "WARN", msg: "Rate limit detected on example.com, backing off 2000ms.", bg: "yellow" },
    { time: "14:02:03", level: "DEBUG", msg: "Parsing HTML content (24KB). Extracted 15 links.", bg: "green" },
    { time: "14:02:01", level: "INFO", msg: "Crawler initiated on worker-01. Target: #1024", bg: "blue" },
    { time: "14:02:01", level: "INFO", msg: "Orchestrator service initialized successfully.", bg: "blue" },
];

export default function OrchestratorPage() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-[#111318] text-[#111318] dark:text-white font-sans transition-colors duration-300">

            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-[#282e39] px-6 py-3 bg-white dark:bg-[#111318] sticky top-0 z-50 w-full shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="size-8 text-primary hover:opacity-80 transition-opacity">
                        <svg className="size-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                        </svg>
                    </Link>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KMM Orchestrator</h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <ActionButton icon={Settings} />
                        <ActionButton icon={Bell} />
                        <ActionButton icon={HelpCircle} />
                    </div>
                    <div className="h-8 w-[1px] bg-gray-300 dark:bg-[#3b4354]"></div>
                    <div className="flex items-center gap-2">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border border-gray-200 dark:border-[#3b4354]" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                        <div className="hidden sm:block">
                            <p className="text-sm font-bold leading-none">Admin User</p>
                            <p className="text-xs text-gray-500 dark:text-[#9da6b9]">DevOps Engineer</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 w-full overflow-hidden relative">

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-[#111318] custom-scrollbar">

                    {/* Breadcrumbs */}
                    <div className="px-6 pt-6 pb-2">
                        <div className="flex flex-wrap gap-2 items-center">
                            <Link href="/admin/dashboard" className="text-gray-500 dark:text-[#9da6b9] text-sm font-medium hover:text-primary transition-colors">Admin</Link>
                            <span className="text-gray-400 dark:text-[#585f6f] text-sm font-medium">/</span>
                            <span className="text-[#111318] dark:text-white text-sm font-medium">Orchestrator</span>
                        </div>
                    </div>

                    <div className="px-6 py-4 flex flex-col gap-6 max-w-[1400px] mx-auto w-full pb-20">
                        {/* Header & Stats */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111318] dark:text-white">Pipeline Status</h1>
                            <p className="text-gray-500 dark:text-[#9da6b9] text-sm md:text-base">Real-time monitoring of data ingestion and vectorization processes.</p>
                        </div>

                        {/* Pipeline Visualization (Top) */}
                        <div className="w-full bg-white dark:bg-[#1c1f27] rounded-xl border border-gray-200 dark:border-[#282e39] p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
                                {/* Connecting Line (Desktop) */}
                                <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-[#3b4354] -z-0"></div>

                                {/* Node 1: Sources */}
                                <PipelineNode icon={Database} label="Sources" sub="Connected (5)" color="green" />
                                <ArrowRight className="md:hidden text-gray-400 rotate-90" />

                                {/* Node 2: Crawler */}
                                <PipelineNode icon={Bug} label="Crawler" sub="Active (4 Threads)" color="primary" active />
                                <ArrowRight className="md:hidden text-gray-400 rotate-90" />

                                {/* Node 3: Processing */}
                                <PipelineNode icon={Cpu} label="Processing" sub="Idle" color="yellow" />
                                <ArrowRight className="md:hidden text-gray-400 rotate-90" />

                                {/* Node 4: Vector DB */}
                                <PipelineNode icon={Box} label="Vector DB" sub="Indexed (14k)" color="purple" />
                            </div>

                            {/* Throughput Mini Chart */}
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#282e39]">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-xs font-medium text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider">System Throughput (Last 1hr)</span>
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">98.2% Uptime</span>
                                </div>
                                <div className="h-24 w-full bg-gradient-to-b from-primary/10 to-transparent relative rounded overflow-hidden">
                                    {/* Simulated Chart */}
                                    <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <path d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50 V100 H0 Z" fill="url(#gradient)" opacity="0.4"></path>
                                        <path d="M0,80 Q10,75 20,85 T40,60 T60,70 T80,40 T100,50" fill="none" stroke="#135bec" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                                <stop offset="0%" style={{ stopColor: '#135bec', stopOpacity: 1 }}></stop>
                                                <stop offset="100%" style={{ stopColor: '#135bec', stopOpacity: 0 }}></stop>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Split View: Queue & Sidebar */}
                        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
                            {/* Queue Manager (Middle) */}
                            <div className="flex-1 flex flex-col bg-white dark:bg-[#1c1f27] rounded-xl border border-gray-200 dark:border-[#282e39] overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-gray-200 dark:border-[#282e39] flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-[#111318] dark:text-white">Queue Manager</h3>
                                    <div className="flex gap-2">
                                        <span className="bg-gray-100 dark:bg-[#282e39] text-gray-600 dark:text-[#9da6b9] text-xs font-mono px-2 py-1 rounded">Total: 42</span>
                                        <span className="bg-primary/20 text-primary text-xs font-mono px-2 py-1 rounded">Active: 3</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto flex-1 custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 dark:bg-[#20242d] sticky top-0 z-10">
                                            <tr>
                                                <Th>ID</Th>
                                                <Th>Source URL</Th>
                                                <Th align="center">Priority</Th>
                                                <Th align="center">Attempts</Th>
                                                <Th align="right">Status</Th>
                                                <Th align="right">Action</Th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-[#282e39] font-mono text-sm">
                                            {QUEUE_ITEMS.map((item, i) => (
                                                <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-[#222630] transition-colors">
                                                    <td className="p-3 text-gray-500 dark:text-[#6b7280]">{item.id}</td>
                                                    <td className="p-3 font-medium text-[#111318] dark:text-gray-200 max-w-[200px] truncate" title={item.url}>{item.url}</td>
                                                    <td className="p-3 text-center">
                                                        <span className={cn("inline-block size-2 rounded-full", item.priority === 'High' ? 'bg-red-500' : item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500')} title={item.priority}></span>
                                                    </td>
                                                    <td className="p-3 text-center text-gray-500">{item.attempts}</td>
                                                    <td className="p-3 text-right">
                                                        <StatusBadge status={item.status} color={item.statusColor} />
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button className="text-gray-400 hover:text-[#111318] dark:hover:text-white transition-colors">
                                                            <MoreVertical className="w-4 h-4 ml-auto" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Terminal / Logs (Bottom) */}
                        <div className="flex flex-col bg-[#0d1117] rounded-xl border border-gray-800 shadow-lg overflow-hidden min-h-[300px]">
                            <div className="px-4 py-2 bg-[#161b22] border-b border-gray-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-mono text-gray-300">System Logs</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input defaultChecked className="form-checkbox size-3 rounded border-gray-600 bg-transparent text-primary focus:ring-0" type="checkbox" />
                                        <span className="text-xs text-gray-400">Auto-scroll</span>
                                    </label>
                                    <button className="text-gray-400 hover:text-white"><FileText className="w-4 h-4" /></button>
                                    <button className="text-gray-400 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="p-4 font-mono text-xs md:text-sm overflow-y-auto h-[300px] custom-scrollbar text-gray-300 space-y-1">
                                {LOGS.map((log, i) => (
                                    <div key={i} className={cn("flex gap-2 hover:bg-white/5 px-1 rounded", log.level === 'ERR' ? "border-l-2 border-red-500 bg-red-500/5" : "")}>
                                        <span className="text-gray-500 w-[80px] shrink-0">[{log.time}]</span>
                                        <span className={cn("font-bold w-[50px] shrink-0",
                                            log.bg === 'blue' ? "text-blue-400" :
                                                log.bg === 'green' ? "text-green-400" :
                                                    log.bg === 'yellow' ? "text-yellow-500" :
                                                        log.bg === 'purple' ? "text-purple-400" : "text-red-500"
                                        )}>{log.level}</span>
                                        <span className={cn("text-gray-300", log.level === 'ERR' ? "text-red-200" : "")}>{log.msg}</span>
                                    </div>
                                ))}
                                <div className="animate-pulse h-4 w-2 bg-gray-500 ml-1 mt-1"></div>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="mt-auto py-6 text-center text-xs text-gray-500 dark:text-gray-600 border-t border-gray-200 dark:border-[#282e39]">
                            <p>© 2024 PPSDM KMM Orchestrator v2.1.0-build.445</p>
                        </footer>

                    </div>
                </main>

                {/* Sidebar / Toolbar (Right Flank) */}
                <aside className="w-[280px] bg-white dark:bg-[#161920] border-l border-gray-200 dark:border-[#282e39] flex-col hidden lg:flex">
                    <div className="p-6 flex flex-col gap-6">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Orchestration Controls</h3>
                            <div className="flex flex-col gap-3">
                                <button className="flex items-center justify-center gap-2 w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-[0_4px_14px_0_rgba(19,91,236,0.39)] transition-all active:scale-[0.98]">
                                    <Play className="w-5 h-5 fill-current" />
                                    Start Crawl
                                </button>
                                <button className="flex items-center justify-center gap-2 w-full h-10 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 font-bold rounded-lg border border-yellow-500/20 transition-all">
                                    <Pause className="w-5 h-5 fill-current" />
                                    Pause Pipeline
                                </button>
                            </div>
                        </div>
                        <div className="h-px bg-gray-200 dark:bg-[#282e39]"></div>
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Maintenance</h3>
                            <div className="flex flex-col gap-3">
                                <SidebarBtn icon={Trash2} label="Flush Cache" hover="text-red-400" />
                                <SidebarBtn icon={RotateCcw} label="Reset Workers" hover="text-primary" />
                                <SidebarBtn icon={Clock} label="View Audit Logs" hover="text-primary" />
                            </div>
                        </div>
                        <div className="mt-auto p-4 bg-gray-50 dark:bg-[#1c1f27] rounded-lg border border-gray-200 dark:border-[#282e39]">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Worker Status</span>
                                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>CPU Usage</span>
                                    <span className="text-[#111318] dark:text-white">45%</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-[#282e39] rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[45%] rounded-full"></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Memory</span>
                                    <span className="text-[#111318] dark:text-white">2.4GB / 8GB</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 dark:bg-[#282e39] rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[30%] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function ActionButton({ icon: Icon }: any) {
    return (
        <button className="flex items-center justify-center rounded-lg size-10 bg-gray-100 dark:bg-[#282e39] hover:bg-gray-200 dark:hover:bg-[#3b4354] transition-colors">
            <Icon className="w-5 h-5 text-[#111318] dark:text-white" />
        </button>
    )
}

function PipelineNode({ icon: Icon, label, sub, color, active }: any) {
    const isPrimary = color === 'primary';
    const isGreen = color === 'green';
    const isYellow = color === 'yellow';
    const isPurple = color === 'purple';

    const borderColor = isPrimary ? 'border-primary' : isGreen ? 'border-green-500' : isYellow ? 'border-yellow-500' : 'border-purple-500';
    const textColor = isPrimary ? 'text-primary' : isGreen ? 'text-green-500' : isYellow ? 'text-yellow-500' : 'text-purple-500';
    const shadowColor = isPrimary ? 'shadow-[0_0_15px_rgba(19,91,236,0.3)]' : isGreen ? 'shadow-[0_0_15px_rgba(34,197,94,0.3)]' : isYellow ? 'shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'shadow-[0_0_15px_rgba(168,85,247,0.2)]';

    return (
        <div className="relative z-10 flex flex-col items-center gap-3 group cursor-pointer w-full md:w-auto">
            <div className={cn("size-14 rounded-full bg-white dark:bg-[#1c1f27] border-2 flex items-center justify-center transition-transform group-hover:scale-110 relative", borderColor, shadowColor)}>
                {active && <span className="absolute top-0 right-0 size-3 bg-primary rounded-full animate-ping"></span>}
                <Icon className={cn("w-7 h-7", textColor)} />
            </div>
            <div className="text-center bg-white dark:bg-[#1c1f27] px-2 py-1 rounded">
                <h3 className="font-bold text-sm text-[#111318] dark:text-white">{label}</h3>
                <p className={cn("text-xs font-mono", active ? "text-primary" : "text-green-600 dark:text-green-400")}>{sub}</p>
            </div>
        </div>
    )
}

function Th({ children, align = "left" }: any) {
    return (
        <th className={cn("p-3 text-xs font-medium text-gray-500 dark:text-[#9da6b9] uppercase tracking-wider", align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left')}>
            {children}
        </th>
    )
}

function StatusBadge({ status, color }: any) {
    if (color === 'red') return <Badge text={status} className="bg-red-500/10 text-red-500 border-red-500/20" />;
    if (color === 'green') return <Badge text={status} className="bg-green-500/10 text-green-500 border-green-500/20" />;
    if (color === 'blue') return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/20">
            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span> {status}
        </span>
    );
    return <Badge text={status} className="bg-gray-100 dark:bg-[#3b4354] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#4b5563]" />;
}

function Badge({ text, className }: any) {
    return <span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border", className)}>{text}</span>
}

function SidebarBtn({ icon: Icon, label, hover }: any) {
    return (
        <button className="flex items-center justify-start gap-3 w-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282e39] rounded-lg transition-colors group">
            <Icon className={cn("w-5 h-5 text-gray-400 transition-colors", `group-hover:${hover.replace('text-', '')}`)} />
            {label}
        </button>
    )
}
