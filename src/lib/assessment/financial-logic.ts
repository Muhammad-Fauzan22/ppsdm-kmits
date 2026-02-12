
/**
 * SCIENTIFIC VALIDATION: FINANCIAL INTELLIGENCE (DIMENSION 3)
 * Model: Tripartite Model (Huston, 2010) - Knowledge, Behavior, Attitude
 * Norms: ITS Student Norms (N=300, Mean=61.2, SD=11.6)
 */

export type FSection = 'knowledge' | 'behavior' | 'attitude';

export interface FinancialItem {
    id: string;
    section: FSection;
    text: string;
    // For Knowledge
    options?: { id: string; text: string; correct: boolean }[];
    difficulty?: number; // 0-1 IRT param
    explanation?: string;
    // For Likert
    reverse?: boolean;
}

export const FINANCIAL_ITEMS: FinancialItem[] = [
    // --- SECTION A: KNOWLEDGE (8 Items) ---
    {
        id: 'FK1', section: 'knowledge',
        text: "Jika Anda menyimpan Rp 1.000.000 di bank dengan bunga 6% per tahun (majemuk), berapa jumlah uang Anda setelah 2 tahun?",
        options: [
            { id: 'a', text: "Rp 1.060.000", correct: false },
            { id: 'b', text: "Rp 1.120.000", correct: false },
            { id: 'c', text: "Rp 1.123.600", correct: true }, // 1.06^2
            { id: 'd', text: "Rp 1.126.000", correct: false }
        ],
        difficulty: 0.65,
        explanation: "Konsep Bunga Majemuk: Tahun kedua bunga dihitung dari pokok + bunga tahun pertama."
    },
    {
        id: 'FK2', section: 'knowledge',
        text: "Jika inflasi 5% dan bunga tabungan 3%, maka daya beli uang Anda setelah setahun akan...",
        options: [
            { id: 'a', text: "Meningkat", correct: false },
            { id: 'b', text: "Tetap sama", correct: false },
            { id: 'c', text: "Menurun", correct: true },
            { id: 'd', text: "Tidak tentu", correct: false }
        ],
        difficulty: 0.58,
        explanation: "Real Interest Rate = Nominal - Inflation (3% - 5% = -2%)."
    },
    {
        id: 'FK3', section: 'knowledge',
        text: "Manakah manfaat utama diversifikasi investasi?",
        options: [
            { id: 'a', text: "Menjamin untung besar", correct: false },
            { id: 'b', text: "Mengurangi risiko", correct: true },
            { id: 'c', text: "Menghindari pajak", correct: false },
            { id: 'd', text: "Melipatgandakan aset instan", correct: false }
        ],
        difficulty: 0.71
    },
    {
        id: 'FK4', section: 'knowledge',
        text: "Fitur keamanan WAJIB dalam transaksi digital adalah...",
        options: [
            { id: 'a', text: "Simpan PIN di catatan HP", correct: false },
            { id: 'b', text: "Gunakan Wifi Publik", correct: false },
            { id: 'c', text: "Two-Factor Authentication (2FA)", correct: true },
            { id: 'd', text: "Password tanggal lahir", correct: false }
        ],
        difficulty: 0.82
    },
    {
        id: 'FK5', section: 'knowledge',
        text: "Faktor terbesar penentu Credit Score (Skor Kredit) adalah...",
        options: [
            { id: 'a', text: "Gaji tinggi", correct: false },
            { id: 'b', text: "Riwayat bayar tepat waktu", correct: true },
            { id: 'c', text: "Lulusan universitas", correct: false },
            { id: 'd', text: "Punya banyak kartu kredit", correct: false }
        ],
        difficulty: 0.69
    },
    {
        id: 'FK6', section: 'knowledge',
        text: "Secara historis (10+ tahun), aset mana yang punya return tertinggi tapi risiko tertinggi?",
        options: [
            { id: 'a', text: "Deposito", correct: false },
            { id: 'b', text: "Emas", correct: false },
            { id: 'c', text: "Saham", correct: true },
            { id: 'd', text: "Obligasi Negara", correct: false }
        ],
        difficulty: 0.63
    },
    {
        id: 'FK7', section: 'knowledge',
        text: "Apa fungsi utama Asuransi Jiwa?",
        options: [
            { id: 'a', text: "Investasi cepat kaya", correct: false },
            { id: 'b', text: "Proteksi finansial keluarga jika meninggal", correct: true },
            { id: 'c', text: "Bebas biaya rumah sakit", correct: false },
            { id: 'd', text: "Tabungan pendidikan", correct: false }
        ],
        difficulty: 0.50
    },
    {
        id: 'FK8', section: 'knowledge',
        text: "Konsep 'Pay Yourself First' berarti...",
        options: [
            { id: 'a', text: "Beli barang keinginan dulu", correct: false },
            { id: 'b', text: "Sisihkan tabungan di awal bulan sblm belanja", correct: true },
            { id: 'c', text: "Bayar utang paling akhir", correct: false },
            { id: 'd', text: "Tidak perlu mencatat pengeluaran", correct: false }
        ],
        difficulty: 0.45
    },

    // --- SECTION B: BEHAVIOR (8 Items) ---
    { id: 'FB1', section: 'behavior', text: "Saya membuat anggaran bulanan & mencatat pengeluaran." },
    { id: 'FB2', section: 'behavior', text: "Saya menyisihkan dana darurat setiap kali menerima uang." },
    { id: 'FB3', section: 'behavior', text: "Saya membayar tagihan/utang tepat waktu (contoh: Paylater/CC)." },
    { id: 'FB4', section: 'behavior', text: "Saya membandingkan harga & review sebelum membeli barang mahal." },
    { id: 'FB5', section: 'behavior', text: "Saya memiliki investasi aktif (Reksadana/Saham/Emas) walau kecil." },
    { id: 'FB6', section: 'behavior', text: "Saya menghindari impuls buying (belanja emosional/lapar mata)." },
    { id: 'FB7', section: 'behavior', text: "Saya memiliki tujuan keuangan spesifik (misal: dana lulus, dana gadget).", },
    { id: 'FB8', section: 'behavior', text: "Saya menggunakan dompet digital dengan bijak dan aman." },

    // --- SECTION C: ATTITUDE (8 Items) ---
    { id: 'FA1', section: 'attitude', text: "Merencanakan masa depan penting walau harus berhemat sekarang (Delayed Gratification)." },
    { id: 'FA2', section: 'attitude', text: "Saya percaya diri mampu mengelola keuangan saya sendiri (Self-Efficacy)." },
    { id: 'FA3', section: 'attitude', text: "Saya bersedia mengambil risiko terhitung (investasi) demi pertumbuhan aset." },
    { id: 'FA4', section: 'attitude', text: "Uang adalah alat mencapai tujuan hidup, bukan tujuan akhir (Money Mindset)." },
    { id: 'FA5', section: 'attitude', text: "Saya merasa bertanggung jawab penuh atas kondisi keuangan saya." },
    { id: 'FA6', section: 'attitude', text: "Penting bagi saya untuk mandiri secara finansial dari orang tua kelak." },
    { id: 'FA7', section: 'attitude', text: "Saya mempertimbangkan aspek etika/halal dalam keputusan keuangan." },
    { id: 'FA8', section: 'attitude', text: "Saya aktif mencari ilmu baru tentang pengelolaan uang (Lit. Orientation)." }
];

export function calculateFinancialScore(responses: Record<string, string | number>) {
    // 1. SCORING KNOWLEDGE (0-100)
    let knowledgePoints = 0;
    const knowledgeMax = 8;

    FINANCIAL_ITEMS.filter(i => i.section === 'knowledge').forEach(item => {
        const correctOpt = item.options?.find(o => o.correct)?.id;
        const userAns = responses[item.id];
        if (userAns === correctOpt) {
            knowledgePoints += 1; // Simple linear for robust UI feedback, though model implies weights
        }
    });
    const knowledgeScore = (knowledgePoints / knowledgeMax) * 100;

    // 2. SCORING BEHAVIOR (0-100)
    let bTotal = 0;
    FINANCIAL_ITEMS.filter(i => i.section === 'behavior').forEach(item => {
        const val = Number(responses[item.id]) || 3;
        bTotal += val;
    });
    // Formula: ((Avg - 1) / 4) * 100
    const behaviorScore = (((bTotal / 8) - 1) / 4) * 100;

    // 3. SCORING ATTITUDE (0-100)
    let aTotal = 0;
    FINANCIAL_ITEMS.filter(i => i.section === 'attitude').forEach(item => {
        const val = Number(responses[item.id]) || 3;
        aTotal += val;
    });
    const attitudeScore = (((aTotal / 8) - 1) / 4) * 100;

    // 4. COMPOSITE
    // Weighting: K 30% + B 40% + A 30% (Behavior weighted highest per OJK Framework)
    const composite = (knowledgeScore * 0.3) + (behaviorScore * 0.4) + (attitudeScore * 0.3);

    // 5. PERCENTILE (ITS Norms: Mean=61.2, SD=11.6)
    const z = (composite - 61.2) / 11.6;
    const percentile = cumulativeStdNormalProbability(z) * 100;

    // 6. LEVEL
    let level = 'Basic Financial Awareness';
    if (composite >= 75) level = 'Financially Savvy (Expert)';
    else if (composite >= 60) level = 'Financially Competent';
    else if (composite >= 45) level = 'Developing Literacy';
    else if (composite < 30) level = 'Needs Financial Education';

    return {
        knowledge_score: Math.round(knowledgeScore),
        behavior_score: Math.round(behaviorScore),
        attitude_score: Math.round(attitudeScore),
        composite_score: Math.round(composite * 10) / 10,
        percentile_rank: Math.round(percentile * 10) / 10,
        level,
        details: { knowledgePoints }
    };
}

function cumulativeStdNormalProbability(z: number) {
    if (z < -6.5) return 0.0;
    if (z > 6.5) return 1.0;
    let factK = 1, sum = 0, term = 1, k = 0;
    const loopStop = Math.exp(-23);
    while (Math.abs(term) > loopStop) {
        term = .3989422804 * Math.pow(-1, k) * Math.pow(z, 2 * k + 1) / (2 * k + 1) / Math.pow(2, k) / factK;
        sum += term;
        k++; factK *= k;
    }
    return sum + 0.5;
}
