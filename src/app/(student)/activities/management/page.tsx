"use client";

import React, { useState } from "react";
import Link from "next/link";

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

    return (
        <div className="min-h-screen bg-[#0E1015] text-white font-sans">

            {/* Navbar */}
            <nav className="border-b border-[#2D303E] px-8 py-4 bg-[#161920] flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">school</span>
                    </div>
                    <span className="font-bold">PPSDM KM ITS Activity Management</span>
                </div>
                <div className="flex items-center gap-6 text-sm font-bold text-gray-400">
                    <Link href="#" className="hover:text-white">Dashboard</Link>
                    <Link href="#" className="text-white">Kegiatan</Link>
                    <Link href="#" className="hover:text-white">Profil</Link>
                    <div className="flex items-center gap-2 pl-6 border-l border-[#2D303E]">
                        <div className="size-8 rounded-full bg-orange-100 border border-[#2D303E]">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-full h-full" />
                        </div>
                        <span className="text-red-500 hover:text-red-400 cursor-pointer">Logout</span>
                    </div>
                </div>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Manajemen Kegiatan</h1>
                        <p className="text-gray-400 max-w-xl text-sm">
                            Kelola portofolio kegiatan ekstrakurikuler Anda di sini. Pantau status validasi dan tambahkan pencapaian baru.
                        </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-900/40">
                        <span className="material-symbols-outlined text-sm">add_circle</span> Tambah Baru
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-8 border-b border-[#2D303E] mb-8">
                    {['Semua Kegiatan', 'Menunggu Verifikasi', 'Disetujui'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((item, index) => (
                        <div key={index} className="bg-[#161920] border border-[#2D303E] rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group">

                            <div className="h-48 relative">
                                <div className={`absolute top-3 right-3 z-10 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-lg
                                      ${item.status === 'Disetujui' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                                        item.status === 'Menunggu' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                            'bg-red-500/20 text-red-500 border border-red-500/30'}`}>
                                    <span className="material-symbols-outlined text-xs">
                                        {item.status === 'Disetujui' ? 'check_circle' : item.status === 'Menunggu' ? 'schedule' : 'cancel'}
                                    </span>
                                    {item.status}
                                </div>
                                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.img})` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[#161920] to-transparent opacity-90"></div>
                            </div>

                            <div className="p-6 -mt-16 relative z-10">
                                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2">{item.category}</p>
                                <h3 className="text-xl font-bold text-white mb-2 leading-tight min-h-[56px]">{item.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    {item.date}
                                </div>

                                {item.status === 'Ditolak' && (
                                    <div className="bg-red-900/20 border border-red-900/50 rounded p-3 mb-4">
                                        <p className="text-[10px] text-red-400 font-bold">Alasan: {item.reason}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-4 border-t border-[#2D303E]">
                                    <p className="text-[10px] text-gray-600 font-mono">ID: {item.id}</p>
                                    {item.status === 'Ditolak' ? (
                                        <button className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1">
                                            Perbaiki <span className="material-symbols-outlined text-sm">build</span>
                                        </button>
                                    ) : item.status === 'Menunggu' ? (
                                        <button className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1">
                                            Edit <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    ) : (
                                        <button className="text-xs font-bold text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                            Detail <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
