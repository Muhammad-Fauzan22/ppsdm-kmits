"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    BookOpen,
    CheckCircle2,
    Clock,
    AlertCircle,
    RefreshCw,
    Play,
    Square,
    FileText,
    Database,
    Brain,
    Scan,
    Settings,
    MoreHorizontal,
    ChevronRight,
    Search,
    Download,
    Terminal,
    Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/Animations";

// --- Types ---
interface BookStatus {
    id: string;
    title: string;
    author: string;
    category: string;
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    step: string;
    timestamp: string;
}

interface LogEntry {
    id: string;
    type: "success" | "error" | "info" | "warning";
    action: string;
    message: string;
    duration?: string;
    timestamp: string;
}

// --- Mock Data ---
const initialBooks: BookStatus[] = [
    { id: "1", title: "The Balanced Scorecard", author: "Robert S. Kaplan", category: "Business", status: "processing", progress: 65, step: "AI Synthesis", timestamp: "Just now" },
    { id: "2", title: "The Art of Statistics", author: "David Spiegelhalter", category: "Data Science", status: "completed", progress: 100, step: "Finished", timestamp: "10m ago" },
    { id: "3", title: "Technology Management Vol 9", author: "Miguel R. Bravo", category: "Academic", status: "completed", progress: 100, step: "Finished", timestamp: "3h ago" },
    { id: "4", title: "HBR 1992 Annual", author: "Harvard Business", category: "Business", status: "failed", progress: 45, step: "OCR Extraction", timestamp: "5h ago" },
    { id: "5", title: "The 1% Rule", author: "Tommy Baker", category: "Self-Help", status: "pending", progress: 0, step: "Queued", timestamp: "1d ago" },
];

const initialLogs: LogEntry[] = [
    { id: "l1", type: "success", action: "process_complete", message: "Processing completed for 'The Art of Statistics'", duration: "22s", timestamp: "14:42:14" },
    { id: "l2", type: "success", action: "ai_synthesis", message: "Module synthesized successfully", duration: "16s", timestamp: "14:42:13" },
    { id: "l3", type: "info", action: "web_intelligence", message: "Found 0 external reviews", duration: "57ms", timestamp: "14:41:57" },
    { id: "l4", type: "error", action: "ocr_error", message: "Failed to extract text from page 45", duration: "3s", timestamp: "14:40:12" },
];

export default function PipelineDashboard() {
    const [isProcessing, setIsProcessing] = useState(true); // Simulator
    const [books, setBooks] = useState<BookStatus[]>(initialBooks);
    const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

    // --- Stats Calculations ---
    const totalBooks = books.length;
    const completedBooks = books.filter(b => b.status === "completed").length;
    const processingBooks = books.filter(b => b.status === "processing").length;
    const failedBooks = books.filter(b => b.status === "failed").length;

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-background pb-20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Cpu className="text-blue-600 size-6" />
                        LMS Automation Pipeline
                    </h1>
                    <p className="text-sm text-muted-foreground">Monitor & control content ingestion engine</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={isProcessing ? "default" : "secondary"} className="h-8 px-3 gap-2">
                        <div className={`size-2 rounded-full ${isProcessing ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                        {isProcessing ? "Pipeline Active" : "Pipeline Idle"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setIsProcessing(!isProcessing)}>
                        {isProcessing ? <Square className="size-4 mr-2" /> : <Play className="size-4 mr-2" />}
                        {isProcessing ? "Stop Pipeline" : "Start Pipeline"}
                    </Button>
                    <Button size="sm">
                        <Scan className="size-4 mr-2" />
                        Scan Drive
                    </Button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-6 space-y-6">

                {/* KPI Grid */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StaggerItem>
                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Processed</p>
                                    <h3 className="text-3xl font-bold mt-1">{totalBooks}</h3>
                                    <p className="text-xs text-green-600 flex items-center mt-1">
                                        <CheckCircle2 className="size-3 mr-1" /> All time
                                    </p>
                                </div>
                                <div className="size-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                                    <Database className="size-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Modules Created</p>
                                    <h3 className="text-3xl font-bold mt-1">{completedBooks}</h3>
                                    <p className="text-xs text-blue-600 flex items-center mt-1">
                                        <Brain className="size-3 mr-1" /> AI Synthesized
                                    </p>
                                </div>
                                <div className="size-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                                    <FileText className="size-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className="border-l-4 border-l-yellow-500">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                    <h3 className="text-3xl font-bold mt-1">{processingBooks}</h3>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="outline" className="text-[10px] h-5">OCR: 1</Badge>
                                        <Badge variant="outline" className="text-[10px] h-5">AI: 2</Badge>
                                    </div>
                                </div>
                                <div className="size-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center text-yellow-600 animate-spin-slow">
                                    <RefreshCw className="size-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>

                    <StaggerItem>
                        <Card className={`${failedBooks > 0 ? "border-l-4 border-l-red-500" : ""}`}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Failed / Attention</p>
                                    <h3 className="text-3xl font-bold mt-1">{failedBooks}</h3>
                                    <p className="text-xs text-red-500 flex items-center mt-1">
                                        {failedBooks > 0 ? "Requires manual review" : "System healthy"}
                                    </p>
                                </div>
                                <div className="size-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600">
                                    <AlertCircle className="size-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </StaggerItem>
                </StaggerContainer>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Pipeline View */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Visual Pipeline Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Live Pipeline Status</CardTitle>
                                <CardDescription>Real-time tracking of content transformation stages</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative py-4">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-800 -translate-y-1/2 z-0" />
                                    <div className="grid grid-cols-5 gap-4 relative z-10">
                                        {[
                                            { id: "ingest", label: "Ingest", desc: "Upload & Detect", icon: CloudUpload, count: 0 },
                                            { id: "meta", label: "Metadata", desc: "OCR & API", icon: Scan, count: 1 },
                                            { id: "ai", label: "AI Synthesis", desc: "Module Gen", icon: Brain, count: 2, active: true },
                                            { id: "db", label: "Database", desc: "Vector Store", icon: Database, count: 0 },
                                            { id: "done", label: "Delivery", desc: "Ready", icon: CheckCircle2, count: 5 },
                                        ].map((step, idx) => (
                                            <div key={step.id} className="flex flex-col items-center text-center">
                                                <div className={`size-12 rounded-full border-4 flex items-center justify-center bg-white dark:bg-card mb-3 transition-all duration-500
                          ${step.active ? "border-blue-500 text-blue-600 scale-110 shadow-lg shadow-blue-500/20" : "border-gray-200 dark:border-gray-700 text-gray-400"}`}>
                                                    <step.icon className="size-5" />
                                                </div>
                                                <h4 className={`font-semibold text-sm ${step.active ? "text-blue-600" : "text-foreground"}`}>{step.label}</h4>
                                                <span className="text-xs text-muted-foreground">{step.desc}</span>
                                                {step.count > 0 && (
                                                    <Badge className="mt-2 bg-gray-900 text-white dark:bg-white dark:text-black">
                                                        {step.count}
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Books Table */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Active Books</CardTitle>
                                    <CardDescription>Manage ingestion queue and processing</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Search books..." className="h-9 w-[200px]" />
                                    <Button variant="outline" size="sm" className="h-9"><RefreshCw className="size-4" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Book Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Stage</TableHead>
                                            <TableHead>Updated</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {books.map((book) => (
                                            <TableRow key={book.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded bg-gray-100 flex items-center justify-center">
                                                            <BookOpen className="size-4 text-gray-500" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm truncate max-w-[200px]">{book.title}</div>
                                                            <div className="text-xs text-muted-foreground">{book.author}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={book.status === "completed" ? "success" : book.status === "failed" ? "destructive" : "secondary"}>
                                                        {book.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-full max-w-[140px]">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span>{book.step}</span>
                                                            <span>{book.progress}%</span>
                                                        </div>
                                                        <Progress value={book.progress} className="h-2" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{book.timestamp}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="size-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar: Logs & Control */}
                    <div className="space-y-6">

                        {/* Control Panel */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pipeline Controls</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium uppercase text-muted-foreground">Configuration</label>
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-secondary/20 p-3 rounded-lg">
                                        <span className="text-sm font-medium">Auto-Ingest Drive</span>
                                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-secondary/20 p-3 rounded-lg">
                                        <span className="text-sm font-medium">Max Batch Size</span>
                                        <span className="text-sm font-mono">10</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Settings className="size-4 mr-2" /> Settings
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Terminal className="size-4 mr-2" /> Logs
                                    </Button>
                                </div>
                                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">
                                    Run Diagnostics
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Live Logs */}
                        <Card className="flex-1 flex flex-col min-h-[400px]">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">System Activity</CardTitle>
                                    <Badge variant="outline" className="text-[10px] h-5">Live</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0">
                                <ScrollArea className="h-[400px]">
                                    <div className="border-t divide-y">
                                        {logs.map((log) => (
                                            <div key={log.id} className="p-3 text-sm flex gap-3 hover:bg-gray-50 dark:hover:bg-secondary/20 transition-colors">
                                                <div className={`mt-1 size-2 rounded-full flex-shrink-0 
                          ${log.type === 'success' ? 'bg-green-500' :
                                                        log.type === 'error' ? 'bg-red-500' :
                                                            'bg-blue-500'}`}
                                                />
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className={`font-mono text-xs font-semibold
                              ${log.type === 'success' ? 'text-green-600' :
                                                                log.type === 'error' ? 'text-red-600' :
                                                                    'text-blue-600'}`}>
                                                            {log.action}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">{log.timestamp}</span>
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 leading-tight">{log.message}</p>
                                                    {log.duration && (
                                                        <span className="text-[10px] font-mono text-gray-400">{log.duration}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                            <CardFooter className="pt-2 border-t bg-gray-50/50 dark:bg-card">
                                <Input className="h-8 text-xs font-mono" placeholder="Filter logs..." />
                            </CardFooter>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
}

// Icon Helper
function CloudUpload({ className }: { className?: string }) {
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
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    );
}
