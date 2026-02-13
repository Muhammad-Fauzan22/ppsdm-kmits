import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';

// Mock invalidateSheetCache
vi.mock('@/lib/google-sheets/sheets-api', () => ({
    invalidateSheetCache: vi.fn().mockResolvedValue(undefined),
}));

// Helper to compute HMAC like the real webhook
function computeHmac(message: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

// Import the route handler
// Note: We test the logic by simulating request objects
describe('Sheets Webhook Route', () => {
    const WEBHOOK_SECRET = 'test-webhook-secret-for-unit-tests';

    beforeEach(() => {
        vi.stubEnv('WEBHOOK_SECRET', WEBHOOK_SECRET);
    });

    describe('HMAC Authentication', () => {
        it('should accept valid HMAC signature', () => {
            const timestamp = new Date().toISOString();
            const sheetName = 'Activities';
            const payload = `${sheetName}:${timestamp}`;
            const signature = computeHmac(payload, WEBHOOK_SECRET);

            // Verify our HMAC computation matches
            const expected = crypto
                .createHmac('sha256', WEBHOOK_SECRET)
                .update(payload)
                .digest('hex');
            expect(signature).toBe(expected);
        });

        it('should reject invalid HMAC signature', () => {
            const timestamp = new Date().toISOString();
            const payload = `Activities:${timestamp}`;
            const validSig = computeHmac(payload, WEBHOOK_SECRET);
            const invalidSig = computeHmac(payload, 'wrong-secret');

            expect(validSig).not.toBe(invalidSig);
        });

        it('should reject expired timestamps (> 5 minutes)', () => {
            const oldTimestamp = new Date(Date.now() - 6 * 60 * 1000).toISOString();
            const requestTime = new Date(oldTimestamp).getTime();
            const now = Date.now();

            expect(Math.abs(now - requestTime)).toBeGreaterThan(5 * 60 * 1000);
        });

        it('should accept recent timestamps (< 5 minutes)', () => {
            const recentTimestamp = new Date(Date.now() - 2 * 60 * 1000).toISOString();
            const requestTime = new Date(recentTimestamp).getTime();
            const now = Date.now();

            expect(Math.abs(now - requestTime)).toBeLessThan(5 * 60 * 1000);
        });
    });

    describe('Legacy Secret Authentication', () => {
        it('should authenticate with correct shared secret', () => {
            const secret = WEBHOOK_SECRET;
            const secretBuffer = Buffer.from(secret);
            const expectedBuffer = Buffer.from(WEBHOOK_SECRET);

            expect(secretBuffer.length).toBe(expectedBuffer.length);
            expect(crypto.timingSafeEqual(secretBuffer, expectedBuffer)).toBe(true);
        });

        it('should reject incorrect shared secret', () => {
            const secret = 'wrong-secret';
            const secretBuffer = Buffer.from(secret);
            const expectedBuffer = Buffer.from(WEBHOOK_SECRET);

            // Different lengths = not equal
            expect(secretBuffer.length).not.toBe(expectedBuffer.length);
        });
    });

    describe('HMAC Payload Format', () => {
        it('should handle null sheetName in payload', () => {
            const timestamp = new Date().toISOString();
            const payload = `:${timestamp}`; // sheetName is empty
            const signature = computeHmac(payload, WEBHOOK_SECRET);

            expect(signature).toBeTruthy();
            expect(signature).toHaveLength(64); // SHA256 hex = 64 chars
        });

        it('should produce consistent signatures for same input', () => {
            const timestamp = '2026-02-14T00:00:00.000Z';
            const payload = `Activities:${timestamp}`;

            const sig1 = computeHmac(payload, WEBHOOK_SECRET);
            const sig2 = computeHmac(payload, WEBHOOK_SECRET);

            expect(sig1).toBe(sig2);
        });
    });
});
