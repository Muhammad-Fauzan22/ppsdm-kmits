
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { calculatePhysicalHealthScore } from '@/lib/assessment/physical-health-logic';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { responses, startTime } = body;

        if (!responses || typeof responses !== 'object') {
            return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 });
        }

        // 1. Calculate Scores
        const result = calculatePhysicalHealthScore(responses);

        // 2. Start Transaction (Supabase does not support explicit multi-table transactions in client easily without RPC, 
        // using sequential inserts with rollback check or trusting client flow. For simplicity here: sequential).
        // Ideally, use an RPC for atomicity.
        // Insert Assessment Header
        const { data: assessment, error: assessmentError } = await supabase
            .from('physical_health_assessments')
            .insert({
                user_id: user.id,
                total_score: result.totalScore,
                percentile: result.percentile,
                health_category: result.category,
                validity_index: 100.00, // Placeholder
                response_time_seconds: startTime ? Math.floor((Date.now() - startTime) / 1000) : null
            })
            .select()
            .single();

        if (assessmentError) {
            return NextResponse.json({ error: 'Failed to save assessment' }, { status: 500 });
        }

        const assessmentId = assessment.assessment_id;

        // Insert Responses
        const responseInserts = Object.entries(responses).map(([qId, val]) => ({
            assessment_id: assessmentId,
            question_id: qId,
            response_value: Number(val),
            confidence_level: 5 // Default
        }));

        const { error: responsesError } = await supabase
            .from('physical_health_responses')
            .insert(responseInserts);

        if (responsesError) {
            console.error('Error saving responses:', responsesError);
            return NextResponse.json({ error: 'Failed to save responses' }, { status: 500 });
        }

        // Insert Subdomains
        const subdomainInserts = Object.entries(result.subdomainScores).map(([name, score]) => ({
            assessment_id: assessmentId,
            subdomain_name: name,
            subdomain_score: score
        }));

        const { error: subdomainsError } = await supabase
            .from('physical_health_subdomains')
            .insert(subdomainInserts);

        if (subdomainsError) {
            console.error('Error saving subdomains:', subdomainsError);
        }

        // Insert Risk Flags
        if (result.riskFlags.length > 0) {
            const flagInserts = result.riskFlags.map(flag => ({
                assessment_id: assessmentId,
                risk_code: flag.code,
                severity: flag.severity,
                flag_message: flag.message,
                recommendation: flag.recommendation
            }));

            const { error: flagsError } = await supabase
                .from('health_risk_flags')
                .insert(flagInserts);

            if (flagsError) {
                console.error('Error saving risk flags:', flagsError);
            }
        }

        return NextResponse.json({ success: true, assessmentId, result });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
