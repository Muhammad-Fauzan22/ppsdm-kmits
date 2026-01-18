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
    status: "upcoming" | "in-progress" | "completed";
    due_date?: string;
    completed_at?: string;
    created_at: string;
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
