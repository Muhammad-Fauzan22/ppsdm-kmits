import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerator } from '@/lib/report-engine';

/**
 * POST /api/reports/preview
 * Generate a report preview (HTML)
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const {
      reportType,
      assessmentId,
      userId,
      options = {},
    } = body;

    // Validate required fields
    if (!reportType || !assessmentId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: reportType, assessmentId, userId',
        },
        { status: 400 }
      );
    }

    // Validate report type
    const supportedTypes = ReportGenerator.getSupportedReportTypes();
    if (!supportedTypes.includes(reportType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported report type: ${reportType}. Supported types: ${supportedTypes.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate preview
    const html = await ReportGenerator.generatePreview(
      reportType,
      assessmentId,
      userId,
      options
    );

    // Return HTML response
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate preview',
      },
      { status: 500 }
    );
  }
}
