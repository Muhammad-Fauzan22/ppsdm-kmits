"use client";

import Link from "next/link";
import { useState } from "react";
import { ASSETS } from "@/config/assets";

export default function PortfolioPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="bg-[#f5f6f8] dark:bg-[#111318] font-sans text-slate-900 dark:text-white min-h-screen flex flex-col overflow-x-hidden selection:bg-[#256af4] selection:text-white">
            {/* Navbar */}
            <div className="w-full border-b border-solid border-slate-200 dark:border-[#282e39] bg-white dark:bg-[#111318] sticky top-0 z-40">
                <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 lg:px-10">
                    <div className="flex items-center gap-4">
                        <div className="flex size-8 items-center justify-center rounded bg-[#256af4]/10 text-[#256af4]">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">PPSDM KM ITS Activity Management</h2>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] sm:hidden">Activity Mgmt</h2>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-8">
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-medium hover:text-[#256af4] transition-colors text-slate-500 dark:text-slate-400">Dashboard</Link>
                            <Link href="/portfolio" className="text-sm font-medium text-slate-900 dark:text-white">Kegiatan</Link>
                            <Link href="/profile" className="text-sm font-medium hover:text-[#256af4] transition-colors text-slate-500 dark:text-slate-400">Profil</Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <button className="lg:hidden text-slate-500 dark:text-white">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-white dark:ring-[#282e39]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDjHwj6otugbkBfyc6czQ3YNk2WKqInYWMRJC4I3ke1_DpdAVBLUdQR3eCIQiSh9l49YphjUb-dXFZ1fJV9y-RSHUAiG6VcEJ-FJ3LHI0lKZd0V-MwLtoZilxK32zktTO74U2fwXUwTeD3NGAMb4lSXuQU6I-p6aROPWfMJ8byRmk8EJIJaiIwGonGH121ZTj1IJRsPl7AMEYKTrk4vPGn-GB83Q4FKyNipJyqzHt1m9rcn5sl07Q58jUzi8PkMyZOj3BtBZ0JYNkk')" }}></div>
                            <Link href="/auth/login" className="hidden lg:block text-sm font-medium text-red-500 hover:text-red-400">Logout</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 lg:px-10 py-6 lg:py-10">
                {/* Page Heading & Actions */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Manajemen Kegiatan</h1>
                        <p className="text-slate-500 dark:text-[#9ca6ba] text-base font-normal max-w-2xl">
                            Kelola portofolio kegiatan ekstrakurikuler Anda di sini. Pantau status validasi dan tambahkan pencapaian baru.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group flex items-center justify-center gap-2 rounded-lg bg-[#256af4] px-5 py-2.5 text-white shadow-lg shadow-[#256af4]/20 hover:bg-blue-600 active:scale-95 transition-all w-full md:w-auto"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span className="font-bold text-sm tracking-wide">Tambah Baru</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="mb-8 border-b border-slate-200 dark:border-[#282e39]">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        <button className="relative flex flex-col items-center justify-center pb-3 pt-2 text-[#256af4] border-b-2 border-[#256af4]">
                            <p className="text-sm font-bold whitespace-nowrap">Semua Kegiatan</p>
                        </button>
                        <button className="group relative flex flex-col items-center justify-center pb-3 pt-2 text-slate-500 dark:text-[#9ca6ba] hover:text-slate-700 dark:hover:text-white transition-colors">
                            <p className="text-sm font-bold whitespace-nowrap">Menunggu Verifikasi</p>
                            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-slate-300 dark:bg-white transition-all group-hover:w-full"></span>
                        </button>
                        <button className="group relative flex flex-col items-center justify-center pb-3 pt-2 text-slate-500 dark:text-[#9ca6ba] hover:text-slate-700 dark:hover:text-white transition-colors">
                            <p className="text-sm font-bold whitespace-nowrap">Disetujui</p>
                            <span className="absolute bottom-[-2px] left-0 h-[2px] w-0 bg-slate-300 dark:bg-white transition-all group-hover:w-full"></span>
                        </button>
                    </div>
                </div>

                {/* Activity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Approved */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#1d232e] shadow-sm border border-slate-200 dark:border-transparent hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all">
                        <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBq77XCgjSnBvkwjcOSwX5vHrgpLAAoajrBgDfAlZXKBibQA_HJYz4nFKLY-7mOI03zOI2g3-sjcfYdB4vsDggB_xtLfKwj7VZNpyT6qVJxvjkC6QELHo54gwjBUwJB8DWOCNdJNQC3PweRRinP1TmMwUbCmfwXZQHD6-DHoVvg3fTazjNuqOqhUfZ3oKDRljh_W-FLP8LjDYURREN3tCoJ09AzVEIXXLmI9jRpqP803RlscmIc7FY3TTZHa31AosN9rwiu3qnDKJE')" }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 shadow-sm">
                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Disetujui
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-5">
                            <div className="flex flex-col gap-2 mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Kompetisi Akademik</span>
                                <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-[#256af4] transition-colors">Lomba Karya Tulis Ilmiah Nasional 2023</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    <span>12 Oktober 2023</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                <span className="text-xs text-slate-400">ID: #LKTI-23-001</span>
                                <button className="flex items-center gap-1 text-sm font-bold text-[#256af4] hover:text-blue-400 transition-colors">
                                    Detail
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Pending */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#1d232e] shadow-sm border border-slate-200 dark:border-transparent hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all">
                        <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAAoOpFJMAV8LXXdlcACenzs58-TP660dclsmwEm3q9qaKa_B_FGiw5zAmovb79pvwJancGNdG84m9FsGjrOdVByVGI2cwAQOscjV8ag_4lyY9fuvUWjyE9uPgPUDswkHMzFgng6AIGjCZgU8BuJcTfHbymHOiNPDTWhhi_dT14WLdKb4v4zHnFjH8olmFNKB03hAZgOGPcIK3HmNiHgFC71IGUnTYIO3Qf7cjrA4l5fIhnAsVK4ZuDndMHat-sVAJNm43KHeH1mmE')" }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/20 backdrop-blur-md border border-yellow-500/20 px-2.5 py-1 text-xs font-semibold text-yellow-300 shadow-sm">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    Menunggu
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-5">
                            <div className="flex flex-col gap-2 mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Pelatihan & Sertifikasi</span>
                                <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-[#256af4] transition-colors">Webinar Teknologi Blockchain & Masa Depan</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    <span>05 September 2023</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                <span className="text-xs text-slate-400">ID: #WEB-23-042</span>
                                <button className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors">
                                    Edit
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Rejected */}
                    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#1d232e] shadow-sm border border-slate-200 dark:border-transparent hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all opacity-90 hover:opacity-100">
                        <div className="h-48 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDU89igOvo9eKccA_eIoMYv51MnSRX9sWcHNnfMdYH0g2v2iInuEUrWQz3_iGBQUwgLR9HfQv2lf1dMcjxlqDPABR5VCs6B_brO2tpYIurJ1gcU__PSHIqHR6EbU68jfH8aNGnoK7kINRUEG_34KFoFkCcpuIEIItOEcX8493PsT3VCatAXtOTVwICnQdHDgcInAWxiWstKSH3AaqBpCw0CFUjQ6kzL-kA5X5yBza7MMWivPs08-gRioLultFExkyXFUDzPhyuD1dk')" }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-grayscale-[0.5]"></div>
                            <div className="absolute top-3 right-3">
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/20 px-2.5 py-1 text-xs font-semibold text-red-300 shadow-sm">
                                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                                    Ditolak
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-5">
                            <div className="flex flex-col gap-2 mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Organisasi</span>
                                <h3 className="text-xl font-bold leading-tight text-slate-900 dark:text-white group-hover:text-red-400 transition-colors">Staff Muda BEM ITS 2023</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                    <span>20 Agustus 2023</span>
                                </div>
                                <p className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
                                    Alasan: Sertifikat yang diunggah tidak valid / buram.
                                </p>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                                <span className="text-xs text-slate-400">ID: #ORG-23-112</span>
                                <button className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-300 transition-colors">
                                    Perbaiki
                                    <span className="material-symbols-outlined text-[18px]">build</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-lg rounded-xl bg-white dark:bg-[#1d232e] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#282e39] px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Kegiatan Baru</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex items-center justify-center rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#282e39] transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        {/* Modal Body */}
                        <div className="p-6 flex flex-col gap-5">
                            {/* Title Input */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Kegiatan</label>
                                <input className="w-full rounded-lg border border-slate-300 dark:border-[#3b4354] bg-white dark:bg-[#111318] px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#256af4] focus:outline-none focus:ring-1 focus:ring-[#256af4]" placeholder="Masukkan judul kegiatan..." type="text" />
                            </div>
                            {/* Date & Category Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal</label>
                                    <input className="w-full rounded-lg border border-slate-300 dark:border-[#3b4354] bg-white dark:bg-[#111318] px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#256af4] focus:outline-none focus:ring-1 focus:ring-[#256af4]" type="date" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                                    <select className="w-full rounded-lg border border-slate-300 dark:border-[#3b4354] bg-white dark:bg-[#111318] px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-[#256af4] focus:outline-none focus:ring-1 focus:ring-[#256af4]">
                                        <option>Kompetisi</option>
                                        <option>Organisasi</option>
                                        <option>Pelatihan</option>
                                        <option>Pengabdian</option>
                                    </select>
                                </div>
                            </div>
                            {/* File Upload */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bukti Sertifikat</label>
                                <div className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-[#3b4354] bg-slate-50 dark:bg-[#111318]/50 py-8 hover:border-[#256af4]/50 transition-colors">
                                    <span className="material-symbols-outlined mb-2 text-3xl text-slate-400">cloud_upload</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Drag & drop file or <span className="text-[#256af4] font-medium">browse</span></p>
                                    <p className="text-[10px] text-slate-400 mt-1">PDF, JPG up to 5MB</p>
                                </div>
                            </div>
                        </div>
                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-[#282e39] px-6 py-4 bg-slate-50 dark:bg-[#1d232e]">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#282e39] transition-colors"
                            >
                                Batal
                            </button>
                            <button className="rounded-lg bg-[#256af4] px-4 py-2 text-sm font-bold text-white hover:bg-blue-600 transition-colors">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
