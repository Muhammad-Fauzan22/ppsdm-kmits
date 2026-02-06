"use client";

import { motion } from "framer-motion";

const steps = [
    {
        num: "01",
        title: "Ambil Asesmen",
        desc: "Jawab 72 pertanyaan psikometrik yang dirancang oleh ahli psikologi untuk memetakan profil unik Anda."
    },
    {
        num: "02",
        title: "Dapatkan Peta",
        desc: "Terima laporan analisis gap kompetensi 9 dimensi dan rekomendasi pengembangan yang personal."
    },
    {
        num: "03",
        title: "Jalankan Misi",
        desc: "Ikuti modul pembelajaran mikro dan tantangan nyata untuk meningkatkan skill yang masih kurang."
    },
    {
        num: "04",
        title: "Panen Prestasi",
        desc: "Bangun portofolio holistik yang terverifikasi untuk menunjang karir dan beasiswa."
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-2 block">The Journey</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 mb-6">
                        Dari Potensi Menjadi <br /> <span className="text-brand-blue">Kompetensi</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative"
                        >
                            <div className="w-12 h-12 bg-its-blue text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-its-blue/20">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
