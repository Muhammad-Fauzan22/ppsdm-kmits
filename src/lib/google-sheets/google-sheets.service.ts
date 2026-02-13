import type { sheets_v4 } from 'googleapis';
import { getFromRedis, saveToRedis, deleteFromRedis } from '../redis';

/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API
 * NOTE: This service only works on server-side due to Node.js dependencies
 */
export class GoogleSheetsService {
  private static instance: GoogleSheetsService | null = null;
  private sheets: sheets_v4.Sheets | null = null;

  private constructor() {
    // Constructor is private - use getInstance() instead
  }

  /**
   * Get singleton instance (server-side only)
   * @throws Error if called from client-side
   */
  public static async getInstance(): Promise<GoogleSheetsService> {
    // Check if running on server-side
    if (typeof window !== 'undefined') {
      throw new Error('GoogleSheetsService can only be used on server-side');
    }

    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
      await GoogleSheetsService.instance.initialize();
    }
    return GoogleSheetsService.instance;
  }

  /**
   * Initialize the service (lazy load dependencies)
   */
  private async initialize(): Promise<void> {
    try {
      // Dynamic import to avoid webpack bundling issues
      const { google } = await import('googleapis');

      let auth;

      // Option 1: Base64-encoded JSON credentials (preferred for cloud deployments)
      const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS_JSON;
      if (credentialsJson) {
        try {
          const decoded = Buffer.from(credentialsJson, 'base64').toString('utf-8');
          const credentials = JSON.parse(decoded);
          auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
          });
        } catch (parseError) {
          console.error('Failed to parse GOOGLE_SHEETS_CREDENTIALS_JSON, falling back to keyFile');
        }
      }

      // Option 2: Key file path (local development)
      if (!auth) {
        auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json',
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
      }

      this.sheets = google.sheets({ version: 'v4', auth });
    } catch (error) {
      throw new Error(`Google Sheets service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch data from a specific sheet
   */
  async getSheetData(spreadsheetId: string, range: string): Promise<any[]> {
    if (!this.sheets) {
      throw new Error('Google Sheets service not initialized');
    }

    try {
      const cacheKey = `sheet:${spreadsheetId}:${range}`;
      const cached = await getFromRedis<any[]>(cacheKey);

      if (cached) {
        return cached;
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const values = response.data.values || [];

      if (values.length === 0) {
        return [];
      }

      // Convert to object format using header row
      const headers = values[0];
      const data = values.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header: string, index: number) => {
          item[header] = row[index];
        });
        return item;
      });

      await saveToRedis(cacheKey, data, 300); // 5 mins TTL
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update data in a specific sheet
   */
  async updateSheetData(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    if (!this.sheets) {
      throw new Error('Google Sheets service not initialized');
    }

    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      // Invalidate cache
      const cacheKey = `sheet:${spreadsheetId}:${range}`;
      await deleteFromRedis(cacheKey);
    } catch (error) {
      throw new Error(`Failed to update sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Append data to a specific sheet
   */
  async appendSheetData(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    if (!this.sheets) {
      throw new Error('Google Sheets service not initialized');
    }

    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      // Invalidate cache
      const cacheKey = `sheet:${spreadsheetId}:${range}`;
      await deleteFromRedis(cacheKey);
    } catch (error) {
      throw new Error(`Failed to append sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get metadata about a spreadsheet
   */
  async getSpreadsheetMetadata(spreadsheetId: string): Promise<sheets_v4.Schema$Spreadsheet> {
    if (!this.sheets) {
      throw new Error('Google Sheets service not initialized');
    }

    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch spreadsheet metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all sheets in a spreadsheet
   */
  async getSheets(spreadsheetId: string): Promise<sheets_v4.Schema$Sheet[]> {
    const metadata = await this.getSpreadsheetMetadata(spreadsheetId);
    return metadata.sheets || [];
  }
}
