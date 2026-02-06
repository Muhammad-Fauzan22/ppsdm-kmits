import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const PHYSICAL_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 2: Kesehatan Fisik",
        subtitle: "Vitalitas & Kebugaran Tubuh",
        content: {
            definition: "Kondisi optimal tubuh yang memungkinkan aktivitas sehari-hari tanpa kelelahan berlebih.",
            stats: [
                { label: "Energy", value: "High" },
                { label: "Sleep", value: "7h+" },
                { label: "Activity", value: "Active" }
            ]
        },
        note: "Indikator WHO untuk Aktivitas Fisik"
    },
    {
        id: "2",
        type: "concept",
        title: "Health Pillars",
        content: {
            definition: "Kesehatan fisik ditopang oleh tidur, nutrisi, dan aktivitas fisik yang seimbang.",
            framework: "Lifestyle Medicine",
            validation: "Biometric Markers correlation"
        }
    },
    {
        id: "3",
        type: "data",
        title: "Physical Benchmarks",
        table: [
            { percentile: "Best", score: ">8h", label: "Sleep Duration" },
            { percentile: "Good", score: "7-8h", label: "Sleep Duration" },
            { percentile: "Fair", score: "<6h", label: "Sleep Duration" }
        ],
        note: "Standar rekomendasi National Sleep Foundation"
    }
];
