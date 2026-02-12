import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Verify admin authentication
 * Returns admin user or throws error
 */
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();

  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error('Unauthorized: No valid session');
  }

  // Check if user has admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('id', session.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Unauthorized: User profile not found');
  }

  if (profile.role !== 'admin') {
    throw new Error('Forbidden: Admin access required');
  }

  return {
    id: session.user.id,
    email: profile.email || session.user.email!,
    role: profile.role
  };
}

/**
 * Wrapper for admin API routes
 */
export function withAdminAuth(
  handler: (req: NextRequest, admin: AdminUser) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      const admin = await requireAdmin();

      // Log admin action for audit
      logger.audit('Admin action', { adminId: admin.id, email: admin.email, ip: req.headers.get('x-forwarded-for') || 'unknown' });

      return await handler(req, admin);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized';
      const status = message.includes('Forbidden') ? 403 : 401;

      // Log failed attempt
      logger.warn('[SECURITY] Failed admin access attempt', { ip: req.headers.get('x-forwarded-for') || 'unknown' });

      return NextResponse.json(
        { error: message },
        { status }
      );
    }
  };
}

/**
 * Check if current user is admin (for use in non-admin routes that need admin check)
 */
export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
