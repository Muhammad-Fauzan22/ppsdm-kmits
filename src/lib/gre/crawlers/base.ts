import { GreResource } from '../types';

export interface CrawlResult {
    resources: Partial<GreResource>[];
    errors: string[];
}

export interface ICrawler {
    sourceName: string;
    crawl(query?: string): Promise<CrawlResult>;
    validate(resource: Partial<GreResource>): boolean;
}

export abstract class BaseCrawler implements ICrawler {
    abstract sourceName: string;

    /**
     * Main crawl method to be implemented by specific crawlers
     * @param query Optional search query to filter resources
     */
    abstract crawl(query?: string): Promise<CrawlResult>;

    /**
     * Basic validation to ensure minimum required fields are present
     */
    validate(resource: Partial<GreResource>): boolean {
        if (!resource.title || !resource.url || !resource.type) {
            return false;
        }
        return true;
    }

    protected normalizeUrl(url: string): string {
        try {
            const urlObj = new URL(url);
            return urlObj.href; // Standard normalization
        } catch (e) {
            return url;
        }
    }

    protected handleError(error: unknown): string {
        if (error instanceof Error) return error.message;
        return String(error);
    }
}
