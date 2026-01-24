import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const CHARACTER_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 7: Karakter & Etika",
        subtitle: "Scientific Assessment of Moral Character",
        content: {
            stats: [
                { label: "Validasi", value: "N=2,157" },
                { label: "Reliabilitas", value: "α=0.87" },
                { label: "Validitas", value: "r=0.58" }
            ]
        },
        note: "Diadaptasi dari VIA-IS & Moral Foundations"
    },
    {
        id: "2",
        type: "concept",
        title: "Theoretical Framework",
        content: {
            definition: "Karakter bukan sekadar sifat bawaan, melainkan kompetensi yang dapat dikembangkan melalui latihan dan refleksi sadar.",
            framework: "Character Strengths (Peterson & Seligman)",
            validation: "Ethical Decision Making Models"
        }
    },
    {
        id: "3",
        type: "cover", // Using cover layout for validation process as it fits stats well
        title: "Validation Process",
        subtitle: "Studi Multi-Kampus di Indonesia",
        content: {
            stats: [
                { label: "CFI", value: "0.963" },
                { label: "RMSEA", value: "0.042" },
                { label: "Invariance", value: "Yes" }
            ]
        },
        note: "Validitas Konvergen dengan VIA Inventory"
    },
    {
        id: "4",
        type: "process",
        title: "What We Measure",
        steps: [
            "Integritas & Kejujuran Akademik",
            "Keberanian Moral (Moral Courage)",
            "Tanggung Jawab Sosial & Profesional",
            "Pengambilan Keputusan Etis"
        ]
    },
    {
        id: "5",
        type: "process",
        title: "Your Growth Path",
        steps: [
            "Awareness: Identifikasi 'Signature Strengths'",
            "Reflection: Deteksi area risiko etika",
            "Action: Rencana pengembangan karakter"
        ]
    }
];
