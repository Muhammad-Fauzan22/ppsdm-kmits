import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { spawn } from 'child_process';
import { join } from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, targetQuality = 90, priorityOnly = false, maxBooks = 10 } = body;

    // Validate request
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Start the Python batch processor script
    const scriptPath = join(process.cwd(), 'scripts', 'batch_process_ebooks.py');
    
    const args = [
      scriptPath,
      '--target-quality', targetQuality.toString(),
      '--limit', maxBooks.toString()
    ];

    if (priorityOnly) {
      args.push('--priority-only');
    }

    // Spawn Python process
    const pythonProcess = spawn('python', args, {
      detached: true,
      stdio: 'ignore'
    });

    pythonProcess.unref();

    // Update job status in database
    await supabase
      .from('batch_processing_jobs')
      .update({
        status: 'running',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    return NextResponse.json({
      success: true,
      message: 'Batch processing started',
      jobId,
      pid: pythonProcess.pid
    });

  } catch (error) {
    console.error('Error starting batch processing:', error);
    return NextResponse.json(
      { error: 'Failed to start batch processing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get active batch jobs
    const { data: jobs, error } = await supabase
      .from('batch_processing_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ jobs });

  } catch (error) {
    console.error('Error fetching batch jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch jobs' },
      { status: 500 }
    );
  }
}
