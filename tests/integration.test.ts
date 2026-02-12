/**
 * Integration Tests
 * End-to-end tests for PPSDM KMITS system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock all services
const mockGoogleSheetsService = {
  getSheetData: vi.fn(),
  updateSheetData: vi.fn(),
  appendSheetData: vi.fn(),
  getSheets: vi.fn()
};

const mockSheetParserEngine = {
  parseSheetData: vi.fn(),
  transformDataForWebsite: vi.fn(),
  getValidationReport: vi.fn()
};

const mockPageGenerator = {
  generateActivityPage: vi.fn(),
  generateMemberPage: vi.fn(),
  generateDashboardPage: vi.fn()
};

const mockAutomationEngine = {
  processSpreadsheetData: vi.fn(),
  generateInsights: vi.fn()
};

vi.mock('../src/lib/google-sheets/google-sheets.service', () => ({
  GoogleSheetsService: {
    getInstance: vi.fn(() => mockGoogleSheetsService)
  }
}));

vi.mock('../src/lib/google-sheets/sheet-parser-engine', () => ({
  SheetParserEngine: vi.fn(() => mockSheetParserEngine)
}));

vi.mock('../src/lib/website-generator/page-generator', () => ({
  default: mockPageGenerator
}));

vi.mock('../src/lib/automation', () => ({
  aiProcessor: mockAutomationEngine
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('End-to-End: Activity Management Flow', () => {
    it('should complete full activity lifecycle', async () => {
      // Step 1: Fetch activities from Google Sheets
      const rawActivities = [
        ['Activity_ID', 'Activity_Name', 'Date_Time', 'Location', 'Organizer', 'Budget_Allocated', 'Budget_Used', 'Status'],
        ['ACT-2024-001', 'Weekly Meeting', '2024-01-15 10:00', 'Room A', 'John Doe', '500000', '450000', 'Active'],
        ['ACT-2024-002', 'Workshop', '2024-01-20 14:00', 'Room B', 'Jane Smith', '750000', '600000', 'Completed']
      ];

      mockGoogleSheetsService.getSheetData.mockResolvedValue(
        rawActivities.slice(1).map(row => ({
          Activity_ID: row[0],
          Activity_Name: row[1],
          Date_Time: row[2],
          Location: row[3],
          Organizer: row[4],
          Budget_Allocated: row[5],
          Budget_Used: row[6],
          Status: row[7]
        }))
      );

      // Step 2: Parse and validate data
      const parsedActivities = [
        {
          Activity_ID: 'ACT-2024-001',
          Activity_Name: 'Weekly Meeting',
          Date_Time: '2024-01-15 10:00',
          Location: 'Room A',
          Organizer: 'John Doe',
          Budget_Allocated: 500000,
          Budget_Used: 450000,
          Status: 'Active',
          _isValid: true,
          _validationErrors: []
        },
        {
          Activity_ID: 'ACT-2024-002',
          Activity_Name: 'Workshop',
          Date_Time: '2024-01-20 14:00',
          Location: 'Room B',
          Organizer: 'Jane Smith',
          Budget_Allocated: 750000,
          Budget_Used: 600000,
          Status: 'Completed',
          _isValid: true,
          _validationErrors: []
        }
      ];

      mockSheetParserEngine.parseSheetData.mockResolvedValue(parsedActivities);

      // Step 3: Transform data for website
      const transformedActivities = parsedActivities.map(activity => ({
        ...activity,
        Date_Time: new Date(activity.Date_Time).toISOString()
      }));

      mockSheetParserEngine.transformDataForWebsite.mockReturnValue(transformedActivities);

      // Step 4: Generate pages
      const generatedPages = transformedActivities.map(activity => ({
        title: `${activity.Activity_Name} - PPSDM KMITS`,
        description: `Activity details for ${activity.Activity_Name}`,
        content: activity,
        metadata: { generatedAt: new Date().toISOString() }
      }));

      mockPageGenerator.generateActivityPage.mockImplementation((data) => ({
        title: `${data.Activity_Name} - PPSDM KMITS`,
        description: `Activity details for ${data.Activity_Name}`,
        content: data,
        metadata: { generatedAt: new Date().toISOString() }
      }));

      // Execute flow
      const spreadsheetId = 'test-spreadsheet-id';
      const sheetName = 'activities';

      // Fetch
      const fetchedData = await mockGoogleSheetsService.getSheetData(spreadsheetId, sheetName);
      expect(fetchedData).toHaveLength(2);

      // Parse
      const parsedData = await mockSheetParserEngine.parseSheetData(spreadsheetId, sheetName);
      expect(parsedData).toHaveLength(2);
      expect(parsedData.every(item => item._isValid)).toBe(true);

      // Transform
      const transformedData = mockSheetParserEngine.transformDataForWebsite(parsedData, sheetName);
      expect(transformedData).toHaveLength(2);

      // Generate pages
      const pages = await Promise.all(
        transformedData.map(activity => mockPageGenerator.generateActivityPage(activity))
      );
      expect(pages).toHaveLength(2);
      expect(pages[0].title).toBe('Weekly Meeting - PPSDM KMITS');
    });

    it('should handle activity creation and sync', async () => {
      const newActivity = {
        Activity_ID: 'ACT-2024-003',
        Activity_Name: 'New Event',
        Date_Time: '2024-02-01 10:00',
        Location: 'Room C',
        Organizer: 'Bob Johnson',
        Budget_Allocated: 300000,
        Budget_Used: 0,
        Status: 'Planning'
      };

      // Append to Google Sheets
      mockGoogleSheetsService.appendSheetData.mockResolvedValue(undefined);

      // Parse and validate
      const parsedActivity = {
        ...newActivity,
        _isValid: true,
        _validationErrors: []
      };

      mockSheetParserEngine.parseSheetData.mockResolvedValue([parsedActivity]);

      // Generate page
      const generatedPage = {
        title: 'New Event - PPSDM KMITS',
        description: 'Activity details for New Event',
        content: newActivity,
        metadata: { generatedAt: new Date().toISOString() }
      };

      mockPageGenerator.generateActivityPage.mockResolvedValue(generatedPage);

      // Execute
      await mockGoogleSheetsService.appendSheetData(
        'test-spreadsheet-id',
        'activities',
        [[
          newActivity.Activity_ID,
          newActivity.Activity_Name,
          newActivity.Date_Time,
          newActivity.Location,
          newActivity.Organizer,
          newActivity.Budget_Allocated,
          newActivity.Budget_Used,
          newActivity.Status
        ]]
      );

      expect(mockGoogleSheetsService.appendSheetData).toHaveBeenCalled();

      const page = await mockPageGenerator.generateActivityPage(newActivity);
      expect(page.title).toBe('New Event - PPSDM KMITS');
    });
  });

  describe('End-to-End: Member Management Flow', () => {
    it('should complete full member lifecycle', async () => {
      // Fetch members
      const rawMembers = [
        ['NIM', 'Full_Name', 'Email', 'Year', 'Department', 'Position', 'Status'],
        ['5023201001', 'Alice Johnson', 'alice@student.its.ac.id', '2023', 'Teknik Mesin', 'Anggota Biasa', 'Active'],
        ['5023201002', 'Bob Smith', 'bob@student.its.ac.id', '2022', 'Teknik Sipil', 'Ketua', 'Active']
      ];

      mockGoogleSheetsService.getSheetData.mockResolvedValue(
        rawMembers.slice(1).map(row => ({
          NIM: row[0],
          Full_Name: row[1],
          Email: row[2],
          Year: row[3],
          Department: row[4],
          Position: row[5],
          Status: row[6]
        }))
      );

      // Parse and validate
      const parsedMembers = [
        {
          NIM: '5023201001',
          Full_Name: 'Alice Johnson',
          Email: 'alice@student.its.ac.id',
          Year: 2023,
          Department: 'Teknik Mesin',
          Position: 'Anggota Biasa',
          Status: 'Active',
          _isValid: true,
          _validationErrors: []
        },
        {
          NIM: '5023201002',
          Full_Name: 'Bob Smith',
          Email: 'bob@student.its.ac.id',
          Year: 2022,
          Department: 'Teknik Sipil',
          Position: 'Ketua',
          Status: 'Active',
          _isValid: true,
          _validationErrors: []
        }
      ];

      mockSheetParserEngine.parseSheetData.mockResolvedValue(parsedMembers);

      // Transform
      const transformedMembers = parsedMembers;
      mockSheetParserEngine.transformDataForWebsite.mockReturnValue(transformedMembers);

      // Generate pages
      const generatedPages = transformedMembers.map(member => ({
        title: `${member.Full_Name} - PPSDM KMITS`,
        description: `Member profile for ${member.Full_Name}`,
        content: member,
        metadata: { generatedAt: new Date().toISOString() }
      }));

      mockPageGenerator.generateMemberPage.mockImplementation((data) => ({
        title: `${data.Full_Name} - PPSDM KMITS`,
        description: `Member profile for ${data.Full_Name}`,
        content: data,
        metadata: { generatedAt: new Date().toISOString() }
      }));

      // Execute
      const fetchedData = await mockGoogleSheetsService.getSheetData('test-id', 'members');
      expect(fetchedData).toHaveLength(2);

      const parsedData = await mockSheetParserEngine.parseSheetData('test-id', 'members');
      expect(parsedData.every(item => item._isValid)).toBe(true);

      const pages = await Promise.all(
        transformedMembers.map(member => mockPageGenerator.generateMemberPage(member))
      );
      expect(pages).toHaveLength(2);
    });
  });

  describe('End-to-End: Dashboard Generation Flow', () => {
    it('should generate dashboard with aggregated data', async () => {
      // Fetch all sheets
      mockGoogleSheetsService.getSheets.mockResolvedValue([
        { properties: { title: 'activities' } },
        { properties: { title: 'members' } },
        { properties: { title: 'finances' } }
      ]);

      // Fetch activities
      const activities = [
        { Activity_ID: 'ACT-2024-001', Status: 'Active', Budget_Allocated: 500000, Budget_Used: 450000 },
        { Activity_ID: 'ACT-2024-002', Status: 'Completed', Budget_Allocated: 750000, Budget_Used: 600000 }
      ];
      mockGoogleSheetsService.getSheetData.mockImplementation((id, sheet) => {
        if (sheet === 'activities') return Promise.resolve(activities);
        if (sheet === 'members') return Promise.resolve([
          { NIM: '5023201001', Status: 'Active' },
          { NIM: '5023201002', Status: 'Active' }
        ]);
        if (sheet === 'finances') return Promise.resolve([
          { Amount: 150000, Category: 'Operational' },
          { Amount: 250000, Category: 'Event' }
        ]);
        return Promise.resolve([]);
      });

      // Parse data
      mockSheetParserEngine.parseSheetData.mockImplementation(async (id, sheet) => {
        const data = await mockGoogleSheetsService.getSheetData(id, sheet);
        return data.map((item: any) => ({ ...item, _isValid: true, _validationErrors: [] }));
      });

      // Generate insights
      mockAutomationEngine.processSpreadsheetData.mockResolvedValue({
        processed: true,
        data: activities,
        insights: ['2 activities found'],
        warnings: []
      });

      // Generate dashboard
      const dashboardData = {
        totalActivities: 2,
        activeMembers: 2,
        totalBudget: 1250000,
        usedBudget: 1050000,
        upcomingEvents: 1,
        recentTransactions: 2
      };

      const dashboardPage = {
        title: 'Dashboard - PPSDM KMITS',
        description: 'Organization dashboard overview',
        content: dashboardData,
        metadata: { generatedAt: new Date().toISOString() }
      };

      mockPageGenerator.generateDashboardPage.mockResolvedValue(dashboardPage);

      // Execute
      const sheets = await mockGoogleSheetsService.getSheets('test-id');
      expect(sheets).toHaveLength(3);

      const parsedActivities = await mockSheetParserEngine.parseSheetData('test-id', 'activities');
      expect(parsedActivities).toHaveLength(2);

      const insights = await mockAutomationEngine.processSpreadsheetData(parsedActivities);
      expect(insights.processed).toBe(true);

      const dashboard = await mockPageGenerator.generateDashboardPage(dashboardData);
      expect(dashboard.title).toBe('Dashboard - PPSDM KMITS');
      expect(dashboard.content.totalActivities).toBe(2);
    });
  });

  describe('End-to-End: Data Validation and Error Handling', () => {
    it('should handle invalid data gracefully', async () => {
      // Fetch data with errors
      const invalidData = [
        { Activity_ID: 'INVALID-ID', Activity_Name: '', Budget_Allocated: -1000 }
      ];

      mockGoogleSheetsService.getSheetData.mockResolvedValue(invalidData);

      // Parse with validation errors
      const parsedData = [
        {
          Activity_ID: 'INVALID-ID',
          Activity_Name: '',
          Budget_Allocated: -1000,
          _isValid: false,
          _validationErrors: [
            'Field Activity_ID does not match required format',
            'Field Activity_Name is required',
            'Field Budget_Allocated must be at least 0'
          ]
        }
      ];

      mockSheetParserEngine.parseSheetData.mockResolvedValue(parsedData);

      // Get validation report
      const validationReport = {
        totalRecords: 1,
        validRecords: 0,
        invalidRecords: 1,
        errorsByField: {
          Activity_ID: 1,
          Activity_Name: 1,
          Budget_Allocated: 1
        },
        detailedErrors: [
          { index: 0, errors: parsedData[0]._validationErrors }
        ]
      };

      mockSheetParserEngine.getValidationReport.mockReturnValue(validationReport);

      // Execute
      const fetchedData = await mockGoogleSheetsService.getSheetData('test-id', 'activities');
      const parsed = await mockSheetParserEngine.parseSheetData('test-id', 'activities');
      const report = mockSheetParserEngine.getValidationReport(parsed);

      expect(report.validRecords).toBe(0);
      expect(report.invalidRecords).toBe(1);
      expect(report.errorsByField.Activity_ID).toBe(1);
    });

    it('should handle API errors gracefully', async () => {
      // Simulate API error
      mockGoogleSheetsService.getSheetData.mockRejectedValue(
        new Error('API Error: Rate limit exceeded')
      );

      // Execute and expect error
      await expect(
        mockGoogleSheetsService.getSheetData('test-id', 'activities')
      ).rejects.toThrow('API Error');
    });
  });

  describe('End-to-End: Multi-Sheet Synchronization', () => {
    it('should synchronize data across multiple sheets', async () => {
      // Fetch all sheets
      const sheets = ['activities', 'members', 'finances'];
      mockGoogleSheetsService.getSheets.mockResolvedValue(
        sheets.map(title => ({ properties: { title } }))
      );

      // Fetch data from each sheet
      const activitiesData = [
        { Activity_ID: 'ACT-2024-001', Organizer: '5023201001', Budget_Allocated: 500000 }
      ];
      const membersData = [
        { NIM: '5023201001', Full_Name: 'Alice Johnson' }
      ];
      const financesData = [
        { Transaction_ID: 'TRX-2024-001', Amount: 500000, Category: 'Activity' }
      ];

      mockGoogleSheetsService.getSheetData.mockImplementation((id, sheet) => {
        if (sheet === 'activities') return Promise.resolve(activitiesData);
        if (sheet === 'members') return Promise.resolve(membersData);
        if (sheet === 'finances') return Promise.resolve(financesData);
        return Promise.resolve([]);
      });

      // Parse all data
      mockSheetParserEngine.parseSheetData.mockImplementation(async (id, sheet) => {
        const data = await mockGoogleSheetsService.getSheetData(id, sheet);
        return data.map((item: any) => ({ ...item, _isValid: true, _validationErrors: [] }));
      });

      // Execute
      const fetchedSheets = await mockGoogleSheetsService.getSheets('test-id');
      expect(fetchedSheets).toHaveLength(3);

      const parsedActivities = await mockSheetParserEngine.parseSheetData('test-id', 'activities');
      const parsedMembers = await mockSheetParserEngine.parseSheetData('test-id', 'members');
      const parsedFinances = await mockSheetParserEngine.parseSheetData('test-id', 'finances');

      expect(parsedActivities).toHaveLength(1);
      expect(parsedMembers).toHaveLength(1);
      expect(parsedFinances).toHaveLength(1);

      // Verify data consistency
      expect(parsedActivities[0].Organizer).toBe(parsedMembers[0].NIM);
    });
  });

  describe('End-to-End: Automation Integration', () => {
    it('should integrate automation with data processing', async () => {
      // Fetch data
      const rawData = [
        { Activity_ID: 'ACT-2024-001', Activity_Name: 'Meeting', Budget: 500000 }
      ];

      mockGoogleSheetsService.getSheetData.mockResolvedValue(rawData);

      // Process with AI
      const processedData = {
        processed: true,
        data: rawData,
        insights: ['Budget utilization: 100%'],
        warnings: []
      };

      mockAutomationEngine.processSpreadsheetData.mockResolvedValue(processedData);

      // Generate insights
      const insights = {
        totalActivities: 1,
        budgetUtilization: 100,
        recommendations: ['Monitor budget closely']
      };

      mockAutomationEngine.generateInsights.mockResolvedValue(insights);

      // Execute
      const fetched = await mockGoogleSheetsService.getSheetData('test-id', 'activities');
      const processed = await mockAutomationEngine.processSpreadsheetData(fetched);
      const generatedInsights = await mockAutomationEngine.generateInsights(processed.data);

      expect(processed.processed).toBe(true);
      expect(generatedInsights.totalActivities).toBe(1);
      expect(generatedInsights.recommendations).toContain('Monitor budget closely');
    });
  });
});
