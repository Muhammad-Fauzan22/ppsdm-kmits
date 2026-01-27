"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="min-h-screen bg-background-dark text-white p-6 md:p-8 space-y-8"
        >

            {/* HEADER SECTION */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Quantum Library</h1>
                    <p className="text-slate-400 mt-1">Pusat pengetahuan digital KM ITS.</p>
                </div>
                <Link href="/library/upload">
                    <Button className="bg-brand-blue hover:bg-blue-600 text-white shadow-lg shadow-brand-blue/20 border-none transition-all active:scale-95">
                        + Upload Materi Baru
                    </Button>
                </Link>
            </motion.div>

            {/* STATS CARDS */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="Total Materi"
                        value={isLoading ? "..." : stats.total}
                        icon={BookOpen}
                        color="text-brand-blue" bg="bg-brand-blue/10"
                        borderColor="border-brand-blue/20"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="AI Enhanced"
                        value={isLoading ? "..." : stats.aiReady}
                        icon={BrainCircuit}
                        color="text-emerald-400" bg="bg-emerald-500/10"
                        borderColor="border-emerald-500/20"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="Sedang Diproses"
                        value={isLoading ? "..." : stats.processing}
                        icon={Loader2}
                        color="text-amber-400" bg="bg-amber-500/10"
                        borderColor="border-amber-500/20"
                    />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard
                        title="Learning Streak"
                        value={stats.learningStreak}
                        icon={Flame}
                        color="text-orange-400" bg="bg-orange-500/10"
                        borderColor="border-orange-500/20"
                    />
                </motion.div>
            </motion.div>

            {/* SEARCH & FILTER */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <Input
                        placeholder="Cari judul buku, penulis, atau mata kuliah..."
                        className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-brand-blue focus:ring-brand-blue/20 rounded-xl"
                    />
                </div>
                <Button variant="outline" className="h-12 px-6 bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 gap-2 rounded-xl transition-colors">
                    <Filter className="w-4 h-4" /> Filter
                </Button>
            </motion.div>

            {/* BOOKS GRID */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {/* LOADING STATE */}
                {isLoading && Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 h-full flex flex-col overflow-hidden">
                        <Skeleton className="h-48 w-full rounded-none bg-white/10" />
                        <div className="p-5 space-y-3">
                            <Skeleton className="h-5 w-3/4 bg-white/10" />
                            <Skeleton className="h-4 w-1/2 bg-white/10" />
                        </div>
                    </Card>
                ))}

                {/* EMPTY STATE */}
                {!isLoading && books.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-10 h-10 text-slate-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white">Perpustakaan Masih Kosong</h3>
                        <p className="text-slate-400 max-w-md mt-2 mb-6">Jadilah yang pertama mengupload materi dan biarkan AI kami bekerja untukmu.</p>
                        <Link href="/library/upload">
                            <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">Mulai Upload</Button>
                        </Link>
                    </div>
                )}

                {/* DATA MAPPING */}
                {!isLoading && books.map((book) => (
                    <motion.div key={book.id} variants={itemVariants} className="h-full">
                        <BookCard book={book} />
                    </motion.div>
                ))}

            </motion.div>
        </motion.div>
    );
}

// --- SUB COMPONENTS ---

function StatCard({ title, value, icon: Icon, color, bg, borderColor }: any) {
    return (
        <Card className={`glass-card border ${borderColor || 'border-white/10'} shadow-lg`}>
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
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
            <Card className={`group glass-card overflow-hidden border-white/10 hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all duration-300 cursor-pointer h-full flex flex-col ${isFailed ? 'opacity-60' : ''}`}>

                {/* Cover Area */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                        {isReady && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/20 gap-1 px-3 py-1 backdrop-blur-md">
                                <BrainCircuit className="w-3 h-3" /> AI Ready
                            </Badge>
                        )}
                        {isProcessing && (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20 animate-pulse gap-1 backdrop-blur-md">
                                <Loader2 className="w-3 h-3 animate-spin" /> Processing
                            </Badge>
                        )}
                        {isFailed && (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/20 backdrop-blur-md">Gagal</Badge>
                        )}
                    </div>

                    {/* Fallback Cover Image logic */}
                    <div className="w-32 h-40 bg-card-dark shadow-2xl rounded-md flex flex-col items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
                        {book.cover_image ? (
                            <Image src={book.cover_image} alt={book.title} fill className="object-cover rounded-md" />
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
                                <FileText className="w-12 h-12 text-slate-600 mb-2" />
                            </>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] text-slate-400 border-white/10 bg-white/5 line-clamp-1 max-w-[70%]">
                            {book.category || "General"}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white hover:bg-white/10">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    <h3 className="font-bold text-white line-clamp-2 mb-1 group-hover:text-brand-blue transition-colors leading-snug">
                        {book.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-1">{book.author || "Penulis Tidak Diketahui"}</p>

                    <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                        <span>{formatDistanceToNow(new Date(book.created_at), { addSuffix: true, locale: id })}</span>
                        {isReady && <PlayCircle className="w-4 h-4 text-emerald-400" />}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
