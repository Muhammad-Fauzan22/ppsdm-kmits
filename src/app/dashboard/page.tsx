"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-4 lg:px-10 py-3 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4 text-primary dark:text-white">
                        <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
                            <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-primary dark:text-white">
                            PPSDM KMITS
                        </h2>
                    </div>
                    {/* Global Menu & Actions */}
                    <div className="hidden lg:flex flex-1 justify-end items-center gap-8">
                        <nav className="flex items-center gap-8">
                            <Link
                                className="text-primary dark:text-white text-sm font-semibold border-b-2 border-primary pb-0.5"
                                href="/dashboard"
                            >
                                Dashboard
                            </Link>
                            <Link
                                className="text-neutral-mid dark:text-gray-400 text-sm font-medium hover:text-primary dark:hover:text-white transition-colors"
                                href="/rpi"
                            >
                                RPI Planning
                            </Link>
                            <Link
                                className="text-neutral-mid dark:text-gray-400 text-sm font-medium hover:text-primary dark:hover:text-white transition-colors"
                                href="/portfolio"
                            >
                                Portfolio
                            </Link>
                        </nav>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 cursor-pointer bg-primary hover:bg-opacity-90 transition-colors text-white text-sm font-bold h-10 px-5 rounded-lg shadow-md hover:shadow-lg">
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span>New Activity</span>
                            </button>
                            <button className="relative group">
                                <div
                                    className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-700 dark:ring-offset-background-dark"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClE0EM96SkM6uD--shNf9TkN55hiP_7YwI6Awx7_v_BQbCKaoxruCniB2yKxNCP7SpnAaI3u7yt23f8pf_txws30mxyqlTcNuLlzyW-qxkUwu4CO108XqnfyA7tpTI4ZvjQoNubGzpxQlJFMGAyTaocUrvthrIGfSoIyBIqFtkJhahbWSuJBgL8PFAyW3tMh-CKAolYhjUlmmxV4TlgXEhIEAdVc7Sg0IBeS0Zz_DXz8wHYz3uFtX7Oz_n6smU3KFkMv6LEpbaWG0")',
                                    }}
                                ></div>
                                <span className="absolute bottom-0 right-0 size-3 bg-growth-green border-2 border-white dark:border-card-dark rounded-full"></span>
                            </button>
                        </div>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-primary dark:text-white">
                        <span className="material-symbols-outlined text-3xl">menu</span>
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* LEFT COLUMN: Profile & Stats (3 cols) */}
                <aside className="lg:col-span-3 flex flex-col gap-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-sm flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-28 shadow-md"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI")',
                                }}
                            ></div>
                            <div className="absolute bottom-1 right-1 bg-white dark:bg-card-dark p-1.5 rounded-full shadow-sm border border-border-light dark:border-border-dark">
                                <span className="material-symbols-outlined text-primary text-sm font-bold">
                                    edit
                                </span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-neutral-dark dark:text-white leading-tight">
                            Rian Santoso
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Informatics Engineering
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                            ID: 5025201001
                        </p>
                        <div className="mt-4 px-3 py-1 bg-primary/10 dark:bg-primary/20 rounded-full text-primary dark:text-white text-xs font-semibold">
                            Semester 5
                        </div>
                    </div>
                    {/* Overall Stats Card */}
                    <div className="bg-white dark:bg-card-dark rounded-xl p-6 border border-border-light dark:border-border-dark shadow-sm flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h4 className="font-bold text-base dark:text-white">
                                Development Score
                            </h4>
                            <span
                                className="material-symbols-outlined text-gray-400 text-lg cursor-help"
                                title="Based on weighted average of all dimensions"
                            >
                                info
                            </span>
                        </div>
                        {/* Donut Chart Simulation */}
                        <div className="flex justify-center">
                            <div
                                className="relative size-40 rounded-full flex items-center justify-center"
                                style={{
                                    background: "conic-gradient(#330066 85%, #f2f0f5 0)",
                                }}
                            >
                                <div className="bg-white dark:bg-card-dark size-32 rounded-full flex flex-col items-center justify-center shadow-inner">
                                    <span className="text-3xl font-extrabold text-primary dark:text-white tracking-tight">
                                        85
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
                                        out of 100
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Dimensions */}
                        <div className="flex flex-col gap-4 mt-2">
                            {[
                                { label: "Cognitive", score: 90, color: "bg-its-blue", text: "text-its-blue" },
                                { label: "Affective", score: 75, color: "bg-primary", text: "text-primary" },
                                { label: "Psychomotor", score: 82, color: "bg-its-blue", text: "text-its-blue" },
                                { label: "Social-Spiritual", score: 95, color: "bg-growth-green", text: "text-growth-green" },
                            ].map((item, idx) => (
                                <div className="flex flex-col gap-1.5" key={idx}>
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                                        <span className={`${item.text} dark:text-white`}>{item.score}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full`}
                                            style={{ width: `${item.score}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* MIDDLE COLUMN: Growth Timeline (6 cols) */}
                <section className="lg:col-span-6 flex flex-col h-full">
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm p-6 lg:p-8 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-neutral-dark dark:text-white">
                                Growth Timeline
                            </h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <span className="size-2 rounded-full bg-growth-green"></span>{" "}
                                    Achieved
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    <span className="size-2 rounded-full bg-active-yellow"></span>{" "}
                                    Active
                                </span>
                            </div>
                        </div>
                        <div className="relative flex flex-col h-full">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-4 bottom-12 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

                            {/* Year 1: Achieved */}
                            <div className="relative flex gap-6 pb-12 group">
                                <div className="relative z-10 flex-none size-12 rounded-full bg-growth-green/10 text-growth-green flex items-center justify-center border-4 border-white dark:border-card-dark">
                                    <span className="material-symbols-outlined font-bold">
                                        check
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Year 1: Foundation
                                        </h4>
                                        <span className="text-xs font-semibold px-2 py-1 bg-growth-green/10 text-growth-green rounded">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                            Orientation &amp; Basic Competence
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Successfully completed campus orientation and joined the
                                            Informatics Student Association basics.
                                        </p>
                                        <div className="flex gap-2 mt-3">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">
                                                Social
                                            </span>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">
                                                Cognitive
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Year 3: Active */}
                            <div className="relative flex gap-6 pb-12 group">
                                <div className="relative z-10 flex-none size-12 rounded-full bg-active-yellow/10 text-active-yellow flex items-center justify-center border-4 border-white dark:border-card-dark shadow-sm ring-2 ring-active-yellow/20">
                                    <span className="material-symbols-outlined font-bold">
                                        play_arrow
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-primary dark:text-white">
                                            Year 3: Professional Dev
                                        </h4>
                                        <span className="text-xs font-semibold px-2 py-1 bg-active-yellow/20 text-yellow-700 dark:text-yellow-400 rounded animate-pulse">
                                            In Progress
                                        </span>
                                    </div>
                                    <div className="bg-white dark:bg-card-dark shadow-md p-5 rounded-lg border-l-4 border-active-yellow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    Internship Preparation
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Focusing on portfolio building and technical
                                                    interviews.
                                                </p>
                                            </div>
                                            <div
                                                className="bg-center bg-no-repeat bg-cover rounded size-10"
                                                style={{
                                                    backgroundImage:
                                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-KBIUMxMW6kRGNLStNSAgfqTFhQbMnUhtNyVoNtV611epk_Rxz0g1Y52qPfOTEwKSCthzpKd8-B6m9QkMEmzAw2ctkeuZWfPONsNxBy1sLr2rrTYv3MND5eyolxeBaGHGYhhg9krLjtOq-JaBUysOy6aM2kjQH2-Y0bLsnGsxlgpNeczk9o43f7L7T9PuDCDjJwpPW21orsVPEsS0W_3BzhXZqXU8KtXf-7lXCHt_xcWmCzX9jVGFVTp34PEQWwmfJzdD3nodds0")',
                                                }}
                                            ></div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-gray-600 dark:text-gray-300">
                                                    Milestone Progress
                                                </span>
                                                <span className="font-bold text-primary dark:text-white">
                                                    65%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full">
                                                <div
                                                    className="bg-primary h-1.5 rounded-full"
                                                    style={{ width: "65%" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT COLUMN: Smart Recommendations (3 cols) */}
                <aside className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Smart Recommendations
                        </h3>
                        <span className="material-symbols-outlined text-gray-400">
                            auto_awesome
                        </span>
                    </div>
                    {/* Card 1: Skill Gap Alert */}
                    <div className="bg-white dark:bg-card-dark rounded-xl p-5 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                        <div className="flex gap-3 items-start">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-red-500 uppercase tracking-wide">
                                    Skill Gap Detected
                                </p>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                                    Public Speaking
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    Your affective score is lower than peer average in
                                    communication.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Card 3: Event Matching */}
                    <div className="bg-gradient-to-br from-its-blue to-primary rounded-xl p-5 text-white shadow-md relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 size-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                                    Social Goal
                                </span>
                                <h4 className="text-lg font-bold mt-2 leading-tight">
                                    ITS Leadership Summit 2024
                                </h4>
                            </div>
                            <div className="bg-white/10 rounded-lg p-2 text-center min-w-[50px] backdrop-blur-sm">
                                <span className="block text-xs uppercase font-medium">Nov</span>
                                <span className="block text-xl font-bold">14</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
