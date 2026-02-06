"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ActivityManagementPage() {
    const [activeTab, setActiveTab] = useState('Semua Kegiatan');

    const activities = [
        {
            title: "Lomba Karya Tulis Ilmiah Nasional 2023",
            category: "Kompetisi Akademik",
            date: "12 Oktober 2023",
            id: "#LKTI-23-001",
            status: "Disetujui",
            img: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=600&auto=format&fit=crop"
        },
        {
            title: "Webinar Teknologi Blockchain & Masa Depan",
            category: "Pelatihan & Sertifikasi",
            date: "05 September 2023",
            id: "#WEB-23-042",
            status: "Menunggu",
            img: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=600&auto=format&fit=crop"
        },
        {
            title: "Staff Muda BEM ITS 2023",
            category: "Organisasi",
            date: "20 Agustus 2023",
            id: "#ORG-23-112",
            status: "Ditolak",
            img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop",
            reason: "Sertifikat yang diunggah tidak valid / buram."
        },
        {
            title: "Volunteer Gerakan Tanam 1000 Pohon",
            category: "Pengabdian Masyarakat",
            date: "15 Juli 2023",
            id: "#VOL-23-088",
            status: "Disetujui",
            img: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=600&auto=format&fit=crop"
        },
        {
            title: "Bootcamp Fullstack Developer Batch 5",
            category: "Pelatihan & Sertifikasi",
            date: "10 Juni 2023",
            id: "#BOOT-23-010",
            status: "Menunggu",
            img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
        }
    ];

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
        <div className="min-h-screen bg-transparent text-white font-sans max-w-7xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-white">Manajemen Kegiatan</h1>
                    <p className="text-slate-400 max-w-xl text-sm">
                        Kelola portofolio kegiatan ekstrakurikuler Anda di sini. Pantau status validasi dan tambahkan pencapaian baru.
                    </p>
                </div>
                <button className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-brand-blue/30 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-sm">add_circle</span> Tambah Baru
                </button>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto"
            >
                {['Semua Kegiatan', 'Menunggu Verifikasi', 'Disetujui'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                        {tab}
                    </button>
                ))}
            </motion.div>

            {/* Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8"
            >
                {activities.map((item, index) => (
                    <motion.div variants={itemVariants} key={index} className="glass-card bg-card-dark border border-white/10 rounded-2xl overflow-hidden hover:border-brand-blue/50 transition-colors group shadow-lg">

                        <div className="h-48 relative overflow-hidden">
                            <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg backdrop-blur-md
                                    ${item.status === 'Disetujui' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    item.status === 'Menunggu' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                        'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                <span className="material-symbols-outlined text-xs">
                                    {item.status === 'Disetujui' ? 'check_circle' : item.status === 'Menunggu' ? 'schedule' : 'cancel'}
                                </span>
                                {item.status}
                            </div>
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${item.img})` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent opacity-90"></div>
                        </div>

                        <div className="p-6 -mt-16 relative z-10">
                            <p className="text-[10px] text-brand-blue font-bold uppercase tracking-wider mb-2">{item.category}</p>
                            <h3 className="text-xl font-bold text-white mb-2 leading-tight min-h-[56px] line-clamp-2">{item.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                {item.date}
                            </div>

                            {item.status === 'Ditolak' && (
                                <div className="bg-red-900/20 border border-red-500/20 rounded p-3 mb-4">
                                    <p className="text-[10px] text-red-400 font-bold">Alasan: {item.reason}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                <p className="text-[10px] text-slate-600 font-mono">ID: {item.id}</p>
                                {item.status === 'Ditolak' ? (
                                    <button className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
                                        Perbaiki <span className="material-symbols-outlined text-sm">build</span>
                                    </button>
                                ) : item.status === 'Menunggu' ? (
                                    <button className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 transition-colors">
                                        Edit <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                ) : (
                                    <button className="text-xs font-bold text-brand-blue hover:text-blue-400 flex items-center gap-1 transition-colors">
                                        Detail <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </button>
                                )}
                            </div>
                        </div>

                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
