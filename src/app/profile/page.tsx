"use client";

import Link from "next/link";
import { PsychometricRadar } from "@/components/PsychometricRadar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ArrowLeft,
    Award,
    Users,
    Dumbbell,
    Lightbulb,
    Edit,
    Share2,
    Verified,
    Radar,
    Medal,
    GraduationCap,
    TrendingUp
} from "lucide-react";
import { FadeIn, SlideUp } from "@/components/Animations";

export default function ProfilePage() {
    // Map data to match PsychometricRadar expectations { subject, value }
    const radarData = [
        { subject: "Kognitif", value: 88, fullMark: 100 },
        { subject: "Afektif", value: 75, fullMark: 100 },
        { subject: "Psikomotorik", value: 82, fullMark: 100 },
        { subject: "Spiritual", value: 95, fullMark: 100 },
        { subject: "Sosial", value: 85, fullMark: 100 },
        { subject: "Finansial", value: 60, fullMark: 100 },
        { subject: "Kesehatan", value: 78, fullMark: 100 },
        { subject: "Karakter", value: 90, fullMark: 100 },
        { subject: "Lingkungan", value: 70, fullMark: 100 },
    ];

    const badges = [
        { icon: GraduationCap, name: "Dean's List", color: "bg-yellow-500/10 text-yellow-600" },
        { icon: Users, name: "Team Player", color: "bg-blue-500/10 text-blue-600" },
        { icon: Dumbbell, name: "Wellness Warrior", color: "bg-green-500/10 text-green-600" },
        { icon: Lightbulb, name: "Innovator", color: "bg-purple-500/10 text-purple-600" },
    ];

    const achievements = [
        { title: "Completed Leadership Training", date: "Mar 2024", points: 50 },
        { title: "Published Research Paper", date: "Feb 2024", points: 100 },
        { title: "Organized Campus Event", date: "Jan 2024", points: 75 },
    ];

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            {/* Header Banner */}
            <div className="h-64 bg-gradient-to-r from-[#003366] via-[#004080] to-[#0059b3] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                <div className="container mx-auto px-6 py-6 relative z-10">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 gap-2">
                            <ArrowLeft className="size-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-6 -mt-32 pb-12 relative z-10 space-y-6">
                {/* Profile Card */}
                <FadeIn delay={0.1}>
                    <Card className="overflow-hidden border-none shadow-xl">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-8 md:p-10 flex flex-col items-center md:items-start md:flex-row gap-8 flex-1">
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div
                                            className="size-40 rounded-full bg-cover bg-center border-[6px] border-white dark:border-zinc-900 shadow-2xl"
                                            style={{
                                                backgroundImage:
                                                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCoz-5CBTBA6Ayqk18_LahdcYj4owOJiXGJ6ohIG_MrvMA9HTriWJKW_FG-SWX3XuGjVbi1uWn50i-6tGM6XvQjNL5rnhEd8TtzYDaDOsvhBxi1iUbog-kVlZbuO4NNA9718DqXbQVXf7sm1z0A3W9Mc_-8hMn-WHb0OvmO32Jlq08uFhRuE9xb0-NueKCD7gwut6M8kCEewkFGZdi2UTQushlvUzn6GPSquQdolNiS6VzLT77DVfIHvOzoopFXf6hAaNTVbF_I9XI")',
                                            }}
                                        ></div>
                                        <div className="absolute bottom-2 right-2 size-10 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-zinc-900 shadow-lg" title="Verified Student">
                                            <Verified className="size-5" />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Rian Santoso</h1>
                                            <p className="text-muted-foreground text-lg">Informatics Engineering • Semester 5</p>
                                            <p className="text-sm text-gray-400 font-mono">NRP: 5025201001</p>
                                        </div>

                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                Active Member
                                            </Badge>
                                            <Badge variant="secondary" className="px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100">
                                                Level 12
                                            </Badge>
                                            <Badge variant="secondary" className="px-3 py-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                                                1,250 Points
                                            </Badge>
                                        </div>

                                        <div className="flex justify-center md:justify-start gap-3 pt-2">
                                            <Button className="gap-2 shadow-lg hover:shadow-xl transition-all">
                                                <Edit className="size-4" />
                                                Edit Profile
                                            </Button>
                                            <Button variant="outline" className="gap-2">
                                                <Share2 className="size-4" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Box */}
                                <div className="bg-gradient-to-br from-[#003366] to-[#005cb3] text-white p-10 flex flex-col items-center justify-center min-w-[250px] text-center md:border-l border-white/10">
                                    <div className="size-16 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                                        <TrendingUp className="size-8 text-white" />
                                    </div>
                                    <span className="text-xs uppercase tracking-widest opacity-80 font-bold">Growth Score</span>
                                    <span className="text-6xl font-bold mt-2">85</span>
                                    <span className="inline-block mt-3 px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-sm font-semibold border border-green-400/30">
                                        Excellent
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FadeIn>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Dimension Radar */}
                    <SlideUp delay={0.2}>
                        <div className="h-full">
                            <PsychometricRadar
                                data={radarData}
                                title="9 Dimensions Profile"
                                description="Visual mapping of your holistic development across 9 key dimensions."
                            />
                        </div>
                    </SlideUp>

                    {/* Badges & Achievements */}
                    <SlideUp delay={0.3}>
                        <Card className="h-full border-none shadow-lg">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-yellow-100 rounded-lg text-yellow-700">
                                        <Medal className="size-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Badges & Achievements</CardTitle>
                                        <CardDescription>Your earned recognitions and recent milestones.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Earned Badges</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {badges.map((badge, idx) => (
                                            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer p-2 rounded-xl hover:bg-muted/50 transition-colors">
                                                <div className={`size-12 ${badge.color} rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                                                    <badge.icon className="size-6" />
                                                </div>
                                                <span className="text-xs text-center font-medium text-foreground group-hover:text-primary transition-colors">{badge.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Recent Milestones</h3>
                                    <div className="space-y-1">
                                        {achievements.map((achievement, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-2 rounded-full bg-primary/50"></div>
                                                    <div>
                                                        <p className="font-medium text-sm">{achievement.title}</p>
                                                        <p className="text-xs text-muted-foreground">{achievement.date}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                                    +{achievement.points} pts
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </SlideUp>
                </div>
            </main>
        </div>
    );
}
