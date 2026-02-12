// @vitest-environment node

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GoogleSheetsService } from '../src/lib/google-sheets/google-sheets.service';
import { google } from 'googleapis';

// Mock googleapis
vi.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: vi.fn().mockImplementation(() => ({
        getClient: vi.fn().mockResolvedValue({})
      }))
    },
    sheets: vi.fn().mockImplementation(() => ({
      spreadsheets: {
        values: {
          get: vi.fn(),
          update: vi.fn(),
          append: vi.fn()
        },
        get: vi.fn()
      }
    }))
  }
}));

describe('GoogleSheetsService', () => {
  let service: GoogleSheetsService;
  let mockSheets: any;

  beforeEach(async () => {
    // Reset environment
    process.env.GOOGLE_APPLICATION_CREDENTIALS = 'test-credentials.json';

    // Get mock instance from the mocked module
    mockSheets = google.sheets('v4');

    // Create service instance
    // We need to reset the singleton instance to ensure fresh initialization
    // But instance is private static.
    // However, if we just call getInstance(), it returns the instance.
    // If we want to ensure it uses the NEW mock, we might need to reset the module registry or relying on vi.mock works.
    // Since GoogleSheetsService imports googleapis dynamically, we hope vi.mock works for dynamic imports.
    // To be safe, we can try to force re-import or just rely on the fact that 'google' is mocked globally.
    service = await GoogleSheetsService.getInstance();

    // We need to inject the mockSheets into the service if possible, or ensure service uses the mocked google.
    // Since service.sheets is private, we can't set it directly easily without casting.
    (service as any).sheets = mockSheets;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', async () => {
      const instance1 = await GoogleSheetsService.getInstance();
      const instance2 = await GoogleSheetsService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('getSheetData', () => {
    it('should fetch and parse sheet data correctly', async () => {
      const mockData = [
        ['Activity_ID', 'Activity_Name', 'Date_Time', 'Location'],
        ['ACT-2024-001', 'Weekly Meeting', '2024-01-15 10:00', 'Room A'],
        ['ACT-2024-002', 'Workshop', '2024-01-20 14:00', 'Room B']
      ];

      mockSheets.spreadsheets.values.get.mockResolvedValue({
        data: { values: mockData }
      });

      const result = await service.getSheetData('test-spreadsheet-id', 'Sheet1');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        Activity_ID: 'ACT-2024-001',
        Activity_Name: 'Weekly Meeting',
        Date_Time: '2024-01-15 10:00',
        Location: 'Room A'
      });
      expect(mockSheets.spreadsheets.values.get).toHaveBeenCalledWith({
        spreadsheetId: 'test-spreadsheet-id',
        range: 'Sheet1'
      });
    });

    it('should return empty array for empty sheet', async () => {
      mockSheets.spreadsheets.values.get.mockResolvedValue({
        data: { values: [] }
      });

      const result = await service.getSheetData('test-spreadsheet-id', 'Sheet1');
      expect(result).toEqual([]);
    });

    it('should handle missing values gracefully', async () => {
      const mockData = [
        ['Activity_ID', 'Activity_Name', 'Date_Time'],
        ['ACT-2024-001', 'Weekly Meeting', '2024-01-15 10:00'],
        ['ACT-2024-002', '', '2024-01-20 14:00']
      ];

      mockSheets.spreadsheets.values.get.mockResolvedValue({
        data: { values: mockData }
      });

      const result = await service.getSheetData('test-spreadsheet-id', 'Sheet1');
      expect(result[1].Activity_Name).toBe('');
    });

    it('should throw error on API failure', async () => {
      mockSheets.spreadsheets.values.get.mockRejectedValue(
        new Error('API Error: Invalid spreadsheet ID')
      );

      await expect(
        service.getSheetData('invalid-id', 'Sheet1')
      ).rejects.toThrow('Failed to fetch sheet data');
    });
  });

  describe('updateSheetData', () => {
    it('should update sheet data successfully', async () => {
      const values = [
        ['ACT-2024-001', 'Updated Meeting', '2024-01-15 10:00', 'Room A']
      ];

      mockSheets.spreadsheets.values.update.mockResolvedValue({ data: {} });

      await service.updateSheetData('test-spreadsheet-id', 'Sheet1!A1:D1', values);

      expect(mockSheets.spreadsheets.values.update).toHaveBeenCalledWith({
        spreadsheetId: 'test-spreadsheet-id',
        range: 'Sheet1!A1:D1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
    });

    it('should throw error on update failure', async () => {
      mockSheets.spreadsheets.values.update.mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(
        service.updateSheetData('test-spreadsheet-id', 'Sheet1!A1:D1', [])
      ).rejects.toThrow('Failed to update sheet data');
    });
  });

  describe('appendSheetData', () => {
    it('should append data to sheet successfully', async () => {
      const values = [
        ['ACT-2024-003', 'New Activity', '2024-01-25 10:00', 'Room C']
      ];

      mockSheets.spreadsheets.values.append.mockResolvedValue({ data: {} });

      await service.appendSheetData('test-spreadsheet-id', 'Sheet1', values);

      expect(mockSheets.spreadsheets.values.append).toHaveBeenCalledWith({
        spreadsheetId: 'test-spreadsheet-id',
        range: 'Sheet1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values }
      });
    });

    it('should throw error on append failure', async () => {
      mockSheets.spreadsheets.values.append.mockRejectedValue(
        new Error('Quota exceeded')
      );

      await expect(
        service.appendSheetData('test-spreadsheet-id', 'Sheet1', [])
      ).rejects.toThrow('Failed to append sheet data');
    });
  });

  describe('getSpreadsheetMetadata', () => {
    it('should fetch spreadsheet metadata', async () => {
      const mockMetadata = {
        spreadsheetId: 'test-spreadsheet-id',
        sheets: [
          { properties: { sheetId: 0, title: 'Sheet1' } },
          { properties: { sheetId: 1, title: 'Sheet2' } }
        ]
      };

      mockSheets.spreadsheets.get.mockResolvedValue({ data: mockMetadata });

      const result = await service.getSpreadsheetMetadata('test-spreadsheet-id');

      expect(result).toEqual(mockMetadata);
      expect(mockSheets.spreadsheets.get).toHaveBeenCalledWith({
        spreadsheetId: 'test-spreadsheet-id'
      });
    });

    it('should throw error on metadata fetch failure', async () => {
      mockSheets.spreadsheets.get.mockRejectedValue(
        new Error('Spreadsheet not found')
      );

      await expect(
        service.getSpreadsheetMetadata('invalid-id')
      ).rejects.toThrow('Failed to fetch spreadsheet metadata');
    });
  });

  describe('getSheets', () => {
    it('should return list of sheets', async () => {
      const mockMetadata = {
        sheets: [
          { properties: { sheetId: 0, title: 'Activities' } },
          { properties: { sheetId: 1, title: 'Members' } },
          { properties: { sheetId: 2, title: 'Finances' } }
        ]
      };

      mockSheets.spreadsheets.get.mockResolvedValue({ data: mockMetadata });

      const result = await service.getSheets('test-spreadsheet-id');

      expect(result).toHaveLength(3);
      expect(result[0].properties.title).toBe('Activities');
    });

    it('should return empty array if no sheets', async () => {
      mockSheets.spreadsheets.get.mockResolvedValue({
        data: { sheets: undefined }
      });

      const result = await service.getSheets('test-spreadsheet-id');
      expect(result).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockSheets.spreadsheets.values.get.mockRejectedValue(
        new Error('Network timeout')
      );

      await expect(
        service.getSheetData('test-spreadsheet-id', 'Sheet1')
      ).rejects.toThrow('Failed to fetch sheet data');
    });

    it('should handle authentication errors', async () => {
      mockSheets.spreadsheets.values.get.mockRejectedValue(
        new Error('Invalid credentials')
      );

      await expect(
        service.getSheetData('test-spreadsheet-id', 'Sheet1')
      ).rejects.toThrow('Failed to fetch sheet data');
    });

    it('should handle rate limit errors', async () => {
      mockSheets.spreadsheets.values.get.mockRejectedValue(
        new Error('Rate limit exceeded')
      );

      await expect(
        service.getSheetData('test-spreadsheet-id', 'Sheet1')
      ).rejects.toThrow('Failed to fetch sheet data');
    });
  });
});
