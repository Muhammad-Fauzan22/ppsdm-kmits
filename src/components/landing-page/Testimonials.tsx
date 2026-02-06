"use client";

import React from 'react';
import { Info } from 'lucide-react';

export default function Testimonials() {
    // Anonymized testimonials with disclosure
    const testimonials = [
        { name: "B.S.", prodi: "Teknik Informatika '21", text: "Modul kepemimpinan benar-benar mengubah cara saya mendekati proyek tim.", color: "from-blue-500 to-purple-500" },
        { name: "S.A.", prodi: "Arsitektur '22", text: "PPSDM KM ITS membantu saya menyeimbangkan kehidupan akademik dengan pengembangan soft skill yang bermakna.", color: "from-green-500 to-teal-500" },
        { name: "R.P.", prodi: "Teknik Mesin '20", text: "Program mentorship mempertemukan saya dengan alumni yang membimbing jalur karir saya.", color: "from-orange-500 to-red-500" },
        { name: "D.L.", prodi: "Statistika '23", text: "Saya menemukan passion untuk public speaking melalui workshop komunikasi.", color: "from-pink-500 to-rose-500" },
        { name: "A.W.", prodi: "Sistem Informasi '22", text: "Memahami global mindset membantu saya mendapatkan magang di luar negeri.", color: "from-blue-500 to-purple-500" },
    ];

    return (
        <section className="py-20 border-t border-slate-200 dark:border-white/5 overflow-hidden bg-its-dark">
            {/* Disclosure Banner */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="flex items-center gap-3 p-4 bg-brand-blue/10 border border-brand-blue/20 rounded-lg">
                    <Info className="w-5 h-5 text-brand-blue flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">Data contoh untuk demonstrasi.</span> Testimoni ini merupakan ilustrasi pengalaman pengguna dan bukan data aktual.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-white">Suara Mahasiswa</h2>
                <p className="text-slate-400">Dengarkan pengalaman mereka yang telah mengembangkan potensi.</p>
            </div>

            <div className="relative w-full max-w-[1920px] mx-auto mask-linear-fade">
                {/* Tambahkan class 'animate-marquee' di tailwind.config.ts jika belum ada */}
                <div className="flex w-max animate-marquee gap-6 px-4 hover:pause">
                    {[...testimonials, ...testimonials].map((item, idx) => (
                        <div key={idx} className="w-[350px] shrink-0 rounded-xl bg-[#1c1f27] p-6 shadow-sm border border-white/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`size-10 rounded-full bg-gradient-to-tr ${item.color}`}></div>
                                <div>
                                    <p className="font-bold text-sm text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.prodi}</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">"{item.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
