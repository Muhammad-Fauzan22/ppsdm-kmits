-- ============================================
-- PPSDM KMM - Assessment & Gap Analysis Schema
-- ============================================
-- Jalankan script ini SETELAH complete_setup.sql
-- ============================================

-- =============================================
-- BAGIAN 1: ASSESSMENT INSTRUMENTS
-- =============================================

-- Assessment Questions based on scientific frameworks
CREATE TABLE IF NOT EXISTS public.assessment_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dimension dimension_type NOT NULL,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL,
    level_indicator INTEGER DEFAULT 3 CHECK (level_indicator >= 1 AND level_indicator <= 5),
    framework_reference TEXT, -- e.g., "Bloom's Taxonomy - Analyzing"
    weight DECIMAL(3,2) DEFAULT 1.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User responses to assessment questions
CREATE TABLE IF NOT EXISTS public.assessment_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID NOT NULL,
    instrument_id UUID NOT NULL REFERENCES public.assessment_instruments(id) ON DELETE CASCADE,
    response INTEGER NOT NULL CHECK (response >= 1 AND response <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment sessions (initial, periodic, etc.)
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('initial', 'periodic', 'self-reflection')),
    status TEXT DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'abandoned')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    scores_snapshot JSONB DEFAULT '{}',
    total_questions INTEGER DEFAULT 0,
    answered_questions INTEGER DEFAULT 0
);

-- Gap analysis results
CREATE TABLE IF NOT EXISTS public.gap_analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.assessment_sessions(id) ON DELETE SET NULL,
    dimension dimension_type NOT NULL,
    current_score INTEGER DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
    ideal_score INTEGER DEFAULT 100,
    gap_score INTEGER GENERATED ALWAYS AS (ideal_score - current_score) STORED,
    priority_level TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN (ideal_score - current_score) > 60 THEN 'critical'
            WHEN (ideal_score - current_score) > 40 THEN 'high'
            WHEN (ideal_score - current_score) > 20 THEN 'moderate'
            ELSE 'minimal'
        END
    ) STORED,
    recommendations JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, dimension)
);

-- =============================================
-- BAGIAN 2: INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_instruments_dimension ON public.assessment_instruments(dimension);
CREATE INDEX IF NOT EXISTS idx_responses_user ON public.assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_responses_session ON public.assessment_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON public.assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_gap_user ON public.gap_analysis_results(user_id);

-- =============================================
-- BAGIAN 3: RLS POLICIES
-- =============================================
ALTER TABLE public.assessment_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gap_analysis_results ENABLE ROW LEVEL SECURITY;

-- Instruments are public read
CREATE POLICY "Anyone can view instruments" 
    ON public.assessment_instruments FOR SELECT 
    USING (is_active = true);

-- Users can manage their own responses
CREATE POLICY "Users can manage own responses" 
    ON public.assessment_responses FOR ALL 
    USING (auth.uid() = user_id);

-- Users can manage their own sessions
CREATE POLICY "Users can manage own sessions" 
    ON public.assessment_sessions FOR ALL 
    USING (auth.uid() = user_id);

-- Users can view their own gap analysis
CREATE POLICY "Users can view own gap analysis" 
    ON public.gap_analysis_results FOR SELECT 
    USING (auth.uid() = user_id);

-- =============================================
-- BAGIAN 4: FUNCTIONS
-- =============================================

-- Function: Calculate dimension score from responses
CREATE OR REPLACE FUNCTION public.calculate_dimension_score(
    p_session_id UUID,
    p_dimension dimension_type
)
RETURNS INTEGER AS $$
DECLARE
    v_total_weighted_score DECIMAL;
    v_total_weight DECIMAL;
    v_normalized_score INTEGER;
BEGIN
    SELECT 
        SUM(r.response * i.weight),
        SUM(i.weight * 5) -- Max possible score
    INTO v_total_weighted_score, v_total_weight
    FROM public.assessment_responses r
    JOIN public.assessment_instruments i ON i.id = r.instrument_id
    WHERE r.session_id = p_session_id AND i.dimension = p_dimension;
    
    IF v_total_weight IS NULL OR v_total_weight = 0 THEN
        RETURN 0;
    END IF;
    
    -- Normalize to 0-100 scale
    v_normalized_score := ROUND((v_total_weighted_score / v_total_weight) * 100);
    
    RETURN v_normalized_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Complete assessment session and calculate all scores
CREATE OR REPLACE FUNCTION public.complete_assessment_session(p_session_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_dimension dimension_type;
    v_score INTEGER;
    v_scores JSONB := '{}';
    v_dimensions TEXT[] := ARRAY['cognitive', 'affective', 'psychomotor', 'spiritual', 'social', 'financial', 'health', 'character', 'environmental'];
    v_dim TEXT;
BEGIN
    -- Get user_id from session
    SELECT user_id INTO v_user_id FROM public.assessment_sessions WHERE id = p_session_id;
    
    IF v_user_id IS NULL THEN
        RETURN '{"error": "Session not found"}'::JSONB;
    END IF;
    
    -- Calculate score for each dimension
    FOREACH v_dim IN ARRAY v_dimensions LOOP
        v_dimension := v_dim::dimension_type;
        v_score := public.calculate_dimension_score(p_session_id, v_dimension);
        
        -- Store in scores JSON
        v_scores := v_scores || jsonb_build_object(v_dim, v_score);
        
        -- Update dimension_scores table
        INSERT INTO public.dimension_scores (user_id, dimension, score, previous_score, updated_at)
        VALUES (v_user_id, v_dimension, v_score, 0, NOW())
        ON CONFLICT (user_id, dimension) 
        DO UPDATE SET 
            previous_score = dimension_scores.score,
            score = EXCLUDED.score,
            updated_at = NOW();
        
        -- Create gap analysis result
        INSERT INTO public.gap_analysis_results (user_id, session_id, dimension, current_score)
        VALUES (v_user_id, p_session_id, v_dimension, v_score)
        ON CONFLICT (session_id, dimension) 
        DO UPDATE SET current_score = EXCLUDED.current_score;
    END LOOP;
    
    -- Mark session as completed
    UPDATE public.assessment_sessions 
    SET status = 'completed', 
        completed_at = NOW(),
        scores_snapshot = v_scores
    WHERE id = p_session_id;
    
    -- Check for new badges
    PERFORM public.check_badge_eligibility(v_user_id);
    
    -- Send notification
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_user_id, 'achievement', 'Assessment Selesai! 📊', 'Hasil gap analysis Anda sudah tersedia. Lihat rekomendasi pengembangan.');
    
    RETURN v_scores;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get assessment questions for a session
CREATE OR REPLACE FUNCTION public.get_assessment_questions()
RETURNS TABLE (
    id UUID,
    dimension dimension_type,
    question_text TEXT,
    question_order INTEGER,
    framework_reference TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.dimension,
        i.question_text,
        i.question_order,
        i.framework_reference
    FROM public.assessment_instruments i
    WHERE i.is_active = true
    ORDER BY i.dimension, i.question_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- BAGIAN 5: SEED DATA - ASSESSMENT QUESTIONS
-- =============================================

-- COGNITIVE (Bloom's Taxonomy Revised)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('cognitive', 'Saya mampu mengingat dan menjelaskan konsep-konsep penting dalam bidang studi saya.', 1, 'Bloom - Remember/Understand', 2),
('cognitive', 'Saya dapat menerapkan teori yang dipelajari untuk memecahkan masalah praktis.', 2, 'Bloom - Apply', 3),
('cognitive', 'Saya mampu menganalisis informasi kompleks dan mengidentifikasi pola/hubungan.', 3, 'Bloom - Analyze', 4),
('cognitive', 'Saya dapat mengevaluasi berbagai solusi dan membuat keputusan berdasarkan kriteria yang jelas.', 4, 'Bloom - Evaluate', 4),
('cognitive', 'Saya mampu menciptakan ide/solusi baru yang orisinal dan inovatif.', 5, 'Bloom - Create', 5),
('cognitive', 'Saya aktif mencari informasi dari berbagai sumber untuk memperluas pengetahuan.', 6, 'Bloom - Synthesis', 3),
('cognitive', 'Saya mampu berpikir kritis dan mempertanyakan asumsi-asumsi yang ada.', 7, 'Bloom - Critical Thinking', 4);

-- AFFECTIVE (Krathwohl's Taxonomy)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('affective', 'Saya terbuka dan mau mendengarkan perspektif yang berbeda dari orang lain.', 1, 'Krathwohl - Receiving', 1),
('affective', 'Saya aktif berpartisipasi dalam diskusi dan kegiatan yang berkaitan dengan nilai-nilai positif.', 2, 'Krathwohl - Responding', 2),
('affective', 'Saya memiliki prinsip dan nilai yang jelas yang memandu keputusan saya.', 3, 'Krathwohl - Valuing', 3),
('affective', 'Saya mampu mengintegrasikan berbagai nilai untuk membentuk sistem nilai yang koheren.', 4, 'Krathwohl - Organization', 4),
('affective', 'Nilai-nilai yang saya anut tercermin konsisten dalam perilaku sehari-hari.', 5, 'Krathwohl - Characterization', 5);

-- PSYCHOMOTOR (Dave's Taxonomy)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('psychomotor', 'Saya mampu meniru dan mengikuti instruksi untuk melakukan keterampilan baru.', 1, 'Dave - Imitation', 1),
('psychomotor', 'Saya dapat melakukan tugas-tugas tertentu secara mandiri berdasarkan instruksi.', 2, 'Dave - Manipulation', 2),
('psychomotor', 'Saya mampu melakukan keterampilan dengan akurat dan efisien.', 3, 'Dave - Precision', 3),
('psychomotor', 'Saya dapat mengadaptasi keterampilan saya untuk situasi yang berbeda.', 4, 'Dave - Articulation', 4),
('psychomotor', 'Keterampilan yang saya miliki sudah menjadi otomatis dan natural.', 5, 'Dave - Naturalization', 5);

-- SPIRITUAL (Adapted from Fowler's Faith Development)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('spiritual', 'Saya meluangkan waktu untuk refleksi diri dan introspeksi secara rutin.', 1, 'Spiritual - Self-reflection', 2),
('spiritual', 'Saya memiliki tujuan hidup yang jelas dan bermakna.', 2, 'Spiritual - Purpose', 3),
('spiritual', 'Saya menjalankan ibadah/praktik spiritual dengan konsisten.', 3, 'Spiritual - Practice', 3),
('spiritual', 'Saya mampu menemukan makna positif dalam kesulitan dan tantangan.', 4, 'Spiritual - Meaning-making', 4),
('spiritual', 'Saya merasakan koneksi dengan sesuatu yang lebih besar dari diri sendiri.', 5, 'Spiritual - Transcendence', 5);

-- SOCIAL (Rose-Krasnor's Social Competence Framework)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('social', 'Saya mampu berkomunikasi secara efektif dengan berbagai tipe orang.', 1, 'Social - Communication', 2),
('social', 'Saya dapat memahami dan merespons perasaan orang lain dengan empati.', 2, 'Social - Empathy', 3),
('social', 'Saya efektif dalam bekerja sama dengan tim untuk mencapai tujuan bersama.', 3, 'Social - Collaboration', 3),
('social', 'Saya mampu memimpin dan memotivasi orang lain.', 4, 'Social - Leadership', 4),
('social', 'Saya dapat menyelesaikan konflik secara konstruktif.', 5, 'Social - Conflict Resolution', 4),
('social', 'Saya aktif membangun dan memelihara jaringan profesional.', 6, 'Social - Networking', 3);

-- FINANCIAL (OECD PISA Financial Literacy Framework)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('financial', 'Saya memiliki dan mengikuti anggaran keuangan bulanan.', 1, 'OECD - Budgeting', 2),
('financial', 'Saya rutin menyisihkan sebagian pendapatan untuk tabungan.', 2, 'OECD - Saving', 3),
('financial', 'Saya memahami berbagai instrumen investasi dan risikonya.', 3, 'OECD - Investment', 4),
('financial', 'Saya memiliki dana darurat untuk kebutuhan mendesak.', 4, 'OECD - Emergency Fund', 3),
('financial', 'Saya memiliki rencana keuangan jangka panjang yang jelas.', 5, 'OECD - Financial Planning', 4);

-- HEALTH (Nutbeam's Health Literacy Framework)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('health', 'Saya berolahraga secara teratur (minimal 3x seminggu).', 1, 'Health - Physical Activity', 2),
('health', 'Saya menjaga pola makan sehat dan seimbang.', 2, 'Health - Nutrition', 3),
('health', 'Saya tidur cukup (7-9 jam per hari) secara konsisten.', 3, 'Health - Sleep', 2),
('health', 'Saya mampu mengelola stres dengan baik.', 4, 'Health - Mental Health', 4),
('health', 'Saya melakukan pemeriksaan kesehatan preventif secara rutin.', 5, 'Health - Prevention', 3);

-- CHARACTER (VIA Character Strengths - Peterson & Seligman)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('character', 'Saya jujur dan bertindak dengan integritas dalam semua situasi.', 1, 'VIA - Integrity', 3),
('character', 'Saya bertanggung jawab atas tindakan dan keputusan saya.', 2, 'VIA - Responsibility', 3),
('character', 'Saya berani mengambil risiko yang diperhitungkan untuk hal yang benar.', 3, 'VIA - Courage', 4),
('character', 'Saya bersyukur dan mengapresiasi hal-hal baik dalam hidup.', 4, 'VIA - Gratitude', 3),
('character', 'Saya tidak mudah menyerah menghadapi tantangan dan hambatan.', 5, 'VIA - Perseverance', 4);

-- ENVIRONMENTAL (Hollweg's Environmental Literacy Framework)
INSERT INTO public.assessment_instruments (dimension, question_text, question_order, framework_reference, level_indicator) VALUES
('environmental', 'Saya memahami isu-isu lingkungan global dan dampaknya.', 1, 'Environmental - Awareness', 2),
('environmental', 'Saya menerapkan praktik ramah lingkungan dalam kehidupan sehari-hari.', 2, 'Environmental - Action', 3),
('environmental', 'Saya mengurangi, menggunakan kembali, dan mendaur ulang sampah.', 3, 'Environmental - Conservation', 3),
('environmental', 'Saya mengadvokasi dan mengajak orang lain untuk peduli lingkungan.', 4, 'Environmental - Advocacy', 4),
('environmental', 'Saya berpartisipasi dalam kegiatan pelestarian lingkungan.', 5, 'Environmental - Participation', 4);

-- =============================================
-- SELESAI!
-- =============================================
-- Script ini telah membuat:
-- ✓ 4 Tabel baru (instruments, responses, sessions, gap_analysis)
-- ✓ 5 Indexes
-- ✓ 4 RLS Policies
-- ✓ 3 Functions (calculate_dimension_score, complete_assessment_session, get_assessment_questions)
-- ✓ 48 Assessment Questions (scientific-based)
-- ============================================
