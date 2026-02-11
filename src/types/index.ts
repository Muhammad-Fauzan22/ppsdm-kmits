/**
 * Core Type Definitions for PPSDM KMITS
 * 
 * This file contains strict TypeScript interfaces to replace 'any' types
 * throughout the application.
 * 
 * @module types
 * @version 2.0.0
 */

// ============================================================================
// DATABASE ENTITY TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  nim: string | null;
  role: 'admin' | 'student' | 'supervisor';
  avatar_url: string | null;
  xp: number;
  level: number;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  nim: string | null;
  department: string | null;
  role: 'admin' | 'student' | 'supervisor';
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  dimension_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'archived';
  overall_score: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: string;
  assessment_id: string;
  dimension_id: string;
  question_id: string;
  raw_score: number;
  normalized_score: number;
  percentile_rank: number | null;
  created_at: string;
}

export interface Dimension {
  id: string;
  name: string;
  category: 'cognitive' | 'emotional' | 'social' | 'physical' | 'spiritual' | 'character' | 'financial' | 'self_management';
  description: string | null;
  max_score: number;
  weight: number;
  icon: string | null;
  color: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  xp_earned: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  dimension_id: string | null;
  title: string;
  description: string | null;
  status: 'active' | 'completed' | 'abandoned';
  progress: number;
  target_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string | null;
  resource_id: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  podcast_url: string | null;
  slide_url: string | null;
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  quiz_score: number;
  xp_earned: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  operation: string;
  user_id: string | null;
  target_user_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  timestamp: string;
  environment: string;
  success: boolean;
  error: string | null;
}

// ============================================================================
// ASSESSMENT TYPES
// ============================================================================

export interface AssessmentQuestion {
  id: string;
  dimension_id: string;
  text: string;
  type: 'likert_5' | 'likert_7' | 'multiple_choice' | 'open_ended';
  options: QuestionOption[] | null;
  weight: number;
  order_index: number;
}

export interface QuestionOption {
  value: number;
  label: string;
}

export interface AssessmentResponse {
  question_id: string;
  value: number | string;
  timestamp: string;
}

export interface DimensionScore {
  dimension_id: string;
  dimension_name: string;
  category: string;
  raw_score: number;
  normalized_score: number;
  percentage: number;
  max_score: number;
  level: 'excellent' | 'good' | 'average' | 'needs-improvement';
  description: string;
}

export interface HolisticScores {
  cognitive: DimensionScore;
  emotional: DimensionScore;
  social: DimensionScore;
  physical: DimensionScore;
  spiritual: DimensionScore;
  character: DimensionScore;
  financial: DimensionScore;
  selfManagement: DimensionScore;
}

// ============================================================================
// API TYPES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface QueryParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  filter?: Record<string, string | number | boolean>;
}

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: 'active' | 'paused' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event';
  config: Record<string, unknown>;
}

export interface WorkflowStep {
  id: string;
  type: 'action' | 'condition' | 'delay';
  name: string;
  config: Record<string, unknown>;
  next_step_id: string | null;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  logs: WorkflowLog[];
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface WorkflowLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  step_id?: string;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// RESOURCE TYPES
// ============================================================================

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: 'video' | 'article' | 'book' | 'podcast' | 'course';
  url: string | null;
  thumbnail_url: string | null;
  author: string | null;
  duration_minutes: number | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | null;
  tags: string[];
  dimension_id: string | null;
  quality_score: number;
  created_at: string;
  updated_at: string;
}

export interface ResourceRecommendation {
  resource: Resource;
  relevance_score: number;
  reason: string;
}

// ============================================================================
// IDP (INDIVIDUAL DEVELOPMENT PLAN) TYPES
// ============================================================================

export interface IDP {
  id: string;
  user_id: string;
  title: string;
  vision: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  layers: IDPLayer[];
  created_at: string;
  updated_at: string;
}

export interface IDPLayer {
  id: string;
  idp_id: string;
  level: number;
  title: string;
  description: string | null;
  objectives: IDPObjective[];
  target_completion_date: string | null;
  completed_at: string | null;
}

export interface IDPObjective {
  id: string;
  layer_id: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  resources: ResourceRecommendation[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DashboardStats {
  user_id: string;
  total_assessments: number;
  completed_assessments: number;
  overall_progress: number;
  xp_total: number;
  current_level: number;
  streak_days: number;
  last_activity_at: string | null;
}

export interface ActivityAnalytics {
  date: string;
  count: number;
  xp_earned: number;
  by_type: Record<string, number>;
}

export interface DimensionAnalytics {
  dimension_id: string;
  dimension_name: string;
  average_score: number;
  improvement_rate: number;
  assessments_count: number;
  trend: 'improving' | 'stable' | 'declining';
}

// ============================================================================
// GOOGLE SHEETS TYPES
// ============================================================================

export interface SheetData {
  spreadsheetId: string;
  sheetName: string;
  range: string;
  values: (string | number | boolean)[][];
  headers: string[];
  rowCount: number;
}

export interface ParsedSheetRow {
  [key: string]: string | number | boolean | Date | null;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type StrictProps<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
}

export interface LoadingProps {
  isLoading: boolean;
  error?: Error | null;
}

export interface FormFieldProps<T = string> {
  name: string;
  label: string;
  value: T;
  onChange: (value: T) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

// Export all types
export default {
  User,
  Profile,
  Assessment,
  AssessmentResult,
  Dimension,
  Activity,
  Goal,
  Achievement,
  Badge,
  Course,
  Module,
  UserProgress,
  AdminAuditLog,
};
