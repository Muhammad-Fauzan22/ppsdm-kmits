import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withAdminAuth, requireAdmin, isAdmin } from './admin-auth';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
// Mock the Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}));

import { createClient } from '@/lib/supabase/server';

describe('requireAdmin', () => {
  const mockSupabase = {
    auth: {
      getSession: vi.fn()
    },
    from: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  it('should return admin user for valid admin session', async () => {
    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@ppsdm-kmits.com'
      }
    };

    const mockProfile = {
      role: 'admin',
      email: 'admin@ppsdm-kmits.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    const result = await requireAdmin();

    expect(result).toEqual({
      id: 'admin-123',
      email: 'admin@ppsdm-kmits.com',
      role: 'admin'
    });
  });

  it('should throw error when no session exists', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    await expect(requireAdmin()).rejects.toThrow('Unauthorized: No valid session');
  });

  it('should throw error when session fetch fails', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: new Error('Session error')
    });

    await expect(requireAdmin()).rejects.toThrow('Unauthorized: No valid session');
  });

  it('should throw error when profile not found', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'user@example.com'
      }
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Profile not found')
          })
        })
      })
    });

    await expect(requireAdmin()).rejects.toThrow('Unauthorized: User profile not found');
  });

  it('should throw forbidden error when user is not admin', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'user@example.com'
      }
    };

    const mockProfile = {
      role: 'user', // Not admin
      email: 'user@example.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    await expect(requireAdmin()).rejects.toThrow('Forbidden: Admin access required');
  });

  it('should use session email when profile email is null', async () => {
    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@ppsdm-kmits.com'
      }
    };

    const mockProfile = {
      role: 'admin',
      email: null // Profile has no email
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    const result = await requireAdmin();

    expect(result.email).toBe('admin@ppsdm-kmits.com');
  });
});

describe('withAdminAuth', () => {
  const mockHandler = vi.fn();
  const mockRequest = {
    nextUrl: { pathname: '/api/admin/test' },
    ip: '127.0.0.1',
    headers: {
      get: (key: string) => key === 'x-forwarded-for' ? '127.0.0.1' : null
    } as any
  } as unknown as NextRequest;

  const mockSupabase = {
    auth: {
      getSession: vi.fn()
    },
    from: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  it('should call handler with admin user when authenticated', async () => {
    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@ppsdm-kmits.com'
      }
    };

    const mockProfile = {
      role: 'admin',
      email: 'admin@ppsdm-kmits.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    mockHandler.mockResolvedValue(new Response('Success'));

    const wrappedHandler = withAdminAuth(mockHandler);
    const result = await wrappedHandler(mockRequest);

    expect(mockHandler).toHaveBeenCalledWith(
      mockRequest,
      expect.objectContaining({
        id: 'admin-123',
        email: 'admin@ppsdm-kmits.com',
        role: 'admin'
      })
    );
    expect(result.status).toBe(200);
  });

  it('should return 401 for unauthenticated requests', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    const wrappedHandler = withAdminAuth(mockHandler);
    const result = await wrappedHandler(mockRequest);

    expect(result.status).toBe(401);
    const body = await result.json();
    expect(body.error).toContain('Unauthorized');
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should return 403 for non-admin users', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'user@example.com'
      }
    };

    const mockProfile = {
      role: 'user',
      email: 'user@example.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    const wrappedHandler = withAdminAuth(mockHandler);
    const result = await wrappedHandler(mockRequest);

    expect(result.status).toBe(403);
    const body = await result.json();
    expect(body.error).toContain('Forbidden');
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should log admin actions', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@ppsdm-kmits.com'
      }
    };

    const mockProfile = {
      role: 'admin',
      email: 'admin@ppsdm-kmits.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    mockHandler.mockResolvedValue(new Response('Success'));

    const wrappedHandler = withAdminAuth(mockHandler);
    await wrappedHandler(mockRequest);

    expect(consoleSpy).toHaveBeenCalled();
    const lastCall = consoleSpy.mock.calls[0][0];
    const logObj = JSON.parse(lastCall);

    expect(logObj.message).toContain('[AUDIT] Admin action');
    expect(logObj.context).toMatchObject({
      adminId: 'admin-123',
      email: 'admin@ppsdm-kmits.com'
    });

    consoleSpy.mockRestore();
  });

  it('should log failed authentication attempts', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    const wrappedHandler = withAdminAuth(mockHandler);
    await wrappedHandler(mockRequest);

    expect(consoleSpy).toHaveBeenCalled();
    const lastCall = consoleSpy.mock.calls[0][0];
    const logObj = JSON.parse(lastCall);

    expect(logObj.message).toContain('[SECURITY] Failed admin access attempt');
    expect(logObj.context).toMatchObject({
      ip: '127.0.0.1'
    });

    consoleSpy.mockRestore();
  });
});

describe('isAdmin', () => {
  const mockSupabase = {
    auth: {
      getSession: vi.fn()
    },
    from: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (createClient as any).mockResolvedValue(mockSupabase);
  });

  it('should return true for admin users', async () => {
    const mockSession = {
      user: {
        id: 'admin-123',
        email: 'admin@ppsdm-kmits.com'
      }
    };

    const mockProfile = {
      role: 'admin',
      email: 'admin@ppsdm-kmits.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    const result = await isAdmin();
    expect(result).toBe(true);
  });

  it('should return false for non-admin users', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'user@example.com'
      }
    };

    const mockProfile = {
      role: 'user',
      email: 'user@example.com'
    };

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    });

    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null
          })
        })
      })
    });

    const result = await isAdmin();
    expect(result).toBe(false);
  });

  it('should return false when not authenticated', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    });

    const result = await isAdmin();
    expect(result).toBe(false);
  });

  it('should return false on error', async () => {
    mockSupabase.auth.getSession.mockRejectedValue(new Error('Database error'));

    const result = await isAdmin();
    expect(result).toBe(false);
  });
});
