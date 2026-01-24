import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const SPIRITUAL_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 8: Kesehatan Spiritual",
        subtitle: "Makna, Tujuan & Nilai Transenden",
        content: {
            definition: "Pencarian makna hidup, koneksi dengan hal yang lebih besar dari diri sendiri, dan keselarasan nilai pribadi.",
            stats: [
                { label: "Meaning", value: "High" },
                { label: "Peace", value: "Active" },
                { label: "Values", value: "Aligned" }
            ]
        },
        note: "Diadaptasi dari Spiritual Well-being Scale (SWBS)"
    },
    {
        id: "2",
        type: "concept",
        title: "Core Concepts",
        content: {
            definition: "Spiritualitas adalah inti dari kesehatan holistik yang memberikan tujuan dan arah dalam kehidupan.",
            framework: "Frankl's Logotherapy",
            validation: "Korelasi Positif dengan Resiliensi"
        }
    },
    {
        id: "3",
        type: "process",
        title: "Development Path",
        steps: [
            "Self-Reflection: Menemukan nilai inti",
            "Connection: Membangun hubungan bermakna",
            "Contribution: Memberi dampak positif",
            "Transcendence: Melampaui ego diri"
        ]
    }
];
