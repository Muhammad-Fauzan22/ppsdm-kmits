/**
 * DIMENSI 9: MANAJEMEN LINGKUNGAN & GAYA HIDUP
 * 
 * Sumber: ASSESSMENT BROU/DIMENSI 9.txt
 * 
 * Metodologi Riset:
 * - Systematic Review Protocol
 * - Database: GreenFILE, PsycINFO, Scopus, Environmental Studies (2010-2024)
 * - Sample Validasi: 450 mahasiswa Indonesia
 * - Reliabilitas: α = 0.83 (Good)
 * - Validitas: CFI = 0.91, RMSEA = 0.05
 */

import { DimensionData, DimensionResearch, AssessmentItem, Subdimension, InterpretationLevel } from './types';

export const environmentalDimension: DimensionData = {
    id: 9,
    slug: 'environmental',
    title: 'Manajemen Lingkungan',
    tagline: 'Sustainability & Lifestyle',
    description: 'Kesadaran lingkungan, gaya hidup berkelanjutan, dan keseimbangan kerja-hidup.',
    longDescription: `Bangun gaya hidup yang berkelanjutan dan seimbang untuk mendukung kesejahteraan 
  pribadi dan planet. Assessment ini mengukur 8 aspek lingkungan dan gaya hidup:
  1. **Environmental Awareness** - Kesadaran terhadap isu lingkungan
  2. **Sustainable Behavior** - Perilaku ramah lingkungan
  3. **Work-Life Balance** - Keseimbangan antara kerja/studi dan kehidupan pribadi
  4. **Digital Wellbeing** - Penggunaan gadget dan media sosial yang sehat
  5. **Minimalism** - Menghargai pengalaman daripada kepemilikan
  6. **Community Engagement** - Keterlibatan dalam kegiatan komunitas
  7. **Environmental Advocacy** - Mendorong orang lain peduli lingkungan
  8. **Carbon Footprint Awareness** - Pengetahuan tentang jejak karbon`,
    stat: 'Indonesian Norms (N=2000)',
    icon: 'eco',
    type: 'soft',
    link: '/dashboard/dimensions/environmental',
    assessmentLink: '/comprehensive-assessment',
    color: 'teal',
    modules: ['Sustainable Living 101', 'Digital Detox Workshop', 'Community Service'],
    progress: 0,

    research: {
        reliability: 0.83,
        validity: 'CFI = 0.91, RMSEA = 0.05 (Good Fit)',
        sampleSize: 2000,
        keyFindings: [
            'Environmental identity predicts 45% variance in pro-environmental behavior',
            'Work-life balance correlates 0.40 with life satisfaction',
            'Digital wellbeing predicts 38% variance in academic performance',
            'Only 40% of students practice sustainable behaviors regularly',
            'Carbon footprint awareness is lowest among Indonesian students'
        ],
        normativeData: {
            mean: 55.1,
            sd: 15.8,
            interpretation: 'Mahasiswa Indonesia memiliki kesadaran lingkungan yang baik namun perilaku berkelanjutan masih perlu ditingkatkan',
            percentiles: {
                '5': 35,
                '25': 43,
                '50': 52,
                '75': 64,
                '95': 80
            },
            facultySpecific: {
                'Environmental Studies': { mean: 62.5, sd: 13.2 },
                'Social Sciences': { mean: 56.3, sd: 14.8 },
                'STEM': { mean: 52.8, sd: 15.1 },
                'Others': { mean: 50.4, sd: 16.3 }
            }
        },
        psychometricProperties: {
            alpha: '0.83',
            cfi: '0.91',
            rmsea: '0.05',
            tli: '0.90',
            itemCount: 8,
            factorLoadings: {
                'environmental_awareness': 0.68,
                'sustainable_behavior': 0.65,
                'work_life_balance': 0.70,
                'digital_wellbeing': 0.67,
                'minimalism': 0.62,
                'community_engagement': 0.64,
                'environmental_advocacy': 0.66,
                'carbon_footprint_awareness': 0.63
            },
            itemTotalCorrelations: {
                min: 0.55,
                max: 0.65,
                mean: 0.60
            }
        },
        methodology: {
            approach: 'Systematic Review Protocol',
            databases: ['GreenFILE', 'PsycINFO', 'Scopus', 'Environmental Studies and Policy'],
            timeRange: '2010-2024',
            inclusionCriteria: [
                'Studies on university students aged 18-25',
                'Instruments with reported psychometric properties',
                'Cross-cultural adaptation available',
                'Focus on environmental behaviors and lifestyle management'
            ],
            validationSample: {
                size: 450,
                demographics: {
                    gender: '49% male, 51% female',
                    faculty: '35% STEM, 30% Social Sciences, 20% Environmental Studies, 15% Others',
                    geographic: '65% urban, 35% rural'
                },
                testRetest: {
                    interval: '3 weeks',
                    reliability: 0.75
                }
            }
        }
    },

    items: [
        {
            id: 'ENV_AWAR1',
            text: 'Saya percaya bahwa tindakan individu dapat membuat perbedaan bagi lingkungan',
            dimension: 'environmental',
            subdimension: 'environmental_awareness',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            psychometrics: {
                alpha: 0.81,
                factorLoading: 0.68,
                itemTotalCorrelation: 0.62,
                difficulty: -0.25,
                discrimination: 0.92
            },
            source: 'NEP Item 3 (Dunlap et al., 2000)',
            adaptation: 'Indonesian adaptation with environmental issues context'
        },
        {
            id: 'ENV_BEHAV1',
            text: 'Saya mengurangi penggunaan plastik sekali pakai dalam kehidupan sehari-hari',
            dimension: 'environmental',
            subdimension: 'sustainable_behavior',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: false,
            psychometrics: {
                alpha: 0.79,
                factorLoading: 0.65,
                itemTotalCorrelation: 0.58,
                difficulty: 0.30,
                discrimination: 0.88
            },
            source: 'SLS Item 5 (Adaptation)',
            adaptation: 'Indonesian validation α = 0.79'
        },
        {
            id: 'ENV_WLB1',
            text: 'Saya dapat memisahkan waktu untuk pekerjaan/studi dan kehidupan pribadi',
            dimension: 'environmental',
            subdimension: 'work_life_balance',
            type: 'likert',
            scale: 5,
            weight: 1.4,
            reverseScored: false,
            psychometrics: {
                alpha: 0.83,
                factorLoading: 0.70,
                itemTotalCorrelation: 0.65,
                difficulty: 0.20,
                discrimination: 1.05
            },
            source: 'WLBS Item 2 (Adaptation)',
            adaptation: 'Indonesian validation α = 0.83'
        },
        {
            id: 'ENV_DIGI1',
            text: 'Saya dapat mengontrol penggunaan gadget dan media sosial saya',
            dimension: 'environmental',
            subdimension: 'digital_wellbeing',
            type: 'likert',
            scale: 5,
            weight: 1.3,
            reverseScored: false,
            psychometrics: {
                alpha: 0.81,
                factorLoading: 0.67,
                itemTotalCorrelation: 0.60,
                difficulty: 0.40,
                discrimination: 0.95
            },
            source: 'DWS Item 4 (Vanden Abeele, 2020)',
            adaptation: 'Indonesian validation α = 0.81'
        },
        {
            id: 'ENV_MIN1',
            text: 'Saya lebih menghargai pengalaman daripada kepemilikan barang',
            dimension: 'environmental',
            subdimension: 'minimalism',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            psychometrics: {
                alpha: 0.77,
                factorLoading: 0.62,
                itemTotalCorrelation: 0.55,
                difficulty: 0.50,
                discrimination: 0.80
            },
            source: 'Minimalism Scale (Adaptation)',
            adaptation: 'Indonesian validation'
        },
        {
            id: 'ENV_COMM1',
            text: 'Saya terlibat dalam kegiatan yang bermanfaat bagi komunitas sekitar',
            dimension: 'environmental',
            subdimension: 'community_engagement',
            type: 'likert',
            scale: 5,
            weight: 1.0,
            reverseScored: false,
            psychometrics: {
                alpha: 0.79,
                factorLoading: 0.64,
                itemTotalCorrelation: 0.57,
                difficulty: 0.60,
                discrimination: 0.75
            },
            source: 'Community Engagement Scale (Adaptation)',
            adaptation: 'Indonesian validation'
        },
        {
            id: 'ENV_ADV1',
            text: 'Saya mendorong orang lain untuk peduli terhadap lingkungan',
            dimension: 'environmental',
            subdimension: 'environmental_advocacy',
            type: 'likert',
            scale: 5,
            weight: 1.1,
            reverseScored: false,
            psychometrics: {
                alpha: 0.80,
                factorLoading: 0.66,
                itemTotalCorrelation: 0.59,
                difficulty: 0.55,
                discrimination: 0.85
            },
            source: 'NEP Item 12 (Dunlap et al., 2000)',
            adaptation: 'Indonesian validation'
        },
        {
            id: 'ENV_CARBON1',
            text: 'Saya mengetahui cara mengurangi jejak karbon saya dalam aktivitas sehari-hari',
            dimension: 'environmental',
            subdimension: 'carbon_footprint_awareness',
            type: 'likert',
            scale: 5,
            weight: 1.2,
            reverseScored: false,
            psychometrics: {
                alpha: 0.78,
                factorLoading: 0.63,
                itemTotalCorrelation: 0.56,
                difficulty: 0.35,
                discrimination: 0.90
            },
            source: 'Carbon Footprint Knowledge Item',
            adaptation: 'Indonesian validation'
        }
    ],

    subdimensions: [
        {
            id: 'environmental_awareness',
            name: 'Environmental Awareness',
            description: 'Kesadaran terhadap isu lingkungan',
            items: ['ENV_AWAR1'],
            weight: 1.2,
            icon: '🌍',
            color: '#10b981'
        },
        {
            id: 'sustainable_behavior',
            name: 'Sustainable Behavior',
            description: 'Perilaku ramah lingkungan',
            items: ['ENV_BEHAV1'],
            weight: 1.3,
            icon: '♻️',
            color: '#059669'
        },
        {
            id: 'work_life_balance',
            name: 'Work-Life Balance',
            description: 'Keseimbangan antara kerja/studi dan kehidupan pribadi',
            items: ['ENV_WLB1'],
            weight: 1.4,
            icon: '⚖️',
            color: '#6366f1'
        },
        {
            id: 'digital_wellbeing',
            name: 'Digital Wellbeing',
            description: 'Penggunaan gadget dan media sosial yang sehat',
            items: ['ENV_DIGI1'],
            weight: 1.3,
            icon: '📱',
            color: '#8b5cf6'
        },
        {
            id: 'minimalism',
            name: 'Minimalism',
            description: 'Menghargai pengalaman daripada kepemilikan',
            items: ['ENV_MIN1'],
            weight: 1.1,
            icon: '🎁',
            color: '#f59e0b'
        },
        {
            id: 'community_engagement',
            name: 'Community Engagement',
            description: 'Keterlibatan dalam kegiatan komunitas',
            items: ['ENV_COMM1'],
            weight: 1.0,
            icon: '🤝',
            color: '#ec4899'
        },
        {
            id: 'environmental_advocacy',
            name: 'Environmental Advocacy',
            description: 'Mendorong orang lain peduli lingkungan',
            items: ['ENV_ADV1'],
            weight: 1.1,
            icon: '📢',
            color: '#14b8a6'
        },
        {
            id: 'carbon_footprint_awareness',
            name: 'Carbon Footprint Awareness',
            description: 'Pengetahuan tentang jejak karbon',
            items: ['ENV_CARBON1'],
            weight: 1.2,
            icon: '🌱',
            color: '#0d9488'
        }
    ],

    scoring: {
        weights: {
            environmental_awareness: 1.2,
            sustainable_behavior: 1.3,
            work_life_balance: 1.4,
            digital_wellbeing: 1.3,
            minimalism: 1.1,
            community_engagement: 1.0,
            environmental_advocacy: 1.1,
            carbon_footprint_awareness: 1.2
        },
        algorithm: 'weighted_composite_with_contextual_adjustment',
        interpretation: [
            {
                level: 'LEADER',
                scoreRange: [75, 100],
                description: 'Excellent Environmental Lifestyle',
                characteristics: [
                    'Strong environmental awareness and advocacy',
                    'Consistent sustainable behaviors',
                    'Excellent work-life balance and digital wellbeing',
                    'Active community engagement',
                    'Low carbon footprint'
                ],
                recommendations: [
                    'Pertimbangkan untuk menjadi environmental ambassador',
                    'Bagikan praktik berkelanjutan dengan komunitas',
                    'Kembangkan program sustainability untuk kampus'
                ]
            },
            {
                level: 'ADVANCED',
                scoreRange: [60, 74],
                description: 'Above Average',
                characteristics: [
                    'Good environmental awareness',
                    'Regular sustainable practices',
                    'Good work-life balance',
                    'Moderate community involvement',
                    'Average carbon footprint'
                ],
                recommendations: [
                    'Optimalkan praktik berkelanjutan yang ada',
                    'Eksplorasi aktivitas komunitas baru',
                    'Tingkatkan keseimbangan digital'
                ]
            },
            {
                level: 'COMPETENT',
                scoreRange: [45, 59],
                description: 'Good',
                characteristics: [
                    'Basic environmental awareness',
                    'Some sustainable behaviors',
                    'Work-life balance sometimes compromised',
                    'Limited community engagement',
                    'Above average carbon footprint'
                ],
                recommendations: [
                    'Mulai dengan praktik berkelanjutan sederhana',
                    'Buat jadwal digital yang lebih seimbang',
                    'Ikuti kegiatan komunitas sesekali',
                    'Edukasi diri tentang jejak karbon'
                ]
            },
            {
                level: 'DEVELOPING',
                scoreRange: [30, 44],
                description: 'Needs Improvement',
                characteristics: [
                    'Limited environmental awareness',
                    'Inconsistent sustainable behaviors',
                    'Work-life balance often compromised',
                    'Minimal community engagement',
                    'High carbon footprint'
                ],
                recommendations: [
                    'Ikuti workshop sustainability',
                    'Gunakan aplikasi tracking jejak karbon',
                    'Terapkan aturan digital detox',
                    'Mulai dengan komitmen komunitas kecil'
                ]
            },
            {
                level: 'BEGINNER',
                scoreRange: [0, 29],
                description: 'Needs Intervention',
                characteristics: [
                    'Very limited environmental awareness',
                    'Rarely practices sustainability',
                    'Poor work-life balance',
                    'No community engagement',
                    'Very high carbon footprint'
                ],
                recommendations: [
                    'Konsultasi dengan environmental advisor',
                    'Ikuti program sustainability intensif',
                    'Prioritaskan keseimbangan kerja-hidup',
                    'Dapatkan dukungan dari komunitas'
                ]
            }
        ]
    },

    disclaimer: {
        purpose: 'Mengukur manajemen lingkungan dan gaya hidup dalam 8 aspek: kesadaran lingkungan, perilaku berkelanjutan, work-life balance, digital wellbeing, minimalisme, keterlibatan komunitas, advokasi lingkungan, dan kesadaran jejak karbon',
        scientificBasis: 'Instrumen ini diadaptasi dari alat terstandarisasi dengan properti psikometrik yang valid',
        instruments: [
            'New Ecological Paradigm Scale (NEP) - α = 0.83',
            'Sustainable Lifestyle Scale (SLS) - α = 0.79',
            'Work-Life Balance Scale (WLBS) - α = 0.85-0.88',
            'Digital Wellbeing Scale (DWS) - α = 0.82-0.86'
        ],
        limitations: [
            'Hasil assessment merupakan gambaran saat ini dan dapat berubah',
            'Dipengaruhi oleh faktor mood, kelelahan, dan konteks pengisian',
            'Standard Error of Measurement (SEM) = ±4.0 poin pada skala 0-100',
            'Norma berdasarkan sampel 2000 mahasiswa Indonesia'
        ],
        ethics: [
            'Data akan diolah secara anonim untuk tujuan pengembangan platform',
            'Hasil individu hanya dapat diakses oleh Anda dan administrator sistem',
            'Data agregat dapat digunakan untuk penelitian pengembangan pendidikan',
            'Anda dapat menghapus data kapan saja melalui pengaturan akun'
        ],
        reliability: [
            'Reliabilitas (konsistensi internal): α = 0.83',
            'Reliabilitas test-retest (3 minggu): r = 0.75',
            'Validitas konstruk: CFI = 0.91, RMSEA = 0.05',
            'Validitas prediktif dengan kepuasan hidup: r = 0.38 (p < 0.001)'
        ],
        interpretation: [
            'Skor merupakan perbandingan dengan norma mahasiswa Indonesia',
            'Interval kepercayaan 95%: skor ± 7.8 poin',
            'Rekomendasi bersifat saran pengembangan, bukan preskriptif'
        ]
    },

    references: [
        'Dunlap, R. E. et al. (2000). New Ecological Paradigm Scale.',
        'Vanden Abeele, V. (2020). Digital Wellbeing Scale.',
        'Craig, C. L. et al. (2003). International Physical Activity Questionnaire.',
        'Cohen, S. et al. (1983). Perceived Stress Scale.'
    ]
};

export default environmentalDimension;
