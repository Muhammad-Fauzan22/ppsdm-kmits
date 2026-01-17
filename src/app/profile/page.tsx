"use client";

import Link from "next/link";
import { DimensionRadarChart } from "@/components/Charts";

export default function ProfilePage() {
    const radarData = [
        { dimension: "Kognitif", score: 88, fullMark: 100 },
        { dimension: "Afektif", score: 75, fullMark: 100 },
        { dimension: "Psikomotorik", score: 82, fullMark: 100 },
        { dimension: "Spiritual", score: 95, fullMark: 100 },
        { dimension: "Sosial", score: 85, fullMark: 100 },
        { dimension: "Finansial", score: 60, fullMark: 100 },
        { dimension: "Kesehatan", score: 78, fullMark: 100 },
        { dimension: "Karakter", score: 90, fullMark: 100 },
        { dimension: "Lingkungan", score: 70, fullMark: 100 },
    ];

    const badges = [
        { icon: "school", name: "Dean's List", color: "bg-yellow-500" },
        { icon: "groups", name: "Team Player", color: "bg-blue-500" },
        { icon: "fitness_center", name: "Wellness Warrior", color: "bg-green-500" },
        { icon: "lightbulb", name: "Innovator", color: "bg-purple-500" },
    ];

    const achievements = [
        { title: "Completed Leadership Training", date: "Mar 2024", points: 50 },
        { title: "Published Research Paper", date: "Feb 2024", points: 100 },
        { title: "Organized Campus Event", date: "Jan 2024", points: 75 },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Header Banner */}
            <div className="h-48 bg-gradient-to-r from-primary via-primary-light to-its-blue relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Link
                    href="/dashboard"
                    className="absolute top-4 left-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back to Dashboard
                </Link>
            </div>

            <main className="max-w-5xl mx-auto px-6 -mt-20 pb-12 space-y-6 relative z-10">
                {/* Profile Card */}
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                        {/* Avatar */}
                        <div className="relative">
                            <div
                                className="size-32 rounded-full bg-cover bg-center border-4 border-white dark:border-card-dark shadow-xl"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI")',
                                }}
                            ></div>
                            <div className="absolute bottom-0 right-0 size-10 bg-growth-green rounded-full flex items-center justify-center text-white border-4 border-white dark:border-card-dark shadow">
                                <span className="material-symbols-outlined text-lg">verified</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-2xl md:text-3xl font-bold">Rian Santoso</h1>
                            <p className="text-gray-500 mt-1">Informatics Engineering • Semester 5</p>
                            <p className="text-sm text-gray-400 font-mono mt-0.5">NRP: 5025201001</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                    Active Member
                                </span>
                                <span className="px-3 py-1 bg-growth-green/10 text-growth-green rounded-full text-sm font-medium">
                                    Level 12
                                </span>
                                <span className="px-3 py-1 bg-active-yellow/10 text-yellow-700 rounded-full text-sm font-medium">
                                    1,250 Points
                                </span>
                            </div>

                            <div className="flex justify-center md:justify-start gap-3 mt-6">
                                <Link
                                    href="/settings"
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-opacity-90 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit Profile
                                </Link>
                                <button className="px-4 py-2 border border-border-light dark:border-border-dark rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">share</span>
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Score */}
                        <div className="text-center md:text-right">
                            <div className="inline-flex flex-col items-center bg-gradient-to-br from-primary to-its-blue text-white rounded-2xl p-6 shadow-lg">
                                <span className="text-xs uppercase tracking-wider opacity-80">Growth Score</span>
                                <span className="text-5xl font-bold mt-1">85</span>
                                <span className="text-sm opacity-80 mt-1">Excellent</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dimension Radar */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">radar</span>
                            9 Dimensions Profile
                        </h2>
                        <DimensionRadarChart data={radarData} />
                    </div>

                    {/* Badges */}
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">military_tech</span>
                            Badges & Achievements
                        </h2>
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {badges.map((badge, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className={`size-14 ${badge.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                                    </div>
                                    <span className="text-xs text-center font-medium text-gray-600 dark:text-gray-400">{badge.name}</span>
                                </div>
                            ))}
                        </div>

                        <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Recent Achievements</h3>
                        <div className="space-y-3">
                            {achievements.map((achievement, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-border-light dark:border-border-dark last:border-0">
                                    <div>
                                        <p className="font-medium text-sm">{achievement.title}</p>
                                        <p className="text-xs text-gray-500">{achievement.date}</p>
                                    </div>
                                    <span className="text-primary font-bold text-sm">+{achievement.points}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
