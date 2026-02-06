"use client";

import React from 'react';

export default function Testimonials() {
    const testimonials = [
        { 
            name: "Mahasiswa Teknik Informatika", 
            prodi: "Angkatan 2021", 
            text: "Modul leadership benar-benar mengubah cara saya mendekati proyek tim. Sangat bermanfaat!", 
            color: "from-blue-500 to-purple-500" 
        },
        { 
            name: "Mahasiswa Arsitektur", 
            prodi: "Angkatan 2022", 
            text: "PPSDM membantu saya menyeimbangkan kehidupan akademik dengan pengembangan soft skill yang bermakna.", 
            color: "from-green-500 to-teal-500" 
        },
        { 
            name: "Mahasiswa Teknik Mesin", 
            prodi: "Angkatan 2020", 
            text: "Program mentorship membuat saya terhubung dengan alumni yang membimbing jalur karir saya.", 
            color: "from-orange-500 to-red-500" 
        },
        { 
            name: "Mahasiswa Statistika", 
            prodi: "Angkatan 2023", 
            text: "Saya menemukan passion untuk public speaking melalui workshop komunikasi yang diadakan.", 
            color: "from-pink-500 to-rose-500" 
        },
        { 
            name: "Mahasiswa Sistem Informasi", 
            prodi: "Angkatan 2022", 
            text: "Memahami global mindset membantu saya mendapatkan magang di luar negeri.", 
            color: "from-blue-500 to-purple-500" 
        },
    ];

    return (
        <section className="py-20 border-t border-slate-200 dark:border-white/5 overflow-hidden bg-its-dark">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-white">Suara Mahasiswa</h2>
                <p className="text-slate-400">Dengarkan dari mereka yang telah mengembangkan potensinya.</p>
            </div>

            <div className="relative w-full max-w-[1920px] mx-auto mask-linear-fade">
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
