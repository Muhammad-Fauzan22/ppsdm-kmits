"use client";

import Link from "next/link";
import { useState } from "react";
import {
    LayoutDashboard,
    Map,
    FolderOpen,
    Plus,
    MoreHorizontal,
    Menu,
    Edit2,
    Info,
    CheckCircle2,
    PlayCircle,
    AlertTriangle,
    Calendar,
    Sparkles,
    Zap,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";
import { PsychometricRadar } from "@/components/PsychometricRadar";
import { Avatar } from "@/components/UI"; // Keeping existing avatar for now or replace later

// Mock data for Radar
const radarData = [
    { subject: 'Cognitive', value: 90, fullMark: 100 },
    { subject: 'Affective', value: 75, fullMark: 100 },
    { subject: 'Psychomotor', value: 82, fullMark: 100 },
    { subject: 'Social', value: 95, fullMark: 100 },
    { subject: 'Spiritual', value: 88, fullMark: 100 },
    { subject: 'Financial', value: 65, fullMark: 100 },
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
                            <button className="relative group">
                                <div
                                    className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-background ring-offset-2 ring-offset-gray-200"
                                    style={{
                                        backgroundImage:
                                            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuClE0EM96SkM6uD--shNf9TkN55hiP_7YwI6Awx7_v_BQbCKaoxruCniB2yKxNCP7SpnAaI3u7yt23f8pf_txws30mxyqlTcNuLlzyW-qxkUwu4CO108XqnfyA7tpTI4ZvjQoNubGzpxQlJFMGAyTaocUrvthrIGfSoIyBIqFtkJhahbWSuJBgL8PFAyW3tMh-CKAolYhjUlmmxV4TlgXEhIEAdVc7Sg0IBeS0Zz_DXz8wHYz3uFtX7Oz_n6smU3KFkMv6LEpbaWG0")',
                                    }}
                                ></div>
                                <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-card-dark rounded-full"></span>
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
                {/* LEFT COLUMN: Profile & Stats (3 cols) */}
                <aside className="lg:col-span-3 flex flex-col gap-6">
                    <FadeIn delay={0.1}>
                        <Card className="overflow-hidden border-none shadow-lg">
                            <div className="h-24 bg-gradient-to-r from-its-blue to-accent-blue relative">
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-white hover:bg-white/20">
                                    <Edit2 className="size-4" />
                                </Button>
                            </div>
                            <div className="flex flex-col items-center -mt-12 px-6 pb-6">
                                <div className="relative mb-3">
                                    <div
                                        className="bg-center bg-no-repeat bg-cover rounded-full size-24 border-4 border-white shadow-md bg-white"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI")',
                                        }}
                                    ></div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground text-center">Rian Santoso</h3>
                                <p className="text-sm text-muted-foreground font-medium">Informatics Engineering</p>
                                <p className="text-xs text-muted-foreground mt-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">ID: 5025201001</p>
                                <div className="mt-4 flex gap-2">
                                    <Badge variant="secondary" className="font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100">Semester 5</Badge>
                                    <Badge variant="default" className="font-semibold bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Active</Badge>
                                </div>
                            </div>
                        </Card>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        {/* Radar Chart Widget */}
                        <div className="h-[400px]">
                            <PsychometricRadar
                                data={radarData}
                                title="Development Profile"
                                description="Current semester snapshot"
                            />
                        </div>
                    </FadeIn>
                </aside>

                {/* MIDDLE COLUMN: Growth Timeline (6 cols) */}
                <section className="lg:col-span-6 flex flex-col h-full gap-6">
                    <FadeIn delay={0.3}>
                        <Card className="h-full border-none shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-xl">Growth Timeline</CardTitle>
                                    <CardDescription>Your academic and professional milestones</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="gap-1 border-green-200 text-green-700 bg-green-50"><div className="size-1.5 rounded-full bg-green-500"></div>Achieved</Badge>
                                    <Badge variant="outline" className="gap-1 border-yellow-200 text-yellow-700 bg-yellow-50"><div className="size-1.5 rounded-full bg-yellow-500"></div>Active</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="relative flex flex-col h-full pl-2">
                                    {/* Vertical Line */}
                                    <div className="absolute left-6 top-2 bottom-4 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

                                    {/* Year 1: Achieved */}
                                    <div className="relative flex gap-6 pb-10 group">
                                        <div className="relative z-10 flex-none size-12 rounded-full bg-white border-2 border-green-500 text-green-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="size-6" />
                                        </div>
                                        <Card className="flex-1 border-none bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-foreground">Year 1: Foundation</h4>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Completed</Badge>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700">Orientation & Basic Competence</p>
                                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                    Successfully completed campus orientation and joined the Informatics Student Association basics.
                                                </p>
                                                <div className="flex gap-2 mt-3">
                                                    <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-200">Social</Badge>
                                                    <Badge variant="outline" className="text-[10px] text-gray-500 border-gray-200">Cognitive</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Year 3: Active */}
                                    <div className="relative flex gap-6 pb-2 group">
                                        <div className="relative z-10 flex-none size-12 rounded-full bg-white border-2 border-yellow-500 text-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-pulse">
                                            <PlayCircle className="size-6" />
                                        </div>
                                        <Card className="flex-1 border-l-4 border-l-yellow-500 shadow-md bg-white">
                                            <CardContent className="p-5">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h4 className="font-bold text-primary text-lg">Year 3: Professional Dev</h4>
                                                        <p className="text-sm font-medium text-muted-foreground mt-1">Internship Preparation</p>
                                                    </div>
                                                    <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none animate-pulse">In Progress</Badge>
                                                </div>

                                                <div className="space-y-4">
                                                    <p className="text-sm text-gray-600">Focusing on portfolio building and technical interviews preparation.</p>
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-2">
                                                            <span className="font-medium text-gray-500">Milestone Progress</span>
                                                            <span className="font-bold text-primary">65%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                            <div className="bg-primary h-full rounded-full transition-all duration-1000 w-[65%]"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>
                </section>

                {/* RIGHT COLUMN: Smart Recommendations (3 cols) */}
                <aside className="lg:col-span-3 flex flex-col gap-6">
                    <FadeIn delay={0.4}>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-foreground flex items-center gap-2"><Zap className="size-4 text-yellow-500 fill-current" /> Insight</h3>
                        </div>

                        {/* Card 1: Skill Gap Alert */}
                        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex gap-3 items-start">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg shrink-0">
                                        <AlertTriangle className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Attention Needed</p>
                                        <h4 className="text-sm font-bold text-foreground">Public Speaking</h4>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            Affective score lower than peer average in communication.
                                        </p>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-red-600 text-xs mt-2">
                                            View Recommendations
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card 2: Event Matching */}
                        <Card className="mt-4 bg-gradient-to-br from-its-blue to-accent-blue text-white border-none shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Calendar className="size-24" />
                            </div>
                            <CardContent className="p-5 relative z-10">
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none mb-3">Recommended Event</Badge>
                                <h4 className="text-lg font-bold leading-tight mb-4">ITS Leadership Summit 2026</h4>
                                <div className="flex items-center justify-between">
                                    <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm">
                                        <span className="block text-xs uppercase font-medium opacity-80">Nov</span>
                                        <span className="block text-xl font-bold">14</span>
                                    </div>
                                    <Button size="sm" variant="secondary" className="shadow-lg">
                                        Register
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </FadeIn>
                </aside>
            </main>
        </div>
    );
}
