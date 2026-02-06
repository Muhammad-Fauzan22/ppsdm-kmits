"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        q: "Apakah asesmen ini berbayar?",
        a: "Tidak. Seluruh layanan PPSDM KM ITS 100% GRATIS untuk seluruh mahasiswa aktif ITS (S1/D4/D3). Cukup login menggunakan akun myITS Anda."
    },
    {
        q: "Berapa lama waktu pengerjaan asesmen?",
        a: "Kami mendesain asesmen se-efisien mungkin. Rata-rata mahasiswa menyelesaikan Comprehensive Assessment (9 Dimensi) dalam waktu 15-20 menit."
    },
    {
        q: "Apakah data saya aman?",
        a: "Sangat aman. Kami mematuhi standar privasi data ITS. Hasil asesmen bersifat rahasia dan hanya digunakan untuk memberikan rekomendasi pengembangan diri Anda. Tidak akan dibagikan ke pihak ketiga tanpa izin."
    },
    {
        q: "Apakah hasil asesmen berpengaruh ke nilai akademik?",
        a: "Sama sekali tidak. Ini adalah tool pengembangan diri (formative assessment), bukan evaluasi akademik. Hasilnya justru membantu Anda meningkatkan performa akademik secara tidak langsung."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" className="py-24 bg-slate-50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold font-heading text-slate-900 mb-4">Sering Ditanyakan</h2>
                    <p className="text-slate-500">Masih ragu? Temukan jawabannya di sini.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                            >
                                <span className="font-bold text-slate-900">{item.q}</span>
                                <span className={`material-symbols-outlined transition-transform duration-300 text-slate-400 ${openIndex === idx ? 'rotate-180' : ''}`}>
                                    keyboard_arrow_down
                                </span>
                            </button>
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
                                            {item.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
