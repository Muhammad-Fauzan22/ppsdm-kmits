
export const KNOWLEDGE_ITEMS = [
    {
        id: 'FK_01',
        text: 'Manakah yang merupakan definisi paling tepat dari "Aset Produktif"?',
        options: [
            { label: 'Barang mewah yang meningkatkan status sosial', value: 'A' },
            { label: 'Segala sesuatu yang menghasilkan pendapatan atau kenaikan nilai di masa depan', value: 'B' },
            { label: 'Uang tunai yang disimpan di dompet', value: 'C' },
            { label: 'Pinjaman yang digunakan untuk konsumsi', value: 'D' }
        ],
        correctAnswer: 'B'
    },
    {
        id: 'FK_02',
        text: 'Apa dampak inflasi terhadap daya beli uang Anda?',
        options: [
            { label: 'Meningkatkan daya beli', value: 'A' },
            { label: 'Tidak berpengaruh', value: 'B' },
            { label: 'Menurunkan daya beli', value: 'C' },
            { label: 'Membuat uang lebih bernilai', value: 'D' }
        ],
        correctAnswer: 'C'
    },
    {
        id: 'FK_03',
        text: 'Konsep "Compound Interest" (Bunga Berbunga) paling menguntungkan jika...',
        options: [
            { label: 'Anda mulai menabung sedini mungkin', value: 'A' },
            { label: 'Anda menabung dalam jangka pendek', value: 'B' },
            { label: 'Suku bunga sangat rendah', value: 'C' },
            { label: 'Anda menarik bunga setiap bulan', value: 'D' }
        ],
        correctAnswer: 'A'
    }
];

export const BEHAVIOR_ITEMS = [
    {
        id: 'FB_01',
        text: 'Saya mencatat setiap pengeluaran harian saya.',
        type: 'likert'
    },
    {
        id: 'FB_02',
        text: 'Saya menyisihkan uang untuk ditabung segera setelah menerima pendapatan, bukan menunggu sisa.',
        type: 'likert'
    },
    {
        id: 'FB_03',
        text: 'Saya membandingkan harga sebelum membeli barang bernilai tinggi.',
        type: 'likert'
    }
];

export const ATTITUDE_ITEMS = [
    {
        id: 'FA_01',
        text: 'Saya percaya bahwa stabilitas finansial lebih penting daripada kepuasan belanja sesaat.',
        type: 'likert'
    },
    {
        id: 'FA_02',
        text: 'Membicarakan perencanaan keuangan adalah hal yang penting, bukan tabu.',
        type: 'likert'
    },
    {
        id: 'FA_03',
        text: 'Saya merasa bertanggung jawab penuh atas masa depan keuangan saya sendiri.',
        type: 'likert'
    }
];
