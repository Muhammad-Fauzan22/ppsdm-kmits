"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Check, Loader2, ArrowLeft, XCircle, FileType } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { ASSETS } from "@/config/assets";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Tahapan Proses untuk UI
type UploadStage = "idle" | "uploading" | "ai_trigger" | "complete" | "error";

export default function UploadPage() {
    const [stage, setStage] = useState<UploadStage>("idle");
    const [progress, setProgress] = useState(0);
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createClient();

    const handleUpload = async (file: File) => {
        try {
            // START
            setStage("uploading");
            setProgress(10);

            // 1. Sanitize Filename & Path
            const fileExt = file.name.split('.').pop();
            const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').replace(`_${fileExt}`, '');
            const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
            const filePath = `${fileName}`; // Upload ke root bucket 'materials' atau subfolder

            console.log("🚀 Starting upload:", fileName);

            // 2. Upload ke Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('materials')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            setProgress(60);
            setStage("ai_trigger");

            // 3. Ambil Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(filePath);

            console.log("✅ Upload success, triggering AI with URL:", publicUrl);

            // 4. Trigger Quantum Engine (API Webhook)
            // Kita kirim metadata dasar agar backend bisa membuat row di tabel learning_resources
            const response = await fetch('/api/webhooks/process-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileUrl: publicUrl,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type
                }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            setProgress(100);
            setStage("complete");

            toast({
                title: "Upload & Ingest Berhasil",
                description: "Materi sedang diproses oleh Quantum Engine di background.",
                variant: "default", // pastikan ada variant success/default di komponen toast anda
            });

            // Redirect setelah delay singkat
            setTimeout(() => {
                router.push('/library');
            }, 2000);

        } catch (error: any) {
            console.error("❌ Upload Workflow Error:", error);
            setStage("error");
            toast({
                title: "Gagal Memproses",
                description: error.message || "Terjadi kesalahan saat upload.",
                variant: "destructive",
            });
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            handleUpload(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
        },
        maxFiles: 1,
        disabled: stage !== 'idle'
    });

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* KOLOM KIRI: Upload Area */}
                <div className="md:col-span-2 space-y-6">
                    <Link href="/library" className="inline-flex items-center text-slate-500 hover:text-[#013880] mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Batal & Kembali
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-[#013880]">Upload Materi</h1>
                        <p className="text-slate-500 mt-2">Quantum Engine siap mengubah PDF/PPTX menjadi materi interaktif.</p>
                    </div>

                    {stage === 'idle' ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-3 border-dashed rounded-3xl h-80 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white relative overflow-hidden",
                                isDragActive ? "border-[#013880] bg-blue-50 ring-4 ring-blue-100" : "border-slate-300 hover:border-blue-400 hover:shadow-xl"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-[#013880] z-10">
                                <UploadCloud className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 z-10">Drag & Drop File Disini</h3>
                            <p className="text-slate-400 mt-2 text-sm max-w-xs z-10">
                                Support: PDF, PPTX (Max 50MB)
                            </p>
                            <Button className="mt-6 bg-[#013880] hover:bg-[#012d66] z-10">Pilih File Manual</Button>

                            {/* Decorative Background Icon */}
                            <FileType className="absolute -bottom-10 -right-10 w-64 h-64 text-slate-50 opacity-50 rotate-12" />
                        </div>
                    ) : (
                        <Card className={cn("border shadow-lg transition-all", stage === 'error' && "border-red-200 bg-red-50")}>
                            <CardContent className="p-8 space-y-8">
                                {stage === 'error' ? (
                                    <div className="text-center py-4">
                                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-red-700">Terjadi Kesalahan</h3>
                                        <p className="text-red-600 mb-6">Gagal menghubungkan ke Quantum Server.</p>
                                        <Button onClick={() => setStage('idle')} variant="outline" className="border-red-200 hover:bg-red-100">Coba Lagi</Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-6">
                                            <StepItem
                                                title="Secure Vault Upload"
                                                desc="Mengenkripsi dan menyimpan file ke Storage..."
                                                status={progress >= 60 ? 'done' : stage === 'uploading' ? 'active' : 'pending'}
                                            />
                                            <StepItem
                                                title="Quantum Ingestion"
                                                desc="Mendaftarkan materi ke antrian pemrosesan AI..."
                                                status={stage === 'complete' ? 'done' : stage === 'ai_trigger' ? 'active' : 'pending'}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm font-medium text-slate-600">
                                                <span>Status: {stage === 'complete' ? 'SELESAI' : 'MEMPROSES...'}</span>
                                                <span>{progress}%</span>
                                            </div>
                                            <Progress value={progress} className="h-3" />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* KOLOM KANAN: Mascot Feedback */}
                <div className="flex flex-col items-center justify-center md:justify-start pt-12">
                    <div className="relative w-48 h-48 mb-6">
                        <Image
                            src={ASSETS.mascot.seno_studio}
                            alt="Seno Mascot"
                            fill
                            className="object-contain drop-shadow-xl animate-bounce-slow"
                        />
                    </div>

                    <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-lg border border-slate-100 relative max-w-xs">
                        <div className="absolute -top-3 -left-3 w-6 h-6 bg-white border-t border-l border-slate-100 transform -rotate-45" />
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">
                            {stage === 'idle' && "Halo! Seret materi kuliahmu ke samping, biar Seno proses jadi kuis dan ringkasan!"}
                            {stage === 'uploading' && "Sip! Sedang Seno angkut ke server..."}
                            {stage === 'ai_trigger' && "Oke, file masuk. Sekarang Seno panggil teman-teman AI untuk mulai membacanya..."}
                            {stage === 'complete' && "Berhasil! Materi sedang 'dimasak'. Cek dashboard sebentar lagi ya!"}
                            {stage === 'error' && "Waduh, koneksinya putus sepertinya. Coba ulangi lagi ya, Commander?"}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Helper Component untuk Stepper Visual
function StepItem({ title, desc, status }: { title: string, desc: string, status: 'pending' | 'active' | 'done' }) {
    return (
        <div className={cn("flex items-start gap-4 transition-opacity duration-500", status === 'pending' && "opacity-40")}>
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300",
                status === 'done' ? "bg-emerald-100 border-emerald-500 text-emerald-600" :
                    status === 'active' ? "bg-blue-100 border-blue-600 text-blue-600 animate-pulse" :
                        "bg-slate-50 border-slate-200 text-slate-300"
            )}>
                {status === 'done' ? <Check className="w-5 h-5" /> :
                    status === 'active' ? <Loader2 className="w-5 h-5 animate-spin" /> :
                        <div className="w-3 h-3 rounded-full bg-slate-300" />
                }
            </div>
            <div>
                <h4 className={cn("font-bold text-base", status === 'active' ? "text-[#013880]" : "text-slate-700")}>{title}</h4>
                <p className="text-sm text-slate-500">{desc}</p>
            </div>
        </div>
    )
}
