import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { job_id, status, folder_link, confidence_score, evidence_level, vr_suitability_score } = body;

        console.log(`Callback received for Job: ${job_id}, Status: ${status}`);

        // Update job in Supabase
        const { error } = await supabase
            .from('processing_jobs')
            .update({
                status: status,
                folder_link: folder_link,
                confidence_score: confidence_score,
                evidence_level: evidence_level,
                vr_suitability_score: vr_suitability_score,
                completed_at: status === 'completed' || status === 'success' ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            })
            .eq('job_id', job_id);

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Job updated successfully' });

    } catch (error: any) {
        console.error('Callback error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
