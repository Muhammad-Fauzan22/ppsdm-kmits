-- ==============================================
-- PPSDM KMITS - PRODUCTION SEED DATA
-- ==============================================

-- ==============================================
-- FACULTIES (Fakultas ITS)
-- ==============================================
INSERT INTO faculties (code, name, description, dean_name, established_year) VALUES
    ('FSAD', 'Fakultas Seni dan Desain', 'Faculty of Arts and Design', 'Prof. Dr. Arief Budiman', 2005),
    ('FTEIC', 'Fakultas Teknik Elektro dan Informatika Cerdas', 'Faculty of Intelligent Electrical and Informatics Engineering', 'Prof. Dr. Eko Mulyanto Yuniarno', 1965),
    ('FTIRS', 'Fakultas Teknologi Industri dan Rekayasa Sistem', 'Faculty of Industrial Technology and Systems Engineering', 'Prof. Dr. Dwi Suteki', 1978),
    ('FSAD', 'Fakultas Desain Kreatif dan Bisnis Digital', 'Faculty of Creative Design and Digital Business', 'Prof. Dr. T. Yudi Utomo', 2005),
    ('FTSPK', 'Fakultas Teknik Sipil, Perencanaan, dan Kebumian', 'Faculty of Civil, Planning, and Geo Engineering', 'Prof. Dr. Joko Sujono', 1965),
    ('FTK', 'Fakultas Teknik Kelautan', 'Faculty of Marine Technology', 'Prof. Dr. Semin', 1982),
    ('FIA', 'Fakultas Ilmu Alam', 'Faculty of Natural Sciences', 'Prof. Dr. R. Denny Irawan', 1995),
    ('FV', 'Fakultas Vokasi', 'Faculty of Vocational Studies', 'Prof. Dr. Ir. Achmad Asad, M.Eng.Sc.', 2017),
    ('FKK', 'Fakultas Kedokteran dan Kesehatan', 'Faculty of Medicine and Health', 'Prof. Dr. dr. Soetrisno, Sp.OG(K)', 2021)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    dean_name = EXCLUDED.dean_name;

-- ==============================================
-- DEPARTMENTS (Departemen ITS)
-- ==============================================

-- Get faculty IDs (we'll use subqueries)
INSERT INTO departments (faculty_id, code, name, head_name, description) VALUES
    -- FTEIC Departments
    ((SELECT id FROM faculties WHERE code = 'FTEIC'), 'ELEKTRO', 'Teknik Elektro', 'Prof. Dr. Arifin', 'Electrical Engineering Department'),
    ((SELECT id FROM faculties WHERE code = 'FTEIC'), 'TEKKOM', 'Teknik Komputer', 'Prof. Dr. Mauridhi Hery Purnomo', 'Computer Engineering Department'),
    ((SELECT id FROM faculties WHERE code = 'FTEIC'), 'IF', 'Teknik Informatika', 'Prof. Dr. Radityo Anggoro', 'Informatics Engineering Department'),
    ((SELECT id FROM faculties WHERE code = 'FTEIC'), 'SI', 'Sistem Informasi', 'Prof. Dr. Riyanarto Sarno', 'Information Systems Department'),
    ((SELECT id FROM faculties WHERE code = 'FTEIC'), 'TI', 'Teknologi Informasi', 'Prof. Dr. Baskoro Adi Pratomo', 'Information Technology Department'),
    
    -- FTIRS Departments
    ((SELECT id FROM faculties WHERE code = 'FTIRS'), 'MESIN', 'Teknik Mesin', 'Prof. Dr. Gunawan Nugroho', 'Mechanical Engineering Department'),
    ((SELECT id FROM faculties WHERE code = 'FTIRS'), 'KIMIA', 'Teknik Kimia', 'Prof. Dr. Tantular Nurtono', 'Chemical Engineering Department'),
    ((SELECT id FROM faculties WHERE code = 'FTIRS'), 'FISIKA', 'Teknik Fisika', 'Prof. Dr. Iwan Kurniawan', 'Engineering Physics Department'),
    ((SELECT id FROM faculties WHERE code = 'FTIRS'), 'INDUSTRI', 'Teknik Industri', 'Prof. Dr. Nurhadi Siswanto', 'Industrial Engineering Department'),
    ((SELECT id FROM faculties WHERE code = 'FTIRS'), 'MT', 'Teknik Material dan Metalurgi', 'Prof. Dr. Bambang Soegijono', 'Materials and Metallurgical Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FTIRS'), 'TB', 'Teknik Biomedik', 'Prof. Dr. Agus Virgono', 'Biomedical Engineering'),
    
    -- FTSPK Departments
    ((SELECT id FROM faculties WHERE code = 'FTSPK'), 'SIPIL', 'Teknik Sipil', 'Prof. Dr. Indrasurya B. Mochtar', 'Civil Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FTSPK'), 'AR', 'Arsitektur', 'Prof. Dr. Imam Santoso', 'Architecture'),
    ((SELECT id FROM faculties WHERE code = 'FTSPK'), 'PW', 'Teknik Perencanaan Wilayah dan Kota', 'Prof. Dr. Bambang Trigunarsyah', 'Urban and Regional Planning'),
    ((SELECT id FROM faculties WHERE code = 'FTSPK'), 'GL', 'Teknik Geomatika', 'Prof. Dr. M. Taufik', 'Geomatics Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FTSPK'), 'GG', 'Teknik Geofisika', 'Prof. Dr. Akmaluddin', 'Geophysical Engineering'),
    
    -- FTK Departments
    ((SELECT id FROM faculties WHERE code = 'FTK'), 'TL', 'Teknik Perkapalan', 'Prof. Dr. Agoes Santoso', 'Naval Architecture and Shipbuilding Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FTK'), 'TK', 'Teknik Kelautan', 'Prof. Dr. Mas Murtedjo', 'Ocean Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FTK'), 'TP', 'Teknik Sistem Perkapalan', 'Prof. Dr. Achmad Fauzan Zakki', 'Marine Engineering'),
    
    -- FIA Departments
    ((SELECT id FROM faculties WHERE code = 'FIA'), 'MA', 'Matematika', 'Prof. Dr. Chairul Imron', 'Mathematics'),
    ((SELECT id FROM faculties WHERE code = 'FIA'), 'FI', 'Fisika', 'Prof. Dr. Heru Setyawan', 'Physics'),
    ((SELECT id FROM faculties WHERE code = 'FIA'), 'KI', 'Kimia', 'Prof. Dr. M. Fahrurrozi', 'Chemistry'),
    ((SELECT id FROM faculties WHERE code = 'FIA'), 'BI', 'Biologi', 'Prof. Dr. Widayani', 'Biology'),
    ((SELECT id FROM faculties WHERE code = 'FIA'), 'AK', 'Aktuaria', 'Prof. Dr. Dharma Lesmono', 'Actuarial Science'),
    ((SELECT id FROM faculties WHERE code = 'FIA'), 'ST', 'Statistika', 'Prof. Dr. Suci Astutik', 'Statistics'),
    
    -- FSAD Departments
    ((SELECT id FROM faculties WHERE code = 'FSAD'), 'PRODI', 'Desain Produk', 'Prof. Dr. Bambang Soemardiono', 'Product Design'),
    ((SELECT id FROM faculties WHERE code = 'FSAD'), 'DKV', 'Desain Komunikasi Visual', 'Prof. Dr. Rachmat Hartono', 'Visual Communication Design'),
    ((SELECT id FROM faculties WHERE code = 'FSAD'), 'DI', 'Desain Interior', 'Prof. Dr. Novita', 'Interior Design'),
    
    -- FKK Departments
    ((SELECT id FROM faculties WHERE code = 'FKK'), 'KEDOKTERAN', 'Pendidikan Dokter', 'Prof. Dr. Soetrisno', 'Medical Doctor Education'),
    
    -- FV (Vocational) Departments - Representing majors
    ((SELECT id FROM faculties WHERE code = 'FV'), 'VOK-ELEKTRO', 'Program Studi Teknik Elektronika', 'Prof. Dr. Suherman', 'Electronics Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FV'), 'VOK-OTOMOTIF', 'Program Studi Teknik Otomotif', 'Prof. Dr. Agung Suwasono', 'Automotive Engineering'),
    ((SELECT id FROM faculties WHERE code = 'FV'), 'VOK-KIMIA', 'Program Studi Teknik Kimia Industri', 'Prof. Dr. Achmad Haryono', 'Industrial Chemical Engineering')
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    head_name = EXCLUDED.head_name,
    description = EXCLUDED.description;

-- ==============================================
-- DEFAULT BADGES
-- ==============================================
INSERT INTO badges (name, description, image_url, category, criteria, rarity, points_value, is_nft_ready) VALUES
    ('First Steps', 'Complete your first lesson', '/badges/first-steps.svg', 'beginner', '{"type": "lesson_complete", "count": 1}', 'common', 10, false),
    ('Quick Learner', 'Complete 5 lessons in one day', '/badges/quick-learner.svg', 'engagement', '{"type": "lessons_per_day", "count": 5}', 'uncommon', 25, false),
    ('Quiz Master', 'Score 100% on 10 quizzes', '/badges/quiz-master.svg', 'assessment', '{"type": "perfect_quizzes", "count": 10}', 'rare', 50, false),
    ('Knowledge Seeker', 'Read 10 ebooks', '/badges/knowledge-seeker.svg', 'reading', '{"type": "ebooks_read", "count": 10}', 'uncommon', 30, false),
    ('Streak Warrior', 'Maintain a 7-day learning streak', '/badges/streak-warrior.svg', 'engagement', '{"type": "streak_days", "count": 7}', 'rare', 50, true),
    ('Course Champion', 'Complete your first course', '/badges/course-champion.svg', 'achievement', '{"type": "course_complete", "count": 1}', 'uncommon', 50, false),
    ('Multi-Course Master', 'Complete 5 courses', '/badges/multi-course.svg', 'achievement', '{"type": "course_complete", "count": 5}', 'rare', 100, true),
    ('Helper', 'Help 3 peers with reviews', '/badges/helper.svg', 'social', '{"type": "peer_reviews", "count": 3}', 'common', 15, false),
    ('AI Explorer', 'Have 10 conversations with Kimi AI', '/badges/ai-explorer.svg', 'ai', '{"type": "ai_chats", "count": 10}', 'uncommon', 25, false),
    ('Early Adopter', 'Join during the beta phase', '/badges/early-adopter.svg', 'special', '{"type": "beta_join"}', 'legendary', 100, true),
    ('Study Group Leader', 'Create a study group with 5+ members', '/badges/group-leader.svg', 'social', '{"type": "study_group_size", "count": 5}', 'epic', 75, true),
    ('Night Owl', 'Study after midnight', '/badges/night-owl.svg', 'engagement', '{"type": "late_night_study"}', 'uncommon', 20, false),
    ('Weekend Warrior', 'Study 4 hours on a weekend', '/badges/weekend-warrior.svg', 'engagement', '{"type": "weekend_hours", "count": 4}', 'common', 15, false),
    ('Perfect Week', 'Study every day for a week', '/badges/perfect-week.svg', 'engagement', '{"type": "weekly_streak", "count": 7}', 'rare', 50, true),
    ('Mentor', 'Help 10 students with peer reviews', '/badges/mentor.svg', 'social', '{"type": "peer_reviews", "count": 10}', 'epic', 100, true)
ON CONFLICT (name) DO UPDATE SET 
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    criteria = EXCLUDED.criteria,
    rarity = EXCLUDED.rarity,
    points_value = EXCLUDED.points_value;

-- ==============================================
-- SAMPLE COURSES (for testing)
-- ==============================================
INSERT INTO courses (code, title, description, category, difficulty, duration_minutes, credit_points, is_published, is_featured, learning_objectives, tags) VALUES
    ('PPSDM-001', 'Pengenalan Kehidupan Kampus', 'Panduan lengkap untuk mahasiswa baru di lingkungan ITS', 'orientation', 'beginner', 180, 2, true, true, 
     '["Memahami struktur organisasi ITS", "Mengenal fasilitas kampus", "Mengetahui tata tertib akademik", "Mengenal ormawa"]',
     ARRAY['orientation', 'new-student', 'campus-life']),
     
    ('PPSDM-002', 'Manajemen Organisasi Mahasiswa', 'Panduan praktis memimpin dan mengelola organisasi kemahasiswaan', 'leadership', 'intermediate', 240, 3, true, true,
     '["Memahami struktur organisasi", "Teknik komunikasi organisasi", "Manajemen proker", "Pelaporan kegiatan"]',
     ARRAY['leadership', 'organization', 'management']),
     
    ('PPSDM-003', 'Soft Skills untuk Kepemimpinan', 'Mengembangkan kemampuan interpersonal dan leadership', 'soft-skills', 'intermediate', 300, 3, true, false,
     '["Public speaking", "Time management", "Conflict resolution", "Team building"]',
     ARRAY['soft-skills', 'leadership', 'personal-development']),
     
    ('PPSDM-004', 'Literasi Digital', 'Pemanfaatan teknologi digital untuk akademik dan organisasi', 'digital', 'beginner', 120, 2, true, false,
     '["Menggunakan Google Workspace", "Manajemen media sosial", "Tools kolaborasi online", "Keamanan digital"]',
     ARRAY['digital', 'technology', 'literacy']),
     
    ('PPSDM-005', 'Kewirausahaan Mahasiswa', 'Membangun mindset dan keterampilan entrepreneurship', 'entrepreneurship', 'advanced', 360, 4, true, true,
     '["Business model canvas", "Validasi ide bisnis", "Pitching", "Manajemen keuangan usaha"]',
     ARRAY['entrepreneurship', 'business', 'innovation'])
ON CONFLICT (code) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    difficulty = EXCLUDED.difficulty;

-- ==============================================
-- EBOOKS (sample data for Great Ingestion)
-- ==============================================
INSERT INTO ebooks (title, author, publisher, description, category, difficulty_level, estimated_reading_time_minutes, is_processed, processing_status, tags) VALUES
    ('Atomic Habits', 'James Clear', 'Penguin Random House', 'Cara mengubah kebiasaan kecil yang membawa hasil luar biasa', 'self-improvement', 'beginner', 240, false, 'pending', ARRAY['habits', 'productivity', 'psychology']),
    ('The 7 Habits of Highly Effective People', 'Stephen Covey', 'Free Press', '7 kebiasaan fundamental untuk kesuksesan personal dan profesional', 'self-improvement', 'intermediate', 300, false, 'pending', ARRAY['effectiveness', 'leadership', 'personal-development']),
    ('Mindset: The New Psychology of Success', 'Carol Dweck', 'Ballantine Books', 'Perbedaan mindset fixed vs growth dan dampaknya pada kesuksesan', 'psychology', 'beginner', 180, false, 'pending', ARRAY['psychology', 'mindset', 'education']),
    ('Emotional Intelligence', 'Daniel Goleman', 'Bantam Books', 'Kecerdasan emosional dan pentingnya dalam kehidupan', 'psychology', 'intermediate', 360, false, 'pending', ARRAY['emotional-intelligence', 'psychology', 'self-awareness']),
    ('Leaders Eat Last', 'Simon Sinek', 'Portfolio', 'Mengapa tim yang baik membutuhkan pemimpin yang peduli', 'leadership', 'intermediate', 270, false, 'pending', ARRAY['leadership', 'management', 'teamwork']),
    ('Thinking, Fast and Slow', 'Daniel Kahneman', 'Farrar, Straus and Giroux', 'Dua sistem berpikir manusia dan bias kognitif', 'psychology', 'advanced', 480, false, 'pending', ARRAY['psychology', 'decision-making', 'cognitive-science']),
    ('Drive', 'Daniel Pink', 'Riverhead Books', 'Motivasi intrinsik dan apa yang benar-benar membuat kita termotivasi', 'psychology', 'beginner', 210, false, 'pending', ARRAY['motivation', 'psychology', 'work']),
    ('Deep Work', 'Cal Newport', 'Grand Central Publishing', 'Aturan untuk fokus pada tugas yang bernilai tinggi di dunia yang penuh distraksi', 'productivity', 'intermediate', 195, false, 'pending', ARRAY['productivity', 'focus', 'work']),
    ('Grit', 'Angela Duckworth', 'Scribner', 'Kekuatan passion dan perseverance dalam meraih kesuksesan jangka panjang', 'psychology', 'beginner', 240, false, 'pending', ARRAY['grit', 'perseverance', 'success']),
    ('Essentialism', 'Greg McKeown', 'Crown Business', 'Disiplined pursuit of less untuk hasil yang lebih baik', 'productivity', 'intermediate', 180, false, 'pending', ARRAY['productivity', 'focus', 'minimalism']),
    ('The Power of Habit', 'Charles Duhigg', 'Random House', 'Ilmu di balik kebiasaan dan cara mengubahnya', 'psychology', 'beginner', 210, false, 'pending', ARRAY['habits', 'psychology', 'change']),
    ('Lean In', 'Sheryl Sandberg', 'Knopf', 'Wanita, pekerjaan, dan keinginan untuk memimpin', 'leadership', 'intermediate', 240, false, 'pending', ARRAY['leadership', 'women', 'career']),
    ('Outliers', 'Malcolm Gladwell', 'Little, Brown and Company', 'Kisah sukses dan faktor-faktor yang mempengaruhi', 'psychology', 'beginner', 225, false, 'pending', ARRAY['success', 'psychology', 'sociology']),
    ('The Lean Startup', 'Eric Ries', 'Crown Business', 'Cara membangun startup yang sukses dengan cepat', 'business', 'intermediate', 240, false, 'pending', ARRAY['startup', 'business', 'entrepreneurship']),
    ('Zero to One', 'Peter Thiel', 'Crown Business', 'Catatan tentang startup atau cara membangun masa depan', 'business', 'advanced', 180, false, 'pending', ARRAY['startup', 'business', 'innovation']),
    ('How to Win Friends and Influence People', 'Dale Carnegie', 'Simon & Schuster', 'Keterampilan sosial fundamental untuk sukses', 'self-improvement', 'beginner', 180, false, 'pending', ARRAY['communication', 'relationships', 'success']),
    ('The 5 AM Club', 'Robin Sharma', 'HarperCollins', 'Menguasai pagi hari untuk menguasai hidup Anda', 'productivity', 'beginner', 210, false, 'pending', ARRAY['morning-routine', 'productivity', 'success']),
    ('Start with Why', 'Simon Sinek', 'Portfolio', 'Bagaimana pemimpin hebat menginspirasi aksi', 'leadership', 'beginner', 180, false, 'pending', ARRAY['leadership', 'purpose', 'inspiration']),
    ('Crucial Conversations', 'Kerry Patterson', 'McGraw-Hill', 'Tools untuk berbicara saat taruhannya tinggi', 'communication', 'intermediate', 240, false, 'pending', ARRAY['communication', 'conflict', 'negotiation']),
    ('Dare to Lead', 'Brené Brown', 'Random House', 'Keberanian dalam kepemimpinan', 'leadership', 'intermediate', 270, false, 'pending', ARRAY['leadership', 'vulnerability', 'courage'])
ON CONFLICT DO NOTHING;

-- ==============================================
-- SYSTEM CONFIG
-- ==============================================
-- Create a config table for system settings
CREATE TABLE IF NOT EXISTS system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config
INSERT INTO system_config (key, value, description) VALUES
    ('ai_providers', '{"primary": "groq", "fallback": "openrouter", "free": "puter"}', 'AI provider configuration'),
    ('features_enabled', '{"kimi_tutor": true, "adaptive_learning": true, "gamification": true, "peer_review": true, "offline_mode": true}', 'Feature flags'),
    ('limits', '{"max_chat_per_day": 50, "max_upload_size_mb": 50, "free_storage_mb": 100}', 'System limits'),
    ('integrations', '{"sentry_enabled": false, "upstash_enabled": false, "judge0_enabled": false}', 'Integration settings')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description;
