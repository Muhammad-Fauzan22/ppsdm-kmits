
import { NextRequest, NextResponse } from 'next/server';
import { IDPGenerator } from '@/lib/idp/IDPGenerator';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, vision, timeframe } = body;

        if (!userId || !vision) {
            return NextResponse.json(
                { error: 'Missing required fields: userId, vision' },
                { status: 400 }
            );
        }

        const generator = new IDPGenerator();
        const idp = await generator.generateIDP({
            userId,
            visionStatement: vision,
            timeframe: timeframe || '1_year'
        });

        return NextResponse.json({ success: true, data: idp });

    } catch (error: any) {
        console.error('IDP Generation API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
