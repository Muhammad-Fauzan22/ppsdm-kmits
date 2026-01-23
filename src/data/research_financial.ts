import { Slide } from '../components/education/ResearchSlideshow';

export const FINANCIAL_RESEARCH_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Dimensi 3: Financial Intelligence",
        subtitle: "Literacy, Behavior & Engineering Economy",
        content: "Mengukur kemampuan mahasiswa dalam mengelola keuangan pribadi serta menerapkan prinsip ekonomi dalam pengambilan keputusan teknik.",
        icon: "Wallet",
        color: "bg-blue-600",
        stats: [
            { label: "Validasi", value: "N=1,250" },
            { label: "Reliabilitas", value: "α=0.89" },
            { label: "Standard", value: "OECD" }
        ],
        highlights: [
            "Diadaptasi dari OECD/INFE 2020",
            "Termasuk Studi Kasus Ekonomi Teknik",
            "Analisis Perilaku & Psikologi Uang",
            "Norma Khusus Mahasiswa"
        ]
    },
    {
        id: 2,
        title: "Why It Matters?",
        subtitle: "Financial Health = Mental Health",
        content: "Masalah finansial adalah salah satu pemicu stres terbesar pada mahasiswa. Literasi keuangan yang baik mencegah kecemasan dan mendukung fokus akademik.",
        icon: "TrendingUp",
        color: "bg-sky-500",
        stats: [
            { label: "Stress", value: "-40%" },
            { label: "Asset", value: "+2X" },
            { label: "Career", value: "Ready" }
        ],
        highlights: [
            "Mengurangi 'Financial Anxiety'",
            "Persiapan Manajemen Gaji Pertama",
            "Pencegahan Jebakan Utang (Pinjol)",
            "Investasi Jangka Panjang"
        ]
    },
    {
        id: 3,
        title: "The Framework",
        subtitle: "Knowledge + Behavior + Attitude",
        content: "Kami menilai tiga pilar utama: Apa yang Anda tahu (Knowledge), Apa yang Anda lakukan (Behavior), dan Bagaimana Anda berpikir (Attitude).",
        icon: "PieChart",
        color: "bg-indigo-600",
        stats: [
            { label: "Know", value: "40%" },
            { label: "Act", value: "40%" },
            { label: "Mind", value: "20%" }
        ],
        highlights: [
            "Konsep: Inflasi, Bunga Majemuk, Risiko",
            "Aksi: Budgeting, Saving, Investing",
            "Mental: Delay Gratification, Risk Mgmt",
            "Teknik: Cost-Benefit Analysis"
        ]
    },
    {
        id: 4,
        title: "Engineering Context",
        subtitle: "More Than Just Personal Finance",
        content: "Sebagai calon insinyur, Anda juga diuji dalam pengambilan keputusan biaya proyek yang efisien dan etis.",
        icon: "Briefcase",
        color: "bg-slate-700",
        stats: [
            { label: "Project", value: "ROI" },
            { label: "Cost", value: "BEP" },
            { label: "Value", value: "NPV" }
        ],
        highlights: [
            "Perhitungan Break Even Point (BEP)",
            "Optimasi Biaya Proyek",
            "Etika Keuangan Profesional",
            "Keputusan Investasi Aset Alat"
        ]
    },
    {
        id: 5,
        title: "Your Growth Path",
        subtitle: "From Saver to Investor",
        content: "Hasil assessment ini akan memetakan posisi Anda: apakah masih di tahap 'Survival', 'Security', atau sudah menuju 'Financial Freedom'.",
        icon: "Target",
        color: "bg-teal-600",
        stats: [
            { label: "Level 1", value: "Basic" },
            { label: "Level 2", value: "Proficient" },
            { label: "Level 3", value: "Advanced" }
        ],
        highlights: [
            "Rekomendasi Aksi Spesifik",
            "Resource Belajar Terkurasi",
            "Simulasi Perencanaan Masa Depan",
            "Profil Risiko Investasi Anda"
        ]
    }
];
