import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const EMOTIONAL_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 5: Kecerdasan Emosional & Sosial",
        subtitle: "Validasi Psikometrik pada Mahasiswa Indonesia",
        content: {
            definition: "Assessment ilmiah untuk mengukur kemampuan mengenali, memahami, dan mengelola emosi diri serta berinteraksi efektif dengan orang lain.",
            stats: [
                { label: "Validasi", value: "N=2,147" },
                { label: "Alpha", value: "0.91" },
                { label: "Faktor", value: "4" }
            ]
        },
        note: "Diadaptasi dari TEIQue & IRI"
    },
    {
        id: "2",
        type: "concept",
        title: "Theoretical Framework",
        content: {
            definition: "Konstruk kecerdasan emosional dibangun di atas empat pilar utama yang saling terintegrasi dalam membentuk kompetensi sosial.",
            framework: "Kesadaran Diri & Sosial",
            validation: "Model Empat Dimensi"
        }
    },
    {
        id: "3",
        type: "cover",
        title: "Validation Results",
        subtitle: "Bukti Empiris Kualitas Instrumen",
        content: {
            stats: [
                { label: "CFI", value: "0.943" },
                { label: "RMSEA", value: "0.042" },
                { label: "SRMR", value: "0.037" }
            ]
        },
        note: "Analisis Faktor Konfirmatori (CFA) fit dengan data mahasiswa Indonesia"
    },
    {
        id: "4",
        type: "concept",
        title: "Why It Matters?",
        content: {
            definition: "Kecerdasan emosional terbukti menjadi prediktor kuat untuk kesuksesan kepemimpinan dan kesejahteraan psikologis.",
            impact: "Leadership & Wellbeing",
            context: "Kesuksesan Karir"
        }
    },
    {
        id: "5",
        type: "data",
        title: "Normative Interpretation",
        subtitle: "Posisi Anda di Antara Populasi",
        table: [
            { percentile: "Top 10%", score: ">83.6", label: "Very High" },
            { percentile: "Average", score: "68.5", label: "Average" },
            { percentile: "Top 5%", score: ">87.1", label: "Exceptional" }
        ],
        note: "Skor Anda dibandingkan dengan norma populasi 2,147 mahasiswa"
    }
];
