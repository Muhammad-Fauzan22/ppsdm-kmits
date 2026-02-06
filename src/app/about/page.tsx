"use client";

import Link from "next/link";

const team = [
    { name: "Tim Development", role: "Frontend & Backend", icon: "code" },
    { name: "Tim Design", role: "UI/UX Research", icon: "palette" },
    { name: "Tim Program", role: "Content & Program", icon: "event" },
];

const milestones = [
    { year: "2024", title: "Platform Launch", description: "Peluncuran versi 1.0" },
    { year: "2024", title: "Integrasi SSO ITS", description: "Login dengan akun myITS" },
    { year: "2025", title: "Mobile App", description: "Aplikasi mobile PWA" },
];

import {
    Brain,
    Heart,
    Activity,
    User,
    Users,
    DollarSign,
    Dumbbell,
    ShieldCheck,
    Leaf
} from 'lucide-react';



export default function AboutPage() {
    const dimensions = [
        { icon: Brain, name: "Kognitif", color: "bg-blue-500" },
        { icon: Heart, name: "Afektif", color: "bg-pink-500" },
        { icon: Activity, name: "Psikomotorik", color: "bg-orange-500" },
        { icon: User, name: "Spiritual", color: "bg-purple-500" },
        { icon: Users, name: "Sosial", color: "bg-cyan-500" },
        { icon: DollarSign, name: "Finansial", color: "bg-green-500" },
        { icon: Dumbbell, name: "Kesehatan", color: "bg-red-500" },
        { icon: ShieldCheck, name: "Karakter", color: "bg-indigo-500" },
        { icon: Leaf, name: "Lingkungan", color: "bg-teal-500" },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white font-display">
            {/* Hero */}
            <div className="gradient-primary text-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang PPSDM KMM</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Platform Pengembangan Sumber Daya Mahasiswa Himpunan Mahasiswa Mesin ITS untuk menciptakan generasi engineer yang holistik dan berdaya saing global.
                    </p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto p-6 md:p-8 space-y-12">
                {/* Vision & Mission */}
                <section className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-8">
                        <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
                        </div>
                        <h2 className="text-xl font-bold mb-3">Visi</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Menjadi platform pengembangan mahasiswa terdepan yang membentuk insan ITS berkarakter unggul dan berdaya saing global.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark p-8">
                        <div className="size-14 bg-growth-green/10 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-growth-green text-3xl">flag</span>
                        </div>
                        <h2 className="text-xl font-bold mb-3">Misi</h2>
                        <ul className="text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                            <li>Memfasilitasi pengembangan 9 dimensi mahasiswa</li>
                            <li>Menyediakan tracking dan analytics pengembangan</li>
                            <li>Menghubungkan mahasiswa dengan mentor terbaik</li>
                        </ul>
                    </div>
                </section>

                {/* 9 Dimensions */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-center">9 Dimensi Pengembangan</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {dimensions.map((dim) => (
                            <div
                                key={dim.name}
                                className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4 text-center hover:shadow-md transition-shadow"
                            >
                                <div className={`size-12 ${dim.color} rounded-xl flex items-center justify-center text-white mx-auto mb-2`}>
                                    {typeof dim.icon === 'string' ? (
                                        <span className="material-symbols-outlined">{dim.icon}</span>
                                    ) : (
                                        <dim.icon className="w-6 h-6" />
                                    )}
                                </div>
                                <span className="text-sm font-medium">{dim.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Timeline */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-center">Roadmap</h2>
                    <div className="space-y-4">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-4"
                            >
                                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="text-primary font-bold">{milestone.year}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">{milestone.title}</h3>
                                    <p className="text-sm text-gray-500">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-center">Tim Pengembang</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="bg-white dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6 text-center"
                            >
                                <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-primary text-3xl">{member.icon}</span>
                                </div>
                                <h3 className="font-bold">{member.name}</h3>
                                <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-8">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                    >
                        Mulai Sekarang
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </section>
            </main>
        </div>
    );
}
