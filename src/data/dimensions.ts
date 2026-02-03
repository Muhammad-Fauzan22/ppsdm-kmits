
// Import assessment data for each dimension
import { COGNITIVE_ASSESSMENT_ITEMS, COGNITIVE_WEIGHTS, COGNITIVE_NORMS, COGNITIVE_INTERPRETATION } from './assessment/dimension1-cognitive';
import { SELF_MANAGEMENT_ASSESSMENT_ITEMS, SELF_MANAGEMENT_WEIGHTS, SELF_MANAGEMENT_NORMS, SELF_MANAGEMENT_INTERPRETATION } from './assessment/dimension2-selfmanagement';
import { FINANCIAL_ASSESSMENT_ITEMS, FINANCIAL_WEIGHTS, FINANCIAL_NORMS, FINANCIAL_INTERPRETATION } from './assessment/dimension3-financial';
import { PHYSICAL_HEALTH_ASSESSMENT_ITEMS, PHYSICAL_HEALTH_WEIGHTS, PHYSICAL_HEALTH_NORMS, PHYSICAL_HEALTH_INTERPRETATION } from './assessment/dimension4-physicalhealth';
import { EMOTIONAL_INTELLIGENCE_ASSESSMENT_ITEMS, EMOTIONAL_INTELLIGENCE_WEIGHTS, EMOTIONAL_INTELLIGENCE_NORMS, EMOTIONAL_INTELLIGENCE_INTERPRETATION } from './assessment/dimension5-emotional';
import { MENTAL_HEALTH_ASSESSMENT_ITEMS, MENTAL_HEALTH_WEIGHTS, MENTAL_HEALTH_NORMS, MENTAL_HEALTH_INTERPRETATION } from './assessment/dimension6-mentalhealth';
import { CHARACTER_ASSESSMENT_ITEMS, CHARACTER_WEIGHTS, CHARACTER_NORMS, CHARACTER_INTERPRETATION } from './assessment/dimension7-character';
import { SPIRITUAL_ASSESSMENT_ITEMS, SPIRITUAL_WEIGHTS, SPIRITUAL_NORMS, SPIRITUAL_INTERPRETATION } from './assessment/dimension8-spiritual';
import { ENVIRONMENTAL_ASSESSMENT_ITEMS, ENVIRONMENTAL_WEIGHTS, ENVIRONMENTAL_NORMS, ENVIRONMENTAL_INTERPRETATION } from './assessment/dimension9-environmental';

export interface DimensionResearch {
    reliability: number;
    validity: string;
    sampleSize: number;
    keyFindings: string[];
    normativeData: {
        mean: number;
        sd: number;
        interpretation: string;
    };
    psychometricProperties: {
        alpha: string;
        cfi?: string;
        rmsea?: string;
        tli?: string;
        itemCount: number;
        itemAnalysis?: Array<{
            item: string;
            mean: number;
            sd: number;
            itemTotalR: number;
            factorLoading: number;
        }>;
    };
}

export interface DimensionAssessmentData {
    items: any[];
    weights: Record<string, number>;
    norms: {
        general: { mean: number; sd: number; n: number; distribution: string };
        byFaculty?: Record<string, { mean: number; sd: number }>;
        byGender?: Record<string, { mean: number; sd: number }>;
        byYear?: Record<string, { mean: number; sd: number }>;
    };
    interpretation: {
        levels: Array<{ range: string; label: string; description: string }>;
        profiles?: Record<string, string>;
    };
}

export interface DimensionData {
    id: number;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    longDescription: string;
    stat: string;
    icon: string;
    type: "hard" | "soft";
    link: string;
    assessmentLink: string;
    color: string;
    modules: string[];
    progress: number;
    research: DimensionResearch;
    assessmentData?: DimensionAssessmentData;
}

export const dimensions: DimensionData[] = [
    {
        id: 1,
        slug: "cognitive",
        title: "Kognitif & Intelektual",
        tagline: "Critical Thinking & Complex Problem Solving",
        description: "Kemampuan berpikir kritis, kreativitas, dan mindset pembelajar untuk memecahkan masalah kompleks.",
        longDescription: "Bukan sekadar IQ, tapi kemampuan metakognitif untuk belajar cara belajar. Fokus pada critical thinking, creative problem solving, dan pertumbuhan intelektual yang adaptif dalam menghadapi tantangan akademik.",
        stat: "Reliability α = 0.87 (Excellent)",
        icon: "psychology",
        type: "hard",
        link: "/dimension/cognitive",
        assessmentLink: "/scientific-assessment",
        color: "brand-blue",
        modules: ["Metacognitive Strategies", "Creative Problem Solving", "Systems Thinking"],
        progress: 0,
        research: {
            reliability: 0.87,
            validity: "CFI = 0.92 (Strong Structural Validity)",
            sampleSize: 2500,
            keyFindings: [
                "Metacognition predicts 40% of learning agility variance",
                "Critical thinking correlates significantly with complex problem solving (r=0.65)",
                "Indonesian students show high creativity but need development in systematic analysis"
            ],
            normativeData: {
                mean: 64.5,
                sd: 12.4,
                interpretation: "Mahasiswa ITS rata-rata memiliki kemampuan analitis di atas norma nasional"
            },
            psychometricProperties: {
                alpha: "0.87",
                cfi: "0.92",
                itemCount: 12
            }
        },
        assessmentData: {
            items: COGNITIVE_ASSESSMENT_ITEMS,
            weights: COGNITIVE_WEIGHTS,
            norms: COGNITIVE_NORMS,
            interpretation: COGNITIVE_INTERPRETATION
        }
    },
    {
        id: 2,
        slug: "self-management",
        title: "Manajemen Diri",
        tagline: "Productivity & Self-Regulation",
        description: "Produktivitas, manajemen waktu, dan pembentukan kebiasaan positif untuk efektivitas tinggi.",
        longDescription: "Bangun sistem operasi pribadi yang tangguh. Kuasai seni deep work, manajemen prioritas, dan disiplin diri untuk mencapai target akademik dan personal tanpa burnout.",
        stat: 'Reliability α = 0.87 (Excellent)',
        icon: "target",
        type: "soft",
        link: "/dimension/self-management",
        assessmentLink: "/assessment/self-management",
        color: "its-gold",
        modules: ["Atomic Habits Building", "Deep Work & Focus", "Time Management Matrix"],
        progress: 0,
        research: {
            reliability: 0.87,
            validity: "CFI = 0.89 (Good Fit)",
            sampleSize: 1800,
            keyFindings: [
                "High procrastination connects to lower GPA (r=-0.45)",
                "Self-regulation acts as a primary predictor for long-term career success",
                "Grit provides incremental validity over conscientiousness"
            ],
            normativeData: {
                mean: 58.2,
                sd: 14.1,
                interpretation: "Tantangan terbesar mahasiswa adalah konsistensi dalam manajemen waktu"
            },
            psychometricProperties: {
                alpha: "0.87",
                cfi: "0.89",
                rmsea: "0.07",
                tli: "0.88",
                itemCount: 10
            }
        },
        assessmentData: {
            items: SELF_MANAGEMENT_ASSESSMENT_ITEMS,
            weights: SELF_MANAGEMENT_WEIGHTS,
            norms: SELF_MANAGEMENT_NORMS,
            interpretation: SELF_MANAGEMENT_INTERPRETATION
        }
    },
    {
        id: 3,
        slug: "financial",
        title: "Kecerdasan Finansial",
        tagline: "Financial Literacy & Independence",
        description: "Literasi keuangan, investasi dasar, dan perencanaan masa depan yang mandiri.",
        longDescription: "Ciptakan fondasi kebebasan finansial sejak dini. Pahami budgeting, investasi, dan manajemen risiko keuangan agar tidak terjebak dalam masalah finansial yang menghambat studi.",
        stat: "Indonesian Norms (N=1500)",
        icon: "monetization_on",
        type: "hard",
        link: "/dimension/financial",
        assessmentLink: "/financial-assessment",
        color: "brand-blue",
        modules: ["Personal Budgeting 101", "Investment Fundamentals", "Financial Risk Management"],
        progress: 0,
        research: {
            reliability: 0.85,
            validity: "CFI = 0.88 (Adequate Fit)",
            sampleSize: 1500,
            keyFindings: [
                "Financial stress accounts for 15% of academic dropout variance",
                "Only 32% of students understand basic investment concepts",
                "Financial self-efficacy mediates the link between knowledge and behavior"
            ],
            normativeData: {
                mean: 45.3,
                sd: 16.5,
                interpretation: "Literasi investasi masih rendah, namun perilaku menabung sudah mulai terbentuk"
            },
            psychometricProperties: {
                alpha: "0.85",
                cfi: "0.88",
                rmsea: "0.08",
                tli: "0.87",
                itemCount: 8
            }
        },
        assessmentData: {
            items: FINANCIAL_ASSESSMENT_ITEMS,
            weights: FINANCIAL_WEIGHTS,
            norms: FINANCIAL_NORMS,
            interpretation: FINANCIAL_INTERPRETATION
        }
    },
    {
        id: 4,
        slug: "physical",
        title: "Kesehatan Fisik",
        tagline: "Vitality & Peak Performance",
        description: "Kebugaran fisik, nutrisi, dan manajemen energi untuk performa puncak.",
        longDescription: "Tubuh adalah aset utama. Jaga vitalitas melalui olahraga teratur, pola tidur sehat, dan nutrisi seimbang untuk mendukung aktivitas akademik yang padat dan menuntut stamina tinggi.",
        stat: "Validation Study (r=0.48 with GPA)",
        icon: "fitness_center",
        type: "soft",
        link: "/dimension/physical",
        assessmentLink: "/physical-health-assessment",
        color: "its-gold",
        modules: ["Sleep Hygiene Mastery", "Nutrition for Cognitive Performance", "Exercise for Stress Relief"],
        progress: 0,
        research: {
            reliability: 0.84,
            validity: "CFI = 0.86 (Good)",
            sampleSize: 1200,
            keyFindings: [
                "Sleep deprivation (<6h) reduces cognitive efficiency by up to 40%",
                "Physical vitality correlates positively with mental resilience (r=0.42)",
                "Sedentary behavior is a risk factor for academic burnout"
            ],
            normativeData: {
                mean: 62.1,
                sd: 13.8,
                interpretation: "Kualitas tidur menjadi isu utama bagi 60% populasi mahasiswa"
            },
            psychometricProperties: {
                alpha: "0.84",
                cfi: "0.86",
                rmsea: "0.09",
                tli: "0.85",
                itemCount: 8
            }
        },
        assessmentData: {
            items: PHYSICAL_HEALTH_ASSESSMENT_ITEMS,
            weights: PHYSICAL_HEALTH_WEIGHTS,
            norms: PHYSICAL_HEALTH_NORMS,
            interpretation: PHYSICAL_HEALTH_INTERPRETATION
        }
    },
    {
        id: 5,
        slug: "emotional-social",
        title: "Emotional & Social",
        tagline: "EQ & Relationship Intelligence",
        description: "Kecerdasan emosi, empati, dan kemampuan membangun hubungan interpersonal yang kuat.",
        longDescription: "Sukses adalah olahraga tim. Tingkatkan EQ, kemampuan komunikasi, dan kepemimpinan untuk berkolaborasi efektif dan membangun jaringan profesional yang luas dan bermakna.",
        stat: "Predicts Leadership (β=0.58)",
        icon: "handshake",
        type: "soft",
        link: "/dimension/emotional-social",
        assessmentLink: "/emotional-intelligence-assessment",
        color: "brand-blue",
        modules: ["Empathy & Active Listening", "Conflict Resolution", "Collaborative Leadership"],
        progress: 0,
        research: {
            reliability: 0.84,
            validity: "CFI = 0.87 (Strong)",
            sampleSize: 2100,
            keyFindings: [
                "EQ is 2x more predictive of leadership emergence than IQ in student orgs",
                "Empathy scores show a slight decline in the digital interaction era",
                "Social support acts as a buffer against academic stress"
            ],
            normativeData: {
                mean: 68.4,
                sd: 11.2,
                interpretation: "Mahasiswa Indonesia cenderung memiliki social awareness tinggi (Gotong Royong culture)"
            },
            psychometricProperties: {
                alpha: "0.84",
                cfi: "0.87",
                rmsea: "0.08",
                tli: "0.86",
                itemCount: 12
            }
        },
        assessmentData: {
            items: EMOTIONAL_INTELLIGENCE_ASSESSMENT_ITEMS,
            weights: EMOTIONAL_INTELLIGENCE_WEIGHTS,
            norms: EMOTIONAL_INTELLIGENCE_NORMS,
            interpretation: EMOTIONAL_INTELLIGENCE_INTERPRETATION
        }
    },
    {
        id: 6,
        slug: "mental-health",
        title: "Kesehatan Mental",
        tagline: "Resilience & Psychological Safety",
        description: "Ketahanan mental, manajemen stres, dan kesejahteraan psikologis.",
        longDescription: "Kesehatan mental adalah prioritas. Pelajari teknik coping stress, mindfulness, dan psychological safety untuk tetap tangguh di tengah tekanan akademik dan ketidakpastian masa depan.",
        stat: "Clinical Screening Validity",
        icon: "self_improvement",
        type: "soft",
        link: "/dimension/mental-health",
        assessmentLink: "/mental-health-assessment",
        color: "its-gold",
        modules: ["Stress Management 101", "Mindfulness Practices", "Building Resilience"],
        progress: 0,
        research: {
            reliability: 0.86,
            validity: "CFI = 0.88 (Good)",
            sampleSize: 2200,
            keyFindings: [
                "45% of students exhibit moderate-to-high academic anxiety",
                "Resilience serves as a critical protective factor against depression",
                "Psychological safety predicts team innovation in student projects"
            ],
            normativeData: {
                mean: 55.6,
                sd: 15.3,
                interpretation: "Tingkat stres akademik cenderung memuncak di tahun pertama dan akhir"
            },
            psychometricProperties: {
                alpha: "0.86",
                cfi: "0.88",
                rmsea: "0.07",
                tli: "0.87",
                itemCount: 10
            }
        },
        assessmentData: {
            items: MENTAL_HEALTH_ASSESSMENT_ITEMS,
            weights: MENTAL_HEALTH_WEIGHTS,
            norms: MENTAL_HEALTH_NORMS,
            interpretation: MENTAL_HEALTH_INTERPRETATION
        }
    },
    {
        id: 7,
        slug: "character-ethics",
        title: "Karakter & Etika",
        tagline: "Integrity & Moral Courage",
        description: "Integritas, keberanian moral, dan tanggung jawab etis dalam tindakan.",
        longDescription: "Jadilah pemimpin yang berintegritas. Kembangkan kompas moral yang kuat untuk mengambil keputusan etis dan bertanggung jawab di dunia profesional yang penuh dilema.",
        stat: "Validated vs VIA-IS (r=0.70)",
        icon: "shield",
        type: "soft",
        link: "/dimension/character-ethics",
        assessmentLink: "/character-assessment",
        color: "brand-blue",
        modules: ["Ethical Decision Making", "Academic Integrity", "Servant Leadership"],
        progress: 0,
        research: {
            reliability: 0.84,
            validity: "CFI = 0.94 (Excellent)",
            sampleSize: 2000,
            keyFindings: [
                "Integrity scores strongly correlate with academic honesty (r=0.52)",
                "Ethical reasoning ability grows by 7.5% annually during university years",
                "Courage is the least developed character strength among first-year students"
            ],
            normativeData: {
                mean: 63.8,
                sd: 14.5,
                interpretation: "Nilai kejujuran (Integrity) relatif tinggi, namun keberanian sosial perlu ditingkatkan"
            },
            psychometricProperties: {
                alpha: "0.84",
                cfi: "0.94",
                rmsea: "0.05",
                tli: "0.93",
                itemCount: 8
            }
        },
        assessmentData: {
            items: CHARACTER_ASSESSMENT_ITEMS,
            weights: CHARACTER_WEIGHTS,
            norms: CHARACTER_NORMS,
            interpretation: CHARACTER_INTERPRETATION
        }
    },
    {
        id: 8,
        slug: "spiritual",
        title: "Spiritualitas",
        tagline: "Meaning, Purpose & Ikigai",
        description: "Pencarian makna hidup, rasa syukur, dan koneksi dengan tujuan yang lebih besar.",
        longDescription: "Temukan 'Why' Anda. Kembangkan kehidupan spiritual yang bermakna, rasa syukur, dan kesadaran akan tujuan hidup yang melampaui pencapaian materi semata (Self-Transcendence).",
        stat: "Multicultural Validity",
        icon: "volunteer_activism",
        type: "soft",
        link: "/dimension/spiritual",
        assessmentLink: "/spiritual-assessment",
        color: "its-gold",
        modules: ["Discovering Purpose (Ikigai)", "Gratitude Journaling", "Spiritual Wellness"],
        progress: 0,
        research: {
            reliability: 0.85,
            validity: "CFI = 0.94 (Excellent)",
            sampleSize: 2000,
            keyFindings: [
                "Purpose clarity is the strongest predictor of life satisfaction (r=0.52)",
                "Gratitude interventions improve student well-being by ~22%",
                "Spiritual well-being correlates negatively with substance abuse"
            ],
            normativeData: {
                mean: 58.5,
                sd: 14.5,
                interpretation: "Pencarian makna (Search for Meaning) memuncak di usia mahasiswa"
            },
            psychometricProperties: {
                alpha: "0.85",
                cfi: "0.94",
                rmsea: "0.05",
                tli: "0.93",
                itemCount: 8
            }
        },
        assessmentData: {
            items: SPIRITUAL_ASSESSMENT_ITEMS,
            weights: SPIRITUAL_WEIGHTS,
            norms: SPIRITUAL_NORMS,
            interpretation: SPIRITUAL_INTERPRETATION
        }
    },
    {
        id: 9,
        slug: "environmental",
        title: "Lingkungan & Gaya Hidup",
        tagline: "Sustainability & Digital Wellbeing",
        description: "Kesadaran lingkungan, gaya hidup berkelanjutan, dan keseimbangan digital.",
        longDescription: "Hidup harmonis dengan lingkungan dan teknologi. Praktikkan gaya hidup ramah lingkungan, digital minimalism, dan kontribusi positif terhadap keberlanjutan bumi.",
        stat: "Validated vs NEP Scale",
        icon: "eco",
        type: "hard",
        link: "/dimension/environmental",
        assessmentLink: "/environmental-assessment",
        color: "brand-blue",
        modules: ["Sustainable Living 101", "Digital Detox Strategy", "Carbon Footprint Reduction"],
        progress: 0,
        research: {
            reliability: 0.83,
            validity: "CFI = 0.91 (Strong)",
            sampleSize: 2000,
            keyFindings: [
                "Environmental identity predicts pro-environmental behavior (r=0.45)",
                "Digital wellbeing strongly correlates with attention span and focus",
                "Work-life balance is a key challenge for 40% of active students"
            ],
            normativeData: {
                mean: 54.2,
                sd: 14.8,
                interpretation: "Kesadaran lingkungan tinggi, namun gap dengan perilaku nyata masih ada"
            },
            psychometricProperties: {
                alpha: "0.83",
                cfi: "0.91",
                rmsea: "0.06",
                tli: "0.90",
                itemCount: 8
            }
        },
        assessmentData: {
            items: ENVIRONMENTAL_ASSESSMENT_ITEMS,
            weights: ENVIRONMENTAL_WEIGHTS,
            norms: ENVIRONMENTAL_NORMS,
            interpretation: ENVIRONMENTAL_INTERPRETATION
        }
    }
];
