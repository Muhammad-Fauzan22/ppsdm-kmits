
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

/**
 * Create a Supabase client for server components
 */
export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

/**
 * Create a Supabase client for server actions
 * This version doesn't set cookies (read-only for actions)
 */
export async function createActionClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll() {
                    // No-op in server actions
                },
            },
        }
    )
}

/**
 * Create a Supabase admin client with service role
 * Use with caution - bypasses RLS
 */
export function createAdminClient() {
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() {
                    return []
                },
                setAll() {
                    // No-op for admin client
                },
            },
        }
    )
}

/**
 * Get the current authenticated user (cached for request)
 */
export const getCurrentUser = cache(async () => {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
})

/**
 * Get the current session
 */
export const getSession = cache(async () => {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
        return null
    }

    return session
})

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    return user
}

/**
 * Get user profile with current dimension scores
 */
export const getUserProfileWithScores = cache(async () => {
    const supabase = await createClient()
    const user = await requireAuth()

    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError) {
        return null
    }

    const { data: scores, error: scoresError } = await supabase
        .from('dimension_scores')
        .select('*')
        .eq('user_id', user.id)
        .single()

    return {
        profile,
        scores: scores || null,
    }
})

/**
 * Check if user is admin
 */
export async function isAdmin() {
    const user = await getCurrentUser()

    if (!user) {
        return false
    }

    // Check for admin role in user metadata
    const appMetadata = user.app_metadata || {}
    return appMetadata.role === 'admin' || appMetadata.role === 'service_role'
}

/**
 * Helper to handle Supabase errors consistently
 */
export function handleSupabaseError(error: unknown): { error: string; status: number } {
    if (typeof error === 'object' && error !== null) {
        const supabaseError = error as { message?: string; code?: string; details?: string }

        // Handle specific error codes
        switch (supabaseError.code) {
            case '23505':
                return { error: 'A record with this information already exists', status: 409 }
            case '23503':
                return { error: 'Referenced record does not exist', status: 422 }
            case '42501':
                return { error: 'Permission denied', status: 403 }
            case 'PGRST116':
                return { error: 'Record not found', status: 404 }
            default:
                return {
                    error: supabaseError.message || 'An unexpected error occurred',
                    status: 500
                }
        }
    }

    return { error: 'An unexpected error occurred', status: 500 }
}

/**
 * Type for API response
 */
export type ApiResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string; status: number }

/**
 * Create standardized API response
 */
export function createResponse<T>(data: T): ApiResponse<T> {
    return { success: true, data }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error: string, status = 500): ApiResponse<never> {
    return { success: false, error, status }
}

// Default export
const supabaseServer = {
    createClient,
    createActionClient,
    createAdminClient,
    getCurrentUser,
    getSession,
    requireAuth,
    getUserProfileWithScores,
    isAdmin,
    handleSupabaseError,
    createResponse,
    createErrorResponse,
}
