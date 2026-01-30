
import { createClient } from '@/lib/supabase/server';

// Types (to be moved to types definition file later if needed)
export interface FinancialResponse {
    itemId: string;
    response: string | number; // 'A', 'B', 'C', or 1-5
    isCorrect?: boolean; // For knowledge items
}

export interface AssessmentResult {
    knowledgeScore: number;
    behaviorScore: number;
    attitudeScore: number;
    compositeScore: number;
    intelligenceLevel: string;
}

// Knowledge Scoring (Simplified IRT - 2PL Model approximation or weighted sum)
// Since we don't have the exact Python parameters yet, we'll use a rigorous weighted scoring
// which is often sufficient for initial release.
export function calculateKnowledgeScore(responses: FinancialResponse[]): number {
    if (!responses.length) return 0;

    // In a real 2PL IRT model, we would look up difficulty (b) and discrimination (a) per item.
    // Here we assume standard weighting for correct answers.
    const totalItems = responses.length;
    const correctCount = responses.filter(r => r.isCorrect).length;

    // Scale to 0-100
    return (correctCount / totalItems) * 100;
}

// Behavior & Attitude Scoring (Likert Scale 1-5)
export function calculateLikertScore(responses: FinancialResponse[]): number {
    if (!responses.length) return 0;

    let totalScore = 0;
    let maxPossibleScore = responses.length * 5;

    responses.forEach(r => {
        // Ensure numeric value
        const val = typeof r.response === 'number' ? r.response : parseInt(r.response as string) || 0;
        totalScore += val;
    });

    // Scale to 0-100
    return (totalScore / maxPossibleScore) * 100;
}

export function determineIntelligenceLevel(compositeScore: number): string {
    if (compositeScore >= 85) return 'Advanced';
    if (compositeScore >= 70) return 'Proficient';
    if (compositeScore >= 55) return 'Developing';
    if (compositeScore >= 40) return 'Novice';
    return 'Needs Improvement';
}

export function calculateCompositeScore(knowledge: number, behavior: number, attitude: number): number {
    // Weighting: 40% Behavior (Action), 30% Knowledge, 30% Attitude
    return (knowledge * 0.3) + (behavior * 0.4) + (attitude * 0.3);
}

export async function processFinancialAssessment(userId: string, responses: {
    knowledge: FinancialResponse[],
    behavior: FinancialResponse[],
    attitude: FinancialResponse[]
}) {
    // 1. Calculate Scores
    const knowledgeScore = calculateKnowledgeScore(responses.knowledge);
    const behaviorScore = calculateLikertScore(responses.behavior);
    const attitudeScore = calculateLikertScore(responses.attitude);

    const compositeScore = calculateCompositeScore(knowledgeScore, behaviorScore, attitudeScore);
    const level = determineIntelligenceLevel(compositeScore);

    // 2. Save to Database (Mocking Supabase call for now, meant to be used in Server Action)
    // const supabase = createClient();
    // await supabase.from('financial_assessment_scores').insert({ ... });

    return {
        knowledgeScore,
        behaviorScore,
        attitudeScore,
        compositeScore,
        level
    };
}
