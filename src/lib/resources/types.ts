
export type ResourceType = 'course' | 'article' | 'video' | 'book' | 'podcast' | 'project' | 'tool' | 'mentor' | 'event';

export interface QualityDimensions {
    pedagogical: number;
    scientific: number;
    technical: number;
    production: number;
    accessibility: number;
    recency: number;
    credibility: number;
    engagement: number;
    practicality: number;
    cultural: number;
    scalability: number;
    impact: number;
}

export interface Resource {
    id: string;
    type: ResourceType;
    title: string;
    description: string;
    url: string;
    image_url?: string;
    languages: string[];
    topics: string[]; // concepts
    target_skills: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    estimated_time: string; // e.g. "4 weeks" or "10 hours"
    cost: {
        currency: string;
        amount: number;
        free_tier: boolean;
    };
    quality: QualityDimensions;
    tags: string[];
    provider: string; // e.g. "Coursera", "MIT"
    created_at: string;
    updated_at: string;
}

export interface UserContext {
    learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    current_skills: string[];
    interests: string[];
    available_time: number; // minutes per week
    budget: number;
    accessibility_needs: string[];
    cultural_context: string;
}

export interface RecommendationResult {
    resource: Resource;
    match_score: number;
    reason: string; // "High skill overlap", "Cultural fit", etc.
    entanglements: string[]; // ID of related resources
}
