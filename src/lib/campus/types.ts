/**
 * Campus Hub — Type Definitions
 */

// ─── Campus Events ───────────────────────────────────────────────
export interface CampusEvent {
    id: string;
    title: string;
    description: string | null;
    date_start: string;
    date_end: string | null;
    time_start: string | null;
    time_end: string | null;
    location: string | null;
    organizer: string | null;
    category: EventCategory;
    status: EventStatus;
    budget: number;
    expenditure: number;
    max_participants: number | null;
    registration_url: string | null;
    image_url: string | null;
    contact_person: string | null;
    source: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type EventCategory =
    | 'seminar'
    | 'workshop'
    | 'lomba'
    | 'rapat'
    | 'sosial'
    | 'olahraga'
    | 'akademik'
    | 'umum';

export type EventStatus = 'rencana' | 'berlangsung' | 'selesai' | 'dibatalkan';

export const EVENT_CATEGORIES: { value: EventCategory; label: string; color: string; icon: string }[] = [
    { value: 'seminar', label: 'Seminar', color: '#6366f1', icon: '🎤' },
    { value: 'workshop', label: 'Workshop', color: '#10b981', icon: '🔧' },
    { value: 'lomba', label: 'Lomba', color: '#f59e0b', icon: '🏆' },
    { value: 'rapat', label: 'Rapat', color: '#8b5cf6', icon: '📋' },
    { value: 'sosial', label: 'Sosial', color: '#ec4899', icon: '🤝' },
    { value: 'olahraga', label: 'Olahraga', color: '#14b8a6', icon: '⚽' },
    { value: 'akademik', label: 'Akademik', color: '#3b82f6', icon: '📚' },
    { value: 'umum', label: 'Umum', color: '#6b7280', icon: '📌' },
];

export const EVENT_STATUS_MAP: Record<EventStatus, { label: string; color: string }> = {
    rencana: { label: 'Rencana', color: '#f59e0b' },
    berlangsung: { label: 'Berlangsung', color: '#10b981' },
    selesai: { label: 'Selesai', color: '#6b7280' },
    dibatalkan: { label: 'Dibatalkan', color: '#ef4444' },
};

// ─── Alumni Profiles ─────────────────────────────────────────────
export interface AlumniProfile {
    id: string;
    name: string;
    angkatan: string | null;
    department: string | null;
    degree: string;
    job_title: string | null;
    company: string | null;
    industry: string | null;
    city: string | null;
    country: string;
    linkedin_url: string | null;
    email: string | null;
    phone: string | null;
    bio: string | null;
    skills: string[];
    is_mentor: boolean;
    mentor_topics: string[];
    photo_url: string | null;
    source: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ─── Environment Data ────────────────────────────────────────────
export interface WeatherData {
    temperature: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    wind_speed: number;
    pressure: number;
    visibility: number;
    sunrise: string;
    sunset: string;
}

export interface AirQualityData {
    aqi: number;
    level: 'Baik' | 'Sedang' | 'Tidak Sehat untuk Sensitif' | 'Tidak Sehat' | 'Sangat Tidak Sehat' | 'Berbahaya';
    color: string;
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
}

export interface EnvironmentCache {
    id: string;
    data_type: string;
    data_json: WeatherData | AirQualityData;
    location: string;
    fetched_at: string;
    expires_at: string;
}

// ─── Stress Check Quiz ──────────────────────────────────────────
export interface StressQuestion {
    id: number;
    text: string;
    options: { value: number; label: string }[];
}

export type StressLevel = 'rendah' | 'sedang' | 'tinggi' | 'sangat_tinggi';

export interface StressResult {
    score: number;
    maxScore: number;
    level: StressLevel;
    label: string;
    color: string;
    description: string;
    suggestions: string[];
}
