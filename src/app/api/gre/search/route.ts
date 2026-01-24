import { NextRequest, NextResponse } from 'next/server';
import { ResourceService } from '@/lib/gre/services/resource-service';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Missing query parameter "q"' }, { status: 400 });
    }

    try {
        const service = new ResourceService();
        const results = await service.searchResources(query);

        return NextResponse.json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
