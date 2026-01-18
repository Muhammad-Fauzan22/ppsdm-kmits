"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users,
    Bug,
    Lightbulb,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    RefreshCw,
    Filter,
} from "lucide-react";

// Mock data for beta metrics
const BETA_METRICS = {
    totalUsers: 487,
    activeToday: 234,
    activationRate: 85,
    retention7d: 52,
    assessmentCompletion: 78,
    aiTutorUsage: 41,
    bugReportsPerDay: 4.2,
    npsScore: 48,
};

const FEEDBACK_DATA = [
    {
        id: "1",
        type: "bug",
        content: "Assessment tidak tersimpan setelah submit di halaman financial",
        category: "bug",
        status: "new",
        priority: "high",
        createdAt: "2026-01-18T10:30:00Z",
        user: "user_123",
    },
    {
        id: "2",
        type: "suggestion",
        content: "Tambahkan fitur dark mode untuk kenyamanan mata",
        category: "ui_ux",
        status: "in_progress",
        priority: "medium",
        createdAt: "2026-01-18T09:15:00Z",
        user: "user_456",
    },
    {
        id: "3",
        type: "praise",
        content: "AI Tutor sangat membantu! Saya bisa memahami konsep lebih cepat",
        category: "feature_request",
        status: "reviewed",
        priority: "low",
        createdAt: "2026-01-18T08:45:00Z",
        user: "user_789",
    },
    {
        id: "4",
        type: "bug",
        content: "Loading sangat lambat di halaman dashboard",
        category: "performance",
        status: "new",
        priority: "high",
        createdAt: "2026-01-17T22:00:00Z",
        user: "user_321",
    },
    {
        id: "5",
        type: "suggestion",
        content: "Bisa tambah notifikasi push untuk remind assessment?",
        category: "feature_request",
        status: "new",
        priority: "medium",
        createdAt: "2026-01-17T20:30:00Z",
        user: "user_654",
    },
];

const COHORT_DATA = [
    {
        id: "early-adopters",
        name: "Early Adopters",
        size: 100,
        active: 92,
        completionRate: 89,
        avgScore: 76,
        status: "active",
    },
    {
        id: "faculty-testers",
        name: "Faculty Testers",
        size: 50,
        active: 38,
        completionRate: 72,
        avgScore: 81,
        status: "active",
    },
    {
        id: "general-students",
        name: "General Students",
        size: 350,
        active: 245,
        completionRate: 65,
        avgScore: 68,
        status: "upcoming",
    },
];

const EXPERIMENT_DATA = [
    {
        id: "onboarding_flow",
        name: "Onboarding Experience",
        status: "running",
        variants: [
            { id: "control", name: "Current", users: 243, conversion: 72 },
            { id: "guided", name: "Guided Tour", users: 122, conversion: 81 },
            { id: "quick", name: "Quick Start", users: 122, conversion: 68 },
        ],
    },
];

export default function BetaDashboardPage() {
    const [feedbackFilter, setFeedbackFilter] = useState<string>("all");
    const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

    const filteredFeedback = feedbackFilter === "all"
        ? FEEDBACK_DATA
        : FEEDBACK_DATA.filter(f => f.type === feedbackFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-100 text-blue-700";
            case "in_progress": return "bg-yellow-100 text-yellow-700";
            case "reviewed": return "bg-green-100 text-green-700";
            case "resolved": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "bug": return <Bug className="size-4 text-red-500" />;
            case "suggestion": return <Lightbulb className="size-4 text-yellow-500" />;
            case "praise": return <CheckCircle className="size-4 text-green-500" />;
            default: return <AlertTriangle className="size-4 text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                📊 Beta Testing Dashboard
                            </h1>
                            <p className="text-gray-400 mt-1">Monitor beta cohorts, metrics, and feedback</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">
                                <RefreshCw className="size-4" />
                                Refresh
                            </button>
                            <Link href="/admin" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                                ← Admin
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
                    <MetricCard
                        title="Total Users"
                        value={BETA_METRICS.totalUsers}
                        icon={<Users className="size-5" />}
                        color="blue"
                    />
                    <MetricCard
                        title="Active Today"
                        value={BETA_METRICS.activeToday}
                        icon={<TrendingUp className="size-5" />}
                        color="green"
                    />
                    <MetricCard
                        title="Activation"
                        value={`${BETA_METRICS.activationRate}%`}
                        icon={<CheckCircle className="size-5" />}
                        color="purple"
                        target="> 70%"
                    />
                    <MetricCard
                        title="7-Day Retention"
                        value={`${BETA_METRICS.retention7d}%`}
                        icon={<Clock className="size-5" />}
                        color="teal"
                        target="> 40%"
                    />
                    <MetricCard
                        title="Assessment"
                        value={`${BETA_METRICS.assessmentCompletion}%`}
                        icon={<BarChart3 className="size-5" />}
                        color="orange"
                        target="> 60%"
                    />
                    <MetricCard
                        title="AI Usage"
                        value={`${BETA_METRICS.aiTutorUsage}%`}
                        icon={<Lightbulb className="size-5" />}
                        color="pink"
                        target="> 30%"
                    />
                    <MetricCard
                        title="Bugs/Day"
                        value={BETA_METRICS.bugReportsPerDay}
                        icon={<Bug className="size-5" />}
                        color="red"
                        target="< 10"
                    />
                    <MetricCard
                        title="NPS Score"
                        value={BETA_METRICS.npsScore}
                        icon={<TrendingUp className="size-5" />}
                        color="indigo"
                        target="> 40"
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cohorts */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Beta Cohorts</h2>
                            <div className="space-y-4">
                                {COHORT_DATA.map(cohort => (
                                    <div
                                        key={cohort.id}
                                        className="border rounded-xl p-4 hover:border-blue-300 transition"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold">{cohort.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${cohort.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                                }`}>
                                                {cohort.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Size:</span>
                                                <span className="ml-1 font-medium">{cohort.size}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Active:</span>
                                                <span className="ml-1 font-medium">{cohort.active}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Completion:</span>
                                                <span className="ml-1 font-medium">{cohort.completionRate}%</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Avg Score:</span>
                                                <span className="ml-1 font-medium">{cohort.avgScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* A/B Experiments */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">A/B Experiments</h2>
                            {EXPERIMENT_DATA.map(exp => (
                                <div key={exp.id} className="border rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold">{exp.name}</h3>
                                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                            {exp.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {exp.variants.map(variant => (
                                            <div key={variant.id} className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">{variant.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-500">{variant.users} users</span>
                                                    <span className={`font-semibold ${variant.conversion >= 75 ? "text-green-600" :
                                                            variant.conversion >= 60 ? "text-yellow-600" : "text-red-600"
                                                        }`}>
                                                        {variant.conversion}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Recent Feedback</h2>
                                <div className="flex items-center gap-2">
                                    <Filter className="size-4 text-gray-400" />
                                    <select
                                        value={feedbackFilter}
                                        onChange={(e) => setFeedbackFilter(e.target.value)}
                                        className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="bug">Bugs</option>
                                        <option value="suggestion">Suggestions</option>
                                        <option value="praise">Praise</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {filteredFeedback.map((feedback, index) => (
                                    <motion.div
                                        key={feedback.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`border rounded-xl p-4 cursor-pointer transition ${selectedFeedback === feedback.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                                            }`}
                                        onClick={() => setSelectedFeedback(
                                            selectedFeedback === feedback.id ? null : feedback.id
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">{getTypeIcon(feedback.type)}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-800 line-clamp-2">{feedback.content}</p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(feedback.status)}`}>
                                                        {feedback.status.replace("_", " ")}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {feedback.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(feedback.createdAt).toLocaleDateString("id-ID")}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${feedback.priority === "high" ? "bg-red-100 text-red-700" :
                                                    feedback.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                        "bg-gray-100 text-gray-600"
                                                }`}>
                                                {feedback.priority}
                                            </span>
                                        </div>

                                        {selectedFeedback === feedback.id && (
                                            <div className="mt-4 pt-4 border-t flex gap-2">
                                                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                                    Mark In Progress
                                                </button>
                                                <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                                                    Resolve
                                                </button>
                                                <button className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300">
                                                    Add Note
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>

                            {filteredFeedback.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No feedback found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MetricCard({
    title,
    value,
    icon,
    color,
    target,
}: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    target?: string;
}) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        teal: "bg-teal-50 text-teal-600",
        orange: "bg-orange-50 text-orange-600",
        pink: "bg-pink-50 text-pink-600",
        red: "bg-red-50 text-red-600",
        indigo: "bg-indigo-50 text-indigo-600",
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className={`size-8 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-2`}>
                {icon}
            </div>
            <div className="text-xl font-bold text-gray-800">{value}</div>
            <div className="text-xs text-gray-500">{title}</div>
            {target && (
                <div className="text-[10px] text-gray-400 mt-1">Target: {target}</div>
            )}
        </div>
    );
}
