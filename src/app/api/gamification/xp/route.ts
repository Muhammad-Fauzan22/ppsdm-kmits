import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/gamification/xp - Get user's XP and level
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: userXp, error: xpError } = await supabase
      .from('user_xp')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    const { data: xpHistory } = await supabase
      .from('xp_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    const xp = userXp || { total_xp: 0, current_level: 1, xp_to_next_level: 100 };

    return NextResponse.json({
      data: {
        ...xp,
        level_progress: {
          current: xp.total_xp,
          required: xp.xp_to_next_level,
          percentage: Math.min(100, (xp.total_xp / xp.xp_to_next_level) * 100)
        },
        history: xpHistory || []
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
