/**
 * Knowledge Hub types used across API, scraper, and frontend.
 */

export interface KnowledgeItem {
    id: string;
    source: string;
    title: string;
    content: string | null;
    summary: string | null;
    url: string | null;
    image_url: string | null;
    published_at: string;
    interactive_metadata: InteractiveMetadataJSON;
    category: string;
    tags: string[];
    is_current: boolean;
    created_at: string;
    updated_at: string;
}

export interface InteractiveMetadataJSON {
    type?: 'article' | 'definition' | 'news' | 'formula' | 'statistic';
    terms?: Array<{
        term: string;
        definition: string;
        definitionId: string;
        category: string;
        position: [number, number];
    }>;
    quiz_candidates?: Array<{
        question: string;
        options: string[];
        answer: number;
    }>;
    statistics?: Array<{
        label: string;
        value: number;
        unit: string;
    }>;
    word_count?: number;
    reading_time_minutes?: number;
}

export interface KnowledgeListResponse {
    success: boolean;
    data: KnowledgeItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface KnowledgeDetailResponse {
    success: boolean;
    data: KnowledgeItem | null;
}
