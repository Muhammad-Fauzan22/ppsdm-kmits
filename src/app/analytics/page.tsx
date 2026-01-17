"use client";

import Link from "next/link";
import { GrowthLineChart, DimensionRadarChart, StatCard } from "@/components/Charts";

export default function AnalyticsPage() {
    const growthData = [
        { month: "Jan", score: 65 },
        { month: "Feb", score: 68 },
        { month: "Mar", score: 72 },
        { month: "Apr", score: 70 },
        { month: "May", score: 78 },
        { month: "Jun", score: 82 },
        { month: "Jul", score: 85 },
    ];

    const radarData = [
        { dimension: "Kognitif", score: 88, fullMark: 100 },
        { dimension: "Afektif", score: 72, fullMark: 100 },
        { dimension: "Psikomotorik", score: 80, fullMark: 100 },
        { dimension: "Spiritual", score: 90, fullMark: 100 },
        { dimension: "Sosial", score: 85, fullMark: 100 },
        { dimension: "Finansial", score: 60, fullMark: 100 },
        { dimension: "Kesehatan", score: 75, fullMark: 100 },
        { dimension: "Karakter", score: 88, fullMark: 100 },
        { dimension: "Lingkungan", score: 70, fullMark: 100 },
    ];

    const engagementData = [
        { month: "Week 1", score: 45 },
        { month: "Week 2", score: 52 },
        { month: "Week 3", score: 48 },
        { month: "Week 4", score: 61 },
        { month: "Week 5", score: 55 },
        { month: "Week 6", score: 67 },
        { month: "Week 7", score: 72 },
        { month: "Week 8", score: 78 },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">analytics</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Analytics Dashboard</h1>
                            <p className="text-xs text-gray-500">PPSDM KMITS Insights</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Semester</option>
                        <option>All Time</option>
                    </select>
                    <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Export
                    </button>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Students" value="1,247" change="+12%" changeType="positive" icon="group" />
                    <StatCard title="Active Programs" value="24" change="+3 this month" changeType="positive" icon="rocket_launch" />
                    <StatCard title="Avg. Growth Score" value="78.5" change="+5.2 pts" changeType="positive" icon="trending_up" />
                    <StatCard title="Completion Rate" value="89%" change="stable" changeType="neutral" icon="task_alt" />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Growth Trend */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-bold text-lg">Student Growth Trend</h3>
                                <p className="text-sm text-gray-500">Average score progression</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="size-3 rounded-full bg-primary"></span>
                                Score
                            </div>
                        </div>
                        <GrowthLineChart data={growthData} color="#330066" />
                    </div>

                    {/* Dimension Radar */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg">9 Dimensions Overview</h3>
                                <p className="text-sm text-gray-500">Cohort average by dimension</p>
                            </div>
                        </div>
                        <DimensionRadarChart data={radarData} />
                    </div>
                </div>

                {/* Engagement Chart */}
                <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-lg">Weekly Engagement</h3>
                            <p className="text-sm text-gray-500">Platform activity over time</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <GrowthLineChart data={engagementData} color="#27AE60" />
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top Performing Dimensions */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-growth-green">emoji_events</span>
                            Top Dimensions
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: "Spiritual", score: 90, color: "bg-purple-500" },
                                { name: "Kognitif", score: 88, color: "bg-blue-500" },
                                { name: "Karakter", score: 88, color: "bg-green-500" },
                            ].map((dim, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{dim.name}</span>
                                            <span className="font-bold">{dim.score}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.score}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Needs Improvement */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-active-yellow">warning</span>
                            Needs Attention
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: "Finansial", score: 60, color: "bg-red-500" },
                                { name: "Lingkungan", score: 70, color: "bg-yellow-500" },
                                { name: "Afektif", score: 72, color: "bg-orange-500" },
                            ].map((dim, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{dim.name}</span>
                                            <span className="font-bold">{dim.score}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.score}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-primary to-its-blue rounded-xl p-6 text-white">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">bolt</span>
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                <span className="font-medium">Add New Student</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">event</span>
                                <span className="font-medium">Schedule Program</span>
                            </button>
                            <button className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-3">
                                <span className="material-symbols-outlined text-[20px]">description</span>
                                <span className="font-medium">Generate Report</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
