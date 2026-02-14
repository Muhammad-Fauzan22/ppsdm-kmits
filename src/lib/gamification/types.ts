export interface Level {
    level: number;
    xp_required: number;
    title: string;
    icon_url?: string;
}

export interface UserProgress {
    user_id: string;
    current_xp: number;
    current_level: number;
    current_streak: number;
    longest_streak: number;
    last_activity_date?: string;
    updated_at: string;
    next_level?: Level; // Joined data
    level_details?: Level; // Joined data
    is_public?: boolean;
}

export interface Badge {
    id: string;
    slug: string;
    name: string;
    description?: string;
    icon_url?: string;
    category: 'general' | 'academic' | 'community' | 'hidden';
    xp_bonus: number;
    is_hidden: boolean;
    created_at: string;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
    metadata?: Record<string, any>;
    badge_details?: Badge; // Joined data
}

export interface Quest {
    id: string;
    title: string;
    description?: string;
    xp_reward: number;
    frequency: 'daily' | 'weekly' | 'one_time' | 'milestone';
    action_type: string;
    target_count: number;
    is_active: boolean;
    created_at: string;
}

export interface UserQuest {
    id: string;
    user_id: string;
    quest_id: string;
    current_progress: number;
    is_completed: boolean;
    is_claimed: boolean;
    completed_at?: string;
    reset_at?: string;
    quest_details?: Quest; // Joined data
}
