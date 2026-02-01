/**
 * PPSDM KMM 9 Dimensions System - Database Module
 * 
 * Central export point for all database-related types, schemas, and utilities.
 */

// Export all schema types and utilities
export * from './schema'

// Database table names (for type-safe queries)
export const TABLES = {
    USER_PROFILES: 'user_profiles',
    DIMENSION_SCORES: 'dimension_scores',
    ASSESSMENTS: 'assessments',
    GOALS: 'goals',
    ACTIVITIES: 'activities',
    ACHIEVEMENTS: 'achievements',
    USER_ACHIEVEMENTS: 'user_achievements',
} as const

// Dimension metadata for UI
export const DIMENSION_METADATA = {
    cognitive: {
        name: 'Kognitif',
        description: 'Kemampuan berpikir analitis, memecahkan masalah, dan belajar',
        color: '#3B82F6',
        icon: 'Brain',
    },
    emotional: {
        name: 'Emosional',
        description: 'Kecerdasan emosional dan pengelolaan perasaan',
        color: '#EC4899',
        icon: 'Heart',
    },
    spiritual: {
        name: 'Spiritual',
        description: 'Pengembangan nilai-nilai spiritual dan makna hidup',
        color: '#8B5CF6',
        icon: 'Sparkles',
    },
    physical: {
        name: 'Fisik',
        description: 'Kesehatan fisik dan kebugaran tubuh',
        color: '#EF4444',
        icon: 'Activity',
    },
    creative: {
        name: 'Kreatif',
        description: 'Kemampuan berpikir kreatif dan inovasi',
        color: '#F59E0B',
        icon: 'Palette',
    },
    professional: {
        name: 'Profesional',
        description: 'Kesiapan karir dan pengembangan profesional',
        color: '#10B981',
        icon: 'Briefcase',
    },
    leadership: {
        name: 'Kepemimpinan',
        description: 'Kemampuan memimpin dan mempengaruhi orang lain',
        color: '#6366F1',
        icon: 'Users',
    },
    financial: {
        name: 'Finansial',
        description: 'Kecerdasan finansial dan pengelolaan keuangan',
        color: '#14B8A6',
        icon: 'Wallet',
    },
    environmental: {
        name: 'Lingkungan',
        description: 'Kesadaran dan kepedulian terhadap lingkungan',
        color: '#22C55E',
        icon: 'Leaf',
    },
} as const

// Activity type metadata
export const ACTIVITY_METADATA: Record<string, { label: string; icon: string; color: string }> = {
    assessment_completed: { label: 'Assessment Selesai', icon: 'CheckCircle', color: '#10B981' },
    goal_created: { label: 'Target Baru', icon: 'Target', color: '#3B82F6' },
    goal_updated: { label: 'Target Diperbarui', icon: 'Edit', color: '#F59E0B' },
    goal_completed: { label: 'Target Tercapai', icon: 'Trophy', color: '#F59E0B' },
    milestone_reached: { label: 'Milestone Tercapai', icon: 'Flag', color: '#8B5CF6' },
    achievement_unlocked: { label: 'Achievement Baru', icon: 'Award', color: '#EC4899' },
    level_up: { label: 'Level Naik', icon: 'TrendingUp', color: '#6366F1' },
    streak_updated: { label: 'Streak Updated', icon: 'Flame', color: '#EF4444' },
    resource_accessed: { label: 'Resource Diakses', icon: 'BookOpen', color: '#14B8A6' },
    course_completed: { label: 'Kursus Selesai', icon: 'GraduationCap', color: '#10B981' },
    login: { label: 'Login', icon: 'LogIn', color: '#6B7280' },
}

// Achievement rarity metadata
export const RARITY_METADATA: Record<string, { label: string; color: string; multiplier: number }> = {
    common: { label: 'Common', color: '#9CA3AF', multiplier: 1 },
    rare: { label: 'Rare', color: '#3B82F6', multiplier: 1.5 },
    epic: { label: 'Epic', color: '#8B5CF6', multiplier: 2 },
    legendary: { label: 'Legendary', color: '#F59E0B', multiplier: 3 },
}

// Goal status metadata
export const GOAL_STATUS_METADATA: Record<string, { label: string; color: string; variant: string }> = {
    active: { label: 'Aktif', color: '#10B981', variant: 'default' },
    completed: { label: 'Selesai', color: '#3B82F6', variant: 'success' },
    archived: { label: 'Diarsipkan', color: '#9CA3AF', variant: 'secondary' },
    cancelled: { label: 'Dibatalkan', color: '#EF4444', variant: 'destructive' },
}

// Goal category metadata
export const GOAL_CATEGORY_METADATA: Record<string, { label: string; icon: string }> = {
    cognitive: { label: 'Kognitif', icon: 'Brain' },
    emotional: { label: 'Emosional', icon: 'Heart' },
    spiritual: { label: 'Spiritual', icon: 'Sparkles' },
    physical: { label: 'Fisik', icon: 'Activity' },
    creative: { label: 'Kreatif', icon: 'Palette' },
    professional: { label: 'Profesional', icon: 'Briefcase' },
    leadership: { label: 'Kepemimpinan', icon: 'Users' },
    financial: { label: 'Finansial', icon: 'Wallet' },
    environmental: { label: 'Lingkungan', icon: 'Leaf' },
    holistic: { label: 'Holistik', icon: 'Globe' },
}

// Helper function to get dimension score status
export function getScoreStatus(score: number): { label: string; color: string; variant: string } {
    if (score >= 80) return { label: 'Excellent', color: '#10B981', variant: 'success' }
    if (score >= 60) return { label: 'Good', color: '#3B82F6', variant: 'info' }
    if (score >= 40) return { label: 'Developing', color: '#F59E0B', variant: 'warning' }
    return { label: 'Needs Improvement', color: '#EF4444', variant: 'destructive' }
}

// Helper function to format XP
export function formatXP(xp: number): string {
    if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`
    return xp.toString()
}

// Helper function to calculate level progress
export function calculateLevelProgress(totalXp: number): {
    currentLevel: number
    currentLevelXp: number
    nextLevelXp: number
    progress: number
    xpToNextLevel: number
} {
    const currentLevel = Math.floor(Math.sqrt(totalXp / 100)) + 1
    const prevLevelXp = Math.pow(currentLevel - 1, 2) * 100
    const nextLevelXp = Math.pow(currentLevel, 2) * 100
    const currentLevelXp = totalXp - prevLevelXp
    const xpNeeded = nextLevelXp - prevLevelXp
    const progress = (currentLevelXp / xpNeeded) * 100

    return {
        currentLevel,
        currentLevelXp,
        nextLevelXp,
        progress: Math.round(progress),
        xpToNextLevel: nextLevelXp - totalXp,
    }
}

// Export default
export default {
    TABLES,
    DIMENSION_METADATA,
    ACTIVITY_METADATA,
    RARITY_METADATA,
    GOAL_STATUS_METADATA,
    GOAL_CATEGORY_METADATA,
    getScoreStatus,
    formatXP,
    calculateLevelProgress,
}
