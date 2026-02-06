import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/drive-status
 * Get Google Drive upload status for all ebooks or a specific book
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('bookId');

    const supabase = await createClient();

    if (bookId) {
      // Get status for specific book
      const { data: book, error: bookError } = await supabase
        .from('ebooks')
        .select('id, title, drive_folder_id, drive_folder_url, drive_upload_status, drive_upload_progress, drive_uploaded_at')
        .eq('id', bookId)
        .single();

      if (bookError) {
        return NextResponse.json(
          { error: 'Book not found', details: bookError.message },
          { status: 404 }
        );
      }

      // Get upload tracking details
      const { data: uploads, error: uploadsError } = await supabase
        .from('ebook_upload_tracking')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (uploadsError) {
        console.error('Error fetching upload tracking:', uploadsError);
      }

      return NextResponse.json({
        book: {
          ...book,
          drive_uploaded_at: book.drive_uploaded_at
        },
        uploads: uploads || [],
        summary: {
          totalFiles: uploads?.length || 0,
          completed: uploads?.filter((u: any) => u.status === 'completed').length || 0,
          failed: uploads?.filter((u: any) => u.status === 'failed').length || 0,
          pending: uploads?.filter((u: any) => u.status === 'pending').length || 0,
          uploading: uploads?.filter((u: any) => u.status === 'uploading').length || 0
        }
      });
    } else {
      // Get status for all books with Drive folders
      const { data: books, error } = await supabase
        .from('ebooks')
        .select('id, title, drive_folder_id, drive_folder_url, drive_upload_status, drive_upload_progress, drive_uploaded_at, processing_status')
        .not('drive_folder_id', 'is', null)
        .order('drive_uploaded_at', { ascending: false });

      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch Drive status', details: error.message },
          { status: 500 }
        );
      }

      // Get summary stats
      const { data: stats, error: statsError } = await supabase
        .from('ebook_upload_tracking')
        .select('status');

      const summary = {
        totalBooks: books?.length || 0,
        completed: books?.filter((b: any) => b.drive_upload_status === 'completed').length || 0,
        inProgress: books?.filter((b: any) => b.drive_upload_status === 'uploading').length || 0,
        pending: books?.filter((b: any) => b.drive_upload_status === 'pending').length || 0,
        failed: books?.filter((b: any) => b.drive_upload_status === 'failed').length || 0,
        totalFiles: stats?.length || 0,
        filesCompleted: stats?.filter((s: any) => s.status === 'completed').length || 0,
        filesFailed: stats?.filter((s: any) => s.status === 'failed').length || 0
      };

      return NextResponse.json({
        books: books || [],
        summary
      });
    }
  } catch (error) {
    console.error('Error in drive-status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/drive-status
 * Update Drive upload status for a book
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, driveFolderId, driveFolderUrl, status, progress } = body;

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const updates: any = {
      updated_at: new Date().toISOString()
    };

    if (driveFolderId) updates.drive_folder_id = driveFolderId;
    if (driveFolderUrl) updates.drive_folder_url = driveFolderUrl;
    if (status) updates.drive_upload_status = status;
    if (typeof progress === 'number') updates.drive_upload_progress = progress;
    if (status === 'completed') updates.drive_uploaded_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('ebooks')
      .update(updates)
      .eq('id', bookId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update Drive status', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      book: data
    });
  } catch (error) {
    console.error('Error updating Drive status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
