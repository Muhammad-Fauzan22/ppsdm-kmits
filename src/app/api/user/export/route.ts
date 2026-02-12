import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * UU PDP Compliance - Data Export Endpoint
 * Generates JSON report of all user data for data portability rights
 * 
 * @route GET /api/user/export
 * @returns JSON file with all user assessment data
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: any) {
            try {
              cookiesToSet.forEach(({ name, value, options }: any) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from server component
            }
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Fetch all user data
    const [
      { data: profile },
      { data: assessments },
      { data: activities },
      { data: achievements }
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),

      supabase
        .from('assessments')
        .select(`
          *,
          assessment_results(*)
        `)
        .eq('user_id', userId),

      supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId),

      supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
    ]);

    // Create export data
    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        id: userId,
        email: user.email,
        profile,
      },
      assessments: assessments || [],
      activities: activities || [],
      achievements: achievements || [],
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ppsdm-data-export-${userId}.json"`,
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
