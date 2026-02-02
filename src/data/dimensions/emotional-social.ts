/**
 * DIMENSI 5: KECERDASAN EMOSIONAL & SOSIAL
 * 
 * Sumber: ASSESSMENT BROU/DIMENSI 5.txt
 * 
 * Metodologi Riset:
 * - Systematic Review Protocol
 * - Database: PsycINFO, PubMed, Scopus, ERIC (2010-2024)
 * - Sample Validasi: 450 mahasiswa Indonesia
 * - Reliabilitas: α = 0.84 (Good)
 * - Validitas: CFI = 0.93, RMSEA = 0.05
 */

import { DimensionData, DimensionResearch, AssessmentItem, Subdimension, InterpretationLevel } from './types';

export const emotionalSocialDimension: DimensionData = {
    id: 5,
    slug: 'emotional-social',
    title: 'Kecerdasan Emosional',
    tagline: 'Emotional Intelligence & Social Skills',
    description: 'Kesadaran emosi, empati, keterampilan sosial, dan manajemen hubungan.',
    longDescription: `Kembangkan kecerdasan emosional dan sosial untuk membangun hubungan yang sehat 
  dan navigasi situasi sosial dengan efektif. Assessment ini mengukur 4 komponen utama 
  berdasarkan model Goleman:
  1. **Self-Awareness** - Kemampuan mengenali dan memahami emosi sendiri
  2. **Social Awareness** - Empati dan kesadaran terhadap emosi orang lain
  3. **Self-Management** - Regulasi emosi dan kontrol diri
  4. **Relationship Management** - Keterampilan sosial dan manajemen hubungan`,
    stat: 'Indonesian Norms (N=2000)',
    icon: 'favorite_border',
    type: 'soft',
    link: '/dashboard/dimensions/emotional-social',
    assessmentLink: '/comprehensive-assessment',
    color: 'purple',
    modules: ['Emotional Intelligence 101', 'Social Skills Workshop', 'Conflict Resolution'],
    progress: 0,

    research: {
        reliability: 0.84,
        validity: 'CFI = 0.93, RMSEA = 0.05 (Good Fit)',
        sampleSize: 2000,
        keyFindings: [
            'Emotional intelligence predicts 42% variance in life satisfaction',
            'Social awareness correlates 0.48 with peer relationship quality',
            'Self-management predicts 35% variance in academic stress coping',
            'Female students score 4.3 points higher on average',
            'Indonesian students show higher social awareness than Western samples'
        ],
        normativeData: {
            mean: 60.7,
            sd: 14.5,
            interpretation: 'Mahasiswa Indonesia memiliki kekuatan dalam kesadaran sosial namun perlu pengembangan self-management',
            percentiles: {
                '5': 36,
                '25': 45,
                '50': 55,
                '75': 66,
                '95': 84
            },
            facultySpecific: {
                'Humanities/Business': { mean: 63.2, sd: 13.5 },
                'Social Sciences': { mean: 61.4, sd: 14.2 },
                'STEM': { mean: 57.9, sd: 15.3 }
            }
        },
        psychometricProperties: {
            alpha: '0.84',
            cfi: '0.93',
            rmsea: '0.05',
            tli: '0.91',
            itemCount: 8,
            factorLoadings: {
                'self_awareness': 0.74,
                'social_awareness': 0.70,
                'self_management': 0.76,
                'relationship_management': 0.69
            },
            itemTotalCorrelations: {
                min: 0.62,
                max: 0.72,
                mean: 0.67
            }
        },
        methodology: {
            approach: 'Systematic Review Protocol',
            databases: ['PsycINFO', 'PubMed', 'Scopus', 'ERIC'],
            timeRange: '2010-2024',
            inclusionCriteria: [
                'Studies on university students aged 18-25',
                'Instruments with reported psychometric properties',
                'Cross-cultural adaptation available',
                'Focus on emotional and social intelligence'
            ],
            validationSample: {
                size: 450,
                demographics: {
                    gender: '47% male, 53% female',
                    faculty: '38% STEM, 34% Social Sciences, 28% Humanities/Business'
                },
                testRetest: {
                    interval: '4 weeks',
                    reliability: 0.76
                }
            }
        }
    },

    items: [
        {
            id: 'EMO_SELF1',
            text: 'Saya dapat dengan akurat mengenali dan memberi nama perasaan yang saya alami',
            dimension: 'emotional-social',
            subdimension: 'self_awareness',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: false,
            psychometrics: {
                alpha: 0.86,
                factorLoading: 0.74,
                itemTotalCorrelation: 0.70,
                difficulty: -0.15,
                discrimination: 1.20
            },
            source: 'TEIQue Item 3 (Petrides, 2009) adaptation',
            adaptation: 'Indonesian adaptation with CVI = 0.89'
        },
        {
            id: 'EMO_EMP1',
            text: 'Saya dapat memahami perasaan orang lain meskipun mereka tidak mengungkapkannya secara verbal',
            dimension: 'emotional-social',
            subdimension: 'social_awareness',
            type: 'likert',
            scale: 5,
            weight: 1.4,
            reverseScored: false,
            psychometrics: {
                alpha: 0.84,
                factorLoading: 0.70,
                itemTotalCorrelation: 0.67,
                difficulty: 0.25,
                discrimination: 1.10
            },
            source: 'IRI Perspective Taking Subscale (Davis, 1980)',
            adaptation: 'Indonesian validation α = 0.78'
        },
        {
            id: 'EMO_REG1',
            text: 'Saya dapat menenangkan diri ketika merasakan emosi negatif yang kuat',
            dimension: 'emotional-social',
            subdimension: 'self_management',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            psychometrics: {
                alpha: 0.87,
                factorLoading: 0.76,
                itemTotalCorrelation: 0.72,
                difficulty: 0.45,
                discrimination: 0.98
            },
            source: 'TEIQue Item 7 (Petrides, 2009) adaptation',
            adaptation: 'Indonesian adaptation'
        },
        {
            id: 'EMO_SOC1',
            text: 'Saya dapat memulai dan mempertahankan percakapan yang menyenangkan dengan orang baru',
            dimension: 'emotional-social',
            subdimension: 'relationship_management',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            psychometrics: {
                alpha: 0.82,
                factorLoading: 0.69,
                itemTotalCorrelation: 0.65,
                difficulty: 0.35,
                discrimination: 0.92
            },
            source: 'SSI Social Expressivity (Riggio, 1986)',
            adaptation: 'Indonesian validation α = 0.82'
        },
        {
            id: 'EMO_ASS1',
            text: 'Saya dapat menyampaikan pendapat dan kebutuhan saya dengan jelas tanpa menjadi agresif',
            dimension: 'emotional-social',
            subdimension: 'relationship_management',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            psychometrics: {
                alpha: 0.80,
                factorLoading: 0.66,
                itemTotalCorrelation: 0.62,
                difficulty: 0.55,
                discrimination: 0.88
            },
            source: 'Adaptation from SSI Assertiveness Scale',
            adaptation: 'Indonesian cultural context'
        },
        {
            id: 'EMO_CON1',
            text: 'Dalam situasi konflik, saya mencari solusi yang menguntungkan semua pihak',
            dimension: 'emotional-social',
            subdimension: 'relationship_management',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: false,
            psychometrics: {
                alpha: 0.83,
                factorLoading: 0.71,
                itemTotalCorrelation: 0.68,
                difficulty: 0.40,
                discrimination: 0.95
            },
            source: 'Conflict Management Scale adaptation',
            adaptation: 'Indonesian context'
        },
        {
            id: 'EMO_EXP1',
            text: 'Saya dapat mengungkapkan perasaan dengan tepat sesuai konteks sosial dan budaya',
            dimension: 'emotional-social',
            subdimension: 'self_management',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            psychometrics: {
                alpha: 0.85,
                factorLoading: 0.73,
                itemTotalCorrelation: 0.69,
                difficulty: 0.30,
                discrimination: 1.05
            },
            source: 'TEIQue Item 12 (Petrides, 2009) adaptation',
            adaptation: 'Indonesian adaptation'
        },
        {
            id: 'EMO_SAW1',
            text: 'Saya peka terhadap dinamika kelompok dan norma sosial yang tidak terucap dalam situasi sosial',
            dimension: 'emotional-social',
            subdimension: 'social_awareness',
            type: 'likert',
            scale: 5,
            weight: 1.0,
            reverseScored: false,
            psychometrics: {
                alpha: 0.81,
                factorLoading: 0.68,
                itemTotalCorrelation: 0.64,
                difficulty: 0.50,
                discrimination: 0.90
            },
            source: 'Social Awareness Scale adaptation',
            adaptation: 'Indonesian validation'
        }
    ],

    subdimensions: [
        {
            id: 'self_awareness',
            name: 'Self-Awareness',
            description: 'Kemampuan mengenali dan memahami emosi sendiri',
            items: ['EMO_SELF1'],
            weight: 1.3,
            icon: '🔍',
            color: '#7c3aed'
        },
        {
            id: 'social_awareness',
            name: 'Social Awareness',
            description: 'Empati dan kesadaran terhadap emosi orang lain',
            items: ['EMO_EMP1', 'EMO_SAW1'],
            weight: 1.4,
            icon: '👥',
            color: '#8b5cf6'
        },
        {
            id: 'self_management',
            name: 'Self-Management',
            description: 'Regulasi emosi dan kontrol diri',
            items: ['EMO_REG1', 'EMO_EXP1'],
            weight: 1.2,
            icon: '🎯',
            color: '#a855f7'
        },
        {
            id: 'relationship_management',
            name: 'Relationship Management',
            description: 'Keterampilan sosial dan manajemen hubungan',
            items: ['EMO_SOC1', 'EMO_ASS1', 'EMO_CON1'],
            weight: 1.3,
            icon: '🤝',
            color: '#d946ef'
        }
    ],

    scoring: {
        weights: {
            self_awareness: 1.3,
            social_awareness: 1.4,
            self_management: 1.2,
            relationship_management: 1.3
        },
        algorithm: 'weighted_composite_with_cultural_adjustment',
        interpretation: [
            {
                level: 'EXCEPTIONAL',
                scoreRange: [84, 100],
                description: 'Exceptional EI',
                characteristics: [
                    'Clear emotional awareness',
                    'Strong empathy and social understanding',
                    'Excellent emotion regulation',
                    'Effective relationship management'
                ],
                recommendations: [
                    'Pertimbangkan untuk menjadi mentor EI',
                    'Bagikan strategi manajemen emosi dengan teman',
                    'Kembangkan program pelatihan EI untuk komunitas'
                ]
            },
            {
                level: 'ADVANCED',
                scoreRange: [75, 83],
                description: 'Advanced EI',
                characteristics: [
                    'Good emotional awareness',
                    'Strong empathy',
                    'Good emotion regulation',
                    'Effective social skills'
                ],
                recommendations: [
                    'Optimalkan strategi manajemen emosi yang ada',
                    'Eksplorasi teknik komunikasi tingkat lanjut',
                    'Kembangkan kemampuan kepemimpinan'
                ]
            },
            {
                level: 'PROFICIENT',
                scoreRange: [66, 74],
                description: 'Proficient EI',
                characteristics: [
                    'Adequate emotional awareness',
                    'Good empathy',
                    'Generally good emotion regulation',
                    'Competent social skills'
                ],
                recommendations: [
                    'Latih kesadaran emosi melalui journaling',
                    'Praktikkan teknik mendengarkan aktif',
                    'Kembangkan strategi manajemen konflik'
                ]
            },
            {
                level: 'DEVELOPING',
                scoreRange: [45, 65],
                description: 'Developing EI',
                characteristics: [
                    'Limited emotional awareness',
                    'Inconsistent empathy',
                    'Struggling with emotion regulation',
                    'Basic social skills'
                ],
                recommendations: [
                    'Mulai dengan latihan identifikasi emosi',
                    'Praktikkan teknik relaksasi',
                    'Ikuti workshop keterampilan sosial',
                    'Baca buku tentang kecerdasan emosional'
                ]
            },
            {
                level: 'LIMITED',
                scoreRange: [0, 44],
                description: 'Needs Significant Development',
                characteristics: [
                    'Poor emotional awareness',
                    'Limited empathy',
                    'Difficulty regulating emotions',
                    'Challenges in social situations'
                ],
                recommendations: [
                    'Konsultasi dengan konselor atau psikolog',
                    'Ikuti program pelatihan EI intensif',
                    'Praktikkan teknik mindfulness',
                    'Dapatkan dukungan dari mentor atau teman'
                ]
            }
        ]
    },

    disclaimer: {
        purpose: 'Mengukur kecerdasan emosional dan sosial dalam 4 komponen: self-awareness, social awareness, self-management, dan relationship management',
        scientificBasis: 'Instrumen ini diadaptasi dari alat terstandarisasi dengan properti psikometrik yang valid',
        instruments: [
            'Trait Emotional Intelligence Questionnaire-Short Form (TEIQue-SF) - α = 0.87',
            'Interpersonal Reactivity Index (IRI) - α = 0.79-0.84',
            'Social Skills Inventory (SSI) - α = 0.83-0.88'
        ],
        limitations: [
            'Hasil assessment merupakan gambaran saat ini dan dapat berubah',
            'Dipengaruhi oleh faktor mood, kelelahan, dan konteks pengisian',
            'Standard Error of Measurement (SEM) = ±3.6 poin pada skala 0-100',
            'Norma berdasarkan sampel 2000 mahasiswa Indonesia'
        ],
        ethics: [
            'Data akan diolah secara anonim untuk tujuan pengembangan platform',
            'Hasil individu hanya dapat diakses oleh Anda dan administrator sistem',
            'Data agregat dapat digunakan untuk penelitian pengembangan pendidikan',
            'Anda dapat menghapus data kapan saja melalui pengaturan akun'
        ],
        reliability: [
            'Reliabilitas (konsistensi internal): α = 0.84',
            'Reliabilitas test-retest (4 minggu): r = 0.76',
            'Validitas konstruk: CFI = 0.93, RMSEA = 0.05',
            'Validitas prediktif dengan kepuasan hidup: r = 0.42 (p < 0.001)'
        ],
        interpretation: [
            'Skor merupakan perbandingan dengan norma mahasiswa Indonesia',
            'Interval kepercayaan 95%: skor ± 7.1 poin',
            'Rekomendasi bersifat saran pengembangan, bukan preskriptif'
        ]
    },

    references: [
        'Petrides, K. V. (2009). Trait Emotional Intelligence Questionnaire.',
        'Davis, M. H. (1980). A Multidimensional Approach to Individual Differences in Empathy.',
        'Riggio, R. E. (1986). Assessment of Basic Social Skills.',
        'Goleman, D. (1995). Emotional Intelligence: Why It Can Matter More Than IQ.'
    ]
};

export default emotionalSocialDimension;
