-- ============================================
-- PPSDM KMM - 9 DOMAIN DEVELOPMENT SCHEMA
-- ============================================
-- Complete schema for holistic student development
-- Based on enterprise DDD architecture specs
-- ============================================

-- =============================================
-- DOMAIN 1: SELF-MANAGEMENT (Produktivitas)
-- Entities: Goals, Tasks, TimeBlocks, EnergyLogs
-- =============================================

-- Enhanced Goals System
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    dimension VARCHAR(50) NOT NULL, -- 'self_management', 'intellectual', etc.
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0.0,
    unit VARCHAR(50),
    deadline_date DATE,
    recurrence_pattern JSONB, -- {"type": "daily|weekly|monthly", "interval": 1}
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    parent_goal_id UUID REFERENCES public.goals(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks & Time Management
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_duration_minutes INTEGER,
    actual_duration_minutes INTEGER,
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    energy_level_required INTEGER CHECK (energy_level_required BETWEEN 1 AND 5),
    focus_level_required INTEGER CHECK (focus_level_required BETWEEN 1 AND 5),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time Blocks (Pomodoro/Deep Work)
CREATE TABLE IF NOT EXISTS public.time_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    block_type VARCHAR(30) DEFAULT 'work' CHECK (block_type IN ('work', 'break', 'deep_work', 'shallow_work')),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    planned_duration_minutes INTEGER NOT NULL,
    actual_duration_minutes INTEGER,
    focus_rating INTEGER CHECK (focus_rating BETWEEN 1 AND 10),
    interruptions_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Energy & Focus Tracking
CREATE TABLE IF NOT EXISTS public.energy_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time_slot VARCHAR(20) NOT NULL CHECK (time_slot IN ('morning', 'afternoon', 'evening', 'night')),
    physical_energy INTEGER CHECK (physical_energy BETWEEN 1 AND 10),
    mental_energy INTEGER CHECK (mental_energy BETWEEN 1 AND 10),
    emotional_energy INTEGER CHECK (emotional_energy BETWEEN 1 AND 10),
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    productivity_rating INTEGER CHECK (productivity_rating BETWEEN 1 AND 10),
    deep_work_minutes INTEGER DEFAULT 0,
    distractions_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, log_date, time_slot)
);

-- =============================================
-- DOMAIN 2: INTELLECTUAL (Kecerdasan)
-- Entities: Skills, UserSkills, LearningResources
-- =============================================

-- Skills Catalog
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('technical', 'soft', 'digital', 'language', 'academic')),
    parent_skill_id UUID REFERENCES public.skills(id),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    estimated_hours_to_master INTEGER,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Skill Progression
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
    confidence_level INTEGER DEFAULT 1 CHECK (confidence_level BETWEEN 1 AND 5),
    hours_invested DECIMAL(8,2) DEFAULT 0.0,
    last_practiced_date DATE,
    target_proficiency_level INTEGER CHECK (target_proficiency_level BETWEEN 1 AND 5),
    learning_notes TEXT,
    evidence_urls TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- Learning Resources
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) CHECK (resource_type IN ('video', 'article', 'course', 'book', 'project', 'workshop')),
    url VARCHAR(500),
    duration_minutes INTEGER,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    language VARCHAR(20) DEFAULT 'indonesia',
    source VARCHAR(100),
    skill_ids UUID[],
    tags TEXT[],
    rating DECIMAL(2,1),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning Progress
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES public.learning_resources(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    time_spent_minutes INTEGER DEFAULT 0,
    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    UNIQUE(user_id, resource_id)
);

-- =============================================
-- DOMAIN 3: FINANCIAL (Keuangan)
-- Entities: Budgets, Transactions, FinancialGoals
-- =============================================

-- Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    period_type VARCHAR(20) DEFAULT 'monthly' CHECK (period_type IN ('weekly', 'monthly', 'semester', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_income DECIMAL(15,2) DEFAULT 0.0,
    total_expense DECIMAL(15,2) DEFAULT 0.0,
    savings_target DECIMAL(15,2) DEFAULT 0.0,
    actual_savings DECIMAL(15,2) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction Categories
CREATE TABLE IF NOT EXISTS public.transaction_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    parent_category_id UUID REFERENCES public.transaction_categories(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer', 'investment')),
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Transactions
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    budget_id UUID REFERENCES public.budgets(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.transaction_categories(id),
    amount DECIMAL(15,2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense', 'transfer', 'investment')),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    payment_method VARCHAR(50),
    location VARCHAR(200),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB,
    receipt_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial Goals
CREATE TABLE IF NOT EXISTS public.financial_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) CHECK (goal_type IN ('savings', 'investment', 'debt_payoff', 'purchase', 'emergency_fund')),
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) DEFAULT 0.0,
    deadline_date DATE,
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOMAIN 4: PHYSICAL HEALTH (Kesehatan Fisik)
-- Entities: PhysicalMetrics, Workouts, NutritionLogs
-- =============================================

-- Physical Metrics
CREATE TABLE IF NOT EXISTS public.physical_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    bmi DECIMAL(4,2),
    body_fat_percentage DECIMAL(4,2),
    resting_heart_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    waist_cm DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, measurement_date)
);

-- Workouts
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    workout_type VARCHAR(50) CHECK (workout_type IN ('cardio', 'strength', 'flexibility', 'sports', 'hiit', 'yoga', 'swimming', 'cycling', 'walking', 'running')),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 5),
    heart_rate_avg INTEGER,
    distance_km DECIMAL(6,2),
    exercises JSONB, -- Array of exercises with sets/reps
    notes TEXT,
    feeling_before INTEGER CHECK (feeling_before BETWEEN 1 AND 10),
    feeling_after INTEGER CHECK (feeling_after BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nutrition Logs
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'supplement')),
    meal_time TIMESTAMPTZ,
    food_items JSONB, -- Array of food items with nutrition info
    total_calories INTEGER,
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    fiber_g DECIMAL(6,2),
    water_ml INTEGER,
    notes TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sleep Logs
CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bedtime TIMESTAMPTZ,
    wake_time TIMESTAMPTZ,
    sleep_duration_hours DECIMAL(4,2),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    deep_sleep_hours DECIMAL(4,2),
    rem_sleep_hours DECIMAL(4,2),
    wake_count INTEGER DEFAULT 0,
    sleep_latency_minutes INTEGER,
    dreams_noted TEXT,
    factors TEXT[], -- caffeine, screen_time, exercise, stress
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

-- =============================================
-- DOMAIN 5: EMOTIONAL/SOCIAL (Kecerdasan Emosional)
-- Entities: EmotionLogs, Relationships, Communications
-- =============================================

-- Emotion Logs
CREATE TABLE IF NOT EXISTS public.emotion_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_timestamp TIMESTAMPTZ DEFAULT NOW(),
    primary_emotion VARCHAR(50) NOT NULL,
    secondary_emotion VARCHAR(50),
    intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
    trigger_type VARCHAR(50), -- 'work', 'relationship', 'health', 'financial', 'other'
    trigger_description TEXT,
    physical_sensations TEXT[],
    thoughts TEXT,
    coping_strategy_used TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationship Network
CREATE TABLE IF NOT EXISTS public.relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    person_name VARCHAR(100) NOT NULL,
    relationship_type VARCHAR(50) CHECK (relationship_type IN ('family', 'friend', 'mentor', 'mentee', 'colleague', 'romantic', 'professional', 'other')),
    closeness_level INTEGER CHECK (closeness_level BETWEEN 1 AND 10),
    trust_level INTEGER CHECK (trust_level BETWEEN 1 AND 10),
    last_interaction_date DATE,
    interaction_frequency VARCHAR(20) CHECK (interaction_frequency IN ('daily', 'weekly', 'monthly', 'occasionally', 'rarely')),
    relationship_quality INTEGER CHECK (relationship_quality BETWEEN 1 AND 10),
    goals_for_relationship TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication Sessions
CREATE TABLE IF NOT EXISTS public.communication_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    session_type VARCHAR(50) CHECK (session_type IN ('public_speaking', 'presentation', 'negotiation', 'active_listening', 'conflict_resolution', 'networking', 'interview')),
    context TEXT,
    audience_size INTEGER,
    duration_minutes INTEGER,
    preparation_time_minutes INTEGER,
    self_rating INTEGER CHECK (self_rating BETWEEN 1 AND 10),
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 10),
    key_learnings TEXT,
    areas_to_improve TEXT[],
    feedback_received TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOMAIN 6: MENTAL HEALTH (Kesehatan Mental)
-- Entities: MentalChecks, MindfulnessSessions, ResilienceExercises
-- =============================================

-- Mental Health Check-ins
CREATE TABLE IF NOT EXISTS public.mental_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    check_timestamp TIMESTAMPTZ DEFAULT NOW(),
    mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
    anxiety_level INTEGER CHECK (anxiety_level BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
    motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
    focus_level INTEGER CHECK (focus_level BETWEEN 1 AND 10),
    social_connectedness INTEGER CHECK (social_connectedness BETWEEN 1 AND 10),
    self_esteem INTEGER CHECK (self_esteem BETWEEN 1 AND 10),
    optimism INTEGER CHECK (optimism BETWEEN 1 AND 10),
    coping_strategies_used TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mindfulness Sessions
CREATE TABLE IF NOT EXISTS public.mindfulness_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    session_type VARCHAR(50) CHECK (session_type IN ('breathing', 'meditation', 'body_scan', 'gratitude', 'visualization', 'journaling', 'walking_meditation')),
    duration_minutes INTEGER NOT NULL,
    guided BOOLEAN DEFAULT true,
    guide_name VARCHAR(100),
    focus_quality INTEGER CHECK (focus_quality BETWEEN 1 AND 10),
    calmness_before INTEGER CHECK (calmness_before BETWEEN 1 AND 10),
    calmness_after INTEGER CHECK (calmness_after BETWEEN 1 AND 10),
    distractions_count INTEGER DEFAULT 0,
    insights TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resilience Exercises
CREATE TABLE IF NOT EXISTS public.resilience_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exercise_date DATE NOT NULL DEFAULT CURRENT_DATE,
    exercise_type VARCHAR(50) CHECK (exercise_type IN ('cbt', 'reframing', 'gratitude', 'values_clarification', 'problem_solving', 'social_support', 'self_compassion')),
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    situation_description TEXT,
    original_thought TEXT,
    reframed_thought TEXT,
    emotional_impact INTEGER CHECK (emotional_impact BETWEEN -5 AND 5),
    insights_gained TEXT,
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOMAIN 7: CHARACTER (Karakter & Etika)
-- Entities: CharacterStrengths, EthicalDecisions, IntegrityLogs
-- =============================================

-- Character Strengths Assessment (VIA)
CREATE TABLE IF NOT EXISTS public.character_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- 6 VIA Virtues
    wisdom_score INTEGER CHECK (wisdom_score BETWEEN 1 AND 10),
    courage_score INTEGER CHECK (courage_score BETWEEN 1 AND 10),
    humanity_score INTEGER CHECK (humanity_score BETWEEN 1 AND 10),
    justice_score INTEGER CHECK (justice_score BETWEEN 1 AND 10),
    temperance_score INTEGER CHECK (temperance_score BETWEEN 1 AND 10),
    transcendence_score INTEGER CHECK (transcendence_score BETWEEN 1 AND 10),
    -- Top strengths and growth areas
    top_strengths TEXT[],
    growth_areas TEXT[],
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ethical Decisions Log
CREATE TABLE IF NOT EXISTS public.ethical_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    decision_date DATE NOT NULL DEFAULT CURRENT_DATE,
    situation_description TEXT NOT NULL,
    ethical_dilemma TEXT,
    stakeholders_involved TEXT[],
    options_considered JSONB, -- Array of options with pros/cons
    decision_made TEXT,
    ethical_principles_applied TEXT[],
    outcome TEXT,
    reflection TEXT,
    would_decide_same BOOLEAN,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrity Logs
CREATE TABLE IF NOT EXISTS public.integrity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    integrity_type VARCHAR(50) CHECK (integrity_type IN ('promise_kept', 'deadline_met', 'truth_told', 'responsibility_taken', 'consistency_shown', 'value_lived')),
    description TEXT NOT NULL,
    was_fulfilled BOOLEAN NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    temptation_strength INTEGER CHECK (temptation_strength BETWEEN 1 AND 5),
    how_handled TEXT,
    impact_on_others TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOMAIN 8: SPIRITUAL (Pengembangan Spiritual)
-- Entities: PurposeExplorations, GratitudeLogs, Contributions
-- =============================================

-- Purpose & Meaning Exploration
CREATE TABLE IF NOT EXISTS public.purpose_explorations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    exploration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    exploration_type VARCHAR(50) CHECK (exploration_type IN ('ikigai', 'values_clarification', 'legacy_planning', 'life_purpose', 'mission_statement')),
    -- Ikigai elements
    what_you_love TEXT[],
    what_world_needs TEXT[],
    what_you_can_be_paid_for TEXT[],
    what_you_are_good_at TEXT[],
    -- Purpose statements
    current_purpose_statement TEXT,
    desired_purpose_statement TEXT,
    alignment_score INTEGER CHECK (alignment_score BETWEEN 1 AND 10),
    action_plan TEXT,
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gratitude Practice
CREATE TABLE IF NOT EXISTS public.gratitude_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    gratitude_items JSONB NOT NULL, -- Array with item and reason
    depth_of_gratitude INTEGER CHECK (depth_of_gratitude BETWEEN 1 AND 5),
    mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
    mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, log_date)
);

-- Contributions & Altruism
CREATE TABLE IF NOT EXISTS public.contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    contribution_type VARCHAR(50) CHECK (contribution_type IN ('volunteer', 'donation', 'knowledge_share', 'mentorship', 'community_service', 'environmental', 'random_kindness')),
    recipient_type VARCHAR(50) CHECK (recipient_type IN ('individual', 'organization', 'community', 'environment')),
    description TEXT NOT NULL,
    time_invested_minutes INTEGER,
    resources_contributed JSONB, -- {"money": 100000, "items": ["books"]}
    skills_used TEXT[],
    impact_description TEXT,
    personal_significance INTEGER CHECK (personal_significance BETWEEN 1 AND 10),
    fulfillment_rating INTEGER CHECK (fulfillment_rating BETWEEN 1 AND 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOMAIN 9: ENVIRONMENTAL (Gaya Hidup & Lingkungan)
-- Entities: EnvironmentalImpact, MinimalismLogs, LegacyProjects
-- =============================================

-- Environmental Impact Tracking
CREATE TABLE IF NOT EXISTS public.environmental_impact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Carbon footprint
    transport_mode VARCHAR(50),
    transport_km DECIMAL(8,2),
    carbon_footprint_kg DECIMAL(8,2),
    -- Resource usage
    electricity_kwh DECIMAL(8,2),
    water_liters DECIMAL(8,2),
    -- Waste management
    waste_produced_kg DECIMAL(6,2),
    recycled_kg DECIMAL(6,2),
    composted_kg DECIMAL(6,2),
    -- Sustainable actions
    reusable_items_used TEXT[],
    plastic_avoided BOOLEAN DEFAULT false,
    eco_friendly_choices TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tracking_date)
);

-- Minimalism & Organization
CREATE TABLE IF NOT EXISTS public.minimalism_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    action_type VARCHAR(50) CHECK (action_type IN ('declutter', 'donate', 'organize', 'digital_cleanup', 'mindful_purchase', 'repair')),
    items_removed INTEGER DEFAULT 0,
    items_donated INTEGER DEFAULT 0,
    items_purchased INTEGER DEFAULT 0,
    space_organized TEXT,
    time_spent_minutes INTEGER,
    mental_clarity_before INTEGER CHECK (mental_clarity_before BETWEEN 1 AND 10),
    mental_clarity_after INTEGER CHECK (mental_clarity_after BETWEEN 1 AND 10),
    satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 10),
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legacy Projects
CREATE TABLE IF NOT EXISTS public.legacy_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_name VARCHAR(200) NOT NULL,
    project_type VARCHAR(50) CHECK (project_type IN ('digital', 'physical', 'knowledge', 'community', 'creative', 'social_impact')),
    description TEXT,
    vision TEXT,
    start_date DATE,
    target_completion_date DATE,
    current_status VARCHAR(20) DEFAULT 'planning' CHECK (current_status IN ('planning', 'in_progress', 'completed', 'on_hold', 'transferred')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    intended_beneficiaries TEXT[],
    sustainability_plan TEXT,
    knowledge_transfer_plan TEXT,
    milestones JSONB, -- Array of milestones with dates and status
    collaborators JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_dimension ON public.goals(dimension);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_goal ON public.tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_energy_logs_user_date ON public.energy_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_workouts_user ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON public.nutrition_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_emotion_logs_user ON public.emotion_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_checks_user ON public.mental_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_gratitude_logs_user ON public.gratitude_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_user ON public.contributions(user_id);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mindfulness_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resilience_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethical_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purpose_explorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_impact ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minimalism_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can manage their own data
CREATE POLICY "Users manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own time_blocks" ON public.time_blocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own energy_logs" ON public.energy_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Users manage own user_skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view resources" ON public.learning_resources FOR SELECT USING (true);
CREATE POLICY "Users manage own learning_progress" ON public.learning_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own budgets" ON public.budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own financial_goals" ON public.financial_goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own physical_metrics" ON public.physical_metrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own nutrition_logs" ON public.nutrition_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own sleep_logs" ON public.sleep_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own emotion_logs" ON public.emotion_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own relationships" ON public.relationships FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own communication_sessions" ON public.communication_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own mental_checks" ON public.mental_checks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own mindfulness_sessions" ON public.mindfulness_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own resilience_exercises" ON public.resilience_exercises FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own character_assessments" ON public.character_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own ethical_decisions" ON public.ethical_decisions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own integrity_logs" ON public.integrity_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own purpose_explorations" ON public.purpose_explorations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own gratitude_logs" ON public.gratitude_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own contributions" ON public.contributions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own environmental_impact" ON public.environmental_impact FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own minimalism_logs" ON public.minimalism_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own legacy_projects" ON public.legacy_projects FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- SEED DATA - TRANSACTION CATEGORIES
-- =============================================
INSERT INTO public.transaction_categories (name, type, color_code, icon_name, is_system) VALUES
('Uang Saku', 'income', '#22C55E', 'wallet', true),
('Beasiswa', 'income', '#3B82F6', 'school', true),
('Gaji Part-time', 'income', '#8B5CF6', 'work', true),
('Hadiah', 'income', '#F59E0B', 'gift', true),
('Makanan & Minuman', 'expense', '#EF4444', 'restaurant', true),
('Transportasi', 'expense', '#F97316', 'directions_car', true),
('Pendidikan', 'expense', '#3B82F6', 'menu_book', true),
('Kesehatan', 'expense', '#EC4899', 'medical_services', true),
('Hiburan', 'expense', '#8B5CF6', 'sports_esports', true),
('Belanja', 'expense', '#F59E0B', 'shopping_bag', true),
('Komunikasi', 'expense', '#06B6D4', 'phone', true),
('Tabungan', 'transfer', '#22C55E', 'savings', true),
('Investasi', 'investment', '#3B82F6', 'trending_up', true)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA - SKILLS CATALOG
-- =============================================
INSERT INTO public.skills (name, description, category, difficulty_level, estimated_hours_to_master, icon_name) VALUES
-- Technical Skills
('Programming Python', 'Bahasa pemrograman serba guna', 'technical', 3, 200, 'code'),
('Web Development', 'Membuat website dengan HTML/CSS/JS', 'technical', 3, 150, 'web'),
('Data Analysis', 'Analisis data dengan Python/R', 'technical', 4, 180, 'analytics'),
('Machine Learning', 'ML dan AI fundamentals', 'technical', 5, 300, 'psychology'),
('CAD Design', 'Computer-aided design untuk engineering', 'technical', 4, 200, 'engineering'),
-- Soft Skills
('Public Speaking', 'Berbicara di depan umum', 'soft', 3, 100, 'record_voice_over'),
('Leadership', 'Kepemimpinan dan manajemen tim', 'soft', 4, 150, 'groups'),
('Critical Thinking', 'Berpikir kritis dan analitis', 'soft', 4, 120, 'psychology'),
('Negotiation', 'Teknik negosiasi efektif', 'soft', 4, 80, 'handshake'),
('Time Management', 'Manajemen waktu produktif', 'soft', 2, 50, 'schedule'),
-- Digital Skills
('Digital Marketing', 'Pemasaran digital', 'digital', 3, 100, 'campaign'),
('UI/UX Design', 'Desain antarmuka dan pengalaman pengguna', 'digital', 4, 150, 'design_services'),
('Video Editing', 'Editing video profesional', 'digital', 3, 100, 'movie'),
('Content Creation', 'Membuat konten kreatif', 'digital', 2, 80, 'create'),
-- Language Skills
('English Proficiency', 'Kemahiran bahasa Inggris', 'language', 3, 300, 'translate'),
('Technical Writing', 'Menulis dokumen teknis', 'language', 3, 100, 'description')
ON CONFLICT DO NOTHING;

-- =============================================
-- FUNCTIONS FOR DIMENSION SCORING
-- =============================================

-- Calculate overall domain score
CREATE OR REPLACE FUNCTION public.calculate_domain_score(
    p_user_id UUID,
    p_domain VARCHAR(50),
    p_days INTEGER DEFAULT 30
)
RETURNS DECIMAL AS $$
DECLARE
    v_score DECIMAL;
BEGIN
    CASE p_domain
        WHEN 'self_management' THEN
            -- Score based on goals completion, task completion, energy tracking
            SELECT COALESCE(
                (SELECT COUNT(*) * 10 FROM public.goals WHERE user_id = p_user_id AND status = 'completed' AND updated_at > NOW() - INTERVAL '1 day' * p_days) +
                (SELECT COUNT(*) * 5 FROM public.tasks WHERE user_id = p_user_id AND status = 'completed' AND completed_at > NOW() - INTERVAL '1 day' * p_days) +
                (SELECT COUNT(*) * 2 FROM public.energy_logs WHERE user_id = p_user_id AND log_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'intellectual' THEN
            -- Score based on skills learned, learning progress
            SELECT COALESCE(
                (SELECT SUM(proficiency_level) * 10 FROM public.user_skills WHERE user_id = p_user_id) +
                (SELECT SUM(progress_percentage) / 10 FROM public.learning_progress WHERE user_id = p_user_id AND started_at > NOW() - INTERVAL '1 day' * p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'financial' THEN
            -- Score based on budget adherence, savings rate
            SELECT COALESCE(
                (SELECT COUNT(*) * 20 FROM public.budgets WHERE user_id = p_user_id AND actual_savings >= savings_target) +
                (SELECT COUNT(*) FROM public.transactions WHERE user_id = p_user_id AND transaction_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'physical' THEN
            -- Score based on workout consistency, nutrition tracking
            SELECT COALESCE(
                (SELECT COUNT(*) * 5 FROM public.workouts WHERE user_id = p_user_id AND workout_date > CURRENT_DATE - p_days) +
                (SELECT COUNT(*) * 2 FROM public.nutrition_logs WHERE user_id = p_user_id AND log_date > CURRENT_DATE - p_days) +
                (SELECT AVG(sleep_quality) * 5 FROM public.sleep_logs WHERE user_id = p_user_id AND log_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'emotional' THEN
            -- Score based on emotion tracking, relationship quality
            SELECT COALESCE(
                (SELECT COUNT(*) * 3 FROM public.emotion_logs WHERE user_id = p_user_id AND log_timestamp > NOW() - INTERVAL '1 day' * p_days) +
                (SELECT AVG(relationship_quality) * 5 FROM public.relationships WHERE user_id = p_user_id) +
                (SELECT COUNT(*) * 5 FROM public.communication_sessions WHERE user_id = p_user_id AND session_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'mental' THEN
            -- Score based on mental checks, mindfulness practice
            SELECT COALESCE(
                (SELECT AVG(mood_rating) * 5 FROM public.mental_checks WHERE user_id = p_user_id AND check_timestamp > NOW() - INTERVAL '1 day' * p_days) +
                (SELECT COUNT(*) * 5 FROM public.mindfulness_sessions WHERE user_id = p_user_id AND session_date > CURRENT_DATE - p_days) +
                (SELECT COUNT(*) * 10 FROM public.resilience_exercises WHERE user_id = p_user_id AND exercise_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'character' THEN
            -- Score based on character assessments, integrity logs
            SELECT COALESCE(
                (SELECT (wisdom_score + courage_score + humanity_score + justice_score + temperance_score + transcendence_score) FROM public.character_assessments WHERE user_id = p_user_id ORDER BY assessment_date DESC LIMIT 1) +
                (SELECT COUNT(*) * 5 FROM public.integrity_logs WHERE user_id = p_user_id AND was_fulfilled = true AND log_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'spiritual' THEN
            -- Score based on purpose clarity, gratitude practice, contributions
            SELECT COALESCE(
                (SELECT alignment_score * 5 FROM public.purpose_explorations WHERE user_id = p_user_id ORDER BY exploration_date DESC LIMIT 1) +
                (SELECT COUNT(*) * 5 FROM public.gratitude_logs WHERE user_id = p_user_id AND log_date > CURRENT_DATE - p_days) +
                (SELECT COUNT(*) * 10 FROM public.contributions WHERE user_id = p_user_id AND contribution_date > CURRENT_DATE - p_days)
            , 0) / 10.0 INTO v_score;
            
        WHEN 'environmental' THEN
            -- Score based on environmental tracking, minimalism practice
            SELECT COALESCE(
                (SELECT COUNT(*) * 10 FROM public.environmental_impact WHERE user_id = p_user_id AND tracking_date > CURRENT_DATE - p_days) +
                (SELECT AVG(satisfaction_rating) * 5 FROM public.minimalism_logs WHERE user_id = p_user_id AND log_date > CURRENT_DATE - p_days) +
                (SELECT COUNT(*) * 15 FROM public.legacy_projects WHERE user_id = p_user_id AND current_status = 'in_progress')
            , 0) / 10.0 INTO v_score;
            
        ELSE
            v_score := 0;
    END CASE;
    
    -- Normalize to 0-100 scale
    RETURN LEAST(GREATEST(v_score, 0), 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all domain scores for a user
CREATE OR REPLACE FUNCTION public.get_all_domain_scores(p_user_id UUID)
RETURNS TABLE (
    domain VARCHAR(50),
    score DECIMAL,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.domain_name::VARCHAR(50),
        public.calculate_domain_score(p_user_id, d.domain_name, 30),
        NOW()
    FROM (
        VALUES 
            ('self_management'),
            ('intellectual'),
            ('financial'),
            ('physical'),
            ('emotional'),
            ('mental'),
            ('character'),
            ('spiritual'),
            ('environmental')
    ) AS d(domain_name);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMPLETE!
-- =============================================
-- This schema includes:
-- ✓ 30+ Tables across 9 domains
-- ✓ Comprehensive indexes
-- ✓ Row Level Security policies
-- ✓ Seed data for categories and skills
-- ✓ Scoring functions for each domain
-- ============================================
