/**
 * API Route: /api/assessment/dimensions/[id]/questions
 * 
 * Returns questions for a specific dimension
 * Public endpoint - no authentication required for viewing questions
 * Authentication required for submitting answers
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  COGNITIVE_ITEMS,
  SELF_MANAGEMENT_ITEMS
} from '@/lib/assessment/engine';

// Map dimension IDs to their items
// Using 'any' for now since different dimensions have different item structures
const dimensionItemsMap: Record<string, any[]> = {
  'cognitive': COGNITIVE_ITEMS,
  'self_management': SELF_MANAGEMENT_ITEMS,

  // TODO: Add other dimensions as they are implemented
  'financial': [],
  'physical_health': [],
  'emotional_intelligence': [],
  'mental_health': [],
  'character': [],
  'spiritual': [],
  'environmental': [],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate dimension ID
    if (!id || !dimensionItemsMap[id]) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid dimension ID',
          message: `Dimension "${id}" not found. Valid dimensions: ${Object.keys(dimensionItemsMap).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const items = dimensionItemsMap[id];

    // Check if dimension has been implemented
    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dimension not implemented',
          message: `Dimension "${id}" is not yet implemented. Please check back later.`,
        },
        { status: 501 }
      );
    }

    // Transform items for API response (remove sensitive psychometric data)
    const questions = items.map(item => ({
      id: item.id,
      text: item.text,
      type: item.type,
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
      reverseScored: item.reverseScored,
      subDimension: item.subDimension,
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
    console.error('Error fetching questions:', error);
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
