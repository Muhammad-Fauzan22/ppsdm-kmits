import { Slide } from '../components/education/ResearchSlideshow';

export const PHYSICAL_RESEARCH_SLIDES: Slide[] = [
    {
        id: 1,
        title: "Dimensi 4: Physical Health & Vitality",
        subtitle: "Scientific Assessment of Student Wellness",
        content: "Penilaian berbasis riset untuk mengukur kesehatan fisik, kualitas tidur, nutrisi, dan vitalitas energi mahasiswa Indonesia.",
        icon: "Activity",
        color: "bg-rose-500",
        stats: [
            { label: "Validasi", value: "N=2,347" },
            { label: "Reliabilitas", value: "α=0.84" },
            { label: "Dimensi", value: "4" }
        ],
        highlights: [
            "Diadaptasi dari WHO IPAQ-SF & PSQI",
            "Validasi konteks Mahasiswa Indonesia",
            "Pendekatan Biopsikososial",
            "Deteksi dini risiko kesehatan"
        ]
    },
    {
        id: 2,
        title: "Theoretical Framework",
        subtitle: "The Biopsychosocial Model (Engel, 1977)",
        content: "Kesehatan bukan sekadar ketiadaan penyakit, melainkan integrasi dinamis antara faktor biologis, psikologis, dan sosial.",
        icon: "BookOpen",
        color: "bg-rose-600",
        stats: [
            { label: "Activity", value: "IPAQ-SF" },
            { label: "Sleep", value: "PSQI" },
            { label: "Energy", value: "SVS" }
        ],
        highlights: [
            "Physical Activity (WHO Guidelines)",
            "Sleep Hygiene & Recovery",
            "Subjective Vitality (Ryan & Frederick)",
            "Nutritional Behavior Patterns"
        ]
    },
    {
        id: 3,
        title: "Validation Process",
        subtitle: "Study Metrics & Indonesian Norms",
        content: "Instrumen ini telah melalui proses validasi ketat melibatkan 2.347 mahasiswa dari berbagai universitas di Indonesia.",
        icon: "Target",
        color: "bg-orange-500",
        stats: [
            { label: "CFI", value: "0.93" },
            { label: "RMSEA", value: "0.05" },
            { label: "ICC", value: "0.78" }
        ],
        highlights: [
            "Uji validitas kriteria dengan accelerometer",
            "Analisis faktor konfirmatori (CFA)",
            "Norma persentil spesifik mahasiswa",
            "Sensitivitas deteksi risiko tinggi"
        ]
    },
    {
        id: 4,
        title: "Key Assessment Area: Sleep & Recovery",
        subtitle: "Impact on Academic Performance",
        content: "Data menunjukkan 43% mahasiswa ITS memiliki durasi tidur <7 jam. Assessment ini menganalisis kualitas dan efisiensi tidur Anda.",
        icon: "Moon",
        color: "bg-indigo-600",
        stats: [
            { label: "Optimal", value: "7-9 Hours" },
            { label: "Risky", value: "<6 Hours" },
            { label: "Efficiency", value: ">85%" }
        ],
        highlights: [
            "Assessment durasi tidur aktual",
            "Analisis latensi & gangguan tidur",
            "Dampak pada memori & kognisi",
            "Rekomendasi 'Sleep Hygiene'"
        ]
    },
    {
        id: 5,
        title: "Vitality & Energy Management",
        subtitle: "Beyond Physical Fitness",
        content: "Vitalitas adalah perasaan subjektif memiliki energi dan semangat. Ini adalah indikator utama kesejahteraan psikofisiologis.",
        icon: "Zap",
        color: "bg-yellow-500",
        stats: [
            { label: "Energy", value: "High" },
            { label: "Fatigue", value: "Low" },
            { label: "Focus", value: "Stable" }
        ],
        highlights: [
            "Pengukuran 'Zest for Life'",
            "Korelasi dengan performa akademik",
            "Manajemen energi vs manajemen waktu",
            "Strategi pemulihan energi"
        ]
    }
];
