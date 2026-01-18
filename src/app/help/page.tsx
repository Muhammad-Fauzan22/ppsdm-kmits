"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
    {
        question: "Apa itu PPSDM KMM?",
        answer: "PPSDM KMM adalah Platform Pengembangan Sumber Daya Mahasiswa yang dikembangkan oleh Himpunan Mahasiswa Mesin ITS sebagai bagian dari HMM Digital Hub. Platform ini membantu mahasiswa Teknik Mesin mengembangkan diri secara holistik melalui 9 dimensi pengembangan.",
    },
    {
        question: "Bagaimana cara memulai menggunakan platform?",
        answer: "Setelah login dengan akun ITS Anda, Anda akan diarahkan ke proses onboarding. Kemudian Anda dapat mengakses dashboard untuk melihat progress dan rekomendasi aktivitas pengembangan.",
    },
    {
        question: "Apa saja 9 dimensi pengembangan?",
        answer: "9 dimensi meliputi: Kognitif (intelektual), Afektif (emosional), Psikomotorik (keterampilan), Spiritual, Sosial, Finansial, Kesehatan, Karakter, dan Lingkungan.",
    },
    {
        question: "Bagaimana cara mendapatkan poin dan badge?",
        answer: "Poin didapat dengan menyelesaikan aktivitas pengembangan seperti mengikuti workshop, menyelesaikan project, atau berpartisipasi dalam program. Badge otomatis diberikan saat Anda mencapai milestone tertentu.",
    },
    {
        question: "Siapa yang bisa menjadi mentor saya?",
        answer: "Mentor adalah dosen atau profesional yang ditugaskan untuk membimbing pengembangan Anda. Hubungi admin atau PA Anda untuk informasi penugasan mentor.",
    },
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-card-dark border-b border-border-light dark:border-border-dark px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">help</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold">Help Center</h1>
                            <p className="text-xs text-gray-500">PPSDM KMM Support</p>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
                {/* Search */}
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <span className="material-symbols-outlined">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Cari bantuan..."
                        className="w-full pl-12 pr-4 py-4 text-lg border border-border-light dark:border-border-dark rounded-2xl bg-white dark:bg-card-dark focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                {/* Quick Links */}
                <section>
                    <h2 className="text-lg font-bold mb-4">Quick Links</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: "play_circle", label: "Getting Started", href: "/onboarding" },
                            { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
                            { icon: "description", label: "Documentation", href: "/docs" },
                            { icon: "contact_support", label: "Contact Us", href: "#contact" },
                        ].map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
                            >
                                <span className="material-symbols-outlined text-primary text-3xl mb-2 block">{link.icon}</span>
                                <span className="font-medium text-sm">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section>
                    <h2 className="text-lg font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="font-medium">{faq.question}</span>
                                    <span className={`material-symbols-outlined text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}>
                                        expand_more
                                    </span>
                                </button>
                                {openFaq === index && (
                                    <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section id="contact" className="bg-gradient-to-br from-primary to-its-blue text-white rounded-2xl p-8 text-center">
                    <span className="material-symbols-outlined text-5xl mb-4">support_agent</span>
                    <h2 className="text-2xl font-bold mb-2">Butuh Bantuan Lebih?</h2>
                    <p className="text-white/80 mb-6">Tim support kami siap membantu Anda</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:support@km.its.ac.id"
                            className="px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-opacity-90 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">email</span>
                            Email Support
                        </a>
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                            WhatsApp
                        </a>
                    </div>
                </section>
            </main>
        </div>
    );
}
