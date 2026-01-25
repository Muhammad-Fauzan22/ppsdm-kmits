import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileId, fileName, fileUrl, spreadsheetId, jobId } = body;

        console.log(`📥 Received processing request: ${fileName}`);

        // Map jobId to webhookId (or just use jobId as webhook identifier)
        const webhookId = jobId || body.webhookId;

        // Simpan ke Supabase langsung (bypass processing untuk testing)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hyszrracdysqgyfpwflu.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jdFxbjWbuitaWjblDEnKbA_04MrSCjr';

        // Use fetch directly for Edge Runtime compatibility
        const response = await fetch(`${supabaseUrl}/rest/v1/processed_books`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                file_id: fileId,
                file_name: fileName,
                original_url: fileUrl || `https://drive.google.com/uc?export=download&id=${fileId}`, // Use provided URL or fallback
                spreadsheet_id: spreadsheetId,
                webhook_id: webhookId,
                status: 'QUEUED',
                created_at: new Date().toISOString(),
                processing_time: 0
            })
        });

        if (!response.ok) {
            console.error('Supabase error:', await response.text());
            // Don't fail the request, just log it
        }

        return NextResponse.json({
            success: true,
            message: `File ${fileName} added to processing queue`,
            fileId,
            timestamp: new Date().toISOString(),
            note: 'AI processing will happen in background'
        }, { headers: corsHeaders });

    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500, headers: corsHeaders });
    }
}

export async function GET() {
    return NextResponse.json({
        status: 'BUKA BUKU API is running',
        version: '1.0.0',
        endpoints: {
            POST: '/api/process - Process a book',
            GET: '/api/process - API status'
        },
        instructions: 'Upload PDF to Google Drive folder to trigger processing'
    }, { headers: corsHeaders });
}
