"use client";

import React from 'react';

export default function Testimonials() {
    const testimonials = [
        { name: "Budi Santoso", prodi: "Teknik Informatika '21", text: "The leadership module completely changed how I approach team projects.", color: "from-blue-500 to-purple-500" },
        { name: "Siti Aminah", prodi: "Arsitektur '22", text: "PPSDM helped me balance my academic life with meaningful soft skill development.", color: "from-green-500 to-teal-500" },
        { name: "Rizky Pratama", prodi: "Teknik Mesin '20", text: "The mentorship program connected me with alumni who guided my career path.", color: "from-orange-500 to-red-500" },
        { name: "Dewi Lestari", prodi: "Statistika '23", text: "I discovered my passion for public speaking through the communication workshops.", color: "from-pink-500 to-rose-500" },
        { name: "Andi Wijaya", prodi: "Sistem Informasi '22", text: "Understanding global mindset helped me secure my internship abroad.", color: "from-blue-500 to-purple-500" },
    ];

    return (
        <section className="py-20 border-t border-slate-200 dark:border-white/5 overflow-hidden bg-its-dark">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-white">Student Voices</h2>
                <p className="text-slate-400">Hear from those who have transformed their potential.</p>
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
