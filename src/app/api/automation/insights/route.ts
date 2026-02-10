/**
 * Insights API Route
 * POST /api/automation/insights
 * Generates comprehensive insights from data
 */

import { NextRequest, NextResponse } from 'next/server';
import { insightsEngine, InsightData, ComprehensiveInsights } from '@/lib/automation/insights-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InsightsRequest {
  activities?: any[];
  budget?: any[];
  members?: any[];
  assessments?: any[];
}

interface InsightsResponse {
  success: boolean;
  insights?: ComprehensiveInsights;
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<InsightsResponse>> {
  const startTime = Date.now();

  try {
    const body: InsightsRequest = await request.json();

    // Transform data to proper format
    const insightData: InsightData = {
      activities: body.activities?.map((a: any) => ({
        ...a,
        date: new Date(a.date),
      })) || [],
      budget: body.budget?.map((b: any) => ({
        ...b,
        date: new Date(b.date),
      })) || [],
      members: body.members?.map((m: any) => ({
        ...m,
        joinDate: new Date(m.joinDate),
      })) || [],
      assessments: body.assessments?.map((a: any) => ({
        ...a,
        date: new Date(a.date),
      })) || [],
    };

    // Generate insights
    const insights = await insightsEngine.generateInsights(insightData);

    return NextResponse.json({
      success: true,
      insights,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}

/**
 * GET /api/automation/insights
 * Get insights for a specific member
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const memberId = searchParams.get('memberId');
    const membersData = searchParams.get('membersData');

    if (!memberId) {
      return NextResponse.json({
        success: false,
        error: 'memberId is required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    // Parse members data if provided
    let members: any[] = [];
    if (membersData) {
      try {
        members = JSON.parse(membersData);
      } catch (parseError) {
        return NextResponse.json({
          success: false,
          error: 'Invalid membersData format',
          executionTime: Date.now() - startTime,
        }, { status: 400 });
      }
    }

    // Get member insights
    const memberInsights = await insightsEngine.getMemberInsights(memberId, members);

    return NextResponse.json({
      success: true,
      data: memberInsights,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Error getting member insights:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}
