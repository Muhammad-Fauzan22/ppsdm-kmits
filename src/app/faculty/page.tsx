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
    FileText,
    Settings,
    Bell,
    ChevronRight,
    Target,
    BookOpen,
    Briefcase,
    GraduationCap,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

// Mock data for Faculty Dean Dashboard
const FACULTY_INFO = {
    name: "Fakultas Teknologi Elektro dan Informatika Cerdas",
    shortName: "FTEIC",
    departments: 6,
    totalStudents: 4250,
    totalLecturers: 187,
    accreditation: "A",
};

const DEPARTMENT_METRICS = [
    { name: "Teknik Informatika", students: 1250, avgScore: 76, growth: "+5%", status: "excellent" },
    { name: "Teknik Komputer", students: 890, avgScore: 72, growth: "+3%", status: "good" },
    { name: "Sistem Informasi", students: 780, avgScore: 74, growth: "+4%", status: "good" },
    { name: "Teknologi Informasi", students: 650, avgScore: 71, growth: "+2%", status: "needs_attention" },
    { name: "Data Science", students: 420, avgScore: 78, growth: "+8%", status: "excellent" },
    { name: "Teknik Elektro", students: 260, avgScore: 73, growth: "+1%", status: "good" },
];

const DIMENSION_OVERVIEW = [
    { dimension: "Cognitive", facultyAvg: 74, nationalBenchmark: 68, status: "above" },
    { dimension: "Self-Management", facultyAvg: 71, nationalBenchmark: 65, status: "above" },
    { dimension: "Financial", facultyAvg: 62, nationalBenchmark: 58, status: "above" },
    { dimension: "Emotional", facultyAvg: 69, nationalBenchmark: 70, status: "below" },
    { dimension: "Mental Health", facultyAvg: 66, nationalBenchmark: 63, status: "above" },
    { dimension: "Physical", facultyAvg: 64, nationalBenchmark: 67, status: "below" },
];

const RECENT_POLICIES = [
    { id: 1, title: "Kebijakan Asesmen Holistik Wajib", status: "active", compliance: 87 },
    { id: 2, title: "Program Mentorship Lintas Departemen", status: "review", compliance: 65 },
    { id: 3, title: "Standar Minimum Pengembangan Mahasiswa", status: "draft", compliance: null },
];

const RESOURCE_ALLOCATION = [
    { category: "Program Pengembangan", allocated: 850000000, utilized: 680000000 },
    { category: "Fasilitas & Infrastruktur", allocated: 1200000000, utilized: 1050000000 },
    { category: "Pelatihan Dosen", allocated: 450000000, utilized: 320000000 },
];

export default function FacultyDeanPortalPage() {
    const [selectedDept, setSelectedDept] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
            {/* Header */}
            <header className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Building2 className="size-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">{FACULTY_INFO.name}</h1>
                                <p className="text-slate-400">Dashboard Dekan | Akreditasi {FACULTY_INFO.accreditation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition text-white">
                                <Bell className="size-5" />
                                <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-xs rounded-full flex items-center justify-center">5</span>
                            </button>
                            <Link href="/settings" className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition text-white">
                                <Settings className="size-5" />
                            </Link>
                            <Link href="/admin" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition text-white text-sm">
                                Admin Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Executive Summary */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <ExecStatCard icon={<GraduationCap />} title="Total Mahasiswa" value={FACULTY_INFO.totalStudents.toLocaleString()} color="blue" />
                    <ExecStatCard icon={<Users />} title="Dosen" value={FACULTY_INFO.totalLecturers} color="indigo" />
                    <ExecStatCard icon={<Building2 />} title="Departemen" value={FACULTY_INFO.departments} color="purple" />
                    <ExecStatCard icon={<TrendingUp />} title="Avg Growth" value="+4.2%" color="green" />
                    <ExecStatCard icon={<Award />} title="Akreditasi" value="A" subtitle="LAMEMBA" color="yellow" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Department Performance */}
                        <section className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-bold text-white">Kinerja Departemen</h2>
                                <Link href="/faculty/departments" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                                    Detail <ChevronRight className="size-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {DEPARTMENT_METRICS.map((dept, index) => (
                                    <motion.div
                                        key={dept.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`rounded-xl p-4 cursor-pointer transition ${selectedDept === dept.name
                                                ? "bg-blue-600/20 border border-blue-500"
                                                : "bg-slate-700/50 hover:bg-slate-700"
                                            }`}
                                        onClick={() => setSelectedDept(selectedDept === dept.name ? null : dept.name)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-3 rounded-full ${dept.status === "excellent" ? "bg-green-500" :
                                                        dept.status === "good" ? "bg-blue-500" : "bg-yellow-500"
                                                    }`} />
                                                <div>
                                                    <h3 className="font-medium text-white">{dept.name}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-slate-400">
                                                        <span>{dept.students} mahasiswa</span>
                                                        <span className="text-green-400">{dept.growth}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">{dept.avgScore}</div>
                                                <div className="text-xs text-slate-400">avg score</div>
                                            </div>
                                        </div>
                                        {selectedDept === dept.name && (
                                            <div className="mt-4 pt-4 border-t border-slate-600 flex gap-2">
                                                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                                    Lihat Detail
                                                </button>
                                                <button className="px-3 py-1.5 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-500">
                                                    Analytics
                                                </button>
                                                <button className="px-3 py-1.5 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-500">
                                                    Alokasi Sumber Daya
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Dimension Comparison with National Benchmark */}
                        <section className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-6">Perbandingan dengan Benchmark Nasional</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {DIMENSION_OVERVIEW.map((dim) => (
                                    <div key={dim.dimension} className="bg-slate-700/50 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-white">{dim.dimension}</span>
                                            {dim.status === "above" ? (
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <CheckCircle className="size-3" /> Above
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <AlertTriangle className="size-3" /> Below
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-end gap-4">
                                            <div>
                                                <div className="text-3xl font-bold text-white">{dim.facultyAvg}</div>
                                                <div className="text-xs text-slate-400">Fakultas</div>
                                            </div>
                                            <div className="text-slate-500">vs</div>
                                            <div>
                                                <div className="text-xl font-semibold text-slate-400">{dim.nationalBenchmark}</div>
                                                <div className="text-xs text-slate-500">Nasional</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 h-2 bg-slate-600 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${dim.status === "above" ? "bg-green-500" : "bg-yellow-500"}`}
                                                style={{ width: `${(dim.facultyAvg / 100) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Resource Allocation */}
                        <section className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-6">Alokasi & Utilisasi Sumber Daya</h2>
                            <div className="space-y-4">
                                {RESOURCE_ALLOCATION.map((res) => {
                                    const percentage = Math.round((res.utilized / res.allocated) * 100);
                                    return (
                                        <div key={res.category} className="bg-slate-700/50 rounded-xl p-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium text-white">{res.category}</span>
                                                <span className="text-sm text-slate-400">
                                                    Rp {(res.utilized / 1000000).toFixed(0)}M / {(res.allocated / 1000000).toFixed(0)}M
                                                </span>
                                            </div>
                                            <div className="h-3 bg-slate-600 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${percentage >= 80 ? "bg-green-500" :
                                                            percentage >= 50 ? "bg-blue-500" : "bg-yellow-500"
                                                        }`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="text-right text-sm text-slate-400 mt-1">{percentage}% utilized</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                    👨‍💼
                                </div>
                                <div>
                                    <h3 className="font-bold">Prof. Dr. Suhartono</h3>
                                    <p className="text-blue-200 text-sm">Dekan FTEIC</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-200">Periode Jabatan</span>
                                    <span>2024-2028</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-200">Rating Kinerja</span>
                                    <span>4.8/5.0 ⭐</span>
                                </div>
                            </div>
                        </div>

                        {/* Active Policies */}
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="size-5 text-blue-400" />
                                Kebijakan Aktif
                            </h2>
                            <div className="space-y-3">
                                {RECENT_POLICIES.map((policy) => (
                                    <div key={policy.id} className="bg-slate-700/50 rounded-xl p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="text-sm font-medium text-white truncate pr-2">{policy.title}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${policy.status === "active" ? "bg-green-500/20 text-green-400" :
                                                    policy.status === "review" ? "bg-yellow-500/20 text-yellow-400" :
                                                        "bg-slate-500/20 text-slate-400"
                                                }`}>
                                                {policy.status}
                                            </span>
                                        </div>
                                        {policy.compliance !== null && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${policy.compliance >= 80 ? "bg-green-500" : "bg-yellow-500"}`}
                                                        style={{ width: `${policy.compliance}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">{policy.compliance}%</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-2">
                                <Link href="/faculty/reports" className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition text-white">
                                    <BarChart3 className="size-5" />
                                    <span className="text-xs">Reports</span>
                                </Link>
                                <Link href="/faculty/policies" className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition text-white">
                                    <FileText className="size-5" />
                                    <span className="text-xs">Policies</span>
                                </Link>
                                <Link href="/faculty/resources" className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition text-white">
                                    <Briefcase className="size-5" />
                                    <span className="text-xs">Resources</span>
                                </Link>
                                <Link href="/faculty/quality" className="flex flex-col items-center gap-2 p-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition text-white">
                                    <Target className="size-5" />
                                    <span className="text-xs">Quality</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ExecStatCard({
    icon,
    title,
    value,
    subtitle,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        blue: "from-blue-500 to-blue-600",
        indigo: "from-indigo-500 to-indigo-600",
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-green-600",
        yellow: "from-yellow-500 to-yellow-600",
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700 p-4">
            <div className={`size-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-sm text-slate-400">{title}</div>
            {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
        </div>
    );
}
