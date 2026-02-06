import { ResearchSlide } from '../components/education/ResearchSlideshow';

export const MENTAL_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: "1",
        type: "cover",
        title: "Dimensi 4: Kesehatan Mental",
        subtitle: "Resiliensi & Kestabilan Psikologis",
        content: {
            definition: "Kemampuan mengelola stres, beradaptasi dengan perubahan, dan berkontribusi secara produktif.",
            stats: [
                { label: "Resilience", value: "High" },
                { label: "Coping", value: "Adaptive" },
                { label: "Focus", value: "Sharp" }
            ]
        },
        note: "WHO Definition of Mental Health"
    },
    {
        id: "2",
        type: "concept",
        title: "Cognitive Resilience",
        content: {
            definition: "Kekuatan mental untuk bangkit dari kegagalan dan tetap fokus pada tujuan jangka panjang.",
            framework: "Grit (Duckworth)",
            validation: "Academic Persistence Correlation"
        }
    },
    {
        id: "3",
        type: "process",
        title: "Mental Fitness Routine",
        steps: [
            "Mindfulness Practice",
            "Cognitive Reframing",
            "Stress Management",
            "Continuous Learning"
        ]
    }
];
