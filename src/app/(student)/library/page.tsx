"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Search, BookOpen, BrainCircuit, Loader2, Flame, Filter, MoreVertical, PlayCircle, FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ASSETS } from "@/config/assets";
import { useQuantumLibrary, LearningResource } from "@/hooks/useQuantumLibrary";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default function LibraryDashboard() {
    const { books, stats, isLoading } = useQuantumLibrary();

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 space-y-8">

            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#013880] tracking-tight">Quantum Library</h1>
                    <p className="text-slate-500 mt-1">Pusat pengetahuan digital KM ITS.</p>
                </div>
                <Link href="/library/upload">
                    <Button className="bg-[#013880] hover:bg-[#012d66] text-white shadow-lg shadow-blue-900/20">
                        + Upload Materi Baru
                    </Button>
                </Link>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Materi"
                    value={isLoading ? "..." : stats.total}
                    icon={BookOpen}
                    color="text-blue-600" bg="bg-blue-50"
                />
                <StatCard
                    title="AI Enhanced"
                    value={isLoading ? "..." : stats.aiReady}
                    icon={BrainCircuit}
                    color="text-emerald-600" bg="bg-emerald-50"
                />
                <StatCard
                    title="Sedang Diproses"
                    value={isLoading ? "..." : stats.processing}
                    icon={Loader2}
                    color="text-amber-600" bg="bg-amber-50"
                />
                <StatCard
                    title="Learning Streak"
                    value={stats.learningStreak}
                    icon={Flame}
                    color="text-orange-600" bg="bg-orange-50"
                />
            </div>

            {/* SEARCH & FILTER */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                        placeholder="Cari judul buku, penulis, atau mata kuliah..."
                        className="pl-10 h-12 bg-white border-slate-200 focus:border-[#013880] shadow-sm rounded-xl"
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 border-slate-200 text-slate-600 gap-2 rounded-xl">
                    <Filter className="w-4 h-4" /> Filter
                </Button>
            </div>

            {/* BOOKS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* LOADING STATE */}
                {isLoading && Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="border-slate-200 h-full flex flex-col overflow-hidden">
                        <Skeleton className="h-48 w-full rounded-none" />
                        <div className="p-5 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </Card>
                ))}

                {/* EMPTY STATE */}
                {!isLoading && books.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700">Perpustakaan Masih Kosong</h3>
                        <p className="text-slate-500 max-w-md mt-2 mb-6">Jadilah yang pertama mengupload materi dan biarkan AI kami bekerja untukmu.</p>
                        <Link href="/library/upload">
                            <Button variant="outline" className="border-[#013880] text-[#013880]">Mulai Upload</Button>
                        </Link>
                    </div>
                )}

                {/* DATA MAPPING */}
                {!isLoading && books.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}

            </div>
        </div>
    );
}

// --- SUB COMPONENTS ---

function StatCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

function BookCard({ book }: { book: LearningResource }) {
    const isReady = book.status === 'completed';
    const isProcessing = ['queued', 'processing'].includes(book.status);
    const isFailed = book.status === 'failed';

    return (
        <Link href={isReady ? `/library/${book.id}` : '#'}>
            <Card className={`group overflow-hidden border-slate-200 hover:border-[#013880]/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer h-full flex flex-col ${isFailed ? 'opacity-60' : ''}`}>

                {/* Cover Area */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                        {isReady && (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 gap-1 px-3 py-1">
                                <BrainCircuit className="w-3 h-3" /> AI Ready
                            </Badge>
                        )}
                        {isProcessing && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Processing
                            </Badge>
                        )}
                        {isFailed && (
                            <Badge variant="destructive">Gagal</Badge>
                        )}
                    </div>

                    {/* Fallback Cover Image logic */}
                    <div className="w-32 h-40 bg-white shadow-lg rounded-md flex flex-col items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                        {book.cover_image ? (
                            <Image src={book.cover_image} alt={book.title} fill className="object-cover rounded-md" />
                        ) : (
                            <>
                                <FileText className="w-12 h-12 text-slate-300" />
                                <Image src={ASSETS.its.logo_biru} alt="ITS" width={30} height={30} className="mt-4 opacity-30 grayscale" />
                            </>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 line-clamp-1 max-w-[70%]">
                            {book.category || "General"}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    <h3 className="font-bold text-slate-800 line-clamp-2 mb-1 group-hover:text-[#013880] transition-colors leading-snug">
                        {book.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-1">{book.author || "Penulis Tidak Diketahui"}</p>

                    <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                        <span>{formatDistanceToNow(new Date(book.created_at), { addSuffix: true, locale: id })}</span>
                        {isReady && <PlayCircle className="w-4 h-4 text-emerald-500" />}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
