"use client";

import { useState, useEffect } from "react";
import {
    BookOpen,
    Trophy,
    Target,
    Clock,
    Play,
    Star,
    Zap,
    Brain,
    Layout,
    Search,
    Filter,
    MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";

// --- Mock Data for Learning Modules ---
// In production, this would come from the 'jobs' or 'modules' table
const myModules = [
    {
        id: "m1",
        title: "The Art of Statistics: Gamified",
        category: "Data Science",
        thumbnail: "📊",
        progress: 75,
        total_xp: 1200,
        earned_xp: 900,
        status: "in_progress",
        last_accessed: "2 hours ago",
        type: "game",
        features: ["Quiz Battle", "Data Puzzle"]
    },
    {
        id: "m2",
        title: "Strategic Management: AR Experience",
        category: "Business",
        thumbnail: "🏢",
        progress: 30,
        total_xp: 2000,
        earned_xp: 600,
        status: "in_progress",
        last_accessed: "1 day ago",
        type: "ar",
        features: ["3D Boardroom", "Strategy Sim"]
    },
    {
        id: "m3",
        title: "Python for Beginners",
        category: "Technology",
        thumbnail: "🐍",
        progress: 100,
        total_xp: 800,
        earned_xp: 800,
        status: "completed",
        last_accessed: "1 week ago",
        type: "course",
        features: ["Interactive Code", "AI Tutor"]
    },
    {
        id: "m4",
        title: "Financial Literacy VR",
        category: "Finance",
        thumbnail: "💰",
        progress: 0,
        total_xp: 1500,
        earned_xp: 0,
        status: "not_started",
        last_accessed: "-",
        type: "vr",
        features: ["VR Simulation"]
    }
];

export default function UserLearningPortal() {
    const [activeTab, setActiveTab] = useState("learning");
    const [searchQuery, setSearchQuery] = useState("");

    // Filter modules
    const filteredModules = myModules.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeModules = filteredModules.filter(m => m.status === 'in_progress');
    const completedModules = filteredModules.filter(m => m.status === 'completed');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background pb-20">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <BookOpen className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                            LMS Learning Portal
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-bold text-amber-700">1,500 XP</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-200">
                            <Target className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-700">Daily Streak: 5 🔥</span>
                        </div>
                        <Avatar className="w-9 h-9 border-2 border-white shadow-sm cursor-pointer">
                            <AvatarImage src="/avatar-placeholder.png" />
                            <AvatarFallback className="bg-slate-200 text-slate-600">US</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-8">

                {/* Hero / Welcome Section */}
                <FadeIn>
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 shadow-2xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 max-w-2xl">
                            <Badge className="mb-4 bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 border-none">
                                <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Learning
                            </Badge>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                Welcome back, User!
                            </h2>
                            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                                You are making great progress. Continue your immersive journey in <span className="font-semibold text-white">Data Science</span> or start a new challenge today.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg shadow-blue-900/20">
                                    <Play className="w-4 h-4 mr-2 fill-current" /> Continue Learning
                                </Button>
                                <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 dark:hover:bg-white/10 bg-transparent">
                                    View My IDP
                                </Button>
                            </div>
                        </div>
                    </section>
                </FadeIn>

                {/* Dashboard Tabs */}
                <Tabs defaultValue="learning" className="space-y-8" onValueChange={setActiveTab}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <TabsList className="bg-white dark:bg-card border p-1 h-auto rounded-xl shadow-sm self-start">
                            <TabsTrigger value="learning" className="px-4 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-secondary">
                                <Layout className="w-4 h-4 mr-2" /> My Modules
                            </TabsTrigger>
                            <TabsTrigger value="achievements" className="px-4 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-secondary">
                                <Trophy className="w-4 h-4 mr-2" /> Achievements
                            </TabsTrigger>
                            <TabsTrigger value="recommended" className="px-4 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-secondary">
                                <Star className="w-4 h-4 mr-2" /> Recommended
                            </TabsTrigger>
                        </TabsList>

                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search modules..."
                                className="pl-9 bg-white dark:bg-card border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <TabsContent value="learning" className="space-y-8 mt-0">
                        {/* Continue Learning Row */}
                        {activeModules.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-blue-600" /> Continue Learning
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <StaggerContainer>
                                        {activeModules.map((module) => (
                                            <ModuleCard key={module.id} module={module} />
                                        ))}
                                    </StaggerContainer>
                                </div>
                            </section>
                        )}

                        {/* All Modules / Library */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Layout className="w-5 h-5 text-indigo-600" /> Library
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {filteredModules.map((module) => (
                                    <ModuleCardCompact key={module.id} module={module} />
                                ))}
                            </div>
                        </section>
                    </TabsContent>

                    <TabsContent value="achievements">
                        <div className="text-center py-20 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-dashed">
                            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">Achievements are locked</h3>
                            <p>Complete more modules to unlock badges and rewards.</p>
                        </div>
                    </TabsContent>

                    <TabsContent value="recommended">
                        <div className="text-center py-20 text-muted-foreground bg-white dark:bg-card rounded-2xl border border-dashed">
                            <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-lg font-medium">AI Recommendations</h3>
                            <p>Your personalized learning path is being generated...</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

// --- Components ---

function ModuleCard({ module }: { module: any }) {
    return (
        <StaggerItem className="h-full">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden group">
                <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:scale-105 transition-transform duration-500"></div>
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300 transform">{module.thumbnail}</div>
                    <Badge className="absolute top-3 right-3 bg-white/90 text-slate-700 hover:bg-white shadow-sm backdrop-blur-sm">
                        {module.type.toUpperCase()}
                    </Badge>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">{module.category}</div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight">
                        {module.title}
                    </h3>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {module.features.map((feat: string) => (
                            <span key={feat} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                                {feat}
                            </span>
                        ))}
                    </div>

                    <div className="mt-auto space-y-3">
                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>Progress</span>
                            <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2 bg-slate-100" indicatorClassName={module.progress === 100 ? "bg-green-500" : "bg-blue-600"} />

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-slate-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> {module.last_accessed}
                            </span>
                            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 h-8 text-xs px-4">
                                {module.status === 'completed' ? 'Review' : 'Resume'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </StaggerItem>
    );
}

function ModuleCardCompact({ module }: { module: any }) {
    return (
        <Card className="hover:border-blue-300 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                    {module.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 truncate">{module.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{module.category}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <Progress value={module.progress} className="h-1.5 flex-1" />
                        <span className="text-[10px] text-slate-400 font-mono">{module.progress}%</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Sparkles({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
    )
}
