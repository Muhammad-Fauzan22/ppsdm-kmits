"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface QuickLink {
    title: string;
    description: string;
    href: string;
    icon: string;
    color: string;
    badge?: string;
}

const quickLinks: QuickLink[] = [
    {
        title: "AI Tutor",
        description: "Chat dengan AI untuk bantuan belajar",
        href: "/ai-tutor",
        icon: "🤖",
        color: "from-purple-500 to-indigo-600",
        badge: "NEW",
    },
    {
        title: "Achievements",
        description: "Lihat badge dan pencapaian",
        href: "/achievements",
        icon: "🏆",
        color: "from-yellow-500 to-orange-600",
    },
    {
        title: "Learning Paths",
        description: "Jalur pembelajaran terstruktur",
        href: "/learning-paths",
        icon: "📚",
        color: "from-blue-500 to-cyan-600",
        badge: "NEW",
    },
    {
        title: "All Assessments",
        description: "9 dimensi penilaian diri",
        href: "/assessments",
        icon: "📋",
        color: "from-green-500 to-emerald-600",
    },
];

const assessmentLinks = [
    { title: "Cognitive", href: "/scientific-assessment", icon: "🧠" },
    { title: "Financial", href: "/financial-assessment", icon: "💰" },
    { title: "Physical Health", href: "/physical-health-assessment", icon: "💪" },
    { title: "Emotional", href: "/emotional-intelligence-assessment", icon: "💚" },
    { title: "Mental Health", href: "/mental-health-assessment", icon: "🧘" },
    { title: "Character", href: "/character-assessment", icon: "⚔️" },
    { title: "Spiritual", href: "/spiritual-assessment", icon: "🕊️" },
    { title: "Environmental", href: "/environmental-assessment", icon: "🌍" },
];

export default function QuickAccess() {
    return (
        <div className="space-y-6">
            {/* Main Quick Links */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span>⚡</span> Quick Access
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {quickLinks.map((link, index) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={link.href}
                                className="relative block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all group overflow-hidden"
                            >
                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                {link.badge && (
                                    <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 bg-red-500 text-white rounded">
                                        {link.badge}
                                    </span>
                                )}

                                <div className="text-2xl mb-2">{link.icon}</div>
                                <div className="font-semibold text-gray-800 dark:text-white text-sm">
                                    {link.title}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {link.description}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Assessment Quick Links */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <span>📊</span> Quick Assessments
                </h3>
                <div className="flex flex-wrap gap-2">
                    {assessmentLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg text-sm transition-colors"
                        >
                            <span>{link.icon}</span>
                            <span className="text-gray-700 dark:text-gray-300">{link.title}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Daily Streak */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-2xl font-bold flex items-center gap-2">
                            🔥 12 Day Streak
                        </div>
                        <div className="text-orange-100 text-sm mt-1">
                            Tetap konsisten untuk mendapatkan badge!
                        </div>
                    </div>
                    <div className="text-5xl">
                        💎
                    </div>
                </div>
            </div>
        </div>
    );
}
