/**
 * AI Data Processor for PPSDM KMITS Automation
 * Features: Data cleaning, duplicate detection, format standardization, validation
 * Integrates with: AI Service, Google Sheets API
 */

import { aiService, AIRequest } from '../ai/ai-service';
import { google } from 'googleapis';

// Types for data processing
export interface SpreadsheetData {
  spreadsheetId: string;
  sheetName: string;
  data: Record<string, any>[];
  headers: string[];
}

export interface ProcessedData {
  original: Record<string, any>[];
  cleaned: Record<string, any>[];
  duplicatesRemoved: number;
  errorsFixed: number;
  insights: DataInsight[];
}

export interface DataInsight {
  type: 'warning' | 'info' | 'success' | 'error';
  message: string;
  field?: string;
  row?: number;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  row: number;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ValidationWarning {
  field: string;
  row: number;
  message: string;
  suggestion?: string;
}

export interface CleaningOptions {
  removeEmptyRows?: boolean;
  trimWhitespace?: boolean;
  standardizeDates?: boolean;
  validateEmails?: boolean;
  validateNIM?: boolean;
  removeDuplicates?: boolean;
  duplicateFields?: string[];
}

class AIProcessor {
  private sheetsClient: any = null;

  /**
   * Initialize Google Sheets client
   */
  private async getSheetsClient() {
    if (this.sheetsClient) return this.sheetsClient;

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.sheetsClient = google.sheets({
      version: 'v4',
      auth,
    });

    return this.sheetsClient;
  }

  /**
   * Fetch data from Google Sheets
   */
  async fetchSpreadsheetData(
    spreadsheetId: string,
    sheetName: string,
    range?: string
  ): Promise<SpreadsheetData> {
    try {
      const sheets = await this.getSheetsClient();
      const dataRange = range || `${sheetName}!A:Z`;

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: dataRange,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        throw new Error('No data found in spreadsheet');
      }

      const headers = rows[0].map((h: string) => h.trim());
      const data: Record<string, any>[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row: Record<string, any> = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = rows[i][j] || '';
        }
        data.push(row);
      }

      return {
        spreadsheetId,
        sheetName,
        data,
        headers,
      };
    } catch (error) {
      throw new Error(`Failed to fetch spreadsheet data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean and process data
   */
  async processData(
    spreadsheetData: SpreadsheetData,
    options: CleaningOptions = {}
  ): Promise<ProcessedData> {
    const {
      removeEmptyRows = true,
      trimWhitespace = true,
      standardizeDates = true,
      validateEmails = true,
      validateNIM = true,
      removeDuplicates = true,
      duplicateFields = ['email', 'nim', 'nama'],
    } = options;

    let cleanedData = [...spreadsheetData.data];
    const insights: DataInsight[] = [];
    let duplicatesRemoved = 0;
    let errorsFixed = 0;

    // Remove empty rows
    if (removeEmptyRows) {
      const beforeLength = cleanedData.length;
      cleanedData = cleanedData.filter(row => {
        const hasData = Object.values(row).some(
          val => val !== null && val !== undefined && val.toString().trim() !== ''
        );
        return hasData;
      });
      const removed = beforeLength - cleanedData.length;
      if (removed > 0) {
        insights.push({
          type: 'info',
          message: `Removed ${removed} empty rows`,
        });
      }
    }

    // Trim whitespace
    if (trimWhitespace) {
      cleanedData = cleanedData.map(row => {
        const cleaned: Record<string, any> = {};
        for (const [key, value] of Object.entries(row)) {
          if (typeof value === 'string') {
            cleaned[key] = value.trim();
          } else {
            cleaned[key] = value;
          }
        }
        return cleaned;
      });
    }

    // Standardize dates
    if (standardizeDates) {
      cleanedData = cleanedData.map((row, index) => {
        const cleaned = { ...row };
        for (const [key, value] of Object.entries(row)) {
          if (this.isDateField(key) && value) {
            const standardized = this.standardizeDate(value);
            if (standardized !== value) {
              cleaned[key] = standardized;
              errorsFixed++;
              insights.push({
                type: 'info',
                message: `Standardized date format for ${key}`,
                field: key,
                row: index + 2, // +2 for header and 0-index
              });
            }
          }
        }
        return cleaned;
      });
    }

    // Validate emails
    if (validateEmails) {
      cleanedData.forEach((row, index) => {
        for (const [key, value] of Object.entries(row)) {
          if (this.isEmailField(key) && value) {
            const isValid = this.validateEmail(value);
            if (!isValid) {
              insights.push({
                type: 'warning',
                message: `Invalid email format: ${value}`,
                field: key,
                row: index + 2,
                suggestion: 'Please check email format (e.g., user@domain.com)',
              });
            }
          }
        }
      });
    }

    // Validate NIM
    if (validateNIM) {
      cleanedData.forEach((row, index) => {
        for (const [key, value] of Object.entries(row)) {
          if (this.isNIMField(key) && value) {
            const isValid = this.validateNIM(value);
            if (!isValid) {
              insights.push({
                type: 'warning',
                message: `Invalid NIM format: ${value}`,
                field: key,
                row: index + 2,
                suggestion: 'NIM should be a valid ITS student ID (e.g., 5023201001)',
              });
            }
          }
        }
      });
    }

    // Remove duplicates
    if (removeDuplicates && duplicateFields.length > 0) {
      const seen = new Set<string>();
      const uniqueData: Record<string, any>[] = [];

      for (const row of cleanedData) {
        const key = duplicateFields
          .map(field => row[field]?.toString().toLowerCase().trim() || '')
          .join('|');

        if (!seen.has(key)) {
          seen.add(key);
          uniqueData.push(row);
        } else {
          duplicatesRemoved++;
        }
      }

      cleanedData = uniqueData;

      if (duplicatesRemoved > 0) {
        insights.push({
          type: 'success',
          message: `Removed ${duplicatesRemoved} duplicate entries`,
        });
      }
    }

    // Generate AI insights
    const aiInsights = await this.generateAIInsights(cleanedData, spreadsheetData.headers);
    insights.push(...aiInsights);

    return {
      original: spreadsheetData.data,
      cleaned: cleanedData,
      duplicatesRemoved,
      errorsFixed,
      insights,
    };
  }

  /**
   * Validate data
   */
  async validateData(
    spreadsheetData: SpreadsheetData
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    spreadsheetData.data.forEach((row, index) => {
      for (const [key, value] of Object.entries(row)) {
        // Check for required fields
        if (this.isRequiredField(key) && !value) {
          errors.push({
            field: key,
            row: index + 2,
            message: `Required field is empty`,
            severity: 'critical',
          });
        }

        // Validate email format
        if (this.isEmailField(key) && value) {
          if (!this.validateEmail(value)) {
            errors.push({
              field: key,
              row: index + 2,
              message: `Invalid email format`,
              severity: 'high',
            });
          }
        }

        // Validate NIM format
        if (this.isNIMField(key) && value) {
          if (!this.validateNIM(value)) {
            errors.push({
              field: key,
              row: index + 2,
              message: `Invalid NIM format`,
              severity: 'high',
            });
          }
        }

        // Check for suspicious data
        if (value && typeof value === 'string') {
          if (value.includes('test') || value.includes('TEST')) {
            warnings.push({
              field: key,
              row: index + 2,
              message: `Contains test data`,
              suggestion: 'Consider removing test data before production',
            });
          }
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Generate AI insights from data
   */
  private async generateAIInsights(
    data: Record<string, any>[],
    headers: string[]
  ): Promise<DataInsight[]> {
    const insights: DataInsight[] = [];

    try {
      // Prepare data summary for AI
      const dataSummary = {
        totalRows: data.length,
        columns: headers,
        sampleData: data.slice(0, 3),
      };

      const prompt = `
Analyze this spreadsheet data and provide intelligent insights:
${JSON.stringify(dataSummary, null, 2)}

Provide insights in the following format:
1. Data quality issues
2. Patterns or trends
3. Recommendations for improvement
4. Potential data inconsistencies

Keep the response concise and actionable.
`;

      const request: AIRequest = {
        prompt,
        maxTokens: 1000,
        temperature: 0.3,
        useCache: true,
        priority: 'normal',
      };

      const response = await aiService.generate(request);

      // Parse AI response and convert to insights
      const lines = response.content.split('\n').filter(line => line.trim());
      lines.forEach(line => {
        if (line.includes('issue') || line.includes('error')) {
          insights.push({
            type: 'warning',
            message: line.trim(),
          });
        } else if (line.includes('recommendation') || line.includes('improvement')) {
          insights.push({
            type: 'info',
            message: line.trim(),
          });
        } else if (line.includes('pattern') || line.includes('trend')) {
          insights.push({
            type: 'success',
            message: line.trim(),
          });
        }
      });
    } catch (error) {
      }

    return insights;
  }

  /**
   * Write processed data back to spreadsheet
   */
  async writeProcessedData(
    spreadsheetId: string,
    sheetName: string,
    data: Record<string, any>[],
    headers: string[]
  ): Promise<void> {
    try {
      const sheets = await this.getSheetsClient();

      // Clear existing data
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      // Prepare data with headers
      const values = [headers];
      data.forEach(row => {
        const rowValues = headers.map(header => row[header] || '');
        values.push(rowValues);
      });

      // Write data
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      } catch (error) {
      throw new Error(`Failed to write processed data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if field is a date field
   */
  private isDateField(fieldName: string): boolean {
    const dateFields = ['tanggal', 'date', 'waktu', 'time', 'tgl', 'created_at', 'updated_at', 'deadline', 'due_date'];
    return dateFields.some(df => fieldName.toLowerCase().includes(df));
  }

  /**
   * Check if field is an email field
   */
  private isEmailField(fieldName: string): boolean {
    const emailFields = ['email', 'mail', 'surat'];
    return emailFields.some(ef => fieldName.toLowerCase().includes(ef));
  }

  /**
   * Check if field is a NIM field
   */
  private isNIMField(fieldName: string): boolean {
    const nimFields = ['nim', 'student_id', 'mahasiswa_id'];
    return nimFields.some(nf => fieldName.toLowerCase().includes(nf));
  }

  /**
   * Check if field is required
   */
  private isRequiredField(fieldName: string): boolean {
    const requiredFields = ['nama', 'name', 'nim', 'email'];
    return requiredFields.some(rf => fieldName.toLowerCase().includes(rf));
  }

  /**
   * Standardize date format
   */
  private standardizeDate(value: any): string {
    if (!value) return '';

    const dateStr = value.toString().trim();

    // Try to parse various date formats
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      return dateStr; // Return original if parsing fails
    }

    // Return ISO format
    return date.toISOString().split('T')[0];
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate NIM format (ITS student ID)
   */
  private validateNIM(nim: string): boolean {
    // ITS NIM format: 10 digits, starts with 5 (undergraduate)
    const nimRegex = /^5\d{9}$/;
    return nimRegex.test(nim.toString().trim());
  }

  /**
   * Get data statistics
   */
  getDataStatistics(data: Record<string, any>[]): {
    totalRows: number;
    totalColumns: number;
    emptyCells: number;
    completeness: number;
  } {
    if (data.length === 0) {
      return {
        totalRows: 0,
        totalColumns: 0,
        emptyCells: 0,
        completeness: 0,
      };
    }

    const totalRows = data.length;
    const totalColumns = Object.keys(data[0]).length;
    let emptyCells = 0;

    data.forEach(row => {
      Object.values(row).forEach(value => {
        if (!value || value.toString().trim() === '') {
          emptyCells++;
        }
      });
    });

    const totalCells = totalRows * totalColumns;
    const completeness = totalCells > 0 ? ((totalCells - emptyCells) / totalCells) * 100 : 0;

    return {
      totalRows,
      totalColumns,
      emptyCells,
      completeness: Math.round(completeness * 100) / 100,
    };
  }
}

// Export singleton instance
export const aiProcessor = new AIProcessor();

// Export class for testing
export { AIProcessor };
