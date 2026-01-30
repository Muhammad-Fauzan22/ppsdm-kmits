
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { processFinancialAssessment } from "@/lib/assessment/financial-intelligence-logic";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Auth Check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Body
        const body = await req.json();
        const { knowledgeResponses, behaviorResponses, attitudeResponses, startTime, endTime } = body;

        if (!knowledgeResponses || !behaviorResponses || !attitudeResponses) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 3. Create Assessment Record
        const duration = (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000;

        const { data: assessmentData, error: assessmentError } = await supabase
            .from('financial_assessments')
            .insert({
                user_id: user.id,
                total_duration_seconds: duration,
                assessment_version: '2.1'
            })
            .select()
            .single();

        if (assessmentError) {
            console.error("Failed to create assessment", assessmentError);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        const assessmentId = assessmentData.assessment_id;

        // 4. Save Detailed Responses (Parallel)
        const savePromises = [];

        // Knowledge
        const kData = knowledgeResponses.map((r: any) => ({
            assessment_id: assessmentId,
            item_id: r.itemId,
            response: r.response,
            is_correct: r.isCorrect // Ensure checking is done either client side or verified here. Ideally verified here.
        }));
        savePromises.push(supabase.from('financial_knowledge_responses').insert(kData));

        // Behavior
        const bData = behaviorResponses.map((r: any) => ({
            assessment_id: assessmentId,
            item_id: r.itemId,
            response_value: r.response
        }));
        savePromises.push(supabase.from('financial_behavior_responses').insert(bData));

        // Attitude
        const aData = attitudeResponses.map((r: any) => ({
            assessment_id: assessmentId,
            item_id: r.itemId,
            response_value: r.response
        }));
        savePromises.push(supabase.from('financial_attitude_responses').insert(aData));

        await Promise.all(savePromises);

        // 5. Calculate Scores
        const results = await processFinancialAssessment(user.id, {
            knowledge: knowledgeResponses,
            behavior: behaviorResponses,
            attitude: attitudeResponses
        });

        // 6. Save Scores
        const { error: scoreError } = await supabase.from('financial_assessment_scores').insert({
            assessment_id: assessmentId,
            knowledge_score: results.knowledgeScore,
            behavior_score: results.behaviorScore,
            attitude_score: results.attitudeScore,
            composite_score: results.compositeScore,
            intelligence_level: results.level
        });

        if (scoreError) {
            console.error("Failed to save scores", scoreError);
            // Verify if we should rollback or just return error (Assessment is saved, scores failed)
        }

        // 7. Return Results
        return NextResponse.json({
            success: true,
            assessmentId,
            results
        });

    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
