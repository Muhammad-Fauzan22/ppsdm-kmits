import { NextResponse } from 'next/server';
import { invalidateSheetCache } from '@/lib/google-sheets/sheets-api';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Webhook endpoint called by Google Apps Script when a sheet is edited.
 * POST /api/sheets/webhook
 * Body: { sheetName?: string, secret?: string, timestamp?: string, signature?: string }
 *
 * Security:
 *  - HMAC-SHA256 signature verification (preferred)
 *  - Falls back to shared-secret comparison (legacy)
 *  - Timestamp validation to prevent replay attacks
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sheetName, secret, timestamp, signature } = body;

        const webhookSecret = process.env.WEBHOOK_SECRET;
        if (!webhookSecret) {
            console.error('[webhook] WEBHOOK_SECRET not configured');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // --- Authentication ---

        let authenticated = false;

        // Method 1: HMAC signature verification (preferred)
        if (signature && timestamp) {
            // Replay protection: reject requests older than 5 minutes
            const requestTime = new Date(timestamp).getTime();
            const now = Date.now();
            if (isNaN(requestTime) || Math.abs(now - requestTime) > 5 * 60 * 1000) {
                console.warn('[webhook] Timestamp too old or invalid', { timestamp });
                return NextResponse.json(
                    { success: false, error: 'Request expired' },
                    { status: 401 }
                );
            }

            // Compute expected HMAC
            const payload = `${sheetName || ''}:${timestamp}`;
            const expectedSignature = crypto
                .createHmac('sha256', webhookSecret)
                .update(payload)
                .digest('hex');

            // Timing-safe comparison
            try {
                const sigBuffer = Buffer.from(signature, 'hex');
                const expectedBuffer = Buffer.from(expectedSignature, 'hex');
                if (sigBuffer.length === expectedBuffer.length &&
                    crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
                    authenticated = true;
                }
            } catch {
                // Buffer creation failed (invalid hex), auth fails
            }
        }

        // Method 2: Legacy shared-secret (fallback for backwards compatibility)
        if (!authenticated && secret) {
            try {
                const secretBuffer = Buffer.from(secret);
                const expectedBuffer = Buffer.from(webhookSecret);
                if (secretBuffer.length === expectedBuffer.length &&
                    crypto.timingSafeEqual(secretBuffer, expectedBuffer)) {
                    authenticated = true;
                }
            } catch {
                // Buffer comparison failed
            }
        }

        if (!authenticated) {
            console.warn('[webhook] Unauthorized access attempt', {
                ip: request.headers.get('x-forwarded-for') || 'unknown',
                timestamp: new Date().toISOString(),
            });
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // --- Cache Invalidation ---

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
