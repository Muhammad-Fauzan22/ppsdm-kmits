/**
 * HTTP-Only Cookie Authentication System
 * Replaces localStorage-based auth for better security
 */

import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')
);

const COOKIE_NAME = 'ppsdm_session';
const REFRESH_COOKIE_NAME = 'ppsdm_refresh';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Create JWT token
 */
export async function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Create refresh token
 */
export async function createRefreshToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set authentication cookies (httpOnly)
 */
export async function setAuthCookies(token: string, refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  
  // Set main session cookie (httpOnly, secure)
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
  
  // Set refresh token cookie (httpOnly, secure)
  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

/**
 * Get session from cookies
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value || null;
}

/**
 * Clear authentication cookies
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    return null;
  }
  
  const payload = await verifyToken(refreshToken);
  
  if (!payload) {
    await clearAuthCookies();
    return null;
  }
  
  // Create new access token
  const newToken = await createToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });
  
  // Update cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });
  
  return newToken;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Authentication required');
  }
  
  return session;
}

/**
 * Get current user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}

/**
 * Get authenticated user from request
 * For use in API routes
 */
export async function getAuthenticatedUser(request?: Request): Promise<JWTPayload | null> {
  const session = await getSession();
  return session;
}

/**
 * Set authentication cookies with options
 * Alternative signature for object-based tokens
 */
export async function setAuthCookiesWithOptions(
  response: Response,
  options: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }
): Promise<void> {
  await setAuthCookies(options.accessToken, options.refreshToken);
}
