
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
                total_score: result.total_score,
                percentile: result.percentile,
                health_category: result.health_category.category,
                validity_index: 100.00, // Placeholder
                response_time_seconds: startTime ? Math.floor((Date.now() - startTime) / 1000) : null
            })
            .select()
            .single();

        if (assessmentError) {
            console.error('Assessment Insert Error:', assessmentError);
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

        if (responsesError) console.error('Responses Insert Error:', responsesError);

        // Insert Subdomains
        const subdomainInserts = Object.entries(result.subdomain_scores).map(([name, score]) => ({
            assessment_id: assessmentId,
            subdomain_name: name,
            subdomain_score: score
        }));

        const { error: subdomainsError } = await supabase
            .from('physical_health_subdomains')
            .insert(subdomainInserts);

        if (subdomainsError) console.error('Subdomains Insert Error:', subdomainsError);

        // Insert Risk Flags
        if (result.risk_flags.length > 0) {
            const flagInserts = result.risk_flags.map(flag => ({
                assessment_id: assessmentId,
                risk_code: flag.code,
                severity: flag.severity,
                flag_message: flag.message,
                recommendation: flag.recommendation
            }));

            const { error: flagsError } = await supabase
                .from('health_risk_flags')
                .insert(flagInserts);

            if (flagsError) console.error('Flags Insert Error:', flagsError);
        }

        return NextResponse.json({ success: true, assessmentId, result });

    } catch (error) {
        console.error('Server Logic Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
