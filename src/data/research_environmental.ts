import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const ENVIRONMENTAL_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 6: Kesadaran Lingkungan",
        subtitle: "Harmoni dengan Alam & Sosial",
        content: {
            definition: "Pemahaman tentang dampak tindakan individu terhadap lingkungan dan komunitas sekitar.",
            stats: [
                { label: "Awareness", value: "High" },
                { label: "Action", value: "Eco-friendly" },
                { label: "Impact", value: "Positive" }
            ]
        },
        note: "Sustainable Development Goals (SDGs)"
    },
    {
        id: "2",
        type: "concept",
        title: "Eco-Consciousness",
        content: {
            definition: "Gaya hidup yang memprioritaskan keberlanjutan dan tanggung jawab ekologis.",
            framework: "Ecological Footprint",
            validation: "Pro-environmental Behavior Scale"
        }
    },
    {
        id: "3",
        type: "process",
        title: "Sustainable Actions",
        steps: [
            "Reduce Consumption",
            "Reuse Resources",
            "Recycle Waste",
            "Restore Nature"
        ]
    }
];
