import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-cookies';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  parentId?: string;
  children: string[];
  isUnlocked: boolean;
  progress: number;
  category: string;
}

interface SkillTree {
  rootNodes: string[];
  nodes: Record<string, SkillNode>;
  totalSkills: number;
  unlockedSkills: number;
  totalProgress: number;
}

/**
 * GET /api/skill-tree
 * Get user's skill tree based on assessment results
 */
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth();
    const userId = session.userId;

    const supabase = await createClient();

    // Get user's assessment scores
    const { data: assessments, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        dimensions:dimension_id (id, name, description)
      `)
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false });

    if (assessmentError) {
      return NextResponse.json(
        { error: 'Failed to fetch assessment data' },
        { status: 500 }
      );
    }

    // Get user's skill progress
    const { data: skillProgress, error: progressError } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', userId);

    if (progressError) {
      console.error('Error fetching skill progress:', progressError);
    }

    // Generate skill tree based on assessments
    const skillTree = generateSkillTree(assessments || [], skillProgress || []);

    return NextResponse.json({
      success: true,
      data: skillTree
    });

  } catch (error) {
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

/**
 * POST /api/skill-tree/progress
 * Update skill progress
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuth();
    const userId = session.userId;

    const body = await request.json();
    const { skillId, progress } = body;

    if (!skillId || typeof progress !== 'number') {
      return NextResponse.json(
        { error: 'Invalid input: skillId and progress required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Upsert skill progress
    const { error } = await supabase
      .from('user_skills')
      .upsert({
        user_id: userId,
        skill_id: skillId,
        progress: Math.min(100, Math.max(0, progress)),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,skill_id'
      });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update skill progress' },
        { status: 500 }
      );
    }

    // Log audit event
    console.log('Skill progress updated:', {
      userId,
      skillId,
      progress,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Skill progress updated'
    });

  } catch (error) {
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

// Helper function to generate skill tree
function generateSkillTree(assessments: any[], skillProgress: any[]): SkillTree {
  // Define skill categories based on 9 dimensions
  const categories = [
    { id: 'self-mgmt', name: 'Self Management', color: '#3B82F6' },
    { id: 'intellectual', name: 'Intellectual', color: '#8B5CF6' },
    { id: 'financial', name: 'Financial', color: '#10B981' },
    { id: 'physical', name: 'Physical Health', color: '#F59E0B' },
    { id: 'emotional', name: 'Emotional', color: '#EC4899' },
    { id: 'mental', name: 'Mental Health', color: '#6366F1' },
    { id: 'character', name: 'Character', color: '#14B8A6' },
    { id: 'spiritual', name: 'Spiritual', color: '#F97316' },
    { id: 'environmental', name: 'Environmental', color: '#22C55E' }
  ];

  const nodes: Record<string, SkillNode> = {};
  const rootNodes: string[] = [];

  // Create root nodes for each dimension
  categories.forEach((category, index) => {
    const assessment = assessments.find(a => 
      a.dimensions?.name?.toLowerCase().includes(category.name.toLowerCase())
    );
    
    const score = assessment?.score || 0;
    const progress = skillProgress.find(sp => sp.skill_id === category.id)?.progress || score;

    const rootNode: SkillNode = {
      id: category.id,
      name: category.name,
      description: `Master ${category.name.toLowerCase()} skills`,
      level: Math.floor(score / 20) + 1,
      maxLevel: 5,
      children: [],
      isUnlocked: true,
      progress: progress,
      category: category.name
    };

    nodes[category.id] = rootNode;
    rootNodes.push(category.id);

    // Add child skills
    const childSkills = getChildSkillsForCategory(category.id);
    childSkills.forEach((child, childIndex) => {
      const childId = `${category.id}-${childIndex}`;
      const childProgress = skillProgress.find(sp => sp.skill_id === childId)?.progress || 0;
      
      nodes[childId] = {
        id: childId,
        name: child.name,
        description: child.description,
        level: Math.floor(childProgress / 25) + 1,
        maxLevel: 4,
        parentId: category.id,
        children: [],
        isUnlocked: rootNode.progress >= (childIndex * 20),
        progress: childProgress,
        category: category.name
      };

      rootNode.children.push(childId);
    });
  });

  // Calculate totals
  const allNodes = Object.values(nodes);
  const unlockedCount = allNodes.filter(n => n.isUnlocked).length;
  const totalProgress = allNodes.reduce((sum, n) => sum + n.progress, 0) / allNodes.length;

  return {
    rootNodes,
    nodes,
    totalSkills: allNodes.length,
    unlockedSkills: unlockedCount,
    totalProgress: Math.round(totalProgress)
  };
}

// Helper function to get child skills for a category
function getChildSkillsForCategory(categoryId: string): Array<{name: string, description: string}> {
  const skills: Record<string, Array<{name: string, description: string}>> = {
    'self-mgmt': [
      { name: 'Time Management', description: 'Plan and prioritize tasks effectively' },
      { name: 'Goal Setting', description: 'Set and achieve SMART goals' },
      { name: 'Productivity', description: 'Maximize output with focused work' },
      { name: 'Self-Discipline', description: 'Build consistent habits' }
    ],
    'intellectual': [
      { name: 'Critical Thinking', description: 'Analyze and evaluate information' },
      { name: 'Problem Solving', description: 'Find solutions to complex problems' },
      { name: 'Learning Agility', description: 'Adapt and learn new skills quickly' },
      { name: 'Research Skills', description: 'Find and validate information' }
    ],
    'financial': [
      { name: 'Budgeting', description: 'Manage income and expenses' },
      { name: 'Saving', description: 'Build emergency funds' },
      { name: 'Investing', description: 'Grow wealth through investments' },
      { name: 'Financial Planning', description: 'Plan for long-term financial goals' }
    ],
    'physical': [
      { name: 'Exercise', description: 'Regular physical activity' },
      { name: 'Nutrition', description: 'Healthy eating habits' },
      { name: 'Sleep', description: 'Quality rest and recovery' },
      { name: 'Energy Management', description: 'Optimize physical energy' }
    ],
    'emotional': [
      { name: 'Self-Awareness', description: 'Understand own emotions' },
      { name: 'Empathy', description: 'Understand others emotions' },
      { name: 'Communication', description: 'Express emotions effectively' },
      { name: 'Conflict Resolution', description: 'Handle disagreements constructively' }
    ],
    'mental': [
      { name: 'Stress Management', description: 'Cope with stress effectively' },
      { name: 'Mindfulness', description: 'Practice present-moment awareness' },
      { name: 'Resilience', description: 'Bounce back from setbacks' },
      { name: 'Positive Thinking', description: 'Maintain optimistic outlook' }
    ],
    'character': [
      { name: 'Integrity', description: 'Act with honesty and strong principles' },
      { name: 'Responsibility', description: 'Take ownership of actions' },
      { name: 'Respect', description: 'Treat others with dignity' },
      { name: 'Fairness', description: 'Make just and equitable decisions' }
    ],
    'spiritual': [
      { name: 'Purpose', description: 'Find meaning and direction' },
      { name: 'Values', description: 'Live according to core beliefs' },
      { name: 'Reflection', description: 'Contemplate life questions' },
      { name: 'Connection', description: 'Feel connected to something greater' }
    ],
    'environmental': [
      { name: 'Sustainability', description: 'Live eco-friendly lifestyle' },
      { name: 'Conservation', description: 'Reduce waste and resource use' },
      { name: 'Nature Connection', description: 'Appreciate natural world' },
      { name: 'Community Impact', description: 'Contribute to environmental causes' }
    ]
  };

  return skills[categoryId] || [];
}
