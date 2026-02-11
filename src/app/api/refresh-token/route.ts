import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser, setAuthCookies, setAuthCookiesWithOptions } from '@/lib/auth-cookies';
import { logger } from '@/lib/logger';

/**
 * Refresh Token API
 * Refreshes authentication tokens using refresh token
 */

/**
 * POST /api/refresh-token
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current session to check if refresh is needed
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      logger.error('Error getting session for refresh', { error: sessionError });
      return NextResponse.json(
        { error: 'Failed to get session' },
        { status: 401 }
      );
    }

    // If no session, try to refresh using refresh token from cookies
    if (!session) {
      const refreshToken = request.cookies.get('refresh_token')?.value;
      
      if (!refreshToken) {
        return NextResponse.json(
          { error: 'No refresh token available' },
          { status: 401 }
        );
      }

      // Attempt to refresh the session
      const { data, error: refreshError } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (refreshError || !data.session) {
        logger.error('Failed to refresh session', { error: refreshError });
        return NextResponse.json(
          { error: 'Invalid or expired refresh token' },
          { status: 401 }
        );
      }

      // Set new cookies with refreshed tokens
      const response = NextResponse.json({
        success: true,
        message: 'Token refreshed successfully',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      });

      // Set authentication cookies
      await setAuthCookiesWithOptions(response, {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
      });

      logger.info('Token refreshed successfully', {
        userId: data.user?.id,
      });

      return response;
    }

    // Session exists and is valid
    // Check if it's close to expiry (refresh if less than 5 minutes remaining)
    const expiresAt = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    if (expiresAt && expiresAt - now < fiveMinutes) {
      // Session is about to expire, refresh it
      const { data, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError || !data.session) {
        logger.error('Failed to refresh near-expiry session', { error: refreshError });
        return NextResponse.json(
          { error: 'Failed to refresh session' },
          { status: 401 }
        );
      }

      // Set new cookies
      const response = NextResponse.json({
        success: true,
        message: 'Token refreshed proactively',
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      });

      await setAuthCookiesWithOptions(response, {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
      });

      logger.info('Token refreshed proactively', {
        userId: data.user?.id,
      });

      return response;
    }

    // Session is still valid
    return NextResponse.json({
      success: true,
      message: 'Session still valid',
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      expiresAt: session.expires_at,
    });

  } catch (error) {
    logger.error('Error in refresh token endpoint', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/refresh-token
 * Revoke refresh token (logout)
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      logger.error('Error signing out', { error });
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 500 }
      );
    }

    // Clear auth cookies
    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully',
    });

    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('refresh_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    logger.info('User signed out');

    return response;

  } catch (error) {
    logger.error('Error in sign out', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
