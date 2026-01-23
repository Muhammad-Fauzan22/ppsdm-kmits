import { Slide } from '../components/education/ResearchSlideshow';

export const MENTAL_RESEARCH_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Dimensi 6: Kesehatan Mental & Psychological Well-being",
        subtitle: "Validasi Alat Ukur Kesejahteraan Mahasiswa",
        content: "Penilaian komprehensif untuk mengukur kesejahteraan emosional, psikologis, dan sosial mahasiswa, serta ketahanan mental (resiliensi).",
        icon: "Activity",
        color: "bg-emerald-500",
        stats: [
            { label: "Validasi", value: "N=500" },
            { label: "Reliabilitas", value: "α=0.87" },
            { label: "Konstruk", value: "3+2" }
        ],
        highlights: [
            "Diadaptasi dari MHC-SF (Keyes, 2002)",
            "Integrasi Konsep Resiliensi (CD-RISC)",
            "Deteksi Dini Risiko Kesehatan Mental",
            "Konteks Mahasiswa Indonesia"
        ]
    },
    {
        id: 2,
        title: "Theoretical Framework",
        subtitle: "The Mental Health Continuum Model",
        content: "Kesehatan mental bukan sekadar ketiadaan gangguan, tetapi keberadaan kesejahteraan emosional, psikologis, dan sosial (Flourishing).",
        icon: "Brain",
        color: "bg-emerald-600",
        stats: [
            { label: "Hedonic", value: "Emotion" },
            { label: "Eudaimonic", value: "Function" },
            { label: "Social", value: "Relation" }
        ],
        highlights: [
            "Emotional Well-being (Kebahagiaan)",
            "Psychological Well-being (Fungsi Optimal)",
            "Social Well-being (Keterhubungan)",
            "Resilience & Coping mechanisms"
        ]
    },
    {
        id: 3,
        title: "Psychometric Properties",
        subtitle: "Hasil Studi Pilot di ITS",
        content: "Instrumen ini telah melalui uji validitas dan reliabilitas ketat pada 500 mahasiswa ITS dengan hasil psikometrik yang sangat baik.",
        icon: "Target",
        color: "bg-teal-500",
        stats: [
            { label: "CFI", value: "0.93" },
            { label: "RMSEA", value: "0.05" },
            { label: "SRMR", value: "0.04" }
        ],
        highlights: [
            "Konsistensi Internal Tinggi (α = 0.87)",
            "Stabilitas Test-Retest (r = 0.82)",
            "Korelasi Positif dengan Life Satisfaction",
            "Validitas Diskriminan Terkonfirmasi"
        ]
    },
    {
        id: 4,
        title: "Key Assessment Areas",
        subtitle: "Apa yang Kami Ukur?",
        content: "Assessment ini mengevaluasi 5 area kunci: Kesejahteraan Emosional, Psikologis, Sosial, Resiliensi, dan Mindfulness/Stress Management.",
        icon: "PieChart",
        color: "bg-green-600",
        stats: [
            { label: "Items", value: "8" },
            { label: "Time", value: "3 min" },
            { label: "Scale", value: "1-5" }
        ],
        highlights: [
            "Perasaan bahagia & puas (Emotional)",
            "Tujuan hidup & pertumbuhan (Psychological)",
            "Adaptabilitas & bangkit dari masalah (Resilience)",
            "Manajemen stres & kesadaran (Mindfulness)"
        ]
    },
    {
        id: 5,
        title: "Interpretation & Action",
        subtitle: "Dari Flourishing hingga Struggling",
        content: "Hasil Anda dikategorikan dari 'Flourishing' (Optimal) hingga 'Struggling', disertai rekomendasi personal untuk peningkatan.",
        icon: "Zap",
        color: "bg-blue-600",
        stats: [
            { label: "Optimal", value: "Flourishing" },
            { label: "Average", value: "Moderate" },
            { label: "Risk", value: "Struggling" }
        ],
        highlights: [
            "Identifikasi kekuatan mental Anda",
            "Deteksi sinyal peringatan dini",
            "Rekomendasi exercises (e.g. Gratitude)",
            "Akses ke layanan konseling jika perlu"
        ]
    }
];
