"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function Testimonials() {
    return (
        <section className="py-24 px-6 lg:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold font-heading text-white">Student Success Stories</h2>
                    <p className="text-slate-400">Bukti nyata transformasi kompetensi mahasiswa ITS.</p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8">
                    <motion.div
                        className="flex-1 glass-card p-8 rounded-3xl relative"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-accent flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-xl">
                                <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5SVVpH4Be-WqS0W1VPrxzjlB3vbZb4C-UE7mFxtbTzc9QISczBj8vA_ABHpRX7wQ8MOfsZkOEgPcHisOEiDbuueRsHz3_jiQjEk4uPefakcBGCmRR665cDvRnob5C_bdkRs4--_0Iu_rQsQnXNBxTmJeA_OW5SMiyO18xVXrLNzdGPw3RtSlgknXFDGfe_W52p6k4bukffT4Oc8Yhye_4pBtlN-T20ZzFSqUCbRxgymNI0b4R7XkNCS5ggui_ngcch8eCuFgdguM" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Rizky Maulana</h4>
                                <p className="text-slate-500 text-xs">Teknik Mesin '21</p>
                            </div>
                        </div>
                        <p className="italic text-slate-300 mb-8 font-light">"Sebelum ikut PPSDM, saya kesulitan berorganisasi. Setelah roadmap 6 bulan, saya terpilih jadi Ketua Himpunan."</p>
                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Leadership</p>
                                <p className="text-brand-accent font-bold">+150% Increase</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Career Status</p>
                                <p className="text-white font-bold">Intern @ Pertamina</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 glass-card p-8 rounded-3xl relative border-brand-blue/20 bg-brand-blue/5"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="size-16 rounded-2xl bg-gradient-to-tr from-its-gold to-orange-400 flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-xl">
                                <img alt="Student" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb-aNlXgtqk-22vz2E74FIlapMvtcjzMSbEdYJWqzksp22VO5cPha0FZeTgaqRynHJktg-YEchq3bkqqxhWAZEyivY1A3U-dauRwS-jOESr49qPfH_5N166P4xI91j0yS57NlNgmvWCzzHom5w1S1VtBPdpp-izUFI1K_yoversEgQBoIR_joSpRkWci6Y1b4xZuY0-bg3yfPYRGhR_QNkByGIQbEjecI5LKkSvPbJkA-CCfvv5Rf6NaFBdb575l4UXdQ_qR-NFnE" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Ayu Lestari</h4>
                                <p className="text-slate-500 text-xs">Sistem Informasi '22</p>
                            </div>
                        </div>
                        <p className="italic text-slate-300 mb-8 font-light">"Program mentorship menghubungkan saya dengan alumni yang sekarang jadi atasan saya di tech startup."</p>
                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Communication</p>
                                <p className="text-brand-accent font-bold">Mastery Level</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Impact</p>
                                <p className="text-white font-bold">Top 10 Finalist PKM</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
