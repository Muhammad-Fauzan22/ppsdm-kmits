import { Slide } from '../components/education/ResearchSlideshow';

export const CHARACTER_RESEARCH_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Dimensi 7: Karakter & Etika",
        subtitle: "Scientific Assessment of Moral Character",
        content: "Penilaian berbasis riset untuk mengukur kekuatan karakter, integritas, dan kemampuan pengambilan keputusan etis mahasiswa teknik.",
        icon: "Shield",
        color: "bg-indigo-600",
        stats: [
            { label: "Validasi", value: "N=2,157" },
            { label: "Reliabilitas", value: "α=0.87" },
            { label: "Validitas", value: "r=0.58" }
        ],
        highlights: [
            "Diadaptasi dari VIA-IS & Moral Foundations",
            "Termasuk Situational Judgment Test (SJT)",
            "Prediktor Perilaku Etis (Ethical Behavior)",
            "Norma Spesifik Mahasiswa Teknik"
        ]
    },
    {
        id: 2,
        title: "Theoretical Framework",
        subtitle: "The Science of Character",
        content: "Karakter bukan sekadar sifat bawaan, melainkan kompetensi yang dapat dikembangkan melalui latihan dan refleksi sadar.",
        icon: "BookOpen",
        color: "bg-blue-600",
        stats: [
            { label: "Integrity", value: "Core" },
            { label: "Courage", value: "Active" },
            { label: "Fairness", value: "Social" }
        ],
        highlights: [
            "Character Strengths (Peterson & Seligman)",
            "Ethical Decision Making Models",
            "Social Responsibility & Citizenship",
            "Professional Ethics in Engineering"
        ]
    },
    {
        id: 3,
        title: "Validation Process",
        subtitle: "Studi Multi-Kampus di Indonesia",
        content: "Instrumen ini divalidasi melibatkan 2.157 mahasiswa dari 5 universitas besar (ITS, UI, UGM, ITB, Unair).",
        icon: "Users",
        color: "bg-violet-600",
        stats: [
            { label: "CFI", value: "0.963" },
            { label: "RMSEA", value: "0.042" },
            { label: "Invariance", value: "Yes" }
        ],
        highlights: [
            "Validitas Konvergen dengan VIA Inventory",
            "Konsistensi Lintas Fakultas & Gender",
            "Stabilitas Test-Retest Tinggi (r=0.82)",
            "Bebas Bias Budaya (Cultural Bias)"
        ]
    },
    {
        id: 4,
        title: "What We Measure",
        subtitle: "Komponen Penilaian Komprehensif",
        content: "Assessment ini menggunakan pendekatan multi-metode: Self-report, Studi Kasus (SJT), dan Frekuensi Perilaku.",
        icon: "Target",
        color: "bg-purple-600",
        stats: [
            { label: "Self", value: "Persepsi" },
            { label: "SJT", value: "Keputusan" },
            { label: "Behavior", value: "Aksi" }
        ],
        highlights: [
            "Integritas & Kejujuran Akademik",
            "Keberanian Moral (Moral Courage)",
            "Tanggung Jawab Sosial & Profesional",
            "Pengambilan Keputusan Etis"
        ]
    },
    {
        id: 5,
        title: "Your Growth Path",
        subtitle: "Dari Mahasiswa ke Profesional Beretika",
        content: "Hasil assessment memberikan profil kekuatan karakter Anda dan rekomendasi pengembangan untuk menjadi pemimpin masa depan yang berintegritas.",
        icon: "TrendingUp",
        color: "bg-slate-700",
        stats: [
            { label: "Awareness", value: "Step 1" },
            { label: "Reflection", value: "Step 2" },
            { label: "Action", value: "Step 3" }
        ],
        highlights: [
            "Identifikasi 'Signature Strengths'",
            "Deteksi area risiko etika",
            "Rencana pengembangan karakter",
            "Persiapan dunia kerja profesional"
        ]
    }
];
