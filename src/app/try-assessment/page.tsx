"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Clock, DollarSign, Dumbbell, Users, Sparkles, Scale, Flower2, Leaf, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DIMENSIONS = [
    { id: "cognitive", number: "01", title: "Kemampuan Intelektual", desc: "Pengukuran kognitif dan kemampuan berpikir kritis", icon: Brain, color: "blue", href: "/assessment/cognitive" },
    { id: "self-management", number: "02", title: "Manajemen Diri", desc: "Kemampuan mengelola waktu dan prioritas", icon: Clock, color: "emerald", href: "/assessment/self-management" },
    { id: "financial", number: "03", title: "Literasi Finansial", desc: "Pemahaman keuangan dan kewirausahaan", icon: DollarSign, color: "yellow", href: "/assessment/financial" },
    { id: "health", number: "04", title: "Kesehatan Fisik", desc: "Evaluasi kesehatan dan gaya hidup", icon: Dumbbell, color: "red", href: "/assessment/health" },
    { id: "social", number: "05", title: "Kecerdasan Sosial", desc: "Kemampuan bersosialisasi dan berkolaborasi", icon: Users, color: "pink", href: "/assessment/social" },
    { id: "mental", number: "06", title: "Kesehatan Mental", desc: "Ketahanan mental dan manajemen stres", icon: Sparkles, color: "indigo", href: "/assessment/mental" },
    { id: "character", number: "07", title: "Karakter & Etika", desc: "Integritas dan pengambilan keputusan moral", icon: Scale, color: "cyan", href: "/assessment/character" },
    { id: "spiritual", number: "08", title: "Perkembangan Spiritual", desc: "Makna hidup dan nilai-nilai transenden", icon: Flower2, color: "violet", href: "/assessment/spiritual" },
    { id: "environmental", number: "09", title: "Kesadaran Lingkungan", desc: "Gaya hidup berkelanjutan dan ekologis", icon: Leaf, color: "lime", href: "/assessment/environmental" },
];

const colorClasses: Record<string, { text: string; bg: string; border: string }> = {
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    yellow: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
    red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
    pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    indigo: { text: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30" },
    cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
    violet: { text: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
    lime: { text: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/30" },
};

export default function TryAssessmentPage() {
    const [selectedDimension, setSelectedDimension] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <header className="py-8 px-6 border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">PPSDM KMITS</span>
                    </Link>
                    <Link href="/auth/login">
                        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Login untuk Lihat Hasil
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-sm font-semibold mb-4">
                            🆓 Gratis & Tanpa Login
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Holistic Assessment <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                9 Dimensi Pengembangan Diri
                            </span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Temukan potensi tersembunyi Anda melalui asesmen holistik berbasis riset ilmiah.
                            Pilih dimensi untuk memulai.
                        </p>
                    </div>

                    {/* Alert */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-white mb-1">Hasil Assessment Anda</h4>
                                <p className="text-sm text-slate-400">
                                    Hasil assessment akan disimpan sementara. Untuk menyimpan permanen dan mendapatkan
                                    rekomendasi personalisasi, <Link href="/auth/register" className="text-blue-400 underline">daftar akun gratis</Link>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dimension Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {DIMENSIONS.map((dim) => {
                            const c = colorClasses[dim.color];
                            const Icon = dim.icon;
                            return (
                                <Link href={dim.href} key={dim.id}>
                                    <Card
                                        className={cn(
                                            "bg-slate-800/50 border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group h-full",
                                            selectedDimension === dim.id && "ring-2 ring-blue-500"
                                        )}
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className={cn("size-12 rounded-xl flex items-center justify-center", c.bg)}>
                                                    <Icon className={cn("w-6 h-6", c.text)} />
                                                </div>
                                                <span className="text-xs text-slate-500 font-mono">{dim.number}</span>
                                            </div>
                                            <CardTitle className="text-white text-lg mt-3 group-hover:text-blue-400 transition-colors">
                                                {dim.title}
                                            </CardTitle>
                                            <CardDescription className="text-slate-400">
                                                {dim.desc}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">~15 menit</span>
                                                <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-transform">
                                                    Mulai <ArrowRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Footer Info */}
                    <div className="mt-16 text-center">
                        <p className="text-slate-500 text-sm">
                            © 2024 PPSDM KMM ITS. Assessment berbasis riset ilmiah.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
