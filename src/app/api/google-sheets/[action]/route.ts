import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';
import { SheetParserEngine } from '@/lib/google-sheets/sheet-parser-engine';
import { DynamicPageGenerator } from '@/lib/website-generator/dynamic-page-generator';
import { RealTimeSyncEngine } from '@/lib/real-time-sync/real-time-sync-engine';

/**
 * GET /api/google-sheets/[action]
 * Handles GET requests for Google Sheets operations
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  
  try {
    switch (action) {
      case 'data':
        return await handleGetSheetData(request);
      case 'validate':
        return await handleValidateSheetData(request);
      case 'pages':
        return await handleGetPageRules(request);
      case 'sync-status':
        return await handleGetSyncStatus(request);
      case 'analytics':
        return await handleGetAnalytics(request);
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(`Error in GET /api/google-sheets:`, error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/google-sheets/[action]
 * Handles POST requests for Google Sheets operations
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  
  try {
    switch (action) {
      case 'update':
        return await handleUpdateSheetData(request);
      case 'append':
        return await handleAppendSheetData(request);
      case 'sync':
        return await handleSync(request);
      case 'regenerate':
        return await handleRegeneratePage(request);
      case 'validate':
        return await handleValidateSheetData(request);
      case 'watch':
        return await handleWatchSheet(request);
      case 'unwatch':
        return await handleUnwatchSheet(request);
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(`Error in POST /api/google-sheets:`, error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Handle getting sheet data
 */
async function handleGetSheetData(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheetName = searchParams.get('sheet') || '';
  const range = searchParams.get('range');
  
  if (!sheetName) {
    return NextResponse.json(
      { success: false, error: 'Missing sheet parameter' },
      { status: 400 }
    );
  }

  const sheetsService = await GoogleSheetsService.getInstance();
  const data = await sheetsService.getSheetData(
    process.env.SPREADSHEET_ID!,
    range ? range : sheetName
  );

  return NextResponse.json({ success: true, data });
}

/**
 * Handle updating sheet data
 */
async function handleUpdateSheetData(request: NextRequest) {
  const body = await request.json();
  const { sheetName, range, values } = body;

  if (!sheetName || !range || !values) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: sheetName, range, values' },
      { status: 400 }
    );
  }

  const sheetsService = await GoogleSheetsService.getInstance();
  await sheetsService.updateSheetData(
    process.env.SPREADSHEET_ID!,
    range,
    values
  );

  return NextResponse.json({ success: true, message: 'Sheet data updated successfully' });
}

/**
 * Handle appending sheet data
 */
async function handleAppendSheetData(request: NextRequest) {
  const body = await request.json();
  const { sheetName, range, values } = body;

  if (!sheetName || !values) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields: sheetName, values' },
      { status: 400 }
    );
  }

  const sheetsService = await GoogleSheetsService.getInstance();
  await sheetsService.appendSheetData(
    process.env.SPREADSHEET_ID!,
    range || sheetName,
    values
  );

  return NextResponse.json({ success: true, message: 'Data appended successfully' });
}

/**
 * Handle validating sheet data
 */
async function handleValidateSheetData(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheetName = searchParams.get('sheet') || '';

  if (!sheetName) {
    return NextResponse.json(
      { success: false, error: 'Missing sheet parameter' },
      { status: 400 }
    );
  }

  const parserEngine = new SheetParserEngine();
  const parsedData = await parserEngine.parseSheetData(
    process.env.SPREADSHEET_ID!,
    sheetName
  );

  const report = parserEngine.getValidationReport(parsedData);

  return NextResponse.json({
    success: true,
    report,
    data: parsedData.filter(item => item._isValid)
  });
}

/**
 * Handle getting page rules
 */
async function handleGetPageRules(request: NextRequest) {
  const pageGenerator = new DynamicPageGenerator();
  return NextResponse.json({
    success: true,
    rules: pageGenerator.getPageRules()
  });
}

/**
 * Handle getting sync status
 */
async function handleGetSyncStatus(request: NextRequest) {
  const syncEngine = new RealTimeSyncEngine();
  return NextResponse.json({
    success: true,
    status: syncEngine.getSyncStatus()
  });
}

/**
 * Handle getting analytics
 */
async function handleGetAnalytics(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sheetName = searchParams.get('sheet');

  if (!sheetName) {
    return NextResponse.json(
      { success: false, error: 'Missing sheet parameter' },
      { status: 400 }
    );
  }

  const parserEngine = new SheetParserEngine();
  const parsedData = await parserEngine.parseSheetData(
    process.env.SPREADSHEET_ID!,
    sheetName
  );

  const validatedData = parserEngine.transformDataForWebsite(parsedData, sheetName);
  
  // Generate analytics based on sheet type
  let analytics = {};
  switch (sheetName.toLowerCase()) {
    case 'activities':
      analytics = (new DynamicPageGenerator() as any).generateActivityAnalytics(validatedData);
      break;
    case 'members':
      analytics = (new DynamicPageGenerator() as any).generateMemberAnalytics(validatedData);
      break;
    case 'finances':
      analytics = (new DynamicPageGenerator() as any).generateFinancialAnalytics(validatedData);
      break;
    case 'assessments':
      analytics = (new DynamicPageGenerator() as any).generateAssessmentAnalytics(validatedData);
      break;
    case 'knowledge':
      analytics = (new DynamicPageGenerator() as any).generateKnowledgeAnalytics(validatedData);
      break;
    case 'projects':
      analytics = (new DynamicPageGenerator() as any).generateProjectAnalytics(validatedData);
      break;
  }

  return NextResponse.json({
    success: true,
    analytics,
    summary: {
      totalRecords: validatedData.length,
      validRecords: parsedData.filter(item => item._isValid).length,
      invalidRecords: parsedData.filter(item => !item._isValid).length
    }
  });
}

/**
 * Handle sync operations
 */
async function handleSync(request: NextRequest) {
  const body = await request.json();
  const { fullSync = false } = body;

  const syncEngine = new RealTimeSyncEngine();
  
  if (fullSync) {
    await syncEngine.triggerFullSync();
    return NextResponse.json({
      success: true,
      message: 'Full sync completed'
    });
  } else {
    await syncEngine.checkForChanges();
    return NextResponse.json({
      success: true,
      message: 'Change check completed'
    });
  }
}

/**
 * Handle regenerating a specific page
 */
async function handleRegeneratePage(request: NextRequest) {
  const body = await request.json();
  const { route } = body;

  if (!route) {
    return NextResponse.json(
      { success: false, error: 'Missing route parameter' },
      { status: 400 }
    );
  }

  const pageGenerator = new DynamicPageGenerator();
  await pageGenerator.regeneratePageByRoute(route);

  return NextResponse.json({
    success: true,
    message: `Page ${route} regenerated successfully`
  });
}

/**
 * Handle watching a sheet
 */
async function handleWatchSheet(request: NextRequest) {
  const body = await request.json();
  const { sheetName } = body;

  if (!sheetName) {
    return NextResponse.json(
      { success: false, error: 'Missing sheetName parameter' },
      { status: 400 }
    );
  }

  const syncEngine = new RealTimeSyncEngine();
  syncEngine.watchSheet(process.env.SPREADSHEET_ID!, sheetName);

  return NextResponse.json({
    success: true,
    message: `Started watching sheet: ${sheetName}`
  });
}

/**
 * Handle unwatching a sheet
 */
async function handleUnwatchSheet(request: NextRequest) {
  const body = await request.json();
  const { sheetName } = body;

  if (!sheetName) {
    return NextResponse.json(
      { success: false, error: 'Missing sheetName parameter' },
      { status: 400 }
    );
  }

  const syncEngine = new RealTimeSyncEngine();
  syncEngine.unwatchSheet(process.env.SPREADSHEET_ID!, sheetName);

  return NextResponse.json({
    success: true,
    message: `Stopped watching sheet: ${sheetName}`
  });
}
