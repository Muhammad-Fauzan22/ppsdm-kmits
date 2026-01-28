"use client";

import React, { useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { ASSETS } from "@/config/assets";
import { cn } from "@/lib/utils";
import {
    CloudUpload,
    FileText,
    Check,
    Loader2,
    X,
    Trash2,
    Database,
    BrainCircuit,
    Wand2,
    ArrowLeft
} from "lucide-react";

// --- TYPES ---
type UploadStage = "idle" | "uploading" | "processing" | "complete" | "error";

interface FileUploadItem {
    id: string;
    file: File;
    status: 'uploading' | 'processing' | 'ready' | 'error';
    progress: number;
    error?: string;
}

export default function AlchemyUploadPage() {
    // --- STATE ---
    const [uploads, setUploads] = useState<FileUploadItem[]>([]);
    const [pipelineStep, setPipelineStep] = useState(0); // 0: Idle, 1: Upload, 2: Extract, 3: Analyze, 4: Generate
    const { toast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    // --- HANDLERS ---

    const handleFileUpload = async (files: File[]) => {
        const newUploads = files.map(file => ({
            id: Math.random().toString(36).substring(7),
            file,
            status: 'uploading' as const,
            progress: 0
        }));

        setUploads(prev => [...prev, ...newUploads]);

        // Start Pipeline Simulation for each file
        for (const item of newUploads) {
            await processFilePipeline(item);
        }
    };

    const processFilePipeline = async (item: FileUploadItem) => {
        try {
            // STEP 1: UPLOAD
            updateUploadStatus(item.id, 'uploading', 10);
            setPipelineStep(1);

            // Sanitize
            const fileExt = item.file.name.split('.').pop();
            const cleanName = item.file.name.replace(/[^a-zA-Z0-9]/g, '_').replace(`_${fileExt}`, '');
            const fileName = `${Date.now()}_${cleanName}.${fileExt}`;

            // Supabase Upload
            const { data, error } = await supabase.storage
                .from('materials')
                .upload(fileName, item.file);

            if (error) throw error;

            updateUploadStatus(item.id, 'uploading', 50);

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(fileName);

            // STEP 2: EXTRACTION (Trigger Webhook)
            updateUploadStatus(item.id, 'processing', 60);
            setPipelineStep(2);

            // Call API
            const response = await fetch('/api/webhooks/process-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer internal-system'
                },
                body: JSON.stringify({
                    fileUrl: publicUrl,
                    fileName: item.file.name,
                    fileSize: item.file.size,
                    fileType: item.file.type,
                    // Pass metadata if available, otherwise defaults
                    metadata: {
                        title: item.file.name,
                        author: "Unknown",
                        category: "General",
                        tags: ["upload"]
                    }
                }),
            });

            if (!response.ok) throw new Error("Processing Trigger Failed");

            // SIMULATE PIPELINE STEPS (Since backend is async)
            // Step 3: Analysis
            await new Promise(r => setTimeout(r, 1500));
            setPipelineStep(3);
            updateUploadStatus(item.id, 'processing', 80);

            // Step 4: Generation
            await new Promise(r => setTimeout(r, 1500));
            setPipelineStep(4);
            updateUploadStatus(item.id, 'ready', 100);

            toast({
                title: "Alchemy Complete",
                description: `${item.file.name} has been processed successfully.`,
            });

            // Optional: Redirect after success
            // setTimeout(() => router.push('/library'), 3000);

        } catch (error: any) {
            console.error("Pipeline Error:", error);
            updateUploadStatus(item.id, 'error', 0, error.message);
            toast({
                title: "Upload Failed",
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    const updateUploadStatus = (id: string, status: FileUploadItem['status'], progress: number, error?: string) => {
        setUploads(prev => prev.map(u =>
            u.id === id ? { ...u, status, progress, error } : u
        ));
    };

    const removeUpload = (id: string) => {
        setUploads(prev => prev.filter(u => u.id !== id));
    };

    // Dropszone config
    const onDrop = useCallback((acceptedFiles: File[]) => {
        handleFileUpload(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
        },
        maxFiles: 5
    });

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white">

            {/* TOP NAVBAR (Match Global Design) */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-10 py-3 shrink-0 z-20">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">science</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">PPSDM KM ITS</h2>
                    </Link>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <nav className="hidden md:flex items-center gap-9">
                        <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                        <Link href="/library" className="text-primary text-sm font-bold">Library</Link>
                        <Link href="/analytics" className="text-sm font-medium hover:text-primary transition-colors">Analytics</Link>
                    </nav>
                    <div className="size-10 rounded-full bg-slate-200 border border-slate-300 dark:border-gray-700 bg-cover bg-center" style={{ backgroundImage: `url('${ASSETS.avatar.student}')` }}></div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex flex-1 overflow-hidden">
                <div className="flex w-full h-full">

                    {/* LEFT PANEL: Upload Zone */}
                    <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-background-dark p-8 lg:p-12 relative z-10 transition-colors">
                        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8">

                            {/* Page Heading */}
                            <div className="flex flex-col gap-2">
                                <Link href="/library" className="flex items-center gap-2 text-slate-500 hover:text-primary mb-2 w-fit transition-colors">
                                    <ArrowLeft className="w-4 h-4" /> Back to Library
                                </Link>
                                <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111318] dark:text-white">
                                    Alchemy Upload
                                </h1>
                                <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                                    Ingest raw documents into the Quantum Alchemy Engine.
                                </p>
                            </div>

                            {/* Dropzone */}
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "group relative flex flex-col items-center justify-center w-full h-80 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer overflow-hidden",
                                    isDragActive && "border-primary bg-primary/10 scale-[1.01]"
                                )}
                            >
                                <input {...getInputProps()} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                    <CloudUpload className={cn("w-16 h-16 text-primary mb-4 transition-transform", isDragActive ? "animate-bounce scale-110" : "group-hover:scale-110")} />
                                    <p className="text-lg font-bold">Drag & drop PDF files here</p>
                                    <p className="text-sm text-slate-500 mt-2">or click to browse</p>
                                    <span className="mt-6 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-primary bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        Select File
                                    </span>
                                </div>
                                {/* Decorative BG */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
                            </div>

                            {/* File List */}
                            {uploads.length > 0 && (
                                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-lg font-bold">Current Uploads</h3>
                                    {uploads.map((item) => (
                                        <div key={item.id} className={cn("flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all", item.status === 'ready' ? "bg-emerald-50/50 border-emerald-100" : "bg-white dark:bg-gray-800 border-slate-100 dark:border-gray-700")}>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-lg", item.status === 'error' ? "bg-red-50 text-red-600" : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400")}>
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-base font-medium line-clamp-1">{item.file.name}</p>
                                                        <p className="text-sm text-slate-500">
                                                            {(item.file.size / 1024 / 1024).toFixed(2)} MB •
                                                            <span className={cn("ml-1 font-bold",
                                                                item.status === 'ready' ? "text-emerald-600" :
                                                                    item.status === 'error' ? "text-red-600" :
                                                                        "text-primary"
                                                            )}>
                                                                {item.status === 'uploading' ? 'Uploading...' :
                                                                    item.status === 'processing' ? 'Processing...' :
                                                                        item.status === 'ready' ? 'Ready' : 'Failed'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeUpload(item.id)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {/* Progress Bar */}
                                            {item.status !== 'ready' && item.status !== 'error' && (
                                                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-gray-700 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>

                    {/* RIGHT PANEL: Quantum Pipeline Tracker */}
                    <div className="hidden lg:flex w-[400px] xl:w-[480px] shrink-0 flex-col border-l border-slate-200 dark:border-gray-800 bg-blue-50/40 dark:bg-[#0f172a] p-8 relative">
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                                <Database className="w-6 h-6" />
                                Quantum Pipeline
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-gray-400">Real-time processing status of your content.</p>
                        </div>

                        {/* Stepper */}
                        <div className="flex flex-col flex-1 relative pl-4">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] top-4 bottom-20 w-0.5 bg-slate-200 dark:bg-gray-700 -z-10"></div>

                            {/* Step 1: Upload */}
                            <PipelineStep
                                icon={<CloudUpload className="w-4 h-4" />}
                                title="Upload"
                                desc="Securely transferring to cloud storage."
                                status={pipelineStep > 1 ? 'completed' : pipelineStep === 1 ? 'active' : 'pending'}
                            />

                            {/* Step 2: Extraction */}
                            <PipelineStep
                                icon={<FileText className="w-4 h-4" />}
                                title="Extraction"
                                desc="Parsing text and images from PDF."
                                status={pipelineStep > 2 ? 'completed' : pipelineStep === 2 ? 'active' : 'pending'}
                            />

                            {/* Step 3: Analysis */}
                            <PipelineStep
                                icon={<BrainCircuit className="w-4 h-4" />}
                                title="Analysis"
                                desc="AI analyzing context and key concepts."
                                status={pipelineStep > 3 ? 'completed' : pipelineStep === 3 ? 'active' : 'pending'}
                            />

                            {/* Step 4: Generation */}
                            <PipelineStep
                                icon={<Wand2 className="w-4 h-4" />}
                                title="Generation"
                                desc="Creating quizzes, flashcards and summaries."
                                status={pipelineStep === 4 ? 'completed' : 'pending'}
                            />
                        </div>

                        {/* Mascot Seno */}
                        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-gray-800">
                            <div className="flex gap-4 items-start">
                                <Link href="/library/upload">
                                    <div className="size-12 rounded-full shrink-0 bg-cover bg-center border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform" style={{ backgroundImage: `url('${ASSETS.mascot.seno_head}')` }}></div>
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 dark:border-gray-700 relative">
                                        <p className="text-xs leading-relaxed text-slate-700 dark:text-gray-200">
                                            <span className="font-bold block mb-1 text-primary">Maskot Seno says:</span>
                                            {pipelineStep === 0 ? "Hi! I'm Seno. Upload a PDF to start the magic! 🚀" :
                                                pipelineStep === 4 ? "Done! Your content is ready to explore." :
                                                    "Processing... sit tight, this usually takes about 2 minutes."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

// --- HELPER COMPONENT ---
function PipelineStep({ icon, title, desc, status }: { icon: React.ReactNode, title: string, desc: string, status: 'pending' | 'active' | 'completed' }) {
    return (
        <div className={cn("flex gap-6 mb-10 group transition-all duration-500", status === 'pending' && "opacity-50")}>
            <div className="flex flex-col items-center">
                <div className={cn(
                    "size-8 rounded-full flex items-center justify-center shadow-md ring-4 ring-white dark:ring-[#0f172a] transition-all duration-500",
                    status === 'completed' ? "bg-primary text-white scale-110" :
                        status === 'active' ? "bg-white border-2 border-primary text-primary scale-110" :
                            "bg-slate-200 text-slate-500"
                )}>
                    {status === 'completed' ? <Check className="w-5 h-5 font-bold" /> :
                        status === 'active' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                            icon}
                </div>
            </div>
            <div className="flex flex-col -mt-1">
                <h4 className={cn("text-sm font-bold transition-colors", status === 'active' || status === 'completed' ? "text-primary dark:text-white" : "text-slate-900")}>{title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                {status === 'active' && (
                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[10px] font-medium w-fit animate-pulse">
                        <span className="size-1.5 rounded-full bg-blue-500"></span>
                        Processing...
                    </div>
                )}
            </div>
        </div>
    );
}

