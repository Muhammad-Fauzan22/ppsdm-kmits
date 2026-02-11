import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-cookies';
import { z } from 'zod';

// Validation schema
const joinGroupSchema = z.object({
  groupId: z.string().uuid()
});

/**
 * POST /api/study-groups/join
 * Join a study group
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth();
    const userId = session.userId;

    const body = await request.json();
    
    // Validate input
    const { groupId } = joinGroupSchema.parse(body);

    const supabase = await createClient();

    // Check if group exists and is not full
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select(`
        *,
        study_group_members_count (count)
      `)
      .eq('id', groupId)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { error: 'Study group not found' },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('study_group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'You are already a member of this group' },
        { status: 409 }
      );
    }

    // Check if group is full
    const currentMembers = group.study_group_members_count?.[0]?.count || 0;
    if (currentMembers >= group.max_members) {
      return NextResponse.json(
        { error: 'This group is full' },
        { status: 400 }
      );
    }

    // Check if group is private
    if (group.is_private) {
      return NextResponse.json(
        { error: 'This is a private group. You need an invitation to join.' },
        { status: 403 }
      );
    }

    // Add user to group
    const { error: joinError } = await supabase
      .from('study_group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        role: 'member',
        joined_at: new Date().toISOString()
      });

    if (joinError) {
      return NextResponse.json(
        { error: 'Failed to join study group' },
        { status: 500 }
      );
    }

    // Log audit event
    console.log('User joined study group:', {
      userId,
      groupId,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined study group',
      data: {
        groupId,
        joinedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
