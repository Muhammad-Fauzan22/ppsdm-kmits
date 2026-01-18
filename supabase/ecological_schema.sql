-- ============================================
-- ECOLOGICAL SYSTEMS THEORY PLATFORM
-- Complete Database Schema
-- Based on Bronfenbrenner's Model
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE: STAKEHOLDERS & ROLES
-- ============================================

CREATE TABLE IF NOT EXISTS public.stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'student', 'lecturer', 'advisor', 'counselor',
    'org_leader', 'department_head', 'dean', 'vice_rector', 'rector',
    'ministry', 'industry_partner', 'researcher', 'admin'
  )),
  system_layer VARCHAR(20) NOT NULL CHECK (system_layer IN (
    'micro', 'meso', 'exo', 'macro', 'chrono'
  )),
  organization VARCHAR(200),
  department VARCHAR(200),
  access_level INT DEFAULT 1 CHECK (access_level BETWEEN 1 AND 5),
  allowed_features TEXT[] DEFAULT '{}',
  dashboard_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stakeholders_role ON public.stakeholders(role);
CREATE INDEX idx_stakeholders_layer ON public.stakeholders(system_layer);
CREATE INDEX idx_stakeholders_user ON public.stakeholders(user_id);

-- ============================================
-- LAYER 1: CHRONOSYSTEM - TEMPORAL TRACKING
-- ============================================

CREATE TABLE IF NOT EXISTS public.chrono_system_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_layer VARCHAR(50) NOT NULL,
  change_type VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  before_state JSONB DEFAULT '{}',
  after_state JSONB DEFAULT '{}',
  impact_metrics JSONB DEFAULT '{}',
  change_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  initiated_by UUID REFERENCES public.stakeholders(id),
  approved_by UUID REFERENCES public.stakeholders(id),
  status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS public.chrono_trajectories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  time_period VARCHAR(50) NOT NULL,
  academic_year VARCHAR(20),
  semester INT,
  ecological_context JSONB DEFAULT '{}',
  proximal_processes JSONB DEFAULT '{}',
  dimension_scores JSONB DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  support_received TEXT[] DEFAULT '{}',
  growth_indicators JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chrono_policy_evolution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_area VARCHAR(100) NOT NULL,
  version INT DEFAULT 1,
  title VARCHAR(200) NOT NULL,
  content JSONB NOT NULL,
  effective_date DATE NOT NULL,
  end_date DATE,
  impact_metrics JSONB DEFAULT '{}',
  stakeholders_involved UUID[] DEFAULT '{}',
  system_layers_affected TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chrono_changes_layer ON public.chrono_system_changes(system_layer);
CREATE INDEX idx_chrono_trajectories_student ON public.chrono_trajectories(student_id);
CREATE INDEX idx_chrono_trajectories_period ON public.chrono_trajectories(time_period);

-- ============================================
-- LAYER 2: MACROSYSTEM - NATIONAL/GLOBAL
-- ============================================

CREATE TABLE IF NOT EXISTS public.macro_stakeholders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stakeholder_id UUID REFERENCES public.stakeholders(id),
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'ministry', 'industry', 'research_institution', 'ngo', 'international_org'
  )),
  organization_name VARCHAR(200) NOT NULL,
  country VARCHAR(100) DEFAULT 'Indonesia',
  contact_info JSONB DEFAULT '{}',
  partnership_level VARCHAR(50) DEFAULT 'observer',
  data_access_scope TEXT[] DEFAULT '{}',
  mou_expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.macro_national_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  national_average DECIMAL(5,2),
  top_10_percentile DECIMAL(5,2),
  bottom_10_percentile DECIMAL(5,2),
  regional_data JSONB DEFAULT '{}',
  year INT NOT NULL,
  source VARCHAR(200),
  methodology_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(dimension, metric_name, year)
);

CREATE TABLE IF NOT EXISTS public.macro_policy_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_stakeholder UUID REFERENCES public.macro_stakeholders(id),
  to_system_layer VARCHAR(50) NOT NULL,
  recommendation_type VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  supporting_data JSONB DEFAULT '{}',
  priority_level INT DEFAULT 3 CHECK (priority_level BETWEEN 1 AND 5),
  status VARCHAR(50) DEFAULT 'pending',
  response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.macro_institution_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comparison_period VARCHAR(50) NOT NULL,
  institutions JSONB NOT NULL,
  dimensions_compared TEXT[] NOT NULL,
  results JSONB NOT NULL,
  insights TEXT[] DEFAULT '{}',
  generated_by UUID REFERENCES public.stakeholders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_macro_benchmarks_dimension ON public.macro_national_benchmarks(dimension);
CREATE INDEX idx_macro_benchmarks_year ON public.macro_national_benchmarks(year);

-- ============================================
-- LAYER 3: EXOSYSTEM - INSTITUTIONAL
-- ============================================

CREATE TABLE IF NOT EXISTS public.exo_institutional_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  applicable_to TEXT[] DEFAULT '{}',
  effective_date DATE NOT NULL,
  review_cycle_months INT DEFAULT 12,
  metrics_tracked TEXT[] DEFAULT '{}',
  compliance_requirements JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.stakeholders(id),
  approved_by UUID REFERENCES public.stakeholders(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exo_resource_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN (
    'budget', 'facilities', 'staff', 'technology', 'program'
  )),
  title VARCHAR(200) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'IDR',
  allocated_to VARCHAR(200) NOT NULL,
  allocation_purpose TEXT,
  fiscal_year INT NOT NULL,
  utilization_metrics JSONB DEFAULT '{}',
  efficiency_score DECIMAL(5,2),
  allocated_by UUID REFERENCES public.stakeholders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exo_department_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department VARCHAR(200) NOT NULL,
  faculty VARCHAR(200),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  target_value DECIMAL(10,2),
  unit VARCHAR(50),
  period VARCHAR(50) NOT NULL,
  trend_direction VARCHAR(20) CHECK (trend_direction IN ('improving', 'declining', 'stable')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exo_quality_assurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area VARCHAR(100) NOT NULL,
  standard_code VARCHAR(50),
  compliance_level DECIMAL(5,2),
  audit_date DATE NOT NULL,
  findings JSONB DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  action_items JSONB DEFAULT '{}',
  next_audit_date DATE,
  auditor UUID REFERENCES public.stakeholders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_exo_policies_category ON public.exo_institutional_policies(category);
CREATE INDEX idx_exo_resources_type ON public.exo_resource_allocations(resource_type);
CREATE INDEX idx_exo_metrics_dept ON public.exo_department_metrics(department);

-- ============================================
-- LAYER 4: MESOSYSTEM - CROSS-SYSTEM
-- ============================================

CREATE TABLE IF NOT EXISTS public.meso_coordinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_system VARCHAR(100) NOT NULL,
  to_system VARCHAR(100) NOT NULL,
  coordination_type VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  meeting_frequency VARCHAR(50),
  shared_metrics TEXT[] DEFAULT '{}',
  participants JSONB DEFAULT '{}',
  effectiveness_score DECIMAL(3,2),
  last_meeting_date DATE,
  next_meeting_date DATE,
  meeting_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meso_integrated_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code VARCHAR(50) UNIQUE NOT NULL,
  project_name VARCHAR(200) NOT NULL,
  description TEXT,
  involved_systems TEXT[] NOT NULL,
  objectives JSONB NOT NULL,
  timeline JSONB DEFAULT '{}',
  participants JSONB DEFAULT '{}',
  budget DECIMAL(15,2),
  outcomes JSONB DEFAULT '{}',
  integration_level VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'planning',
  lead_coordinator UUID REFERENCES public.stakeholders(id),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meso_system_alignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  systems_compared TEXT[] NOT NULL,
  alignment_dimension VARCHAR(100) NOT NULL,
  alignment_score DECIMAL(5,2) NOT NULL,
  misalignment_areas TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  action_plan JSONB DEFAULT '{}',
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review_date DATE
);

CREATE TABLE IF NOT EXISTS public.meso_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_system VARCHAR(100) NOT NULL,
  to_systems TEXT[] NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal',
  action_required BOOLEAN DEFAULT FALSE,
  action_deadline DATE,
  acknowledged_by UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meso_coord_systems ON public.meso_coordinations(from_system, to_system);
CREATE INDEX idx_meso_projects_status ON public.meso_integrated_projects(status);

-- ============================================
-- LAYER 5: MICROSYSTEM - DIRECT ENVIRONMENTS
-- ============================================

-- 5A: Academic System
CREATE TABLE IF NOT EXISTS public.micro_academic_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id VARCHAR(50) NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  lecturer_id UUID REFERENCES public.stakeholders(id),
  activity_type VARCHAR(50) NOT NULL,
  ecological_context JSONB DEFAULT '{}',
  proximal_processes JSONB DEFAULT '{}',
  learning_outcomes TEXT[] DEFAULT '{}',
  student_engagement JSONB DEFAULT '{}',
  resources_used TEXT[] DEFAULT '{}',
  activity_date DATE NOT NULL,
  duration_minutes INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.micro_faculty_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id UUID REFERENCES public.stakeholders(id),
  student_id UUID REFERENCES public.users(id),
  interaction_type VARCHAR(50) NOT NULL,
  context VARCHAR(100),
  duration_minutes INT,
  quality_rating INT CHECK (quality_rating BETWEEN 1 AND 5),
  topics_discussed TEXT[] DEFAULT '{}',
  action_items TEXT[] DEFAULT '{}',
  follow_up_date DATE,
  notes TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5B: Organization System
CREATE TABLE IF NOT EXISTS public.micro_organization_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID,
  organization_name VARCHAR(200) NOT NULL,
  organization_type VARCHAR(50) NOT NULL CHECK (organization_type IN (
    'bem', 'himpunan', 'ukm', 'community', 'project_team'
  )),
  activity_name VARCHAR(200) NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  developmental_dimensions TEXT[] DEFAULT '{}',
  participation_count INT DEFAULT 0,
  participation_metrics JSONB DEFAULT '{}',
  impact_assessment JSONB DEFAULT '{}',
  budget DECIMAL(12,2),
  activity_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.micro_peer_networks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  network_type VARCHAR(50) NOT NULL CHECK (network_type IN (
    'academic', 'social', 'professional', 'mentorship', 'study_group'
  )),
  connections JSONB DEFAULT '{}',
  network_size INT DEFAULT 0,
  network_strength_score DECIMAL(5,2),
  diversity_index DECIMAL(5,2),
  interaction_frequency VARCHAR(50),
  key_connections UUID[] DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5C: Personal Development System
CREATE TABLE IF NOT EXISTS public.micro_proximal_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  process_type VARCHAR(100) NOT NULL,
  partner_type VARCHAR(50),
  partner_id UUID,
  ecological_context VARCHAR(100),
  duration_minutes INT,
  quality_score INT CHECK (quality_score BETWEEN 1 AND 5),
  reciprocity_level INT CHECK (reciprocity_level BETWEEN 1 AND 5),
  complexity_level INT CHECK (complexity_level BETWEEN 1 AND 5),
  learning_outcomes TEXT[] DEFAULT '{}',
  dimension_impacts JSONB DEFAULT '{}',
  reflection TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.micro_ecological_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  from_context VARCHAR(100) NOT NULL,
  to_context VARCHAR(100) NOT NULL,
  transition_type VARCHAR(50) NOT NULL CHECK (transition_type IN (
    'planned', 'unplanned', 'gradual', 'sudden', 'normative', 'non_normative'
  )),
  reason TEXT,
  support_needed TEXT[] DEFAULT '{}',
  support_received TEXT[] DEFAULT '{}',
  adaptation_level INT CHECK (adaptation_level BETWEEN 1 AND 5),
  challenges_faced TEXT[] DEFAULT '{}',
  coping_strategies TEXT[] DEFAULT '{}',
  transition_date DATE NOT NULL,
  adaptation_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.micro_personal_ecology_map (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  microsystems JSONB DEFAULT '{}',
  mesosystem_connections JSONB DEFAULT '{}',
  exosystem_influences JSONB DEFAULT '{}',
  macrosystem_context JSONB DEFAULT '{}',
  chronosystem_events JSONB DEFAULT '{}',
  protective_factors TEXT[] DEFAULT '{}',
  risk_factors TEXT[] DEFAULT '{}',
  support_network JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Microsystem
CREATE INDEX idx_micro_academic_course ON public.micro_academic_activities(course_id);
CREATE INDEX idx_micro_faculty_int_student ON public.micro_faculty_interactions(student_id);
CREATE INDEX idx_micro_org_type ON public.micro_organization_activities(organization_type);
CREATE INDEX idx_micro_proximal_student ON public.micro_proximal_processes(student_id);
CREATE INDEX idx_micro_transitions_student ON public.micro_ecological_transitions(student_id);

-- ============================================
-- CORE: UNIFIED DATA & ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS public.core_ecological_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(100) NOT NULL,
  system_layer VARCHAR(20) NOT NULL,
  source_table VARCHAR(100) NOT NULL,
  source_id UUID NOT NULL,
  student_id UUID REFERENCES public.users(id),
  stakeholder_id UUID REFERENCES public.stakeholders(id),
  event_data JSONB NOT NULL,
  impact_assessment JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.core_system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_layer VARCHAR(20) NOT NULL,
  subsystem VARCHAR(100),
  health_score DECIMAL(5,2) NOT NULL,
  metrics JSONB NOT NULL,
  issues_detected TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.core_intervention_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.users(id),
  target_outcomes TEXT[] NOT NULL,
  microsystem_actions JSONB DEFAULT '{}',
  mesosystem_coordination JSONB DEFAULT '{}',
  exosystem_supports JSONB DEFAULT '{}',
  timeline JSONB DEFAULT '{}',
  progress_indicators JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES public.stakeholders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_core_events_layer ON public.core_ecological_events(system_layer);
CREATE INDEX idx_core_events_student ON public.core_ecological_events(student_id);
CREATE INDEX idx_core_health_layer ON public.core_system_health(system_layer);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chrono_trajectories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_proximal_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_personal_ecology_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_faculty_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_peer_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.micro_ecological_transitions ENABLE ROW LEVEL SECURITY;

-- Students can only see their own data
CREATE POLICY "Students see own trajectories" ON public.chrono_trajectories
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students see own proximal processes" ON public.micro_proximal_processes
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students manage own ecology map" ON public.micro_personal_ecology_map
  FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Students see own transitions" ON public.micro_ecological_transitions
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students see own networks" ON public.micro_peer_networks
  FOR ALL USING (student_id = auth.uid());

-- Faculty can see their interactions
CREATE POLICY "Faculty see own interactions" ON public.micro_faculty_interactions
  FOR SELECT USING (
    faculty_id IN (SELECT id FROM public.stakeholders WHERE user_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_ecological_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stakeholders_updated
  BEFORE UPDATE ON public.stakeholders
  FOR EACH ROW EXECUTE FUNCTION update_ecological_timestamp();

CREATE TRIGGER trigger_meso_coord_updated
  BEFORE UPDATE ON public.meso_coordinations
  FOR EACH ROW EXECUTE FUNCTION update_ecological_timestamp();

CREATE TRIGGER trigger_exo_policies_updated
  BEFORE UPDATE ON public.exo_institutional_policies
  FOR EACH ROW EXECUTE FUNCTION update_ecological_timestamp();

-- Log ecological events automatically
CREATE OR REPLACE FUNCTION log_ecological_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.core_ecological_events (
    event_type, system_layer, source_table, source_id, event_data
  ) VALUES (
    TG_OP, TG_ARGV[0], TG_TABLE_NAME, NEW.id, to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANTS
-- ============================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
