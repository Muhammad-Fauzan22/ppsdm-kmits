// Assessment Instruments - Validated Psychological Tests
// Sources: Big Five (BFI-2), Growth Mindset (Dweck), Grit Scale (Duckworth)

export interface AssessmentQuestion {
    id: string;
    dimension: string;
    text_id: string;
    type: 'likert5';
    reverse: boolean;
    weight: number;
}

// Combined 72 Questions across 9 dimensions
export const assessmentQuestions: AssessmentQuestion[] = [
    // COGNITIVE (8)
    { id: 'cog1', dimension: 'cognitive', text_id: 'Saya adalah orang yang orisinal dan sering punya ide baru', type: 'likert5', reverse: false, weight: 1 },
    { id: 'cog2', dimension: 'cognitive', text_id: 'Saya adalah orang yang ingin tahu banyak hal', type: 'likert5', reverse: false, weight: 1 },
    { id: 'cog3', dimension: 'cognitive', text_id: 'Saya adalah orang yang imajinatif', type: 'likert5', reverse: false, weight: 1 },
    { id: 'cog4', dimension: 'cognitive', text_id: 'Kecerdasan bisa dikembangkan dengan usaha', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'cog5', dimension: 'cognitive', text_id: 'Saya senang mempelajari hal-hal baru', type: 'likert5', reverse: false, weight: 1 },
    { id: 'cog6', dimension: 'cognitive', text_id: 'Saya bisa berpikir kritis dan analitis', type: 'likert5', reverse: false, weight: 1 },
    { id: 'cog7', dimension: 'cognitive', text_id: 'Saya suka memecahkan masalah yang kompleks', type: 'likert5', reverse: false, weight: 1 },
    { id: 'cog8', dimension: 'cognitive', text_id: 'Saya kurang tertarik pada seni dan kreativitas', type: 'likert5', reverse: true, weight: 1 },

    // EMOTIONAL (8)
    { id: 'emo1', dimension: 'emotional', text_id: 'Saya mudah bergaul dengan orang baru', type: 'likert5', reverse: false, weight: 1 },
    { id: 'emo2', dimension: 'emotional', text_id: 'Saya bisa mengenali emosi diri sendiri', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'emo3', dimension: 'emotional', text_id: 'Saya bisa mengelola emosi dengan baik', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'emo4', dimension: 'emotional', text_id: 'Saya cenderung pendiam', type: 'likert5', reverse: true, weight: 1 },
    { id: 'emo5', dimension: 'emotional', text_id: 'Saya penuh energi dan antusias', type: 'likert5', reverse: false, weight: 1 },
    { id: 'emo6', dimension: 'emotional', text_id: 'Saya bisa berempati dengan perasaan orang lain', type: 'likert5', reverse: false, weight: 1 },
    { id: 'emo7', dimension: 'emotional', text_id: 'Saya mudah gugup dan cemas', type: 'likert5', reverse: true, weight: 1 },
    { id: 'emo8', dimension: 'emotional', text_id: 'Saya stabil secara emosional', type: 'likert5', reverse: false, weight: 1 },

    // SOCIAL (8)
    { id: 'soc1', dimension: 'social', text_id: 'Saya suka menolong dan tidak egois', type: 'likert5', reverse: false, weight: 1 },
    { id: 'soc2', dimension: 'social', text_id: 'Saya mudah memaafkan kesalahan orang lain', type: 'likert5', reverse: false, weight: 1 },
    { id: 'soc3', dimension: 'social', text_id: 'Saya bisa bersikap dingin dan menjaga jarak', type: 'likert5', reverse: true, weight: 1 },
    { id: 'soc4', dimension: 'social', text_id: 'Saya penuh perhatian dan baik hati', type: 'likert5', reverse: false, weight: 1 },
    { id: 'soc5', dimension: 'social', text_id: 'Saya bisa bekerja efektif dalam tim', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'soc6', dimension: 'social', text_id: 'Saya bisa berkomunikasi dengan jelas', type: 'likert5', reverse: false, weight: 1 },
    { id: 'soc7', dimension: 'social', text_id: 'Saya punya jaringan pertemanan yang luas', type: 'likert5', reverse: false, weight: 1 },
    { id: 'soc8', dimension: 'social', text_id: 'Saya bisa menyelesaikan konflik dengan baik', type: 'likert5', reverse: false, weight: 1 },

    // PHYSICAL (8)
    { id: 'phy1', dimension: 'physical', text_id: 'Saya berolahraga minimal 30 menit, 3x seminggu', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'phy2', dimension: 'physical', text_id: 'Saya merasa kuat dan sehat secara fisik', type: 'likert5', reverse: false, weight: 1 },
    { id: 'phy3', dimension: 'physical', text_id: 'Saya makan buah dan sayur setiap hari', type: 'likert5', reverse: false, weight: 1 },
    { id: 'phy4', dimension: 'physical', text_id: 'Saya menjaga pola makan yang seimbang', type: 'likert5', reverse: false, weight: 1 },
    { id: 'phy5', dimension: 'physical', text_id: 'Saya tidur 7-9 jam per malam', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'phy6', dimension: 'physical', text_id: 'Saya bangun dengan segar dan berenergi', type: 'likert5', reverse: false, weight: 1 },
    { id: 'phy7', dimension: 'physical', text_id: 'Saya menghindari rokok dan alkohol', type: 'likert5', reverse: false, weight: 1 },
    { id: 'phy8', dimension: 'physical', text_id: 'Saya beristirahat saat duduk terlalu lama', type: 'likert5', reverse: false, weight: 1 },

    // FINANCIAL (8)
    { id: 'fin1', dimension: 'financial', text_id: 'Saya mencatat pengeluaran saya', type: 'likert5', reverse: false, weight: 1 },
    { id: 'fin2', dimension: 'financial', text_id: 'Saya mempertimbangkan kemampuan sebelum membeli', type: 'likert5', reverse: false, weight: 1 },
    { id: 'fin3', dimension: 'financial', text_id: 'Saya menyisihkan uang untuk tabungan', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'fin4', dimension: 'financial', text_id: 'Saya punya dana darurat minimal 3 bulan', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'fin5', dimension: 'financial', text_id: 'Saya memahami konsep bunga majemuk', type: 'likert5', reverse: false, weight: 1 },
    { id: 'fin6', dimension: 'financial', text_id: 'Saya memahami risiko dan return investasi', type: 'likert5', reverse: false, weight: 1 },
    { id: 'fin7', dimension: 'financial', text_id: 'Saya menghindari berhutang berlebihan', type: 'likert5', reverse: false, weight: 1 },
    { id: 'fin8', dimension: 'financial', text_id: 'Saya punya rencana keuangan jangka panjang', type: 'likert5', reverse: false, weight: 1 },

    // CHARACTER (8)
    { id: 'chr1', dimension: 'character', text_id: 'Saya mengerjakan sesuatu dengan teliti', type: 'likert5', reverse: false, weight: 1 },
    { id: 'chr2', dimension: 'character', text_id: 'Saya adalah pekerja yang dapat diandalkan', type: 'likert5', reverse: false, weight: 1 },
    { id: 'chr3', dimension: 'character', text_id: 'Saya cenderung tidak teratur', type: 'likert5', reverse: true, weight: 1 },
    { id: 'chr4', dimension: 'character', text_id: 'Saya tekun sampai tugas selesai', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'chr5', dimension: 'character', text_id: 'Saya tidak mudah menyerah saat menghadapi kegagalan', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'chr6', dimension: 'character', text_id: 'Saya adalah pekerja keras', type: 'likert5', reverse: false, weight: 1 },
    { id: 'chr7', dimension: 'character', text_id: 'Saya menyelesaikan apapun yang saya mulai', type: 'likert5', reverse: false, weight: 1 },
    { id: 'chr8', dimension: 'character', text_id: 'Saya berpegang teguh pada nilai dan prinsip', type: 'likert5', reverse: false, weight: 1 },

    // SPIRITUAL (8)
    { id: 'spi1', dimension: 'spiritual', text_id: 'Saya memiliki tujuan hidup yang jelas', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'spi2', dimension: 'spiritual', text_id: 'Saya merasa hidup saya bermakna', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'spi3', dimension: 'spiritual', text_id: 'Saya rutin mengungkapkan rasa syukur', type: 'likert5', reverse: false, weight: 1 },
    { id: 'spi4', dimension: 'spiritual', text_id: 'Saya menghargai hal-hal kecil dalam hidup', type: 'likert5', reverse: false, weight: 1 },
    { id: 'spi5', dimension: 'spiritual', text_id: 'Membantu orang lain memberi saya kepuasan', type: 'likert5', reverse: false, weight: 1 },
    { id: 'spi6', dimension: 'spiritual', text_id: 'Saya berkontribusi pada hal lebih besar dari diri', type: 'likert5', reverse: false, weight: 1 },
    { id: 'spi7', dimension: 'spiritual', text_id: 'Saya melakukan praktik spiritual secara rutin', type: 'likert5', reverse: false, weight: 1 },
    { id: 'spi8', dimension: 'spiritual', text_id: 'Saya merasa terhubung dengan sesuatu yang besar', type: 'likert5', reverse: false, weight: 1 },

    // ENVIRONMENTAL (8)
    { id: 'env1', dimension: 'environmental', text_id: 'Saya sadar akan isu lingkungan dan dampaknya', type: 'likert5', reverse: false, weight: 1 },
    { id: 'env2', dimension: 'environmental', text_id: 'Saya aktif mengurangi, reuse, dan recycle', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'env3', dimension: 'environmental', text_id: 'Saya meminimalkan plastik sekali pakai', type: 'likert5', reverse: false, weight: 1 },
    { id: 'env4', dimension: 'environmental', text_id: 'Saya pertimbangkan dampak lingkungan saat beli', type: 'likert5', reverse: false, weight: 1 },
    { id: 'env5', dimension: 'environmental', text_id: 'Saya menghemat energi dan air', type: 'likert5', reverse: false, weight: 1 },
    { id: 'env6', dimension: 'environmental', text_id: 'Saya mengajak orang lain hidup berkelanjutan', type: 'likert5', reverse: false, weight: 1 },
    { id: 'env7', dimension: 'environmental', text_id: 'Saya menjaga kebersihan lingkungan sekitar', type: 'likert5', reverse: false, weight: 1 },
    { id: 'env8', dimension: 'environmental', text_id: 'Saya menggunakan transportasi ramah lingkungan', type: 'likert5', reverse: false, weight: 1 },

    // CAREER (8)
    { id: 'car1', dimension: 'career', text_id: 'Saya punya gambaran jelas tujuan karir', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'car2', dimension: 'career', text_id: 'Saya tahu skill yang perlu dikembangkan', type: 'likert5', reverse: false, weight: 1 },
    { id: 'car3', dimension: 'career', text_id: 'Saya punya kemampuan komunikasi yang baik', type: 'likert5', reverse: false, weight: 1 },
    { id: 'car4', dimension: 'career', text_id: 'Saya punya pengalaman magang/kerja relevan', type: 'likert5', reverse: false, weight: 1.5 },
    { id: 'car5', dimension: 'career', text_id: 'Saya punya koneksi profesional di bidang saya', type: 'likert5', reverse: false, weight: 1 },
    { id: 'car6', dimension: 'career', text_id: 'Saya punya resume/CV yang diperbarui', type: 'likert5', reverse: false, weight: 1 },
    { id: 'car7', dimension: 'career', text_id: 'Saya percaya diri menghadapi wawancara kerja', type: 'likert5', reverse: false, weight: 1 },
    { id: 'car8', dimension: 'career', text_id: 'Saya aktif mengembangkan personal branding', type: 'likert5', reverse: false, weight: 1 },
];

export function calculateScore(responses: { id: string; value: number }[], dimension: string): number {
    const dimQuestions = assessmentQuestions.filter(q => q.dimension === dimension);
    let total = 0, maxTotal = 0;

    dimQuestions.forEach(q => {
        const r = responses.find(res => res.id === q.id);
        if (r) {
            const val = q.reverse ? (6 - r.value) : r.value;
            total += val * q.weight;
            maxTotal += 5 * q.weight;
        }
    });

    return maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
}

export function getModules() {
    const dims = ['cognitive', 'emotional', 'social', 'physical', 'financial', 'character', 'spiritual', 'environmental', 'career'];
    const names = ['Kognitif', 'Emosional', 'Sosial', 'Fisik', 'Finansial', 'Karakter', 'Spiritual', 'Lingkungan', 'Karir'];
    const icons = ['🧠', '💚', '👥', '💪', '💰', '⭐', '🕊️', '🌿', '💼'];

    return dims.map((d, i) => ({
        module: i + 1,
        dimension: d,
        name: names[i],
        icon: icons[i],
        questions: assessmentQuestions.filter(q => q.dimension === d)
    }));
}
