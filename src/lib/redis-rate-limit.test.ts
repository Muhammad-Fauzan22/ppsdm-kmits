import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRateLimit, rateLimits, RateLimitType } from './redis-rate-limit';

describe('checkRateLimit', () => {
  const testIdentifier = 'test-ip-123';

  beforeEach(() => {
    // Clear any existing rate limit data
    vi.clearAllMocks();
  });

  describe('strict rate limit', () => {
    it('should allow requests under the limit', async () => {
      const result = await checkRateLimit(testIdentifier, 'strict');
      expect(result.success).toBe(true);
      expect(result.limit).toBe(5);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should track remaining requests', async () => {
      const result1 = await checkRateLimit(testIdentifier, 'strict');
      expect(result1.remaining).toBe(4);
      
      const result2 = await checkRateLimit(testIdentifier, 'strict');
      expect(result2.remaining).toBe(3);
    });

    it('should provide reset timestamp', async () => {
      const result = await checkRateLimit(testIdentifier, 'strict');
      expect(result.reset).toBeGreaterThan(Date.now());
      expect(result.reset).toBeLessThanOrEqual(Date.now() + 5 * 60 * 1000);
    });
  });

  describe('standard rate limit', () => {
    it('should allow many requests', async () => {
      const result = await checkRateLimit(testIdentifier, 'standard');
      expect(result.success).toBe(true);
      expect(result.limit).toBe(100);
    });

    it('should decrement remaining correctly', async () => {
      const result1 = await checkRateLimit(testIdentifier, 'standard');
      const initialRemaining = result1.remaining;
      
      const result2 = await checkRateLimit(testIdentifier, 'standard');
      expect(result2.remaining).toBe(initialRemaining - 1);
    });
  });

  describe('generous rate limit', () => {
    it('should allow many requests for public routes', async () => {
      const result = await checkRateLimit(testIdentifier, 'generous');
      expect(result.success).toBe(true);
      expect(result.limit).toBe(1000);
    });
  });

  describe('admin rate limit', () => {
    it('should allow moderate requests for admin', async () => {
      const result = await checkRateLimit(testIdentifier, 'admin');
      expect(result.success).toBe(true);
      expect(result.limit).toBe(500);
    });
  });

  describe('default rate limit', () => {
    it('should use standard as default', async () => {
      const result = await checkRateLimit(testIdentifier);
      expect(result.success).toBe(true);
      expect(result.limit).toBe(100);
    });
  });

  describe('rate limit exhaustion', () => {
    it('should block requests after limit is reached', async () => {
      const identifier = 'strict-test-exhaust';
      
      // Exhaust the rate limit (5 requests for strict)
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(identifier, 'strict');
      }
      
      // Next request should be blocked
      const result = await checkRateLimit(identifier, 'strict');
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should track reset time correctly when blocked', async () => {
      const identifier = 'strict-test-reset';
      
      // Exhaust the rate limit
      for (let i = 0; i < 5; i++) {
        await checkRateLimit(identifier, 'strict');
      }
      
      const blockedResult = await checkRateLimit(identifier, 'strict');
      expect(blockedResult.success).toBe(false);
      expect(blockedResult.reset).toBeGreaterThan(Date.now());
    });
  });

  describe('different identifiers', () => {
    it('should track different identifiers separately', async () => {
      const id1 = 'user-1';
      const id2 = 'user-2';
      
      // Use up some of user 1's limit
      await checkRateLimit(id1, 'strict');
      await checkRateLimit(id1, 'strict');
      
      const result1 = await checkRateLimit(id1, 'strict');
      const result2 = await checkRateLimit(id2, 'strict');
      
      expect(result1.remaining).toBe(3); // 5 - 2 = 3
      expect(result2.remaining).toBe(4); // Fresh start = 4 (after first request)
    });
  });

  describe('rate limit types', () => {
    const types: RateLimitType[] = ['strict', 'standard', 'generous', 'admin'];
    
    types.forEach((type) => {
      it(`should have rateLimits.${type} defined`, () => {
        expect(rateLimits[type]).toBeDefined();
      });

      it(`should work with ${type} rate limit type`, async () => {
        const result = await checkRateLimit(`test-${type}`, type);
        expect(result).toHaveProperty('success');
        expect(result).toHaveProperty('limit');
        expect(result).toHaveProperty('remaining');
        expect(result).toHaveProperty('reset');
        expect(typeof result.success).toBe('boolean');
        expect(typeof result.limit).toBe('number');
        expect(typeof result.remaining).toBe('number');
        expect(typeof result.reset).toBe('number');
      });
    });
  });
});