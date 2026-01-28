"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import {
    LayoutDashboard,
    Target,
    BookOpen,
    User,
    Calendar,
    CloudSun,
    Zap,
    Clock,
    ChevronRight,
    Bookmark,
    Flame,
    Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ASSETS } from "@/config/assets";

import { createClient } from "@/lib/supabase/client";

export default function StudentDashboard() {
    const [dynamicResources, setDynamicResources] = React.useState<any[]>([]);
    const supabase = React.useMemo(() => createClient(), []);

    React.useEffect(() => {
        const fetchBooks = async () => {
            const { data } = await supabase.from('learning_resources').select('*').limit(5);
            if (data) {
                // Map Supabase 'learning_resources' to 'LearningContent' shape roughly
                const mapped = data.map((item: any) => ({
                    id: item.id || Math.random().toString(),
                    title: item.title,
                    type: 'Book' as const,
                    provider: item.author || 'Library',
                    language: 'id' as const,
                    url: item.file_url || '#',
                    tags: ['Dynamic'],
                    thumbnail: item.preview_url || 'https://source.unsplash.com/random/400x600?book'
                }));
                setDynamicResources(mapped);
            }
        };
        fetchBooks();
    }, [supabase]);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">

            {/* Side Navigation (Desktop) */}
            <aside className="w-64 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#111318]/90 backdrop-blur-md z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[28px]">hub</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Nexus</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Student Portal</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 flex flex-col gap-2 mt-4">
                    <NavItem icon={LayoutDashboard} label="Dashboard" active />
                    <NavItem icon={Target} label="Missions" />
                    <NavItem icon={BookOpen} label="Resources" />
                    <NavItem icon={User} label="Profile" />
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 bg-center bg-cover border border-slate-300 dark:border-slate-600" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                        <div className="flex flex-col">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Morgan</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Computer Science</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0"></div>
                <div className="absolute -top-[100px] right-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none z-0"></div>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto z-10 p-4 md:p-8 lg:p-10 scrollbar-thin">
                    <div className="max-w-7xl mx-auto flex flex-col gap-8">

                        {/* Header Row */}
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Good Morning, Alex
                                </h1>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm font-medium">Wednesday, Oct 25</span>
                                    <span className="mx-2">•</span>
                                    <CloudSun className="w-5 h-5 text-yellow-500" />
                                    <span className="text-sm font-medium">24°C</span>
                                </div>
                            </div>

                            {/* Mascot Tip Widget */}
                            <div className="flex items-end gap-4 max-w-md w-full lg:w-auto">
                                {/* Mascot Avatar */}
                                <div className="size-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shrink-0 shadow-lg shadow-indigo-500/20">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                        <div className="relative w-10 h-10">
                                            <Image src={ASSETS.mascot.seno_head} alt="Seno" fill className="object-contain" />
                                        </div>
                                    </div>
                                </div>
                                {/* Speech Bubble */}
                                <div className="relative bg-white dark:bg-[#282e39] p-4 rounded-2xl rounded-bl-none shadow-md border border-slate-100 dark:border-slate-700/50 flex-1">
                                    <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                                        &quot;Don&apos;t forget to check your <span className="text-primary font-bold">Spiritual axis</span> today! You&apos;re making great progress.&quot;
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                            {/* Left Column (Main Stats & content) */}
                            <div className="xl:col-span-8 flex flex-col gap-6">

                                {/* Radar Chart Widget */}
                                <div className="bg-white/60 dark:bg-[#161e2c]/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Holistic Development Radar</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Your growth across 9 core dimensions</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                            Balanced
                                        </div>
                                    </div>

                                    {/* Chart Area */}
                                    <div className="relative w-full h-[300px] flex items-center justify-center py-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                { subject: 'Intellectual', A: 85, fullMark: 100 },
                                                { subject: 'Spiritual', A: 62, fullMark: 100 },
                                                { subject: 'Physical', A: 78, fullMark: 100 },
                                                { subject: 'Social', A: 90, fullMark: 100 },
                                                { subject: 'Emotional', A: 72, fullMark: 100 },
                                            ]}>
                                                <PolarGrid stroke="#94a3b8" strokeOpacity={0.2} />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                <Radar name="Student" dataKey="A" stroke="#135bec" strokeWidth={3} fill="#135bec" fillOpacity={0.3} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Legend / Labels */}
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                                        <StatsPill label="Intellectual" value="85%" color="text-primary" />
                                        <StatsPill label="Spiritual" value="62%" color="text-yellow-500" />
                                        <StatsPill label="Physical" value="78%" color="text-primary" />
                                        <StatsPill label="Social" value="90%" color="text-primary" />
                                        <StatsPill label="Emotional" value="72%" color="text-primary" />
                                    </div>
                                </div>

                                {/* Resources Widget */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between px-1">
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended for You</h2>
                                        <button className="text-sm font-medium text-primary hover:text-blue-400 transition-colors">View All</button>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin snap-x">
                                        {/* Dynamic Recommendations from Supabase */}
                                        {dynamicResources.length > 0 && dynamicResources.map((res) => (
                                            <BookCard
                                                key={res.id}
                                                title={res.title}
                                                author={res.provider}
                                                img={res.thumbnail}
                                                url={res.url}
                                                badge="Your Library"
                                            />
                                        ))}

                                        {/* Fallback / Additional AI Recommendations */}
                                        {recommendResources({
                                            spiritual: 62,
                                            physical_health: 78,
                                            intellectual: 85,
                                            social: 90,
                                            emotional_intelligence: 72
                                        }, 'id', 4).map(rec => (
                                            rec.resources.map(res => (
                                                <BookCard
                                                    key={res.id}
                                                    title={res.title}
                                                    author={res.provider}
                                                    img={res.thumbnail || `https://source.unsplash.com/random/400x600?${res.tags[0]}`}
                                                    url={res.url}
                                                    badge={rec.reason.includes("prioritas") ? "Priority" : undefined}
                                                />
                                            ))
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column (Sidebar Widgets) */}
                            <div className="xl:col-span-4 flex flex-col gap-6">

                                {/* XP Tracker Widget */}
                                <div className="bg-white/60 dark:bg-[#161e2c]/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30">
                                            <Trophy className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-slate-900 dark:text-white">Level 4 Scholar</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Keep going, you&apos;re close!</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                                        <span>1250 XP</span>
                                        <span>2000 XP</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full" style={{ width: "62%" }}></div>
                                    </div>
                                    <p className="text-xs text-center mt-3 text-slate-400 dark:text-slate-500 font-medium">Next: Level 5 Visionary</p>
                                </div>

                                {/* Mission Card */}
                                <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] border border-slate-700 shadow-lg group">
                                    <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/random/800x600?meditation,space')" }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

                                    <div className="relative p-6 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className="px-2 py-1 rounded bg-white/10 backdrop-blur text-xs font-bold text-white border border-white/10">Recommended</span>
                                            <Bookmark className="w-5 h-5 text-white/50" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Spiritual Assessment</h3>
                                            <p className="text-sm text-slate-300">Complete your monthly reflection to unlock new insights.</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                                <Zap className="w-4 h-4" />
                                                <span>+150 XP</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                                <Clock className="w-4 h-4" />
                                                <span>10 min</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 mt-2 rounded-xl bg-primary hover:bg-blue-600 text-white font-bold transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
                                            <span>Start Mission</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/60 dark:bg-[#161e2c]/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 shadow-sm">
                                        <Flame className="w-8 h-8 text-orange-500 mb-1" />
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Day Streak</p>
                                    </div>
                                    <div className="bg-white/60 dark:bg-[#161e2c]/60 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 shadow-sm">
                                        <Trophy className="w-8 h-8 text-purple-500 mb-1" />
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">Badges</p>
                                    </div>
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

function NavItem({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <a href="#" className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors group",
            active ? "bg-primary/10 text-primary dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
        )}>
            <Icon className={cn("w-5 h-5", active ? "text-primary dark:text-blue-400" : "group-hover:text-slate-900 dark:group-hover:text-white transition-colors")} />
            <span>{label}</span>
        </a>
    )
}

function StatsPill({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="text-center p-2 rounded hover:bg-white/10 transition-colors cursor-default">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            <span className={cn("font-bold", color)}>{value}</span>
        </div>
    )
}

// Add import at the top
import { recommendResources } from "@/lib/resourceRecommender";

function BookCard({ title, author, img, url, badge }: { title: string, author: string, img: string, url?: string, badge?: string }) {
    return (
        <a href={url || "#"} target="_blank" rel="noopener noreferrer" className="snap-start shrink-0 w-[140px] md:w-[160px] flex flex-col gap-3 group cursor-pointer">
            <div className="aspect-[2/3] w-full rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-lg group-hover:-translate-y-1 transition-transform duration-300 relative">
                <Image src={img} alt={title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                {badge && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        {badge}
                    </div>
                )}
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{author}</p>
            </div>
        </a>
    )
}
