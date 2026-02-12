/**
 * API Route: /api/assessment/dimensions/[id]/questions
 * 
 * Returns questions for a specific dimension
 * Public endpoint - no authentication required for viewing questions
 * Authentication required for submitting answers
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDimensionBySlug } from '@/data/dimensions/index';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate dimension ID (which is actually a slug here)
    const dimension = getDimensionBySlug(id);

    if (!dimension) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid dimension ID',
          message: `Dimension "${id}" not found.`,
        },
        { status: 400 }
      );
    }

    const items = dimension.items;

    // Check if dimension has items
    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dimension items not found',
          message: `Dimension "${id}" has no questions defined.`,
        },
        { status: 500 }
      );
    }

    // Transform items for API response (remove sensitive psychometric data)
    const questions = items.map((item: any) => ({
      id: item.id,
      text: item.text,
      type: item.type || 'likert', // Default to likert
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: 'Sangat Tidak Setuju',
          2: 'Tidak Setuju',
          3: 'Netral',
          4: 'Setuju',
          5: 'Sangat Setuju',
        },
      },
      reverseScored: item.reverseScored || false,
      subDimension: item.subdimension,
    }));

    return NextResponse.json({
      success: true,
      data: {
        dimensionId: id,
        totalQuestions: questions.length,
        estimatedTimeMinutes: Math.ceil(questions.length * 0.5), // ~30 seconds per question
        questions,
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch questions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
