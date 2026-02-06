
import { Resource, UserContext } from './types';
import { QuantumResourceRecommendationEngine } from './QuantumRecommendation';
import { SupabaseClient } from '@supabase/supabase-js';

export interface SearchOptions {
    query?: string;
    domain?: string;
    type?: string;
    limit?: number;
    userId?: string; // For personalization context
}

export class GlobalResourceEngine {

    /**
     * The main entry point for the GRE.
     * Orchestrates the Crawler (DB fetch), Quality Assessment, and Quantum Recommendation.
     * Requires a Supabase client instance to be passed in (Dependency Injection).
     */
    async findResources(supabase: SupabaseClient, options: SearchOptions): Promise<any[]> {
        // 1. HARVEST PHASE (Simulated Crawler / DB Search)
        let dbQuery = supabase
            .from('free_resources')
            .select('*');

        if (options.domain) {
            dbQuery = dbQuery.contains('target_dimensions', [options.domain]);
        }
        if (options.type) {
            dbQuery = dbQuery.eq('resource_type', options.type);
        }
        if (options.query) {
            dbQuery = dbQuery.ilike('title', `%${options.query}%`);
        }
        // Fetch slightly more to allow for filtering
        dbQuery = dbQuery.limit((options.limit || 20) * 2);

        const { data: rawResources, error } = await dbQuery;

        if (error) {
            console.error('GRE Crawler Error:', error);
            return [];
        }

        if (!rawResources || rawResources.length === 0) {
            return [];
        }

        // Cast DB result to Resource type (Mapping free_resources schema to GRE Resource)
        const resources: Resource[] = rawResources.map((row: any) => ({
            id: row.id,
            type: row.resource_type || 'article',
            title: row.title,
            description: row.description || '',
            url: row.url,
            image_url: row.image_url,
            languages: row.language ? [row.language] : ['en'],
            topics: row.target_dimensions || [], // Mapping dimensions to topics
            target_skills: row.skills || [],
            difficulty: row.difficulty || 'intermediate',
            estimated_time: row.duration_minutes ? `${row.duration_minutes} mins` : '30 mins',
            cost: { amount: 0, currency: 'IDR', free_tier: true }, // Free resources
            tags: row.target_dimensions || [],
            provider: row.source || 'Unknown',
            created_at: row.created_at || new Date().toISOString(),
            updated_at: row.created_at || new Date().toISOString(),
            quality: {
                pedagogical: row.rating ? row.rating / 5 : 0.7,
                scientific: 0.7, technical: 0.7, production: 0.7,
                accessibility: 0.7, recency: 0.7, credibility: 0.7, engagement: 0.7,
                practicality: 0.7, cultural: 0.7, scalability: 0.7, impact: 0.7
            }
        }));

        // 2. CONTEXTUAL AWARENESS
        // In a real app, fetch User Profile & Preferences. 
        // Here we mock a "Standard User" context if no userId provided, or build one.
        const context: UserContext = {
            learning_style: 'visual',
            current_skills: [],
            interests: options.domain ? [options.domain] : [],
            available_time: 120,
            budget: 0,
            accessibility_needs: [],
            cultural_context: 'neutral'
        };

        // 3. QUANTUM RECOMMENDATION (Wave Function Collapse)
        const recommendations = QuantumResourceRecommendationEngine.recommend(
            resources,
            context,
            options.limit || 10
        );

        // 4. RETURN format (flattened for UI or kept as recommendation objects)
        return recommendations.map(rec => ({
            ...rec.resource,
            match_score: rec.match_score,
            recommendation_reason: rec.reason
        }));
    }
}
