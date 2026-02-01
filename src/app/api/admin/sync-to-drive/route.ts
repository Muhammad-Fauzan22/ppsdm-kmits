import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { spawn } from 'child_process';
import { join } from 'path';

/**
 * POST /api/admin/sync-to-drive
 * Sync a book or all pending books to Google Drive
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, syncAll = false, dryRun = false } = body;

    const supabase = await createClient();

    if (dryRun) {
      // Return what would be synced without actually doing it
      const { data: pendingBooks, error } = await supabase
        .from('ebooks')
        .select('id, title, file_name, drive_upload_status, output_dir')
        .or('drive_upload_status.eq.pending,drive_upload_status.eq.failed,drive_folder_id.is.null');

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch pending books', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        dryRun: true,
        wouldSync: pendingBooks?.length || 0,
        books: pendingBooks || []
      });
    }

    if (syncAll) {
      // Trigger batch sync for all pending books
      const { data: pendingBooks, error } = await supabase
        .from('ebooks')
        .select('id, title')
        .or('drive_upload_status.eq.pending,drive_upload_status.eq.failed');

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch pending books', details: error.message },
          { status: 500 }
        );
      }

      // Start the Python batch processor with drive upload enabled
      const scriptPath = join(process.cwd(), 'scripts', 'batch_process_ebooks.py');
      
      const pythonProcess = spawn('python', [
        scriptPath,
        '--limit', (pendingBooks?.length || 10).toString(),
        '--target-quality', '90'
      ], {
        detached: true,
        stdio: 'ignore'
      });

      pythonProcess.unref();

      return NextResponse.json({
        success: true,
        message: `Started batch sync for ${pendingBooks?.length || 0} books`,
        booksQueued: pendingBooks?.length || 0,
        pid: pythonProcess.pid
      });
    }

    if (bookId) {
      // Get book details
      const { data: book, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('id', bookId)
        .single();

      if (error || !book) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        );
      }

      // Update status to uploading
      await supabase
        .from('ebooks')
        .update({
          drive_upload_status: 'uploading',
          drive_upload_progress: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookId);

      // Start Python script for single book upload
      const scriptPath = join(process.cwd(), 'scripts', 'batch_process_ebooks.py');
      
      const pythonProcess = spawn('python', [
        scriptPath,
        '--limit', '1',
        '--target-quality', '90'
      ], {
        detached: true,
        stdio: 'ignore',
        env: {
          ...process.env,
          SINGLE_BOOK_ID: bookId
        }
      });

      pythonProcess.unref();

      return NextResponse.json({
        success: true,
        message: `Started Drive sync for book: ${book.title}`,
        bookId,
        pid: pythonProcess.pid
      });
    }

    return NextResponse.json(
      { error: 'Either bookId or syncAll must be provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in sync-to-drive API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/sync-to-drive
 * Get sync queue status
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all books to calculate stats
    const { data: allBooks, error } = await supabase
      .from('ebooks')
      .select('drive_upload_status');

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch sync stats', details: error.message },
        { status: 500 }
      );
    }

    // Calculate stats manually
    const stats: Record<string, number> = {};
    allBooks?.forEach((book: any) => {
      const status = book.drive_upload_status || 'pending';
      stats[status] = (stats[status] || 0) + 1;
    });

    // Get active uploads (uploading status)
    const { data: activeUploads, error: activeError } = await supabase
      .from('ebooks')
      .select('id, title, drive_upload_progress, drive_upload_status, updated_at')
      .eq('drive_upload_status', 'uploading')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (activeError) {
      console.error('Error fetching active uploads:', activeError);
    }

    return NextResponse.json({
      stats: stats || [],
      activeUploads: activeUploads || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
