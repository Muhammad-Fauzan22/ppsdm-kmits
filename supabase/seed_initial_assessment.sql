-- =============================================
-- INITIAL ASSESSMENT SEED (EXPANDED)
-- =============================================

-- Ensure dimensions exist
INSERT INTO public.dimensions (id, name, description) VALUES
('dim_cognitive', 'Kognitif & Intelektual', 'Evaluasi kemampuan berpikir kritis, analisis, dan kreativitas.'),
('dim_self_mgmt', 'Manajemen Diri & Produktivitas', 'Kemampuan mengelola waktu, tugas, dan pengembangan diri.'),
('dim_financial', 'Kecerdasan Finansial', 'Pemahaman tentang manajemen keuangan pribadi dan literasi ekonomi.'),
('dim_physical', 'Kesehatan Fisik & Vitalitas', 'Kondisi kesehatan fisik, pola hidup, dan energi.'),
('dim_emotional', 'Kecerdasan Emosional & Sosial', 'Kemampuan mengelola emosi dan berinteraksi sosial.'),
('dim_mental', 'Kesehatan Mental & Psikologis', 'Kesejahteraan mental, resiliensi, dan pola pikir positif.'),
('dim_character', 'Karakter & Etika', 'Integritas, etika profesi, dan nilai-nilai moral.'),
('dim_spiritual', 'Pengembangan Spiritual', 'Kesadaran spiritual, makna hidup, dan kedamaian batin.'),
('dim_environmental', 'Manajemen Lingkungan', 'Kesadaran dan aksi nyata terhadap lingkungan.')
ON CONFLICT (id) DO NOTHING;

-- Insert Questions (Sample of expanded set - 5 per dimension = 45 total)
INSERT INTO public.questions (dimension_id, text, type) VALUES
-- Cognitive
('dim_cognitive', 'Saya mampu menganalisis masalah kompleks menjadi bagian-bagian yang lebih kecil.', 'scale'),
('dim_cognitive', 'Saya sering mencari solusi inovatif untuk tantangan yang saya hadapi.', 'scale'),
('dim_cognitive', 'Saya mudah memahami konsep baru yang abstrak.', 'scale'),
('dim_cognitive', 'Saya dapat mengevaluasi argumen secara objektif tanpa bias.', 'scale'),
('dim_cognitive', 'Saya terus belajar hal baru di luar bidang studi utama saya.', 'scale'),

-- Self Management
('dim_self_mgmt', 'Saya memiliki rutinitas harian yang produktif dan konsisten.', 'scale'),
('dim_self_mgmt', 'Saya menetapkan prioritas yang jelas setiap hari.', 'scale'),
('dim_self_mgmt', 'Saya jarang menunda pekerjaan penting hingga detik terakhir.', 'scale'),
('dim_self_mgmt', 'Saya memiliki tujuan jangka panjang yang spesifik dan terukur.', 'scale'),
('dim_self_mgmt', 'Saya mampu menyeimbangkan waktu antara kuliah, organisasi, dan istirahat.', 'scale'),

-- Financial
('dim_financial', 'Saya mencatat setiap pemasukan dan pengeluaran bulanan saya.', 'scale'),
('dim_financial', 'Saya memiliki rencana tabungan atau investasi rutin.', 'scale'),
('dim_financial', 'Saya memahami perbedaan antara kebutuhan dan keinginan sebelum membeli sesuatu.', 'scale'),
('dim_financial', 'Saya memiliki dana darurat untuk situasi tak terduga.', 'scale'),
('dim_financial', 'Saya paham dasar-dasar instrumen investasi (saham, reksadana, dll).', 'scale'),

-- Physical
('dim_physical', 'Saya tidur cukup (7-8 jam) setiap malam secara berkualitas.', 'scale'),
('dim_physical', 'Saya rutin berolahraga minimal 3 kali seminggu.', 'scale'),
('dim_physical', 'Saya memperhatikan nutrisi makanan yang saya konsumsi.', 'scale'),
('dim_physical', 'Saya jarang merasa lelah berlebihan tanpa alasan jelas.', 'scale'),
('dim_physical', 'Saya rutin melakukan pemeriksaan kesehatan berkala.', 'scale'),

-- Emotional
('dim_emotional', 'Saya sadar dan bisa menamai emosi yang saya rasakan saat itu terjadi.', 'scale'),
('dim_emotional', 'Saya mampu tetap tenang di bawah tekanan tinggi.', 'scale'),
('dim_emotional', 'Saya mudah berempati terhadap perasaan orang lain.', 'scale'),
('dim_emotional', 'Saya bisa mengelola konflik dengan orang lain secara konstruktif.', 'scale'),
('dim_emotional', 'Saya memiliki hubungan sosial yang mendukung dan positif.', 'scale'),

-- Mental
('dim_mental', 'Saya merasa optimis tentang masa depan saya.', 'scale'),
('dim_mental', 'Saya bisa bangkit kembali dengan cepat setelah mengalami kegagalan.', 'scale'),
('dim_mental', 'Saya memiliki cara efektif untuk mengatasi stres.', 'scale'),
('dim_mental', 'Saya merasa hidup saya bermakna dan memuaskan.', 'scale'),
('dim_mental', 'Saya jarang merasa cemas berlebihan tentang hal-hal kecil.', 'scale'),

-- Character
('dim_character', 'Saya selalu bertindak jujur meskipun tidak ada yang melihat.', 'scale'),
('dim_character', 'Saya memegang teguh janji yang telah saya buat.', 'scale'),
('dim_character', 'Saya bertanggung jawab penuh atas kesalahan yang saya buat.', 'scale'),
('dim_character', 'Saya menghargai perbedaan pendapat dan keberagaman.', 'scale'),
('dim_character', 'Saya menjunjung tinggi etika akademik/profesional dalam setiap tindakan.', 'scale'),

-- Spiritual
('dim_spiritual', 'Saya meluangkan waktu untuk refleksi diri atau ibadah setiap hari.', 'scale'),
('dim_spiritual', 'Saya merasa terhubung dengan sesuatu yang lebih besar dari diri saya.', 'scale'),
('dim_spiritual', 'Saya memiliki prinsip nilai yang membimbing keputusan hidup saya.', 'scale'),
('dim_spiritual', 'Saya merasa damai dengan diri sendiri.', 'scale'),
('dim_spiritual', 'Saya mempraktikkan rasa syukur secara rutin.', 'scale'),

-- Environmental
('dim_environmental', 'Saya aktif mengurangi penggunaan plastik sekali pakai.', 'scale'),
('dim_environmental', 'Saya memilah sampah sesuai kategorinya.', 'scale'),
('dim_environmental', 'Saya sadar akan dampak jejak karbon dari gaya hidup saya.', 'scale'),
('dim_environmental', 'Saya berupaya menghemat energi (listrik/air) sehari-hari.', 'scale'),
('dim_environmental', 'Saya mendukung inisiatif atau produk yang ramah lingkungan.', 'scale');
