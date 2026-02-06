"use client";

import { motion } from "framer-motion";

const stories = [
    {
        quote: "Platform ini membantu saya mengidentifikasi bahwa anxiety saya berasal dari poor time management, bukan lack of intelligence.",
        author: "Sarah A.",
        role: "Mahasiswa Teknik Informatika",
        metric: "GPA ↑ 0.8",
        img: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        quote: "Saya selalu unggul teknis, tapi dimensi leadership saya rendah. PPSDM memberikan roadmap yang jelas hingga saya jadi Project Lead.",
        author: "Budi S.",
        role: "Mahasiswa Teknik Mesin",
        metric: "Team Satisfaction ↑ 60%",
        img: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        quote: "Sebagai mahasiswa teknik, saya tidak pernah belajar finansial. Sekarang saya punya passive income dari investasi berkat modul Financial IQ.",
        author: "Dian R.",
        role: "Mahasiswa Arsitektur",
        metric: "Portfolio Inv. 50jt+",
        img: "https://randomuser.me/api/portraits/women/68.jpg"
    }
];

export function SuccessStories() {
    return (
        <section className="py-24 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <span className="text-its-gold font-bold tracking-widest text-sm uppercase mb-2 block">Success Stories</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6">
                        Dari Mahasiswa Biasa Menjadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-its-gold to-amber-300">Leader Berdampak</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((story, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors relative">
                            <span className="text-6xl text-white/20 font-serif absolute top-4 left-6">“</span>
                            <p className="text-lg text-slate-300 mb-8 relative z-10 italic">
                                {story.quote}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-its-gold">
                                    <img src={story.img} alt={story.author} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{story.author}</h4>
                                    <p className="text-xs text-slate-400">{story.role}</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Impact</span>
                                <span className="font-bold text-green-400">{story.metric}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
