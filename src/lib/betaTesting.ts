// Beta Testing Infrastructure
// Manages beta cohorts, feature flags, and feedback collection

export interface BetaCohort {
    id: string;
    name: string;
    description: string;
    size: number;
    criteria: string;
    startDate: string;
    endDate: string;
    features: string[];
    incentives: string[];
    status: 'upcoming' | 'active' | 'completed';
}

export interface BetaMetrics {
    activationRate: number;      // % who complete first assessment
    retention7d: number;         // % returning after 7 days
    assessmentCompletion: number; // % completing 3+ assessments
    aiTutorUsage: number;        // % using AI tutor
    bugReportsPerDay: number;    // Average daily bug reports
    npsScore: number;            // Net Promoter Score
}

export interface FeatureFlag {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    rolloutPercentage: number;   // 0-100
    enabledForBeta: boolean;
    enabledForCohorts: string[];
    metadata: Record<string, unknown>;
}

// Beta Cohorts Configuration
export const BETA_COHORTS: BetaCohort[] = [
    {
        id: 'early-adopters',
        name: 'Early Adopters',
        description: 'BEM ITS members and early registrants',
        size: 100,
        criteria: 'BEM members, early registration',
        startDate: '2026-01-25',
        endDate: '2026-02-08',
        features: ['all_assessments', 'ai_tutor', 'analytics', 'gamification'],
        incentives: ['early_adopter_badge', 'double_xp_week', 'priority_support'],
        status: 'active',
    },
    {
        id: 'faculty-testers',
        name: 'Faculty Testers',
        description: 'Dosen & Staff ITS for supervisor features',
        size: 50,
        criteria: 'Dosen & Staff ITS',
        startDate: '2026-01-27',
        endDate: '2026-02-10',
        features: ['supervisor_dashboard', 'analytics', 'export', 'mentorship'],
        incentives: ['faculty_badge', 'research_data_access'],
        status: 'upcoming',
    },
    {
        id: 'general-students',
        name: 'General Students',
        description: 'Randomly sampled ITS students',
        size: 350,
        criteria: 'Mahasiswa ITS (random sampling)',
        startDate: '2026-01-29',
        endDate: '2026-02-12',
        features: ['basic_assessments', 'dashboard', 'learning_paths'],
        incentives: ['beta_tester_badge', 'feedback_rewards'],
        status: 'upcoming',
    },
];

// Feature Flags
export const FEATURE_FLAGS: FeatureFlag[] = [
    {
        id: 'ai_tutor',
        name: 'AI Tutor',
        description: 'Groq-powered AI tutor chat',
        enabled: true,
        rolloutPercentage: 100,
        enabledForBeta: true,
        enabledForCohorts: ['early-adopters', 'faculty-testers'],
        metadata: { model: 'llama-3.3-70b-versatile' },
    },
    {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Predictive analytics and insights',
        enabled: true,
        rolloutPercentage: 50,
        enabledForBeta: true,
        enabledForCohorts: ['early-adopters'],
        metadata: {},
    },
    {
        id: 'social_learning',
        name: 'Social Learning',
        description: 'Study groups and peer mentoring',
        enabled: false,
        rolloutPercentage: 0,
        enabledForBeta: false,
        enabledForCohorts: [],
        metadata: { phase: 'development' },
    },
    {
        id: 'browser_ai',
        name: 'Browser AI',
        description: 'Local sentiment analysis',
        enabled: true,
        rolloutPercentage: 100,
        enabledForBeta: true,
        enabledForCohorts: ['early-adopters', 'faculty-testers', 'general-students'],
        metadata: { model: 'transformers.js' },
    },
];

// Check if user has access to a feature
export function hasFeatureAccess(
    featureId: string,
    userId: string,
    userCohort?: string,
    isBetaTester: boolean = false
): boolean {
    const flag = FEATURE_FLAGS.find(f => f.id === featureId);
    if (!flag) return false;

    // Feature disabled globally
    if (!flag.enabled) return false;

    // Beta tester with beta access
    if (isBetaTester && flag.enabledForBeta) return true;

    // Specific cohort access
    if (userCohort && flag.enabledForCohorts.includes(userCohort)) return true;

    // Percentage rollout (deterministic based on userId)
    if (flag.rolloutPercentage > 0) {
        const hash = simpleHash(userId + featureId);
        const bucket = hash % 100;
        return bucket < flag.rolloutPercentage;
    }

    return false;
}

// Simple hash function for deterministic feature assignment
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Get active cohort for a user
export function getUserCohort(userId: string, registrationDate: Date): string | null {
    const now = new Date();

    for (const cohort of BETA_COHORTS) {
        const start = new Date(cohort.startDate);
        const end = new Date(cohort.endDate);

        if (now >= start && now <= end && cohort.status === 'active') {
            // Assign based on cohort criteria (simplified)
            const hash = simpleHash(userId) % 100;

            if (cohort.id === 'early-adopters' && hash < 20) {
                return cohort.id;
            } else if (cohort.id === 'general-students' && hash >= 20) {
                return cohort.id;
            }
        }
    }

    return null;
}

// Beta metrics calculator
export function calculateBetaMetrics(
    activities: Array<{ type: string; userId: string; createdAt: Date }>,
    registrations: Array<{ userId: string; createdAt: Date }>,
    feedback: Array<{ type: string; createdAt: Date }>
): BetaMetrics {
    const totalUsers = registrations.length;
    if (totalUsers === 0) {
        return {
            activationRate: 0,
            retention7d: 0,
            assessmentCompletion: 0,
            aiTutorUsage: 0,
            bugReportsPerDay: 0,
            npsScore: 0,
        };
    }

    // Users who completed first assessment
    const usersWithAssessment = new Set(
        activities
            .filter(a => a.type === 'assessment_completed')
            .map(a => a.userId)
    );

    // Users active in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = new Set(
        activities
            .filter(a => a.createdAt >= sevenDaysAgo)
            .map(a => a.userId)
    );

    // Users who completed 3+ assessments
    const assessmentCounts: Record<string, number> = {};
    activities
        .filter(a => a.type === 'assessment_completed')
        .forEach(a => {
            assessmentCounts[a.userId] = (assessmentCounts[a.userId] || 0) + 1;
        });

    const usersWithThreeAssessments = Object.values(assessmentCounts)
        .filter(count => count >= 3).length;

    // AI Tutor usage
    const aiTutorUsers = new Set(
        activities
            .filter(a => a.type === 'ai_tutor_message')
            .map(a => a.userId)
    );

    // Bug reports per day
    const bugReports = feedback.filter(f => f.type === 'bug');
    const oldestFeedback = feedback.length > 0
        ? Math.min(...feedback.map(f => f.createdAt.getTime()))
        : Date.now();
    const daysSinceStart = Math.max(1, (Date.now() - oldestFeedback) / (1000 * 60 * 60 * 24));

    return {
        activationRate: Math.round((usersWithAssessment.size / totalUsers) * 100),
        retention7d: Math.round((activeUsers.size / totalUsers) * 100),
        assessmentCompletion: Math.round((usersWithThreeAssessments / totalUsers) * 100),
        aiTutorUsage: Math.round((aiTutorUsers.size / totalUsers) * 100),
        bugReportsPerDay: Math.round((bugReports.length / daysSinceStart) * 10) / 10,
        npsScore: 45, // Placeholder - would need survey data
    };
}

// Feedback classification
export type FeedbackCategory =
    | 'ui_ux'
    | 'performance'
    | 'feature_request'
    | 'content'
    | 'bug'
    | 'other';

export function classifyFeedback(content: string): FeedbackCategory {
    const lowerContent = content.toLowerCase();

    const keywords: Record<FeedbackCategory, string[]> = {
        ui_ux: ['design', 'button', 'layout', 'color', 'font', 'tampilan', 'tombol', 'ui', 'ux'],
        performance: ['slow', 'fast', 'loading', 'lag', 'freeze', 'lambat', 'cepat', 'hang'],
        feature_request: ['add', 'new feature', 'would be nice', 'suggest', 'tambah', 'fitur baru', 'saran'],
        content: ['content', 'material', 'question', 'answer', 'materi', 'soal', 'jawaban'],
        bug: ['error', 'bug', 'crash', 'broken', 'not working', 'gagal', 'rusak', 'tidak bisa'],
        other: [],
    };

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(word => lowerContent.includes(word))) {
            return category as FeedbackCategory;
        }
    }

    return 'other';
}

const betaTesting = {
    BETA_COHORTS,
    FEATURE_FLAGS,
    hasFeatureAccess,
    getUserCohort,
    calculateBetaMetrics,
    classifyFeedback,
};

export default betaTesting;
