
import { SupabaseClient } from '@supabase/supabase-js';
import { GlobalResourceEngine } from './GlobalResourceEngine';
import { Resource } from './types';

export interface LearningMilestone {
    week: number;
    title: string;
    description: string;
    resources: Resource[];
    focus_skills: string[];
}

export interface LearningPathway {
    roadmap_id: string;
    total_weeks: number;
    milestones: LearningMilestone[];
    completion_estimate: string;
}

export class DynamicLearningPathwayComposer {
    private gre: GlobalResourceEngine;

    constructor() {
        this.gre = new GlobalResourceEngine();
    }

    /**
     * Composes a tailored learning pathway based on the roadmap's focus dimensions.
     * Uses the Global Resource Engine to find optimal resources for each phase.
     */
    async composePathway(
        supabase: SupabaseClient,
        roadmap: any
    ): Promise<LearningPathway> {
        const primaryDimensions = roadmap.primary_focus_dimensions || [];
        const secondaryDimensions = roadmap.secondary_focus_dimensions || [];

        // 1. Define Pathway Structure (Standard 4-Phase Model for now)
        // In a full implementation, this would be dynamic based on current skill level
        const pathway: LearningPathway = {
            roadmap_id: roadmap.id,
            total_weeks: 4,
            milestones: [],
            completion_estimate: '4 weeks'
        };

        // 2. Compose Phases

        // Phase 1: Foundation (Week 1)
        // Focus on Primary Dimensions - Beginner/Intermediate content
        const foundationResources = await this.fetchResourcesForPhase(
            supabase,
            primaryDimensions,
            'article', // Read first
            'beginner'
        );
        pathway.milestones.push({
            week: 1,
            title: "Foundation & Concepts",
            description: "Build a strong understanding of core concepts in your focus areas.",
            resources: foundationResources.slice(0, 3),
            focus_skills: primaryDimensions
        });

        // Phase 2: Exploration (Week 2)
        // Broader look including Secondary Dimensions - Video/Course
        const explorationResources = await this.fetchResourcesForPhase(
            supabase,
            [...primaryDimensions, ...secondaryDimensions],
            'video',
            'intermediate'
        );
        pathway.milestones.push({
            week: 2,
            title: "Deep Dive Exploration",
            description: "Expand your knowledge with in-depth video content and broader topics.",
            resources: explorationResources.slice(0, 3),
            focus_skills: [...primaryDimensions, ...secondaryDimensions]
        });

        // Phase 3: Practice & Application (Week 3)
        // Focus on Primary - Interactive/Project/Worksheet
        const practiceResources = await this.fetchResourcesForPhase(
            supabase,
            primaryDimensions,
            'course', // Proxied as course/interactive
            'advanced'
        );
        pathway.milestones.push({
            week: 3,
            title: "Practical Application",
            description: "Apply what you've learned through structured courses and exercises.",
            resources: practiceResources.slice(0, 3),
            focus_skills: primaryDimensions
        });

        // Phase 4: Integration & Mastery (Week 4)
        // Challenge / Advanced content
        // For now, we mix in some "Special" high-quality resources
        const masteryResources = await this.gre.findResources(supabase, {
            query: 'mastery',
            limit: 5
        });
        // If mastery query fails to find specific things, fallback to high rated primary
        const finalResources = masteryResources.length > 0 ? masteryResources : await this.fetchResourcesForPhase(supabase, primaryDimensions, undefined, 'expert');

        pathway.milestones.push({
            week: 4,
            title: "Integration & Mastery",
            description: "Synthesize your learning and prepare for the next level.",
            resources: finalResources.slice(0, 3),
            focus_skills: primaryDimensions
        });

        return pathway;
    }

    private async fetchResourcesForPhase(
        supabase: SupabaseClient,
        dimensions: string[],
        type?: string,
        difficulty?: string
    ): Promise<Resource[]> {
        // Aggregate resources for all dimensions
        // In reality, we might want to interleave them. 
        // Here we fetch a batch for the first dimension for simplicity of the prompt, 
        // or loop if we needed strict balancing.

        if (dimensions.length === 0) return [];

        const targetDim = dimensions[0]; // Primary driver

        // Use GRE Main Engine
        // Note: difficulty filtering is mocked in GRE currently or handled by DB query
        // We pass 'type' to GRE.
        const resources = await this.gre.findResources(supabase, {
            domain: targetDim,
            type: type,
            limit: 10
        });

        // Post-filter for difficulty if possible, or just return top quality
        // GRE ranks by quality, so taking top N is good.
        return resources;
    }
}
