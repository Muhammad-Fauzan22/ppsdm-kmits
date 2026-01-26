"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HelpCenterPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const categories = [
        { icon: "person", title: "Akun & Profil" },
        { icon: "assignment", title: "Asesmen" },
        { icon: "verified", title: "Sertifikasi" },
        { icon: "build", title: "Kendala Teknis" },
    ];

    const faqs = [
        { id: 0, question: "Bagaimana cara reset password?", answer: "Anda dapat mereset password melalui halaman login dengan menekan tombol 'Lupa Password'. Link reset akan dikirimkan ke email .ac.id Anda." },
        { id: 1, question: "Cara mengunduh sertifikat?", answer: "Sertifikat dapat diunduh di menu 'Portfolio' setelah Anda menyelesaikan kompetensi terkait dan divalidasi oleh supervisor." },
        { id: 2, question: "Apakah aplikasi ini gratis?", answer: "Ya, PPSDM KMM sepenuhnya gratis untuk seluruh mahasiswa aktif ITS." },
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-sans flex items-center justify-center p-4">
            {/* Emulated Mobile Container for consistency with design, or Full Page */}
            <div className="w-full max-w-md bg-[#F9FAFB] min-h-[800px] shadow-2xl rounded-[32px] overflow-hidden relative flex flex-col">

                {/* Blue Header */}
                <div className="bg-blue-600 p-8 pt-10 pb-16 relative">
                    <div className="flex justify-between items-center text-white mb-6">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl">security</span>
                            <span className="font-bold text-sm">PPSDM Help Center</span>
                        </div>
                        <span className="material-symbols-outlined">notifications</span>
                    </div>

                    <div className="text-white mb-6">
                        <p className="text-sm opacity-80 mb-1">Halo, Pengguna</p>
                        <h1 className="text-2xl font-bold">Perlu bantuan apa hari ini?</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="absolute bottom-0 left-8 right-8 translate-y-1/2">
                        <div className="bg-white rounded-xl shadow-lg shadow-blue-900/10 flex items-center px-4 py-3">
                            <span className="material-symbols-outlined text-blue-500 mr-3">search</span>
                            <input type="text" placeholder="Cari topik bantuan..." className="w-full text-sm outline-none text-gray-700 placeholder-gray-400 font-medium" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-16 px-8 flex-1 overflow-y-auto">

                    {/* Categories */}
                    <h3 className="font-bold text-gray-800 mb-4 text-sm">Kategori Bantuan</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {categories.map((cat) => (
                            <div key={cat.title} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start gap-3 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-gray-700">{cat.title}</span>
                            </div>
                        ))}
                    </div>

                    {/* FAQ */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 text-sm">Pertanyaan Sering Diajukan</h3>
                        <button className="text-blue-600 text-xs font-bold hover:underline">Lihat Semua</button>
                    </div>

                    <div className="space-y-3 pb-8">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                                    className="w-full flex justify-between items-center p-4 text-left"
                                >
                                    <span className="text-xs font-bold text-gray-800">{faq.question}</span>
                                    <span className={`material-symbols-outlined text-gray-400 text-sm transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                {openFaq === faq.id && (
                                    <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-2">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Floating Chat Button */}
                <div className="absolute bottom-6 right-6">
                    <button className="size-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-200 flex items-center justify-center relative">
                        <span className="material-symbols-outlined text-2xl">chat</span>
                        <span className="absolute top-0 right-0 size-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

            </div>
        </div>
    );
}
