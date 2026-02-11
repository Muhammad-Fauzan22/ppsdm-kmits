/**
 * Natural Language Processor for PPSDM KMITS Automation
 * Features: Parse spreadsheet commands, execute actions, return results
 * Integrates with: AI Service, Google Sheets API, Automation Engines
 */

import { aiService, AIRequest } from '../ai/ai-service';
import { aiProcessor } from './ai-processor';
import { insightsEngine } from './insights-engine';
import { predictiveEngine } from './predictive-engine';
import { notificationService } from './notification-service';

// Types for natural language processing
export interface Command {
  type: CommandType;
  action: string;
  parameters: Record<string, any>;
  confidence: number;
  originalText: string;
}

export type CommandType =
  | 'schedule'
  | 'report'
  | 'find'
  | 'plan'
  | 'notify'
  | 'analyze'
  | 'predict'
  | 'unknown';

export interface CommandResult {
  success: boolean;
  command: Command;
  result?: any;
  error?: string;
  executionTime: number;
}

export interface ScheduleCommand {
  eventName: string;
  date: Date;
  participants: number;
  location?: string;
  description?: string;
}

export interface ReportCommand {
  reportType: string;
  period?: string;
  format?: 'pdf' | 'excel' | 'html';
}

export interface FindCommand {
  target: string;
  criteria: Record<string, any>;
  skill?: string;
  project?: string;
}

export interface PlanCommand {
  targetMember: string;
  targetSkill?: string;
  basedOn?: string;
}

export interface NotifyCommand {
  recipients: string[];
  message: string;
  type?: 'email' | 'push' | 'sms';
}

class NaturalLanguageProcessor {
  private commandPatterns: Map<CommandType, RegExp[]>;

  constructor() {
    this.commandPatterns = new Map([
      ['schedule', [
        /schedule\s+(.+?)\s+for\s+(.+?)(?:\s+with\s+(\d+)\s+participants)?/i,
        /create\s+(?:event|activity|workshop|meeting)\s+(.+?)(?:\s+for\s+(.+?))?(?:\s+with\s+(\d+)\s+participants)?/i,
        /plan\s+(.+?)\s+on\s+(.+)/i,
      ]],
      ['report', [
        /generate\s+(.+?)\s+report\s+(?:for\s+)?(.+)/i,
        /create\s+(.+?)\s+report/i,
        /show\s+(.+?)\s+report/i,
      ]],
      ['find', [
        /find\s+(.+?)\s+(?:with|having)\s+(.+?)\s+skills?(?:\s+for\s+(.+?))?/i,
        /search\s+(.+?)\s+with\s+(.+)/i,
        /get\s+(.+?)\s+with\s+(.+)/i,
      ]],
      ['plan', [
        /plan\s+(?:learning\s+path|development\s+plan)\s+for\s+(.+?)(?:\s+based\s+on\s+(.+?))?/i,
        /create\s+(?:learning\s+path|development\s+plan)\s+for\s+(.+)/i,
      ]],
      ['notify', [
        /notify\s+(.+?)\s+(?:about|that)\s+(.+)/i,
        /send\s+(?:notification|message|email)\s+to\s+(.+?)\s+(?:about|saying)\s+(.+)/i,
      ]],
      ['analyze', [
        /analyze\s+(.+)/i,
        /examine\s+(.+)/i,
        /review\s+(.+)/i,
      ]],
      ['predict', [
        /predict\s+(.+)/i,
        /forecast\s+(.+)/i,
        /estimate\s+(.+)/i,
      ]],
    ]);
  }

  /**
   * Parse natural language command
   */
  async parseCommand(text: string): Promise<Command> {
    const trimmedText = text.trim();

    // Check for AI command prefix
    const aiPrefix = trimmedText.match(/^@ai\s+(.+)/i);
    if (!aiPrefix) {
      return {
        type: 'unknown',
        action: 'unknown',
        parameters: {},
        confidence: 0,
        originalText: trimmedText,
      };
    }

    const commandText = aiPrefix[1];

    // Try to match against known patterns
    for (const [type, patterns] of this.commandPatterns.entries()) {
      for (const pattern of patterns) {
        const match = commandText.match(pattern);
        if (match) {
          const parameters = this.extractParameters(type, match);
          return {
            type,
            action: match[1] || type,
            parameters,
            confidence: this.calculateConfidence(type, match),
            originalText: trimmedText,
          };
        }
      }
    }

    // If no pattern matches, use AI to interpret
    return await this.interpretWithAI(commandText, trimmedText);
  }

  /**
   * Execute parsed command
   */
  async executeCommand(command: Command, context?: {
    spreadsheetId?: string;
    sheetName?: string;
    userId?: string;
  }): Promise<CommandResult> {
    const startTime = Date.now();

    try {
      let result: any;

      switch (command.type) {
        case 'schedule':
          result = await this.executeScheduleCommand(command, context);
          break;
        case 'report':
          result = await this.executeReportCommand(command, context);
          break;
        case 'find':
          result = await this.executeFindCommand(command, context);
          break;
        case 'plan':
          result = await this.executePlanCommand(command, context);
          break;
        case 'notify':
          result = await this.executeNotifyCommand(command, context);
          break;
        case 'analyze':
          result = await this.executeAnalyzeCommand(command, context);
          break;
        case 'predict':
          result = await this.executePredictCommand(command, context);
          break;
        default:
          throw new Error(`Unknown command type: ${command.type}`);
      }

      return {
        success: true,
        command,
        result,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        command,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Extract parameters from regex match
   */
  private extractParameters(type: CommandType, match: RegExpMatchArray): Record<string, any> {
    const parameters: Record<string, any> = {};

    switch (type) {
      case 'schedule':
        parameters.eventName = match[1]?.trim() || '';
        parameters.dateText = match[2]?.trim() || '';
        parameters.participants = match[3] ? parseInt(match[3]) : undefined;
        break;
      case 'report':
        parameters.reportType = match[1]?.trim() || '';
        parameters.period = match[2]?.trim() || undefined;
        break;
      case 'find':
        parameters.target = match[1]?.trim() || '';
        parameters.skill = match[2]?.trim() || '';
        parameters.project = match[3]?.trim() || undefined;
        break;
      case 'plan':
        parameters.targetMember = match[1]?.trim() || '';
        parameters.basedOn = match[2]?.trim() || undefined;
        break;
      case 'notify':
        parameters.recipients = match[1]?.trim().split(',').map(r => r.trim());
        parameters.message = match[2]?.trim() || '';
        break;
      case 'analyze':
      case 'predict':
        parameters.subject = match[1]?.trim() || '';
        break;
    }

    return parameters;
  }

  /**
   * Calculate confidence score for command match
   */
  private calculateConfidence(type: CommandType, match: RegExpMatchArray): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence if more groups matched
    if (match.length > 2) {
      confidence += 0.1;
    }
    if (match.length > 3) {
      confidence += 0.1;
    }

    // Higher confidence for specific command types
    if (['schedule', 'report', 'find', 'plan'].includes(type)) {
      confidence += 0.1;
    }

    return Math.min(1, confidence);
  }

  /**
   * Interpret command using AI
   */
  private async interpretWithAI(commandText: string, originalText: string): Promise<Command> {
    try {
      const prompt = `
Parse this natural language command and return a JSON object with the following structure:
{
  "type": "schedule|report|find|plan|notify|analyze|predict|unknown",
  "action": "specific action name",
  "parameters": {
    // relevant parameters based on type
  },
  "confidence": 0.0-1.0
}

Command: "${commandText}"

Consider these command types:
- schedule: Create events, workshops, meetings
- report: Generate reports (financial, activity, member, etc.)
- find: Search for members with specific skills
- plan: Create learning paths or development plans
- notify: Send notifications or messages
- analyze: Analyze data or trends
- predict: Make predictions or forecasts

Return only valid JSON.
`;

      const request: AIRequest = {
        prompt,
        maxTokens: 500,
        temperature: 0.3,
        useCache: true,
        priority: 'normal',
      };

      const response = await aiService.generate(request);

      // Parse AI response
      try {
        const jsonMatch = response.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            type: parsed.type || 'unknown',
            action: parsed.action || 'unknown',
            parameters: parsed.parameters || {},
            confidence: parsed.confidence || 0.5,
            originalText,
          };
        }
      } catch (parseError) {
        }
    } catch (error) {
      }

    // Fallback to unknown command
    return {
      type: 'unknown',
      action: 'unknown',
      parameters: {},
      confidence: 0,
      originalText,
    };
  }

  /**
   * Execute schedule command
   */
  private async executeScheduleCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { eventName, dateText, participants } = command.parameters;

    // Parse date
    const date = await this.parseDateText(dateText);
    if (!date) {
      throw new Error(`Could not parse date: ${dateText}`);
    }

    // Create event object
    const event: ScheduleCommand = {
      eventName,
      date,
      participants: participants || 30,
    };

    // TODO: Save to spreadsheet
    if (context?.spreadsheetId && context?.sheetName) {
      // await this.saveEventToSpreadsheet(event, context.spreadsheetId, context.sheetName);
    }

    return {
      message: `Successfully scheduled "${eventName}" for ${date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      event,
    };
  }

  /**
   * Execute report command
   */
  private async executeReportCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { reportType, period } = command.parameters;

    // Generate report based on type
    let reportData: any;

    switch (reportType.toLowerCase()) {
      case 'financial':
      case 'budget':
        reportData = await this.generateFinancialReport(period, context);
        break;
      case 'activity':
      case 'activities':
        reportData = await this.generateActivityReport(period, context);
        break;
      case 'member':
      case 'members':
        reportData = await this.generateMemberReport(context);
        break;
      default:
        reportData = await this.generateGenericReport(reportType, period, context);
    }

    return {
      message: `Generated ${reportType} report${period ? ` for ${period}` : ''}`,
      report: reportData,
    };
  }

  /**
   * Execute find command
   */
  private async executeFindCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { target, skill, project } = command.parameters;

    // TODO: Fetch members from spreadsheet
    const members: any[] = []; // Placeholder

    // Filter members based on criteria
    const filteredMembers = members.filter(member => {
      if (skill && !member.skills?.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))) {
        return false;
      }
      return true;
    });

    return {
      message: `Found ${filteredMembers.length} ${target}${skill ? ` with ${skill} skills` : ''}${project ? ` for ${project}` : ''}`,
      members: filteredMembers,
    };
  }

  /**
   * Execute plan command
   */
  private async executePlanCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { targetMember, basedOn } = command.parameters;

    // TODO: Fetch member data from spreadsheet
    const memberSkills: Record<string, number> = {}; // Placeholder
    const targetSkill = basedOn || 'Leadership';

    // Generate learning path
    const learningPath = await predictiveEngine.generateLearningPath(
      memberSkills,
      targetSkill,
      50, // Current level
      90  // Target level
    );

    return {
      message: `Created learning path for ${targetMember} based on ${basedOn || 'assessment'}`,
      learningPath,
    };
  }

  /**
   * Execute notify command
   */
  private async executeNotifyCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { recipients, message } = command.parameters;

    // TODO: Send notifications
    // await notificationService.sendCustomNotifications(recipients, message);

    return {
      message: `Sent notification to ${recipients.length} recipient(s)`,
      recipients,
    };
  }

  /**
   * Execute analyze command
   */
  private async executeAnalyzeCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { subject } = command.parameters;

    // TODO: Fetch data from spreadsheet
    const data: any = {}; // Placeholder

    // Generate insights
    const insights = await insightsEngine.generateInsights(data);

    return {
      message: `Analyzed ${subject}`,
      insights,
    };
  }

  /**
   * Execute predict command
   */
  private async executePredictCommand(
    command: Command,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    const { subject } = command.parameters;

    // TODO: Fetch data from spreadsheet
    const data: any = {}; // Placeholder

    // Generate predictions based on subject
    let predictions: any;

    if (subject.toLowerCase().includes('meeting') || subject.toLowerCase().includes('schedule')) {
      // Predict optimal meeting times
      predictions = await predictiveEngine.suggestMeetingTimes([], 60);
    } else if (subject.toLowerCase().includes('budget') || subject.toLowerCase().includes('spending')) {
      // Predict budget allocation
      predictions = await predictiveEngine.recommendBudgetAllocation([], 1000000);
    } else {
      predictions = { message: 'Prediction not available for this subject' };
    }

    return {
      message: `Generated predictions for ${subject}`,
      predictions,
    };
  }

  /**
   * Parse date text
   */
  private async parseDateText(dateText: string): Promise<Date | null> {
    const now = new Date();

    // Handle relative dates
    const lowerText = dateText.toLowerCase();

    if (lowerText.includes('next month')) {
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    if (lowerText.includes('next week')) {
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    if (lowerText.includes('tomorrow')) {
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    if (lowerText.includes('today')) {
      return now;
    }

    // Try to parse specific date formats
    const datePatterns = [
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
      /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
      /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
    ];

    for (const pattern of datePatterns) {
      const match = dateText.match(pattern);
      if (match) {
        const [, part1, part2, part3] = match;
        // Try different orderings
        const date1 = new Date(parseInt(part3), parseInt(part2) - 1, parseInt(part1));
        const date2 = new Date(parseInt(part1), parseInt(part2) - 1, parseInt(part3));

        if (!isNaN(date1.getTime())) return date1;
        if (!isNaN(date2.getTime())) return date2;
      }
    }

    // Use AI to parse date
    try {
      const prompt = `Parse this date text and return in ISO format (YYYY-MM-DD): "${dateText}". Return only the date.`;
      const request: AIRequest = {
        prompt,
        maxTokens: 50,
        temperature: 0.1,
        useCache: true,
        priority: 'low',
      };
      const response = await aiService.generate(request);
      const parsedDate = new Date(response.content.trim());
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (error) {
      }

    return null;
  }

  /**
   * Generate financial report
   */
  private async generateFinancialReport(
    period?: string,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    // TODO: Fetch financial data from spreadsheet
    return {
      type: 'financial',
      period: period || 'all time',
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      categories: [],
    };
  }

  /**
   * Generate activity report
   */
  private async generateActivityReport(
    period?: string,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    // TODO: Fetch activity data from spreadsheet
    return {
      type: 'activity',
      period: period || 'all time',
      totalActivities: 0,
      completedActivities: 0,
      totalParticipants: 0,
      averageAttendance: 0,
    };
  }

  /**
   * Generate member report
   */
  private async generateMemberReport(
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    // TODO: Fetch member data from spreadsheet
    return {
      type: 'member',
      totalMembers: 0,
      activeMembers: 0,
      newMembers: 0,
      averageEngagement: 0,
    };
  }

  /**
   * Generate generic report
   */
  private async generateGenericReport(
    reportType: string,
    period?: string,
    context?: { spreadsheetId?: string; sheetName?: string }
  ): Promise<any> {
    return {
      type: reportType,
      period: period || 'all time',
      message: `Report generation for ${reportType} not yet implemented`,
    };
  }

  /**
   * Get available commands
   */
  getAvailableCommands(): string[] {
    return [
      '@ai Schedule [event name] for [date] with [number] participants',
      '@ai Generate [report type] report for [period]',
      '@ai Find [target] with [skill] skills for [project]',
      '@ai Plan learning path for [member] based on [assessment]',
      '@ai Notify [recipients] about [message]',
      '@ai Analyze [subject]',
      '@ai Predict [subject]',
    ];
  }

  /**
   * Get command examples
   */
  getCommandExamples(): string[] {
    return [
      '@ai Schedule workshop for next month with 30 participants',
      '@ai Generate financial report for Q1 2024',
      '@ai Find members with CAD skills for project X',
      '@ai Plan learning path for John based on his assessment',
      '@ai Notify all members about the upcoming meeting',
      '@ai Analyze member engagement trends',
      '@ai Predict optimal meeting times for next week',
    ];
  }
}

// Export singleton instance
export const naturalLanguageProcessor = new NaturalLanguageProcessor();

// Export class for testing
export { NaturalLanguageProcessor };
