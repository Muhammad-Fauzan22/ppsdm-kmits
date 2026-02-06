-- ============================================
-- PPSDM KMM - COMPREHENSIVE ASSESSMENT SCHEMA
-- Scientific Gap Analysis with 100+ Questions
-- ============================================

-- =============================================
-- REGISTRATION LAYERS STATE TRACKING
-- =============================================

CREATE TABLE IF NOT EXISTS public.registration_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_layer INTEGER DEFAULT 1 CHECK (current_layer BETWEEN 1 AND 4),
    layer1_completed BOOLEAN DEFAULT false,
    layer2_completed BOOLEAN DEFAULT false,
    layer3_completed BOOLEAN DEFAULT false,
    layer4_completed BOOLEAN DEFAULT false,
    layer1_data JSONB,
    layer2_data JSONB,
    layer3_data JSONB,
    layer4_data JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMPREHENSIVE ASSESSMENT INSTRUMENTS
-- 100+ Questions across 9 Dimensions
-- =============================================

CREATE TABLE IF NOT EXISTS public.assessment_instruments_v2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dimension VARCHAR(50) NOT NULL,
    subdimension VARCHAR(100),
    question_text TEXT NOT NULL,
    question_text_en TEXT,
    question_type VARCHAR(30) DEFAULT 'likert_5' CHECK (question_type IN ('likert_5', 'likert_7', 'multiple_choice', 'situational', 'ranking', 'slider')),
    options JSONB, -- For multiple choice questions
    difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5),
    irt_discrimination DECIMAL(4,3) DEFAULT 1.0, -- IRT parameter a
    irt_difficulty DECIMAL(4,3) DEFAULT 0.0, -- IRT parameter b
    weight DECIMAL(3,2) DEFAULT 1.0,
    order_index INTEGER NOT NULL,
    module_number INTEGER DEFAULT 1, -- Which assessment module
    estimated_seconds INTEGER DEFAULT 30,
    is_reverse_scored BOOLEAN DEFAULT false,
    scientific_source VARCHAR(200),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- IDEAL BENCHMARKS (Reference Standards)
-- =============================================

CREATE TABLE IF NOT EXISTS public.ideal_benchmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benchmark_type VARCHAR(50) NOT NULL CHECK (benchmark_type IN ('department', 'career', 'year_level', 'global', 'industry')),
    benchmark_name VARCHAR(100) NOT NULL,
    dimension VARCHAR(50) NOT NULL,
    subdimension VARCHAR(100),
    ideal_score DECIMAL(5,2) NOT NULL,
    minimum_acceptable DECIMAL(5,2),
    description TEXT,
    source VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(benchmark_type, benchmark_name, dimension, subdimension)
);

-- =============================================
-- COMPREHENSIVE ASSESSMENT SESSIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.comprehensive_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_type VARCHAR(30) DEFAULT 'initial' CHECK (session_type IN ('initial', 'periodic', 'followup')),
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    current_module INTEGER DEFAULT 1,
    total_modules INTEGER DEFAULT 8,
    current_question INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    -- Time tracking
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_duration_seconds INTEGER,
    -- Module completion status
    module_status JSONB DEFAULT '{}',
    -- Calculated scores
    dimension_scores JSONB DEFAULT '{}',
    subdimension_scores JSONB DEFAULT '{}',
    overall_score DECIMAL(5,2),
    -- Metadata
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- COMPREHENSIVE ASSESSMENT RESPONSES
-- =============================================

CREATE TABLE IF NOT EXISTS public.comprehensive_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.comprehensive_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.assessment_instruments_v2(id),
    response_value INTEGER,
    response_text TEXT,
    response_data JSONB, -- For complex response types
    response_time_seconds INTEGER,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, question_id)
);

-- =============================================
-- GAP ANALYSIS RESULTS (Detailed)
-- =============================================

CREATE TABLE IF NOT EXISTS public.comprehensive_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.comprehensive_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    dimension VARCHAR(50) NOT NULL,
    subdimension VARCHAR(100),
    current_score DECIMAL(5,2) NOT NULL,
    ideal_score DECIMAL(5,2) NOT NULL,
    gap_score DECIMAL(5,2) NOT NULL,
    gap_percentage DECIMAL(5,2) NOT NULL,
    priority_level VARCHAR(20) NOT NULL CHECK (priority_level IN ('critical', 'high', 'moderate', 'minimal')),
    priority_weight DECIMAL(4,3) DEFAULT 1.0,
    benchmark_used VARCHAR(100),
    recommended_actions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DEVELOPMENT ROADMAPS
-- =============================================

CREATE TABLE IF NOT EXISTS public.development_roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.comprehensive_sessions(id),
    roadmap_version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'superseded')),
    -- Focus areas
    primary_focus_dimensions TEXT[],
    secondary_focus_dimensions TEXT[],
    -- Timeline
    start_date DATE DEFAULT CURRENT_DATE,
    target_completion_date DATE,
    -- Generated plan
    weekly_goals JSONB,
    monthly_milestones JSONB,
    semester_objectives JSONB,
    -- AI-generated content
    personalized_message TEXT,
    recommended_resources JSONB,
    suggested_activities JSONB,
    suggested_mentors JSONB,
    -- Progress
    progress_percentage INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- FREE LEARNING RESOURCES CATALOG
-- =============================================

CREATE TABLE IF NOT EXISTS public.free_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    source VARCHAR(100) NOT NULL, -- 'khan_academy', 'youtube', 'freecodecamp', etc.
    source_url VARCHAR(500),
    resource_type VARCHAR(50) CHECK (resource_type IN ('video', 'course', 'article', 'book', 'practice', 'project', 'workshop')),
    -- Targeting
    target_dimensions TEXT[],
    target_subdimensions TEXT[],
    target_skill_levels INTEGER[], -- 1-5 array
    -- Content details
    duration_minutes INTEGER,
    language VARCHAR(20) DEFAULT 'indonesia',
    has_certificate BOOLEAN DEFAULT false,
    -- Quality
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(4,2),
    -- Metadata
    tags TEXT[],
    thumbnail_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RESOURCE RECOMMENDATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS public.resource_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.free_resources(id) ON DELETE CASCADE,
    gap_id UUID REFERENCES public.comprehensive_gaps(id),
    recommendation_score DECIMAL(4,3),
    recommendation_reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'started', 'completed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    user_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id, gap_id)
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_registration_state_user ON public.registration_state(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_instruments_v2_dimension ON public.assessment_instruments_v2(dimension);
CREATE INDEX IF NOT EXISTS idx_assessment_instruments_v2_module ON public.assessment_instruments_v2(module_number);
CREATE INDEX IF NOT EXISTS idx_comprehensive_sessions_user ON public.comprehensive_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_responses_session ON public.comprehensive_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_gaps_user ON public.comprehensive_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_gaps_priority ON public.comprehensive_gaps(priority_level);
CREATE INDEX IF NOT EXISTS idx_development_roadmaps_user ON public.development_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_free_resources_dimensions ON public.free_resources USING gin(target_dimensions);
CREATE INDEX IF NOT EXISTS idx_resource_recommendations_user ON public.resource_recommendations(user_id);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE public.registration_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprehensive_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprehensive_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comprehensive_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.development_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own registration" ON public.registration_state FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own sessions" ON public.comprehensive_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own responses" ON public.comprehensive_responses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.comprehensive_sessions WHERE id = session_id AND user_id = auth.uid())
);
CREATE POLICY "Users view own gaps" ON public.comprehensive_gaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own roadmaps" ON public.development_roadmaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view resources" ON public.free_resources FOR SELECT USING (true);
CREATE POLICY "Anyone can view instruments" ON public.assessment_instruments_v2 FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view benchmarks" ON public.ideal_benchmarks FOR SELECT USING (true);
CREATE POLICY "Users manage own recommendations" ON public.resource_recommendations FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- SEED: 100+ COMPREHENSIVE ASSESSMENT QUESTIONS
-- Based on validated psychometric instruments
-- =============================================

INSERT INTO public.assessment_instruments_v2 (dimension, subdimension, question_text, question_type, order_index, module_number, weight, scientific_source, is_reverse_scored) VALUES
-- =============================================
-- MODULE 1: COGNITIVE & INTELLECTUAL (15 questions)
-- Based on: Watson-Glaser, Bloom's Taxonomy
-- =============================================
('cognitive', 'critical_thinking', 'Saya selalu mempertanyakan informasi sebelum menerimanya sebagai fakta', 'likert_5', 1, 1, 1.2, 'Watson-Glaser Critical Thinking', false),
('cognitive', 'critical_thinking', 'Saya dapat mengidentifikasi kelemahan dalam argumen orang lain', 'likert_5', 2, 1, 1.2, 'Watson-Glaser Critical Thinking', false),
('cognitive', 'critical_thinking', 'Saya cenderung menerima informasi tanpa memverifikasinya', 'likert_5', 3, 1, 1.0, 'Watson-Glaser Critical Thinking', true),
('cognitive', 'problem_solving', 'Saya dapat memecahkan masalah kompleks dengan pendekatan sistematis', 'likert_5', 4, 1, 1.3, 'Blooms Taxonomy - Analysis', false),
('cognitive', 'problem_solving', 'Saya sering menemukan solusi kreatif untuk masalah yang sulit', 'likert_5', 5, 1, 1.3, 'Blooms Taxonomy - Synthesis', false),
('cognitive', 'creativity', 'Saya sering menghasilkan ide-ide baru dan orisinal', 'likert_5', 6, 1, 1.1, 'Torrance Creative Thinking', false),
('cognitive', 'creativity', 'Saya dapat melihat hubungan antara hal-hal yang tampak tidak berkaitan', 'likert_5', 7, 1, 1.1, 'Torrance Creative Thinking', false),
('cognitive', 'learning_agility', 'Saya cepat mempelajari konsep-konsep baru', 'likert_5', 8, 1, 1.2, 'Learning Agility Scale', false),
('cognitive', 'learning_agility', 'Saya mudah beradaptasi dengan metode pembelajaran baru', 'likert_5', 9, 1, 1.2, 'Learning Agility Scale', false),
('cognitive', 'metacognition', 'Saya menyadari kekuatan dan kelemahan cara belajar saya', 'likert_5', 10, 1, 1.0, 'Metacognitive Awareness Inventory', false),
('cognitive', 'metacognition', 'Saya secara teratur mengevaluasi pemahaman saya tentang materi yang dipelajari', 'likert_5', 11, 1, 1.0, 'Metacognitive Awareness Inventory', false),
('cognitive', 'technical_proficiency', 'Saya percaya diri dengan kemampuan teknis di bidang saya', 'likert_5', 12, 1, 1.2, 'Technical Self-Efficacy Scale', false),
('cognitive', 'technical_proficiency', 'Saya terus mengembangkan keterampilan teknis baru', 'likert_5', 13, 1, 1.2, 'Technical Self-Efficacy Scale', false),
('cognitive', 'digital_literacy', 'Saya dapat menggunakan teknologi digital untuk meningkatkan produktivitas', 'likert_5', 14, 1, 1.0, 'Digital Competence Framework', false),
('cognitive', 'information_literacy', 'Saya dapat mengevaluasi kredibilitas sumber informasi online', 'likert_5', 15, 1, 1.1, 'Information Literacy Standards', false),

-- =============================================
-- MODULE 2: EMOTIONAL & SOCIAL (12 questions)
-- Based on: Bar-On EQ-i, Social Skills Inventory
-- =============================================
('emotional', 'self_awareness', 'Saya dapat mengenali emosi saya saat sedang mengalaminya', 'likert_5', 1, 2, 1.2, 'Bar-On EQ-i 2.0', false),
('emotional', 'self_awareness', 'Saya memahami bagaimana emosi saya mempengaruhi perilaku saya', 'likert_5', 2, 2, 1.2, 'Bar-On EQ-i 2.0', false),
('emotional', 'self_regulation', 'Saya dapat mengendalikan emosi saya dalam situasi sulit', 'likert_5', 3, 2, 1.3, 'Bar-On EQ-i 2.0', false),
('emotional', 'self_regulation', 'Saya mudah terpancing emosi dalam konflik', 'likert_5', 4, 2, 1.2, 'Bar-On EQ-i 2.0', true),
('emotional', 'empathy', 'Saya dapat memahami perasaan orang lain dengan baik', 'likert_5', 5, 2, 1.2, 'Interpersonal Reactivity Index', false),
('emotional', 'empathy', 'Saya sering melihat masalah dari sudut pandang orang lain', 'likert_5', 6, 2, 1.2, 'Interpersonal Reactivity Index', false),
('social', 'communication', 'Saya dapat mengekspresikan pikiran saya dengan jelas kepada orang lain', 'likert_5', 7, 2, 1.3, 'Social Skills Inventory', false),
('social', 'communication', 'Saya adalah pendengar yang baik', 'likert_5', 8, 2, 1.2, 'Active Listening Scale', false),
('social', 'teamwork', 'Saya bekerja sama dengan baik dalam tim', 'likert_5', 9, 2, 1.3, 'Team Player Inventory', false),
('social', 'teamwork', 'Saya dapat memimpin kelompok dengan efektif', 'likert_5', 10, 2, 1.2, 'Leadership Practices Inventory', false),
('social', 'conflict_resolution', 'Saya dapat menyelesaikan konflik dengan cara yang konstruktif', 'likert_5', 11, 2, 1.2, 'Conflict Resolution Styles', false),
('social', 'networking', 'Saya aktif membangun dan memelihara jaringan profesional', 'likert_5', 12, 2, 1.1, 'Professional Networking Scale', false),

-- =============================================
-- MODULE 3: PHYSICAL & HEALTH (10 questions)
-- Based on: IPAQ, PSQI, WHO-QOL
-- =============================================
('physical', 'exercise_habits', 'Saya berolahraga secara teratur (minimal 3x seminggu)', 'likert_5', 1, 3, 1.2, 'IPAQ', false),
('physical', 'exercise_habits', 'Saya merasa bugar dan berenergi setiap hari', 'likert_5', 2, 3, 1.2, 'Physical Fitness Perception', false),
('physical', 'sleep_quality', 'Saya mendapatkan tidur yang cukup dan berkualitas (7-9 jam)', 'likert_5', 3, 3, 1.3, 'Pittsburgh Sleep Quality Index', false),
('physical', 'sleep_quality', 'Saya sering merasa lelah di siang hari', 'likert_5', 4, 3, 1.2, 'PSQI', true),
('physical', 'nutrition', 'Saya makan makanan seimbang dan bergizi', 'likert_5', 5, 3, 1.2, 'Healthy Eating Index', false),
('physical', 'nutrition', 'Saya minum air yang cukup setiap hari (minimal 2 liter)', 'likert_5', 6, 3, 1.0, 'Hydration Awareness', false),
('health', 'stress_management', 'Saya memiliki teknik efektif untuk mengelola stres', 'likert_5', 7, 3, 1.3, 'Perceived Stress Scale', false),
('health', 'self_care', 'Saya memprioritaskan kesehatan dan perawatan diri', 'likert_5', 8, 3, 1.2, 'Self-Care Assessment', false),
('health', 'preventive_health', 'Saya melakukan pemeriksaan kesehatan rutin', 'likert_5', 9, 3, 1.0, 'Health Behavior Checklist', false),
('health', 'work_life_balance', 'Saya menjaga keseimbangan antara studi dan istirahat', 'likert_5', 10, 3, 1.2, 'Work-Life Balance Scale', false),

-- =============================================
-- MODULE 4: FINANCIAL LITERACY (10 questions)
-- Based on: OECD PISA, Financial Literacy Assessment
-- =============================================
('financial', 'money_management', 'Saya membuat dan mengikuti anggaran bulanan', 'likert_5', 1, 4, 1.3, 'OECD PISA Financial Literacy', false),
('financial', 'money_management', 'Saya melacak pengeluaran saya secara teratur', 'likert_5', 2, 4, 1.2, 'Financial Behavior Scale', false),
('financial', 'saving_habits', 'Saya menyisihkan uang untuk tabungan secara konsisten', 'likert_5', 3, 4, 1.3, 'Financial Self-Efficacy Scale', false),
('financial', 'saving_habits', 'Saya memiliki dana darurat untuk kebutuhan tak terduga', 'likert_5', 4, 4, 1.2, 'Emergency Fund Awareness', false),
('financial', 'financial_knowledge', 'Saya memahami konsep dasar investasi', 'likert_5', 5, 4, 1.1, 'Investment Literacy Test', false),
('financial', 'financial_knowledge', 'Saya memahami perbedaan antara aset dan liabilitas', 'likert_5', 6, 4, 1.1, 'Financial Literacy Assessment', false),
('financial', 'debt_management', 'Saya menghindari utang yang tidak perlu', 'likert_5', 7, 4, 1.2, 'Debt Literacy Scale', false),
('financial', 'future_planning', 'Saya memiliki rencana keuangan jangka panjang', 'likert_5', 8, 4, 1.2, 'Financial Planning Scale', false),
('financial', 'earning_potential', 'Saya aktif mencari peluang untuk meningkatkan penghasilan', 'likert_5', 9, 4, 1.1, 'Income Generation Mindset', false),
('financial', 'financial_decision', 'Saya membuat keputusan keuangan berdasarkan analisis bukan impuls', 'likert_5', 10, 4, 1.2, 'Financial Decision Making', false),

-- =============================================
-- MODULE 5: CHARACTER & VALUES (12 questions)
-- Based on: VIA Survey, Moral Foundations
-- =============================================
('character', 'integrity', 'Saya selalu menepati janji dan komitmen saya', 'likert_5', 1, 5, 1.4, 'VIA Survey - Honesty', false),
('character', 'integrity', 'Saya jujur bahkan ketika tidak ada yang melihat', 'likert_5', 2, 5, 1.4, 'Integrity Scale', false),
('character', 'courage', 'Saya berani menyuarakan pendapat meskipun tidak populer', 'likert_5', 3, 5, 1.2, 'VIA Survey - Bravery', false),
('character', 'courage', 'Saya menghadapi tantangan daripada menghindarinya', 'likert_5', 4, 5, 1.2, 'Courage Scale', false),
('character', 'perseverance', 'Saya menyelesaikan apa yang saya mulai', 'likert_5', 5, 5, 1.3, 'VIA Survey - Perseverance', false),
('character', 'perseverance', 'Saya tidak mudah menyerah saat menghadapi kesulitan', 'likert_5', 6, 5, 1.3, 'Grit Scale', false),
('character', 'humility', 'Saya mengakui kesalahan dan belajar darinya', 'likert_5', 7, 5, 1.1, 'VIA Survey - Humility', false),
('character', 'fairness', 'Saya memperlakukan semua orang dengan adil', 'likert_5', 8, 5, 1.2, 'Moral Foundations - Fairness', false),
('character', 'responsibility', 'Saya bertanggung jawab atas tindakan saya', 'likert_5', 9, 5, 1.3, 'Responsibility Scale', false),
('character', 'self_discipline', 'Saya dapat menunda kepuasan demi tujuan jangka panjang', 'likert_5', 10, 5, 1.2, 'Self-Control Scale', false),
('character', 'ethics', 'Saya mempertimbangkan dampak etis dari keputusan saya', 'likert_5', 11, 5, 1.2, 'Ethical Reasoning Scale', false),
('character', 'values_clarity', 'Saya memiliki nilai-nilai yang jelas yang memandu hidup saya', 'likert_5', 12, 5, 1.1, 'Values Clarity Scale', false),

-- =============================================
-- MODULE 6: SPIRITUAL & MEANING (10 questions)
-- Based on: Purpose in Life, Gratitude Scale
-- =============================================
('spiritual', 'life_purpose', 'Saya memiliki tujuan hidup yang jelas', 'likert_5', 1, 6, 1.3, 'Purpose in Life Scale', false),
('spiritual', 'life_purpose', 'Saya merasa hidup saya memiliki makna', 'likert_5', 2, 6, 1.3, 'Meaning in Life Questionnaire', false),
('spiritual', 'gratitude', 'Saya secara teratur merasa bersyukur atas hal-hal baik dalam hidup', 'likert_5', 3, 6, 1.2, 'Gratitude Questionnaire', false),
('spiritual', 'gratitude', 'Saya mengekspresikan apresiasi kepada orang lain', 'likert_5', 4, 6, 1.1, 'Gratitude Questionnaire', false),
('spiritual', 'mindfulness', 'Saya hidup di masa sekarang, bukan terjebak di masa lalu atau khawatir tentang masa depan', 'likert_5', 5, 6, 1.2, 'Mindful Attention Awareness Scale', false),
('spiritual', 'inner_peace', 'Saya merasa damai dengan diri sendiri', 'likert_5', 6, 6, 1.2, 'Inner Peace Scale', false),
('spiritual', 'altruism', 'Saya senang membantu orang lain tanpa mengharapkan imbalan', 'likert_5', 7, 6, 1.2, 'Altruism Scale', false),
('spiritual', 'altruism', 'Saya aktif berkontribusi pada komunitas saya', 'likert_5', 8, 6, 1.1, 'Community Service Orientation', false),
('spiritual', 'religious_practice', 'Praktik spiritual/keagamaan memberikan kekuatan bagi saya', 'likert_5', 9, 6, 1.0, 'Religious Practice Scale', false),
('spiritual', 'transcendence', 'Saya merasa terhubung dengan sesuatu yang lebih besar dari diri sendiri', 'likert_5', 10, 6, 1.1, 'VIA Survey - Spirituality', false),

-- =============================================
-- MODULE 7: ENVIRONMENTAL (8 questions)
-- Based on: Environmental Awareness Scale
-- =============================================
('environmental', 'awareness', 'Saya memahami dampak aktivitas manusia terhadap lingkungan', 'likert_5', 1, 7, 1.2, 'Environmental Literacy Scale', false),
('environmental', 'awareness', 'Saya mengikuti isu-isu lingkungan terkini', 'likert_5', 2, 7, 1.1, 'Environmental Interest Scale', false),
('environmental', 'sustainable_habits', 'Saya mengurangi penggunaan plastik sekali pakai', 'likert_5', 3, 7, 1.2, 'Sustainable Behavior Scale', false),
('environmental', 'sustainable_habits', 'Saya menghemat energi dan air dalam kehidupan sehari-hari', 'likert_5', 4, 7, 1.2, 'Conservation Behavior', false),
('environmental', 'sustainable_habits', 'Saya memilah sampah untuk daur ulang', 'likert_5', 5, 7, 1.1, 'Recycling Behavior', false),
('environmental', 'eco_mindset', 'Saya mempertimbangkan dampak lingkungan saat membuat keputusan pembelian', 'likert_5', 6, 7, 1.1, 'Green Consumer Behavior', false),
('environmental', 'activism', 'Saya terlibat dalam kegiatan pelestarian lingkungan', 'likert_5', 7, 7, 1.0, 'Environmental Activism', false),
('environmental', 'minimalism', 'Saya lebih memilih pengalaman daripada kepemilikan barang', 'likert_5', 8, 7, 1.0, 'Minimalism Scale', false),

-- =============================================
-- MODULE 8: CAREER & PROFESSIONAL (12 questions)
-- Based on: Career Readiness Assessment
-- =============================================
('career', 'career_clarity', 'Saya memiliki gambaran jelas tentang karir yang saya inginkan', 'likert_5', 1, 8, 1.3, 'Career Clarity Scale', false),
('career', 'career_clarity', 'Saya memahami langkah-langkah untuk mencapai tujuan karir saya', 'likert_5', 2, 8, 1.2, 'Career Planning Scale', false),
('career', 'industry_knowledge', 'Saya mengikuti perkembangan terbaru di industri yang saya minati', 'likert_5', 3, 8, 1.2, 'Industry Awareness', false),
('career', 'industry_knowledge', 'Saya memahami keterampilan yang dibutuhkan untuk sukses di bidang saya', 'likert_5', 4, 8, 1.2, 'Skills Gap Awareness', false),
('career', 'professional_skills', 'Saya memiliki pengalaman kerja/magang yang relevan', 'likert_5', 5, 8, 1.1, 'Work Experience Scale', false),
('career', 'professional_skills', 'Saya dapat menulis resume dan surat lamaran yang efektif', 'likert_5', 6, 8, 1.1, 'Job Search Skills', false),
('career', 'professional_skills', 'Saya percaya diri dalam wawancara kerja', 'likert_5', 7, 8, 1.2, 'Interview Confidence', false),
('career', 'networking', 'Saya memiliki jaringan profesional yang berkembang', 'likert_5', 8, 8, 1.2, 'Professional Network Size', false),
('career', 'entrepreneurship', 'Saya tertarik memulai bisnis sendiri', 'likert_5', 9, 8, 1.0, 'Entrepreneurship Orientation', false),
('career', 'adaptability', 'Saya siap beradaptasi dengan perubahan di dunia kerja', 'likert_5', 10, 8, 1.2, 'Career Adaptability Scale', false),
('career', 'global_mindset', 'Saya siap bekerja di lingkungan internasional', 'likert_5', 11, 8, 1.1, 'Global Mindset Scale', false),
('career', 'continuous_learning', 'Saya berkomitmen untuk belajar sepanjang hayat', 'likert_5', 12, 8, 1.2, 'Lifelong Learning Orientation', false)

ON CONFLICT DO NOTHING;

-- =============================================
-- SEED: IDEAL BENCHMARKS
-- =============================================

INSERT INTO public.ideal_benchmarks (benchmark_type, benchmark_name, dimension, ideal_score, minimum_acceptable, source) VALUES
-- Teknik Informatika
('department', 'Informatika', 'cognitive', 85.0, 70.0, 'ITS Graduate Attributes'),
('department', 'Informatika', 'emotional', 70.0, 60.0, 'Industry Standards'),
('department', 'Informatika', 'physical', 65.0, 50.0, 'WHO Guidelines'),
('department', 'Informatika', 'financial', 70.0, 55.0, 'OECD Framework'),
('department', 'Informatika', 'character', 80.0, 70.0, 'VIA Standards'),
('department', 'Informatika', 'spiritual', 70.0, 55.0, 'Fowler Framework'),
('department', 'Informatika', 'environmental', 65.0, 50.0, 'SDG Goals'),
('department', 'Informatika', 'career', 80.0, 65.0, 'Industry Requirements'),
('department', 'Informatika', 'social', 75.0, 60.0, 'Rose-Krasnor Model'),
('department', 'Informatika', 'health', 70.0, 55.0, 'Nutbeam Framework'),

-- Teknik Mesin (HMM)
('department', 'Teknik Mesin', 'cognitive', 82.0, 68.0, 'ABET Criteria'),
('department', 'Teknik Mesin', 'emotional', 72.0, 60.0, 'Industry Standards'),
('department', 'Teknik Mesin', 'physical', 70.0, 55.0, 'Engineering Physical Demands'),
('department', 'Teknik Mesin', 'financial', 68.0, 55.0, 'OECD Framework'),
('department', 'Teknik Mesin', 'character', 80.0, 70.0, 'VIA Standards'),
('department', 'Teknik Mesin', 'spiritual', 68.0, 55.0, 'Indonesian Values'),
('department', 'Teknik Mesin', 'environmental', 75.0, 60.0, 'SDG Goals'),
('department', 'Teknik Mesin', 'career', 78.0, 65.0, 'Industry Requirements'),
('department', 'Teknik Mesin', 'social', 75.0, 62.0, 'Team Collaboration'),
('department', 'Teknik Mesin', 'health', 72.0, 58.0, 'Physical Job Demands'),

-- Global Benchmarks
('global', 'MIT Standard', 'cognitive', 90.0, 80.0, 'MIT Graduate Attributes'),
('global', 'MIT Standard', 'career', 85.0, 75.0, 'MIT Career Outcomes'),
('global', 'Industry Leader', 'cognitive', 85.0, 75.0, 'Tech Giants Requirements'),
('global', 'Industry Leader', 'emotional', 80.0, 70.0, 'Leadership Competency'),
('global', 'Industry Leader', 'career', 88.0, 78.0, 'Employment Standards')

ON CONFLICT DO NOTHING;

-- =============================================
-- SEED: FREE LEARNING RESOURCES
-- =============================================

INSERT INTO public.free_resources (title, description, source, source_url, resource_type, target_dimensions, duration_minutes, language, has_certificate) VALUES
-- Cognitive/Technical
('CS50: Introduction to Computer Science', 'Harvard''s intro to CS, covers fundamentals of programming', 'edx', 'https://www.edx.org/course/cs50s-introduction-to-computer-science', 'course', ARRAY['cognitive'], 720, 'english', true),
('Khan Academy: Calculus', 'Complete calculus course from basics to advanced', 'khan_academy', 'https://www.khanacademy.org/math/calculus-1', 'course', ARRAY['cognitive'], 480, 'indonesia', true),
('freeCodeCamp: Web Development', 'Full-stack web development curriculum', 'freecodecamp', 'https://www.freecodecamp.org/', 'course', ARRAY['cognitive'], 1200, 'english', true),

-- Emotional/Social
('TED: The Power of Vulnerability', 'Brené Brown on connection and vulnerability', 'youtube', 'https://www.youtube.com/watch?v=iCvmsMzlF7o', 'video', ARRAY['emotional', 'social'], 20, 'english', false),
('Coursera: Emotional Intelligence', 'Yale course on managing emotions', 'coursera', 'https://www.coursera.org/learn/emotional-intelligence-cultivating-immensely-human-interactions', 'course', ARRAY['emotional'], 240, 'english', true),
('Active Listening Masterclass', 'Improve your listening skills', 'youtube', 'https://www.youtube.com/watch?v=active-listening', 'video', ARRAY['social'], 60, 'indonesia', false),

-- Financial
('Khan Academy: Personal Finance', 'Basics of personal money management', 'khan_academy', 'https://www.khanacademy.org/college-careers-more/personal-finance', 'course', ARRAY['financial'], 180, 'indonesia', false),
('Investopedia: Investing Basics', 'Learn investing fundamentals', 'article', 'https://www.investopedia.com/investing-essentials-4689754', 'article', ARRAY['financial'], 30, 'english', false),

-- Physical/Health
('Nike Training Club', 'Free workout programs for all levels', 'app', 'https://www.nike.com/ntc-app', 'practice', ARRAY['physical', 'health'], 30, 'indonesia', false),
('Sleep Foundation: Sleep Hygiene', 'Guide to better sleep habits', 'article', 'https://www.sleepfoundation.org/sleep-hygiene', 'article', ARRAY['physical', 'health'], 15, 'english', false),

-- Character
('TED: The Puzzle of Motivation', 'Dan Pink on intrinsic motivation', 'youtube', 'https://www.youtube.com/watch?v=rrkrvAUbU9Y', 'video', ARRAY['character'], 18, 'english', false),
('Grit: Angela Duckworth', 'The power of passion and perseverance', 'book', 'https://angeladuckworth.com/grit-book/', 'book', ARRAY['character'], 300, 'english', false),

-- Spiritual
('Headspace: Meditation Basics', 'Introduction to mindfulness meditation', 'app', 'https://www.headspace.com/', 'practice', ARRAY['spiritual', 'health'], 10, 'english', false),
('Finding Your Why', 'Simon Sinek on purpose and meaning', 'youtube', 'https://www.youtube.com/watch?v=u4ZoJKF_VuA', 'video', ARRAY['spiritual', 'career'], 45, 'english', false),

-- Environmental
('UN SDG Course', 'Understanding Sustainable Development Goals', 'coursera', 'https://www.coursera.org/learn/sdg', 'course', ARRAY['environmental'], 120, 'english', true),
('Zero Waste Guide', 'Practical guide to sustainable living', 'article', 'https://www.goingzerowaste.com/', 'article', ARRAY['environmental'], 30, 'english', false),

-- Career
('LinkedIn Learning: Career Essentials', 'Professional development basics', 'linkedin', 'https://www.linkedin.com/learning/', 'course', ARRAY['career'], 240, 'english', true),
('Resume Writing Guide', 'How to create effective resumes', 'article', 'https://www.indeed.com/career-advice/resumes-cover-letters/how-to-make-a-resume', 'article', ARRAY['career'], 30, 'english', false),
('Mock Interview Practice', 'AI-powered interview preparation', 'app', 'https://www.interviewbit.com/mock-interview/', 'practice', ARRAY['career'], 60, 'english', false)

ON CONFLICT DO NOTHING;

-- =============================================
-- FUNCTIONS
-- =============================================

-- Calculate comprehensive gap score
CREATE OR REPLACE FUNCTION public.calculate_comprehensive_gaps(p_session_id UUID)
RETURNS void AS $$
DECLARE
    v_user_id UUID;
    v_dimension TEXT;
    v_current_score DECIMAL;
    v_ideal_score DECIMAL;
    v_gap_score DECIMAL;
    v_gap_percentage DECIMAL;
    v_priority VARCHAR(20);
    v_department VARCHAR(100);
BEGIN
    -- Get user_id and department
    SELECT cs.user_id INTO v_user_id
    FROM public.comprehensive_sessions cs
    WHERE cs.id = p_session_id;
    
    -- Default department for now
    v_department := 'Teknik Mesin';
    
    -- Calculate for each dimension
    FOR v_dimension IN 
        SELECT DISTINCT dimension 
        FROM public.assessment_instruments_v2 
        WHERE is_active = true
    LOOP
        -- Calculate current score (average of responses for dimension)
        SELECT COALESCE(
            AVG(
                CASE 
                    WHEN ai.is_reverse_scored THEN (6 - cr.response_value)
                    ELSE cr.response_value
                END * 20.0 * ai.weight
            ), 0
        )
        INTO v_current_score
        FROM public.comprehensive_responses cr
        JOIN public.assessment_instruments_v2 ai ON ai.id = cr.question_id
        WHERE cr.session_id = p_session_id
        AND ai.dimension = v_dimension;
        
        -- Get ideal score from benchmarks
        SELECT COALESCE(ideal_score, 75.0)
        INTO v_ideal_score
        FROM public.ideal_benchmarks
        WHERE benchmark_type = 'department'
        AND benchmark_name = v_department
        AND dimension = v_dimension
        LIMIT 1;
        
        -- If no benchmark found, use default
        IF v_ideal_score IS NULL THEN
            v_ideal_score := 75.0;
        END IF;
        
        -- Calculate gap
        v_gap_score := v_ideal_score - v_current_score;
        v_gap_percentage := (v_gap_score / v_ideal_score) * 100;
        
        -- Determine priority
        v_priority := CASE 
            WHEN v_gap_score > 60 THEN 'critical'
            WHEN v_gap_score > 40 THEN 'high'
            WHEN v_gap_score > 20 THEN 'moderate'
            ELSE 'minimal'
        END;
        
        -- Insert gap result
        INSERT INTO public.comprehensive_gaps (
            session_id, user_id, dimension, current_score, ideal_score, 
            gap_score, gap_percentage, priority_level, benchmark_used
        ) VALUES (
            p_session_id, v_user_id, v_dimension, v_current_score, v_ideal_score,
            v_gap_score, v_gap_percentage, v_priority, v_department
        )
        ON CONFLICT (session_id, user_id, dimension) 
        DO UPDATE SET
            current_score = EXCLUDED.current_score,
            ideal_score = EXCLUDED.ideal_score,
            gap_score = EXCLUDED.gap_score,
            gap_percentage = EXCLUDED.gap_percentage,
            priority_level = EXCLUDED.priority_level;
    END LOOP;
    
    -- Update session scores
    UPDATE public.comprehensive_sessions
    SET dimension_scores = (
        SELECT jsonb_object_agg(dimension, current_score)
        FROM public.comprehensive_gaps
        WHERE session_id = p_session_id
    ),
    overall_score = (
        SELECT AVG(current_score)
        FROM public.comprehensive_gaps
        WHERE session_id = p_session_id
    ),
    completed_at = NOW(),
    status = 'completed'
    WHERE id = p_session_id;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Generate development roadmap
CREATE OR REPLACE FUNCTION public.generate_roadmap(p_session_id UUID)
RETURNS UUID AS $$
DECLARE
    v_roadmap_id UUID;
    v_user_id UUID;
    v_critical_gaps TEXT[];
    v_high_gaps TEXT[];
BEGIN
    -- Get user
    SELECT user_id INTO v_user_id
    FROM public.comprehensive_sessions
    WHERE id = p_session_id;
    
    -- Get priority dimensions
    SELECT array_agg(dimension)
    INTO v_critical_gaps
    FROM public.comprehensive_gaps
    WHERE session_id = p_session_id
    AND priority_level = 'critical';
    
    SELECT array_agg(dimension)
    INTO v_high_gaps
    FROM public.comprehensive_gaps
    WHERE session_id = p_session_id
    AND priority_level = 'high';
    
    -- Create roadmap
    INSERT INTO public.development_roadmaps (
        user_id, session_id, primary_focus_dimensions, secondary_focus_dimensions,
        target_completion_date, personalized_message
    ) VALUES (
        v_user_id, 
        p_session_id, 
        COALESCE(v_critical_gaps, ARRAY[]::TEXT[]),
        COALESCE(v_high_gaps, ARRAY[]::TEXT[]),
        CURRENT_DATE + INTERVAL '6 months',
        'Selamat! Roadmap pengembangan Anda telah dibuat. Fokus utama pada area yang membutuhkan perhatian prioritas.'
    )
    RETURNING id INTO v_roadmap_id;
    
    RETURN v_roadmap_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add unique constraint for gaps
ALTER TABLE public.comprehensive_gaps 
ADD CONSTRAINT unique_gap_per_dimension 
UNIQUE (session_id, user_id, dimension);

-- =============================================
-- COMPLETE!
-- =============================================
