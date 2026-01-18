"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Building2,
    Users,
    TrendingUp,
    Award,
    BarChart3,
    Globe,
    Shield,
    Zap,
    Target,
    ChevronRight,
    Activity,
    PieChart,
    Layers,
    BookOpen,
    Briefcase,
    GraduationCap,
} from "lucide-react";

// Mock data for Rector Dashboard
const INSTITUTION_STATS = {
    totalStudents: 24500,
    totalFaculty: 890,
    totalStaff: 1250,
    faculties: 7,
    nationalRank: 8,
    worldRank: 451,
    accreditation: "Unggul",
};

const FACULTY_OVERVIEW = [
    { name: "FTEIC", students: 4250, score: 76, trend: "+4.2%", budget: 85 },
    { name: "FTI", students: 3800, score: 74, trend: "+3.1%", budget: 82 },
    { name: "FSAD", students: 2100, score: 72, trend: "+2.8%", budget: 78 },
    { name: "FTK", students: 3200, score: 71, trend: "+2.5%", budget: 80 },
    { name: "FMIPA", students: 2800, score: 73, trend: "+3.5%", budget: 76 },
    { name: "FV", students: 1500, score: 75, trend: "+4.0%", budget: 72 },
    { name: "FBMT", students: 1200, score: 70, trend: "+1.8%", budget: 74 },
];

const STRATEGIC_KPIS = [
    { name: "Student Development Index", current: 74.5, target: 80, unit: "pts" },
    { name: "Graduation Rate", current: 92.3, target: 95, unit: "%" },
    { name: "Industry Partnership", current: 156, target: 200, unit: "MoUs" },
    { name: "Research Publication", current: 1250, target: 1500, unit: "papers" },
    { name: "Student Satisfaction", current: 4.2, target: 4.5, unit: "/5.0" },
];

const ECOLOGICAL_HEALTH = [
    { layer: "Microsystem", score: 78, status: "healthy", description: "Direct learning environments" },
    { layer: "Mesosystem", score: 72, status: "needs_improvement", description: "Cross-system coordination" },
    { layer: "Exosystem", score: 85, status: "healthy", description: "Institutional policies" },
    { layer: "Macrosystem", score: 68, status: "needs_improvement", description: "External partnerships" },
    { layer: "Chronosystem", score: 81, status: "healthy", description: "Historical progress" },
];

const RECENT_DECISIONS = [
    { id: 1, title: "Implementasi Platform PPSDM Seluruh Fakultas", date: "15 Jan 2026", status: "approved" },
    { id: 2, title: "Alokasi Anggaran Q2 2026", date: "12 Jan 2026", status: "pending" },
    { id: 3, title: "Kerjasama dengan 5 Industri Baru", date: "10 Jan 2026", status: "approved" },
];

export default function RectorDashboardPage() {
    const [selectedTab, setSelectedTab] = useState<"overview" | "ecological" | "strategic">("overview");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 py-4">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                                <Shield className="size-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Executive Dashboard</h1>
                                <p className="text-slate-400 text-sm">Institut Teknologi Sepuluh Nopember</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right mr-4">
                                <p className="text-white font-medium">Prof. Dr. Ir. M. Ashari, M.Eng.</p>
                                <p className="text-slate-400 text-sm">Rektor ITS</p>
                            </div>
                            <Link href="/admin" className="bg-amber-600 px-4 py-2 rounded-lg hover:bg-amber-700 transition text-white text-sm">
                                ← Admin Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <div className="bg-slate-900/50 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1">
                        {[
                            { id: "overview", label: "Overview", icon: <PieChart className="size-4" /> },
                            { id: "ecological", label: "Ecological Health", icon: <Layers className="size-4" /> },
                            { id: "strategic", label: "Strategic KPIs", icon: <Target className="size-4" /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                                className={`flex items-center gap-2 px-4 py-3 font-medium transition border-b-2 ${selectedTab === tab.id
                                        ? "border-amber-500 text-amber-500"
                                        : "border-transparent text-slate-400 hover:text-white"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Executive Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                    <ExecCard icon={<GraduationCap />} label="Mahasiswa" value={INSTITUTION_STATS.totalStudents.toLocaleString()} color="blue" />
                    <ExecCard icon={<Users />} label="Dosen" value={INSTITUTION_STATS.totalFaculty} color="indigo" />
                    <ExecCard icon={<Briefcase />} label="Tendik" value={INSTITUTION_STATS.totalStaff.toLocaleString()} color="purple" />
                    <ExecCard icon={<Building2 />} label="Fakultas" value={INSTITUTION_STATS.faculties} color="teal" />
                    <ExecCard icon={<Award />} label="Akreditasi" value={INSTITUTION_STATS.accreditation} color="amber" />
                    <ExecCard icon={<TrendingUp />} label="Rank Nasional" value={`#${INSTITUTION_STATS.nationalRank}`} color="green" />
                    <ExecCard icon={<Globe />} label="Rank Dunia" value={`#${INSTITUTION_STATS.worldRank}`} color="pink" />
                </div>

                {selectedTab === "overview" && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Faculty Performance */}
                        <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Performa Fakultas</h2>
                                <Link href="/admin/faculties" className="text-amber-400 text-sm hover:underline flex items-center gap-1">
                                    Detail <ChevronRight className="size-4" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-slate-400 text-sm border-b border-slate-700">
                                            <th className="pb-3">Fakultas</th>
                                            <th className="pb-3">Mahasiswa</th>
                                            <th className="pb-3">Skor Holistik</th>
                                            <th className="pb-3">Trend</th>
                                            <th className="pb-3">Utilisasi Budget</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FACULTY_OVERVIEW.map((faculty, index) => (
                                            <motion.tr
                                                key={faculty.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-slate-700/50 text-white"
                                            >
                                                <td className="py-3 font-medium">{faculty.name}</td>
                                                <td className="py-3 text-slate-300">{faculty.students.toLocaleString()}</td>
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold">{faculty.score}</span>
                                                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                                                                style={{ width: `${faculty.score}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-green-400">{faculty.trend}</td>
                                                <td className="py-3">
                                                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${faculty.budget >= 80 ? "bg-green-500" : "bg-yellow-500"}`}
                                                            style={{ width: `${faculty.budget}%` }}
                                                        />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Decisions */}
                        <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Keputusan Terkini</h2>
                            <div className="space-y-3">
                                {RECENT_DECISIONS.map((decision) => (
                                    <div key={decision.id} className="bg-slate-700/30 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${decision.status === "approved" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                                }`}>
                                                {decision.status}
                                            </span>
                                            <span className="text-xs text-slate-500">{decision.date}</span>
                                        </div>
                                        <h4 className="text-white font-medium text-sm mt-2">{decision.title}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedTab === "ecological" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {ECOLOGICAL_HEALTH.map((layer, index) => (
                            <motion.div
                                key={layer.layer}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-slate-800/30 backdrop-blur rounded-2xl border p-6 ${layer.status === "healthy" ? "border-green-500/30" : "border-yellow-500/30"
                                    }`}
                            >
                                <div className={`size-12 rounded-xl flex items-center justify-center mb-4 ${layer.status === "healthy" ? "bg-green-500/20" : "bg-yellow-500/20"
                                    }`}>
                                    <Layers className={`size-6 ${layer.status === "healthy" ? "text-green-400" : "text-yellow-400"}`} />
                                </div>
                                <h3 className="text-white font-bold">{layer.layer}</h3>
                                <p className="text-slate-400 text-xs mt-1">{layer.description}</p>
                                <div className="mt-4">
                                    <div className="text-3xl font-bold text-white">{layer.score}</div>
                                    <div className="h-2 bg-slate-700 rounded-full mt-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${layer.status === "healthy" ? "bg-green-500" : "bg-yellow-500"}`}
                                            style={{ width: `${layer.score}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {selectedTab === "strategic" && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {STRATEGIC_KPIS.map((kpi, index) => {
                            const progress = (kpi.current / kpi.target) * 100;
                            const onTrack = progress >= 80;

                            return (
                                <motion.div
                                    key={kpi.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6"
                                >
                                    <h3 className="text-white font-medium mb-4">{kpi.name}</h3>
                                    <div className="flex items-end justify-between mb-2">
                                        <div>
                                            <span className="text-4xl font-bold text-white">{kpi.current}</span>
                                            <span className="text-slate-400 ml-1">{kpi.unit}</span>
                                        </div>
                                        <div className="text-right text-sm">
                                            <span className="text-slate-400">Target: </span>
                                            <span className="text-amber-400 font-medium">{kpi.target}{kpi.unit}</span>
                                        </div>
                                    </div>
                                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${onTrack ? "bg-green-500" : "bg-amber-500"}`}
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs">
                                        <span className={onTrack ? "text-green-400" : "text-amber-400"}>
                                            {Math.round(progress)}% achieved
                                        </span>
                                        <span className="text-slate-500">
                                            {onTrack ? "On Track" : "Needs Attention"}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

function ExecCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        purple: "from-purple-500 to-purple-600",
        teal: "from-teal-500 to-teal-600",
        amber: "from-amber-500 to-amber-600",
        green: "from-green-500 to-green-600",
        pink: "from-pink-500 to-pink-600",
    };

    return (
        <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-4 text-center">
            <div className={`size-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mx-auto mb-2`}>
                {icon}
            </div>
            <div className="text-xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </div>
    );
}
