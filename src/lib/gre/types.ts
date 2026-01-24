export type ResourceType =
    | 'course' | 'article' | 'video' | 'book'
    | 'podcast' | 'project' | 'tool' | 'paper' | 'repository';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CostInfo {
    is_free: boolean;
    currency: string;
    amount: number;
    scholarship_available?: boolean;
}

export interface GreResource {
    id: string;
    title: string;
    description: string | null;
    type: ResourceType;
    url: string;
    languages: string[];
    difficulty: DifficultyLevel;
    estimated_time_minutes: number | null;
    format_tags: string[];
    cost_info: CostInfo;
    embedding?: number[]; // Vector embedding
    source_platform: string | null;
    external_id: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface QualityScores {
    resource_id: string;
    pedagogical_score: number;
    scientific_accuracy_score: number;
    technical_quality_score: number;
    production_quality_score: number;
    accessibility_score: number;
    recency_score: number;
    credibility_score: number;
    engagement_potential_score: number;
    practical_application_score: number;
    cultural_relevance_score: number;
    scalability_score: number;
    impact_score: number;
    overall_score: number;
    last_assessed_at: string;
}

export interface GraphEdge {
    source_id: string;
    target_id: string;
    relation_type: 'prerequisite' | 'complements' | 'similar_to' | 'next_step';
    weight: number;
    created_at: string;
}

export interface SearchResult extends GreResource {
    similarity: number; // 0 to 1
    quality?: number; // Overall quality score
}
