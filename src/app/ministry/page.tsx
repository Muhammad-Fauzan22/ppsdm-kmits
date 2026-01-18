"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Globe,
    Building,
    TrendingUp,
    Award,
    BarChart3,
    FileText,
    Download,
    Filter,
    ChevronRight,
    Target,
    Users,
    MapPin,
    BookOpen,
    Briefcase,
} from "lucide-react";

// Mock data for Ministry Dashboard
const NATIONAL_OVERVIEW = {
    totalInstitutions: 4500,
    totalStudents: 8500000,
    averageScore: 62.5,
    topPerformers: 45,
    policyComplianceRate: 78,
};

const REGIONAL_PERFORMANCE = [
    { region: "Jawa Timur", institutions: 450, avgScore: 68, students: 890000, trend: "+3.2%" },
    { region: "Jawa Barat", institutions: 520, avgScore: 65, students: 1100000, trend: "+2.8%" },
    { region: "DKI Jakarta", institutions: 380, avgScore: 72, students: 650000, trend: "+4.1%" },
    { region: "Jawa Tengah", institutions: 410, avgScore: 64, students: 780000, trend: "+2.5%" },
    { region: "Sumatera Utara", institutions: 280, avgScore: 61, students: 420000, trend: "+1.9%" },
    { region: "Sulawesi Selatan", institutions: 190, avgScore: 60, students: 280000, trend: "+2.1%" },
];

const TOP_INSTITUTIONS = [
    { rank: 1, name: "Institut Teknologi Bandung", score: 82.5, students: 28500, region: "Jawa Barat" },
    { rank: 2, name: "Universitas Indonesia", score: 81.2, students: 45000, region: "DKI Jakarta" },
    { rank: 3, name: "Universitas Gadjah Mada", score: 80.8, students: 52000, region: "DIY" },
    { rank: 4, name: "Institut Teknologi Sepuluh Nopember", score: 79.5, students: 24500, region: "Jawa Timur" },
    { rank: 5, name: "Institut Pertanian Bogor", score: 78.9, students: 32000, region: "Jawa Barat" },
];

const DIMENSION_BENCHMARKS = [
    { dimension: "Cognitive", national: 68, target: 75, gap: -7 },
    { dimension: "Self-Management", national: 65, target: 72, gap: -7 },
    { dimension: "Emotional Intelligence", national: 62, target: 70, gap: -8 },
    { dimension: "Financial Literacy", national: 58, target: 68, gap: -10 },
    { dimension: "Physical Health", national: 67, target: 75, gap: -8 },
    { dimension: "Mental Wellness", national: 63, target: 72, gap: -9 },
    { dimension: "Character & Ethics", national: 71, target: 80, gap: -9 },
    { dimension: "Spiritual", national: 75, target: 80, gap: -5 },
    { dimension: "Environmental", national: 60, target: 70, gap: -10 },
];

const POLICY_TRACKING = [
    { name: "Program Merdeka Belajar", compliance: 85, institutions: 3800, impact: "positive" },
    { name: "Standar Pengembangan Holistik", compliance: 62, institutions: 2800, impact: "in_progress" },
    { name: "Digital Literacy Initiative", compliance: 78, institutions: 3500, impact: "positive" },
    { name: "Mental Health Support", compliance: 55, institutions: 2400, impact: "needs_improvement" },
];

export default function MinistryDashboardPage() {
    const [selectedMetric, setSelectedMetric] = useState<"score" | "students" | "trend">("score");

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="bg-gradient-to-r from-red-900 to-red-950 border-b border-red-800 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-white/10 rounded-xl flex items-center justify-center">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Kemendikbudristek.png" alt="Kemendikbud" className="size-10 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Dashboard Nasional</h1>
                                <p className="text-red-200">Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-white">
                                <Download className="size-4" />
                                Export Data
                            </button>
                            <button className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-white">
                                <Filter className="size-4" />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* National Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <NationalStatCard icon={<Building />} label="Institusi" value={NATIONAL_OVERVIEW.totalInstitutions.toLocaleString()} color="red" />
                    <NationalStatCard icon={<Users />} label="Mahasiswa" value={`${(NATIONAL_OVERVIEW.totalStudents / 1000000).toFixed(1)}M`} color="blue" />
                    <NationalStatCard icon={<Target />} label="Avg Score" value={NATIONAL_OVERVIEW.averageScore.toFixed(1)} color="amber" />
                    <NationalStatCard icon={<Award />} label="Top Performers" value={NATIONAL_OVERVIEW.topPerformers} color="green" />
                    <NationalStatCard icon={<FileText />} label="Policy Compliance" value={`${NATIONAL_OVERVIEW.policyComplianceRate}%`} color="purple" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Regional Performance */}
                        <section className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Performa Regional</h2>
                                <div className="flex gap-2">
                                    {["score", "students", "trend"].map((metric) => (
                                        <button
                                            key={metric}
                                            onClick={() => setSelectedMetric(metric as typeof selectedMetric)}
                                            className={`px-3 py-1 rounded-lg text-sm transition ${selectedMetric === metric
                                                    ? "bg-red-600 text-white"
                                                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                                                }`}
                                        >
                                            {metric === "score" ? "Score" : metric === "students" ? "Students" : "Trend"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                {REGIONAL_PERFORMANCE.map((region, index) => (
                                    <motion.div
                                        key={region.region}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-slate-700/30 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                    <MapPin className="size-5 text-red-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-white">{region.region}</h3>
                                                    <p className="text-sm text-slate-400">{region.institutions} institusi</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {selectedMetric === "score" && (
                                                    <>
                                                        <div className="text-2xl font-bold text-white">{region.avgScore}</div>
                                                        <div className="text-xs text-slate-400">avg score</div>
                                                    </>
                                                )}
                                                {selectedMetric === "students" && (
                                                    <>
                                                        <div className="text-2xl font-bold text-white">{(region.students / 1000).toFixed(0)}K</div>
                                                        <div className="text-xs text-slate-400">mahasiswa</div>
                                                    </>
                                                )}
                                                {selectedMetric === "trend" && (
                                                    <>
                                                        <div className="text-2xl font-bold text-green-400">{region.trend}</div>
                                                        <div className="text-xs text-slate-400">growth</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {selectedMetric === "score" && (
                                            <div className="mt-3 h-2 bg-slate-600 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                                                    style={{ width: `${(region.avgScore / 100) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Dimension Benchmarks */}
                        <section className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-6">Benchmark 9 Dimensi Nasional</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {DIMENSION_BENCHMARKS.map((dim) => (
                                    <div key={dim.dimension} className="bg-slate-700/30 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-white">{dim.dimension}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${dim.gap >= -5 ? "bg-green-500/20 text-green-400" :
                                                    dim.gap >= -8 ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-red-500/20 text-red-400"
                                                }`}>
                                                {dim.gap}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-white">{dim.national}</span>
                                            <span className="text-slate-400 text-sm">/ {dim.target}</span>
                                        </div>
                                        <div className="mt-2 h-2 bg-slate-600 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${dim.gap >= -5 ? "bg-green-500" :
                                                        dim.gap >= -8 ? "bg-yellow-500" : "bg-red-500"
                                                    }`}
                                                style={{ width: `${(dim.national / dim.target) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Policy Tracking */}
                        <section className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-6">Tracking Kebijakan Nasional</h2>
                            <div className="space-y-4">
                                {POLICY_TRACKING.map((policy) => (
                                    <div key={policy.name} className="bg-slate-700/30 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-white">{policy.name}</h3>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${policy.impact === "positive" ? "bg-green-500/20 text-green-400" :
                                                    policy.impact === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                                                        "bg-yellow-500/20 text-yellow-400"
                                                }`}>
                                                {policy.impact === "positive" ? "Positive Impact" :
                                                    policy.impact === "in_progress" ? "In Progress" : "Needs Improvement"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                                            <span>{policy.institutions.toLocaleString()} institusi</span>
                                            <span>{policy.compliance}% compliance</span>
                                        </div>
                                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${policy.compliance >= 75 ? "bg-green-500" :
                                                        policy.compliance >= 60 ? "bg-blue-500" : "bg-yellow-500"
                                                    }`}
                                                style={{ width: `${policy.compliance}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Institutions */}
                        <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                🏆 Top 5 Institusi
                            </h2>
                            <div className="space-y-3">
                                {TOP_INSTITUTIONS.map((inst) => (
                                    <div key={inst.rank} className="bg-slate-700/30 rounded-xl p-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-white ${inst.rank === 1 ? "bg-gradient-to-br from-amber-400 to-amber-600" :
                                                    inst.rank === 2 ? "bg-gradient-to-br from-slate-300 to-slate-500" :
                                                        inst.rank === 3 ? "bg-gradient-to-br from-amber-700 to-amber-900" :
                                                            "bg-slate-600"
                                                }`}>
                                                {inst.rank}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-white text-sm truncate">{inst.name}</h4>
                                                <p className="text-xs text-slate-400">{inst.region}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-white">{inst.score}</div>
                                                <div className="text-xs text-slate-400">score</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Actions</h2>
                            <div className="space-y-2">
                                <Link href="/ministry/recommendations" className="flex items-center gap-3 p-3 bg-red-600/20 text-red-300 rounded-xl hover:bg-red-600/30 transition">
                                    <FileText className="size-5" />
                                    <span className="font-medium">Buat Rekomendasi</span>
                                </Link>
                                <Link href="/ministry/reports" className="flex items-center gap-3 p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition">
                                    <BarChart3 className="size-5" />
                                    <span className="font-medium">Generate Report</span>
                                </Link>
                                <Link href="/ministry/research" className="flex items-center gap-3 p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition">
                                    <BookOpen className="size-5" />
                                    <span className="font-medium">Research Data</span>
                                </Link>
                                <Link href="/ministry/partnerships" className="flex items-center gap-3 p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition">
                                    <Briefcase className="size-5" />
                                    <span className="font-medium">Industry Partnerships</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NationalStatCard({
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
        red: "from-red-500 to-red-600",
        blue: "from-blue-500 to-blue-600",
        amber: "from-amber-500 to-amber-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
    };

    return (
        <div className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-4">
            <div className={`size-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-slate-400">{label}</div>
        </div>
    );
}
