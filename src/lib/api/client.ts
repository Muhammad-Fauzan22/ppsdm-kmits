/**
 * API Client Helper
 * 
 * Provides type-safe API calls with error handling
 * for the PPSDM KMM dashboard integration.
 */

import type { 
  DashboardSummary, 
  DimensionScore, 
  Goal, 
  GoalInput, 
  GoalUpdate,
  TimeRange,
  Activity,
  UserAchievement
} from '@/lib/db/schema';

// API Response types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: unknown;
  status?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base fetch function with error handling
 */
async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new ApiError(
      data.error || 'An unexpected error occurred',
      response.status,
      'details' in data ? data.details : undefined
    );
  }

  return data.data;
}

// ============================================================================
// DASHBOARD API
// ============================================================================

export interface DashboardData {
  user: {
    id: string;
    email?: string;
    full_name?: string;
    nim?: string;
    faculty?: string;
    study_program?: string;
    level: number;
    total_xp?: number;
    current_streak: number;
    avatar_url?: string;
  };
  stats: {
    level: number;
    totalXp: number;
    xpToNextLevel: number;
    xpProgress: number;
    currentStreak: number;
    totalAssessments: number;
    completedGoals: number;
    activeGoalsCount: number;
    unreadAchievements: number;
    overallIndex: number;
  };
  dimensionScores: DimensionScore;
  recentActivities: Activity[];
  activeGoals: Goal[];
  recentAchievements: (UserAchievement & { achievement?: { name: string; description: string; icon_url?: string } })[];
}

/**
 * Fetch dashboard data
 */
export async function getDashboardData(): Promise<DashboardData> {
  return fetchApi<DashboardData>('/api/dashboard');
}

// ============================================================================
// DIMENSIONS API
// ============================================================================

export interface DimensionData {
  cognitive: number;
  emotional: number;
  spiritual: number;
  physical: number;
  creative: number;
  professional: number;
  leadership: number;
  financial: number;
  environmental: number;
  overall_index?: number;
}

/**
 * Fetch dimension scores
 */
export async function getDimensionScores(): Promise<DimensionData> {
  return fetchApi<DimensionData>('/api/dimensions');
}

/**
 * Submit new assessment scores
 */
export async function submitDimensionScores(
  scores: Partial<DimensionData>
): Promise<DimensionData> {
  return fetchApi<DimensionData>('/api/dimensions', {
    method: 'POST',
    body: JSON.stringify(scores),
  });
}

// ============================================================================
// GOALS API
// ============================================================================

export interface GoalsListResponse {
  goals: Goal[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface FetchGoalsOptions {
  status?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetch goals with optional filtering
 */
export async function getGoals(options: FetchGoalsOptions = {}): Promise<GoalsListResponse> {
  const params = new URLSearchParams();
  if (options.status) params.append('status', options.status);
  if (options.category) params.append('category', options.category);
  if (options.limit) params.append('limit', options.limit.toString());
  if (options.offset) params.append('offset', options.offset.toString());

  const queryString = params.toString();
  const url = `/api/goals${queryString ? `?${queryString}` : ''}`;

  const response = await fetchApi<Goal[]>(url);
  
  return {
    goals: response,
    meta: {
      total: response.length,
      limit: options.limit || 50,
      offset: options.offset || 0,
    },
  };
}

/**
 * Create a new goal
 */
export async function createGoal(goalData: GoalInput): Promise<Goal> {
  return fetchApi<Goal>('/api/goals', {
    method: 'POST',
    body: JSON.stringify(goalData),
  });
}

/**
 * Update a goal
 */
export async function updateGoal(
  goalId: string,
  updates: GoalUpdate
): Promise<Goal> {
  return fetchApi<Goal>('/api/goals', {
    method: 'PATCH',
    body: JSON.stringify({ id: goalId, ...updates }),
  });
}

/**
 * Update goal progress
 */
export async function updateGoalProgress(
  goalId: string,
  progress: number
): Promise<Goal> {
  return updateGoal(goalId, { progress });
}

/**
 * Toggle milestone completion
 */
export async function toggleMilestone(
  goalId: string,
  milestoneId: string,
  completed: boolean
): Promise<Goal> {
  return fetchApi<Goal>(`/api/goals/${goalId}/milestones`, {
    method: 'PATCH',
    body: JSON.stringify({ milestoneId, completed }),
  });
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string): Promise<void> {
  await fetch(`/api/goals?id=${goalId}`, {
    method: 'DELETE',
  });
}

// ============================================================================
// PROGRESS API
// ============================================================================

export interface ProgressDataPoint {
  label: string;
  cognitive: number;
  emotional: number;
  spiritual: number;
  physical: number;
  creative: number;
  professional: number;
  leadership: number;
  financial: number;
  environmental: number;
}

export interface ProgressData {
  labels: string[];
  datasets: {
    cognitive: number[];
    emotional: number[];
    spiritual: number[];
    physical: number[];
    creative: number[];
    professional: number[];
    leadership: number[];
    financial: number[];
    environmental: number[];
  };
  summary: {
    latestScores: Record<string, number>;
    improvements: Record<string, number>;
  };
}

/**
 * Fetch progress history
 */
export async function getProgress(timeRange: TimeRange = '6m'): Promise<ProgressData> {
  return fetchApi<ProgressData>(`/api/progress?timeRange=${timeRange}`);
}

// ============================================================================
// ACTIVITIES API
// ============================================================================

/**
 * Fetch recent activities
 */
export async function getActivities(limit: number = 10): Promise<Activity[]> {
  const params = new URLSearchParams();
  params.append('limit', limit.toString());
  
  return fetchApi<Activity[]>(`/api/activities?${params.toString()}`);
}

// ============================================================================
// USER PROFILE API
// ============================================================================

export interface UserProfile {
  id: string;
  full_name?: string;
  nim?: string;
  faculty?: string;
  study_program?: string;
  level: number;
  total_xp?: number;
  current_streak?: number;
  avatar_url?: string;
}

/**
 * Fetch user profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  return fetchApi<UserProfile>('/api/profile');
}

/**
 * Update user profile
 */
export async function updateProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  return fetchApi<UserProfile>('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

/**
 * Fetch user notifications
 */
export async function getNotifications(): Promise<Notification[]> {
  return fetchApi<Notification[]>('/api/notifications');
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  await fetchApi(`/api/notifications/${notificationId}/read`, {
    method: 'POST',
  });
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(): Promise<void> {
  await fetchApi('/api/notifications/read-all', {
    method: 'POST',
  });
}

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.status === 401;
  }
  return false;
}
