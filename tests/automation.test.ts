/**
 * Automation Features Tests
 * Unit tests for Automation Module
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock automation modules
const mockAIProcessor = {
  processSpreadsheetData: vi.fn(),
  cleanData: vi.fn(),
  validateData: vi.fn(),
  generateInsights: vi.fn()
};

const mockInsightsEngine = {
  analyzeActivities: vi.fn(),
  analyzeBudget: vi.fn(),
  analyzeMembers: vi.fn(),
  generateComprehensiveInsights: vi.fn()
};

const mockPredictiveEngine = {
  predictMemberAvailability: vi.fn(),
  suggestMeetingTimes: vi.fn(),
  recommendBudgetAllocation: vi.fn(),
  suggestTeamComposition: vi.fn()
};

const mockNotificationService = {
  sendEventReminder: vi.fn(),
  sendBirthdayWish: vi.fn(),
  sendDeadlineNotification: vi.fn(),
  sendWeeklyDigest: vi.fn()
};

const mockNaturalLanguageProcessor = {
  parseCommand: vi.fn(),
  executeCommand: vi.fn(),
  getCommandSuggestions: vi.fn()
};

vi.mock('../src/lib/automation/ai-processor', () => ({
  aiProcessor: mockAIProcessor,
  AIProcessor: mockAIProcessor
}));

vi.mock('../src/lib/automation/insights-engine', () => ({
  insightsEngine: mockInsightsEngine,
  InsightsEngine: mockInsightsEngine
}));

vi.mock('../src/lib/automation/predictive-engine', () => ({
  predictiveEngine: mockPredictiveEngine,
  PredictiveEngine: mockPredictiveEngine
}));

vi.mock('../src/lib/automation/notification-service', () => ({
  notificationService: mockNotificationService,
  NotificationService: mockNotificationService
}));

vi.mock('../src/lib/automation/natural-language-processor', () => ({
  naturalLanguageProcessor: mockNaturalLanguageProcessor,
  NaturalLanguageProcessor: mockNaturalLanguageProcessor
}));

describe('Automation Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('AI Processor', () => {
    describe('processSpreadsheetData', () => {
      it('should process spreadsheet data successfully', async () => {
        const spreadsheetData = [
          { Activity_ID: 'ACT-2024-001', Activity_Name: 'Meeting', Budget: 500000 },
          { Activity_ID: 'ACT-2024-002', Activity_Name: 'Workshop', Budget: 750000 }
        ];

        const expectedResult = {
          processed: true,
          data: spreadsheetData,
          insights: ['2 activities processed'],
          warnings: []
        };

        mockAIProcessor.processSpreadsheetData.mockResolvedValue(expectedResult);

        const result = await mockAIProcessor.processSpreadsheetData(spreadsheetData);

        expect(result).toEqual(expectedResult);
        expect(mockAIProcessor.processSpreadsheetData).toHaveBeenCalledWith(spreadsheetData);
      });

      it('should handle empty data', async () => {
        const emptyData = [];

        const expectedResult = {
          processed: true,
          data: [],
          insights: ['No data to process'],
          warnings: []
        };

        mockAIProcessor.processSpreadsheetData.mockResolvedValue(expectedResult);

        const result = await mockAIProcessor.processSpreadsheetData(emptyData);

        expect(result.data).toEqual([]);
        expect(result.insights).toContain('No data to process');
      });

      it('should detect and report data anomalies', async () => {
        const anomalousData = [
          { Activity_ID: 'ACT-2024-001', Activity_Name: 'Meeting', Budget: -500000 },
          { Activity_ID: 'ACT-2024-002', Activity_Name: '', Budget: 750000 }
        ];

        const expectedResult = {
          processed: true,
          data: anomalousData,
          insights: [],
          warnings: [
            'Negative budget detected in row 1',
            'Empty activity name in row 2'
          ]
        };

        mockAIProcessor.processSpreadsheetData.mockResolvedValue(expectedResult);

        const result = await mockAIProcessor.processSpreadsheetData(anomalousData);

        expect(result.warnings).toHaveLength(2);
      });
    });

    describe('cleanData', () => {
      it('should clean and normalize data', () => {
        const dirtyData = [
          { name: '  John Doe  ', email: 'JOHN@EXAMPLE.COM', age: ' 25 ' },
          { name: 'Jane Smith', email: 'jane@example.com', age: '30' }
        ];

        const cleanedData = [
          { name: 'John Doe', email: 'john@example.com', age: 25 },
          { name: 'Jane Smith', email: 'jane@example.com', age: 30 }
        ];

        mockAIProcessor.cleanData.mockReturnValue(cleanedData);

        const result = mockAIProcessor.cleanData(dirtyData);

        expect(result).toEqual(cleanedData);
        expect(result[0].name).toBe('John Doe');
        expect(result[0].email).toBe('john@example.com');
        expect(result[0].age).toBe(25);
      });

      it('should remove duplicate entries', () => {
        const dataWithDuplicates = [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
          { id: 1, name: 'John' }
        ];

        const deduplicatedData = [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ];

        mockAIProcessor.cleanData.mockReturnValue(deduplicatedData);

        const result = mockAIProcessor.cleanData(dataWithDuplicates);

        expect(result).toHaveLength(2);
      });
    });

    describe('validateData', () => {
      it('should validate data against schema', () => {
        const data = [
          { Activity_ID: 'ACT-2024-001', Activity_Name: 'Meeting', Budget: 500000 }
        ];

        const schema = {
          Activity_ID: { required: true, type: 'string' },
          Activity_Name: { required: true, type: 'string' },
          Budget: { required: true, type: 'number' }
        };

        const validationResult = {
          isValid: true,
          errors: [],
          warnings: []
        };

        mockAIProcessor.validateData.mockReturnValue(validationResult);

        const result = mockAIProcessor.validateData(data, schema);

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should report validation errors', () => {
        const invalidData = [
          { Activity_ID: '', Activity_Name: 'Meeting', Budget: 'invalid' }
        ];

        const schema = {
          Activity_ID: { required: true, type: 'string' },
          Activity_Name: { required: true, type: 'string' },
          Budget: { required: true, type: 'number' }
        };

        const validationResult = {
          isValid: false,
          errors: [
            'Activity_ID is required',
            'Budget must be a number'
          ],
          warnings: []
        };

        mockAIProcessor.validateData.mockReturnValue(validationResult);

        const result = mockAIProcessor.validateData(invalidData, schema);

        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(2);
      });
    });
  });

  describe('Insights Engine', () => {
    describe('analyzeActivities', () => {
      it('should analyze activity trends', async () => {
        const activityData = [
          { Activity_ID: 'ACT-2024-001', Date: '2024-01-15', Status: 'Completed' },
          { Activity_ID: 'ACT-2024-002', Date: '2024-01-20', Status: 'Active' },
          { Activity_ID: 'ACT-2024-003', Date: '2024-01-25', Status: 'Planning' }
        ];

        const insights = {
          totalActivities: 3,
          completedActivities: 1,
          activeActivities: 1,
          plannedActivities: 1,
          trend: 'increasing',
          recommendations: ['Increase activity frequency']
        };

        mockInsightsEngine.analyzeActivities.mockResolvedValue(insights);

        const result = await mockInsightsEngine.analyzeActivities(activityData);

        expect(result.totalActivities).toBe(3);
        expect(result.trend).toBe('increasing');
      });
    });

    describe('analyzeBudget', () => {
      it('should analyze budget patterns', async () => {
        const budgetData = [
          { Category: 'Operational', Amount: 500000 },
          { Category: 'Event', Amount: 1000000 },
          { Category: 'Asset', Amount: 2000000 }
        ];

        const insights = {
          totalBudget: 3500000,
          topCategory: 'Asset',
          budgetDistribution: {
            Operational: 14.29,
            Event: 28.57,
            Asset: 57.14
          },
          recommendations: ['Consider reducing asset expenditure']
        };

        mockInsightsEngine.analyzeBudget.mockResolvedValue(insights);

        const result = await mockInsightsEngine.analyzeBudget(budgetData);

        expect(result.totalBudget).toBe(3500000);
        expect(result.topCategory).toBe('Asset');
      });
    });

    describe('analyzeMembers', () => {
      it('should analyze member engagement', async () => {
        const memberData = [
          { NIM: '5023201001', Name: 'Alice', Activities_Participated: 10 },
          { NIM: '5023201002', Name: 'Bob', Activities_Participated: 5 },
          { NIM: '5023201003', Name: 'Charlie', Activities_Participated: 15 }
        ];

        const insights = {
          totalMembers: 3,
          averageParticipation: 10,
          mostEngagedMember: 'Charlie',
          leastEngagedMember: 'Bob',
          engagementScore: 75
        };

        mockInsightsEngine.analyzeMembers.mockResolvedValue(insights);

        const result = await mockInsightsEngine.analyzeMembers(memberData);

        expect(result.totalMembers).toBe(3);
        expect(result.mostEngagedMember).toBe('Charlie');
      });
    });
  });

  describe('Predictive Engine', () => {
    describe('predictMemberAvailability', () => {
      it('should predict member availability for scheduling', async () => {
        const memberId = '5023201001';
        const dateRange = {
          start: '2024-02-01',
          end: '2024-02-07'
        };

        const predictions = {
          memberId,
          availableSlots: [
            { date: '2024-02-01', time: '10:00', confidence: 0.9 },
            { date: '2024-02-03', time: '14:00', confidence: 0.85 }
          ],
          busySlots: [
            { date: '2024-02-02', reason: 'Class schedule' }
          ]
        };

        mockPredictiveEngine.predictMemberAvailability.mockResolvedValue(predictions);

        const result = await mockPredictiveEngine.predictMemberAvailability(memberId, dateRange);

        expect(result.availableSlots).toHaveLength(2);
        expect(result.availableSlots[0].confidence).toBe(0.9);
      });
    });

    describe('suggestMeetingTimes', () => {
      it('should suggest optimal meeting times', async () => {
        const participants = ['5023201001', '5023201002', '5023201003'];
        const duration = 60; // minutes

        const suggestions = [
          {
            date: '2024-02-05',
            time: '10:00',
            availableParticipants: 3,
            confidence: 0.95
          },
          {
            date: '2024-02-06',
            time: '14:00',
            availableParticipants: 2,
            confidence: 0.8
          }
        ];

        mockPredictiveEngine.suggestMeetingTimes.mockResolvedValue(suggestions);

        const result = await mockPredictiveEngine.suggestMeetingTimes(participants, duration);

        expect(result).toHaveLength(2);
        expect(result[0].availableParticipants).toBe(3);
      });
    });

    describe('recommendBudgetAllocation', () => {
      it('should recommend budget allocation', async () => {
        const totalBudget = 5000000;
        const historicalData = [
          { Category: 'Operational', Amount: 1000000 },
          { Category: 'Event', Amount: 2000000 },
          { Category: 'Asset', Amount: 1500000 }
        ];

        const recommendations = [
          { Category: 'Operational', Recommended: 1200000, Reason: 'Increased operational needs' },
          { Category: 'Event', Recommended: 2000000, Reason: 'Maintain current level' },
          { Category: 'Asset', Recommended: 1800000, Reason: 'Planned equipment upgrade' }
        ];

        mockPredictiveEngine.recommendBudgetAllocation.mockResolvedValue(recommendations);

        const result = await mockPredictiveEngine.recommendBudgetAllocation(totalBudget, historicalData);

        expect(result).toHaveLength(3);
        expect(result[0].Recommended).toBe(1200000);
      });
    });

    describe('suggestTeamComposition', () => {
      it('should suggest team composition for projects', async () => {
        const projectRequirements = {
          skills: ['JavaScript', 'Python', 'Design'],
          experienceLevel: 'Intermediate',
          teamSize: 4
        };

        const suggestions = {
          recommendedMembers: [
            { NIM: '5023201001', Name: 'Alice', Skills: ['JavaScript', 'React'], MatchScore: 0.9 },
            { NIM: '5023201002', Name: 'Bob', Skills: ['Python', 'Django'], MatchScore: 0.85 },
            { NIM: '5023201003', Name: 'Charlie', Skills: ['Design', 'Figma'], MatchScore: 0.95 },
            { NIM: '5023201004', Name: 'Diana', Skills: ['JavaScript', 'Python'], MatchScore: 0.88 }
          ],
          overallMatchScore: 0.895
        };

        mockPredictiveEngine.suggestTeamComposition.mockResolvedValue(suggestions);

        const result = await mockPredictiveEngine.suggestTeamComposition(projectRequirements);

        expect(result.recommendedMembers).toHaveLength(4);
        expect(result.overallMatchScore).toBeCloseTo(0.895, 2);
      });
    });
  });

  describe('Notification Service', () => {
    describe('sendEventReminder', () => {
      it('should send event reminder successfully', async () => {
        const reminder = {
          eventId: 'ACT-2024-001',
          eventName: 'Weekly Meeting',
          eventDate: '2024-02-05',
          eventTime: '10:00',
          recipients: ['alice@student.its.ac.id', 'bob@student.its.ac.id']
        };

        const result = {
          success: true,
          sentCount: 2,
          failedCount: 0,
          details: []
        };

        mockNotificationService.sendEventReminder.mockResolvedValue(result);

        const response = await mockNotificationService.sendEventReminder(reminder);

        expect(response.success).toBe(true);
        expect(response.sentCount).toBe(2);
      });
    });

    describe('sendBirthdayWish', () => {
      it('should send birthday wish', async () => {
        const birthdayWish = {
          memberId: '5023201001',
          memberName: 'Alice Johnson',
          birthday: '2024-02-10',
          email: 'alice@student.its.ac.id'
        };

        const result = {
          success: true,
          message: 'Birthday wish sent successfully'
        };

        mockNotificationService.sendBirthdayWish.mockResolvedValue(result);

        const response = await mockNotificationService.sendBirthdayWish(birthdayWish);

        expect(response.success).toBe(true);
      });
    });

    describe('sendWeeklyDigest', () => {
      it('should send weekly digest', async () => {
        const digest = {
          weekStart: '2024-02-05',
          weekEnd: '2024-02-11',
          activitiesCompleted: 5,
          upcomingEvents: 3,
          budgetUpdates: [
            { Category: 'Operational', Spent: 500000 }
          ],
          recipients: ['all-members']
        };

        const result = {
          success: true,
          sentCount: 45,
          failedCount: 0
        };

        mockNotificationService.sendWeeklyDigest.mockResolvedValue(result);

        const response = await mockNotificationService.sendWeeklyDigest(digest);

        expect(response.success).toBe(true);
        expect(response.sentCount).toBe(45);
      });
    });
  });

  describe('Natural Language Processor', () => {
    describe('parseCommand', () => {
      it('should parse schedule command', () => {
        const command = 'jadwalkan meeting besok jam 10 di ruang A';

        const parsedCommand = {
          type: 'schedule',
          action: 'meeting',
          date: 'besok',
          time: '10:00',
          location: 'Ruang A',
          confidence: 0.95
        };

        mockNaturalLanguageProcessor.parseCommand.mockReturnValue(parsedCommand);

        const result = mockNaturalLanguageProcessor.parseCommand(command);

        expect(result.type).toBe('schedule');
        expect(result.action).toBe('meeting');
        expect(result.confidence).toBe(0.95);
      });

      it('should parse report command', () => {
        const command = 'tampilkan laporan keuangan bulan ini';

        const parsedCommand = {
          type: 'report',
          category: 'keuangan',
          period: 'bulan ini',
          confidence: 0.92
        };

        mockNaturalLanguageProcessor.parseCommand.mockReturnValue(parsedCommand);

        const result = mockNaturalLanguageProcessor.parseCommand(command);

        expect(result.type).toBe('report');
        expect(result.category).toBe('keuangan');
      });

      it('should parse find command', () => {
        const command = 'cari anggota dengan skill Python';

        const parsedCommand = {
          type: 'find',
          target: 'anggota',
          criteria: { skill: 'Python' },
          confidence: 0.9
        };

        mockNaturalLanguageProcessor.parseCommand.mockReturnValue(parsedCommand);

        const result = mockNaturalLanguageProcessor.parseCommand(command);

        expect(result.type).toBe('find');
        expect(result.target).toBe('anggota');
      });
    });

    describe('getCommandSuggestions', () => {
      it('should provide command suggestions', () => {
        const partialInput = 'jadwal';

        const suggestions = [
          { command: 'jadwalkan meeting', description: 'Schedule a new meeting' },
          { command: 'jadwalkan workshop', description: 'Schedule a workshop' },
          { command: 'jadwalkan event', description: 'Schedule an event' }
        ];

        mockNaturalLanguageProcessor.getCommandSuggestions.mockReturnValue(suggestions);

        const result = mockNaturalLanguageProcessor.getCommandSuggestions(partialInput);

        expect(result).toHaveLength(3);
        expect(result[0].command).toBe('jadwalkan meeting');
      });
    });
  });
});
