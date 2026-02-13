import { NextResponse } from 'next/server';
import { invalidateSheetCache } from '@/lib/google-sheets/sheets-api';

export const dynamic = 'force-dynamic';

/**
 * Webhook endpoint called by Google Apps Script when a sheet is edited.
 * POST /api/sheets/webhook
 * Body: { sheetName?: string, secret?: string }
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sheetName, secret } = body;

        // Simple shared-secret auth
        const expectedSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret-key';
        if (secret !== expectedSecret) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await invalidateSheetCache(sheetName || undefined);

        return NextResponse.json({
            success: true,
            message: `Cache invalidated for ${sheetName || 'all sheets'}`,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('[API] /api/sheets/webhook error:', error);
        return NextResponse.json(
            { success: false, error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}
