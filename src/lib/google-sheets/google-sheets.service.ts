import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis';

/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API
 */
export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private sheets: sheets_v4.Sheets;

  private constructor() {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  /**
   * Fetch data from a specific sheet
   */
  async getSheetData(spreadsheetId: string, range: string): Promise<any[]> {
    try {
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
      const data = values.slice(1).map(row => {
        const item: any = {};
        headers.forEach((header, index) => {
          item[header] = row[index];
        });
        return item;
      });

      return data;
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw new Error(`Failed to fetch sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update data in a specific sheet
   */
  async updateSheetData(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error('Error updating sheet data:', error);
      throw new Error(`Failed to update sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Append data to a specific sheet
   */
  async appendSheetData(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });
    } catch (error) {
      console.error('Error appending sheet data:', error);
      throw new Error(`Failed to append sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get metadata about a spreadsheet
   */
  async getSpreadsheetMetadata(spreadsheetId: string): Promise<sheets_v4.Schema$Spreadsheet> {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching spreadsheet metadata:', error);
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
