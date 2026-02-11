import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { z } from 'zod';

/**
 * CSP Violation Report API
 * Receives and logs Content Security Policy violations
 */

// Validation schema for CSP reports
const cspReportSchema = z.object({
  'csp-report': z.object({
    'document-uri': z.string().optional(),
    'referrer': z.string().optional(),
    'violated-directive': z.string(),
    'effective-directive': z.string().optional(),
    'original-policy': z.string().optional(),
    'blocked-uri': z.string().optional(),
    'status-code': z.number().optional(),
    'script-sample': z.string().optional(),
    'source-file': z.string().optional(),
    'line-number': z.number().optional(),
    'column-number': z.number().optional(),
  }),
});

/**
 * POST /api/csp-report
 * Receive CSP violation reports from browsers
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate report format
    const validationResult = cspReportSchema.safeParse(body);
    
    if (!validationResult.success) {
      logger.warn('Invalid CSP report format', { 
        body,
        errors: validationResult.error.errors 
      });
      
      // Still accept the report but log the validation error
      return NextResponse.json(
        { success: true, warning: 'Invalid format but logged' },
        { status: 200 }
      );
    }

    const report = validationResult.data['csp-report'];
    
    // Log the CSP violation
    logger.warn('CSP Violation Reported', {
      documentUri: report['document-uri'],
      violatedDirective: report['violated-directive'],
      blockedUri: report['blocked-uri'],
      sourceFile: report['source-file'],
      lineNumber: report['line-number'],
      columnNumber: report['column-number'],
      statusCode: report['status-code'],
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referrer: request.headers.get('referer'),
    });

    // Store in database for analysis
    const supabase = await createClient();
    
    const { error: insertError } = await supabase
      .from('csp_violations')
      .insert({
        document_uri: report['document-uri'] || null,
        referrer: report['referrer'] || null,
        violated_directive: report['violated-directive'],
        effective_directive: report['effective-directive'] || null,
        original_policy: report['original-policy'] || null,
        blocked_uri: report['blocked-uri'] || null,
        status_code: report['status-code'] || null,
        script_sample: report['script-sample'] || null,
        source_file: report['source-file'] || null,
        line_number: report['line-number'] || null,
        column_number: report['column-number'] || null,
        user_agent: request.headers.get('user-agent'),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        reported_at: new Date().toISOString(),
      });

    if (insertError) {
      logger.error('Error storing CSP violation', { error: insertError });
      // Don't fail the request - CSP reports are best-effort
    }

    // Check if this is a critical violation that needs immediate attention
    const isCritical = isCriticalViolation(report);
    
    if (isCritical) {
      logger.error('CRITICAL CSP Violation Detected', {
        directive: report['violated-directive'],
        blockedUri: report['blocked-uri'],
        documentUri: report['document-uri'],
      });

      // Could send alert to admin here
      await notifyAdminOfCriticalViolation(report);
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (error) {
    logger.error('Error processing CSP report', { error });
    
    // Always return 200 for CSP reports to prevent browser retry loops
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  }
}

/**
 * GET /api/csp-report
 * Get CSP violation statistics (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin permission
    const { data: adminCheck } = await supabase
      .from('user_permissions')
      .select('permission_id')
      .eq('user_id', user.id)
      .eq('permission_id', 'admin:full')
      .single();

    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get violation statistics
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch violation summary
    const { data: violations, error: violationsError } = await supabase
      .from('csp_violations')
      .select('*')
      .gte('reported_at', startDate.toISOString())
      .order('reported_at', { ascending: false })
      .limit(100);

    if (violationsError) {
      logger.error('Error fetching CSP violations', { error: violationsError });
      return NextResponse.json(
        { error: 'Failed to fetch violations' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const stats = calculateViolationStats(violations || []);

    return NextResponse.json({
      success: true,
      data: {
        period: {
          days,
          start: startDate.toISOString(),
          end: new Date().toISOString(),
        },
        totalViolations: violations?.length || 0,
        statistics: stats,
        recentViolations: violations?.slice(0, 20) || [],
      },
    });

  } catch (error) {
    logger.error('Error fetching CSP statistics', { error });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Determine if a violation is critical
 */
function isCriticalViolation(report: any): boolean {
  const criticalDirectives = [
    'script-src',
    'object-src',
    'base-uri',
  ];

  const directive = report['violated-directive'] || '';
  
  return criticalDirectives.some(critical => 
    directive.includes(critical)
  );
}

/**
 * Notify admin of critical violation
 */
async function notifyAdminOfCriticalViolation(report: any): Promise<void> {
  // In production, this would send email/Slack/Discord notification
  logger.warn('Admin notification would be sent for critical CSP violation', {
    directive: report['violated-directive'],
    blockedUri: report['blocked-uri'],
  });
}

/**
 * Calculate violation statistics
 */
function calculateViolationStats(violations: any[]): any {
  if (violations.length === 0) {
    return {
      byDirective: {},
      byBlockedUri: {},
      topSources: [],
    };
  }

  const byDirective: Record<string, number> = {};
  const byBlockedUri: Record<string, number> = {};
  const sourceFiles: Record<string, number> = {};

  violations.forEach((v: any) => {
    // Count by directive
    const directive = v.violated_directive || 'unknown';
    byDirective[directive] = (byDirective[directive] || 0) + 1;

    // Count by blocked URI
    const blockedUri = v.blocked_uri || 'inline/eval';
    byBlockedUri[blockedUri] = (byBlockedUri[blockedUri] || 0) + 1;

    // Count by source file
    if (v.source_file) {
      sourceFiles[v.source_file] = (sourceFiles[v.source_file] || 0) + 1;
    }
  });

  // Get top sources
  const topSources = Object.entries(sourceFiles)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([file, count]) => ({ file, count }));

  return {
    byDirective,
    byBlockedUri,
    topSources,
  };
}
