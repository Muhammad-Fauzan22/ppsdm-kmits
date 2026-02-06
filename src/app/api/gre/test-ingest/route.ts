import { NextResponse } from 'next/server';
import { MockCrawler } from '@/lib/gre/crawlers/mock-crawler';
import { ResourceService } from '@/lib/gre/services/resource-service';

export async function GET() {
    try {
        const crawler = new MockCrawler();
        const service = new ResourceService();

        // 1. Crawl
        const { resources, errors } = await crawler.crawl();

        // 2. Ingest
        const result = await service.ingestResources(resources);

        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                crawled_count: resources.length,
                ingested_data: result.data,
                errors: errors
            }
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
