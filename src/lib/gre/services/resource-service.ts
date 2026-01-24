import { supabase } from '@/lib/supabaseClient';
import { GreResource, QualityScores, SearchResult } from '../types';
import { QualityAssessmentService } from './quality-service';

export class ResourceService {
    private supabase = supabase;
    private qualityService = new QualityAssessmentService();

    /**
     * Ingest a batch of resources into the GRE database using upsert.
     */
    async ingestResources(resources: Partial<GreResource>[]): Promise<{ data: any; error: any }> {
        // 1. Prepare data for insertion (ensure required fields)
        const records = resources.map(res => ({
            ...res,
            updated_at: new Date().toISOString(),
        }));

        // 2. Upsert into gre_resources table
        const { data: insertedResources, error: resourceError } = await this.supabase
            .from('gre_resources')
            .upsert(records, { onConflict: 'url' })
            .select();

        if (resourceError) return { data: null, error: resourceError };

        // 3. Calculate and Upsert Quality Scores
        if (insertedResources && insertedResources.length > 0) {
            const qualityRecords = insertedResources.map(res => {
                const quality = this.qualityService.assessQuality(res);
                return {
                    ...quality,
                    resource_id: res.id
                };
            });

            const { error: qualityError } = await this.supabase
                .from('gre_quality_scores')
                .upsert(qualityRecords, { onConflict: 'resource_id' });

            if (qualityError) console.error('Error saving quality scores:', qualityError);
        }

        return { data: insertedResources, error: null };
    }

    /**
     * Search resources using vector similarity (simulated for now if vector function not ready)
     * OR basic text search fallback.
     */
    async searchResources(query: string, limit = 10): Promise<SearchResult[]> {
        // TODO: Generate embedding for 'query' using an AI service
        // const queryEmbedding = await generateEmbedding(query);

        // For now, we fall back to simple text search on Title/Description
        const { data, error } = await this.supabase
            .from('gre_resources')
            .select('*')
            .ilike('title', `%${query}%`)
            .limit(limit);

        if (error) {
            console.error('Search error:', error);
            return [];
        }

        // Map to SearchResult
        return (data || []).map((res: any) => ({
            ...res,
            similarity: 1.0, // Mock similarity for text match
        }));
    }

    async getResourceById(id: string): Promise<GreResource | null> {
        const { data, error } = await this.supabase
            .from('gre_resources')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;
        return data;
    }
}
