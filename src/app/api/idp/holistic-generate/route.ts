
import { NextRequest, NextResponse } from 'next/server';
import { HolisticIDPGenerator } from '@/lib/idp/HolisticIDPGenerator';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, visionStatement, coreValues, passions, strengths } = body;

        // Basic validation
        if (!userId || !visionStatement) {
            return NextResponse.json(
                { error: 'Missing required fields (userId, visionStatement)' },
                { status: 400 }
            );
        }

        const generator = new HolisticIDPGenerator();
        const idp = await generator.generateCompleteIDP({
            userId,
            visionStatement,
            coreValues: coreValues || [],
            passions: passions || [],
            strengths: strengths || []
        });

        return NextResponse.json({ success: true, data: idp });

    } catch (error: any) {
        console.error('Holistic IDP API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
