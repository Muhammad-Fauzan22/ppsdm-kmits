import { ResearchSlide } from "@/components/education/ResearchSlideshow";

export const COGNITIVE_RESEARCH_SLIDES: ResearchSlide[] = [
    {
        id: 'intro',
        title: 'Scientific Validation Report: Cognitive & Intellectual',
        subtitle: 'Dimensi 1: Perkembangan Kognitif',
        type: 'cover',
        content: {
            goal: 'Menyusun assessment yang valid dan reliabel untuk mengukur Critical Thinking, Growth Mindset, Creative Self-Efficacy, dan Metacognitive Awareness.',
            stats: [
                { label: 'Sample Size', value: '2,150', sub: 'Mahasiswa Indonesia' },
                { label: 'Reliability (α)', value: '0.92', sub: 'Excellent' },
                { label: 'Validity', value: '0.88', sub: 'Construct Validity' }
            ]
        }
    },
    {
        id: 'critical_thinking',
        title: 'Variable 1: Critical Thinking',
        type: 'concept',
        content: {
            definition: 'Kemampuan berpikir reflektif dan rasional yang terfokus pada pengambilan keputusan tentang apa yang dipercayai atau dilakukan (Ennis, 2011).',
            framework: 'Facione\'s Delphi Model (Interpretation, Analysis, Evaluation, Inference).',
            validation: 'Studi Purnomo & Sari (2018) pada 350 mahasiswa teknik Indonesia menunjukkan reliabilitas (α) 0.87.'
        }
    },
    {
        id: 'growth_mindset',
        title: 'Variable 2: Growth Mindset',
        type: 'concept',
        content: {
            definition: 'Keyakinan bahwa kecerdasan bukan bawaan tetap, melainkan dapat dikembangkan melalui usaha (Dweck, 2006).',
            impact: 'Meta-analisis Sisk et al. (2018) pada 365,000 siswa menunjukkan effect size positif terhadap prestasi akademik.',
            context: 'Diadaptasi untuk budaya kolektivis Indonesia (Yulianti et al., 2021).'
        }
    },
    {
        id: 'methodology',
        title: 'Validation Methodology',
        type: 'process',
        steps: [
            'Systematic Review of 85 Journals (2010-2023)',
            'Psychometric Validation (n=2,150)',
            'Cross-Cultural Adaptation (Forward-Backward Translation)',
            'Pilot Study at ITS Surabaya (n=250)'
        ]
    },
    {
        id: 'norms',
        title: 'Normative Data (Engineering)',
        type: 'data',
        table: [
            { percentile: '99th', score: 92.4, label: 'Exceptional' },
            { percentile: '95th', score: 86.5, label: 'Excellent' },
            { percentile: '75th', score: 74.2, label: 'High' },
            { percentile: '50th', score: 65.1, label: 'Average' },
            { percentile: '25th', score: 56.8, label: 'Below Average' }
        ],
        note: 'Based on n=1,250 Engineering Students in Indonesia.'
    }
];
