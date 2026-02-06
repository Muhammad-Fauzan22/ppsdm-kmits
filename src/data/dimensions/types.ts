/**
 * Type Definitions for Assessment Dimensions
 * 
 * This file contains all TypeScript interfaces and types
 * for the 9-dimension holistic assessment system.
 */

export interface DimensionData {
    id: number;
    slug: string;
    title: string;
    tagline: string;
    description: string;
    longDescription: string;
    stat: string;
    icon: string;
    type: 'hard' | 'soft';
    link: string;
    assessmentLink: string;
    color: string;
    modules: string[];
    progress: number;
    research: DimensionResearch;
    items: AssessmentItem[];
    subdimensions: Subdimension[];
    scoring: ScoringConfig;
    disclaimer: Disclaimer;
    references: string[];
}

export interface DimensionResearch {
    reliability: number;
    validity: string;
    sampleSize: number;
    keyFindings: string[];
    normativeData: NormativeData;
    psychometricProperties: PsychometricProperties;
    methodology: ResearchMethodology;
    validityEvidence?: {
        convergent: Array<{
            measure: string;
            r: number;
            n: number;
            pValue: number;
        }>;
        incremental: Array<{
            model: string;
            deltaR2: number;
            fChange: number;
            pValue: number;
        }>;
    };
}

export interface NormativeData {
    mean: number;
    sd: number;
    interpretation: string;
    percentiles: Record<string, number>;
    facultyNorms?: Record<string, { mean: number; sd: number }>;
    genderNorms?: Record<string, { mean: number; sd: number }>;
    yearLevelSpecific?: Record<string, { mean: number; sd: number }>;
}

export interface PsychometricProperties {
    alpha: string;
    cfi: string;
    rmsea: string;
    tli: string;
    itemCount: number;
    factorLoadings: Record<string, number>;
    itemTotalCorrelations: {
        min: number;
        max: number;
        mean: number;
    };
    itemAnalysis?: Array<{
        item: string;
        mean: number;
        sd: number;
        itemTotalR: number;
        factorLoading: number;
    }>;
}

export interface ResearchMethodology {
    approach: string;
    databases: string[];
    timeRange: string;
    inclusionCriteria: string[];
    validationSample: {
        size: number;
        demographics: {
            gender?: string;
            faculty?: string;
            religion?: string;
            religiousBackground?: string;
            religiousDistribution?: string;
            geographic?: string;
        };
        testRetest?: {
            interval: string;
            reliability: number;
        };
    };
}

export interface AssessmentItem {
    id: string;
    text: string;
    dimension: string;
    subdimension: string;
    type: 'likert' | 'multiple-choice' | 'frequency' | 'scale';
    format: string;
    scale?: number;
    options?: string[];
    weight: number;
    reverseScored?: boolean;
    psychometrics: {
        alpha: number;
        factorLoading: number;
        itemTotalCorrelation: number;
        difficulty: number;
        discrimination: number;
    };
    source: string;
    adaptation: string;
}

export interface Subdimension {
    id: string;
    name: string;
    description: string;
    items: string[];
    weight: number;
    icon: string;
    color: string;
}

export interface ScoringConfig {
    weights: Record<string, number>;
    algorithm: string;
    interpretation: InterpretationLevel[];
    irtParameters?: {
        thetaEstimation: string;
        standardError: string;
        adjustment: string;
    };
}

export interface InterpretationLevel {
    level: string;
    scoreRange: [number, number];
    description: string;
    characteristics: string[];
    recommendations: string[];
}

export interface Disclaimer {
    purpose: string;
    scientificBasis: string;
    instruments: string[];
    limitations: string[];
    ethics: string[];
    reliability: string[];
    interpretation: string[];
}

export interface AssessmentResponse {
    dimensionId: number;
    responses: Record<string, number | string>;
    timestamp: string;
    completionTime?: number;
    device?: string;
}

export interface AssessmentResult {
    assessmentId: string;
    dimensionId: number;
    scores: {
        composite: number;
        subscores: Record<string, number>;
    };
    interpretation: {
        level: string;
        percentile: number;
        strengths: string[];
        growthAreas: string[];
        reliabilityIndex: number;
    };
    feedback: {
        strengths: string[];
        challenges: string[];
        actionableInsights: string[];
        personalizedRecommendations: string[];
        developmentPlan: string[];
    };
    confidenceInterval: {
        lower: number;
        upper: number;
    };
    timestamp: string;
}

export interface HolisticAssessmentResult {
    userId: string;
    assessmentId: string;
    timestamp: string;
    dimensions: {
        [key: string]: AssessmentResult;
    };
    overall: {
        compositeScore: number;
        balanceIndex: number;
        quadrantAnalysis: {
            cognitive: number;
            affective: number;
            social: number;
        };
        developmentPhase: string;
    };
    recommendations: {
        priorities: string[];
        resources: string[];
        programs: string[];
    };
}

export interface VisualizationData {
    type: 'radar' | 'sunburst' | 'timeline' | 'waterfall' | 'gauge' | 'network' | 'flower' | 'tree' | 'dashboard';
    dimensionId: number;
    data: any;
    config: {
        colors: string[];
        labels: string[];
        thresholds: number[];
    };
}

export interface GamificationProgress {
    userId: string;
    totalXP: number;
    level: number;
    badges: Badge[];
    streaks: {
        assessment: number;
        learning: number;
        practice: number;
    };
    achievements: Achievement[];
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earnedAt?: string;
    progress?: number;
    maxProgress?: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    xpReward: number;
    completedAt?: string;
    progress?: number;
    maxProgress?: number;
}

export interface DevelopmentRoadmap {
    userId: string;
    dimensionId: number;
    currentLevel: string;
    targetLevel: string;
    milestones: Milestone[];
    estimatedDuration: string;
    resources: Resource[];
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    targetScore: number;
    currentScore: number;
    completed: boolean;
    dueDate?: string;
    activities: Activity[];
}

export interface Activity {
    id: string;
    title: string;
    type: 'course' | 'practice' | 'assessment' | 'reflection';
    duration: string;
    xpReward: number;
    completed: boolean;
}

export interface Resource {
    id: string;
    title: string;
    type: 'article' | 'video' | 'course' | 'tool' | 'book';
    url: string;
    duration?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
}

export interface GapAnalysis {
    userId: string;
    timestamp: string;
    dimensions: {
        [key: string]: {
            currentScore: number;
            targetScore: number;
            gap: number;
            priority: 'high' | 'medium' | 'low';
            rootCauses: string[];
            actionItems: string[];
        };
    };
    overall: {
        biggestGap: string;
        mostBalanced: string;
        developmentPriority: string[];
    };
}

export interface NormativeComparison {
    userId: string;
    dimensionId: number;
    userScore: number;
    comparisons: {
        faculty: {
            mean: number;
            percentile: number;
            interpretation: string;
        };
        gender: {
            mean: number;
            percentile: number;
            interpretation: string;
        };
        yearLevel: {
            mean: number;
            percentile: number;
            interpretation: string;
        };
        national: {
            mean: number;
            percentile: number;
            interpretation: string;
        };
    };
    insights: string[];
}

export type DimensionSlug =
    | 'cognitive'
    | 'self-management'
    | 'financial'
    | 'physical'
    | 'emotional-social'
    | 'mental-health'
    | 'character'
    | 'spiritual'
    | 'environmental';

export type DimensionColor =
    | 'brand-blue'
    | 'its-gold'
    | 'success-green'
    | 'warning-orange'
    | 'danger-red'
    | 'info-cyan'
    | 'purple'
    | 'pink'
    | 'teal';

export const DIMENSION_COLORS: Record<DimensionColor, string> = {
    'brand-blue': '#1e40af',
    'its-gold': '#d97706',
    'success-green': '#059669',
    'warning-orange': '#ea580c',
    'danger-red': '#dc2626',
    'info-cyan': '#0891b2',
    'purple': '#7c3aed',
    'pink': '#db2777',
    'teal': '#0d9488'
};

export const DIMENSION_ICONS: Record<DimensionSlug, string> = {
    'cognitive': 'psychology',
    'self-management': 'target',
    'financial': 'monetization_on',
    'physical': 'favorite',
    'emotional-social': 'favorite_border',
    'mental-health': 'self_improvement',
    'character': 'verified',
    'spiritual': 'auto_awesome',
    'environmental': 'eco'
};
