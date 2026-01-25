
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

    } catch (error: unknown) {
        console.error('IDP Generation API Error:', error);

        let errorMessage = 'Internal Server Error';
        if (error instanceof Error) {
            // Only expose message if safe or generic enough, otherwise default.
            // For now we assume error.message is somewhat safe but in PROD better to sanitize.
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: process.env.NODE_ENV === 'development' ? errorMessage : 'Something went wrong processing your request.' },
            { status: 500 }
        );
    }
}
