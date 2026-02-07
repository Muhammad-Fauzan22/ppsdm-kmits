"use client";

import React from 'react';
import { Quote } from 'lucide-react';

export default function Testimonials() {
    const testimonials = [
        { 
            name: "Ahmad Rizky", 
            prodi: "Teknik Informatika '21", 
            text: "Program pengembangan karakter di PPSDM KM ITS membantu saya memahami diri sendiri lebih baik dan meningkatkan kualitas kepemimpinan saya dalam organisasi kampus.",
            color: "from-blue-500 to-purple-500",
            initials: "AR"
        },
        { 
            name: "Dewi Kusuma", 
            prodi: "Arsitektur '22", 
            text: "Asesmen holistik memberikan gambaran lengkap tentang area yang perlu saya kembangkan. Sekarang saya lebih percaya diri menghadapi tantangan akademik dan personal.",
            color: "from-green-500 to-teal-500",
            initials: "DK"
        },
        { 
            name: "Bima Pratama", 
            prodi: "Teknik Mesin '20", 
            text: "Mentorship program menghubungkan saya dengan alumni yang berpengalaman. Mereka memberikan wawasan berharga tentang karir di industri manufaktur.",
            color: "from-orange-500 to-red-500",
            initials: "BP"
        },
        { 
            name: "Sari Lestari", 
            prodi: "Statistika '23", 
            text: "Workshop komunikasi efektif mengubah cara saya berinteraksi dengan tim. Saya belajar teknik presentasi yang membuat proyek kelompok lebih produktif.",
            color: "from-pink-500 to-rose-500",
            initials: "SL"
        },
        { 
            name: "Fajar Wijaya", 
            prodi: "Sistem Informasi '22", 
            text: "Pemahaman tentang global mindset membuka wawasan saya tentang peluang karir internasional. Saya berhasil mendapatkan internship di perusahaan multinasional.",
            color: "from-blue-500 to-purple-500",
            initials: "FW"
        },
    ];

    return (
        <section className="py-20 border-t border-slate-200 dark:border-white/5 overflow-hidden bg-its-dark">
            <div className="flex flex-col items-center gap-4 text-center mb-12 px-4">
                <h2 className="text-3xl font-bold tracking-tight text-white">Suara Mahasiswa</h2>
                <p className="text-slate-400 max-w-2xl">Cerita inspiratif dari mahasiswa ITS yang telah mengembangkan potensi mereka melalui program PPSDM KM ITS.</p>
            </div>

            <div className="relative w-full max-w-[1920px] mx-auto mask-linear-fade">
                <div className="flex w-max animate-marquee gap-6 px-4 hover:pause">
                    {[...testimonials, ...testimonials].map((item, idx) => (
                        <div key={idx} className="w-[350px] shrink-0 rounded-xl bg-[#1c1f27] p-6 shadow-sm border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`size-12 rounded-full bg-gradient-to-tr ${item.color} flex items-center justify-center text-white font-bold text-sm`}>
                                    {item.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.prodi}</p>
                                </div>
                            </div>
                            <div className="relative">
                                <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-600 opacity-50" />
                                <p className="text-sm text-slate-300 leading-relaxed pl-4">"{item.text}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
