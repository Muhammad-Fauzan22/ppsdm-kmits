
export interface PhysicalHealthItem {
    id: string;
    text: string;
    type: 'frequency' | 'duration' | 'likert';
    options: {
        value: number;
        text: string;
        score_val?: number; // Internal scoring value if different from 'value'
    }[];
    source?: string;
}

export const PHYSICAL_HEALTH_ITEMS: PhysicalHealthItem[] = [
    {
        id: "PH1",
        text: "Dalam 7 hari terakhir, berapa hari Anda melakukan aktivitas fisik intensitas sedang (seperti jalan cepat, bersepeda santai) minimal 30 menit per hari?",
        type: "frequency",
        options: [
            { value: 0, text: "0 hari", score_val: 0 },
            { value: 1, text: "1-2 hari", score_val: 25 },
            { value: 2, text: "3-4 hari", score_val: 50 },
            { value: 3, text: "5-6 hari", score_val: 75 },
            { value: 4, text: "7 hari", score_val: 100 }
        ]
    },
    {
        id: "PH2",
        text: "Biasanya, berapa jam Anda tidur dalam semalam?",
        type: "duration",
        options: [
            { value: 1, text: "< 5 jam", score_val: 0 },
            { value: 2, text: "5-6 jam", score_val: 25 },
            { value: 3, text: "6-7 jam", score_val: 50 },
            { value: 4, text: "7-8 jam", score_val: 100 },
            { value: 5, text: "> 8 jam", score_val: 50 }
        ]
    },
    {
        id: "PH3",
        text: "Dalam sebulan terakhir, seberapa sering Anda merasa tidak segar (tidak fresh) saat bangun tidur?",
        type: "frequency",
        options: [
            { value: 1, text: "Tidak pernah", score_val: 100 },
            { value: 2, text: "Kurang dari sekali seminggu", score_val: 75 },
            { value: 3, text: "1-2 kali seminggu", score_val: 50 },
            { value: 4, text: "3 kali atau lebih seminggu", score_val: 0 }
        ]
    },
    {
        id: "PH4",
        text: "Seberapa sering Anda mengonsumsi minimal 5 porsi sayur dan buah dalam sehari? (1 porsi = 1 mangkuk sayur atau 1 buah ukuran sedang)",
        type: "frequency",
        options: [
            { value: 1, text: "Tidak pernah", score_val: 0 },
            { value: 2, text: "Kadang-kadang (1-3 hari per minggu)", score_val: 25 },
            { value: 3, text: "Sering (4-6 hari per minggu)", score_val: 75 },
            { value: 4, text: "Selalu (setiap hari)", score_val: 100 }
        ]
    },
    {
        id: "PH5",
        text: "Saya merasa penuh energi dan bersemangat menjalani hari",
        type: "likert",
        options: [
            { value: 1, text: "Sangat tidak setuju", score_val: 0 },
            { value: 2, text: "Tidak setuju", score_val: 25 },
            { value: 3, text: "Netral", score_val: 50 },
            { value: 4, text: "Setuju", score_val: 75 },
            { value: 5, text: "Sangat setuju", score_val: 100 }
        ]
    },
    {
        id: "PH6",
        text: "Seberapa sering Anda minum air putih minimal 8 gelas (2 liter) per hari?",
        type: "frequency",
        options: [
            { value: 1, text: "Tidak pernah", score_val: 0 },
            { value: 2, text: "Kadang-kadang", score_val: 25 },
            { value: 3, text: "Sering", score_val: 75 },
            { value: 4, text: "Selalu", score_val: 100 }
        ]
    },
    {
        id: "PH7",
        text: "Dalam sebulan terakhir, seberapa sering Anda mengalami sakit kepala, kelelahan ekstrem, atau masalah kesehatan lainnya yang mengganggu aktivitas?",
        type: "frequency",
        options: [
            { value: 1, text: "Tidak pernah", score_val: 100 },
            { value: 2, text: "Kadang-kadang (1-2 kali)", score_val: 75 },
            { value: 3, text: "Sering (3-4 kali)", score_val: 25 },
            { value: 4, text: "Sangat sering (5 kali atau lebih)", score_val: 0 }
        ]
    },
    {
        id: "PH8",
        text: "Seberapa baik Anda mengelola stres dan menjaga keseimbangan antara studi, aktivitas, dan waktu pribadi?",
        type: "likert",
        options: [
            { value: 1, text: "Sangat tidak baik", score_val: 0 },
            { value: 2, text: "Tidak baik", score_val: 25 },
            { value: 3, text: "Cukup baik", score_val: 50 },
            { value: 4, text: "Baik", score_val: 75 },
            { value: 5, text: "Sangat baik", score_val: 100 }
        ]
    }
];
