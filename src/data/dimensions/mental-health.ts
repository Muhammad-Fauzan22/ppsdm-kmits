/**
 * DIMENSI 6: KESEHATAN MENTAL & PSIKOLOGIS
 * 
 * Sumber: ASSESSMENT BROU/DIMENSI 6.txt
 * 
 * Metodologi Riset:
 * - Systematic Review Protocol
 * - Database: PsycINFO, PubMed, Scopus, Google Scholar (2010-2024)
 * - Sample Validasi: 450 mahasiswa Indonesia
 * - Reliabilitas: α = 0.86 (Good)
 * - Validitas: CFI = 0.93, RMSEA = 0.05
 */

import { DimensionData, DimensionResearch, AssessmentItem, Subdimension, InterpretationLevel } from './types';

export const mentalHealthDimension: DimensionData = {
    id: 6,
    slug: 'mental-health',
    title: 'Kesehatan Mental',
    tagline: 'Mental Wellbeing & Resilience',
    description: 'Kesejahteraan mental, resiliensi, manajemen stres, dan kesadaran diri.',
    longDescription: `Bangun ketahanan mental dan kesejahteraan psikologis untuk menghadapi tantangan 
  akademik dan kehidupan dengan seimbang. Assessment ini mengukur 8 aspek kesehatan mental:
  1. **Well-being** - Kebahagiaan dan kepuasan hidup
  2. **Resilience** - Kemampuan beradaptasi dengan kesulitan
  3. **Stress Management** - Kemampuan mengelola stres
  4. **Mindfulness** - Kesadaran penuh terhadap pengalaman
  5. **Trauma Healing** - Kemampuan mengelola pengalaman masa lalu
  6. **Academic Stress Management** - Manajemen stres akademik
  7. **Coping Strategies** - Strategi mengatasi kesulitan
  8. **Help-seeking Behavior** - Keterbukaan mencari bantuan`,
    stat: 'Indonesian Norms (N=2000)',
    icon: 'self_improvement',
    type: 'soft',
    link: '/dashboard/dimensions/mental-health',
    assessmentLink: '/comprehensive-assessment',
    color: 'info-cyan',
    modules: ['Mental Health 101', 'Stress Management Workshop', 'Mindfulness Practice'],
    progress: 0,

    research: {
        reliability: 0.86,
        validity: 'CFI = 0.93, RMSEA = 0.05 (Good Fit)',
        sampleSize: 2000,
        keyFindings: [
            'Mental wellbeing predicts 48% variance in life satisfaction',
            'Resilience mediates relationship between stress and academic performance',
            'Help-seeking behavior correlates 0.38 with GPA',
            'Only 32% of students feel comfortable seeking professional help',
            'Academic stress is the primary mental health concern for Indonesian students'
        ],
        normativeData: {
            mean: 57.1,
            sd: 14.8,
            interpretation: 'Kesehatan mental mahasiswa Indonesia memadai namun perlu peningkatan dalam help-seeking behavior',
            percentiles: {
                '5': 35,
                '25': 44,
                '50': 54,
                '75': 66,
                '95': 85
            },
            facultyNorms: {
                'Health Sciences': { mean: 60.2, sd: 13.5 },
                'STEM': { mean: 57.8, sd: 14.2 },
                'Social Sciences': { mean: 54.4, sd: 15.8 }
            }
        },
        psychometricProperties: {
            alpha: '0.86',
            cfi: '0.93',
            rmsea: '0.05',
            tli: '0.91',
            itemCount: 8,
            factorLoadings: {
                'well_being': 0.72,
                'resilience': 0.68,
                'stress_management': 0.75,
                'mindfulness': 0.70,
                'trauma_healing': 0.65,
                'academic_stress_management': 0.70,
                'coping_strategies': 0.68,
                'help_seeking_behavior': 0.62
            },
            itemTotalCorrelations: {
                min: 0.57,
                max: 0.72,
                mean: 0.65
            }
        },
        methodology: {
            approach: 'Systematic Review Protocol',
            databases: ['PsycINFO', 'PubMed', 'Scopus', 'Google Scholar'],
            timeRange: '2010-2024',
            inclusionCriteria: [
                'Studies on university students aged 18-25',
                'Instruments with reported psychometric properties',
                'Cultural adaptation available',
                'Focus on positive psychology and mental wellbeing'
            ],
            validationSample: {
                size: 450,
                demographics: {
                    gender: '49% male, 51% female',
                    faculty: '45% STEM, 40% Social Sciences, 15% Health Sciences'
                },
                testRetest: {
                    interval: '3 weeks',
                    reliability: 0.79
                }
            }
        }
    },

    items: [
        {
            id: 'MH_WB1',
            text: 'Dalam sebulan terakhir, seberapa sering Anda merasa bahagia?',
            dimension: 'mental-health',
            subdimension: 'well_being',
            type: 'frequency',
            scale: 5,
            weight: 1.2,
            format: 'Frequency Scale (1-5)',
            psychometrics: {
                alpha: 0.87,
                factorLoading: 0.72,
                itemTotalCorrelation: 0.65,
                difficulty: -0.20,
                discrimination: 1.05
            },
            source: 'MHC-SF Item 1 (Keyes, 2009)',
            adaptation: 'Indonesian adaptation with CVI = 0.90'
        },
        {
            id: 'MH_RES1',
            text: 'Saya dapat beradaptasi dengan baik ketika menghadapi perubahan atau kesulitan',
            dimension: 'mental-health',
            subdimension: 'resilience',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: false,
            format: 'Likert Scale (1-5)',
            psychometrics: {
                alpha: 0.88,
                factorLoading: 0.70,
                itemTotalCorrelation: 0.66,
                difficulty: 0.15,
                discrimination: 0.98
            },
            source: 'CD-RISC-10 Item 2 (Connor & Davidson, 2003)',
            adaptation: 'Indonesian validation α = 0.88'
        },
        {
            id: 'MH_STR1',
            text: 'Dalam sebulan terakhir, seberapa sering Anda merasa tidak mampu mengatasi semua hal yang harus Anda lakukan?',
            dimension: 'mental-health',
            subdimension: 'stress_management',
            type: 'frequency',
            scale: 5,
            weight: 1.4,
            reverseScored: true,
            format: 'Frequency Scale (1-5)',
            psychometrics: {
                alpha: 0.75,
                factorLoading: 0.75,
                itemTotalCorrelation: 0.68,
                difficulty: 0.30,
                discrimination: 1.15
            },
            source: 'PSS-4 Item 1 (Cohen et al., 1983)',
            adaptation: 'Indonesian adaptation α = 0.75'
        },
        {
            id: 'MH_MIND1',
            text: 'Saya mengalami peristiwa dengan penuh kesadaran, tanpa terdistraksi atau "autopilot"',
            dimension: 'mental-health',
            subdimension: 'mindfulness',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            format: 'Likert Scale (1-5)',
            psychometrics: {
                alpha: 0.83,
                factorLoading: 0.65,
                itemTotalCorrelation: 0.62,
                difficulty: 0.25,
                discrimination: 0.92
            },
            source: 'MAAS Item 4 (Brown & Ryan, 2003)',
            adaptation: 'Indonesian validation α = 0.83'
        },
        {
            id: 'MH_TRA1',
            text: 'Saya dapat mengelola emosi dan kenangan masa lalu yang sulit dengan cara yang sehat',
            dimension: 'mental-health',
            subdimension: 'trauma_healing',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            format: 'Likert Scale (1-5)',
            psychometrics: {
                alpha: 0.80,
                factorLoading: 0.64,
                itemTotalCorrelation: 0.61,
                difficulty: 0.40,
                discrimination: 0.85
            },
            source: 'Inner Child Healing Scale (adaptation)',
            adaptation: 'CVI = 0.88 (3 clinical psychologists)'
        },
        {
            id: 'MH_ACAD1',
            text: 'Beban akademik (tugas, ujian, proyek) sering membuat saya merasa kewalahan',
            dimension: 'mental-health',
            subdimension: 'academic_stress_management',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: true,
            format: 'Likert Scale (1-5)',
            psychometrics: {
                alpha: 0.78,
                factorLoading: 0.70,
                itemTotalCorrelation: 0.60,
                difficulty: 0.35,
                discrimination: 0.95
            },
            source: 'Academic Stress Scale for Indonesian Students',
            adaptation: 'Indonesian context'
        },
        {
            id: 'MH_COP1',
            text: 'Saya memiliki strategi yang efektif untuk mengatasi kesulitan atau masalah',
            dimension: 'mental-health',
            subdimension: 'coping_strategies',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            format: 'Likert Scale (1-5)',
            psychometrics: {
                alpha: 0.81,
                factorLoading: 0.68,
                itemTotalCorrelation: 0.63,
                difficulty: 0.20,
                discrimination: 0.95
            },
            source: 'Adapted from Brief COPE Inventory',
            adaptation: 'Indonesian validation'
        },
        {
            id: 'MH_SEEK1',
            text: 'Saya merasa nyaman mencari bantuan profesional (konselor, psikolog) ketika mengalami kesulitan emosional',
            dimension: 'mental-health',
            subdimension: 'help_seeking_behavior',
            type: 'likert',
            scale: 5,
            weight: 1.0,
            reverseScored: false,
            format: 'Likert Scale (1-5)',
            psychometrics: {
                alpha: 0.79,
                factorLoading: 0.62,
                itemTotalCorrelation: 0.58,
                difficulty: 0.45,
                discrimination: 0.88
            },
            source: 'Mental Help Seeking Attitudes Scale',
            adaptation: 'Indonesian validation'
        }
    ],

    subdimensions: [
        {
            id: 'well_being',
            name: 'Well-being',
            description: 'Kebahagiaan dan kepuasan hidup',
            items: ['MH_WB1'],
            weight: 1.2,
            icon: '😊',
            color: '#fbbf24'
        },
        {
            id: 'resilience',
            name: 'Resilience',
            description: 'Kemampuan beradaptasi dengan kesulitan',
            items: ['MH_RES1'],
            weight: 1.3,
            icon: '💪',
            color: '#10b981'
        },
        {
            id: 'stress_management',
            name: 'Stress Management',
            description: 'Kemampuan mengelola stres',
            items: ['MH_STR1'],
            weight: 1.4,
            icon: '🧘',
            color: '#f59e0b'
        },
        {
            id: 'mindfulness',
            name: 'Mindfulness',
            description: 'Kesadaran penuh terhadap pengalaman',
            items: ['MH_MIND1'],
            weight: 1.1,
            icon: '🧘',
            color: '#8b5cf6'
        },
        {
            id: 'trauma_healing',
            name: 'Trauma Healing',
            description: 'Kemampuan mengelola pengalaman masa lalu',
            items: ['MH_TRA1'],
            weight: 1.2,
            icon: '💚',
            color: '#14b8a6'
        },
        {
            id: 'academic_stress_management',
            name: 'Academic Stress Management',
            description: 'Manajemen stres akademik',
            items: ['MH_ACAD1'],
            weight: 1.3,
            icon: '📚',
            color: '#6366f1'
        },
        {
            id: 'coping_strategies',
            name: 'Coping Strategies',
            description: 'Strategi mengatasi kesulitan',
            items: ['MH_COP1'],
            weight: 1.1,
            icon: '🛡️',
            color: '#ec4899'
        },
        {
            id: 'help_seeking_behavior',
            name: 'Help-seeking Behavior',
            description: 'Keterbukaan mencari bantuan',
            items: ['MH_SEEK1'],
            weight: 1.0,
            icon: '🤝',
            color: '#3b82f6'
        }
    ],

    scoring: {
        weights: {
            well_being: 1.2,
            resilience: 1.3,
            stress_management: 1.4,
            mindfulness: 1.1,
            trauma_healing: 1.2,
            academic_stress_management: 1.3,
            coping_strategies: 1.1,
            help_seeking_behavior: 1.0
        },
        algorithm: 'weighted_composite_with_contextual_adjustment',
        interpretation: [
            {
                level: 'FLOURISHING',
                scoreRange: [85, 100],
                description: 'Flourishing',
                characteristics: [
                    'High emotional wellbeing',
                    'Strong resilience',
                    'Excellent stress management',
                    'Good coping strategies'
                ],
                recommendations: [
                    'Pertimbangkan untuk menjadi peer counselor',
                    'Bagikan strategi kesehatan mental dengan teman',
                    'Kembangkan program mindfulness untuk komunitas'
                ]
            },
            {
                level: 'GOOD',
                scoreRange: [76, 84],
                description: 'Good Mental Health',
                characteristics: [
                    'Good emotional wellbeing',
                    'Strong resilience',
                    'Good stress management',
                    'Effective coping'
                ],
                recommendations: [
                    'Optimalkan strategi kesehatan mental yang ada',
                    'Eksplorasi teknik mindfulness tingkat lanjut',
                    'Kembangkan rutinitas self-care yang lebih kuat'
                ]
            },
            {
                level: 'MODERATE',
                scoreRange: [66, 75],
                description: 'Moderate Mental Health',
                characteristics: [
                    'Adequate emotional wellbeing',
                    'Moderate resilience',
                    'Some stress management challenges',
                    'Basic coping strategies'
                ],
                recommendations: [
                    'Latih teknik relaksasi',
                    'Bangun sistem dukungan sosial',
                    'Praktikkan mindfulness harian',
                    'Identifikasi dan kelola trigger stres'
                ]
            },
            {
                level: 'LANGUISHING',
                scoreRange: [44, 65],
                description: 'Languishing',
                characteristics: [
                    'Low emotional wellbeing',
                    'Limited resilience',
                    'High stress levels',
                    'Ineffective coping'
                ],
                recommendations: [
                    'Konsultasi dengan konselor kampus',
                    'Ikuti program kesehatan mental',
                    'Praktikkan teknik self-care dasar',
                    'Bangun rutinitas tidur dan olahraga'
                ]
            },
            {
                level: 'STRUGGLING',
                scoreRange: [0, 43],
                description: 'Struggling',
                characteristics: [
                    'Very low emotional wellbeing',
                    'Poor resilience',
                    'Overwhelming stress',
                    'Minimal coping strategies'
                ],
                recommendations: [
                    'Segera konsultasi dengan profesional',
                    'Gunakan layanan krisis jika diperlukan',
                    'Dapatkan dukungan dari keluarga dan teman',
                    'Prioritaskan kesehatan mental di atas segalanya'
                ]
            }
        ]
    },

    disclaimer: {
        purpose: 'Mengukur kesehatan mental dalam 8 aspek: well-being, resilience, stress management, mindfulness, trauma healing, academic stress, coping strategies, dan help-seeking behavior',
        scientificBasis: 'Instrumen ini diadaptasi dari alat terstandarisasi dengan properti psikometrik yang valid',
        instruments: [
            'Mental Health Continuum-Short Form (MHC-SF) - α = 0.89',
            'Connor-Davidson Resilience Scale (CD-RISC-10) - α = 0.85-0.90',
            'Perceived Stress Scale (PSS-4) - α = 0.72-0.78',
            'Mindful Attention Awareness Scale (MAAS) - α = 0.82-0.87'
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
            'Reliabilitas (konsistensi internal): α = 0.86',
            'Reliabilitas test-retest (3 minggu): r = 0.79',
            'Validitas konstruk: CFI = 0.93, RMSEA = 0.05',
            'Validitas prediktif dengan kepuasan hidup: r = 0.48 (p < 0.001)'
        ],
        interpretation: [
            'Skor merupakan perbandingan dengan norma mahasiswa Indonesia',
            'Interval kepercayaan 95%: skor ± 7.1 poin',
            'Rekomendasi bersifat saran pengembangan, bukan preskriptif'
        ]
    },

    references: [
        'Keyes, C. L. M. (2009). The Mental Health Continuum.',
        'Connor, K. M., & Davidson, J. R. T. (2003). Development of a New Resilience Scale.',
        'Cohen, S. et al. (1983). Perceived Stress Scale.',
        'Brown, K. W., & Ryan, R. M. (2003). The Benefits of Being Present.'
    ]
};

export default mentalHealthDimension;
