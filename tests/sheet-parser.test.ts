/**
 * Sheet Parser Engine Tests
 * Unit tests for Sheet Parser Engine
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SheetParserEngine } from '../src/lib/google-sheets/sheet-parser-engine';
import { GoogleSheetsService } from '../src/lib/google-sheets/google-sheets.service';

// Mock GoogleSheetsService
vi.mock('../src/lib/google-sheets/google-sheets.service');

describe('SheetParserEngine', () => {
  let parser: SheetParserEngine;
  let mockSheetsService: any;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Create mock service
    mockSheetsService = {
      getSheetData: vi.fn()
    };

    // Mock getInstance to return our mock
    vi.mocked(GoogleSheetsService.getInstance).mockReturnValue(mockSheetsService);

    // Create parser instance
    parser = new SheetParserEngine();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('parseSheetData - Activities Sheet', () => {
    it('should parse valid activities data', async () => {
      const mockData = [
        {
          Activity_ID: 'ACT-2024-001',
          Activity_Name: 'Weekly Meeting',
          Date_Time: '2024-01-15 10:00',
          Location: 'Room A',
          Organizer: 'John Doe',
          Participants_List: 'Alice|Bob|Charlie',
          Budget_Allocated: '500000',
          Budget_Used: '450000',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'activities');

      expect(result).toHaveLength(1);
      expect(result[0]._isValid).toBe(true);
      expect(result[0].Activity_ID).toBe('ACT-2024-001');
      expect(result[0]._validationErrors).toHaveLength(0);
    });

    it('should validate Activity_ID pattern', async () => {
      const mockData = [
        {
          Activity_ID: 'INVALID-ID',
          Activity_Name: 'Test Activity',
          Date_Time: '2024-01-15 10:00',
          Location: 'Room A',
          Organizer: 'John Doe',
          Budget_Allocated: '500000',
          Budget_Used: '450000',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'activities');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Activity_ID does not match required format');
    });

    it('should validate required fields', async () => {
      const mockData = [
        {
          Activity_ID: 'ACT-2024-001',
          Activity_Name: '',
          Date_Time: '2024-01-15 10:00',
          Location: 'Room A',
          Organizer: 'John Doe',
          Budget_Allocated: '500000',
          Budget_Used: '450000',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'activities');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Activity_Name is required');
    });

    it('should validate budget range', async () => {
      const mockData = [
        {
          Activity_ID: 'ACT-2024-001',
          Activity_Name: 'Test Activity',
          Date_Time: '2024-01-15 10:00',
          Location: 'Room A',
          Organizer: 'John Doe',
          Budget_Allocated: '15000000', // Exceeds max
          Budget_Used: '450000',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'activities');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Budget_Allocated must be at most 10000000');
    });

    it('should validate allowed status values', async () => {
      const mockData = [
        {
          Activity_ID: 'ACT-2024-001',
          Activity_Name: 'Test Activity',
          Date_Time: '2024-01-15 10:00',
          Location: 'Room A',
          Organizer: 'John Doe',
          Budget_Allocated: '500000',
          Budget_Used: '450000',
          Status: 'InvalidStatus'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'activities');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Status must be one of: Planning, Active, Completed, Cancelled');
    });
  });

  describe('parseSheetData - Members Sheet', () => {
    it('should parse valid members data', async () => {
      const mockData = [
        {
          NIM: '5023201001',
          Full_Name: 'Alice Johnson',
          Email: 'alice@student.its.ac.id',
          Year: '2023',
          Department: 'Teknik Mesin',
          Position: 'Anggota Biasa',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'members');

      expect(result).toHaveLength(1);
      expect(result[0]._isValid).toBe(true);
      expect(result[0].NIM).toBe('5023201001');
    });

    it('should validate NIM pattern (10 digits)', async () => {
      const mockData = [
        {
          NIM: '123', // Invalid pattern
          Full_Name: 'Alice Johnson',
          Email: 'alice@student.its.ac.id',
          Year: '2023',
          Department: 'Teknik Mesin',
          Position: 'Anggota Biasa',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'members');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field NIM does not match required format');
    });

    it('should validate email domain', async () => {
      const mockData = [
        {
          NIM: '5023201001',
          Full_Name: 'Alice Johnson',
          Email: 'alice@gmail.com', // Invalid domain
          Year: '2023',
          Department: 'Teknik Mesin',
          Position: 'Anggota Biasa',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'members');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Email must belong to domain @student.its.ac.id');
    });

    it('should validate year range', async () => {
      const mockData = [
        {
          NIM: '5023201001',
          Full_Name: 'Alice Johnson',
          Email: 'alice@student.its.ac.id',
          Year: '1999', // Below min
          Department: 'Teknik Mesin',
          Position: 'Anggota Biasa',
          Status: 'Active'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'members');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Year must be at least 2000');
    });
  });

  describe('parseSheetData - Finances Sheet', () => {
    it('should parse valid finances data', async () => {
      const mockData = [
        {
          Transaction_ID: 'TRX-2024-001',
          Date: '2024-01-15',
          Description: 'Office Supplies',
          Category: 'Operational',
          Amount: '150000',
          Payment_Method: 'Transfer',
          Verified: 'true'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'finances');

      expect(result).toHaveLength(1);
      expect(result[0]._isValid).toBe(true);
      expect(result[0].Transaction_ID).toBe('TRX-2024-001');
    });

    it('should validate Transaction_ID pattern', async () => {
      const mockData = [
        {
          Transaction_ID: 'INVALID',
          Date: '2024-01-15',
          Description: 'Office Supplies',
          Category: 'Operational',
          Amount: '150000',
          Payment_Method: 'Transfer',
          Verified: 'true'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'finances');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Transaction_ID does not match required format');
    });

    it('should validate date format', async () => {
      const mockData = [
        {
          Transaction_ID: 'TRX-2024-001',
          Date: '15/01/2024', // Invalid format
          Description: 'Office Supplies',
          Category: 'Operational',
          Amount: '150000',
          Payment_Method: 'Transfer',
          Verified: 'true'
        }
      ];

      mockSheetsService.getSheetData.mockResolvedValue(mockData);

      const result = await parser.parseSheetData('test-id', 'finances');

      expect(result[0]._isValid).toBe(false);
      expect(result[0]._validationErrors).toContain('Field Date must be of type date');
    });
  });

  describe('transformDataForWebsite', () => {
    it('should transform budget fields to numbers', () => {
      const mockData = [
        {
          Budget_Allocated: '500000',
          Budget_Used: '450000',
          _isValid: true
        }
      ];

      const result = parser.transformDataForWebsite(mockData, 'activities');

      expect(result[0].Budget_Allocated).toBe(500000);
      expect(result[0].Budget_Used).toBe(450000);
    });

    it('should transform date fields to ISO format', () => {
      const mockData = [
        {
          Date: '2024-01-15',
          Date_Time: '2024-01-15 10:00',
          _isValid: true
        }
      ];

      const result = parser.transformDataForWebsite(mockData, 'activities');

      expect(result[0].Date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(result[0].Date_Time).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('should transform boolean fields', () => {
      const mockData = [
        {
          Verified: 'true',
          Active: '1',
          _isValid: true
        }
      ];

      const result = parser.transformDataForWebsite(mockData, 'finances');

      expect(result[0].Verified).toBe(true);
      expect(result[0].Active).toBe(true);
    });

    it('should transform list fields to arrays', () => {
      const mockData = [
        {
          Participants_List: 'Alice|Bob|Charlie',
          Skills: 'JavaScript|Python|React',
          _isValid: true
        }
      ];

      const result = parser.transformDataForWebsite(mockData, 'activities');

      expect(result[0].Participants_List).toEqual(['Alice', 'Bob', 'Charlie']);
      expect(result[0].Skills).toEqual(['JavaScript', 'Python', 'React']);
    });

    it('should filter out invalid records', () => {
      const mockData = [
        { _isValid: true, Name: 'Valid' },
        { _isValid: false, Name: 'Invalid' },
        { _isValid: true, Name: 'Valid 2' }
      ];

      const result = parser.transformDataForWebsite(mockData, 'activities');

      expect(result).toHaveLength(2);
      expect(result.every(item => item._isValid)).toBe(true);
    });
  });

  describe('getValidationReport', () => {
    it('should generate validation report', () => {
      const mockData = [
        { _isValid: true, _rawIndex: 0, _validationErrors: [] },
        { _isValid: false, _rawIndex: 1, _validationErrors: ['Field Name is required', 'Field Email is invalid'] },
        { _isValid: false, _rawIndex: 2, _validationErrors: ['Field Age is required'] },
        { _isValid: true, _rawIndex: 3, _validationErrors: [] }
      ];

      const report = parser.getValidationReport(mockData);

      expect(report.totalRecords).toBe(4);
      expect(report.validRecords).toBe(2);
      expect(report.invalidRecords).toBe(2);
      expect(report.errorsByField).toEqual({
        Name: 1,
        Email: 1,
        Age: 1
      });
      expect(report.detailedErrors).toHaveLength(2);
    });

    it('should handle empty data', () => {
      const report = parser.getValidationReport([]);

      expect(report.totalRecords).toBe(0);
      expect(report.validRecords).toBe(0);
      expect(report.invalidRecords).toBe(0);
      expect(report.errorsByField).toEqual({});
      expect(report.detailedErrors).toEqual([]);
    });
  });

  describe('generateId', () => {
    it('should generate new ID with sequential number', () => {
      const year = new Date().getFullYear();
      const existingIds = [`ACT-${year}-001`, `ACT-${year}-002`, `ACT-${year}-005`];
      const newId = parser.generateId('ACT', existingIds);

      expect(newId).toBe(`ACT-${year}-006`);
    });

    it('should generate first ID when no existing IDs', () => {
      const year = new Date().getFullYear();
      const newId = parser.generateId('ACT', []);

      expect(newId).toBe(`ACT-${year}-001`);
    });

    it('should handle different prefixes', () => {
      const year = new Date().getFullYear();
      const existingIds = [`TRX-${year}-001`, `TRX-${year}-002`];
      const newId = parser.generateId('TRX', existingIds);

      expect(newId).toBe(`TRX-${year}-003`);
    });

    it('should pad numbers with zeros', () => {
      const year = new Date().getFullYear();
      const existingIds = [`RES-${year}-099`];
      const newId = parser.generateId('RES', existingIds);

      expect(newId).toBe(`RES-${year}-100`);
    });
  });

  describe('validateType', () => {
    it('should validate string type', () => {
      expect(parser['validateType']('hello', 'string')).toBe(true);
      expect(parser['validateType'](123, 'string')).toBe(false);
    });

    it('should validate number type', () => {
      expect(parser['validateType']('123', 'number')).toBe(true);
      expect(parser['validateType'](123, 'number')).toBe(true);
      expect(parser['validateType']('abc', 'number')).toBe(false);
    });

    it('should validate boolean type', () => {
      expect(parser['validateType']('true', 'boolean')).toBe(true);
      expect(parser['validateType']('false', 'boolean')).toBe(true);
      expect(parser['validateType']('1', 'boolean')).toBe(true);
      expect(parser['validateType']('0', 'boolean')).toBe(true);
      expect(parser['validateType']('yes', 'boolean')).toBe(true);
      expect(parser['validateType']('no', 'boolean')).toBe(true);
      expect(parser['validateType']('invalid', 'boolean')).toBe(false);
    });

    it('should validate email type', () => {
      expect(parser['validateType']('test@example.com', 'email')).toBe(true);
      expect(parser['validateType']('invalid-email', 'email')).toBe(false);
    });

    it('should validate date type', () => {
      expect(parser['validateType']('2024-01-15', 'date')).toBe(true);
      expect(parser['validateType']('invalid-date', 'date')).toBe(false);
    });
  });
});
