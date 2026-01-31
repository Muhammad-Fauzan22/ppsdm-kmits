export interface EnvironmentalAssessmentResult {
    rawScore: number;
    overallScore: number; // 0-100 Normalized
    subscores: {
        environmentalAwareness: number;
        sustainableBehavior: number;
        workLifeBalance: number;
        digitalWellbeing: number;
        minimalistOrientation: number;
        energyConservation: number;
        communityEngagement: number;
        environmentalAdvocacy: number;
    };
    comparison: {
        facultyMean: number;
        percentile: number;
    };
    recommendations: string[];
}

export interface EnvironmentalQuestion {
    id: string;
    subdimension: keyof EnvironmentalAssessmentResult['subscores'];
    text: string;
}

// --- CONSTANTS: ELMS Instrument (32 Items) ---
export const ELMS_ITEMS: EnvironmentalQuestion[] = [
    // 1. Environmental Awareness
    { id: "EA1", subdimension: "environmentalAwareness", text: "Aktivitas manusia merupakan penyebab utama perubahan iklim yang kita alami saat ini" },
    { id: "EA2", subdimension: "environmentalAwareness", text: "Alam memiliki kapasitas terbatas untuk menanggung dampak aktivitas industri manusia" },
    { id: "EA3", subdimension: "environmentalAwareness", text: "Keseimbangan alam sangat rapuh dan mudah terganggu oleh aktivitas manusia" },
    { id: "EA4", subdimension: "environmentalAwareness", text: "Jika terus seperti sekarang, manusia akan menyebabkan bencana ekologis besar" },

    // 2. Sustainable Behavior
    { id: "SB1", subdimension: "sustainableBehavior", text: "Saya menggunakan tas belanja yang dapat digunakan kembali daripada tas plastik sekali pakai" },
    { id: "SB2", subdimension: "sustainableBehavior", text: "Saya memilih produk dengan kemasan minimal atau ramah lingkungan ketika berbelanja" },
    { id: "SB3", subdimension: "sustainableBehavior", text: "Saya menghindari pembelian barang yang tidak benar-benar saya butuhkan" },
    { id: "SB4", subdimension: "sustainableBehavior", text: "Saya memperbaiki barang yang rusak daripada langsung membeli yang baru" },

    // 3. Work-Life Balance
    { id: "WLB1", subdimension: "workLifeBalance", text: "Saya dapat memisahkan waktu untuk studi/tugas dan kehidupan pribadi dengan baik" },
    { id: "WLB2", subdimension: "workLifeBalance", text: "Saya merasa puas dengan keseimbangan antara aktivitas akademik dan waktu untuk diri sendiri" },
    { id: "WLB3", subdimension: "workLifeBalance", text: "Saya tidak membiarkan tugas kuliah mengganggu waktu istirahat dan rekreasi yang cukup" },
    { id: "WLB4", subdimension: "workLifeBalance", text: "Saya memiliki rutinitas harian yang memungkinkan waktu untuk studi, hobi, dan relaksasi" },

    // 4. Digital Wellbeing
    { id: "DW1", subdimension: "digitalWellbeing", text: "Saya dapat mengontrol waktu yang saya habiskan di media sosial dan aplikasi hiburan" },
    { id: "DW2", subdimension: "digitalWellbeing", text: "Penggunaan gadget dan internet tidak mengganggu produktivitas dan fokus saya" },
    { id: "DW3", subdimension: "digitalWellbeing", text: "Saya secara teratur mengambil jeda dari perangkat digital untuk beristirahat" },
    { id: "DW4", subdimension: "digitalWellbeing", text: "Saya merasa tenang dan hadir di momen nyata tanpa terus-menerus mengecek ponsel" },

    // 5. Minimalist Orientation
    { id: "MO1", subdimension: "minimalistOrientation", text: "Saya lebih menghargai pengalaman bermakna daripada kepemilikan banyak barang" },
    { id: "MO2", subdimension: "minimalistOrientation", text: "Saya merasa bahagia dengan barang-barang yang sedikit tetapi fungsional dan bermakna" },
    { id: "MO3", subdimension: "minimalistOrientation", text: "Saya secara teratur mengevaluasi dan mengurangi kepemilikan barang yang tidak perlu" },
    { id: "MO4", subdimension: "minimalistOrientation", text: "Kebahagiaan saya tidak bergantung pada pembelian barang-barang material baru" },

    // 6. Energy Conservation
    { id: "EC1", subdimension: "energyConservation", text: "Saya mematikan lampu dan peralatan listrik ketika tidak digunakan" },
    { id: "EC2", subdimension: "energyConservation", text: "Saya menggunakan transportasi umum, bersepeda, atau berjalan kaki ketika memungkinkan" },
    { id: "EC3", subdimension: "energyConservation", text: "Saya mengurangi penggunaan air dengan mandi cepat dan mematikan keran saat tidak digunakan" },
    { id: "EC4", subdimension: "energyConservation", text: "Saya memilih peralatan elektronik dengan efisiensi energi tinggi ketika membeli" },

    // 7. Community Engagement
    { id: "CE1", subdimension: "communityEngagement", text: "Saya aktif dalam kegiatan komunitas atau kampus yang peduli lingkungan" },
    { id: "CE2", subdimension: "communityEngagement", text: "Saya berpartisipasi dalam acara-acara yang bertujuan meningkatkan kesadaran lingkungan" },
    { id: "CE3", subdimension: "communityEngagement", text: "Saya berkontribusi dalam gerakan atau kampanye lingkungan di komunitas saya" },
    { id: "CE4", subdimension: "communityEngagement", text: "Saya merasa bertanggung jawab untuk terlibat dalam isu-isu lingkungan di sekitar saya" },

    // 8. Environmental Advocacy
    { id: "EA2_1", subdimension: "environmentalAdvocacy", text: "Saya mendorong teman dan keluarga untuk peduli terhadap lingkungan" },
    { id: "EA2_2", subdimension: "environmentalAdvocacy", text: "Saya berbagi informasi tentang isu-isu lingkungan di media sosial atau diskusi" },
    { id: "EA2_3", subdimension: "environmentalAdvocacy", text: "Saya merasa perlu untuk mengadvokasi kebijakan yang ramah lingkungan" },
    { id: "EA2_4", subdimension: "environmentalAdvocacy", text: "Saya bersedia menyuarakan keprihatinan lingkungan kepada pihak berwenang" }
];

// --- SCORING LOGIC ---

export const calculateEnvironmentalScore = (responses: Record<string, number>, faculty: string = 'general'): EnvironmentalAssessmentResult => {
    // 1. Defaults
    const processed = { ...responses };
    ELMS_ITEMS.forEach(it => { if (!processed[it.id]) processed[it.id] = 3; });

    // 2. Calculate Subscores
    // Each subdim has 4 items. Max=20, Min=4. Range=16.
    const calcSub = (subdim: string) => {
        const items = ELMS_ITEMS.filter(i => i.subdimension === subdim);
        const sum = items.reduce((acc, it) => acc + processed[it.id], 0);
        return Math.round(((sum - 4) / 16) * 100);
    };

    const subscores = {
        environmentalAwareness: calcSub('environmentalAwareness'),
        sustainableBehavior: calcSub('sustainableBehavior'),
        workLifeBalance: calcSub('workLifeBalance'),
        digitalWellbeing: calcSub('digitalWellbeing'),
        minimalistOrientation: calcSub('minimalistOrientation'),
        energyConservation: calcSub('energyConservation'),
        communityEngagement: calcSub('communityEngagement'),
        environmentalAdvocacy: calcSub('environmentalAdvocacy')
    };

    // 3. Overall Score
    const subValues = Object.values(subscores);
    const overallScore = Math.round(subValues.reduce((a, b) => a + b, 0) / subValues.length);
    const rawScore = Object.values(processed).reduce((a, b) => a + b, 0);

    // 4. Comparison (Based on Faculty Norms provided in research)
    const facultyNorms: Record<string, number> = {
        'engineering': 61.4,
        'science': 66.2,
        'social_sciences': 67.8,
        'arts': 65.3,
        'business': 62.7,
        'general': 64.3
    };
    const mean = facultyNorms[faculty.toLowerCase()] || facultyNorms['general'];
    const sd = 12.8;

    // Percentile
    const z = (overallScore - mean) / sd;
    // Simple approx
    let percentile = 50 + (z * 34);
    if (percentile > 99) percentile = 99;
    if (percentile < 1) percentile = 1;

    // 5. Recommendations
    const recoList: string[] = [];
    if (subscores.sustainableBehavior < 50) recoList.push("Mulai bawa botol minum dan tas belanja sendiri.");
    if (subscores.digitalWellbeing < 50) recoList.push("Coba 'Digital Detox' setiap akhir pekan selama 4 jam.");
    if (subscores.workLifeBalance < 50) recoList.push("Buat jadwal blok waktu khusus untuk istirahat tanpa gangguan.");
    if (subscores.energyConservation < 50) recoList.push("Pastikan mematikan semua perangkat listrik sebelum tidur.");
    if (recoList.length === 0) recoList.push("Pertahankan gaya hidup berkelanjutan Anda. Bagikan tips Anda ke teman-teman.");

    return {
        rawScore,
        overallScore, // 0-100
        subscores,
        comparison: {
            facultyMean: mean,
            percentile: Math.round(percentile)
        },
        recommendations: recoList
    };
};
