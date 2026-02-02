-- ============================================================================
-- PPSDM KMM - Assessment Tables Migration
-- ============================================================================
-- Tabel tambahan untuk sistem assessment 9 dimensi
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ASSESSMENT QUESTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dimension VARCHAR(20) NOT NULL CHECK (dimension IN (
        'cognitive', 'self-management', 'financial', 'physical',
        'emotional', 'mental-health', 'character', 'spiritual', 'environmental'
    )),
    question_id VARCHAR(50) NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    sub_dimension VARCHAR(50) NOT NULL,
    reverse_scored BOOLEAN DEFAULT FALSE,
    item_parameter_b DECIMAL(5,2) DEFAULT 0,  -- Difficulty parameter (IRT)
    item_parameter_a DECIMAL(5,2) DEFAULT 1,  -- Discrimination parameter (IRT)
    item_parameter_c DECIMAL(5,2) DEFAULT 0,  -- Guessing parameter (IRT)
    cronbach_alpha DECIMAL(4,2) DEFAULT 0.84,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for questions
CREATE INDEX IF NOT EXISTS idx_assessment_questions_dimension ON assessment_questions(dimension);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_question_id ON assessment_questions(question_id);

-- ============================================================================
-- ASSESSMENT RESPONSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    question_id VARCHAR(50) NOT NULL,
    response_value INTEGER CHECK (response_value BETWEEN 1 AND 5),
    time_spent_ms INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_id, question_id)
);

-- Indexes for responses
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_id ON assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_session_id ON assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_responses_dimension ON assessment_responses(dimension);

-- ============================================================================
-- ASSESSMENT SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('in_progress', 'completed', 'abandoned')) DEFAULT 'in_progress',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    total_time_ms INTEGER DEFAULT 0,
    consent_given BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for sessions
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_user_id ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_sessions_status ON assessment_sessions(status);

-- ============================================================================
-- ASSESSMENT PROGRESS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    current_question INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_ms INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dimension)
);

-- Indexes for progress
CREATE INDEX IF NOT EXISTS idx_assessment_progress_user_id ON assessment_progress(user_id);

-- ============================================================================
-- ASSESSMENT RESULTS TABLE (Per Dimension)
-- ============================================================================
CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID NOT NULL,
    dimension VARCHAR(20) NOT NULL,
    raw_score DECIMAL(5,2) NOT NULL,
    adjusted_score DECIMAL(5,2) NOT NULL,
    percentile INTEGER NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Expert', 'Advanced', 'Competent', 'Developing', 'Beginner')),
    theta DECIMAL(5,3),  -- IRT theta estimate
    se DECIMAL(5,3),     -- Standard error
    confidence_interval_low DECIMAL(5,2),
    confidence_interval_high DECIMAL(5,2),
    interpretation TEXT NOT NULL,
    strengths TEXT[] DEFAULT '{}',
    growth_areas TEXT[] DEFAULT '{}',
    recommendations TEXT[] DEFAULT '{}',
    subscores JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_id, dimension)
);

-- Indexes for results
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_session_id ON assessment_results(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_dimension ON assessment_results(dimension);

-- ============================================================================
-- HOLISTIC ASSESSMENT RESULTS TABLE (Overall)
-- ============================================================================
CREATE TABLE IF NOT EXISTS holistic_assessment_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    balance_index DECIMAL(5,2) NOT NULL,
    profile_type VARCHAR(50) NOT NULL,
    profile_description TEXT NOT NULL,
    dominant_dimensions TEXT[] DEFAULT '{}',
    development_priorities TEXT[] DEFAULT '{}',
    quadrant_scores JSONB DEFAULT '{}',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, session_id)
);

-- Indexes for holistic results
CREATE INDEX IF NOT EXISTS idx_holistic_results_user_id ON holistic_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_holistic_results_session_id ON holistic_assessment_results(session_id);

-- ============================================================================
-- CRISIS ALERTS TABLE (Mental Health Safety)
-- ============================================================================
CREATE TABLE IF NOT EXISTS crisis_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_id UUID NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    alert_triggered BOOLEAN DEFAULT FALSE,
    recommendations TEXT[] DEFAULT '{}',
    referred_to_professional BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for crisis alerts
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_user_id ON crisis_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_crisis_alerts_severity ON crisis_alerts(severity);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assessment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_assessment_sessions_updated_at ON assessment_sessions;
CREATE TRIGGER update_assessment_sessions_updated_at
    BEFORE UPDATE ON assessment_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_assessment_updated_at();

DROP TRIGGER IF EXISTS update_assessment_progress_updated_at ON assessment_progress;
CREATE TRIGGER update_assessment_progress_updated_at
    BEFORE UPDATE ON assessment_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_assessment_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE holistic_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;

-- Assessment Questions (Public read)
DROP POLICY IF EXISTS "Questions viewable by everyone" ON assessment_questions;
CREATE POLICY "Questions viewable by everyone"
    ON assessment_questions FOR SELECT
    TO authenticated, anon
    USING (true);

-- Assessment Responses (User owns their responses)
DROP POLICY IF EXISTS "Users can view own responses" ON assessment_responses;
CREATE POLICY "Users can view own responses"
    ON assessment_responses FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own responses" ON assessment_responses;
CREATE POLICY "Users can create own responses"
    ON assessment_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own responses" ON assessment_responses;
CREATE POLICY "Users can update own responses"
    ON assessment_responses FOR UPDATE
    USING (auth.uid() = user_id);

-- Assessment Sessions
DROP POLICY IF EXISTS "Users can manage own sessions" ON assessment_sessions;
CREATE POLICY "Users can manage own sessions"
    ON assessment_sessions FOR ALL
    USING (auth.uid() = user_id);

-- Assessment Progress
DROP POLICY IF EXISTS "Users can manage own progress" ON assessment_progress;
CREATE POLICY "Users can manage own progress"
    ON assessment_progress FOR ALL
    USING (auth.uid() = user_id);

-- Assessment Results
DROP POLICY IF EXISTS "Users can view own results" ON assessment_results;
CREATE POLICY "Users can view own results"
    ON assessment_results FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own results" ON assessment_results;
CREATE POLICY "Users can create own results"
    ON assessment_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Holistic Assessment Results
DROP POLICY IF EXISTS "Users can view own holistic results" ON holistic_assessment_results;
CREATE POLICY "Users can view own holistic results"
    ON holistic_assessment_results FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own holistic results" ON holistic_assessment_results;
CREATE POLICY "Users can create own holistic results"
    ON holistic_assessment_results FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Crisis Alerts (User owns their alerts, admin can view all)
DROP POLICY IF EXISTS "Users can view own crisis alerts" ON crisis_alerts;
CREATE POLICY "Users can view own crisis alerts"
    ON crisis_alerts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own crisis alerts" ON crisis_alerts;
CREATE POLICY "Users can create own crisis alerts"
    ON crisis_alerts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all crisis alerts" ON crisis_alerts;
CREATE POLICY "Service role can manage all crisis alerts"
    ON crisis_alerts FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- ============================================================================
-- SEED DATA: Assessment Questions
-- ============================================================================

INSERT INTO assessment_questions (dimension, question_id, question_text, sub_dimension, reverse_scored, item_parameter_b, item_parameter_a) VALUES

-- DIMENSI 1: KOGNITIF (α = 0.87)
('cognitive', 'COG_CT1', 'Saya mampu menganalisis informasi dari berbagai sumber sebelum membuat keputusan.', 'Critical Thinking', FALSE, -0.5, 1.2),
('cognitive', 'COG_CT2', 'Saya dapat mengidentifikasi bias dan asumsi dalam argumen orang lain.', 'Critical Thinking', FALSE, 0.2, 1.1),
('cognitive', 'COG_GM1', 'Saya percaya bahwa kemampuan intelektual dapat dikembangkan melalui usaha.', 'Growth Mindset', FALSE, -0.8, 1.3),
('cognitive', 'COG_GM2', 'Saya melihat kegagalan sebagai kesempatan untuk belajar, bukan sebagai akhir.', 'Growth Mindset', FALSE, 0.1, 1.2),
('cognitive', 'COG_CRE1', 'Saya sering menghasilkan ide-ide baru dan berbeda untuk menyelesaikan masalah.', 'Creativity', FALSE, -0.3, 1.1),
('cognitive', 'COG_CRE2', 'Saya mampu melihat koneksi antara hal-hal yang tidak terkait.', 'Creativity', FALSE, 0.4, 1.0),
('cognitive', 'COG_MET1', 'Saya menyadari ketika saya tidak memahami sesuatu dan mencari cara untuk memahami.', 'Metacognition', FALSE, -0.6, 1.4),
('cognitive', 'COG_MET2', 'Saya secara rutin mengevaluasi pemahaman saya terhadap materi yang dipelajari.', 'Metacognition', FALSE, 0.0, 1.3),

-- DIMENSI 2: MANAJEMEN DIRI (α = 0.87)
('self-management', 'SM_TM1', 'Saya dapat mengelola waktu saya secara efektif untuk menyelesaikan tugas.', 'Time Management', FALSE, -0.4, 1.3),
('self-management', 'SM_TM2', 'Saya selalu membuat jadwal atau rencana sebelum memulai proyek.', 'Time Management', FALSE, 0.2, 1.2),
('self-management', 'SM_PROC1', 'Saya sering menunda-nunda tugas penting meskipun tahu harus segera mengerjakannya.', 'Procrastination', TRUE, 0.5, 1.4),
('self-management', 'SM_SC1', 'Saya mampu fokus pada tugas meskipun ada distraksi di sekitar.', 'Self-Control', FALSE, -0.2, 1.2),
('self-management', 'SM_SC2', 'Saya dapat mengendalikan dorongan untuk hal-hal yang mengganggu produktivitas.', 'Self-Control', FALSE, 0.3, 1.1),
('self-management', 'SM_DW1', 'Saya dapat fokus dalam waktu lama pada tugas yang membutuhkan konsentrasi tinggi.', 'Deep Work', FALSE, 0.1, 1.4),
('self-management', 'SM_EM1', 'Saya mengatur energi saya sepanjang hari untuk memaksimalkan produktivitas.', 'Energy Management', FALSE, -0.1, 1.1),
('self-management', 'SM_PRIOR1', 'Saya mampu memprioritaskan tugas berdasarkan pentingnya dan urgensinya.', 'Prioritization', FALSE, -0.3, 1.3),

-- DIMENSI 3: FINANSIAL (α = 0.85)
('financial', 'FIN_KNOW1', 'Saya memahami perbedaan antara kebutuhan dan keinginan dalam pengeluaran.', 'Financial Knowledge', FALSE, -0.6, 1.0),
('financial', 'FIN_KNOW2', 'Saya tahu cara menghitung bunga majemuk untuk investasi.', 'Financial Knowledge', FALSE, 0.5, 1.1),
('financial', 'FIN_KNOW3', 'Saya memahami prinsip dasar diversifikasi risiko dalam investasi.', 'Financial Knowledge', FALSE, 0.8, 1.2),
('financial', 'FIN_BEH1', 'Saya membuat anggaran bulanan dan menepatinya.', 'Financial Behavior', FALSE, -0.2, 1.3),
('financial', 'FIN_BEH2', 'Saya menabung secara rutin setiap bulan.', 'Financial Behavior', FALSE, 0.0, 1.2),
('financial', 'FIN_BEH3', 'Saya selalu mencatat pengeluaran harian.', 'Financial Behavior', FALSE, 0.3, 1.1),
('financial', 'FIN_EFF1', 'Saya percaya diri dalam membuat keputusan keuangan jangka panjang.', 'Financial Self-Efficacy', FALSE, -0.4, 1.0),
('financial', 'FIN_EFF2', 'Saya merasa mampu mengatasi masalah keuangan yang tidak terduga.', 'Financial Self-Efficacy', FALSE, 0.1, 1.1),

-- DIMENSI 4: KESEHATAN FISIK (α = 0.84)
('physical', 'PHY_ACT1', 'Saya melakukan aktivitas fisik (jalan, olahraga) minimal 30 menit setiap hari.', 'Physical Activity', FALSE, 0.0, 1.3),
('physical', 'PHY_SLP1', 'Saya tidur 7-8 jam setiap malam dan merasa cukup istirahat.', 'Sleep Quality', FALSE, -0.5, 1.4),
('physical', 'PHY_NUT1', 'Saya mengonsumsi makanan seimbang dengan sayuran dan buah-buahan.', 'Nutrition', FALSE, -0.1, 1.2),
('physical', 'PHY_VIT1', 'Saya merasa penuh energi sepanjang hari.', 'Vitality', FALSE, -0.6, 1.1),
('physical', 'PHY_HYDR1', 'Saya minum air yang cukup (minimal 8 gelas) setiap hari.', 'Hydration', FALSE, 0.2, 0.9),
('physical', 'PHY_STR1', 'Saya mampu mengelola stres dengan baik.', 'Stress Management', FALSE, -0.3, 1.3),
('physical', 'PHY_PREV1', 'Saya melakukan pemeriksaan kesehatan secara berkala.', 'Preventive Care', FALSE, 0.4, 1.1),
('physical', 'PHY_BODY1', 'Saya aware terhadap perubahan kondisi tubuh saya.', 'Body Awareness', FALSE, -0.2, 1.0),

-- DIMENSI 5: EMOSIONAL (α = 0.84)
('emotional', 'EI_SA1', 'Saya dapat mengidentifikasi emosi yang saya rasakan dengan tepat.', 'Self-Awareness', FALSE, -0.4, 1.3),
('emotional', 'EI_EMP1', 'Saya dapat merasakan apa yang orang lain rasakan.', 'Empathy', FALSE, -0.2, 1.2),
('emotional', 'EI_EMP2', 'Saya mencoba melihat situasi dari sudut pandang orang lain.', 'Empathy', FALSE, -0.3, 1.1),
('emotional', 'EI_REG1', 'Saya tetap tenang dalam situasi yang menekan.', 'Emotion Regulation', FALSE, 0.1, 1.4),
('emotional', 'EI_REG2', 'Saya dapat mengendalikan emosi negatif saya dengan baik.', 'Emotion Regulation', FALSE, 0.0, 1.3),
('emotional', 'EI_SOC1', 'Saya mudah beradaptasi dengan situasi sosial baru.', 'Social Skills', FALSE, -0.3, 1.2),
('emotional', 'EI_SOC2', 'Saya mampu membangun hubungan baik dengan orang lain.', 'Social Skills', FALSE, -0.5, 1.1),
('emotional', 'EI_CON1', 'Saya dapat menyelesaikan konflik dengan cara yang konstruktif.', 'Conflict Resolution', FALSE, 0.0, 1.2),

-- DIMENSI 6: KESEHATAN MENTAL (α = 0.86)
('mental-health', 'MH_WB1', 'Saya merasa bahagia dengan kehidupan saya secara umum.', 'Emotional Wellbeing', FALSE, -0.5, 1.4),
('mental-health', 'MH_WB2', 'Saya merasa hidup memiliki tujuan dan makna.', 'Psychological Wellbeing', FALSE, -0.3, 1.3),
('mental-health', 'MH_WB3', 'Saya merasa terhubung dengan orang lain dan komunitas.', 'Social Wellbeing', FALSE, -0.2, 1.2),
('mental-health', 'MH_RES1', 'Saya dapat bangkit dari kegagalan dan kekecewaan.', 'Resilience', FALSE, -0.4, 1.4),
('mental-health', 'MH_RES2', 'Saya percaya bahwa saya dapat mengatasi tantangan hidup.', 'Resilience', FALSE, -0.6, 1.3),
('mental-health', 'MH_STR1', 'Saya jarang merasa overwhelmed dengan tanggung jawab.', 'Stress Management', TRUE, 0.2, 1.5),
('mental-health', 'MH_MIN1', 'Saya fokus pada saat ini daripada khawatir tentang masa depan.', 'Mindfulness', FALSE, 0.0, 1.2),
('mental-health', 'MH_SAT1', 'Saya puas dengan kehidupan saya saat ini.', 'Life Satisfaction', FALSE, -0.4, 1.3),

-- DIMENSI 7: KARAKTER (α = 0.84)
('character', 'CH_INT1', 'Saya selalu jujur, bahkan ketika itu sulit.', 'Integrity', FALSE, 0.0, 1.4),
('character', 'CH_COU1', 'Saya berani mempertahankan prinsip saya, meskipun sendirian.', 'Courage', FALSE, 0.3, 1.3),
('character', 'CH_FAI1', 'Saya memperlakukan semua orang dengan adil, tanpa memandang latar belakang.', 'Fairness', FALSE, -0.5, 1.2),
('character', 'CH_RES1', 'Saya bertanggung jawab atas keputusan dan tindakan saya.', 'Responsibility', FALSE, -0.4, 1.3),
('character', 'CH_HUM1', 'Saya mengakui keterbatasan dan kesalahan saya.', 'Humility', FALSE, 0.2, 1.2),
('character', 'CH_COM1', 'Saya peduli terhadap kesejahteraan orang lain.', 'Compassion', FALSE, -0.3, 1.3),
('character', 'CH_DISC1', 'Saya dapat mengendalikan impuls dan desires jangka pendek.', 'Self-Discipline', FALSE, 0.0, 1.3),
('character', 'CH_ETH1', 'Saya mempertimbangkan dampak etis dari keputusan saya.', 'Ethical Reasoning', FALSE, 0.1, 1.2),

-- DIMENSI 8: SPIRITUAL (α = 0.85)
('spiritual', 'SP_PUR1', 'Saya memiliki tujuan hidup yang jelas.', 'Purpose & Meaning', FALSE, -0.2, 1.4),
('spiritual', 'SP_PUR2', 'Saya merasa hidup saya memiliki makna yang lebih besar.', 'Purpose & Meaning', FALSE, 0.0, 1.3),
('spiritual', 'SP_GRAT1', 'Saya merasa bersyukur atas hal-hal positif dalam hidup saya.', 'Gratitude', FALSE, -0.5, 1.3),
('spiritual', 'SP_GRAT2', 'Saya mengungkapkan apresiasi kepada orang lain secara rutin.', 'Gratitude', FALSE, 0.1, 1.1),
('spiritual', 'SP_CON1', 'Saya merasa terhubung dengan alam dan komunitas yang lebih besar.', 'Connection', FALSE, 0.0, 1.2),
('spiritual', 'SP_CON2', 'Saya merasa menjadi bagian dari sesuatu yang lebih besar dari diri sendiri.', 'Connection', FALSE, -0.1, 1.3),
('spiritual', 'SP_ALT1', 'Saya aktif membantu orang lain tanpa mengharapkan imbalan.', 'Altruism', FALSE, 0.2, 1.2),
('spiritual', 'SP_CONT1', 'Saya berkontribusi pada komunitas atau社会 melalui aktivitas bermakna.', 'Contribution', FALSE, 0.3, 1.1),

-- DIMENSI 9: LINGKUNGAN (α = 0.83)
('environmental', 'ENV_AWA1', 'Saya sadar akan dampak lingkungan dari tindakan sehari-hari.', 'Environmental Awareness', FALSE, -0.4, 1.2),
('environmental', 'ENV_AWA2', 'Saya mengikuti berita dan perkembangan isu lingkungan.', 'Environmental Awareness', FALSE, 0.2, 1.0),
('environmental', 'ENV_BEH1', 'Saya mengurangi penggunaan plastik sekali pakai.', 'Sustainable Behavior', FALSE, 0.0, 1.1),
('environmental', 'ENV_BEH2', 'Saya hemat energi (listrik, air) di kehidupan sehari-hari.', 'Sustainable Behavior', FALSE, 0.1, 1.0),
('environmental', 'ENV_WLB1', 'Saya menjaga keseimbangan antara kerja/studi dan kehidupan pribadi.', 'Work-Life Balance', FALSE, 0.0, 1.3),
('environmental', 'ENV_WLB2', 'Saya meluangkan waktu untuk hobi dan relaksasi.', 'Work-Life Balance', FALSE, -0.2, 1.2),
('environmental', 'ENV_DIG1', 'Saya mengatur waktu penggunaan gadget dan media sosial.', 'Digital Wellbeing', FALSE, 0.2, 1.1),
('environmental', 'ENV_DIG2', 'Saya dapat disconnect dari teknologi ketika dibutuhkan.', 'Digital Wellbeing', FALSE, 0.3, 1.2)

ON CONFLICT (question_id) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE assessment_questions IS 'Bank pertanyaan assessment dengan parameter IRT';
COMMENT ON TABLE assessment_responses IS 'Jawaban user per pertanyaan assessment';
COMMENT ON TABLE assessment_sessions IS 'Sesi assessment user';
COMMENT ON TABLE assessment_progress IS 'Progress per dimensi untuk setiap user';
COMMENT ON TABLE assessment_results IS 'Hasil scoring per dimensi';
COMMENT ON TABLE holistic_assessment_results IS 'Hasil holistik keseluruhan 9 dimensi';
COMMENT ON TABLE crisis_alerts IS 'Alert untuk deteksi krisis kesehatan mental';