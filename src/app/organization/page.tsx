"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users,
    Calendar,
    Award,
    TrendingUp,
    Target,
    MessageSquare,
    PlusCircle,
    BarChart3,
    Activity,
    ChevronRight,
    Star,
    Clock,
    MapPin,
} from "lucide-react";

// Mock data
const ORGANIZATION_INFO = {
    name: "Himpunan Mahasiswa Informatika",
    shortName: "HMIF",
    type: "himpunan",
    members: 487,
    activeMembers: 342,
    totalEvents: 24,
    totalParticipants: 1250,
};

const RECENT_ACTIVITIES = [
    {
        id: 1,
        name: "Workshop AI & Machine Learning",
        date: "15 Jan 2026",
        participants: 120,
        dimensions: ["cognitive", "character_ethics"],
        impact: 4.5,
        status: "completed",
    },
    {
        id: 2,
        name: "Pelatihan Leadership BEM",
        date: "20 Jan 2026",
        participants: 45,
        dimensions: ["emotional_intelligence", "character_ethics"],
        impact: 4.8,
        status: "upcoming",
    },
    {
        id: 3,
        name: "Seminar Financial Planning",
        date: "25 Jan 2026",
        participants: 80,
        dimensions: ["financial"],
        impact: null,
        status: "planning",
    },
];

const MEMBER_DEVELOPMENT = [
    { dimension: "Leadership", score: 78, change: "+5%" },
    { dimension: "Communication", score: 82, change: "+3%" },
    { dimension: "Teamwork", score: 85, change: "+2%" },
    { dimension: "Problem Solving", score: 71, change: "+8%" },
];

const TOP_CONTRIBUTORS = [
    { name: "Rizky Pratama", role: "Kadept Pendidikan", xp: 2450, badge: "🏆" },
    { name: "Putri Anggraeni", role: "Kadept Sosial", xp: 2180, badge: "⭐" },
    { name: "Yusuf Rahman", role: "Kadept Minat Bakat", xp: 1950, badge: "🎯" },
];

export default function OrganizationPortalPage() {
    const [activeTab, setActiveTab] = useState<"activities" | "members" | "analytics">("activities");

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                                🏛️
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{ORGANIZATION_INFO.name}</h1>
                                <p className="text-emerald-200">{ORGANIZATION_INFO.shortName} • {ORGANIZATION_INFO.members} Anggota</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition">
                                <PlusCircle className="size-4" />
                                Buat Event
                            </button>
                            <Link href="/dashboard" className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">
                                ← Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={<Users />} title="Anggota Aktif" value={ORGANIZATION_INFO.activeMembers} total={ORGANIZATION_INFO.members} color="emerald" />
                    <StatCard icon={<Calendar />} title="Total Events" value={ORGANIZATION_INFO.totalEvents} subtitle="tahun ini" color="blue" />
                    <StatCard icon={<Activity />} title="Partisipan" value={ORGANIZATION_INFO.totalParticipants} subtitle="total peserta" color="purple" />
                    <StatCard icon={<Star />} title="Avg Impact" value="4.6" subtitle="dari 5.0" color="orange" />
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
                    {["activities", "members", "analytics"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as typeof activeTab)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === tab
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab === "activities" && "Kegiatan"}
                            {tab === "members" && "Anggota"}
                            {tab === "analytics" && "Analytics"}
                        </button>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === "activities" && (
                            <>
                                {/* Upcoming & Recent Activities */}
                                <section className="bg-white rounded-2xl shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-800">Kegiatan</h2>
                                        <Link href="/organization/activities" className="text-emerald-600 text-sm hover:underline flex items-center gap-1">
                                            Lihat Semua <ChevronRight className="size-4" />
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        {RECENT_ACTIVITIES.map((activity, index) => (
                                            <motion.div
                                                key={activity.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="border rounded-xl p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === "completed" ? "bg-green-100 text-green-700" :
                                                                    activity.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                                                                        "bg-gray-100 text-gray-700"
                                                                }`}>
                                                                {activity.status === "completed" ? "Selesai" :
                                                                    activity.status === "upcoming" ? "Mendatang" : "Planning"}
                                                            </span>
                                                            <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="size-4" /> {activity.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Users className="size-4" /> {activity.participants} peserta
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {activity.dimensions.map((dim) => (
                                                                <span key={dim} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                                                                    {dim.replace("_", " ")}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {activity.impact && (
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold text-emerald-600">{activity.impact}</div>
                                                            <div className="text-xs text-gray-500">impact score</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>

                                {/* Impact Assessment */}
                                <section className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-lg font-bold text-gray-800 mb-4">Impact per Dimensi</h2>
                                    <div className="space-y-4">
                                        {[
                                            { dimension: "Cognitive", events: 8, avgImpact: 4.2 },
                                            { dimension: "Character & Ethics", events: 12, avgImpact: 4.7 },
                                            { dimension: "Emotional Intelligence", events: 5, avgImpact: 4.5 },
                                            { dimension: "Financial", events: 3, avgImpact: 4.1 },
                                        ].map((dim) => (
                                            <div key={dim.dimension} className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium text-gray-700">{dim.dimension}</span>
                                                        <span className="text-gray-500">{dim.events} events | {dim.avgImpact} avg</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                                                            style={{ width: `${(dim.avgImpact / 5) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}

                        {activeTab === "members" && (
                            <section className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Perkembangan Anggota</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {MEMBER_DEVELOPMENT.map((dev) => (
                                        <div key={dev.dimension} className="border rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-gray-700">{dev.dimension}</span>
                                                <span className="text-sm text-green-600">{dev.change}</span>
                                            </div>
                                            <div className="text-3xl font-bold text-gray-800 mb-2">{dev.score}%</div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                                                    style={{ width: `${dev.score}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === "analytics" && (
                            <section className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border rounded-xl p-4 text-center">
                                        <div className="text-4xl font-bold text-emerald-600">1,250</div>
                                        <div className="text-sm text-gray-500">Total Partisipan</div>
                                    </div>
                                    <div className="border rounded-xl p-4 text-center">
                                        <div className="text-4xl font-bold text-teal-600">24</div>
                                        <div className="text-sm text-gray-500">Events Tahun Ini</div>
                                    </div>
                                    <div className="border rounded-xl p-4 text-center">
                                        <div className="text-4xl font-bold text-blue-600">4.6</div>
                                        <div className="text-sm text-gray-500">Avg Impact Score</div>
                                    </div>
                                    <div className="border rounded-xl p-4 text-center">
                                        <div className="text-4xl font-bold text-purple-600">78%</div>
                                        <div className="text-sm text-gray-500">Member Retention</div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Top Contributors */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                🏆 Top Contributors
                            </h2>
                            <div className="space-y-3">
                                {TOP_CONTRIBUTORS.map((member, index) => (
                                    <div key={member.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="size-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1">
                                                <h4 className="font-medium text-gray-800 truncate">{member.name}</h4>
                                                <span>{member.badge}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">{member.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-emerald-600">{member.xp}</div>
                                            <div className="text-xs text-gray-400">XP</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming Event */}
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                            <h3 className="font-bold mb-3">🗓️ Event Mendatang</h3>
                            <div className="bg-white/20 rounded-xl p-4">
                                <h4 className="font-semibold">Pelatihan Leadership BEM</h4>
                                <div className="flex items-center gap-2 mt-2 text-sm text-emerald-100">
                                    <Clock className="size-4" />
                                    <span>20 Jan 2026, 09:00</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-emerald-100">
                                    <MapPin className="size-4" />
                                    <span>Gedung Rektorat Lt. 3</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-sm text-emerald-100">
                                    <Users className="size-4" />
                                    <span>45 peserta terdaftar</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <Link href="/organization/events/new" className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition">
                                    <PlusCircle className="size-5" />
                                    <span className="font-medium">Tambah Event Baru</span>
                                </Link>
                                <Link href="/organization/members" className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition">
                                    <Users className="size-5" />
                                    <span className="font-medium">Kelola Anggota</span>
                                </Link>
                                <Link href="/organization/reports" className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition">
                                    <BarChart3 className="size-5" />
                                    <span className="font-medium">Generate Report</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({
    icon,
    title,
    value,
    total,
    subtitle,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    value: number | string;
    total?: number;
    subtitle?: string;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        emerald: "bg-emerald-50 text-emerald-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className={`size-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-800">{value}</span>
                {total && <span className="text-gray-400">/{total}</span>}
            </div>
            <div className="text-sm text-gray-600">{title}</div>
            {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
    );
}
