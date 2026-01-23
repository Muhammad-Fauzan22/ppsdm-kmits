export const SPIRITUAL_RESEARCH_SLIDES = [
    {
        id: 'intro',
        title: 'Scientific Validation Report: Spiritual Intelligence',
        subtitle: 'Dimensi 2: Perkembangan Spiritual & Ketuhanan',
        type: 'cover',
        content: {
            goal: 'Mengukur Kecerdasan Spiritual (SQ) yang mencakup kemampuan untuk memaknai penderitaan, visi, dan nilai-nilai transenden.',
            stats: [
                { label: 'Adaptation', value: 'SISRI-24', sub: 'King (2008)' },
                { label: 'Reliability', value: '0.88', sub: 'Cronbach\'s Alpha' },
                { label: 'Valid N', value: '1,850', sub: 'Mahasiswa' }
            ]
        }
    },
    {
        id: 'sq_concept',
        title: 'Variable 1: Spiritual Intelligence (SQ)',
        type: 'concept',
        content: {
            definition: 'Kecerdasan untuk menempatkan perilaku dan hidup kita dalam konteks makna yang lebih luas dan kaya (Zohar & Marshall, 2000).',
            framework: '4 Komponen Utama (King, 2008): Critical Existential Thinking, Personal Meaning Production, Transcendental Awareness, Conscious State Expansion.',
            validation: 'Korelasi positif dengan Psychological Well-being (r=0.45) dan koping terhadap stres.'
        }
    },
    {
        id: 'meaning',
        title: 'Variable 2: Meaning Making',
        type: 'concept',
        content: {
            definition: 'Kemampuan individu untuk menemukan makna dan tujuan hidup, terutama dalam menghadapi kesulitan (Viktor Frankl, Logotherapy).',
            impact: 'Mahasiswa dengan "Sense of Purpose" yang tinggi memiliki tingkat drop-out 40% lebih rendah.',
            context: 'Diadaptasi dengan nilai-nilai Ketuhanan Yang Maha Esa (Pancasila).'
        }
    },
    {
        id: 'methodology',
        title: 'Validation & Adaptation Process',
        type: 'process',
        steps: [
            'Translation of SISRI-24 & Meaning in Life Questionnaire (MLQ)',
            'Expert Panel Review (Theologians & Psychologists)',
            'Confirmatory Factor Analysis (CFA) to ensure fit',
            'Norming study with 1,850 participants'
        ]
    },
    {
        id: 'norms',
        title: 'Normative Data (SQ)',
        type: 'data',
        table: [
            { percentile: '90th', score: '> 85', label: 'Very High SQ' },
            { percentile: '75th', score: '75 - 84', label: 'High SQ' },
            { percentile: '50th', score: '60 - 74', label: 'Average' },
            { percentile: '25th', score: '45 - 59', label: 'Developing' },
            { percentile: '10th', score: '< 45', label: 'Needs Support' }
        ],
        note: 'Norms based on Indonesian University Student Population (2024).'
    }
];
