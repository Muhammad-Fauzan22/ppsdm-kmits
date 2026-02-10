/**
 * Automation Module Index
 * Exports all automation components for PPSDM KMITS
 */

// AI Data Processor
export {
  aiProcessor,
  AIProcessor,
} from './ai-processor';
export type {
  SpreadsheetData,
  ProcessedData,
  DataInsight,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  CleaningOptions,
} from './ai-processor';

// Insights Engine
export {
  insightsEngine,
  InsightsEngine,
} from './insights-engine';
export type {
  InsightData,
  ActivityData,
  BudgetData,
  MemberData,
  AssessmentData,
  ActivityTrend,
  BudgetPattern,
  EngagementScore,
  SkillGap,
  ComprehensiveInsights,
} from './insights-engine';

// Predictive Engine
export {
  predictiveEngine,
  PredictiveEngine,
} from './predictive-engine';
export type {
  MemberAvailability,
  TimeSlot,
  MeetingSuggestion,
  BudgetCategory,
  BudgetRecommendation,
  MemberSkill,
  ProjectRequirement,
  TeamMember,
  TeamSuggestion,
  LearningPathStep,
  LearningPath,
} from './predictive-engine';

// Notification Service
export {
  notificationService,
  NotificationService,
} from './notification-service';
export type {
  NotificationConfig,
  EventReminder,
  BirthdayWish,
  DeadlineNotification,
  WeeklyDigest,
  ActivitySummary,
  EventSummary,
  MemberHighlight,
  NotificationResult,
  EmailTemplate,
} from './notification-service';

// Natural Language Processor
export {
  naturalLanguageProcessor,
  NaturalLanguageProcessor,
} from './natural-language-processor';
export type {
  Command,
  CommandType,
  CommandResult,
  ScheduleCommand,
  ReportCommand,
  FindCommand,
  PlanCommand,
  NotifyCommand,
} from './natural-language-processor';
