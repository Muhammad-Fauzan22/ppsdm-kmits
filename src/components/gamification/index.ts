// Gamification Components Index
// Export all gamification components for easy importing

// Badge System
export {
    GamificationBadge,
    ProgressionIndicator,
    QuestCard,
    type GamificationBadgeProps,
    type ProgressionIndicatorProps,
    type QuestCardProps,
    type BadgeRarity,
    type BadgeSize,
} from './GamificationBadge';

// Progression System
export {
    XPLevelRing,
    AchievementToast,
    Leaderboard,
    PeerActivity,
    type XPLevelRingProps,
    type AchievementToastProps,
    type LeaderboardProps,
    type LeaderboardEntry,
    type PeerActivityProps,
} from './ProgressionSystem';

// Quest System
export {
    DailyQuests,
    StreakIndicator,
    LiveReactions,
    type Quest,
    type DailyQuestsProps,
    type StreakIndicatorProps,
    type LiveReactionsProps,
} from './QuestSystem';

// Animations
export {
    ConfettiParticles,
    XPGainAnimation,
    LevelUpAnimation,
    GlowPulse,
    ShimmerEffect,
    type ConfettiParticlesProps,
    type XPGainAnimationProps,
    type LevelUpAnimationProps,
    type GlowPulseProps,
    type ShimmerEffectProps,
} from './Animations';
