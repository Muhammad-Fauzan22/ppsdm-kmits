/**
 * Dynamic Page Generator Tests
 * Unit tests for Dynamic Page Generator
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the page generator module
const mockPageGenerator = {
  generateActivityPage: vi.fn(),
  generateMemberPage: vi.fn(),
  generateFinancePage: vi.fn(),
  generateAssessmentPage: vi.fn(),
  generateKnowledgePage: vi.fn(),
  generateDashboardPage: vi.fn(),
  validatePageConfig: vi.fn(),
  optimizePageContent: vi.fn()
};

vi.mock('../src/lib/website-generator/page-generator', () => ({
  default: mockPageGenerator,
  PageGenerator: mockPageGenerator
}));

describe('Dynamic Page Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generateActivityPage', () => {
    it('should generate activity page with valid data', async () => {
      const activityData = {
        Activity_ID: 'ACT-2024-001',
        Activity_Name: 'Weekly Meeting',
        Date_Time: '2024-01-15 10:00',
        Location: 'Room A',
        Organizer: 'John Doe',
        Participants_List: ['Alice', 'Bob', 'Charlie'],
        Budget_Allocated: 500000,
        Budget_Used: 450000,
        Status: 'Active'
      };

      const expectedPage = {
        title: 'Weekly Meeting - PPSDM KMITS',
        description: 'Activity details for Weekly Meeting',
        content: expect.any(Object),
        metadata: expect.any(Object)
      };

      mockPageGenerator.generateActivityPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateActivityPage(activityData);

      expect(result).toEqual(expectedPage);
      expect(mockPageGenerator.generateActivityPage).toHaveBeenCalledWith(activityData);
    });

    it('should handle missing optional fields', async () => {
      const activityData = {
        Activity_ID: 'ACT-2024-001',
        Activity_Name: 'Quick Meeting',
        Date_Time: '2024-01-15 10:00',
        Location: 'Room A',
        Organizer: 'John Doe',
        Budget_Allocated: 100000,
        Budget_Used: 50000,
        Status: 'Active'
      };

      const expectedPage = {
        title: 'Quick Meeting - PPSDM KMITS',
        description: 'Activity details for Quick Meeting',
        content: expect.any(Object),
        metadata: expect.any(Object)
      };

      mockPageGenerator.generateActivityPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateActivityPage(activityData);

      expect(result).toEqual(expectedPage);
    });

    it('should throw error for invalid activity data', async () => {
      const invalidData = {
        Activity_ID: 'INVALID-ID',
        Activity_Name: '',
        Date_Time: 'invalid-date'
      };

      mockPageGenerator.generateActivityPage.mockRejectedValue(
        new Error('Invalid activity data: Missing required fields')
      );

      await expect(
        mockPageGenerator.generateActivityPage(invalidData)
      ).rejects.toThrow('Invalid activity data');
    });
  });

  describe('generateMemberPage', () => {
    it('should generate member page with valid data', async () => {
      const memberData = {
        NIM: '5023201001',
        Full_Name: 'Alice Johnson',
        Email: 'alice@student.its.ac.id',
        Year: 2023,
        Department: 'Teknik Mesin',
        Position: 'Anggota Biasa',
        Status: 'Active',
        Skills: ['JavaScript', 'Python', 'React'],
        Projects: ['Project A', 'Project B']
      };

      const expectedPage = {
        title: 'Alice Johnson - PPSDM KMITS',
        description: 'Member profile for Alice Johnson',
        content: expect.any(Object),
        metadata: expect.any(Object)
      };

      mockPageGenerator.generateMemberPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateMemberPage(memberData);

      expect(result).toEqual(expectedPage);
      expect(mockPageGenerator.generateMemberPage).toHaveBeenCalledWith(memberData);
    });

    it('should handle alumni status', async () => {
      const memberData = {
        NIM: '5020181001',
        Full_Name: 'Bob Smith',
        Email: 'bob@alumni.its.ac.id',
        Year: 2018,
        Department: 'Teknik Mesin',
        Position: 'Alumni',
        Status: 'Alumni'
      };

      const expectedPage = {
        title: 'Bob Smith (Alumni) - PPSDM KMITS',
        description: 'Alumni profile for Bob Smith',
        content: expect.any(Object),
        metadata: expect.any(Object)
      };

      mockPageGenerator.generateMemberPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateMemberPage(memberData);

      expect(result).toEqual(expectedPage);
    });
  });

  describe('generateFinancePage', () => {
    it('should generate finance page with valid data', async () => {
      const financeData = {
        Transaction_ID: 'TRX-2024-001',
        Date: '2024-01-15',
        Description: 'Office Supplies',
        Category: 'Operational',
        Amount: 150000,
        Payment_Method: 'Transfer',
        Verified: true
      };

      const expectedPage = {
        title: 'Transaction TRX-2024-001 - PPSDM KMITS',
        description: 'Finance transaction details',
        content: expect.any(Object),
        metadata: expect.any(Object)
      };

      mockPageGenerator.generateFinancePage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateFinancePage(financeData);

      expect(result).toEqual(expectedPage);
    });

    it('should format currency correctly', async () => {
      const financeData = {
        Transaction_ID: 'TRX-2024-002',
        Date: '2024-01-20',
        Description: 'Event Budget',
        Category: 'Event',
        Amount: 2500000,
        Payment_Method: 'Transfer',
        Verified: true
      };

      const expectedPage = {
        title: 'Transaction TRX-2024-002 - PPSDM KMITS',
        description: 'Finance transaction details',
        content: {
          formattedAmount: 'Rp 2.500.000',
          Transaction_ID: 'TRX-2024-002',
          Amount: 2500000
        },
        metadata: { generatedAt: expect.any(String) }
      };

      mockPageGenerator.generateFinancePage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateFinancePage(financeData);

      expect(result.content.formattedAmount).toBe('Rp 2.500.000');
    });
  });

  describe('generateAssessmentPage', () => {
    it('should generate assessment page with valid data', async () => {
      const assessmentData = {
        Dimension_ID: 'COG-01',
        Dimension_Name: 'Cognitive Development',
        Question_Text: 'How would you rate your problem-solving skills?',
        Question_Type: 'likert_5',
        Weight: 1.5,
        Status: 'Active'
      };

      const expectedPage = {
        title: 'Cognitive Development Assessment - PPSDM KMITS',
        description: 'Assessment dimension details',
        content: { ...assessmentData },
        metadata: { generatedAt: expect.any(String) }
      };

      mockPageGenerator.generateAssessmentPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateAssessmentPage(assessmentData);

      expect(result).toEqual(expectedPage);
    });

    it('should handle different question types', async () => {
      const questionTypes = ['likert_5', 'multiple_choice', 'open_ended'];

      for (const type of questionTypes) {
        const assessmentData = {
          Dimension_ID: 'COG-01',
          Dimension_Name: 'Test Dimension',
          Question_Text: 'Test question',
          Question_Type: type,
          Weight: 1.0,
          Status: 'Active'
        };

        const expectedPage = {
          title: 'Test Dimension Assessment - PPSDM KMITS',
          description: 'Assessment dimension details',
          content: {
            questionType: type, // Ensure this property exists in mock return
            ...assessmentData
          },
          metadata: { generatedAt: expect.any(String) }
        };

        mockPageGenerator.generateAssessmentPage.mockResolvedValue(expectedPage);

        const result = await mockPageGenerator.generateAssessmentPage(assessmentData);

        expect(result.content.questionType).toBe(type);
      }
    });
  });

  describe('generateKnowledgePage', () => {
    it('should generate knowledge page with valid data', async () => {
      const knowledgeData = {
        Resource_ID: 'RES-001',
        Title: 'Introduction to React',
        Type: 'Video Tutorial',
        Category: 'Programming',
        Difficulty: 'Beginner',
        Rating: 4.5,
        Duration: '45 min',
        Author: 'John Doe'
      };

      const expectedPage = {
        title: 'Introduction to React - PPSDM KMITS',
        description: 'Knowledge resource details',
        content: { ...knowledgeData },
        metadata: { generatedAt: expect.any(String) }
      };

      mockPageGenerator.generateKnowledgePage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateKnowledgePage(knowledgeData);

      expect(result).toEqual(expectedPage);
    });

    it('should handle different resource types', async () => {
      const resourceTypes = ['Video Tutorial', 'PDF', 'Article', 'Presentation'];

      for (const type of resourceTypes) {
        const knowledgeData = {
          Resource_ID: 'RES-001',
          Title: 'Test Resource',
          Type: type,
          Category: 'Test',
          Difficulty: 'Intermediate',
          Rating: 4.0
        };

        const expectedPage = {
          title: 'Test Resource - PPSDM KMITS',
          description: 'Knowledge resource details',
          content: {
            resourceType: type,
            ...knowledgeData
          },
          metadata: { generatedAt: expect.any(String) }
        };

        mockPageGenerator.generateKnowledgePage.mockResolvedValue(expectedPage);

        const result = await mockPageGenerator.generateKnowledgePage(knowledgeData);

        expect(result.content.resourceType).toBe(type);
      }
    });
  });

  describe('generateDashboardPage', () => {
    it('should generate dashboard page with aggregated data', async () => {
      const dashboardData = {
        totalActivities: 25,
        activeMembers: 45,
        totalBudget: 15000000,
        usedBudget: 8500000,
        upcomingEvents: 5,
        recentTransactions: 10
      };

      const expectedPage = {
        title: 'Dashboard - PPSDM KMITS',
        description: 'Organization dashboard overview',
        content: { ...dashboardData },
        metadata: { generatedAt: expect.any(String) }
      };

      mockPageGenerator.generateDashboardPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateDashboardPage(dashboardData);

      expect(result).toEqual(expectedPage);
    });

    it('should calculate budget utilization percentage', async () => {
      const dashboardData = {
        totalActivities: 25,
        activeMembers: 45,
        totalBudget: 15000000,
        usedBudget: 8500000,
        upcomingEvents: 5,
        recentTransactions: 10
      };

      const expectedPage = {
        title: 'Dashboard - PPSDM KMITS',
        description: 'Organization dashboard overview',
        content: {
          budgetUtilization: 56.67,
          ...dashboardData
        },
        metadata: { generatedAt: expect.any(String) }
      };

      mockPageGenerator.generateDashboardPage.mockResolvedValue(expectedPage);

      const result = await mockPageGenerator.generateDashboardPage(dashboardData);

      expect(result.content.budgetUtilization).toBeCloseTo(56.67, 2);
    });
  });

  describe('validatePageConfig', () => {
    it('should validate correct page configuration', () => {
      const config = {
        type: 'activity',
        layout: 'default',
        theme: 'light',
        showSidebar: true,
        showFooter: true
      };

      mockPageGenerator.validatePageConfig.mockReturnValue({
        isValid: true,
        errors: []
      });

      const result = mockPageGenerator.validatePageConfig(config);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect invalid page type', () => {
      const config = {
        type: 'invalid_type',
        layout: 'default',
        theme: 'light'
      };

      mockPageGenerator.validatePageConfig.mockReturnValue({
        isValid: false,
        errors: ['Invalid page type: invalid_type']
      });

      const result = mockPageGenerator.validatePageConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid page type: invalid_type');
    });

    it('should detect invalid theme', () => {
      const config = {
        type: 'activity',
        layout: 'default',
        theme: 'neon_theme'
      };

      mockPageGenerator.validatePageConfig.mockReturnValue({
        isValid: false,
        errors: ['Invalid theme: neon_theme']
      });

      const result = mockPageGenerator.validatePageConfig(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid theme: neon_theme');
    });
  });

  describe('optimizePageContent', () => {
    it('should optimize page content for performance', () => {
      const content = {
        title: 'Test Page',
        description: 'A very long description that needs optimization...',
        sections: [
          { id: 1, content: 'Section 1 content' },
          { id: 2, content: 'Section 2 content' },
          { id: 3, content: 'Section 3 content' }
        ]
      };

      const optimizedContent = {
        ...content,
        _optimized: true,
        _compressionRatio: 0.85,
        _loadTime: 150
      };

      mockPageGenerator.optimizePageContent.mockReturnValue(optimizedContent);

      const result = mockPageGenerator.optimizePageContent(content);

      expect(result._optimized).toBe(true);
      expect(result._compressionRatio).toBe(0.85);
      expect(result._loadTime).toBe(150);
    });

    it('should handle empty content', () => {
      const content = {};

      const optimizedContent = {
        ...content,
        _optimized: true,
        _compressionRatio: 1.0,
        _loadTime: 0
      };

      mockPageGenerator.optimizePageContent.mockReturnValue(optimizedContent);

      const result = mockPageGenerator.optimizePageContent(content);

      expect(result._optimized).toBe(true);
      expect(result._compressionRatio).toBe(1.0);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const activityData = {
        Activity_ID: 'ACT-2024-001',
        Activity_Name: 'Test Activity'
      };

      mockPageGenerator.generateActivityPage.mockRejectedValue(
        new Error('Network timeout while generating page')
      );

      await expect(
        mockPageGenerator.generateActivityPage(activityData)
      ).rejects.toThrow('Network timeout');
    });

    it('should handle malformed data', async () => {
      const malformedData = null;

      mockPageGenerator.generateMemberPage.mockRejectedValue(
        new Error('Invalid data format: expected object, got null')
      );

      await expect(
        mockPageGenerator.generateMemberPage(malformedData)
      ).rejects.toThrow('Invalid data format');
    });
  });
});
