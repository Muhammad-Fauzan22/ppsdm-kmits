/**
 * Simple rate limiting utility
 * This is a placeholder implementation for demonstration purposes
 */

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
  },
};

// In-memory store for rate limiting (not production grade)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple rate limiter for login attempts
 */
export function authRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const config = RATE_LIMIT_CONFIG.login;
  const now = Date.now();
  const resetTime = now + config.windowMs;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    entry = { count: 0, resetTime };
    rateLimitStore.set(ip, entry);
  }

  // Check if rate limit exceeded
  if (entry.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count and return remaining attempts
  entry.count++;
  
  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Middleware-like function for API routes
 */
export async function rateLimitMiddleware(req: Request): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}> {
  // Get IP address from request
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  const result = authRateLimit(ip);
  
  return {
    ...result,
    retryAfter: result.allowed ? undefined : Math.ceil((result.resetTime - Date.now()) / 1000),
  };
}