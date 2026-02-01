import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const { data: leaderboard, error } = await supabase
      .from('user_xp')
      .select('*')
      .order('total_xp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    const formattedLeaderboard = (leaderboard || []).map((entry: any, index: number) => ({
      rank: index + 1,
      user_id: entry.user_id,
      total_xp: entry.total_xp,
      current_level: entry.current_level,
      streak_days: entry.streak_days
    }));
    
    return NextResponse.json({ data: formattedLeaderboard });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
