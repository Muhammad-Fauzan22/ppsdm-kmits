import { NextRequest, NextResponse } from 'next/server';
import { AssessmentEngine } from '@/lib/assessment/AssessmentEngine';
import { ASSESSMENT_QUESTIONS } from '@/lib/assessment/questions';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: ASSESSMENT_QUESTIONS
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, domain, responses } = body;

        if (!userId || !domain || !responses) {
            return NextResponse.json(
                { error: 'Missing required fields: userId, domain, responses' },
                { status: 400 }
            );
        }

        const engine = new AssessmentEngine();
        const result = await engine.conductAssessment(userId, domain as any, responses);

        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
