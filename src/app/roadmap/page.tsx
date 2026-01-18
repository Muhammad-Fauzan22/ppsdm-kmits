"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Roadmap {
    id: string;
    primary_focus_dimensions: string[];
    secondary_focus_dimensions: string[];
    progress_percentage: number;
    personalized_message: string;
    target_completion_date: string;
}

interface Resource {
    id: string;
    title: string;
    description: string;
    source: string;
    resource_type: string;
    duration_minutes: number;
    target_dimensions: string[];
}

const dimensionMeta: Record<string, { name: string; icon: string; color: string }> = {
    cognitive: { name: "Kognitif", icon: "🧠", color: "#9B59B6" },
    emotional: { name: "Emosional", icon: "💚", color: "#48D1CC" },
    financial: { name: "Finansial", icon: "💰", color: "#F39C12" },
    physical: { name: "Fisik", icon: "💪", color: "#FF6B6B" },
    character: { name: "Karakter", icon: "⭐", color: "#5D6D7E" },
    spiritual: { name: "Spiritual", icon: "🕊️", color: "#AF7AC5" },
    environmental: { name: "Lingkungan", icon: "🌿", color: "#58D68D" },
    career: { name: "Karir", icon: "💼", color: "#2C3E50" },
};

export default function RoadmapPage() {
    const router = useRouter();
    const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRoadmap();
    }, []);

    const loadRoadmap = async () => {
        try {
            const res = await fetch("/api/roadmap");
            const data = await res.json();

            if (data.hasRoadmap) {
                setRoadmap(data.roadmap);
                setResources(data.recommendedResources || []);
            }
        } catch (error) {
            console.error("Error loading roadmap:", error);
            // Mock data
            setRoadmap({
                id: "1",
                primary_focus_dimensions: ["career", "financial"],
                secondary_focus_dimensions: ["cognitive", "emotional"],
                progress_percentage: 15,
                personalized_message: "Fokus utama Anda adalah pengembangan karir dan literasi finansial. Kami telah menyusun roadmap 6 bulan untuk membantu Anda mencapai tujuan ini.",
                target_completion_date: "2026-07-18",
            });
            setResources([
                { id: "1", title: "Resume Writing Masterclass", description: "Buat resume yang menarik perhatian recruiter", source: "LinkedIn Learning", resource_type: "course", duration_minutes: 60, target_dimensions: ["career"] },
                { id: "2", title: "Personal Finance 101", description: "Dasar-dasar perencanaan keuangan", source: "Khan Academy", resource_type: "course", duration_minutes: 120, target_dimensions: ["financial"] },
                { id: "3", title: "Interview Skills", description: "Teknik wawancara yang efektif", source: "YouTube", resource_type: "video", duration_minutes: 30, target_dimensions: ["career"] },
                { id: "4", title: "Critical Thinking", description: "Tingkatkan kemampuan berpikir kritis", source: "Coursera", resource_type: "course", duration_minutes: 180, target_dimensions: ["cognitive"] },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[var(--its-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!roadmap) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">📋</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Belum Ada Roadmap</h2>
                    <p className="text-gray-600 mb-6">Selesaikan assessment terlebih dahulu untuk mendapatkan roadmap pengembangan personal.</p>
                    <button
                        onClick={() => router.push("/comprehensive-assessment")}
                        className="w-full py-3 bg-gradient-to-r from-[var(--its-blue)] to-[var(--accent-blue)] text-white rounded-xl font-semibold"
                    >
                        Mulai Assessment →
                    </button>
                </div>
            </div>
        );
    }

    const weeklyGoals = [
        { id: 1, title: "Perbarui resume dengan format modern", completed: true, dimension: "career" },
        { id: 2, title: "Buat anggaran bulanan", completed: true, dimension: "financial" },
        { id: 3, title: "Selesaikan kursus Interview Skills", completed: false, dimension: "career" },
        { id: 4, title: "Baca 1 buku pengembangan diri", completed: false, dimension: "cognitive" },
        { id: 5, title: "Latihan public speaking 15 menit", completed: false, dimension: "emotional" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pb-24">
            {/* Header */}
            <header className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold">🗺️ Roadmap Pengembangan</h1>
                            <p className="text-green-100 mt-1">Perjalanan 6 bulan menuju versi terbaik Anda</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{roadmap.progress_percentage}%</div>
                            <div className="text-sm text-green-100">Progress</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${roadmap.progress_percentage}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Personalized Message */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-2xl">
                            🎯
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Pesan untuk Anda</h3>
                            <p className="text-gray-600">{roadmap.personalized_message}</p>
                        </div>
                    </div>
                </div>

                {/* Focus Dimensions */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">🔥 Area Fokus Utama</h3>
                    <div className="flex flex-wrap gap-3">
                        {roadmap.primary_focus_dimensions.map((dim) => {
                            const meta = dimensionMeta[dim] || { name: dim, icon: "📊", color: "#666" };
                            return (
                                <div
                                    key={dim}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
                                    style={{ backgroundColor: meta.color }}
                                >
                                    <span className="text-xl">{meta.icon}</span>
                                    <span className="font-medium">{meta.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {roadmap.secondary_focus_dimensions.length > 0 && (
                        <>
                            <h4 className="text-sm text-gray-500 mt-4 mb-2">Area Pendukung</h4>
                            <div className="flex flex-wrap gap-2">
                                {roadmap.secondary_focus_dimensions.map((dim) => {
                                    const meta = dimensionMeta[dim] || { name: dim, icon: "📊", color: "#666" };
                                    return (
                                        <span
                                            key={dim}
                                            className="px-3 py-1 rounded-full text-sm font-medium"
                                            style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
                                        >
                                            {meta.icon} {meta.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* Weekly Goals */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">📅 Target Minggu Ini</h3>
                        <span className="text-sm text-gray-500">{weeklyGoals.filter(g => g.completed).length}/{weeklyGoals.length} selesai</span>
                    </div>
                    <div className="space-y-3">
                        {weeklyGoals.map((goal) => {
                            const meta = dimensionMeta[goal.dimension] || { name: goal.dimension, icon: "📊", color: "#666" };
                            return (
                                <div
                                    key={goal.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition ${goal.completed ? "bg-green-50" : "bg-gray-50 hover:bg-gray-100"}`}
                                >
                                    <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${goal.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
                                        {goal.completed && "✓"}
                                    </button>
                                    <div className="flex-1">
                                        <span className={goal.completed ? "text-gray-500 line-through" : "text-gray-700"}>{goal.title}</span>
                                    </div>
                                    <span className="text-lg">{meta.icon}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recommended Resources */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">📚 Resources Rekomendasi</h3>
                    <div className="grid gap-4">
                        {resources.map((resource) => (
                            <motion.div
                                key={resource.id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-[var(--its-blue)] text-white rounded-xl flex items-center justify-center text-xl">
                                    {resource.resource_type === "video" ? "🎬" : resource.resource_type === "course" ? "📚" : "📄"}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{resource.title}</h4>
                                    <p className="text-sm text-gray-500">{resource.source} • {resource.duration_minutes} menit</p>
                                </div>
                                <button className="px-4 py-2 bg-[var(--its-blue)] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                    Mulai
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">🚀 Milestone 6 Bulan</h3>
                    <div className="space-y-4">
                        {[
                            { month: 1, title: "Fondasi", desc: "Membangun kebiasaan belajar harian", status: "current" },
                            { month: 2, title: "Eksplorasi", desc: "Mendalami area fokus utama", status: "upcoming" },
                            { month: 3, title: "Praktik", desc: "Menerapkan ilmu dalam proyek nyata", status: "upcoming" },
                            { month: 4, title: "Penguatan", desc: "Memperdalam skill yang sudah dipelajari", status: "upcoming" },
                            { month: 5, title: "Integrasi", desc: "Menggabungkan semua dimensi", status: "upcoming" },
                            { month: 6, title: "Evaluasi", desc: "Assessment ulang dan refleksi", status: "upcoming" },
                        ].map((milestone, index) => (
                            <div key={milestone.month} className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${milestone.status === "current" ? "bg-green-500" : "bg-gray-300"}`}>
                                    {milestone.month}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${milestone.status === "current" ? "text-green-600" : "text-gray-600"}`}>
                                        Bulan {milestone.month}: {milestone.title}
                                    </h4>
                                    <p className="text-sm text-gray-500">{milestone.desc}</p>
                                </div>
                                {milestone.status === "current" && (
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Sekarang</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <div className="flex justify-around">
                        {[
                            { href: "/dashboard", icon: "🏠", label: "Home" },
                            { href: "/gap-analysis", icon: "📊", label: "Gap" },
                            { href: "/roadmap", icon: "🗺️", label: "Roadmap", active: true },
                            { href: "/profile", icon: "👤", label: "Profile" },
                        ].map((item) => (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center ${item.active ? "text-green-600" : "text-gray-500"}`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="text-xs">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </div>
    );
}
