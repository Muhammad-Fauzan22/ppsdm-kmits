"use client";

import React from 'react';

export default function Testimonials() {
    // TODO: Replace with real testimonials from actual ITS students
    // These are placeholder testimonials for demonstration purposes
    const testimonials = [
        { name: "Mahasiswa Teknik", prodi: "Teknik Informatika", text: "Platform ini membantu saya memahami kekuatan dan area pengembangan diri secara lebih komprehensif.", color: "from-blue-500 to-purple-500" },
        { name: "Mahasiswa Arsitektur", prodi: "Arsitektur", text: "Assessment yang diberikan sangat relevan dengan kebutuhan pengembangan soft skills di dunia kerja.", color: "from-green-500 to-teal-500" },
        { name: "Mahasiswa Mesin", prodi: "Teknik Mesin", text: "Sistem roadmap membantu saya merencanakan pengembangan diri semester demi semester.", color: "from-orange-500 to-red-500" },
    ];


    return (
        <section className="py-20 border-t border-slate-200 dark:border-white/5 overflow-hidden bg-its-dark">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-white">Testimoni Mahasiswa</h2>
                <p className="text-slate-400">Pengalaman mahasiswa ITS dalam menggunakan platform PPSDM KMITS.</p>
                <span className="text-xs text-slate-500 bg-slate-800/50 px-3 py-1 rounded-full">* Data testimoni dalam tahap pengumpulan</span>
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
