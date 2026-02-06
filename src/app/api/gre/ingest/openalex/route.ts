import { NextRequest, NextResponse } from 'next/server';
import { OpenAlexCrawler } from '@/lib/gre/crawlers/openalex-crawler';
import { ResourceService } from '@/lib/gre/services/resource-service';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get('topic') || 'artificial intelligence';

    try {
        const crawler = new OpenAlexCrawler();
        const service = new ResourceService();

        // 1. Crawl OpenAlex
        const { resources, errors } = await crawler.crawl(topic);

        // 2. Ingest
        const result = await service.ingestResources(resources);

        if (result.error) {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: {
                topic,
                crawled_count: resources.length,
                ingested_count: result.data?.length || 0,
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
