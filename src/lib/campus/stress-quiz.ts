/**
 * Stress Check Quiz — PSS-4 Inspired Quick Screener
 * 5 questions to gauge current stress level (Bahasa Indonesia)
 */

import type { StressQuestion, StressResult, StressLevel } from './types';

export const STRESS_QUESTIONS: StressQuestion[] = [
    {
        id: 1,
        text: 'Dalam sebulan terakhir, seberapa sering kamu merasa tidak mampu mengendalikan hal-hal penting dalam hidupmu?',
        options: [
            { value: 0, label: 'Tidak pernah' },
            { value: 1, label: 'Hampir tidak pernah' },
            { value: 2, label: 'Kadang-kadang' },
            { value: 3, label: 'Cukup sering' },
            { value: 4, label: 'Sangat sering' },
        ],
    },
    {
        id: 2,
        text: 'Seberapa sering kamu merasa kewalahan dengan tugas kuliah, organisasi, atau pekerjaan?',
        options: [
            { value: 0, label: 'Tidak pernah' },
            { value: 1, label: 'Hampir tidak pernah' },
            { value: 2, label: 'Kadang-kadang' },
            { value: 3, label: 'Cukup sering' },
            { value: 4, label: 'Sangat sering' },
        ],
    },
    {
        id: 3,
        text: 'Seberapa sering kamu mengalami kesulitan tidur karena memikirkan masalah?',
        options: [
            { value: 0, label: 'Tidak pernah' },
            { value: 1, label: 'Hampir tidak pernah' },
            { value: 2, label: 'Kadang-kadang' },
            { value: 3, label: 'Cukup sering' },
            { value: 4, label: 'Sangat sering' },
        ],
    },
    {
        id: 4,
        text: 'Seberapa sering kamu merasa yakin bisa mengatasi masalah-masalah pribadimu?',
        options: [
            { value: 4, label: 'Tidak pernah' },
            { value: 3, label: 'Hampir tidak pernah' },
            { value: 2, label: 'Kadang-kadang' },
            { value: 1, label: 'Cukup sering' },
            { value: 0, label: 'Sangat sering' },
        ],
    },
    {
        id: 5,
        text: 'Seberapa sering kamu merasa bahwa segala sesuatu berjalan sesuai harapanmu?',
        options: [
            { value: 4, label: 'Tidak pernah' },
            { value: 3, label: 'Hampir tidak pernah' },
            { value: 2, label: 'Kadang-kadang' },
            { value: 1, label: 'Cukup sering' },
            { value: 0, label: 'Sangat sering' },
        ],
    },
];

export const EMERGENCY_CONTACTS = [
    { name: 'Hotline 119 (Kemenkes RI)', phone: '119', description: 'Layanan kesehatan masyarakat 24 jam' },
    { name: 'Into The Light', phone: '021-78842580', description: 'Pencegahan bunuh diri' },
    { name: 'Sejiwa (Kemenkes)', phone: '119 ext. 8', description: 'Layanan psikolog gratis' },
    { name: 'LSM Jangan Bunuh Diri', phone: '021-9696-9293', description: 'Konseling krisis 24 jam' },
    { name: 'UPT Bimbingan Konseling ITS', phone: '-', description: 'Layanan konseling kampus' },
];

function getStressLevel(score: number): { level: StressLevel; label: string; color: string } {
    if (score <= 5) return { level: 'rendah', label: 'Rendah', color: '#10b981' };
    if (score <= 10) return { level: 'sedang', label: 'Sedang', color: '#f59e0b' };
    if (score <= 15) return { level: 'tinggi', label: 'Tinggi', color: '#f97316' };
    return { level: 'sangat_tinggi', label: 'Sangat Tinggi', color: '#ef4444' };
}

function getDescription(level: StressLevel): string {
    switch (level) {
        case 'rendah':
            return 'Kamu tampaknya mengelola stres dengan baik. Teruskan kebiasaan positifmu!';
        case 'sedang':
            return 'Kamu mengalami stres pada tingkat normal. Perhatikan keseimbangan antara aktivitas dan istirahat.';
        case 'tinggi':
            return 'Kamu tampaknya mengalami tekanan yang cukup signifikan. Pertimbangkan untuk mencari dukungan.';
        case 'sangat_tinggi':
            return 'Kamu tampaknya mengalami stres yang sangat tinggi. Sangat disarankan untuk berbicara dengan konselor profesional.';
    }
}

function getSuggestions(level: StressLevel): string[] {
    const base = [
        'Luangkan waktu 10 menit untuk bernapas dalam dan meditasi',
        'Pastikan tidur cukup (7-9 jam per malam)',
    ];

    switch (level) {
        case 'rendah':
            return [...base, 'Pertahankan rutinitas positifmu', 'Bantu temanmu yang mungkin butuh dukungan'];
        case 'sedang':
            return [
                ...base,
                'Cobalah teknik Pomodoro untuk mengelola tugas',
                'Olahraga ringan 30 menit sehari bisa membantu',
                'Ceritakan perasaanmu pada teman yang dipercaya',
            ];
        case 'tinggi':
            return [
                ...base,
                'Prioritaskan tugas — fokus pada yang paling penting',
                'Jangan ragu menghubungi konselor kampus',
                'Kurangi konsumsi kafein berlebihan',
                'Pertimbangkan untuk mengurangi beban kegiatan sementara',
            ];
        case 'sangat_tinggi':
            return [
                'Segera hubungi layanan konseling kampus atau hotline di bawah',
                'Bicarakan dengan orang yang kamu percaya (dosen, teman, keluarga)',
                'Istirahat yang cukup adalah prioritas utama',
                'Tidak ada yang salah dengan meminta bantuan profesional',
                'Kamu tidak sendirian — banyak mahasiswa mengalami hal serupa',
            ];
    }
}

export function calculateStressResult(answers: number[]): StressResult {
    const score = answers.reduce((sum, a) => sum + a, 0);
    const maxScore = STRESS_QUESTIONS.length * 4;
    const { level, label, color } = getStressLevel(score);

    return {
        score,
        maxScore,
        level,
        label,
        color,
        description: getDescription(level),
        suggestions: getSuggestions(level),
    };
}
