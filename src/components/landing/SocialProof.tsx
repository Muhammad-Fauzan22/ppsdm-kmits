"use client";

import { motion } from "framer-motion";

const testimonials = [
    {
        quote: "PPSDM membantu saya memahami bahwa IPK tinggi tanpa leadership skill tidak cukup untuk bersaing di dunia kerja.",
        author: "Rizky F.",
        role: "Mahasiswa Teknik Sipil 2023",
        avatar: "RF"
    },
    {
        quote: "Assessment-nya sangat akurat. Saya jadi tahu gap kompetensi saya dan modul yang disarankan sangat relevan.",
        author: "Sari Andini",
        role: "Mahasiswa Teknik Industri 2024",
        avatar: "SA"
    },
    {
        quote: "Platform ini sangat membantu untuk melihat progress pengembangan diri saya secara terukur setiap semester.",
        author: "Budi Santoso",
        role: "Mahasiswa Informatika",
        avatar: "BS"
    }
];

export function SocialProof() {
    return (
        <section className="py-24 bg-its-dark border-t border-white/5 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/10 blur-[120px] rounded-full" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-brand-accent font-bold tracking-widest text-sm uppercase mb-2 block">
                        Impact Stories
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-white mb-6">
                        Dipercaya oleh Leaders Masa Depan
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center font-bold text-white">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold">{item.author}</h4>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide">{item.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-300 italic leading-relaxed">"{item.quote}"</p>
                        </motion.div>
                    ))}
                </div>

                {/* Numbers */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 text-center">
                    <div>
                        <h3 className="text-4xl font-black text-white mb-2">15,000+</h3>
                        <p className="text-slate-500 text-sm">Mahasiswa Aktif</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white mb-2">9</h3>
                        <p className="text-slate-500 text-sm">Dimensi Holistik</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white mb-2">85%</h3>
                        <p className="text-slate-500 text-sm">Kepuasan User</p>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white mb-2">24/7</h3>
                        <p className="text-slate-500 text-sm">Akses Modul</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
