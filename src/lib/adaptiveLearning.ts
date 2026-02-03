// Adaptive Learning Engine
// Personalized learning paths based on user behavior and performance

import { getContentByDimension, LearningContent } from './freeContent';

export interface LearningStyle {
    visual: number;      // 0-1
    reading: number;     // 0-1
    kinesthetic: number; // 0-1
    auditory: number;    // 0-1
    dominant: 'visual' | 'reading' | 'kinesthetic' | 'auditory';
}

export interface LearningPreference {
    preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
    sessionDuration: 'short' | 'medium' | 'long'; // 15min, 30min, 60min
    contentTypes: string[];
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface AdaptivePath {
    userId: string;
    dimension: string;
    currentLevel: number;
    targetLevel: number;
    estimatedWeeks: number;
    weeklyPlan: WeeklyLearningPlan[];
    adaptations: PathAdaptation[];
    createdAt: string;
    updatedAt: string;
}

export interface WeeklyLearningPlan {
    weekNumber: number;
    theme: string;
    objectives: string[];
    activities: LearningActivity[];
    expectedXP: number;
    assessmentRequired: boolean;
}

export interface LearningActivity {
    id: string;
    title: string;
    type: 'video' | 'article' | 'quiz' | 'exercise' | 'reflection' | 'discussion';
    duration: number; // minutes
    difficulty: 'easy' | 'medium' | 'hard';
    xpReward: number;
    url?: string;
    content?: string;
    prerequisites?: string[];
}

export interface PathAdaptation {
    date: string;
    reason: 'performance' | 'engagement' | 'preference' | 'schedule';
    description: string;
    changes: string[];
}

export interface UserBehavior {
    averageSessionDuration: number;
    preferredContentType: string;
    completionRate: number;
    engagementScore: number;
    peakActivityHours: number[];
    strugglingTopics: string[];
    masteredTopics: string[];
}

// Detect learning style from activity history
export function detectLearningStyle(
    activities: Array<{ type: string; duration: number; completed: boolean }>
): LearningStyle {
    const typeScores = {
        visual: 0,
        reading: 0,
        kinesthetic: 0,
        auditory: 0,
    };

    let total = 0;

    for (const activity of activities) {
        if (!activity.completed) continue;

        const weight = Math.min(activity.duration / 30, 2); // Cap at 2x weight for long sessions
        total += weight;

        switch (activity.type) {
            case 'video':
            case 'animation':
            case 'infographic':
                typeScores.visual += weight;
                break;
            case 'article':
            case 'ebook':
            case 'documentation':
                typeScores.reading += weight;
                break;
            case 'exercise':
            case 'quiz':
            case 'project':
            case 'simulation':
                typeScores.kinesthetic += weight;
                break;
            case 'podcast':
            case 'audio':
            case 'lecture':
                typeScores.auditory += weight;
                break;
        }
    }

    // Normalize scores
    if (total > 0) {
        typeScores.visual /= total;
        typeScores.reading /= total;
        typeScores.kinesthetic /= total;
        typeScores.auditory /= total;
    } else {
        // Default balanced
        typeScores.visual = 0.25;
        typeScores.reading = 0.25;
        typeScores.kinesthetic = 0.25;
        typeScores.auditory = 0.25;
    }

    // Find dominant style
    const max = Math.max(
        typeScores.visual,
        typeScores.reading,
        typeScores.kinesthetic,
        typeScores.auditory
    );

    let dominant: LearningStyle['dominant'] = 'visual';
    if (typeScores.reading === max) dominant = 'reading';
    else if (typeScores.kinesthetic === max) dominant = 'kinesthetic';
    else if (typeScores.auditory === max) dominant = 'auditory';

    return { ...typeScores, dominant };
}

// Generate personalized learning path
export function generateAdaptivePath(
    userId: string,
    dimension: string,
    currentScore: number,
    targetScore: number,
    learningStyle: LearningStyle,
    preferences: LearningPreference,
    availableHoursPerWeek: number = 5
): AdaptivePath {
    const gap = targetScore - currentScore;
    const estimatedWeeks = Math.ceil(gap / 5); // ~5 points improvement per week

    const weeklyPlan: WeeklyLearningPlan[] = [];

    // Get content for this dimension
    const dimensionContent = getContentByDimension(dimension);

    // Generate weekly plans
    for (let week = 1; week <= estimatedWeeks; week++) {
        const theme = getWeekTheme(dimension, week, estimatedWeeks);
        const activities = generateWeekActivities(
            dimension,
            week,
            learningStyle,
            preferences,
            availableHoursPerWeek,
            dimensionContent
        );

        weeklyPlan.push({
            weekNumber: week,
            theme,
            objectives: generateObjectives(dimension, week),
            activities,
            expectedXP: activities.reduce((sum, a) => sum + a.xpReward, 0),
            assessmentRequired: week % 2 === 0, // Assessment every 2 weeks
        });
    }

    return {
        userId,
        dimension,
        currentLevel: currentScore,
        targetLevel: targetScore,
        estimatedWeeks,
        weeklyPlan,
        adaptations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

// Get theme for a week
function getWeekTheme(dimension: string, week: number, totalWeeks: number): string {
    const themes: Record<string, string[]> = {
        cognitive: ['Foundations of Critical Thinking', 'Analytical Skills', 'Problem Solving', 'Creative Thinking', 'Advanced Reasoning'],
        financial: ['Money Mindset', 'Budgeting Basics', 'Saving Strategies', 'Investment Fundamentals', 'Financial Planning'],
        emotional_intelligence: ['Self-Awareness', 'Self-Regulation', 'Motivation', 'Empathy', 'Social Skills'],
        mental_health: ['Stress Awareness', 'Coping Strategies', 'Mindfulness', 'Resilience Building', 'Wellbeing Habits'],
        physical_health: ['Nutrition Basics', 'Exercise Fundamentals', 'Sleep Optimization', 'Energy Management', 'Lifestyle Balance'],
        character_ethics: ['Values Clarification', 'Ethical Reasoning', 'Integrity in Action', 'Leadership Character', 'Moral Courage'],
        spiritual: ['Purpose Discovery', 'Mindful Living', 'Gratitude Practice', 'Connection & Community', 'Meaning Making'],
        environmental: ['Awareness Building', 'Sustainable Habits', 'Digital Wellbeing', 'Work-Life Balance', 'Environmental Action'],
    };

    const dimensionThemes = themes[dimension] || themes.cognitive;
    const themeIndex = Math.min(week - 1, dimensionThemes.length - 1);
    return dimensionThemes[themeIndex];
}

// Generate objectives for a week
function generateObjectives(dimension: string, week: number): string[] {
    // Would be more dynamic in production
    return [
        `Complete ${week === 1 ? 'introductory' : 'advanced'} content for ${dimension}`,
        `Practice at least 2 exercises`,
        `Reflect on personal application`,
        week % 2 === 0 ? 'Complete mid-point assessment' : 'Review and consolidate learning',
    ];
}

// Generate activities for a week
function generateWeekActivities(
    dimension: string,
    week: number,
    learningStyle: LearningStyle,
    preferences: LearningPreference,
    availableHours: number,
    content: LearningContent[]
): LearningActivity[] {
    const activities: LearningActivity[] = [];
    let remainingMinutes = availableHours * 60;

    // Prioritize content types based on learning style
    const typePreference: string[] = [];
    if (learningStyle.visual > 0.3) typePreference.push('video');
    if (learningStyle.reading > 0.3) typePreference.push('article');
    if (learningStyle.kinesthetic > 0.3) typePreference.push('exercise', 'quiz');
    if (learningStyle.auditory > 0.3) typePreference.push('video', 'course');

    // Add learning activities
    const relevantContent = content.filter(c =>
        typePreference.length === 0 || typePreference.includes(c.type)
    );

    for (const item of relevantContent.slice(0, 3)) {
        const duration = parseInt(item.duration?.split(' ')[0] || '30') || 30;
        if (remainingMinutes < duration) continue;

        activities.push({
            id: `${dimension}-${week}-${item.id}`,
            title: item.title,
            type: item.type as LearningActivity['type'],
            duration,
            difficulty: week <= 2 ? 'easy' : week <= 4 ? 'medium' : 'hard',
            xpReward: Math.ceil(duration / 5) * 5,
            url: item.url,
        });

        remainingMinutes -= duration;
    }

    // Add reflection activity
    if (remainingMinutes >= 15) {
        activities.push({
            id: `${dimension}-${week}-reflection`,
            title: 'Weekly Reflection',
            type: 'reflection',
            duration: 15,
            difficulty: 'easy',
            xpReward: 25,
            content: `Reflect on what you learned this week about ${dimension}. How can you apply it?`,
        });
    }

    // Add quiz if week has assessment
    if (week % 2 === 0 && remainingMinutes >= 20) {
        activities.push({
            id: `${dimension}-${week}-quiz`,
            title: 'Progress Check Quiz',
            type: 'quiz',
            duration: 20,
            difficulty: 'medium',
            xpReward: 50,
        });
    }

    return activities;
}

// Adapt path based on user progress
export function adaptPath(
    currentPath: AdaptivePath,
    recentPerformance: { assessmentScore: number; completionRate: number; engagementScore: number }
): AdaptivePath {
    const adaptations: PathAdaptation[] = [...currentPath.adaptations];
    let updatedPlan = [...currentPath.weeklyPlan];

    // Performance-based adaptation
    if (recentPerformance.assessmentScore < 60) {
        adaptations.push({
            date: new Date().toISOString(),
            reason: 'performance',
            description: 'Added remedial content due to low assessment score',
            changes: ['Added easier introductory content', 'Extended practice activities'],
        });

        // Add remedial content to upcoming weeks
        updatedPlan = updatedPlan.map(week => ({
            ...week,
            activities: [
                {
                    id: `remedial-${week.weekNumber}`,
                    title: 'Foundational Review',
                    type: 'article' as const,
                    duration: 20,
                    difficulty: 'easy' as const,
                    xpReward: 20,
                },
                ...week.activities,
            ],
        }));
    }

    // Engagement-based adaptation
    if (recentPerformance.engagementScore < 0.5) {
        adaptations.push({
            date: new Date().toISOString(),
            reason: 'engagement',
            description: 'Adjusted content for better engagement',
            changes: ['Shortened activities', 'Added more interactive content'],
        });
    }

    // Completion-based adaptation
    if (recentPerformance.completionRate > 0.9 && recentPerformance.assessmentScore > 85) {
        adaptations.push({
            date: new Date().toISOString(),
            reason: 'performance',
            description: 'Accelerated path due to excellent progress',
            changes: ['Added advanced content', 'Reduced repetition'],
        });
    }

    return {
        ...currentPath,
        weeklyPlan: updatedPlan,
        adaptations,
        updatedAt: new Date().toISOString(),
    };
}

// Calculate skill decay (for spaced repetition)
export function calculateSkillDecay(
    lastPracticeDate: Date,
    initialStrength: number,
    decayRate: number = 0.1
): number {
    const daysSinceLastPractice = Math.floor(
        (Date.now() - lastPracticeDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Exponential decay
    const currentStrength = initialStrength * Math.exp(-decayRate * daysSinceLastPractice);

    return Math.max(0, Math.min(100, currentStrength));
}

// Get next recommended activity
export function getNextActivity(
    userId: string,
    adaptivePath: AdaptivePath,
    completedActivities: string[]
): LearningActivity | null {
    for (const week of adaptivePath.weeklyPlan) {
        for (const activity of week.activities) {
            if (!completedActivities.includes(activity.id)) {
                return activity;
            }
        }
    }

    return null;
}

const adaptiveLearning = {
    detectLearningStyle,
    generateAdaptivePath,
    adaptPath,
    calculateSkillDecay,
    getNextActivity,
};

export default adaptiveLearning;
