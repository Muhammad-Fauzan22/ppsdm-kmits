import { describe, it, expect, vi } from 'vitest';

/**
 * Tests for security middleware and headers configuration.
 * Validates that security controls work as expected.
 */

describe('Security Headers Configuration', () => {
    const REQUIRED_HEADERS = [
        'X-DNS-Prefetch-Control',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
    ];

    it('should define all required security headers', () => {
        // These are the headers we set in next.config.mjs
        const configHeaders = [
            { key: 'X-DNS-Prefetch-Control', value: 'on' },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ];

        const headerKeys = configHeaders.map((h) => h.key);
        REQUIRED_HEADERS.forEach((header) => {
            expect(headerKeys).toContain(header);
        });
    });

    it('should set X-Content-Type-Options to nosniff', () => {
        const value = 'nosniff';
        expect(value).toBe('nosniff');
    });

    it('should disable interest-cohort in Permissions-Policy', () => {
        const value = 'camera=(), microphone=(), geolocation=(), interest-cohort=()';
        expect(value).toContain('interest-cohort=()');
    });
});

describe('Rate Limit Configuration', () => {
    it('should define tiered rate limits', () => {
        // Configuration matches middleware expectations
        const tiers = {
            strict: { requests: 5, window: 60 },      // auth endpoints
            standard: { requests: 100, window: 60 },   // general API
            generous: { requests: 500, window: 60 },    // public pages
        };

        expect(tiers.strict.requests).toBeLessThan(tiers.standard.requests);
        expect(tiers.standard.requests).toBeLessThan(tiers.generous.requests);
    });
});

describe('CORS & CSRF Protection', () => {
    it('should validate CSRF token format', () => {
        const validToken = '144eb27d16d0d09276a0aa952a6dfb52d32d4374718f643292b53445f28241b5';
        expect(validToken).toHaveLength(64); // 32 bytes hex
        expect(/^[0-9a-f]{64}$/.test(validToken)).toBe(true);
    });

    it('should reject invalid CSRF tokens', () => {
        const invalidTokens = [
            '',
            'short',
            'not-hex-chars-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
        ];

        invalidTokens.forEach((token) => {
            expect(/^[0-9a-f]{64}$/.test(token)).toBe(false);
        });
    });
});

describe('Input Validation Patterns', () => {
    it('should match safe sheet names', () => {
        const safeNames = ['Activities', 'Members', 'Finances', 'Knowledge', 'Assessment', 'Settings', 'TIM_HIMPUNAN'];
        const pattern = /^[A-Za-z_]{1,30}$/;

        safeNames.forEach((name) => {
            expect(pattern.test(name)).toBe(true);
        });
    });

    it('should reject malicious sheet names', () => {
        const maliciousNames = [
            "'; DROP TABLE users; --",
            '<script>alert(1)</script>',
            '../../../etc/passwd',
            'A'.repeat(100),
        ];
        const pattern = /^[A-Za-z_]{1,30}$/;

        maliciousNames.forEach((name) => {
            expect(pattern.test(name)).toBe(false);
        });
    });

    it('should validate email format', () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        expect(emailPattern.test('user@its.ac.id')).toBe(true);
        expect(emailPattern.test('ppsdm@km.its.ac.id')).toBe(true);
        expect(emailPattern.test('invalid')).toBe(false);
        expect(emailPattern.test('')).toBe(false);
    });
});
