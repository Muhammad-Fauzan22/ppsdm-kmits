"use client";

import Link from "next/link";
import { useState } from "react";
import {
    LayoutDashboard,
    Map,
    FolderOpen,
    Plus,
    Menu,
    Edit2,
    CheckCircle2,
    PlayCircle,
    AlertTriangle,
    Calendar,
    Sparkles,
    Zap,
    TrendingUp,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FadeIn } from "@/components/Animations";
import { PsychometricRadar } from "@/components/PsychometricRadar";
import { DimensionCard } from "@/components/DimensionCard";
import { LiveProcessingFeed } from "@/components/dashboard/LiveProcessingFeed";

// Mock data for Radar (Updated to 9 Dimensions)
const radarData = [
    { subject: 'Intellectual', value: 90, fullMark: 100 },
    { subject: 'Self-Mgmt', value: 75, fullMark: 100 },
    { subject: 'Financial', value: 60, fullMark: 100 },
    { subject: 'Physical', value: 85, fullMark: 100 },
    { subject: 'Mental', value: 88, fullMark: 100 },
    { subject: 'Psychological', value: 92, fullMark: 100 },
    { subject: 'Character', value: 95, fullMark: 100 },
    { subject: 'Spiritual', value: 80, fullMark: 100 },
    { subject: 'Environmental', value: 70, fullMark: 100 },
];


export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background-dark text-foreground font-sans selection:bg-primary/20">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-border px-4 lg:px-10 py-3 shadow-sm">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-9 flex items-center justify-center bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                            <Sparkles className="size-5" />
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-foreground">
                            PPSDM KMM
                        </h2>
                    </div>
                    {/* Global Menu & Actions */}
                    <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
                        <nav className="flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-semibold text-primary transition-colors">
                                Dashboard
                            </Link>
                            <Link href="/rpi" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                RPI Planning
                            </Link>
                            <Link href="/portfolio" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                Portfolio
                            </Link>
                        </nav>
                        <div className="h-6 w-px bg-border"></div>
                        <div className="flex items-center gap-3">
                            <Button size="sm" className="gap-2 shadow-lg shadow-primary/20">
                                <Plus className="size-4" />
                                New Activity
                            </Button>
                            <button className="relative group rounded-full overflow-hidden size-10 ring-2 ring-background ring-offset-2 ring-offset-gray-200" aria-label="User Menu">
                                <span className="sr-only">User Menu</span>
                                {/* Optimized Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuClE0EM96SkM6uD--shNf9TkN55hiP_7YwI6Awx7_v_BQbCKaoxruCniB2yKxNCP7SpnAaI3u7yt23f8pf_txws30mxyqlTcNuLlzyW-qxkUwu4CO108XqnfyA7tpTI4ZvjQoNubGzpxQlJFMGAyTaocUrvthrIGfSoIyBIqFtkJhahbWSuJBgL8PFAyW3tMh-CKAolYhjUlmmxV4TlgXEhIEAdVc7Sg0IBeS0Zz_DXz8wHYz3uFtX7Oz_n6smU3KFkMv6LEpbaWG0"
                                        alt="User Profile"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-card-dark rounded-full z-10"></span>
                            </button>
                        </div>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-foreground">
                        <Menu className="size-6" />
                    </button>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* LEFT COLUMN: Profile & Stats (4 cols) */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                    <FadeIn delay={0.1}>
                        <Card className="overflow-hidden border-none shadow-lg">
                            <div className="h-24 bg-gradient-to-r from-its-blue to-accent-blue relative">
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-white hover:bg-white/20">
                                    <Edit2 className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-col items-center -mt-12 px-6 pb-6">
                                <div className="relative mb-3 size-24 rounded-full border-4 border-white shadow-md bg-white overflow-hidden">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI"
                                        alt="Rian Santoso"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-foreground text-center">Rian Santoso</h3>
                                <p className="text-sm text-muted-foreground font-medium">Informatics Engineering</p>

                                <div className="w-full mt-6">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-semibold text-gray-700">Holistic Score</span>
                                        <span className="font-bold text-primary">82%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full w-[82%]"></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">You are in the top 15% of your cohort.</p>
                                </div>
                            </div>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        {/* Radar Chart Widget */}
                        <div className="h-[450px]">
                            <PsychometricRadar
                                data={[
                                    { subject: 'Intellectual', value: 90, fullMark: 100 },
                                    { subject: 'Self-Mgmt', value: 75, fullMark: 100 },
                                    { subject: 'Financial', value: 60, fullMark: 100 },
                                    { subject: 'Physical', value: 85, fullMark: 100 },
                                    { subject: 'Mental', value: 88, fullMark: 100 },
                                    { subject: 'Psycho-Well', value: 92, fullMark: 100 },
                                    { subject: 'Character', value: 95, fullMark: 100 },
                                    { subject: 'Spiritual', value: 80, fullMark: 100 },
                                    { subject: 'Environment', value: 70, fullMark: 100 },
                                ]}
                                title="Holistic Radar"
                                description="Your 9-Dimension Balance"
                            />
                        </div>
                    </FadeIn>
                </aside>

                {/* RIGHT COLUMN: Dimension Grid (8 cols) */}
                <section className="lg:col-span-8 space-y-8">
                    {/* Welcome Banner */}
                    <FadeIn delay={0.3}>
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
                            <div className="relative z-10">
                                <h1 className="text-2xl font-bold mb-2">Welcome back to your Holistic Journey!</h1>
                                <p className="text-indigo-100 max-w-xl">
                                    Your profile indicates strong growth in Character and Intellectual domains.
                                    Consider focusing on <span className="font-bold text-white underline decoration-yellow-400 decoration-2">Financial Intelligence</span> this week.
                                </p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                <Sparkles className="size-64" />
                            </div>
                        </div>
                    </FadeIn>

                    {/* Live Processing Feed */}
                    <FadeIn delay={0.4}>
                        <div className="mb-8">
                            <LiveProcessingFeed />
                        </div>
                    </FadeIn>

                    {/* 9-Grid Dimensions */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground">The 9 Dimensions</h2>
                            <Button variant="ghost" size="sm">View Matrix Analysis</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <DimensionCard
                                id="dim1"
                                title="Intellectual"
                                description="Cognitive capacity, creativity, and digital literacy."
                                score={90}
                                icon={<Zap className="size-6 text-blue-600" />}
                                colorClass="bg-blue-500"
                                href="/dashboard/intellectual"
                            />
                            <DimensionCard
                                id="dim2"
                                title="Self-Management"
                                description="Productivity, habits, and time management."
                                score={75}
                                icon={<LayoutDashboard className="size-6 text-indigo-600" />}
                                colorClass="bg-indigo-500"
                                href="/dashboard/self-management"
                            />
                            <DimensionCard
                                id="dim3"
                                title="Financial"
                                description="Budgeting, investment, and economic literacy."
                                score={60}
                                icon={<TrendingUp className="size-6 text-green-600" />}
                                colorClass="bg-green-500"
                                href="/dashboard/financial"
                            />
                            <DimensionCard
                                id="dim4"
                                title="Physical"
                                description="Health, vitality, sleep, and nutrition."
                                score={85}
                                icon={<PlayCircle className="size-6 text-red-600" />}
                                colorClass="bg-red-500"
                                href="/dashboard/physical"
                            />
                            <DimensionCard
                                id="dim5"
                                title="Mental Stability"
                                description="Emotional resilience and stress management."
                                score={88}
                                icon={<AlertTriangle className="size-6 text-orange-600" />}
                                colorClass="bg-orange-500"
                                href="/dashboard/mental"
                            />
                            <DimensionCard
                                id="dim6"
                                title="Psychological"
                                description="Self-esteem, well-being, and mindset."
                                score={92}
                                icon={<Sparkles className="size-6 text-purple-600" />}
                                colorClass="bg-purple-500"
                                href="/dashboard/mental" // Assuming combined dashboard or separate
                            />
                            <DimensionCard
                                id="dim7"
                                title="Character"
                                description="Ethics, integrity, and moral compass."
                                score={95}
                                icon={<CheckCircle2 className="size-6 text-emerald-600" />}
                                colorClass="bg-emerald-500"
                                href="/dashboard/character"
                            />
                            <DimensionCard
                                id="dim8"
                                title="Spiritual"
                                description="Purpose, meaning, and connection."
                                score={80}
                                icon={<Award className="size-6 text-sky-600" />}
                                colorClass="bg-sky-500"
                                href="/dashboard/spiritual"
                            />
                            <DimensionCard
                                id="dim9"
                                title="Environmental"
                                description="Sustainability and living environment."
                                score={70}
                                icon={<Map className="size-6 text-teal-600" />}
                                colorClass="bg-teal-500"
                                href="/dashboard/environmental"
                            />
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}
