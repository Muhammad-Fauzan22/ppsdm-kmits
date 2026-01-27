"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    ArrowLeft,
    MessageSquare,
    Share2,
    Download,
    Play,
    Pause,
    SkipForward,
    SkipBack,
    Brain,
    ListTodo,
    Mic,
    Presentation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ASSETS } from "@/config/assets";
import Link from "next/link";

// --- MOCK COMPONENT: FLIP CARD ---
const Flashcard = ({ front, back }: { front: string; back: string }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="group perspective-1000 w-full h-80 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* FRONT */}
                <div className="absolute w-full h-full backface-hidden bg-white border-2 border-slate-100 rounded-2xl shadow-sm p-8 flex flex-col items-center justify-center text-center hover:border-blue-200 transition-colors">
                    <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-100">Pertanyaan</Badge>
                    <h3 className="text-xl font-medium text-slate-800">{front}</h3>
                    <p className="mt-8 text-sm text-slate-400 animate-pulse">Klik untuk melihat jawaban</p>
                </div>

                {/* BACK */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[#013880] rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center text-white">
                    <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-none">Jawaban</Badge>
                    <p className="text-lg leading-relaxed">{back}</p>
                </div>
            </div>
        </div>
    );
};

export default function AlchemyViewer({ params }: { params: { id: string } }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            {/* HERO SECTION */}
            <div className="relative bg-gradient-to-r from-[#013880] to-slate-900 text-white pt-24 pb-12 px-6 md:px-12 overflow-hidden">
                {/* Watermark */}
                <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-96 h-96">
                    <Image
                        src={ASSETS.its.logo_putih}
                        alt="Watermark"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto">
                    <Link href="/library" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Library
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="flex-1">
                            <Badge className="bg-[#FFBD07] text-slate-900 hover:bg-yellow-500 mb-4 font-bold border-none">
                                AI GENERATED CONTENT
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 leading-tight">Mekanika Fluida Dasar</h1>
                            <p className="text-xl text-blue-100 mb-6">Prof. Dr. Ir. Sutrisno • S1 Teknik Mesin</p>

                            <div className="flex gap-3">
                                <Button className="bg-white text-[#013880] hover:bg-blue-50">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Chat dengan Buku
                                </Button>
                                <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10">
                                    <Download className="w-4 h-4 mr-2" /> Original PDF
                                </Button>
                                <Button size="icon" variant="ghost" className="bg-transparent text-white hover:bg-white/10">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Completion Status */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full md:w-64">
                            <p className="text-sm text-blue-200 mb-2">Progress Belajar</p>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-3xl font-bold">24%</span>
                                <span className="text-xs text-blue-200">12/50 Modul</span>
                            </div>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-[#FFBD07] w-[24%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT TABS */}
            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
                <Tabs defaultValue="microlearning" className="space-y-8">
                    <TabsList className="bg-white p-1 rounded-xl shadow-lg border border-slate-100 w-full md:w-auto inline-flex h-auto grid grid-cols-2 md:grid-cols-5">
                        <TabsTrigger value="microlearning" className="py-3 rounded-lg data-[state=active]:bg-[#013880] data-[state=active]:text-white">
                            <Brain className="w-4 h-4 mr-2" /> Micro
                        </TabsTrigger>
                        <TabsTrigger value="mindmap" className="py-3 rounded-lg data-[state=active]:bg-[#013880] data-[state=active]:text-white">
                            <Share2 className="w-4 h-4 mr-2" /> Mindmap
                        </TabsTrigger>
                        <TabsTrigger value="quiz" className="py-3 rounded-lg data-[state=active]:bg-[#013880] data-[state=active]:text-white">
                            <ListTodo className="w-4 h-4 mr-2" /> Kuis
                        </TabsTrigger>
                        <TabsTrigger value="podcast" className="py-3 rounded-lg data-[state=active]:bg-[#013880] data-[state=active]:text-white">
                            <Mic className="w-4 h-4 mr-2" /> Podcast
                        </TabsTrigger>
                        <TabsTrigger value="slides" className="py-3 rounded-lg data-[state=active]:bg-[#013880] data-[state=active]:text-white">
                            <Presentation className="w-4 h-4 mr-2" /> Slide
                        </TabsTrigger>
                    </TabsList>

                    {/* 1. MICROLEARNING TAB */}
                    <TabsContent value="microlearning" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Flashcard
                                front="Apa Hukum Bernoulli?"
                                back="Hukum Bernoulli menyatakan bahwa kenaikan kecepatan aliran fluida akan menyebabkan penurunan tekanan fluida secara bersamaan."
                            />
                            <Flashcard
                                front="Sebutkan 3 sifat utama fluida ideal!"
                                back="1. Tidak kompresibel (incompressible) \n 2. Tidak ada viskositas (non-viscous) \n 3. Aliran tunak (steady flow)"
                            />
                        </div>
                    </TabsContent>

                    {/* 2. MINDMAP TAB */}
                    <TabsContent value="mindmap">
                        <Card className="min-h-[500px] flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300">
                            <div className="text-center text-slate-400">
                                <Share2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-slate-600">Interactive Mermaid.js Diagram</h3>
                                <p>Visualisasi struktur konsep akan dirender di sini.</p>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* 3. QUIZ TAB */}
                    <TabsContent value="quiz">
                        <Card>
                            <CardContent className="p-8">
                                <div className="mb-6">
                                    <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Pertanyaan 1 dari 10</span>
                                    <h3 className="text-xl font-medium mt-2 text-slate-800">Manakah di bawah ini yang BUKAN merupakan karakteristik aliran laminar?</h3>
                                </div>

                                <div className="space-y-3">
                                    {["Bilangan Reynolds rendah (< 2000)", "Partikel fluida bergerak teratur", "Terjadi percampuran makroskopis yang kuat", "Profil kecepatan berbentuk parabola"].map((opt, i) => (
                                        <div key={i} className="p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors flex items-center group">
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-blue-500 mr-4 flex items-center justify-center">
                                                <div className="w-3 h-3 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-slate-700">{opt}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <Button className="bg-[#013880] px-8">Lanjut</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 4. PODCAST TAB */}
                    <TabsContent value="podcast">
                        <Card className="bg-[#0f172a] text-white border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20" />
                            <CardContent className="p-8 md:p-12 flex flex-col items-center text-center relative z-10">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 mb-6 shadow-2xl flex items-center justify-center">
                                    <Mic className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Deep Dive: Fluid Mechanics</h3>
                                <p className="text-slate-400 mb-8">Episode 1: Understanding Viscosity & Flow</p>

                                <div className="w-full max-w-xl space-y-4">
                                    <div className="flex justify-between text-xs text-slate-400">
                                        <span>04:12</span>
                                        <span>15:30</span>
                                    </div>
                                    <Slider defaultValue={[25]} max={100} step={1} className="[&>.relative>.bg-primary]:bg-[#FFBD07]" />

                                    <div className="flex items-center justify-center gap-6 mt-6">
                                        <Button variant="ghost" className="text-slate-400 hover:text-white"><SkipBack className="w-6 h-6" /></Button>
                                        <Button
                                            className="w-16 h-16 rounded-full bg-white text-[#0f172a] hover:bg-gray-200 flex items-center justify-center"
                                            onClick={() => setIsPlaying(!isPlaying)}
                                        >
                                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                                        </Button>
                                        <Button variant="ghost" className="text-slate-400 hover:text-white"><SkipForward className="w-6 h-6" /></Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 5. SLIDES TAB */}
                    <TabsContent value="slides">
                        <div className="aspect-video bg-black rounded-xl flex items-center justify-center text-white">
                            <p>Slide Deck Viewer Placeholder</p>
                        </div>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
