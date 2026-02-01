/**
 * Google Sheets Integration
 * 
 * Track book processing status in spreadsheet
 * Sheet ID: 1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM
 */

import { google } from 'googleapis';

// Spreadsheet ID for tracking
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM';

// Default sheet name
const DEFAULT_SHEET_NAME = 'Processing Log';

export interface ProcessingLog {
  timestamp: Date;
  bookId: string;
  bookTitle: string;
  status: ProcessingStatus;
  stage: ProcessingStage;
  message?: string;
  duration?: number;
  provider?: string;
  outputUrl?: string;
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'retrying';
export type ProcessingStage = 
  | 'downloaded' 
  | 'parsed' 
  | 'summarized' 
  | 'modules_generated' 
  | 'assessments_created' 
  | 'published';

/**
 * Initialize Google Sheets API client
 */
function getSheetsClient() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  return sheets;
}

/**
 * Log processing status to spreadsheet
 */
export async function logProcessingStatus(
  bookId: string,
  bookTitle: string,
  status: ProcessingStatus,
  stage: ProcessingStage,
  options?: {
    message?: string;
    duration?: number;
    provider?: string;
    outputUrl?: string;
  }
): Promise<void> {
  try {
    const sheets = getSheetsClient();
    
    const row = [
      new Date().toISOString(),
      bookId,
      bookTitle,
      status,
      stage,
      options?.message || '',
      options?.duration?.toString() || '',
      options?.provider || '',
      options?.outputUrl || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DEFAULT_SHEET_NAME}!A:I`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    console.log(`Logged processing status: ${status} for ${bookTitle}`);
  } catch (error) {
    console.error('Error logging to spreadsheet:', error);
    // Don't throw - logging failure shouldn't break processing
  }
}

/**
 * Get all processing logs for a book
 */
export async function getBookProcessingLogs(bookId: string): Promise<ProcessingLog[]> {
  try {
    const sheets = getSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DEFAULT_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    
    // Filter by bookId (skip header row)
    return rows
      .slice(1)
      .filter(row => row[1] === bookId)
      .map(row => ({
        timestamp: new Date(row[0]),
        bookId: row[1],
        bookTitle: row[2],
        status: row[3] as ProcessingStatus,
        stage: row[4] as ProcessingStage,
        message: row[5] || undefined,
        duration: row[6] ? parseInt(row[6], 10) : undefined,
        provider: row[7] || undefined,
        outputUrl: row[8] || undefined,
      }));
  } catch (error) {
    console.error('Error getting book logs:', error);
    return [];
  }
}

/**
 * Get latest status for all books
 */
export async function getAllBookStatuses(): Promise<Record<string, ProcessingLog>> {
  try {
    const sheets = getSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DEFAULT_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    const statuses: Record<string, ProcessingLog> = {};
    
    // Get latest entry for each book (skip header)
    for (let i = rows.length - 1; i > 0; i--) {
      const row = rows[i];
      const bookId = row[1];
      
      if (!statuses[bookId]) {
        statuses[bookId] = {
          timestamp: new Date(row[0]),
          bookId: row[1],
          bookTitle: row[2],
          status: row[3] as ProcessingStatus,
          stage: row[4] as ProcessingStage,
          message: row[5] || undefined,
          duration: row[6] ? parseInt(row[6], 10) : undefined,
          provider: row[7] || undefined,
          outputUrl: row[8] || undefined,
        };
      }
    }
    
    return statuses;
  } catch (error) {
    console.error('Error getting all statuses:', error);
    return {};
  }
}

/**
 * Initialize the spreadsheet with headers
 */
export async function initializeSpreadsheet(): Promise<void> {
  try {
    const sheets = getSheetsClient();
    
    // Check if sheet exists
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = response.data.sheets?.some(
      sheet => sheet.properties?.title === DEFAULT_SHEET_NAME
    );

    if (!sheetExists) {
      // Create new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: DEFAULT_SHEET_NAME,
                },
              },
            },
          ],
        },
      });
    }

    // Add headers
    const headers = [
      'Timestamp',
      'Book ID',
      'Book Title',
      'Status',
      'Stage',
      'Message',
      'Duration (ms)',
      'AI Provider',
      'Output URL',
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DEFAULT_SHEET_NAME}!A1:I1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });

    console.log('Spreadsheet initialized successfully');
  } catch (error) {
    console.error('Error initializing spreadsheet:', error);
    throw error;
  }
}

/**
 * Update processing status for a book
 */
export async function updateBookStatus(
  bookId: string,
  updates: Partial<Omit<ProcessingLog, 'bookId' | 'timestamp'>>
): Promise<void> {
  try {
    const sheets = getSheetsClient();
    
    // Find the row for this book
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DEFAULT_SHEET_NAME}!A:I`,
    });

    const rows = response.data.values || [];
    let rowIndex = -1;
    
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] === bookId) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex === -1) {
      console.warn(`No existing log found for book ${bookId}`);
      return;
    }

    // Update specific cells
    const updates_array: { range: string; values: string[][] }[] = [];
    
    if (updates.status) {
      updates_array.push({
        range: `${DEFAULT_SHEET_NAME}!D${rowIndex + 1}`,
        values: [[updates.status]],
      });
    }
    
    if (updates.stage) {
      updates_array.push({
        range: `${DEFAULT_SHEET_NAME}!E${rowIndex + 1}`,
        values: [[updates.stage]],
      });
    }

    if (updates_array.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: updates_array,
        },
      });
    }
  } catch (error) {
    console.error('Error updating book status:', error);
    throw error;
  }
}

/**
 * Get processing statistics
 */
export async function getProcessingStats(): Promise<{
  total: number;
  completed: number;
  failed: number;
  processing: number;
  pending: number;
  averageDuration: number;
}> {
  try {
    const statuses = await getAllBookStatuses();
    const logs = Object.values(statuses);
    
    const completed = logs.filter(l => l.status === 'completed').length;
    const failed = logs.filter(l => l.status === 'failed').length;
    const processing = logs.filter(l => l.status === 'processing').length;
    const pending = logs.filter(l => l.status === 'pending').length;
    
    const durations = logs
      .filter(l => l.duration)
      .map(l => l.duration!);
    
    const averageDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    return {
      total: logs.length,
      completed,
      failed,
      processing,
      pending,
      averageDuration,
    };
  } catch (error) {
    console.error('Error getting processing stats:', error);
    return {
      total: 0,
      completed: 0,
      failed: 0,
      processing: 0,
      pending: 0,
      averageDuration: 0,
    };
  }
}

// Export default
export default {
  logStatus: logProcessingStatus,
  getBookLogs: getBookProcessingLogs,
  getAllStatuses: getAllBookStatuses,
  initialize: initializeSpreadsheet,
  updateStatus: updateBookStatus,
  getStats: getProcessingStats,
  SPREADSHEET_ID,
};
