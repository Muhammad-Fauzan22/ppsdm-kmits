// Gamification Engine - XP, Levels, Badges, Streaks
// Zero-cost implementation with localStorage and Supabase

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'starter' | 'progress' | 'dimension' | 'streak' | 'special';
    requirement: { type: string; value: number; dimension?: string };
    xp_reward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProgress {
    userId: string;
    totalXP: number;
    level: number;
    streakDays: number;
    lastActivityDate: string;
    badges: string[];
    completedActivities: number;
    assessmentsCompleted: number;
    resourcesCompleted: number;
    goalsAchieved: number;
}

// XP System Configuration
export const XP_CONFIG = {
    completeAssessment: 100,
    completeResource: 25,
    achieveGoal: 50,
    dailyLogin: 10,
    weekStreak: 75,
    monthStreak: 250,
    referFriend: 100,
    firstActivity: 50,
    profileComplete: 50,
};

// Level thresholds (XP required for each level)
export const LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000,
    5200, 6500, 8000, 9700, 11600, 13700, 16000, 18500, 21200, 24100,
    27200, 30500, 34000, 37700, 41600, 45700, 50000, 55000, 60000, 70000
];

// Badge definitions
export const BADGES: Badge[] = [
    // Starter badges
    { id: 'first-step', name: 'Langkah Pertama', description: 'Selesaikan aktivitas pertama', icon: '🚀', category: 'starter', requirement: { type: 'activities', value: 1 }, xp_reward: 25, rarity: 'common' },
    { id: 'profile-complete', name: 'Profil Lengkap', description: 'Lengkapi profil 100%', icon: '✨', category: 'starter', requirement: { type: 'profile', value: 100 }, xp_reward: 50, rarity: 'common' },
    { id: 'first-assessment', name: 'Penemu Diri', description: 'Selesaikan assessment pertama', icon: '🔍', category: 'starter', requirement: { type: 'assessments', value: 1 }, xp_reward: 50, rarity: 'common' },
    { id: 'ai-explorer', name: 'AI Explorer', description: 'Gunakan AI Tutor pertama kali', icon: '🤖', category: 'starter', requirement: { type: 'ai_chats', value: 1 }, xp_reward: 30, rarity: 'common' },

    // Progress badges
    { id: 'learner-5', name: 'Pembelajar Aktif', description: 'Selesaikan 5 resource', icon: '📚', category: 'progress', requirement: { type: 'resources', value: 5 }, xp_reward: 50, rarity: 'common' },
    { id: 'learner-25', name: 'Kutu Buku', description: 'Selesaikan 25 resource', icon: '🎓', category: 'progress', requirement: { type: 'resources', value: 25 }, xp_reward: 150, rarity: 'rare' },
    { id: 'learner-100', name: 'Scholar', description: 'Selesaikan 100 resource', icon: '🏆', category: 'progress', requirement: { type: 'resources', value: 100 }, xp_reward: 500, rarity: 'epic' },
    { id: 'goal-setter', name: 'Goal Setter', description: 'Capai 5 goals', icon: '🎯', category: 'progress', requirement: { type: 'goals', value: 5 }, xp_reward: 100, rarity: 'rare' },
    { id: 'achiever', name: 'Achiever', description: 'Capai 25 goals', icon: '🏅', category: 'progress', requirement: { type: 'goals', value: 25 }, xp_reward: 300, rarity: 'epic' },
    { id: 'assessment-3', name: 'Self-Aware', description: 'Selesaikan 3 dimensi assessment', icon: '🔮', category: 'progress', requirement: { type: 'assessments', value: 3 }, xp_reward: 150, rarity: 'rare' },
    { id: 'assessment-6', name: 'Deep Diver', description: 'Selesaikan 6 dimensi assessment', icon: '🌊', category: 'progress', requirement: { type: 'assessments', value: 6 }, xp_reward: 300, rarity: 'epic' },
    { id: 'assessment-9', name: 'Holistic Explorer', description: 'Selesaikan semua 9 dimensi', icon: '🌟', category: 'progress', requirement: { type: 'assessments', value: 9 }, xp_reward: 500, rarity: 'legendary' },

    // Dimension mastery badges (all 9 dimensions)
    { id: 'cognitive-master', name: 'Pemikir Hebat', description: 'Skor kognitif 90+', icon: '🧠', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'cognitive' }, xp_reward: 200, rarity: 'epic' },
    { id: 'selfmgmt-master', name: 'Self-Manager', description: 'Skor self-management 90+', icon: '⏰', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'self_management' }, xp_reward: 200, rarity: 'epic' },
    { id: 'financial-master', name: 'Ahli Finansial', description: 'Skor finansial 90+', icon: '💰', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'financial' }, xp_reward: 200, rarity: 'epic' },
    { id: 'physical-master', name: 'Fit & Sehat', description: 'Skor fisik 90+', icon: '💪', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'physical_health' }, xp_reward: 200, rarity: 'epic' },
    { id: 'emotional-master', name: 'Emosi Stabil', description: 'Skor emosional 90+', icon: '💚', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'emotional_intelligence' }, xp_reward: 200, rarity: 'epic' },
    { id: 'mental-master', name: 'Mental Warrior', description: 'Skor mental health 90+', icon: '🧘', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'mental_health' }, xp_reward: 200, rarity: 'epic' },
    { id: 'character-master', name: 'Berkarakter', description: 'Skor karakter 90+', icon: '⚔️', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'character_ethics' }, xp_reward: 200, rarity: 'epic' },
    { id: 'spiritual-master', name: 'Spiritual Guide', description: 'Skor spiritual 90+', icon: '🕊️', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'spiritual' }, xp_reward: 200, rarity: 'epic' },
    { id: 'environmental-master', name: 'Eco Warrior', description: 'Skor environmental 90+', icon: '🌍', category: 'dimension', requirement: { type: 'score', value: 90, dimension: 'environmental' }, xp_reward: 200, rarity: 'epic' },
    { id: 'balanced', name: 'Seimbang', description: 'Semua 9 dimensi 70+', icon: '⚖️', category: 'dimension', requirement: { type: 'all_dimensions', value: 70 }, xp_reward: 750, rarity: 'legendary' },
    { id: 'perfect-balance', name: 'Perfect Balance', description: 'Semua 9 dimensi 85+', icon: '🎭', category: 'dimension', requirement: { type: 'all_dimensions', value: 85 }, xp_reward: 1500, rarity: 'legendary' },

    // Streak badges
    { id: 'streak-7', name: 'Konsisten', description: '7 hari berturut-turut', icon: '🔥', category: 'streak', requirement: { type: 'streak', value: 7 }, xp_reward: 75, rarity: 'rare' },
    { id: 'streak-30', name: 'Disiplin', description: '30 hari berturut-turut', icon: '⭐', category: 'streak', requirement: { type: 'streak', value: 30 }, xp_reward: 250, rarity: 'epic' },
    { id: 'streak-100', name: 'Legendaris', description: '100 hari berturut-turut', icon: '👑', category: 'streak', requirement: { type: 'streak', value: 100 }, xp_reward: 1000, rarity: 'legendary' },

    // Special badges
    { id: 'night-owl', name: 'Night Owl', description: 'Belajar setelah jam 10 malam', icon: '🦉', category: 'special', requirement: { type: 'time', value: 22 }, xp_reward: 50, rarity: 'rare' },
    { id: 'early-bird', name: 'Early Bird', description: 'Belajar sebelum jam 6 pagi', icon: '🐦', category: 'special', requirement: { type: 'time', value: 6 }, xp_reward: 50, rarity: 'rare' },
    { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Aktif di akhir pekan', icon: '⚡', category: 'special', requirement: { type: 'weekend', value: 4 }, xp_reward: 100, rarity: 'rare' },
];

// Calculate level from XP
export function calculateLevel(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
    }
    return 1;
}

// Calculate XP needed for next level
export function xpToNextLevel(xp: number): { current: number; needed: number; progress: number } {
    const level = calculateLevel(xp);
    const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

    return {
        current: xp - currentThreshold,
        needed: nextThreshold - currentThreshold,
        progress: Math.round(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    };
}

// Check streak continuity
export function updateStreak(lastDate: string, currentDate: string, currentStreak: number): number {
    const last = new Date(lastDate);
    const current = new Date(currentDate);
    const diffDays = Math.floor((current.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return currentStreak; // Same day
    if (diffDays === 1) return currentStreak + 1; // Consecutive
    return 1; // Streak broken, restart
}

// Check badge eligibility
export function checkBadgeEligibility(
    badge: Badge,
    progress: UserProgress,
    dimensionScores: Record<string, number>
): boolean {
    const { type, value, dimension } = badge.requirement;

    switch (type) {
        case 'activities': return progress.completedActivities >= value;
        case 'resources': return progress.resourcesCompleted >= value;
        case 'goals': return progress.goalsAchieved >= value;
        case 'assessments': return progress.assessmentsCompleted >= value;
        case 'streak': return progress.streakDays >= value;
        case 'score': return dimension ? (dimensionScores[dimension] || 0) >= value : false;
        case 'all_dimensions': return Object.values(dimensionScores).every(s => s >= value);
        case 'profile': return true; // Check separately
        default: return false;
    }
}

// Award XP and check for new badges
export function awardXP(
    progress: UserProgress,
    xpAmount: number,
    dimensionScores: Record<string, number>
): { newXP: number; newLevel: number; levelUp: boolean; newBadges: Badge[] } {
    const newXP = progress.totalXP + xpAmount;
    const oldLevel = progress.level;
    const newLevel = calculateLevel(newXP);
    const levelUp = newLevel > oldLevel;

    // Check for new badges
    const newBadges: Badge[] = [];
    BADGES.forEach(badge => {
        if (!progress.badges.includes(badge.id)) {
            if (checkBadgeEligibility(badge, { ...progress, totalXP: newXP }, dimensionScores)) {
                newBadges.push(badge);
            }
        }
    });

    return { newXP, newLevel, levelUp, newBadges };
}

// Leaderboard entry
export interface LeaderboardEntry {
    userId: string;
    name: string;
    avatar?: string;
    level: number;
    xp: number;
    badgeCount: number;
    rank: number;
}

// Generate mock leaderboard (replace with Supabase query)
export function getMockLeaderboard(): LeaderboardEntry[] {
    return [
        { userId: '1', name: 'Ahmad Fauzan', level: 15, xp: 5200, badgeCount: 12, rank: 1 },
        { userId: '2', name: 'Siti Nurhaliza', level: 14, xp: 4800, badgeCount: 10, rank: 2 },
        { userId: '3', name: 'Budi Santoso', level: 12, xp: 3900, badgeCount: 8, rank: 3 },
        { userId: '4', name: 'Dewi Lestari', level: 11, xp: 3500, badgeCount: 7, rank: 4 },
        { userId: '5', name: 'Rizky Pratama', level: 10, xp: 3200, badgeCount: 6, rank: 5 },
    ];
}
