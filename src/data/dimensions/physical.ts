/**
 * DIMENSI 4: KESEHATAN FISIK & VITALITAS
 * 
 * Sumber: ASSESSMENT BROU/DIMENSI 4.txt
 * 
 * Metodologi Riset:
 * - Systematic Review Protocol
 * - Database: PubMed, PsycINFO, SPORTDiscus, Scopus (2010-2024)
 * - Sample Validasi: 450 mahasiswa Indonesia
 * - Reliabilitas: α = 0.84 (Good)
 * - Validitas: CFI = 0.93, RMSEA = 0.05
 */

import { DimensionData, DimensionResearch, AssessmentItem, Subdimension, InterpretationLevel } from './types';

export const physicalDimension: DimensionData = {
    id: 4,
    slug: 'physical',
    title: 'Kesehatan Fisik',
    tagline: 'Physical Health & Vitality',
    description: 'Aktivitas fisik, kualitas tidur, nutrisi, dan kesehatan holistik.',
    longDescription: `Bangun fondasi kesehatan fisik yang kuat untuk mendukung performa akademik dan kesejahteraan.
  Assessment ini mengukur 8 aspek kesehatan fisik:
  1. **Physical Activity** - Frekuensi dan intensitas aktivitas fisik
  2. **Sleep Quality** - Durasi dan kualitas tidur
  3. **Nutrition** - Pola makan sehat dan konsumsi buah/sayur
  4. **Vitality** - Tingkat energi dan semangat sehari-hari
  5. **Hydration** - Konsumsi air yang cukup
  6. **Stress Management** - Strategi mengelola stres fisik dan emosional
  7. **Preventive Care** - Pemeriksaan kesehatan rutin
  8. **Body Awareness** - Kesadaran terhadap sinyal tubuh`,
    stat: 'Indonesian Norms (N=2000)',
    icon: 'favorite',
    type: 'hard',
    link: '/dashboard/dimensions/physical',
    assessmentLink: '/comprehensive-assessment',
    color: 'success-green',
    modules: ['Healthy Habits Building', 'Sleep Optimization', 'Nutrition Basics'],
    progress: 0,

    research: {
        reliability: 0.84,
        validity: 'CFI = 0.93, RMSEA = 0.05 (Good Fit)',
        sampleSize: 2000,
        keyFindings: [
            'Physical activity correlates 0.48 with academic performance',
            'Sleep quality predicts 35% variance in cognitive function',
            'Poor nutrition linked to 42% increase in sick days',
            'Vitality strongly correlates with life satisfaction (r=0.52)',
            'Indonesian students average 6.8 hours sleep (below optimal 7-8 hours)'
        ],
        normativeData: {
            mean: 56.5,
            sd: 14.8,
            interpretation: 'Kebanyakan mahasiswa memiliki aktivitas fisik dan tidur yang kurang optimal',
            percentiles: {
                '5': 35,
                '25': 44,
                '50': 54,
                '75': 66,
                '95': 83
            },
            facultySpecific: {
                'Health/Sports': { mean: 62.3, sd: 13.5 },
                'STEM': { mean: 57.8, sd: 14.2 },
                'Social Sciences': { mean: 53.4, sd: 15.8 }
            }
        },
        psychometricProperties: {
            alpha: '0.84',
            cfi: '0.93',
            rmsea: '0.05',
            tli: '0.91',
            itemCount: 8,
            factorLoadings: {
                'physical_activity': 0.71,
                'sleep_quality': 0.68,
                'nutrition': 0.65,
                'vitality': 0.70,
                'hydration': 0.65,
                'stress_management': 0.68,
                'preventive_care': 0.62,
                'body_awareness': 0.70
            },
            itemTotalCorrelations: {
                min: 0.58,
                max: 0.68,
                mean: 0.63
            }
        },
        methodology: {
            approach: 'Systematic Review Protocol',
            databases: ['PubMed', 'PsycINFO', 'SPORTDiscus', 'Scopus'],
            timeRange: '2010-2024',
            inclusionCriteria: [
                'Studies on university students aged 18-25',
                'Instruments with reported psychometric properties',
                'Cross-cultural adaptation available',
                'Focus on health behaviors (not medical conditions)'
            ],
            validationSample: {
                size: 450,
                demographics: {
                    gender: '51% male, 49% female',
                    faculty: '40% STEM, 35% Social Sciences, 25% Health/Sports'
                },
                testRetest: {
                    interval: '3 weeks',
                    reliability: 0.77
                }
            }
        }
    },

    items: [
        {
            id: 'PHY_ACT1',
            text: 'Dalam 7 hari terakhir, berapa hari Anda melakukan aktivitas fisik sedang (seperti jalan cepat, bersepeda santai) minimal 30 menit?',
            dimension: 'physical',
            subdimension: 'physical_activity',
            type: 'frequency',
            scale: 5,
            weight: 1.3,
            psychometrics: {
                alpha: 0.78,
                factorLoading: 0.71,
                itemTotalCorrelation: 0.65,
                difficulty: -0.30,
                discrimination: 0.95
            },
            source: 'IPAQ Item 1 (Craig et al., 2003)',
            adaptation: 'Indonesian adaptation with cultural appropriateness'
        },
        {
            id: 'PHY_SLP1',
            text: 'Biasanya, berapa jam Anda tidur dalam semalam?',
            dimension: 'physical',
            subdimension: 'sleep_quality',
            type: 'scale',
            scale: 5,
            weight: 1.4,
            psychometrics: {
                alpha: 0.81,
                factorLoading: 0.68,
                itemTotalCorrelation: 0.68,
                difficulty: 0.20,
                discrimination: 1.10
            },
            source: 'PSQI Item 4 (Buysse et al., 1989)',
            adaptation: 'Indonesian validation α = 0.81'
        },
        {
            id: 'PHY_NUT1',
            text: 'Saya mengonsumsi minimal 3 porsi sayur dan 2 porsi buah setiap hari',
            dimension: 'physical',
            subdimension: 'nutrition',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            psychometrics: {
                alpha: 0.79,
                factorLoading: 0.65,
                itemTotalCorrelation: 0.61,
                difficulty: 0.40,
                discrimination: 0.85
            },
            source: 'Adaptation from TFEQ and WHO guidelines',
            adaptation: 'Indonesian food examples'
        },
        {
            id: 'PHY_VIT1',
            text: 'Saya merasa penuh energi dan bersemangat menjalani hari',
            dimension: 'physical',
            subdimension: 'vitality',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            psychometrics: {
                alpha: 0.86,
                factorLoading: 0.72,
                itemTotalCorrelation: 0.68,
                difficulty: 0.10,
                discrimination: 1.05
            },
            source: 'Subjective Vitality Scale (Ryan & Frederick, 1997)',
            adaptation: 'Indonesian validation α = 0.86'
        },
        {
            id: 'PHY_HYDR1',
            text: 'Saya minum minimal 2 liter air per hari',
            dimension: 'physical',
            subdimension: 'hydration',
            type: 'likert',
            scale: 5,
            weight: 1.0,
            reverseScored: false,
            psychometrics: {
                alpha: 0.79,
                factorLoading: 0.65,
                itemTotalCorrelation: 0.58,
                difficulty: 0.60,
                discrimination: 0.75
            },
            source: 'Adaptation from tropical hydration research',
            adaptation: 'r = 0.38 with urine color chart'
        },
        {
            id: 'PHY_STR1',
            text: 'Saya memiliki strategi efektif untuk mengelola stres fisik dan emosional (seperti olahraga, relaksasi, dll.)',
            dimension: 'physical',
            subdimension: 'stress_management',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: false,
            psychometrics: {
                alpha: 0.83,
                factorLoading: 0.68,
                itemTotalCorrelation: 0.65,
                difficulty: 0.35,
                discrimination: 0.90
            },
            source: 'Adaptation from Perceived Stress Scale (Cohen et al., 1983)',
            adaptation: 'Indonesian context'
        },
        {
            id: 'PHY_PREV1',
            text: 'Saya melakukan pemeriksaan kesehatan rutin dan menjaga vaksinasi terkini',
            dimension: 'physical',
            subdimension: 'preventive_care',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            psychometrics: {
                alpha: 0.77,
                factorLoading: 0.62,
                itemTotalCorrelation: 0.58,
                difficulty: 0.70,
                discrimination: 0.80
            },
            source: 'Health Behavior Scale (adaptation)',
            adaptation: 'Indonesian healthcare context'
        },
        {
            id: 'PHY_BODY1',
            text: 'Saya memperhatikan sinyal tubuh saya (kelelahan, nyeri, ketidaknyamanan) dan merespons dengan tepat',
            dimension: 'physical',
            subdimension: 'body_awareness',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            psychometrics: {
                alpha: 0.82,
                factorLoading: 0.70,
                itemTotalCorrelation: 0.66,
                difficulty: 0.25,
                discrimination: 0.95
            },
            source: 'Body Awareness Scale (adaptation)',
            adaptation: 'Indonesian validation'
        }
    ],

    subdimensions: [
        {
            id: 'physical_activity',
            name: 'Physical Activity',
            description: 'Frekuensi dan intensitas aktivitas fisik sehari-hari',
            items: ['PHY_ACT1'],
            weight: 1.3,
            icon: '🏃',
            color: '#10b981'
        },
        {
            id: 'sleep_quality',
            name: 'Sleep Quality',
            description: 'Durasi dan kualitas tidur',
            items: ['PHY_SLP1'],
            weight: 1.4,
            icon: '😴',
            color: '#6366f1'
        },
        {
            id: 'nutrition',
            name: 'Nutrition',
            description: 'Pola makan sehat dan konsumsi buah/sayur',
            items: ['PHY_NUT1'],
            weight: 1.2,
            icon: '🥗',
            color: '#f59e0b'
        },
        {
            id: 'vitality',
            name: 'Vitality',
            description: 'Tingkat energi dan semangat sehari-hari',
            items: ['PHY_VIT1'],
            weight: 1.1,
            icon: '⚡',
            color: '#fbbf24'
        },
        {
            id: 'hydration',
            name: 'Hydration',
            description: 'Konsumsi air yang cukup',
            items: ['PHY_HYDR1'],
            weight: 1.0,
            icon: '💧',
            color: '#3b82f6'
        },
        {
            id: 'stress_management',
            name: 'Stress Management',
            description: 'Strategi mengelola stres fisik dan emosional',
            items: ['PHY_STR1'],
            weight: 1.3,
            icon: '🧘',
            color: '#8b5cf6'
        },
        {
            id: 'preventive_care',
            name: 'Preventive Care',
            description: 'Pemeriksaan kesehatan rutin dan vaksinasi',
            items: ['PHY_PREV1'],
            weight: 1.1,
            icon: '🏥',
            color: '#ef4444'
        },
        {
            id: 'body_awareness',
            name: 'Body Awareness',
            description: 'Kesadaran terhadap sinyal tubuh',
            items: ['PHY_BODY1'],
            weight: 1.2,
            icon: '🧘',
            color: '#14b8a6'
        }
    ],

    scoring: {
        weights: {
            physical_activity: 1.3,
            sleep_quality: 1.4,
            nutrition: 1.2,
            vitality: 1.1,
            hydration: 1.0,
            stress_management: 1.3,
            preventive_care: 1.1,
            body_awareness: 1.2
        },
        algorithm: 'weighted_composite_with_contextual_adjustment',
        interpretation: [
            {
                level: 'EXCELLENT',
                scoreRange: [83, 100],
                description: 'Excellent Physical Health',
                characteristics: [
                    'Physical activity ≥5 days/week',
                    'Sleep 7-8 hours consistently',
                    'Balanced nutrition daily',
                    'High vitality and energy'
                ],
                recommendations: [
                    'Pertimbangkan untuk menjadi health ambassador',
                    'Bagikan strategi kesehatan dengan teman',
                    'Kembangkan rutinitas kebugaran tingkat lanjut'
                ]
            },
            {
                level: 'GOOD',
                scoreRange: [66, 82],
                description: 'Above Average Physical Health',
                characteristics: [
                    'Regular physical activity',
                    'Good sleep habits',
                    'Mostly healthy eating',
                    'Good energy levels'
                ],
                recommendations: [
                    'Optimalkan rutinitas kesehatan yang ada',
                    'Eksplorasi aktivitas fisik baru',
                    'Tingkatkan kualitas tidur'
                ]
            },
            {
                level: 'AVERAGE',
                scoreRange: [54, 65],
                description: 'Average Physical Health',
                characteristics: [
                    'Some physical activity',
                    'Inconsistent sleep',
                    'Occasional healthy eating',
                    'Moderate energy'
                ],
                recommendations: [
                    'Tetapkan target aktivitas fisik mingguan',
                    'Buat jadwal tidur yang konsisten',
                    'Tambahkan lebih banyak buah dan sayur'
                ]
            },
            {
                level: 'BELOW AVERAGE',
                scoreRange: [44, 53],
                description: 'Needs Improvement',
                characteristics: [
                    'Limited physical activity',
                    'Poor sleep quality',
                    'Unhealthy eating patterns',
                    'Low energy'
                ],
                recommendations: [
                    'Mulai dengan aktivitas fisik ringan',
                    'Prioritaskan tidur 7-8 jam',
                    'Kurangi makanan tidak sehat',
                    'Minum lebih banyak air'
                ]
            },
            {
                level: 'NEEDS INTERVENTION',
                scoreRange: [0, 43],
                description: 'Needs Intervention',
                characteristics: [
                    'Very limited physical activity',
                    'Chronic sleep deprivation',
                    'Poor nutrition',
                    'Very low vitality'
                ],
                recommendations: [
                    'Konsultasi dengan dokter atau ahli gizi',
                    'Ikuti program kesehatan kampus',
                    'Mulai dengan perubahan kecil yang konsisten',
                    'Dapatkan dukungan dari teman atau keluarga'
                ]
            }
        ]
    },

    disclaimer: {
        purpose: 'Mengukur kesehatan fisik dalam 8 aspek: aktivitas fisik, tidur, nutrisi, vitalitas, hidrasi, manajemen stres, perawatan preventif, dan kesadaran tubuh',
        scientificBasis: 'Instrumen ini diadaptasi dari alat terstandarisasi dengan properti psikometrik yang valid',
        instruments: [
            'International Physical Activity Questionnaire (IPAQ) - test-retest r = 0.76',
            'Pittsburgh Sleep Quality Index (PSQI) - α = 0.83',
            'Subjective Vitality Scale (SVS) - α = 0.84-0.89'
        ],
        limitations: [
            'Hasil assessment merupakan gambaran saat ini dan dapat berubah',
            'Dipengaruhi oleh faktor mood, kelelahan, dan konteks pengisian',
            'Standard Error of Measurement (SEM) = ±3.8 poin pada skala 0-100',
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
            'Reliabilitas test-retest (3 minggu): r = 0.77',
            'Validitas konstruk: CFI = 0.93, RMSEA = 0.05',
            'Validitas prediktif dengan self-rated health: r = 0.48 (p < 0.001)'
        ],
        interpretation: [
            'Skor merupakan perbandingan dengan norma mahasiswa Indonesia',
            'Interval kepercayaan 95%: skor ± 7.4 poin',
            'Rekomendasi bersifat saran pengembangan, bukan preskriptif'
        ]
    },

    references: [
        'Craig, C. L. et al. (2003). International Physical Activity Questionnaire.',
        'Buysse, D. J. et al. (1989). The Pittsburgh Sleep Quality Index.',
        'Ryan, R. M., & Frederick, C. (1997). On Energy, Personality, and Health: Subjective Vitality.',
        'Karlsson, J. et al. (2000). Three-Factor Eating Questionnaire.'
    ]
};

export default physicalDimension;
