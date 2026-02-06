import { BaseCrawler, CrawlResult } from './base';
import { GreResource, ResourceType } from '../types';

interface OpenAlexWork {
    id: string;
    doi: string;
    title: string;
    publication_year: number;
    type: string;
    primary_location?: {
        landing_page_url?: string;
        is_oa?: boolean;
    };
    open_access: {
        is_oa: boolean;
        oa_status: string;
    };
    concepts: { display_name: string; score: number }[];
    cited_by_count: number;
    abstract_inverted_index?: Record<string, number[]>; // We won't reconstruct abstract for now
}

export class OpenAlexCrawler extends BaseCrawler {
    sourceName = 'OpenAlex';
    private baseUrl = 'https://api.openalex.org/works';

    async crawl(query: string = 'artificial intelligence education'): Promise<CrawlResult> {
        try {
            // Fetch works from OpenAlex
            // Filter: has_fulltext=true, type=article
            const url = `${this.baseUrl}?search=${encodeURIComponent(query)}&filter=has_fulltext:true,type:article&per_page=10`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`OpenAlex API error: ${response.statusText}`);
            }

            const data = await response.json();
            const works: OpenAlexWork[] = data.results || [];

            const resources: Partial<GreResource>[] = works.map(work => this.mapWorkToResource(work));

            return {
                resources,
                errors: []
            };

        } catch (error) {
            return {
                resources: [],
                errors: [this.handleError(error)]
            };
        }
    }

    private mapWorkToResource(work: OpenAlexWork): Partial<GreResource> {
        return {
            title: work.title || 'Untitled Academic Work',
            url: work.primary_location?.landing_page_url || work.doi || `https://openalex.org/${work.id}`,
            type: 'paper' as ResourceType,
            description: `Academic paper published in ${work.publication_year}. Cited by ${work.cited_by_count}.`,
            difficulty: 'advanced', // Default for papers
            estimated_time_minutes: 60, // Rough estimate for reading a paper
            languages: ['en'], // Default assumption for international papers
            format_tags: ['pdf', 'text'],
            cost_info: {
                is_free: work.open_access.is_oa,
                currency: 'USD',
                amount: 0
            },
            source_platform: 'OpenAlex',
            external_id: work.id,
            // Metadata for quality assessment
            created_at: new Date().toISOString()
        };
    }
}
