"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TranscriptPage() {
    const transcriptData = [
        { year: "2021", event: "Latihan Keterampilan Manajemen Mahasiswa (LKMM) Pra-Dasar", category: "Leadership", status: "LULUS", statusColor: "bg-green-100 text-green-700" },
        { year: "2022", event: "Latihan Keterampilan Manajemen Mahasiswa (LKMM) Dasar", category: "Management", status: "LULUS", statusColor: "bg-green-100 text-green-700" },
        { year: "2022", event: "Program Kreativitas Mahasiswa - Karsa Cipta", category: "Scientific Writing", status: "FINALIS", statusColor: "bg-blue-100 text-blue-700" },
        { year: "2023", event: "Staff Ahli Badan Eksekutif Mahasiswa (BEM) ITS", category: "Organizational Experience", status: "AKTIF", statusColor: "bg-green-100 text-green-700" },
        { year: "2023", event: "ITS Global Student Exchange Program", category: "Internationalization", status: "SELESAI", statusColor: "bg-green-100 text-green-700" },
        { year: "2024", event: "Latihan Keterampilan Manajemen Mahasiswa (LKMM) Madya", category: "Leadership", status: "PROSES", statusColor: "bg-orange-100 text-orange-700" },
    ];

    return (
        <div className="min-h-screen bg-background-dark font-sans p-8 flex justify-center overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-2xl w-full max-w-[800px] min-h-[1100px] p-12 relative flex flex-col items-center"
            >

                {/* Header */}
                <div className="text-center mb-12 w-full">
                    <div className="size-20 bg-[#002D56] text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-4 border-4 border-double border-white shadow-lg">
                        ITS
                    </div>
                    <h1 className="font-serif font-bold text-xl tracking-wide text-gray-900 mb-1">INSTITUT TEKNOLOGI SEPULUH NOPEMBER</h1>
                    <h2 className="font-sans font-bold text-sm tracking-widest text-gray-600 uppercase">Transkrip Pengembangan Sumber Daya Mahasiswa (PPSDM)</h2>
                    <div className="w-full h-1 bg-[#002D56] mt-4 mx-auto rounded-full"></div>
                    <div className="w-full h-0.5 bg-[#002D56] mt-1 mx-auto rounded-full opacity-50"></div>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-12 text-sm w-full">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Nama Lengkap</p>
                        <p className="font-bold text-gray-900 text-lg">BUDI SANTOSO</p>
                        <div className="border-b border-gray-200 mt-2"></div>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Nomor Registrasi (NRP)</p>
                        <p className="font-bold text-gray-900 text-lg">5001211001</p>
                        <div className="border-b border-gray-200 mt-2"></div>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Departemen / Fakultas</p>
                        <p className="font-bold text-gray-900">Teknik Informatika / FTEIC</p>
                        <div className="border-b border-gray-200 mt-2"></div>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tahun Akademik</p>
                        <p className="font-bold text-gray-900">2023/2024</p>
                        <div className="border-b border-gray-200 mt-2"></div>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-gray-300 rounded mb-8 w-full">
                    <div className="grid grid-cols-[80px_1fr_180px_100px] bg-gray-50 border-b border-gray-300 font-bold text-[10px] uppercase text-gray-600 p-3 items-center">
                        <div>Tahun</div>
                        <div>Nama Kegiatan</div>
                        <div>Kategori / Dimensi</div>
                        <div className="text-center">Status</div>
                    </div>
                    <div>
                        {transcriptData.map((item, index) => (
                            <div key={index} className="grid grid-cols-[80px_1fr_180px_100px] border-b border-gray-100 p-3 items-center text-xs hover:bg-gray-50 transition-colors">
                                <div className="font-medium text-gray-900">{item.year}</div>
                                <div className="font-bold text-gray-800 pr-4">{item.event}</div>
                                <div className="text-gray-600">{item.category}</div>
                                <div className="text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.statusColor}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer / Signature */}
                <div className="mt-auto flex justify-end w-full">
                    <div className="text-center w-64">
                        <p className="text-xs font-bold text-gray-600 mb-4">Surabaya, 24 Mei 2024</p>

                        <div className="size-24 bg-orange-50 border border-orange-200 mx-auto rounded mb-2 flex items-center justify-center shadow-inner relative overflow-hidden group">
                            {/* Digital Signature Mock */}
                            <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="border-2 border-orange-300 p-1 w-16 h-12 bg-white flex flex-col items-center justify-center shadow-sm z-10">
                                <div className="h-0.5 w-8 bg-gray-300 mb-1"></div>
                                <div className="h-0.5 w-10 bg-gray-300 mb-1"></div>
                                <div className="h-0.5 w-6 bg-gray-300"></div>
                            </div>
                        </div>

                        <p className="text-xs font-bold text-gray-900 uppercase">DIREKTUR KEMAHASISWAAN</p>
                        <p className="text-[10px] text-gray-500">Tersertifikasi Secara Digital</p>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 flex justify-between items-end text-[8px] text-gray-400 font-mono border-t border-gray-200 pt-4 w-full">
                    <div className="max-w-xs italic">
                        Dokumen ini diterbitkan secara elektronik oleh Sistem PPSDM KM ITS dan merupakan bukti sah pencapaian pengembangan diri mahasiswa.
                    </div>
                    <div className="text-right">
                        <p>ID Dokumen: KMITS-TR-2024-5001211001-A9Z</p>
                        <p>Halaman 1 dari 1</p>
                        <p>Dicetak pada: 2024-05-24 14:20:11</p>
                    </div>
                </div>

                {/* Floating Actions (Outside the paper) */}
                <div className="absolute top-0 -right-20 flex flex-col gap-4">
                    <button className="bg-brand-blue hover:bg-blue-600 text-white p-3 rounded-full shadow-lg shadow-brand-blue/30 tooltip group relative transition-all hover:scale-110">
                        <span className="material-symbols-outlined">download</span>
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">Download PDF</span>
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg border border-gray-200 group relative transition-all hover:scale-110">
                        <span className="material-symbols-outlined">print</span>
                        <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">Print</span>
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
