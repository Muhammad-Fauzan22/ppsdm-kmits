"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle, Clock, FileText, AlertCircle, RefreshCw } from "lucide-react";

type JobStatus = "pending" | "processing" | "completed" | "failed";

interface Job {
    id: string;
    title: string;
    status: JobStatus;
    progress: number;
    updated_at: string;
}

// Mock initial data
const initialJobs: Job[] = [
    { id: "job_1", title: "Introduction to AI.pdf", status: "completed", progress: 100, updated_at: "2 mins ago" },
    { id: "job_2", title: "Advanced Physics.pdf", status: "processing", progress: 45, updated_at: "Just now" },
    { id: "job_3", title: "History of Indonesia.pdf", status: "pending", progress: 0, updated_at: "5 mins ago" },
];

export function LiveProcessingFeed() {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setJobs((prevJobs) =>
                prevJobs.map((job) => {
                    if (job.status === "processing") {
                        const newProgress = Math.min(job.progress + Math.floor(Math.random() * 10), 100);
                        return {
                            ...job,
                            progress: newProgress,
                            status: newProgress === 100 ? "completed" : "processing",
                        };
                    }
                    return job;
                })
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status: JobStatus) => {
        switch (status) {
            case "completed": return <CheckCircle className="size-4 text-green-500" />;
            case "processing": return <RefreshCw className="size-4 text-blue-500 animate-spin" />;
            case "failed": return <AlertCircle className="size-4 text-red-500" />;
            default: return <Clock className="size-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: JobStatus) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 hover:bg-green-100";
            case "processing": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
            case "failed": return "bg-red-100 text-red-700 hover:bg-red-100";
            default: return "bg-gray-100 text-gray-700 hover:bg-gray-100";
        }
    };

    return (
        <Card className="col-span-1 lg:col-span-2 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Activity className="size-5 text-indigo-600" />
                    <CardTitle className="text-lg font-semibold text-foreground">Live Content Factory Feed</CardTitle>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs">View All Jobs</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job.id} className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-card-dark rounded-xl border border-gray-100 dark:border-border transition-all hover:shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                        <FileText className="size-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">{job.title}</h4>
                                        <p className="text-xs text-muted-foreground">{job.updated_at}</p>
                                    </div>
                                </div>
                                <Badge className={getStatusColor(job.status)}>
                                    <span className="flex items-center gap-1">
                                        {getStatusIcon(job.status)}
                                        <span className="capitalize">{job.status}</span>
                                    </span>
                                </Badge>
                            </div>

                            {/* Progress Bar or Actions */}
                            {(job.status === "processing" || job.progress > 0) && job.status !== "completed" && (
                                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
                                    <div
                                        className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${job.progress}%` }}
                                    ></div>
                                </div>
                            )}

                            {job.status === "completed" && (
                                <div className="flex gap-2 w-full justify-end mt-2 animate-in fade-in slide-in-from-bottom-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                        <FileText className="size-3" /> Report
                                    </Button>
                                    <Button size="sm" className="h-7 text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                                        View Module
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
