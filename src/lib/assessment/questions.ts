
export const ASSESSMENT_QUESTIONS = {
    cognitive: [
        {
            id: 'COG1',
            dimension: 'cognitive',
            question_text: 'Saya mampu memecahkan masalah kompleks dengan memecahnya menjadi bagian-bagian kecil.',
            question_order: 1,
            framework_reference: 'Analytical Thinking'
        },
        {
            id: 'COG2',
            dimension: 'cognitive',
            question_text: 'Saya sering mencari hubungan antara konsep yang tampaknya tidak berkaitan.',
            question_order: 2,
            framework_reference: 'System Thinking'
        },
        {
            id: 'COG3',
            dimension: 'cognitive',
            question_text: 'Saya dapat mengevaluasi argumen secara kritis sebelum menerimanya sebagai kebenaran.',
            question_order: 3,
            framework_reference: 'Critical Analysis'
        }
    ],
    emotional: [
        {
            id: 'EMO1',
            dimension: 'emotional',
            question_text: 'Saya menyadari perubahan emosi saya saat situasi menekan.',
            question_order: 1,
            framework_reference: 'Self Awareness'
        },
        {
            id: 'EMO2',
            dimension: 'emotional',
            question_text: 'Saya mampu menenangkan diri dengan cepat setelah merasa marah atau kecewa.',
            question_order: 2,
            framework_reference: 'Self Regulation'
        },
        {
            id: 'EMO3',
            dimension: 'emotional',
            question_text: 'Saya dapat merasakan apa yang dirasakan orang lain dalam situasi tertentu.',
            question_order: 3,
            framework_reference: 'Empathy'
        }
    ],
    social: [
        {
            id: 'SOC1',
            dimension: 'social',
            question_text: 'Saya aktif mendengarkan lawan bicara saya tanpa menyela.',
            question_order: 1,
            framework_reference: 'Communication'
        },
        {
            id: 'SOC2',
            dimension: 'social',
            question_text: 'Saya merasa nyaman bekerja sama dalam tim yang beragam.',
            question_order: 2,
            framework_reference: 'Collaboration'
        },
        {
            id: 'SOC3',
            dimension: 'social',
            question_text: 'Saya proaktif membangun jejaring dengan orang-orang baru.',
            question_order: 3,
            framework_reference: 'Networking'
        }
    ],
    spiritual: [
        {
            id: 'SPI1',
            dimension: 'spiritual',
            question_text: 'Saya memiliki tujuan hidup yang jelas yang melampaui kepentingan pribadi.',
            question_order: 1,
            framework_reference: 'Purpose'
        },
        {
            id: 'SPI2',
            dimension: 'spiritual',
            question_text: 'Saya secara rutin meluangkan waktu untuk refleksi diri atau meditasi/ibadah.',
            question_order: 2,
            framework_reference: 'Mindfulness'
        },
        {
            id: 'SPI3',
            dimension: 'spiritual',
            question_text: 'Nilai-nilai pribadi saya menjadi panduan utama dalam setiap keputusan.',
            question_order: 3,
            framework_reference: 'Integrity'
        }
    ],
    physical: [
        {
            id: 'PHY1',
            dimension: 'physical',
            question_text: 'Saya rutin berolahraga minimal 3 kali seminggu.',
            question_order: 1,
            framework_reference: 'Physical Activity'
        },
        {
            id: 'PHY2',
            dimension: 'physical',
            question_text: 'Saya menjaga pola makan yang seimbang dan nutrisi yang cukup.',
            question_order: 2,
            framework_reference: 'Nutrition'
        },
        {
            id: 'PHY3',
            dimension: 'physical',
            question_text: 'Saya mendapatkan tidur yang cukup (7-8 jam) setiap malam.',
            question_order: 3,
            framework_reference: 'Rest'
        }
    ],
    financial: [
        {
            id: 'FIN1',
            dimension: 'financial',
            question_text: 'Saya mencatat pemasukan dan pengeluaran saya secara rutin.',
            question_order: 1,
            framework_reference: 'Budgeting'
        },
        {
            id: 'FIN2',
            dimension: 'financial',
            question_text: 'Saya menyisihkan sebagian uang untuk tabungan atau investasi setiap bulan.',
            question_order: 2,
            framework_reference: 'Saving'
        },
        {
            id: 'FIN3',
            dimension: 'financial',
            question_text: 'Saya memahami dasar-dasar instrumen investasi.',
            question_order: 3,
            framework_reference: 'Financial Literacy'
        }
    ],
    leadership: [
        {
            id: 'LEA1',
            dimension: 'leadership',
            question_text: 'Saya mampu menginspirasi orang lain untuk mencapai tujuan bersama.',
            question_order: 1,
            framework_reference: 'Influence'
        },
        {
            id: 'LEA2',
            dimension: 'leadership',
            question_text: 'Saya berani mengambil tanggung jawab atas keputusan sulit.',
            question_order: 2,
            framework_reference: 'Accountability'
        },
        {
            id: 'LEA3',
            dimension: 'leadership',
            question_text: 'Saya aktif memberdayakan anggota tim untuk berkembang.',
            question_order: 3,
            framework_reference: 'Empowerment'
        }
    ],
    adaptability: [
        {
            id: 'ADA1',
            dimension: 'adaptability',
            question_text: 'Saya cepat menyesuaikan diri dengan perubahan situasi yang mendadak.',
            question_order: 1,
            framework_reference: 'Flexibility'
        },
        {
            id: 'ADA2',
            dimension: 'adaptability',
            question_text: 'Saya melihat perubahan sebagai peluang, bukan ancaman.',
            question_order: 2,
            framework_reference: 'Resilience'
        },
        {
            id: 'ADA3',
            dimension: 'adaptability',
            question_text: 'Saya bersedia mempelajari keterampilan baru yang asing bagi saya.',
            question_order: 3,
            framework_reference: 'Growth Mindset'
        }
    ],
    ethics: [
        {
            id: 'ETH1',
            dimension: 'ethics',
            question_text: 'Saya selalu jujur meskipun dalam situasi yang merugikan saya.',
            question_order: 1,
            framework_reference: 'Honesty'
        },
        {
            id: 'ETH2',
            dimension: 'ethics',
            question_text: 'Saya mempertimbangkan dampak sosial dari setiap tindakan saya.',
            question_order: 2,
            framework_reference: 'Social Responsibility'
        },
        {
            id: 'ETH3',
            dimension: 'ethics',
            question_text: 'Saya menghormati hak kekayaan intelektual orang lain.',
            question_order: 3,
            framework_reference: 'Professionalism'
        }
    ],
    creativity: [
        {
            id: 'CRE1',
            dimension: 'creativity',
            question_text: 'Saya sering menghasilkan ide-ide orisinal dalam memecahkan masalah.',
            question_order: 1,
            framework_reference: 'Originality'
        },
        {
            id: 'CRE2',
            dimension: 'creativity',
            question_text: 'Saya tidak takut mencoba pendekatan yang tidak konvensional.',
            question_order: 2,
            framework_reference: 'Exploration'
        },
        {
            id: 'CRE3',
            dimension: 'creativity',
            question_text: 'Saya mampu menggabungkan konsep-konsep berbeda menjadi sesuatu yang baru.',
            question_order: 3,
            framework_reference: 'Synthesis'
        }
    ],
    environmental: [
        {
            id: 'ENV1',
            dimension: 'environmental',
            question_text: 'Saya secara sadar mengurangi penggunaan plastik sekali pakai.',
            question_order: 1,
            framework_reference: 'Sustainability'
        },
        {
            id: 'ENV2',
            dimension: 'environmental',
            question_text: 'Saya peduli terhadap isu-isu perubahan iklim dan dampaknya.',
            question_order: 2,
            framework_reference: 'Environmental Awareness'
        },
        {
            id: 'ENV3',
            dimension: 'environmental',
            question_text: 'Saya berpartisipasi dalam kegiatan pelestarian lingkungan.',
            question_order: 3,
            framework_reference: 'Action'
        }
    ]
};
