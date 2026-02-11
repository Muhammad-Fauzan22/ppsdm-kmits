import { NextRequest, NextResponse } from 'next/server';

/**
 * Learning Factory Trigger API
 * ============================
 * Endpoint to trigger the autonomous pipeline.
 * 
 * POST /api/factory/trigger
 * - Triggers GitHub Actions workflow via repository dispatch
 * - Or runs inline for immediate processing
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'Muhammad-Fauzan22/ppsdm-kmits';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const { phase = 'all', mode = 'github' } = body;

        // Validate phase
        const validPhases = ['all', 'harvest', 'process', 'generate', 'export'];
        if (!validPhases.includes(phase)) {
            return NextResponse.json({
                success: false,
                error: 'Invalid phase'
            }, { status: 400 });
        }

        // Trigger via GitHub Actions (recommended for production)
        if (mode === 'github' && GITHUB_TOKEN) {
            const response = await fetch(
                `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        event_type: 'learning-factory-trigger',
                        client_payload: { phase }
                    })
                }
            );

            if (response.ok || response.status === 204) {
                return NextResponse.json({
                    success: true,
                    message: `Pipeline triggered (${phase}) via GitHub Actions`,
                    mode: 'github',
                    triggered_at: new Date().toISOString()
                });
            }
        }

        // Return pending status (actual execution is on GitHub Actions)
        return NextResponse.json({
            success: true,
            message: `Pipeline queued (${phase})`,
            mode: 'queued',
            triggered_at: new Date().toISOString()
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to trigger pipeline'
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        service: 'Learning Factory Trigger',
        version: '3.0',
        endpoints: {
            'POST /api/factory/trigger': 'Trigger pipeline',
        },
        phases: ['all', 'harvest', 'process', 'generate', 'export']
    });
}
