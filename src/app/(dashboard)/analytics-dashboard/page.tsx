"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { SystemHealthWidget } from '@/components/analytics/SystemHealthWidget';

// Mock analytics data
const weeklyProgress = [
    { week: 'W1', score: 45, activities: 3, xp: 120 },
    { week: 'W2', score: 52, activities: 5, xp: 180 },
    { week: 'W3', score: 58, activities: 8, xp: 290 },
    { week: 'W4', score: 64, activities: 12, xp: 420 },
    { week: 'W5', score: 68, activities: 10, xp: 380 },
    { week: 'W6', score: 72, activities: 15, xp: 520 },
];

const dimensionScores = [
    { name: 'Cognitive', current: 72, target: 80, national: 62 },
    { name: 'Self-Mgmt', current: 68, target: 75, national: 58 },
    { name: 'Financial', current: 55, target: 70, national: 48 },
    { name: 'Physical', current: 78, target: 80, national: 55 },
    { name: 'Emotional', current: 71, target: 78, national: 60 },
    { name: 'Mental', current: 64, target: 75, national: 54 },
    { name: 'Character', current: 75, target: 82, national: 68 },
    { name: 'Spiritual', current: 70, target: 78, national: 72 },
    { name: 'Environmental', current: 58, target: 70, national: 52 },
];

const activityBreakdown = [
    { name: 'Assessments', value: 35, color: '#6366f1' },
    { name: 'Courses', value: 25, color: '#10b981' },
    { name: 'AI Tutor', value: 20, color: '#f59e0b' },
    { name: 'Resources', value: 15, color: '#ef4444' },
    { name: 'Other', value: 5, color: '#6b7280' },
];

const dailyEngagement = [
    { day: 'Mon', minutes: 45, sessions: 2 },
    { day: 'Tue', minutes: 30, sessions: 1 },
    { day: 'Wed', minutes: 60, sessions: 3 },
    { day: 'Thu', minutes: 15, sessions: 1 },
    { day: 'Fri', minutes: 75, sessions: 4 },
    { day: 'Sat', minutes: 90, sessions: 5 },
    { day: 'Sun', minutes: 40, sessions: 2 },
];

export default function AnalyticsDashboardPage() {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

    // Calculate summary stats
    const totalXP = weeklyProgress.reduce((sum, w) => sum + w.xp, 0);
    const avgScore = Math.round(dimensionScores.reduce((sum, d) => sum + d.current, 0) / dimensionScores.length);
    const totalMinutes = dailyEngagement.reduce((sum, d) => sum + d.minutes, 0);
    const completionRate = Math.round((dimensionScores.filter(d => d.current >= d.target).length / dimensionScores.length) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                📊 Analytics Dashboard
                            </h1>
                            <p className="text-gray-400 mt-1">Track your learning journey and progress</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Time Range Selector */}
                            <div className="flex bg-gray-700 rounded-lg p-1">
                                {(['week', 'month', 'year'] as const).map(range => (
                                    <button
                                        key={range}
                                        onClick={() => setTimeRange(range)}
                                        className={`px-4 py-1.5 rounded text-sm transition ${timeRange === range
                                            ? 'bg-indigo-600 text-white'
                                            : 'text-gray-300 hover:text-white'
                                            }`}
                                    >
                                        {range.charAt(0).toUpperCase() + range.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                                ← Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* SYSTEM HEALTH WIDGET (New) */}
                    <div className="lg:col-span-2">
                        <SystemHealthWidget />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-5 shadow-lg flex flex-col justify-between"
                    >
                        <div>
                            <div className="text-gray-500 text-sm">Total XP</div>
                            <div className="text-3xl font-bold text-indigo-600 mt-1">{totalXP.toLocaleString()}</div>
                        </div>
                        <div className="text-green-500 text-sm mt-2 flex items-center gap-1">
                            <span>↑ 42%</span>
                            <span className="text-gray-400">from last month</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-5 shadow-lg flex flex-col justify-between"
                    >
                        <div>
                            <div className="text-gray-500 text-sm">Average Score</div>
                            <div className="text-3xl font-bold text-purple-600 mt-1">{avgScore}/100</div>
                        </div>
                        <div className="text-green-500 text-sm mt-2">↑ 8 points this month</div>
                    </motion.div>
                </div>

                {/* Charts Row 1 */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Progress Over Time */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">📈 Progress Over Time</h2>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyProgress}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="week" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#6366f1"
                                    fillOpacity={1}
                                    fill="url(#colorScore)"
                                    name="Avg Score"
                                />
                            </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Dimension Progress */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 Dimension Progress vs Target</h2>
                        <div style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dimensionScores} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="current" fill="#6366f1" name="Current" />
                                <Bar dataKey="target" fill="#10b981" name="Target" />
                            </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid lg:grid-cols-3 gap-8 mb-8">
                    {/* Activity Breakdown */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">🎨 Activity Breakdown</h2>
                        <div style={{ width: '100%', height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                <Pie
                                    data={activityBreakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                >
                                    {activityBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Daily Engagement */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">⏱️ Daily Engagement</h2>
                        <div style={{ width: '100%', height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyEngagement}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="minutes"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    name="Minutes"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="sessions"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Sessions"
                                />
                            </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Insights Section */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-6">💡 AI Insights</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/10 rounded-xl p-5">
                            <div className="text-3xl mb-3">📈</div>
                            <h3 className="font-bold mb-2">Growth Trend</h3>
                            <p className="text-indigo-100 text-sm">
                                Skor kamu naik 27 poin dalam 6 minggu terakhir.
                                Rata-rata peningkatan 4.5 poin/minggu.
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-5">
                            <div className="text-3xl mb-3">🎯</div>
                            <h3 className="font-bold mb-2">Focus Area</h3>
                            <p className="text-indigo-100 text-sm">
                                Financial dan Environmental adalah area dengan gap terbesar.
                                Prioritaskan untuk pengembangan.
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-5">
                            <div className="text-3xl mb-3">⭐</div>
                            <h3 className="font-bold mb-2">Strength</h3>
                            <p className="text-indigo-100 text-sm">
                                Physical Health adalah dimensi terkuatmu!
                                Kamu 23 poin di atas rata-rata nasional.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4 mt-8">
                    <Link
                        href="/gap-analysis"
                        className="flex-1 bg-blue-100 text-blue-700 py-4 rounded-xl text-center font-medium hover:bg-blue-200 transition"
                    >
                        📊 Gap Analysis
                    </Link>
                    <Link
                        href="/ai-report"
                        className="flex-1 bg-purple-100 text-purple-700 py-4 rounded-xl text-center font-medium hover:bg-purple-200 transition"
                    >
                        🤖 AI Report
                    </Link>
                    <Link
                        href="/weekly-plan"
                        className="flex-1 bg-green-100 text-green-700 py-4 rounded-xl text-center font-medium hover:bg-green-200 transition"
                    >
                        📅 Weekly Plan
                    </Link>
                </div>
            </main>
        </div>
    );
}
