-- PPSDM KMITS Complete Database Schema
-- Production Ready with Indexes, RLS, and Audit Logging
-- Version: 2.0.0
-- Date: 2026-01-18

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- TABLE 1: USERS (Extended Profile)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  nim TEXT UNIQUE,
  faculty TEXT,
  program TEXT,
  year INTEGER,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'supervisor', 'admin')),
  tenant_id TEXT DEFAULT 'its',
  is_beta_tester BOOLEAN DEFAULT FALSE,
  beta_cohort TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_nim ON public.users(nim);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON public.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_beta ON public.users(is_beta_tester) WHERE is_beta_tester = TRUE;

-- ========================================
-- TABLE 2: ASSESSMENT RESULTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL CHECK (dimension IN (
    'cognitive', 'self_management', 'financial', 'physical_health',
    'emotional_intelligence', 'mental_health', 'character_ethics',
    'spiritual', 'environmental'
  )),
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  percentile INTEGER CHECK (percentile >= 0 AND percentile <= 100),
  category TEXT CHECK (category IN ('poor', 'below_average', 'average', 'good', 'excellent')),
  subdimensions JSONB DEFAULT '{}',
  responses JSONB DEFAULT '[]',
  time_spent_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  version TEXT DEFAULT '1.0'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assessment_user ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_dimension ON public.assessment_results(dimension);
CREATE INDEX IF NOT EXISTS idx_assessment_user_dim ON public.assessment_results(user_id, dimension);
CREATE INDEX IF NOT EXISTS idx_assessment_completed ON public.assessment_results(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessment_user_dim_completed ON public.assessment_results(user_id, dimension, completed_at DESC);

-- ========================================
-- TABLE 3: USER PROGRESS (Gamification)
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  badges TEXT[] DEFAULT '{}',
  completed_activities INTEGER DEFAULT 0,
  assessments_completed INTEGER DEFAULT 0,
  resources_completed INTEGER DEFAULT 0,
  goals_achieved INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_xp ON public.user_progress(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_progress_level ON public.user_progress(level DESC);
CREATE INDEX IF NOT EXISTS idx_progress_streak ON public.user_progress(streak_days DESC);

-- ========================================
-- TABLE 4: ACTIVITIES (xAPI-like)
-- ========================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  verb TEXT NOT NULL,
  object_type TEXT,
  object_id TEXT,
  dimension TEXT,
  xp_earned INTEGER DEFAULT 0,
  result JSONB DEFAULT '{}',
  context JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activities_user ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON public.activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_type ON public.activities(user_id, type);
CREATE INDEX IF NOT EXISTS idx_activities_dimension ON public.activities(dimension);

-- ========================================
-- TABLE 5: GOALS
-- ========================================
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  dimension TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  deadline DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'paused')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_goals_user ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_user_status ON public.goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON public.goals(deadline);

-- ========================================
-- TABLE 6: COURSE ENROLLMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  progress_percent NUMERIC(5,2) DEFAULT 0,
  current_module TEXT,
  current_lesson TEXT,
  completed_lessons TEXT[] DEFAULT '{}',
  quiz_scores JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.course_enrollments(user_id, course_id);

-- ========================================
-- TABLE 7: BETA FEEDBACK
-- ========================================
CREATE TABLE IF NOT EXISTS public.beta_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'suggestion', 'praise', 'question')),
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  page_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'resolved', 'wont_fix')),
  priority TEXT DEFAULT 'medium',
  admin_notes TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.beta_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.beta_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.beta_feedback(status);

-- ========================================
-- TABLE 8: AUDIT LOGS
-- ========================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_table ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON public.audit_logs(action);

-- ========================================
-- TABLE 9: TENANTS (Multi-tenancy)
-- ========================================
CREATE TABLE IF NOT EXISTS public.tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#003366',
  secondary_color TEXT DEFAULT '#6366f1',
  features TEXT[] DEFAULT '{}',
  auth_type TEXT DEFAULT 'email_password' CHECK (auth_type IN ('email_password', 'sso', 'ldap')),
  sso_config JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tenant (ITS)
INSERT INTO public.tenants (id, name, domain, features) VALUES
('its', 'Institut Teknologi Sepuluh Nopember', 'ppsdm.km.its.ac.id', 
 ARRAY['all_assessments', 'ai_tutor', 'analytics', 'mentorship', 'gamification'])
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- TABLE 10: PERFORMANCE METRICS
-- ========================================
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  unit TEXT,
  page_url TEXT,
  user_agent TEXT,
  tenant_id TEXT DEFAULT 'its',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_metrics_name ON public.performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_metrics_created ON public.performance_metrics(created_at DESC);

-- ========================================
-- TABLE 11: A/B EXPERIMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS public.ab_experiments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  variants JSONB NOT NULL,
  metrics TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'paused', 'completed')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ab_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  experiment_id TEXT REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, experiment_id)
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Assessment policies
CREATE POLICY "Users can read own assessments" ON public.assessment_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments" ON public.assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress policies
CREATE POLICY "Users can read own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Activities policies
CREATE POLICY "Users can read own activities" ON public.activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can manage own goals" ON public.goals
  FOR ALL USING (auth.uid() = user_id);

-- Enrollments policies
CREATE POLICY "Users can manage own enrollments" ON public.course_enrollments
  FOR ALL USING (auth.uid() = user_id);

-- Feedback policies
CREATE POLICY "Users can insert feedback" ON public.beta_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can read own feedback" ON public.beta_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Audit logging function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_assessment_results
  AFTER INSERT OR UPDATE OR DELETE ON public.assessment_results
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_user_progress
  AFTER INSERT OR UPDATE OR DELETE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- ========================================
-- HELPER FUNCTIONS
-- ========================================

-- Get user leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  total_xp INTEGER,
  level INTEGER,
  badge_count INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.full_name,
    u.avatar_url,
    p.total_xp,
    p.level,
    COALESCE(array_length(p.badges, 1), 0),
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC)
  FROM public.users u
  JOIN public.user_progress p ON u.id = p.user_id
  ORDER BY p.total_xp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user dimension scores
CREATE OR REPLACE FUNCTION get_user_dimension_scores(p_user_id UUID)
RETURNS TABLE (
  dimension TEXT,
  score NUMERIC,
  percentile INTEGER,
  category TEXT,
  completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (ar.dimension)
    ar.dimension,
    ar.score,
    ar.percentile,
    ar.category,
    ar.completed_at
  FROM public.assessment_results ar
  WHERE ar.user_id = p_user_id
  ORDER BY ar.dimension, ar.completed_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate percentile for a score
CREATE OR REPLACE FUNCTION calculate_percentile(p_dimension TEXT, p_score NUMERIC)
RETURNS INTEGER AS $$
DECLARE
  v_percentile INTEGER;
BEGIN
  SELECT ROUND(
    100.0 * COUNT(*) FILTER (WHERE score < p_score) / NULLIF(COUNT(*), 0)
  )::INTEGER INTO v_percentile
  FROM public.assessment_results
  WHERE dimension = p_dimension;
  
  RETURN COALESCE(v_percentile, 50);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.tenants TO anon;
GRANT INSERT ON public.beta_feedback TO anon;

-- ========================================
-- INITIAL DATA (Optional)
-- ========================================

-- Insert sample A/B experiment
INSERT INTO public.ab_experiments (id, name, description, variants, metrics, status) VALUES
('onboarding_flow', 'Onboarding Flow Test', 'Testing different onboarding experiences',
 '[{"id": "control", "weight": 0.5}, {"id": "guided", "weight": 0.25}, {"id": "quick", "weight": 0.25}]'::jsonb,
 ARRAY['activation_rate', 'time_to_first_assessment'],
 'draft')
ON CONFLICT (id) DO NOTHING;
