"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function MissionControlDemo() {
    return (
        <section className="py-24 px-6 lg:px-12 bg-white/5 relative overflow-hidden" id="demo">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]"></div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <motion.div
                        className="lg:w-1/2 space-y-8"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">Mission Control <br /><span className="text-brand-accent">Personal Dashboard</span></h2>
                        <p className="text-slate-400 text-lg leading-relaxed">Rasakan langsung visualisasi radar kompetensi Anda. Platform kami melacak pertumbuhan setiap dimensi secara real-time untuk memastikan Anda tetap di jalur kesuksesan.</p>

                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl border-brand-blue/20">
                                <p className="text-brand-accent text-xs font-bold mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">quiz</span>
                                    MINI ASSESSMENT PREVIEW
                                </p>
                                <div className="space-y-4">
                                    <p className="text-white font-medium">Bagaimana Anda bereaksi terhadap kegagalan tim yang Anda pimpin?</p>
                                    <div className="grid gap-3">
                                        <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-brand-blue/20 border border-white/10 hover:border-brand-blue/50 transition-all text-sm group">
                                            <span className="group-hover:text-white transition-colors">A. Evaluasi proses dan tanggung jawab bersama</span>
                                        </button>
                                        <button className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-brand-blue/20 border border-white/10 hover:border-brand-blue/50 transition-all text-sm group">
                                            <span className="group-hover:text-white transition-colors">B. Mencari individu yang membuat kesalahan utama</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="lg:w-1/2 w-full max-w-[550px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="glass-card p-8 rounded-[2.5rem] border-white/10 relative">
                            <div className="absolute top-8 left-8">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Analysis Profile</span>
                                <h4 className="text-xl font-bold text-white">Student 2024.08.12</h4>
                            </div>

                            <div className="aspect-square w-full flex items-center justify-center relative">
                                <svg className="w-full h-full max-w-[350px] transform -rotate-90 overflow-visible" viewBox="0 0 200 200">
                                    {/* Grid Lines */}
                                    <polygon fill="none" points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></polygon>
                                    <polygon fill="none" points="100,60 135,80 135,120 100,140 65,120 65,80" stroke="rgba(255,255,255,0.05)" strokeWidth="1"></polygon>
                                    <line stroke="rgba(255,255,255,0.1)" x1="100" x2="100" y1="100" y2="20"></line>
                                    <line stroke="rgba(255,255,255,0.1)" x1="100" x2="170" y1="100" y2="60"></line>
                                    <line stroke="rgba(255,255,255,0.1)" x1="100" x2="170" y1="100" y2="140"></line>
                                    <line stroke="rgba(255,255,255,0.1)" x1="100" x2="100" y1="100" y2="180"></line>
                                    <line stroke="rgba(255,255,255,0.1)" x1="100" x2="30" y1="100" y2="140"></line>
                                    <line stroke="rgba(255,255,255,0.1)" x1="100" x2="30" y1="100" y2="60"></line>

                                    {/* Radar Shape with Animation */}
                                    <motion.polygon
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 1.5, type: "spring" }}
                                        className="shadow-glow"
                                        fill="rgba(19, 91, 236, 0.3)"
                                        points="100,40 150,80 140,130 100,160 50,130 60,70"
                                        stroke="#00d4ff"
                                        strokeWidth="3"
                                    ></motion.polygon>

                                    {/* Nodes */}
                                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.0 }} className="cursor-pointer shadow-lg" cx="100" cy="40" fill="#fff" r="4"></motion.circle>
                                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.1 }} className="cursor-pointer shadow-lg" cx="150" cy="80" fill="#fff" r="4"></motion.circle>
                                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.2 }} className="cursor-pointer shadow-lg" cx="140" cy="130" fill="#fff" r="4"></motion.circle>
                                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.3 }} className="cursor-pointer shadow-lg" cx="100" cy="160" fill="#fff" r="4"></motion.circle>
                                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.4 }} className="cursor-pointer shadow-lg" cx="50" cy="130" fill="#fff" r="4"></motion.circle>
                                    <motion.circle initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 1.5 }} className="cursor-pointer shadow-lg" cx="60" cy="70" fill="#fff" r="4"></motion.circle>
                                </svg>

                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">LEADERSHIP</div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold">ETHICS</div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold rotate-90 origin-right -mr-4">TECH</div>
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-white font-bold -rotate-90 origin-left -ml-4">SOCIAL</div>
                            </div>

                            <div className="mt-8 flex justify-between items-center bg-brand-blue/10 p-4 rounded-xl">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Development Status</p>
                                    <p className="text-white font-bold">Growth Potential: 85%</p>
                                </div>
                                <Rocket className="w-5 h-5 text-brand-accent animate-bounce" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
