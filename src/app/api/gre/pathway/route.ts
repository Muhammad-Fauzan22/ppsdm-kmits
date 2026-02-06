import { NextRequest, NextResponse } from 'next/server';
import { PathwayComposer } from '@/lib/gre/services/pathway-service';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get('topic');
    const level = searchParams.get('level') || 'beginner';

    if (!topic) {
        return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
    }

    try {
        const composer = new PathwayComposer();
        const pathway = await composer.composePath(topic, level);

        return NextResponse.json({
            success: true,
            data: pathway
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
