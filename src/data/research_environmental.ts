import { Slide } from '../components/education/ResearchSlideshow';

export const ENVIRONMENTAL_RESEARCH_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Dimensi 9: Environmental & Lifestyle",
        subtitle: "Sustainable Living in the Digital Age",
        content: "Penilaian komprehensif tentang kesadaran lingkungan, perilaku berkelanjutan, dan keseimbangan gaya hidup digital mahasiswa saat ini.",
        icon: "Leaf",
        color: "bg-emerald-600",
        stats: [
            { label: "Validasi", value: "N=1,800" },
            { label: "Reliabilitas", value: "α=0.93" },
            { label: "Dimensi", value: "8" }
        ],
        highlights: [
            "Integrated Environmental & Lifestyle Scale (ELMS)",
            "Digital Wellbeing & Work-Life Balance",
            "Carbon Footprint Estimation",
            "Specific Norms for University Students"
        ]
    },
    {
        id: 2,
        title: "Why This Matters?",
        subtitle: "Beyond Just 'Go Green'",
        content: "Tantangan mahasiswa modern bukan hanya soal akademik, tapi juga menjaga keseimbangan hidup di tengah krisis iklim dan disrupsi digital.",
        icon: "Globe",
        color: "bg-blue-600",
        stats: [
            { label: "Eco-Anxiety", value: "Rising" },
            { label: "Screen Time", value: "8.2h/day" },
            { label: "Burnout", value: "Risk" }
        ],
        highlights: [
            "Koneksi Kesehatan Planet & Mental",
            "Mengelola 'Digital Overload'",
            "Gaya Hidup Minimalis & Bermakna",
            "Peran Mahasiswa sebagai Agen Perubahan"
        ]
    },
    {
        id: 3,
        title: "Instrument Validation",
        subtitle: "Robust Psychometric Properties",
        content: "Diadaptasi dari 23 instrumen internasional dan divalidasi pada 1.800 mahasiswa Indonesia dengan analisis faktor konfirmatori (CFA) yang ketat.",
        icon: "ShieldCheck",
        color: "bg-teal-600",
        stats: [
            { label: "CFI", value: "0.93" },
            { label: "RMSEA", value: "0.054" },
            { label: "Invariance", value: "Yes" }
        ],
        highlights: [
            "Valid lintas Fakultas (Teknik, Sosial, dll)",
            "Bebas Bias Gender",
            "Konsistensi Test-Retest Tinggi (r=0.88)",
            "Korelasi Kuat dengan NEP & SLS"
        ]
    },
    {
        id: 4,
        title: "What We Measure",
        subtitle: "8 Pillars of Modern Sustainability",
        content: "ELMS mengukur 8 aspek: Awareness, Behavior, WLB, Digital Wellbeing, Minimalism, Energy, Community, dan Advocacy.",
        icon: "BarChart",
        color: "bg-lime-600",
        stats: [
            { label: "Mindset", value: "Awareness" },
            { label: "Habit", value: "Behavior" },
            { label: "Impact", value: "Footprint" }
        ],
        highlights: [
            "Work-Life Balance (Akademik vs Pribadi)",
            "Kontrol Penggunaan Gadget",
            "Hemat Energi & Konservasi",
            "Aktivisme & Advokasi Lingkungan"
        ]
    },
    {
        id: 5,
        title: "Your Impact Profile",
        subtitle: "Personalized Growth Path",
        content: "Hasil asesmen akan memberikan profil keberlanjutan Anda, estimasi jejak karbon tahunan, dan rekomendasi aksi nyata.",
        icon: "Footprints",
        color: "bg-orange-500",
        stats: [
            { label: "Low Impact", value: "Goal" },
            { label: "Balance", value: "Key" },
            { label: "Action", value: "Now" }
        ],
        highlights: [
            "Estimasi CO2 Footprint (kg/tahun)",
            "Analisis Kekuatan & Area Pertumbuhan",
            "Rekomendasi Gaya Hidup Sehat",
            "Strategi Digital Detox"
        ]
    }
];
