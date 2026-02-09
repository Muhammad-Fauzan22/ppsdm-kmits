import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from server component
            }
          },
        },
      }
    );

    // Get current user (if authenticated)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch all study groups with member count
    const { data: groups, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        study_group_members!inner(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching study groups:', error);
      return NextResponse.json(
        { error: 'Failed to fetch study groups' },
        { status: 500 }
      );
    }

    // Check which groups the user has joined
    let userGroups: string[] = [];
    if (user) {
      const { data: memberships } = await supabase
        .from('study_group_members')
        .select('group_id')
        .eq('user_id', user.id);
      
      userGroups = memberships?.map(m => m.group_id) || [];
    }

    // Format the response
    const formattedGroups = groups?.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      courseName: group.course_name,
      members: group.study_group_members?.[0]?.count || 0,
      maxMembers: group.max_members,
      isPrivate: group.is_private,
      isJoined: userGroups.includes(group.id),
      tags: group.tags || [],
      createdAt: group.created_at,
      updatedAt: group.updated_at,
    })) || [];

    return NextResponse.json(formattedGroups);
  } catch (error) {
    console.error('Study groups API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
