import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const FINANCIAL_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 3: Literasi Finansial",
        subtitle: "Pengelolaan Sumber Daya Ekonomi",
        content: {
            definition: "Pengetahuan dan perilaku efektif dalam mengelola keuangan pribadi untuk kesejahteraan jangka panjang.",
            stats: [
                { label: "Budgeting", value: "Active" },
                { label: "Saving", value: "Regular" },
                { label: "Debt", value: "Low" }
            ]
        },
        note: "OECD Financial Literacy Framework"
    },
    {
        id: "2",
        type: "concept",
        title: "Financial Wellness",
        content: {
            definition: "Kondisi keuangan yang sehat: pengeluaran terkendali, dana darurat cukup, dan investasi masa depan.",
            framework: "Hierarchy of Financial Needs",
            validation: "Financial Stress Index correlation"
        }
    },
    {
        id: "3",
        type: "data",
        title: "Savings Benchmarks",
        table: [
            { percentile: "Excellent", score: "20%", label: "Savings Rate" },
            { percentile: "Good", score: "10-20%", label: "Savings Rate" },
            { percentile: "Basic", score: "<10%", label: "Savings Rate" }
        ],
        note: "Rekomendasi umum perencana keuangan"
    }
];
