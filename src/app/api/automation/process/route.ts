/**
 * Process Automation API Route
 * POST /api/automation/process
 * Processes spreadsheet data with AI-powered cleaning and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiProcessor, CleaningOptions, ProcessedData } from '@/lib/automation/ai-processor';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProcessRequest {
  spreadsheetId: string;
  sheetName: string;
  range?: string;
  options?: CleaningOptions;
  writeBack?: boolean;
}

interface ProcessResponse {
  success: boolean;
  data?: ProcessedData;
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<ProcessResponse>> {
  const startTime = Date.now();

  try {
    const body: ProcessRequest = await request.json();

    // Validate required fields
    if (!body.spreadsheetId) {
      return NextResponse.json({
        success: false,
        error: 'spreadsheetId is required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    if (!body.sheetName) {
      return NextResponse.json({
        success: false,
        error: 'sheetName is required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    // Fetch spreadsheet data
    const spreadsheetData = await aiProcessor.fetchSpreadsheetData(
      body.spreadsheetId,
      body.sheetName,
      body.range
    );

    // Process data
    const processedData = await aiProcessor.processData(
      spreadsheetData,
      body.options
    );

    // Write back to spreadsheet if requested
    if (body.writeBack) {
      await aiProcessor.writeProcessedData(
        body.spreadsheetId,
        body.sheetName,
        processedData.cleaned,
        spreadsheetData.headers
      );
    }

    return NextResponse.json({
      success: true,
      data: processedData,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Error processing automation:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}

/**
 * GET /api/automation/process
 * Get data statistics from spreadsheet
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const spreadsheetId = searchParams.get('spreadsheetId');
    const sheetName = searchParams.get('sheetName');
    const range = searchParams.get('range');

    if (!spreadsheetId || !sheetName) {
      return NextResponse.json({
        success: false,
        error: 'spreadsheetId and sheetName are required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    // Fetch spreadsheet data
    const spreadsheetData = await aiProcessor.fetchSpreadsheetData(
      spreadsheetId,
      sheetName,
      range || undefined
    );

    // Get statistics
    const statistics = aiProcessor.getDataStatistics(spreadsheetData.data);

    return NextResponse.json({
      success: true,
      data: {
        spreadsheetId,
        sheetName,
        statistics,
        headers: spreadsheetData.headers,
        rowCount: spreadsheetData.data.length,
      },
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Error getting automation statistics:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}
