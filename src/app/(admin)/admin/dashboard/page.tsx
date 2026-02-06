"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Settings,
    Terminal,
    Shield,
    Search,
    Bell,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Database,
    Brain,
    Bug,
    Activity,
    RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
    const router = useRouter();
    const supabase = createClient();

    // State for interactive elements
    const [searchQuery, setSearchQuery] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [timeRange, setTimeRange] = useState<"1H" | "24H" | "7D">("1H");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Navigate to search results or filter dashboard
            console.log("Searching for:", searchQuery);
        }
    };

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsRefreshing(false);
    }, []);
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-sans selection:bg-primary selection:text-white transition-colors duration-300">

            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101622] flex flex-col justify-between p-4 z-20 transition-colors duration-300">
                <div className="flex flex-col gap-8">
                    {/* User Profile / Brand */}
                    <div className="flex items-center gap-3 px-2">
                        <div className="relative size-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img
                                alt="Admin Profile Picture"
                                className="w-full h-full object-cover"
                                src={ASSETS.avatar.student}
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#101622]"></div>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight tracking-wide">PPSDM KMM</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-normal">Global Admin</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        <NavItem href="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" active />
                        <NavItem href="/admin/users" icon={Users} label="User Management" />
                        <NavItem href="/admin/analytics" icon={TrendingUp} label="Analytics" />
                        <NavItem href="/admin/orchestrator" icon={Brain} label="Orchestrator" />
                        <NavItem href="/admin/logs" icon={Terminal} label="System Logs" />
                        <NavItem href="/admin/security" icon={Shield} label="Security" />
                    </nav>
                </div>

                {/* Footer / Settings */}
                <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                    <NavItem href="/admin/settings" icon={Settings} label="Settings" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors w-full text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <p className="text-sm font-medium">Logout</p>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light dark:bg-background-dark">

                {/* Top Header */}
                <header className="flex items-center justify-between h-16 px-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#101622]/95 backdrop-blur z-10 sticky top-0 transition-colors duration-300">
                    <div className="flex items-center gap-6">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" />
                            Command Center
                        </h2>
                        {/* Search Bar */}
                        <div className="relative group w-96 hidden md:block">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <form onSubmit={handleSearch}>
                                <input
                                    className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-[#1a2230] text-slate-900 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                                    placeholder="Search commands, users, or logs (Press '/')"
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2230] transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-[#101622] animate-pulse"></span>
                        </button>
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1a2230] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-50">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-3">Notifications</h4>
                                <div className="space-y-2">
                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300">New user registration pending</div>
                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300">System backup completed</div>
                                </div>
                            </div>
                        )}
                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">v2.4.0-stable</div>
                    </div>
                </header>

                {/* Scrollable Dashboard Content */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth scrollbar-thin">
                    <div className="max-w-[1600px] mx-auto flex flex-col gap-6 ">

                        {/* Row 1: Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <MetricCard
                                icon={Users} title="Total Active Users" value="12,450"
                                trend="+5.2%" trendUp={true} color="primary"
                            />
                            <MetricCard
                                icon={Database} title="System Uptime" value="99.99%"
                                trend="Stable" trendUp={true} color="green" isStatus
                            />
                            <MetricCard
                                icon={Activity} title="Server Load" value="42%"
                                trend="-1.5%" trendUp={false} color="orange"
                            />
                        </div>

                        {/* Row 2: Charts & Health (Main Visuals) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Chart Section (2/3) */}
                            <div className="lg:col-span-2 bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 flex flex-col h-[400px] shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Real-time API Requests (RPM)</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Monitoring gateway traffic across all nodes</p>
                                    </div>
                                    <div className="flex gap-2 bg-slate-100 dark:bg-[#101622] p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                                        <button
                                            onClick={() => setTimeRange("1H")}
                                            className={`px-3 py-1 text-xs font-medium rounded shadow-sm transition-colors ${timeRange === "1H" ? "text-white bg-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                        >1H</button>
                                        <button
                                            onClick={() => setTimeRange("24H")}
                                            className={`px-3 py-1 text-xs font-medium rounded shadow-sm transition-colors ${timeRange === "24H" ? "text-white bg-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                        >24H</button>
                                        <button
                                            onClick={() => setTimeRange("7D")}
                                            className={`px-3 py-1 text-xs font-medium rounded shadow-sm transition-colors ${timeRange === "7D" ? "text-white bg-primary" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                        >7D</button>
                                    </div>
                                </div>
                                <div className="flex-1 w-full relative group overflow-hidden">
                                    {/* Chart SVG */}
                                    {/* Used standard SVG for simplicity, mimicking the chart in the prompt */}
                                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#135bec" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#135bec" stopOpacity="0" />
                                            </linearGradient>
                                            <filter height="140%" id="glow" width="140%" x="-20%" y="-20%">
                                                <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur"></feMergeNode>
                                                    <feMergeNode in="SourceGraphic"></feMergeNode>
                                                </feMerge>
                                            </filter>
                                        </defs>
                                        {/* Grid lines */}
                                        <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="30" y2="30" className="dark:stroke-slate-800"></line>
                                        <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="70" y2="70" className="dark:stroke-slate-800"></line>
                                        <line stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="500" y1="110" y2="110" className="dark:stroke-slate-800"></line>

                                        {/* The Chart Line */}
                                        <path d="M0 120 C 50 120, 50 80, 100 80 C 150 80, 150 40, 200 60 C 250 80, 250 30, 300 30 C 350 30, 350 90, 400 70 C 450 50, 450 100, 500 90 L 500 150 L 0 150 Z" fill="url(#chartGradient)"></path>
                                        <path d="M0 120 C 50 120, 50 80, 100 80 C 150 80, 150 40, 200 60 C 250 80, 250 30, 300 30 C 350 30, 350 90, 400 70 C 450 50, 450 100, 500 90" fill="none" filter="url(#glow)" stroke="#135bec" strokeWidth="3" vectorEffect="non-scaling-stroke"></path>

                                        {/* Active Point */}
                                        <circle className="animate-pulse" cx="500" cy="90" fill="white" r="4" stroke="#135bec" strokeWidth="2"></circle>
                                    </svg>
                                    {/* Tooltip Simulation */}
                                    <div className="absolute top-[20%] left-[60%] bg-slate-900 border border-slate-700 p-2 rounded shadow-xl hidden group-hover:block pointer-events-none z-10">
                                        <p className="text-xs text-slate-400">10:45 AM</p>
                                        <p className="text-sm font-bold text-white">4,230 RPM</p>
                                    </div>
                                </div>
                                {/* X Axis Labels */}
                                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-4 px-2 font-mono">
                                    <span>08:00</span>
                                    <span>09:00</span>
                                    <span>10:00</span>
                                    <span>11:00</span>
                                    <span>12:00</span>
                                </div>
                            </div>

                            {/* System Health (1/3) */}
                            <div className="lg:col-span-1 flex flex-col gap-6">
                                <div className="bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 flex-1 flex flex-col shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Health</h3>
                                        <button onClick={handleRefresh}>
                                            <RefreshCw className={`w-5 h-5 text-slate-400 cursor-pointer hover:text-primary transition-colors ${isRefreshing ? "animate-spin" : ""}`} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col gap-4 flex-1 justify-center">
                                        <StatusItem icon={Database} label="Database" sub="PostgreSQL Cluster" status="Healthy" color="green" />
                                        <StatusItem icon={Brain} label="AI Engine" sub="Latency Spike > 200ms" status="Warning" color="orange" />
                                        <StatusItem icon={Bug} label="Crawler" sub="Scraping Node #4" status="Active" color="green" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Row 3: Map & Logs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
                            {/* ITS Map Simulation */}
                            <div className="bg-[#0f141e] border border-slate-700/50 rounded-xl p-6 flex flex-col relative overflow-hidden shadow-sm group">
                                <div className="absolute inset-0 bg-[#0f141e]">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity grayscale transition-transform duration-[60000ms] ease-linear group-hover:scale-110"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHAmmx0st0OrZLYnWS4LjvqYDFmS2vBFwCEyNcyvAKNkiix0m8G2JQTrt3LSNCygaG-tLnyTnghnypYRvoLMEbmEEElLJhvnKZTuC2W1w4nwkxugiQGzbfG5E3t50nLgfDfK8F5IibllA3R_AGOdvzGx_Y5zssLR174sbKed2LoJe2lJbGa2FRCFYXnGWBocfJSMXOZMPsLiN2-Gp4ua36C9u5iuUkbab9AUVldL6-tKPt4B2OEv1m0KgVqqP0VwoIZ9fqOJTElDE')" }}
                                    ></div>
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(19,91,236,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(19,91,236,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                </div>
                                <div className="relative z-10 flex justify-between items-start pointer-events-none">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">ITS Network Map</h3>
                                        <p className="text-slate-400 text-sm">Live User Nodes</p>
                                    </div>
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                </div>
                                {/* Simulated Pulsing Nodes */}
                                <PulseNode top="30%" left="20%" delay="0s" />
                                <PulseNode top="50%" left="45%" delay="0.5s" />
                                <PulseNode top="60%" left="70%" delay="1.2s" />
                                <PulseNode top="20%" right="30%" delay="0.8s" />
                                <PulseNode bottom="25%" left="30%" delay="1.5s" />
                            </div>

                            {/* Audit Logs */}
                            <div className="bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700/50 rounded-xl p-0 flex flex-col overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-[#1a2230] z-10">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Live Audit Log</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">System events stream</p>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm relative custom-scrollbar">
                                    <LogItem time="10:42:01" type="login" msg="Admin pps_sys initiated session." color="green" />
                                    <LogItem time="10:41:45" type="sync" msg="Crawler node #4 synched 1,024 records." color="blue" />
                                    <LogItem time="10:40:12" type="warning" msg="High latency detected in AI_Processor_02." color="orange" />
                                    <LogItem time="10:39:55" type="shield" msg="Firewall blocked connection from 192.168.0.x" color="purple" />
                                    <LogItem time="10:38:20" type="check" msg="Database backup completed successfully." color="green" />
                                    {/* Fade overlay */}
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-[#1a2230] to-transparent pointer-events-none"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}

// --- SUB COMPONENTS ---

function NavItem({ href, icon: Icon, label, active }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2230]"
            )}
        >
            <Icon className={cn("w-5 h-5", active ? "text-white" : "group-hover:text-primary transition-colors")} />
            <p className="text-sm font-medium">{label}</p>
        </Link>
    )
}

function MetricCard({ icon: Icon, title, value, trend, trendUp, color, isStatus }: any) {
    const colorClasses: any = {
        primary: { icon: "text-primary", bg: "bg-primary/10", trend: "text-green-500 bg-green-500/10" },
        green: { icon: "text-green-500", bg: "bg-green-500/10", trend: "text-green-500 bg-green-500/10" },
        orange: { icon: "text-orange-500", bg: "bg-orange-500/10", trend: "text-orange-500 bg-orange-500/10" },
    };
    const c = colorClasses[color] || colorClasses.primary;

    return (
        <div className="bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-primary/50 transition-all shadow-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className={cn("w-16 h-16", c.icon)} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</p>
            <div className="flex items-end gap-3">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
                <span className={cn("px-1.5 py-0.5 rounded text-xs font-bold mb-1 flex items-center gap-1", isStatus ? c.trend : (trendUp ? "text-green-500 bg-green-500/10" : "text-orange-500 bg-orange-500/10"))}>
                    {isStatus ? <CheckCircle className="w-3 h-3" /> : (trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
                    {trend}
                </span>
            </div>
        </div>
    )
}

function StatusItem({ icon: Icon, label, sub, status, color }: any) {
    const isHealthy = status === 'Healthy' || status === 'Active';
    const colorClass = color === 'green' ? 'text-green-500 bg-green-500' : 'text-orange-500 bg-orange-500';

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-[#101622] border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-[#1a2230] rounded-md border border-slate-200 dark:border-slate-700/50">
                    <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">{sub}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={cn("text-xs font-bold uppercase", color === 'green' ? "text-green-500" : "text-orange-500")}>{status}</span>
                <span className={cn("w-2.5 h-2.5 rounded-full animate-pulse", colorClass, status === 'Warning' ? "shadow-[0_0_10px_rgba(249,115,22,0.5)]" : "shadow-[0_0_10px_rgba(74,222,128,0.5)]")}></span>
            </div>
        </div>
    )
}

function PulseNode({ top, left, right, bottom, delay }: any) {
    const style: any = { animationDelay: delay };
    if (top) style.top = top;
    if (left) style.left = left;
    if (right) style.right = right;
    if (bottom) style.bottom = bottom;

    return (
        <div className="absolute w-2 h-2 bg-primary rounded-full z-0" style={style}>
            <div className="absolute -inset-1 bg-primary/50 rounded-full animate-ping" style={{ animationDuration: '2s', ...style }}></div>
        </div>
    )
}

function LogItem({ time, type, msg, color }: any) {
    return (
        <div className="flex items-start gap-3 p-2 rounded hover:bg-slate-100 dark:hover:bg-[#151b26] transition-colors">
            <span className="text-slate-500 text-xs min-w-[60px] pt-0.5 font-mono">{time}</span>
            <div className={cn("text-sm",
                color === 'green' ? "text-green-500" :
                    color === 'blue' ? "text-blue-500" :
                        color === 'orange' ? "text-orange-500" : "text-purple-500"
            )}>
                {type === 'login' && <span className="material-symbols-outlined text-sm">login</span>}
                {type === 'sync' && <RefreshCw className="w-3.5 h-3.5" />}
                {type === 'warning' && <span className="material-symbols-outlined text-sm">warning</span>}
                {type === 'shield' && <Shield className="w-3.5 h-3.5" />}
                {type === 'check' && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
            <p className="text-slate-700 dark:text-slate-300">{msg}</p>
        </div>
    )
}
