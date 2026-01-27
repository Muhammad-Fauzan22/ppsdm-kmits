import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize clients
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Support both format for flexibility (direct or from GAS)
        const fileId = body.fileId || body.file_id;
        const fileName = body.fileName || body.file_name;
        const userEmail = body.userEmail || body.user_email || 'system@automation.com'; // Default if not provided

        // Create job record in Supabase
        const jobId = crypto.randomUUID();
        const { error: insertError } = await supabase
            .from('processing_jobs')
            .insert({
                job_id: jobId,
                file_name: fileName,
                file_id: fileId,
                status: 'pending',
                user_email: userEmail,
                created_at: new Date().toISOString()
            });

        if (insertError) throw insertError;

        // Trigger Stepper workflow via webhook
        const stepperWebhookUrl = 'https://hook.stepper.io/hook/b78251872674ee3bfba9bea2974781d4434d2e44228fde7650b8740553a020b6';

        // Construct the payload exactly as the User specified for 7-Layer Pipeline
        const webhookPayload = {
            job_id: jobId,
            file: {
                name: fileName,
                download_url: `https://drive.google.com/file/d/${fileId}/view`
            },
            timestamp: new Date().toISOString(),
            notification: {
                email: userEmail
            }
        };

        console.log(`🚀 Triggering Stepper Workflow: ${jobId}`);

        const stepperResponse = await fetch(stepperWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
        });

        let stepperData = {};
        if (stepperResponse.ok) {
            try {
                stepperData = await stepperResponse.json();
            } catch (e) {
                console.warn("Stepper response not JSON", e);
            }
        } else {
            console.error(`Stepper webhook failed: ${stepperResponse.status} ${stepperResponse.statusText}`);
            // We don't throw here to ensure we return the JobID to the client, but marking it.
            // Or should we throw? User code throws. Let's throw to be consistent.
            throw new Error(`Stepper webhook failed: ${stepperResponse.statusText}`);
        }

        // Update job status
        await supabase
            .from('processing_jobs')
            .update({ status: 'processing', stepper_response: stepperData })
            .eq('job_id', jobId);

        return NextResponse.json({
            success: true,
            job_id: jobId,
            message: 'Book processing started via 7-Layer Pipeline',
            estimated_completion: '8-12 minutes',
            stepper_response: stepperData
        });

    } catch (error: any) {
        console.error('Processing error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
