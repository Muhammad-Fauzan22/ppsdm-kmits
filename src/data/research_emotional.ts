import { Slide } from '../components/education/ResearchSlideshow';

export const EMOTIONAL_RESEARCH_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Dimensi 5: Kecerdasan Emosional & Sosial",
        subtitle: "Validasi Psikometrik pada Mahasiswa Indonesia",
        content: "Assessment ilmiah untuk mengukur kemampuan mengenali, memahami, dan mengelola emosi diri serta berinteraksi efektif dengan orang lain.",
        icon: "Heart",
        color: "bg-pink-500",
        stats: [
            { label: "Validasi", value: "N=2,147" },
            { label: "Alpha", value: "0.91" },
            { label: "Faktor", value: "4" }
        ],
        highlights: [
            "Diadaptasi dari TEIQue & IRI",
            "Konteks Budaya Kolektivis Indonesia",
            "Prediktor Kepemimpinan (r=0.52)",
            "Reliabilitas Konsisten (Test-Retest r=0.84)"
        ]
    },
    {
        id: 2,
        title: "Theoretical Framework",
        subtitle: "Model Empat Dimensi",
        content: "Konstruk kecerdasan emosional dibangun di atas empat pilar utama yang saling terintegrasi dalam membentuk kompetensi sosial.",
        icon: "Brain",
        color: "bg-purple-600",
        stats: [
            { label: "Self", value: "Awareness" },
            { label: "Social", value: "Awareness" },
            { label: "Self", value: "Management" }
        ],
        highlights: [
            "Kesadaran Diri (Self-Awareness)",
            "Manajemen Diri (Self-Management)",
            "Kesadaran Sosial (Social Awareness)",
            "Manajemen Hubungan (Relationship Mgmt)"
        ]
    },
    {
        id: 3,
        title: "Validation Results",
        subtitle: "Bukti Empiris Kualitas Instrumen",
        content: "Analisis Faktor Konfirmatori (CFA) menunjukkan model 4-faktor yang fit dengan data mahasiswa Indonesia (CFI=0.943).",
        icon: "Target",
        color: "bg-rose-500",
        stats: [
            { label: "CFI", value: "0.943" },
            { label: "RMSEA", value: "0.042" },
            { label: "SRMR", value: "0.037" }
        ],
        highlights: [
            "Validitas Konvergen tinggi dengan TEIQue (r=0.78)",
            "Korelasi signifikan dengan prestasi akademik (GPA)",
            "Invariansi pengukuran antar gender terkonfirmasi",
            "Norma spesifik untuk mahasiswa teknik"
        ]
    },
    {
        id: 4,
        title: "Why It Matters?",
        subtitle: "Dampak pada Kesuksesan Karir & Kehidupan",
        content: "Kecerdasan emosional terbukti menjadi prediktor kuat untuk kesuksesan kepemimpinan dan kesejahteraan psikologis.",
        icon: "Users",
        color: "bg-indigo-600",
        stats: [
            { label: "Leadership", value: "High" },
            { label: "Conflict", value: "Low" },
            { label: "Wellbeing", value: "High" }
        ],
        highlights: [
            "Kemampuan resolusi konflik yang lebih baik",
            "Ketahanan stres (Resilience) yang lebih tinggi",
            "Jaringan sosial yang lebih luas dan suportif",
            "Adaptabilitas dalam lingkungan kerja dinamis"
        ]
    },
    {
        id: 5,
        title: "Normative Interpretation",
        subtitle: "Posisi Anda di Antara Populasi",
        content: "Skor Anda dibandingkan dengan norma populasi 2,147 mahasiswa untuk memberikan gambaran obyektif tentang perkembangan Anda.",
        icon: "BarChart",
        color: "bg-teal-500",
        stats: [
            { label: "Top 10%", value: ">83.6" },
            { label: "Average", value: "68.5" },
            { label: "Top 5%", value: ">87.1" }
        ],
        highlights: [
            "Kategori Sangat Unggul (>90th percentile)",
            "Kategori Unggul (>75th percentile)",
            "Rekomendasi pengembangan personalisasi",
            "Tracking progress longitudinal"
        ]
    }
];
