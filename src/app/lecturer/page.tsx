"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    Users,
    BookOpen,
    BarChart3,
    MessageSquare,
    Clock,
    TrendingUp,
    Target,
    Award,
    Calendar,
    ChevronRight,
    Bell,
    Settings,
    Star,
    Activity,
} from "lucide-react";

// Mock data for lecturer dashboard
const COURSES = [
    {
        id: "IF3140",
        name: "Manajemen Proyek Perangkat Lunak",
        students: 45,
        avgProgress: 72,
        lastActivity: "2 jam lalu",
        engagement: 85,
    },
    {
        id: "IF3150",
        name: "Rekayasa Perangkat Lunak",
        students: 52,
        avgProgress: 68,
        lastActivity: "5 jam lalu",
        engagement: 78,
    },
    {
        id: "IF3160",
        name: "Basis Data Terdistribusi",
        students: 38,
        avgProgress: 81,
        lastActivity: "1 hari lalu",
        engagement: 92,
    },
];

const STUDENT_ALERTS = [
    {
        id: 1,
        student: "Ahmad Fauzi",
        issue: "Penurunan engagement 3 minggu berturut-turut",
        severity: "high",
        dimension: "cognitive",
    },
    {
        id: 2,
        student: "Siti Nurhaliza",
        issue: "Belum submit tugas 2 minggu",
        severity: "medium",
        dimension: "self_management",
    },
    {
        id: 3,
        student: "Budi Santoso",
        issue: "Skor mental health menurun 15%",
        severity: "high",
        dimension: "mental_health",
    },
];

const UPCOMING_SESSIONS = [
    { id: 1, title: "Kuliah IF3140", time: "09:00", date: "Senin, 20 Jan", room: "GKU 301" },
    { id: 2, title: "Office Hours", time: "13:00", date: "Senin, 20 Jan", room: "R. Dosen" },
    { id: 3, title: "Kuliah IF3150", time: "10:00", date: "Selasa, 21 Jan", room: "GKU 205" },
];

const DIMENSION_STATS = [
    { name: "Cognitive", avg: 74, trend: "+3%" },
    { name: "Self-Management", avg: 68, trend: "+1%" },
    { name: "Emotional", avg: 71, trend: "-2%" },
    { name: "Financial", avg: 62, trend: "+5%" },
];

export default function LecturerPortalPage() {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-3">
                                👨‍🏫 Portal Dosen
                            </h1>
                            <p className="text-indigo-200 mt-1">Selamat datang, Dr. Ahmad Wijaya, M.Sc.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                <Bell className="size-5" />
                                <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-xs rounded-full flex items-center justify-center">3</span>
                            </button>
                            <Link href="/settings" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                <Settings className="size-5" />
                            </Link>
                            <Link href="/dashboard" className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition text-sm">
                                ← Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={<BookOpen />} title="Total Mahasiswa" value="135" subtitle="di 3 mata kuliah" color="indigo" />
                    <StatCard icon={<Activity />} title="Avg Engagement" value="85%" subtitle="+5% dari bulan lalu" color="green" />
                    <StatCard icon={<MessageSquare />} title="Konsultasi Pending" value="8" subtitle="3 urgent" color="orange" />
                    <StatCard icon={<Award />} title="Student Success" value="92%" subtitle="lulus dengan baik" color="purple" />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Courses */}
                        <section className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Mata Kuliah Saya</h2>
                                <Link href="/lecturer/courses" className="text-indigo-600 text-sm hover:underline flex items-center gap-1">
                                    Lihat Semua <ChevronRight className="size-4" />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {COURSES.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`border rounded-xl p-4 cursor-pointer transition ${selectedCourse === course.id ? "border-indigo-500 bg-indigo-50" : "hover:border-indigo-300"
                                            }`}
                                        onClick={() => setSelectedCourse(course.id === selectedCourse ? null : course.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{course.id}</span>
                                                    <h3 className="font-semibold text-gray-800">{course.name}</h3>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="size-4" /> {course.students} mahasiswa
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="size-4" /> {course.lastActivity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-indigo-600">{course.engagement}%</div>
                                                <div className="text-xs text-gray-500">engagement</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Avg Progress</span>
                                                <span>{course.avgProgress}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                                                    style={{ width: `${course.avgProgress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {selectedCourse === course.id && (
                                            <div className="mt-4 pt-4 border-t flex gap-2">
                                                <Link href={`/lecturer/courses/${course.id}`} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                                                    Detail Kelas
                                                </Link>
                                                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                                                    Lihat Mahasiswa
                                                </button>
                                                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                                                    Analytics
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        {/* Student Alerts */}
                        <section className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                ⚠️ Early Warning System
                            </h2>
                            <div className="space-y-3">
                                {STUDENT_ALERTS.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`border-l-4 rounded-r-xl p-4 ${alert.severity === "high"
                                                ? "border-red-500 bg-red-50"
                                                : "border-yellow-500 bg-yellow-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{alert.student}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{alert.issue}</p>
                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded mt-2 inline-block">
                                                    {alert.dimension}
                                                </span>
                                            </div>
                                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                                                Take Action
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Dimension Analytics */}
                        <section className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Analisis Dimensi Mahasiswa</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {DIMENSION_STATS.map((dim) => (
                                    <div key={dim.name} className="border rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-700">{dim.name}</span>
                                            <span className={`text-sm ${dim.trend.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                                                {dim.trend}
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-3xl font-bold text-gray-800">{dim.avg}</span>
                                            <span className="text-gray-500 pb-1">/100</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                                                style={{ width: `${dim.avg}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="size-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                                    👨‍🏫
                                </div>
                                <div>
                                    <h3 className="font-bold">Dr. Ahmad Wijaya</h3>
                                    <p className="text-indigo-200 text-sm">Dept. Teknik Informatika</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Total Advisee</span>
                                    <span className="font-semibold">12 mahasiswa</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-indigo-200">Rating Konsultasi</span>
                                    <span className="font-semibold flex items-center gap-1">
                                        4.8 <Star className="size-3 text-yellow-400 fill-yellow-400" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Sessions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Calendar className="size-5 text-indigo-600" />
                                Jadwal Mendatang
                            </h2>
                            <div className="space-y-3">
                                {UPCOMING_SESSIONS.map((session) => (
                                    <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="size-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {session.time.split(":")[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-800 truncate">{session.title}</h4>
                                            <p className="text-xs text-gray-500">{session.date} • {session.room}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-2">
                                <QuickActionButton icon={<BarChart3 />} label="Analytics" href="/lecturer/analytics" />
                                <QuickActionButton icon={<MessageSquare />} label="Konsultasi" href="/lecturer/consultations" />
                                <QuickActionButton icon={<Target />} label="Set Goals" href="/lecturer/goals" />
                                <QuickActionButton icon={<TrendingUp />} label="Reports" href="/lecturer/reports" />
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
    subtitle,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtitle: string;
    color: string;
}) {
    const colorClasses: Record<string, string> = {
        indigo: "bg-indigo-50 text-indigo-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
        purple: "bg-purple-50 text-purple-600",
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className={`size-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-600">{title}</div>
            <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
        </div>
    );
}

function QuickActionButton({
    icon,
    label,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition text-gray-600"
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </Link>
    );
}
