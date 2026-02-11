import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { createClient } from '@/lib/supabase/server';
import { spawn } from 'child_process';
import { join } from 'path';
import { z } from 'zod';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

// Strict input validation schema
const batchProcessSchema = z.object({
  jobId: z.string().uuid(),
  targetQuality: z.number().int().min(1).max(100).default(90),
  maxBooks: z.number().int().min(1).max(50).default(10),
  priorityOnly: z.boolean().default(false)
});

// Whitelist allowed scripts
const ALLOWED_SCRIPTS = [
  'batch_process_ebooks.py',
  'optimize_images.py'
];

/**
 * POST /api/admin/batch-process-ebooks
 * Process e-books in batch (Admin only)
 * SECURITY: This route spawns Python processes - requires strict input validation
 */
export const POST = withAdminAuth(async (req: NextRequest, admin) => {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validatedData = batchProcessSchema.parse(body);
    
    // Generate secure job tracking ID
    const trackingId = crypto.randomUUID();
    
    // Log admin action for security audit
    logger.audit('Batch processing started', { adminId: admin.id, email: admin.email, trackingId });

    const supabase = await createClient();

    // SECURITY: Validate script path is in whitelist
    const scriptName = 'batch_process_ebooks.py';
    if (!ALLOWED_SCRIPTS.includes(scriptName)) {
      return NextResponse.json(
        { error: 'Invalid operation' },
        { status: 403 }
      );
    }

    const scriptPath = join(process.cwd(), 'scripts', scriptName);
    
    // SECURITY: All arguments are validated and converted to strings safely
    const args = [
      scriptPath,
      '--target-quality', String(validatedData.targetQuality),
      '--limit', String(validatedData.maxBooks),
      '--job-id', validatedData.jobId,
      '--tracking-id', trackingId
    ];

    if (validatedData.priorityOnly) {
      args.push('--priority-only');
    }

    // Spawn Python process with security constraints
    const pythonProcess = spawn('python3', args, {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe'], // Capture stdout/stderr for logging
      timeout: 600000, // 10 minute timeout
      cwd: process.cwd(),
      env: {
        ...process.env,
        PYTHONPATH: process.cwd(),
        ADMIN_ID: admin.id,
        TRACKING_ID: trackingId
      }
    });

    // Capture output for debugging (but don't block)
    let stdout = '';
    let stderr = '';
    
    pythonProcess.stdout?.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      logger.info(`[BATCH PROCESS] Job ${trackingId} completed with code ${code}`);
    });

    pythonProcess.on('error', (error) => {
      console.error(`[BATCH PROCESS] Job ${trackingId} error:`, error);
    });

    pythonProcess.unref();

    // Update job status in database
    const { error: updateError } = await supabase
      .from('batch_processing_jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        started_by: admin.id,
        tracking_id: trackingId
      })
      .eq('id', validatedData.jobId);

    if (updateError) {
      console.error('[BATCH PROCESS] Failed to update job status:', updateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Batch processing started securely',
      jobId: validatedData.jobId,
      trackingId,
      pid: pythonProcess.pid,
      executedBy: admin.email,
      security: {
        inputValidated: true,
        scriptWhitelisted: true,
        timeoutSet: true
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to start batch processing' },
      { status: 500 }
    );
  }
});

/**
 * GET /api/admin/batch-process-ebooks
 * Get active batch jobs (Admin only)
 */
export const GET = withAdminAuth(async (req: NextRequest, admin) => {
  try {
    const supabase = await createClient();
    
    // Get active batch jobs
    const { data: jobs, error } = await supabase
      .from('batch_processing_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      jobs,
      accessedBy: admin.email,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch batch jobs' },
      { status: 500 }
    );
  }
});
