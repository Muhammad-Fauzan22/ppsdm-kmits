"use client";

import Link from "next/link";
import { useState } from "react";

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

    const statusStyles = {
        completed: "bg-green-100 text-green-700 border-green-200",
        "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
        upcoming: "bg-blue-100 text-blue-700 border-blue-200",
    };

    const statusIcons = {
        completed: "check_circle",
        "in-progress": "pending",
        upcoming: "schedule",
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">checklist</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Activity Tracker</h1>
                            <p className="text-xs text-gray-500">Manage your development activities</p>
                        </div>
                    </Link>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-opacity-90 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Activity
                </button>
            </header>

            <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {(["all", "in-progress", "upcoming", "completed"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === status
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-white dark:bg-card-dark text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border border-border-light dark:border-border-dark"
                                }`}
                        >
                            {status === "all" ? "All" : status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                        <p className="text-2xl font-bold">{mockActivities.length}</p>
                        <p className="text-sm text-gray-500">Total Activities</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                        <p className="text-2xl font-bold text-green-600">{mockActivities.filter(a => a.status === "completed").length}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                        <p className="text-2xl font-bold text-yellow-600">{mockActivities.filter(a => a.status === "in-progress").length}</p>
                        <p className="text-sm text-gray-500">In Progress</p>
                    </div>
                    <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark">
                        <p className="text-2xl font-bold text-primary">{mockActivities.reduce((acc, a) => acc + a.points, 0)}</p>
                        <p className="text-sm text-gray-500">Total Points</p>
                    </div>
                </div>

                {/* Activity List */}
                <div className="space-y-4">
                    {filteredActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-5 hover:shadow-md transition-shadow flex items-center gap-4"
                        >
                            {/* Status Icon */}
                            <div className={`size-12 rounded-xl ${activity.dimensionColor} flex items-center justify-center text-white shrink-0`}>
                                <span className="material-symbols-outlined">{statusIcons[activity.status]}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{activity.title}</h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[activity.status]} border`}>
                                                {activity.status === "in-progress" ? "In Progress" : activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                {activity.date}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold text-primary">+{activity.points}</p>
                                        <p className="text-xs text-gray-500">points</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors shrink-0">
                                <span className="material-symbols-outlined text-gray-400">more_vert</span>
                            </button>
                        </div>
                    ))}
                </div>

                {filteredActivities.length === 0 && (
                    <div className="text-center py-16">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inbox</span>
                        <p className="text-gray-500">No activities found with this filter.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
