// Database Schema Types for PPSDM KMM
// These types represent the PostgreSQL tables that will be created in Supabase

export interface User {
    id: string;
    email: string;
    full_name: string;
    nrp: string; // Student ID (Nomor Registrasi Pokok)
    avatar_url?: string;
    department: string;
    semester: number;
    role: "student" | "lecturer" | "admin";
    created_at: string;
    updated_at: string;
}

export interface DimensionScore {
    id: string;
    user_id: string;
    dimension: DimensionType;
    score: number; // 0-100
    updated_at: string;
}

export type DimensionType =
    | "cognitive" // Kognitif
    | "affective" // Afektif
    | "psychomotor" // Psikomotorik
    | "spiritual" // Spiritual
    | "social" // Sosial
    | "financial" // Finansial
    | "health" // Kesehatan
    | "character" // Karakter
    | "environmental"; // Lingkungan

export interface Activity {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    dimension: DimensionType;
    points: number;
    budget_allocated?: number;
    budget_used?: number;
    location?: string;
    organizer?: string;
    participants?: string[]; // JSON array
    status: "upcoming" | "in-progress" | "completed" | "cancelled";
    due_date?: string;
    completed_at?: string;
    created_at: string;
}

export type FinanceCategory = 'Income' | 'Operational' | 'Event' | 'Asset' | 'Other';
export type PaymentMethod = 'Transfer' | 'Cash' | 'Credit Card' | 'Other';

export interface FinanceTransaction {
    id: string; // TRX-YYYY-XXX
    user_id?: string; // Optional linker to user who inputted it
    date: string;
    description: string;
    category: FinanceCategory;
    amount: number;
    payment_method: PaymentMethod;
    verified: boolean;
    created_at: string;
    attachments?: string[]; // URLs to receipts
}

export interface Program {
    id: string;
    title: string;
    description: string;
    category: string;
    status: "draft" | "active" | "completed" | "archived";
    start_date: string;
    end_date?: string;
    max_participants?: number;
    current_participants: number;
    created_by: string;
    created_at: string;
}

export interface Enrollment {
    id: string;
    user_id: string;
    program_id: string;
    status: "enrolled" | "completed" | "dropped";
    progress: number; // 0-100
    enrolled_at: string;
    completed_at?: string;
}

export interface MentorshipRelation {
    id: string;
    mentor_id: string; // Lecturer
    mentee_id: string; // Student
    status: "active" | "inactive";
    created_at: string;
}

export interface Feedback {
    id: string;
    from_user_id: string;
    to_user_id: string;
    activity_id?: string;
    content: string;
    rating?: number; // 1-5
    created_at: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    requirement_type: "activity_count" | "score_threshold" | "streak" | "special";
    requirement_value: number;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
}

export interface Notification {
    id: string;
    user_id: string;
    type: "achievement" | "reminder" | "feedback" | "system" | "program";
    title: string;
    message: string;
    read: boolean;
    created_at: string;
}

export interface ReflectionEntry {
    id: string;
    user_id: string;
    title: string;
    content: string;
    mood: "very_happy" | "happy" | "neutral" | "sad" | "very_sad";
    dimension?: DimensionType;
    created_at: string;
}

// RPI (Rencana Pengembangan Individu) Types
export interface RPIGoal {
    id: string;
    user_id: string;
    semester: number;
    dimension: DimensionType;
    title: string;
    description?: string;
    target_date?: string;
    status: "planned" | "in-progress" | "achieved" | "cancelled";
    created_at: string;
}

// Portfolio Types
export interface PortfolioSection {
    id: string;
    user_id: string;
    section_type: "about" | "experience" | "education" | "skills" | "achievements" | "projects";
    title: string;
    content: Record<string, unknown>; // JSON content
    order: number;
    visible: boolean;
}

// --------------------------------------------------------
// HOLISTIC PLATFORM ARCHITECTURE TYPES (New)
// --------------------------------------------------------

export interface Assessment {
    id: string;
    user_id: string;
    domain: string; // 'cognitive', 'emotional', 'social', etc.
    version: string;
    completed_at: string;
    scores: Record<string, any>; // JSONB: Detailed sub-scores
    profile_analysis: Record<string, any>; // JSONB: Analysis text/data
    recommendations: Record<string, any>; // JSONB: Usage suggestions
    validity_checks: Record<string, any>; // JSONB: Reliability metrics
    created_at: string;
}

export interface IDP {
    id: string;
    user_id: string;
    vision_statement: string;
    status: 'active' | 'completed' | 'archived';
    timeframe: string; // '1_year', '3_year'
    goals: IDPGoal[]; // JSONB
    resources: IDPResource[]; // JSONB
    timeline: any[]; // JSONB
    progress: Record<string, any>; // JSONB
    last_reviewed?: string;
    next_review?: string;
    created_at: string;
    updated_at: string;
}

export interface IDPGoal {
    id: string;
    title: string;
    description: string;
    metric: string;
    target: number;
    current: number;
    deadline: string;
    status: 'pending' | 'in_progress' | 'completed';
}

export interface IDPResource {
    resource_id: string;
    title: string;
    type: string;
    url?: string;
}

export interface Resource {
    id: string;
    title: string;
    description?: string;
    type: string; // 'course', 'book', 'mentor', etc.
    source?: string;
    url?: string;
    metadata: Record<string, any>; // duration, cost, etc.
    quality_score?: number;
    tags?: string[];
    skill_mappings: Record<string, any>;
    created_at: string;
}

export interface ProgressLog {
    id: string;
    user_id: string;
    idp_id?: string;
    goal_id?: string;
    activity_type: string;
    activity_data: Record<string, any>;
    progress_metric?: number;
    notes?: string;
    created_at: string;
}


// LMS Types
export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    cover_image?: string;
    thumbnail_image?: string;
    category: string;
    subcategory?: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'all_levels';
    duration?: number; // minutes
    xp_reward?: number;
    certificate_enabled?: boolean;
    passing_score?: number;
    status: 'draft' | 'published' | 'archived';
    featured?: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    metadata?: Record<string, any>;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    order_index: number;
    xp_reward?: number;
    duration?: number;
    is_published?: boolean;
    created_at: string;
    updated_at: string;
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    description?: string;
    content?: string;
    content_type: 'text' | 'video' | 'audio' | 'pdf' | 'interactive' | 'quiz' | 'assignment';
    video_url?: string;
    video_duration?: number;
    pdf_url?: string;
    external_resource_url?: string;
    order_index: number;
    is_published?: boolean;
    xp_reward?: number;
    estimated_time?: number;
    created_at: string;
    updated_at: string;
}
