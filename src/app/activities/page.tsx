"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    CheckCircle,
    Clock,
    Calendar,
    Plus,
    MoreVertical,
    Inbox,
    ListChecks,
    Activity as ActivityIcon,
    Filter
} from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";

interface Activity {
    id: string;
    title: string;
    dimension: string;
    dimensionColor: string;
    date: string;
    status: "completed" | "in-progress" | "upcoming";
    points: number;
}

const mockActivities: Activity[] = [
    {
        id: "1",
        title: "Complete Leadership Workshop",
        dimension: "Sosial",
        dimensionColor: "bg-blue-500",
        date: "2024-03-15",
        status: "completed",
        points: 50,
    },
    {
        id: "2",
        title: "Submit Research Proposal Draft",
        dimension: "Kognitif",
        dimensionColor: "bg-purple-500",
        date: "2024-03-18",
        status: "in-progress",
        points: 30,
    },
    {
        id: "3",
        title: "Attend Financial Literacy Seminar",
        dimension: "Finansial",
        dimensionColor: "bg-green-500",
        date: "2024-03-22",
        status: "upcoming",
        points: 25,
    },
    {
        id: "4",
        title: "Weekly Meditation Session",
        dimension: "Spiritual",
        dimensionColor: "bg-indigo-500",
        date: "2024-03-20",
        status: "upcoming",
        points: 15,
    },
];

export default function ActivitiesPage() {
    const [filter, setFilter] = useState<"all" | "completed" | "in-progress" | "upcoming">("all");

    const filteredActivities = filter === "all"
        ? mockActivities
        : mockActivities.filter(a => a.status === filter);

    const statusConfig = {
        completed: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, label: "Completed" },
        "in-progress": { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "In Progress" },
        upcoming: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar, label: "Upcoming" },
    };

    return (
        <div className="min-h-screen bg-muted/40 font-sans text-foreground">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <ListChecks className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Activity Tracker</h1>
                            <p className="text-xs text-muted-foreground">Manage your development activities</p>
                        </div>
                    </Link>
                </div>
                <Button className="gap-2 shadow-sm">
                    <Plus className="size-4" />
                    Add Activity
                </Button>
            </header>

            <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
                {/* Stats Summary */}
                <FadeIn>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold">{mockActivities.length}</span>
                                    <ListChecks className="size-5 text-muted-foreground opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Completed</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-green-600">{mockActivities.filter(a => a.status === "completed").length}</span>
                                    <CheckCircle className="size-5 text-green-600 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">In Progress</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-yellow-600">{mockActivities.filter(a => a.status === "in-progress").length}</span>
                                    <ActivityIcon className="size-5 text-yellow-600 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm bg-white dark:bg-card">
                            <CardContent className="p-6 flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Total Points</span>
                                <div className="flex items-end justify-between">
                                    <span className="text-3xl font-bold text-primary">{mockActivities.reduce((acc, a) => acc + a.points, 0)}</span>
                                    <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">Pts</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </FadeIn>

                {/* Filter Tabs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg border">
                        {(["all", "in-progress", "upcoming", "completed"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === status
                                    ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10"
                                    }`}
                            >
                                {status === "all" ? "All" : status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
                        <Filter className="size-4" />
                        Sort by Date
                    </Button>
                </div>

                {/* Activity List */}
                <StaggerContainer className="space-y-4">
                    {filteredActivities.map((activity) => {
                        const StatusIcon = statusConfig[activity.status].icon;
                        return (
                            <StaggerItem key={activity.id}>
                                <Card className="border-none shadow-sm hover:shadow-md transition-shadow group">
                                    <CardContent className="p-5 flex items-center gap-5">
                                        {/* Dimension Icon */}
                                        <div className={`size-12 rounded-xl ${activity.dimensionColor} flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/5`}>
                                            <span className="text-lg font-bold">{activity.dimension[0]}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
                                                <div>
                                                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">{activity.title}</h3>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <Badge variant="outline" className={`font-medium border-transparent ${statusConfig[activity.status].color}`}>
                                                            {statusConfig[activity.status].label}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="size-3.5" />
                                                            {activity.date}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0 w-full md:w-auto">
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-primary">+{activity.points}</p>
                                                        <p className="text-[10px] uppercase text-muted-foreground font-semibold">Points</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                                                        <MoreVertical className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </StaggerItem>
                        );
                    })}
                </StaggerContainer>

                {filteredActivities.length === 0 && (
                    <FadeIn>
                        <div className="text-center py-20 border-2 border-dashed rounded-xl">
                            <div className="size-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Inbox className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">No activities found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-1">
                                There are no activities matching your current filter. Try changing the filter or add a new activity.
                            </p>
                            <Button variant="outline" className="mt-6">
                                Clear Filters
                            </Button>
                        </div>
                    </FadeIn>
                )}
            </main>
        </div>
    );
}
