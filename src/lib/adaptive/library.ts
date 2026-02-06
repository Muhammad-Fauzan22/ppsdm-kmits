export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type InterventionType = 'exercise' | 'reading' | 'challenge' | 'video' | 'reflection';

export interface Intervention {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    difficulty: DifficultyLevel;
    dimension: string; // matches dimension IDs like 'financial', 'cognitive'
    minScoreThreshold?: number; // Show if user score is < this
    maxScoreThreshold?: number; // Show if user score is > this (for advanced challenges)
    type: InterventionType;
    tags: string[];
}

export const INTERVENTION_LIBRARY: Intervention[] = [
    // --- FINANCIAL (Low Score Interventions) ---
    {
        id: 'fin_track_expenses',
        title: '3-Day Expense Tracking',
        description: 'Log every single expense for 3 days to identify leaks.',
        durationMinutes: 5,
        difficulty: 'easy',
        dimension: 'financial',
        minScoreThreshold: 60,
        type: 'challenge',
        tags: ['budgeting', 'awareness']
    },
    {
        id: 'fin_emergency_fund',
        title: 'Start an Emergency Fund',
        description: 'Open a separate variety account and deposit Rp 50.000.',
        durationMinutes: 15,
        difficulty: 'medium',
        dimension: 'financial',
        minScoreThreshold: 50,
        type: 'exercise',
        tags: ['saving', 'security']
    },

    // --- COGNITIVE (Growth Interventions) ---
    {
        id: 'cog_mental_models',
        title: 'Learn One Mental Model',
        description: 'Read about "First Principles Thinking" and apply it to one problem.',
        durationMinutes: 20,
        difficulty: 'medium',
        dimension: 'cognitive',
        type: 'reading',
        tags: ['thinking', 'logic']
    },
    {
        id: 'cog_debate_self',
        title: 'Steel Man Argument',
        description: 'Take a controversial topic and write 3 strong arguments against your own view.',
        durationMinutes: 30,
        difficulty: 'hard',
        dimension: 'cognitive',
        maxScoreThreshold: 70, // For high achievers too
        type: 'exercise',
        tags: ['critical_thinking']
    },

    // --- EMOTIONAL (Wellbeing) ---
    {
        id: 'emo_gratitude_journal',
        title: 'Gratitude Journaling',
        description: 'Write down 3 things you are grateful for today.',
        durationMinutes: 5,
        difficulty: 'easy',
        dimension: 'emotional',
        minScoreThreshold: 60,
        type: 'reflection',
        tags: ['mood', 'positivity']
    },
    {
        id: 'emo_active_listening',
        title: 'Active Listening Challenge',
        description: 'In your next conversation, listen to understand, not to reply. Summarize what they said back to them.',
        durationMinutes: 10,
        difficulty: 'medium',
        dimension: 'emotional',
        type: 'challenge',
        tags: ['social skills', 'empathy']
    },

    // --- PHYSICAL ---
    {
        id: 'phy_hydration',
        title: 'Hydration Sprint',
        description: 'Drink 2 glasses of water immediately after waking up.',
        durationMinutes: 2,
        difficulty: 'easy',
        dimension: 'physical',
        minScoreThreshold: 70,
        type: 'challenge',
        tags: ['health', 'habit']
    },
    {
        id: 'phy_sleep_hygiene',
        title: 'No-Screen Hour',
        description: 'Turn off all screens 1 hour before bed tonight.',
        durationMinutes: 60,
        difficulty: 'medium',
        dimension: 'physical',
        minScoreThreshold: 60,
        type: 'challenge',
        tags: ['sleep', 'recovery']
    }
];
