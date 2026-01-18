// Free Avatar & Profile Generator
// Uses free avatar APIs - no authentication needed

export interface AvatarOptions {
    seed: string;        // Unique identifier (user ID, name, etc.)
    size?: number;       // Size in pixels
    style?: AvatarStyle;
}

export type AvatarStyle =
    | 'adventurer'
    | 'avataaars'
    | 'bottts'
    | 'fun-emoji'
    | 'icons'
    | 'identicon'
    | 'initials'
    | 'lorelei'
    | 'micah'
    | 'miniavs'
    | 'notionists'
    | 'open-peeps'
    | 'personas'
    | 'pixel-art'
    | 'shapes';

// ============================================
// DICEBEAR API (FREE - No Rate Limit)
// ============================================

export function getDiceBearAvatar(options: AvatarOptions): string {
    const { seed, size = 128, style = 'avataaars' } = options;
    const encodedSeed = encodeURIComponent(seed);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}&size=${size}`;
}

// Get random avatar
export function getRandomAvatar(style: AvatarStyle = 'avataaars'): string {
    const randomSeed = Math.random().toString(36).substring(7);
    return getDiceBearAvatar({ seed: randomSeed, style });
}

// ============================================
// UI AVATARS (TEXT-BASED) - FREE
// ============================================

export function getTextAvatar(
    name: string,
    options?: {
        size?: number;
        background?: string;
        color?: string;
        rounded?: boolean;
        bold?: boolean;
    }
): string {
    const {
        size = 128,
        background = '6366f1',
        color = 'ffffff',
        rounded = true,
        bold = true,
    } = options || {};

    const params = new URLSearchParams({
        name,
        size: size.toString(),
        background,
        color,
        rounded: rounded.toString(),
        bold: bold.toString(),
    });

    return `https://ui-avatars.com/api/?${params.toString()}`;
}

// ============================================
// ROBOHASH (FREE - Robots/Monsters/Heads)
// ============================================

export type RoboHashSet = 'set1' | 'set2' | 'set3' | 'set4' | 'set5';

export function getRoboHashAvatar(
    seed: string,
    set: RoboHashSet = 'set1',
    size: number = 128
): string {
    // set1: Robots, set2: Monsters, set3: Robot Heads, set4: Cats, set5: Humans
    return `https://robohash.org/${encodeURIComponent(seed)}?set=${set}&size=${size}x${size}`;
}

// ============================================
// BORING AVATARS (FREE - SVG Avatars)
// ============================================

export type BoringVariant = 'marble' | 'beam' | 'pixel' | 'sunset' | 'ring' | 'bauhaus';

export function getBoringAvatar(
    name: string,
    variant: BoringVariant = 'beam',
    size: number = 128,
    colors?: string[]
): string {
    const defaultColors = ['6366f1', '8b5cf6', 'a855f7', 'd946ef', 'ec4899'];
    const colorParam = (colors || defaultColors).join(',');

    return `https://source.boringavatars.com/${variant}/${size}/${encodeURIComponent(name)}?colors=${colorParam}`;
}

// ============================================
// BADGE GENERATORS (FREE)
// ============================================

export function generateBadgeSVG(
    label: string,
    value: string,
    color: string = '6366f1'
): string {
    return `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(value)}-${color}`;
}

export function generateLevelBadge(level: number): string {
    const colors: Record<number, string> = {
        1: '10b981', // green
        5: '6366f1', // indigo
        10: '8b5cf6', // purple
        20: 'f59e0b', // amber
        50: 'ef4444', // red
        100: 'ec4899', // pink
    };

    let badgeColor = colors[1];
    for (const [lvl, color] of Object.entries(colors)) {
        if (level >= parseInt(lvl)) badgeColor = color;
    }

    return generateBadgeSVG('Level', level.toString(), badgeColor);
}

export function generateXPBadge(xp: number): string {
    const formatted = xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : xp.toString();
    return generateBadgeSVG('XP', formatted, '6366f1');
}

export function generateStreakBadge(days: number): string {
    return generateBadgeSVG('🔥 Streak', `${days} days`, 'f59e0b');
}

// ============================================
// PROFILE CARD DATA
// ============================================

export interface ProfileCardData {
    name: string;
    level: number;
    xp: number;
    totalXP: number;
    avatarUrl: string;
    badges: string[];
    streak: number;
    joinDate: string;
    completedAssessments: number;
    topDimension: string;
}

export function generateProfileCard(data: Partial<ProfileCardData> & { name: string }) {
    const {
        name,
        level = 1,
        xp = 0,
        totalXP = 100,
        streak = 0,
        completedAssessments = 0,
        topDimension = 'Cognitive',
    } = data;

    return {
        ...data,
        name,
        level,
        xp,
        totalXP,
        streak,
        completedAssessments,
        topDimension,
        avatarUrl: data.avatarUrl || getDiceBearAvatar({ seed: name }),
        levelBadge: generateLevelBadge(level),
        xpBadge: generateXPBadge(xp),
        streakBadge: streak > 0 ? generateStreakBadge(streak) : null,
        xpProgress: Math.round((xp / totalXP) * 100),
    };
}

// ============================================
// PRESET AVATAR STYLES FOR DIMENSIONS
// ============================================

export const DIMENSION_AVATAR_STYLES: Record<string, AvatarStyle> = {
    cognitive: 'bottts',
    self_management: 'avataaars',
    financial: 'icons',
    physical_health: 'personas',
    emotional_intelligence: 'lorelei',
    mental_health: 'micah',
    character_ethics: 'notionists',
    spiritual: 'open-peeps',
    environmental: 'fun-emoji',
};

export function getDimensionAvatar(dimension: string, seed: string): string {
    const style = DIMENSION_AVATAR_STYLES[dimension] || 'avataaars';
    return getDiceBearAvatar({ seed: `${dimension}-${seed}`, style });
}

export default {
    getDiceBearAvatar,
    getRandomAvatar,
    getTextAvatar,
    getRoboHashAvatar,
    getBoringAvatar,
    generateBadgeSVG,
    generateLevelBadge,
    generateXPBadge,
    generateStreakBadge,
    generateProfileCard,
    getDimensionAvatar,
};
