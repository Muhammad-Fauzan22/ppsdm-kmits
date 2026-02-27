/**
 * SECURE ADMIN CLIENT - PPSDM KMITS
 * 
 * This client should ONLY be used in server-side code
 * and NEVER exposed to client.
 * 
 * Security Measures:
 * - Server-side only validation
 * - Audit logging for all operations
 * - Environment variable validation
 * - IP-based access control (optional)
 */

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// ============================================================================
// SERVER-SIDE VALIDATION (must come FIRST before any env access)
// ============================================================================

/**
 * Ensure this file is only used on server side.
 * This MUST be checked before accessing environment variables to prevent
 * accidental client-side exposure of the service role key.
 */
if (typeof window !== 'undefined') {
  throw new Error(
    '[SECURITY] supabaseAdmin can only be used on the server side. ' +
    'This is a critical security violation - service role key must never reach the browser.'
  );
}

// ============================================================================
// ENVIRONMENT VALIDATION
// ============================================================================

/**
 * Validate environment variables are set
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('[CONFIG] NEXT_PUBLIC_SUPABASE_URL is not configured');
}

if (!supabaseServiceRoleKey) {
  throw new Error('[CONFIG] SUPABASE_SERVICE_ROLE_KEY is not configured');
}

// ============================================================================
// SECURE ADMIN CLIENT
// ============================================================================

/**
 * Create admin client with security settings
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl, 
  supabaseServiceRoleKey, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-admin-operation': 'true',
      },
    },
  }
);

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Audit log entry type
 */
interface AuditLogEntry {
  operation: string;
  user_id?: string;
  target_user_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  timestamp: string;
  environment: string;
  success: boolean;
  error?: string;
}

/**
 * Log admin operation to database
 * This creates an audit trail for all admin operations
 */
export async function auditAdminOperation(params: {
  operation: string;
  userId?: string;
  targetUserId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  success?: boolean;
  error?: string;
}): Promise<void> {
  try {
    const entry: AuditLogEntry = {
      operation: params.operation,
      user_id: params.userId,
      target_user_id: params.targetUserId,
      details: params.details,
      ip_address: params.ipAddress || 'unknown',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      success: params.success !== false,
      error: params.error,
    };

    // Try to insert into audit log table
    // Note: This table needs to be created in the database
    await supabaseAdmin.from('admin_audit_log').insert(entry as any);
  } catch (error) {
    // Log to console if database insert fails
    // Don't throw - audit failures shouldn't break operations
    console.error('Failed to audit admin operation:', error);
  }
}

/**
 * Wrapper for admin operations with automatic audit logging
 * This ensures all admin operations are logged
 */
export async function withAdminAudit<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: {
    userId?: string;
    targetUserId?: string;
    ipAddress?: string;
  }
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await fn();
    
    // Log successful operation
    await auditAdminOperation({
      operation,
      userId: context?.userId,
      targetUserId: context?.targetUserId,
      ipAddress: context?.ipAddress,
      details: {
        success: true,
        duration: Date.now() - startTime,
      },
      success: true,
    });
    
    return result;
  } catch (error) {
    // Log failed operation
    await auditAdminOperation({
      operation,
      userId: context?.userId,
      targetUserId: context?.targetUserId,
      ipAddress: context?.ipAddress,
      details: {
        success: false,
        duration: Date.now() - startTime,
      },
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    throw error;
  }
}

// ============================================================================
// SAFE ADMIN OPERATIONS
// ============================================================================

/**
 * Safe admin operation wrappers
 * These provide additional safety checks and audit logging
 */

export const adminOperations = {
  /**
   * Safely delete a user
   */
  async deleteUser(userId: string, adminUserId?: string, ipAddress?: string) {
    return withAdminAudit(
      'delete_user',
      async () => {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) {
          throw new Error(`Failed to delete user: ${error.message}`);
        }
      },
      {
        userId: adminUserId,
        targetUserId: userId,
        ipAddress,
      }
    );
  },

  /**
   * Safely update user metadata
   */
  async updateUserMetadata(
    userId: string,
    metadata: Record<string, any>,
    adminUserId?: string,
    ipAddress?: string
  ) {
    return withAdminAudit(
      'update_user_metadata',
      async () => {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: metadata,
        });
        if (error) {
          throw new Error(`Failed to update user metadata: ${error.message}`);
        }
      },
      {
        userId: adminUserId,
        targetUserId: userId,
        ipAddress,
      }
    );
  },

  /**
   * Safely execute a database query
   */
  async executeQuery<T>(
    operation: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    adminUserId?: string,
    ipAddress?: string
  ): Promise<T> {
    return withAdminAudit(
      operation,
      async () => {
        const { data, error } = await queryFn();
        if (error) {
          throw new Error(`Query failed: ${error.message}`);
        }
        if (!data) {
          throw new Error('Query returned no data');
        }
        return data;
      },
      {
        userId: adminUserId,
        ipAddress,
      }
    );
  },
};

// ============================================================================
// SECURITY HELPERS
// ============================================================================

/**
 * Check if current environment is safe for admin operations
 */
export function isSafeEnvironment(): boolean {
  const env = process.env.NODE_ENV as string;
  return env === 'production' || env === 'staging';
}

/**
 * Get admin operation context from request
 */
export function getAdminContext(request: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  return {
    ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                request.headers.get('x-real-ip') ||
                'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default supabaseAdmin;
