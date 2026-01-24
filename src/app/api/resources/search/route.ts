
import { NextRequest, NextResponse } from 'next/server';
import { GlobalResourceEngine } from '@/lib/resources/GlobalResourceEngine';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || undefined;
        const domain = searchParams.get('domain') || undefined;
        const type = searchParams.get('type') || undefined;

        const engine = new GlobalResourceEngine();
        const resources = await engine.findResources({
            query,
            domain,
            type,
            minQuality: 0.7 // Default filter
        });

        return NextResponse.json({ success: true, count: resources?.length, data: resources });

    } catch (error: any) {
        console.error('Resource Search API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
