"use client";

import { motion } from "framer-motion";

const problems = [
    {
        title: "Disorientasi Akademik",
        description: "Hanya 18% mahasiswa merasa jurusan mereka sesuai dengan passion. Kebanyakan 'hanyut' tanpa arah jelas.",
        stat: "82% Mahasiswa Bingung",
        color: "bg-red-500"
    },
    {
        title: "Kesenjangan Soft Skill",
        description: "IPK 4.0 tidak menjamin karir. Industri butuh Leadership & Emotional Intelligence yang jarang diajarkan di kelas.",
        stat: "Gap Kompetensi",
        color: "bg-orange-500"
    },
    {
        title: "Burnout & Stress",
        description: "Tekanan akademik tinggi tanpa manajemen mental yang baik. Kesehatan mental menjadi isu utama mahasiswa teknik.",
        stat: "High Stress Level",
        color: "bg-brand-blue"
    }
];

export function ProblemSolution() {
    return (
        <section className="py-24 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-50 -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row gap-16 items-center mb-24">
                    <div className="md:w-1/2">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-brand-blue font-bold tracking-widest text-sm uppercase mb-4 block"
                        >
                            The Reality Check
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold font-heading text-slate-900 leading-tight mb-6"
                        >
                            Kuliah Saja <span className="text-red-500 underline decoration-wavy decoration-2 underline-offset-4">Tidak Cukup</span> Untuk Bersaing di 2030.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 leading-relaxed"
                        >
                            Dunia berubah cepat. Lulusan teknik tidak hanya dinilai dari kemampuan menghitung beban struktur, tapi bagaimana mereka memimpin tim, mengelola stress, dan beradaptasi.
                        </motion.p>
                    </div>

                    <div className="md:w-1/2 grid gap-6">
                        {problems.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow"
                            >
                                <div className={`w-1.5 h-16 rounded-full shrink-0 ${item.color}`} />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-2">{item.description}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded bg-slate-100 ${item.color.replace('bg-', 'text-')}`}>
                                        {item.stat}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="text-center max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">PPSDM KM ITS Hadir Sebagai Solusi</h3>
                    <p className="text-slate-600">
                        Kami menyediakan <span className="font-bold text-brand-blue">Ecosystem Support System</span> yang melengkapi kurikulum akademik ITS.
                        Wadah untuk tumbuh menjadi manusia utuh.
                    </p>
                </div>
            </div>
        </section>
    );
}
