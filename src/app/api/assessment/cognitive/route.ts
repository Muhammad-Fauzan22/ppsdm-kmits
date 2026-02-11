import { NextRequest, NextResponse } from 'next/server';
import { calculateCognitiveScores, CognitiveResponse } from '@/lib/assessment/cognitiveScoring';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { responses, metadata } = body as { responses: CognitiveResponse, metadata?: any };

        if (!responses || Object.keys(responses).length < 8) {
            return NextResponse.json(
                { error: 'Incomplete responses. 8 items required.' },
                { status: 400 }
            );
        }

        const scores = calculateCognitiveScores(responses);

        // In a real app, we would save to DB here
        // await db.insert(scores).into('cognitive_assessments');

        return NextResponse.json({
            success: true,
            assessment_id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            scores
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
