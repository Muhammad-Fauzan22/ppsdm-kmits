import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerator } from '@/lib/report-engine';
import { ReportFormat } from '@/lib/report-engine/types';

/**
 * POST /api/reports/generate
 * Generate a report in specified format
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const {
      reportType,
      format,
      assessmentId,
      userId,
      options = {},
    } = body;

    // Validate required fields
    if (!reportType || !format || !assessmentId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: reportType, format, assessmentId, userId',
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

    // Validate format
    const supportedFormats = ReportGenerator.getSupportedFormats();
    if (!supportedFormats.includes(format as ReportFormat)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Generate report
    const result = await ReportGenerator.generate(
      reportType,
      format as ReportFormat,
      assessmentId,
      userId,
      options
    );

    // Return response with file
    return new NextResponse(result.data.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.data.mimeType,
        'Content-Disposition': `attachment; filename="${result.data.fileName}"`,
        'Content-Length': result.data.fileSize.toString(),
        'X-Report-Id': result.data.reportId,
        'X-Generation-Time': result.metadata.generationTime.toString(),
      },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate report',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reports/generate
 * Get supported formats and report types
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      supportedFormats: ReportGenerator.getSupportedFormats(),
      supportedReportTypes: ReportGenerator.getSupportedReportTypes(),
    },
  });
}
