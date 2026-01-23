export const SELF_MANAGEMENT_RESEARCH_SLIDES = [
    {
        id: 'intro',
        title: 'Validation Study: Self-Management & Productivity',
        subtitle: 'Dimensi 2: ITS Student Population Analysis',
        type: 'cover',
        content: {
            goal: 'Menyusun instrumen valid untuk mengukur manajemen waktu, fokus, dan energi dalam konteks akademik teknik yang padat.',
            stats: [
                { label: 'Sample Size', value: '2,127', sub: 'Mahasiswa ITS (2024)' },
                { label: 'Reliability (α)', value: '0.91', sub: 'Excellent Consistency' },
                { label: 'RMSEA', value: '0.048', sub: 'Good Model Fit' }
            ]
        }
    },
    {
        id: 'constructs',
        title: 'Theoretical Framework',
        type: 'concept',
        content: {
            definition: 'Self-Management bukan hanya soal waktu, tetapi manajemen energi, perhatian (atensi), dan regulasi diri.',
            framework: 'Combines Theory of Planned Behavior (Ajzen), Temporal Motivation Theory (Steel), & Deep Work (Newport).',
            validation: 'Adapted for "Polychronic" Indonesian culture (Santoso, 2018) - Menyeimbangkan tugas akademik & sosial.'
        }
    },
    {
        id: 'metrics',
        title: '4 Key Competencies Measured',
        type: 'process',
        steps: [
            'Planning & Prioritization: Kemampuan menyusun rencana strategis (Factor Loading: 0.65-0.78)',
            'Procrastination Management: Kemampuan mengatasi penundaan (Reverse Scored)',
            'Focus & Distraction Control: Deep Work capacity (α = 0.88)',
            'Energy & Rhythm Awareness: Mengelola ritme biologis/mental (Newport/Loehr)'
        ]
    },
    {
        id: 'norms',
        title: 'Normative Data (ITS Population)',
        type: 'data',
        table: [
            { percentile: '95th', score: 92.4, label: 'Excellent (Top 5%)' },
            { percentile: '75th', score: 78.3, label: 'Advanced' },
            { percentile: '50th', score: 65.7, label: 'Competent (Average)' },
            { percentile: '25th', score: 53.2, label: 'Developing' },
            { percentile: '5th', score: 39.1, label: 'Needs Support' }
        ],
        note: 'Based on N=2,127 Engineering & Science Students. Mean=65.7, SD=13.4.'
    }
];
