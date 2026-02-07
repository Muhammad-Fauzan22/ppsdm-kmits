"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const footerLinks = {
    product: [
        { label: "9 Dimensi", href: "#9-dimensi" },
        { label: "Sistem Assessment", href: "#assessment" },
        { label: "Dashboard", href: "/dashboard" }
    ],
    resources: [
        { label: "Tentang Kami", href: "/about" },
        { label: "Metodologi Riset", href: "/methodology" }
    ],
    contact: {
        address: "Gedung Rektorat ITS, Surabaya",
        email: "ppsdm@its.ac.id",
        phone: "(031) 599-4251"
    }
};

const stats = [
    { value: "15,000+", label: "Mahasiswa Aktif" },
    { value: "9", label: "Dimensi Holistik" },
    { value: "85%", label: "Kepuasan User" },
    { value: "24/7", label: "Akses Modul" }
];

// Water Reminder Widget
function WaterReminder() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Show after 30 seconds
        const timer = setTimeout(() => {
            if (!isDismissed) setIsVisible(true);
        }, 30000);
        return () => clearTimeout(timer);
    }, [isDismissed]);

    if (!isVisible || isDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className="fixed bottom-4 right-4 z-50 max-w-xs"
            >
                <div className="bg-white dark:bg-[#1A1F2E] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-4 relative">
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">💧</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                Jangan lupa kesehatanmu
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                                Sudah minum air putih yang cukup hari ini? Dehidrasi menurunkan fokus belajar hingga 20%.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            {/* Stats Banner */}
            <section className="py-16 px-4 bg-[#0A0F1A] border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 bg-[#050810] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                                    <span className="text-white font-black text-lg">M</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">PPSDM KM ITS</h3>
                                    <p className="text-xs text-slate-500">Holistic Student Development Ecosystem</p>
                                </div>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                                Platform pengembangan mahasiswa pertama berbasis sains di Indonesia.
                                Membentuk lulusan ITS yang tidak hanya cerdas akademik, tapi juga matang karakter.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm">Product</h4>
                            <ul className="space-y-2">
                                {footerLinks.product.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.href} className="text-slate-500 hover:text-white text-sm transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm">Contact</h4>
                            <ul className="space-y-2 text-slate-500 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">location_on</span>
                                    {footerLinks.contact.address}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">mail</span>
                                    {footerLinks.contact.email}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">phone</span>
                                    {footerLinks.contact.phone}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-xs">
                            © {currentYear} PPSDM KM ITS - Institut Teknologi Sepuluh Nopember.
                        </p>
                        <p className="text-slate-600 text-xs flex items-center gap-1">
                            Made with <span className="text-red-500">❤️</span> by ITS Students
                            <span className="ml-2 px-2 py-0.5 rounded bg-white/5 text-slate-500">v3.1.0</span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Water Reminder Widget */}
            <WaterReminder />
        </>
    );
}
