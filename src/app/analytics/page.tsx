"use client";

import Link from "next/link";
import { GrowthLineChart } from "@/components/Charts";
import { PsychometricRadar } from "@/components/PsychometricRadar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Download,
    Users,
    Rocket,
    TrendingUp,
    CheckCircle,
    BarChart3,
    Radar,
    Trophy,
    AlertTriangle,
    UserPlus,
    CalendarPlus,
    FileText,
    Activity
} from "lucide-react";
import { FadeIn, SlideUp } from "@/components/Animations";

export default function AnalyticsPage() {
    const growthData = [
        { month: "Jan", score: 65 },
        { month: "Feb", score: 68 },
        { month: "Mar", score: 72 },
        { month: "Apr", score: 70 },
        { month: "May", score: 78 },
        { month: "Jun", score: 82 },
        { month: "Jul", score: 85 },
    ];

    // Map for PsychometricRadar { subject, value, fullMark }
    const radarData = [
        { subject: "Kognitif", value: 88, fullMark: 100 },
        { subject: "Afektif", value: 72, fullMark: 100 },
        { subject: "Psikomotorik", value: 80, fullMark: 100 },
        { subject: "Spiritual", value: 90, fullMark: 100 },
        { subject: "Sosial", value: 85, fullMark: 100 },
        { subject: "Finansial", value: 60, fullMark: 100 },
        { subject: "Kesehatan", value: 75, fullMark: 100 },
        { subject: "Karakter", value: 88, fullMark: 100 },
        { subject: "Lingkungan", value: 70, fullMark: 100 },
    ];

    const engagementData = [
        { month: "Week 1", score: 45 },
        { month: "Week 2", score: 52 },
        { month: "Week 3", score: 48 },
        { month: "Week 4", score: 61 },
        { month: "Week 5", score: 55 },
        { month: "Week 6", score: 67 },
        { month: "Week 7", score: 72 },
        { month: "Week 8", score: 78 },
    ];

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <BarChart3 className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Analytics Dashboard</h1>
                            <p className="text-xs text-muted-foreground">PPSDM KMM Insights</p>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <select className="bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>This Semester</option>
                        <option>All Time</option>
                    </select>
                    <Button className="gap-2 shadow-sm">
                        <Download className="size-4" />
                        Export
                    </Button>
                </div>
            </header>

            <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
                {/* Stats Row */}
                <FadeIn delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Total Students", value: "1,247", change: "+12%", changeType: "positive", icon: Users },
                            { title: "Active Programs", value: "24", change: "+3 this month", changeType: "positive", icon: Rocket },
                            { title: "Avg. Growth Score", value: "78.5", change: "+5.2 pts", changeType: "positive", icon: TrendingUp },
                            { title: "Completion Rate", value: "89%", change: "stable", changeType: "neutral", icon: CheckCircle },
                        ].map((stat, idx) => (
                            <Card key={idx} className="border-none shadow-sm bg-white dark:bg-card">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                                        <stat.icon className="size-4 text-primary opacity-70" />
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold">{stat.value}</span>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                                                stat.changeType === 'negative' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </FadeIn>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Growth Trend */}
                    <SlideUp delay={0.2}>
                        <Card className="h-full border-none shadow-sm overflow-hidden">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Student Growth Trend</CardTitle>
                                        <CardDescription>Average score progression over time</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                                        <Activity className="size-3" />
                                        Live Data
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    <GrowthLineChart data={growthData} color="#3b82f6" />
                                </div>
                            </CardContent>
                        </Card>
                    </SlideUp>

                    {/* Dimension Radar */}
                    <SlideUp delay={0.3}>
                        <div className="h-full">
                            <PsychometricRadar
                                data={radarData}
                                title="9 Dimensions Overview"
                                description="Cohort average performance across all dimensions."
                            />
                        </div>
                    </SlideUp>
                </div>

                {/* Engagement Chart */}
                <SlideUp delay={0.4}>
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle>Weekly Engagement</CardTitle>
                            <CardDescription>Platform activity levels over the last 8 weeks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px] w-full">
                                <GrowthLineChart data={engagementData} color="#10b981" />
                            </div>
                        </CardContent>
                    </Card>
                </SlideUp>

                {/* Bottom Stats */}
                <FadeIn delay={0.5}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Top Performing Dimensions */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Trophy className="size-5 text-yellow-500" />
                                    Top Dimensions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: "Spiritual", score: 90, color: "bg-purple-500" },
                                    { name: "Kognitif", score: 88, color: "bg-blue-500" },
                                    { name: "Karakter", score: 88, color: "bg-green-500" },
                                ].map((dim, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground font-mono text-xs">0{idx + 1}</span>
                                                <span className="font-medium">{dim.name}</span>
                                            </div>
                                            <span className="font-bold">{dim.score}%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.score}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Needs Improvement */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <AlertTriangle className="size-5 text-red-500" />
                                    Needs Attention
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { name: "Finansial", score: 60, color: "bg-red-500" },
                                    { name: "Lingkungan", score: 70, color: "bg-yellow-500" },
                                    { name: "Afektif", score: 72, color: "bg-orange-500" },
                                ].map((dim, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground font-mono text-xs">0{idx + 1}</span>
                                                <span className="font-medium">{dim.name}</span>
                                            </div>
                                            <span className="font-bold">{dim.score}%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${dim.color} rounded-full`} style={{ width: `${dim.score}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-blue-700 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base text-white">
                                    <Rocket className="size-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="secondary" className="w-full justify-start gap-3 bg-white/10 text-white hover:bg-white/20 border-none h-12">
                                    <UserPlus className="size-5 opacity-70" />
                                    Add New Student
                                </Button>
                                <Button variant="secondary" className="w-full justify-start gap-3 bg-white/10 text-white hover:bg-white/20 border-none h-12">
                                    <CalendarPlus className="size-5 opacity-70" />
                                    Schedule Program
                                </Button>
                                <Button variant="secondary" className="w-full justify-start gap-3 bg-white/10 text-white hover:bg-white/20 border-none h-12">
                                    <FileText className="size-5 opacity-70" />
                                    Generate Report
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </FadeIn>
            </main>
        </div>
    );
}
