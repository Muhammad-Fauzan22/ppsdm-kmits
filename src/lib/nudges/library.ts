export type NudgeType = 'social_proof' | 'reminder' | 'streak' | 'achievement' | 'tip';

export interface Nudge {
    id: string;
    type: NudgeType;
    title: string;
    message: string;
    icon?: string;
    actionLabel?: string;
    actionLink?: string;
    trigger: 'on_load' | 'time_spent';
    priority: number; // 1 (High) - 10 (Low)
}

export const NUDGE_LIBRARY: Nudge[] = [
    // Social Proof (High Priority)
    {
        id: 'sp_1',
        type: 'social_proof',
        title: 'Temanmu sedang belajar!',
        message: '85 mahasiswa Teknik Informatika baru saja menyelesaikan asesmen Kognitif hari ini.',
        icon: '👥',
        actionLabel: 'Ikutan yuk',
        actionLink: '/assessment',
        trigger: 'on_load',
        priority: 1
    },
    {
        id: 'sp_2',
        type: 'social_proof',
        title: 'Popular Course',
        message: 'Modul "Financial Planning 101" sedang trending minggu ini di kalangan mahasiswa baru.',
        icon: '🔥',
        actionLabel: 'Lihat Modul',
        actionLink: '/courses',
        trigger: 'on_load',
        priority: 2
    },

    // Streaks & Loss Aversion
    {
        id: 'str_1',
        type: 'streak',
        title: 'Jaga momentum!',
        message: 'Anda sudah login 3 hari berturut-turut. Jangan putus streak-mu besok!',
        icon: '🔥',
        trigger: 'on_load',
        priority: 3
    },
    {
        id: 'str_2',
        type: 'streak',
        title: 'Hampir sampai!',
        message: 'Anda sudah menyelesaikan 70% dari profil holistik. Sedikit lagi untuk mendapatkan badge "Explorer".',
        icon: '🏆',
        actionLabel: 'Lengkapi Profil',
        actionLink: '/assessment',
        trigger: 'time_spent',
        priority: 2
    },

    // Reminders & Tips
    {
        id: 'tip_1',
        type: 'tip',
        title: 'Deep Work Time',
        message: 'Waktu terbaik untuk belajar adalah sekarang sebelum jadwal padat. Mulai 15 menit saja?',
        icon: '⏰',
        actionLabel: 'Mulai',
        actionLink: '/courses',
        trigger: 'on_load',
        priority: 5
    },
    {
        id: 'rem_1',
        type: 'reminder',
        title: 'Jangan lupa kesehatanmu',
        message: 'Sudah minum air putih yang cukup hari ini? Dehidrasi menurunkan fokus belajar hingga 20%.',
        icon: '💧',
        trigger: 'time_spent',
        priority: 4
    }
];
