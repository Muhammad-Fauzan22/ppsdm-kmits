/**
 * Generic Assessment Engine - Type Definitions
 * Configuration-driven approach untuk 9 dimensi PPSDM
 */

// ============================================================================
// Dimension Types
// ============================================================================

export type DimensionId =
  | 'cognitive'
  | 'self-management'
  | 'emotional-social'
  | 'spiritual'
  | 'physical'
  | 'mental-health'
  | 'character'
  | 'financial'
  | 'environmental';

export interface DimensionConfig {
  id: DimensionId;
  title: string;
  name?: string; // Legacy support for AssessmentRunner
  description: string;
  icon: string;
  color: string;
  version?: string;
  engine?: string;
  instruments?: InstrumentConfig[]; // Make optional
  items?: Array<{
    id: string;
    text: string;
    type?: 'likert' | 'scenario' | 'choice' | 'behavioral';
    scenario?: string;
    labels?: { min?: string; max?: string };
    options?: Array<{ id: string | number; text: string; value?: number }>;
  }>; // Legacy support for AssessmentRunner
  guide?: {
    title: string;
    description: string;
    cards: Array<{
      title: string;
      content: string;
      icon?: React.ComponentType | string;
      color?: string;
    }>;
  }; // Legacy support for AssessmentRunner
  scoring?: {
    algorithm: ScoringAlgorithmType;
    min_score: number;
    max_score: number;
    thresholds: ScoreThresholds;
    normalizeTo100?: boolean;
    weights?: number[];
    reverseScored?: boolean[];
  };
  scoringAlgorithm?: ScoringAlgorithmType;
  thresholds?: ScoreThresholds;
  recommendations?: RecommendationMap; // Make optional
  estimatedDurationMinutes?: number; // Make optional
  order?: number; // Make optional

  // Legacy support for useAssessment hook
  calculateScore?: (responses: Record<string, number>) => Record<string, any>;
  transformToPayload?: (results: Record<string, any>, userId: string) => Record<string, any>;
  tables?: {
    assessments: string;
    responses: string;
  };
  routes?: {
    results: string;
  };
}


export interface InstrumentConfig {
  id: string;
  name: string;
  description?: string;
  items: number;
  responseScale: ResponseScaleType;
  scoring: ScoringConfig;
  timeLimitMinutes?: number;
  randomizeItems?: boolean;
}

// ============================================================================
// Question & Response Types
// ============================================================================

export type ResponseScaleType = 'likert5' | 'likert7' | 'yesno' | 'frequency' | 'custom';

export interface QuestionConfig {
  id: string;
  instrumentId: string;
  text: string;
  subText?: string;
  responseScale: ResponseScaleType;
  reverseScored?: boolean;
  weight?: number;
  category?: string;
  media?: {
    type: 'image' | 'video' | 'audio';
    url: string;
  };
}

export interface ResponseScale {
  type: ResponseScaleType;
  min: number;
  max: number;
  labels: Record<number, string>;
  options?: Array<{
    value: number;
    label: string;
    description?: string;
  }>;
}

// ============================================================================
// Scoring Types
// ============================================================================

export type ScoringAlgorithmType = 'simpleSum' | 'weightedSum' | 'weighted_sum' | 'average' | 'irt' | 'custom';

export interface ScoringConfig {
  algorithm: ScoringAlgorithmType;
  weights?: number[];
  reverseScored?: boolean[];
  categories?: string[];
  customFormula?: string;
  normalizeTo100?: boolean;
}

export interface ScoreThresholds {
  low: ThresholdConfig;
  medium: ThresholdConfig;
  high: ThresholdConfig;
}

export interface ThresholdConfig {
  min: number;
  max: number;
  label: string;
  description?: string;
  color?: string;
}

export interface RecommendationMap {
  low: string[];
  medium: string[];
  high: string[];
}

// ============================================================================
// Assessment Session Types
// ============================================================================

export interface AssessmentSession {
  id: string;
  userId: string | null;
  sessionToken: string | null;
  deviceFingerprint: string | null;
  dimensionId: DimensionId;
  status: 'in_progress' | 'completed' | 'abandoned' | 'paused';
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  currentItemIndex: number;
  responses: Record<string, AssessmentResponse>;
  metadata: SessionMetadata;
}

export interface AssessmentResponse {
  questionId: string;
  instrumentId: string;
  dimensionId: string;
  value: number | string | boolean;
  answeredAt: string;
  timeSpentMs: number;
  category?: string;
  deviceInfo?: {
    userAgent?: string;
    screenSize?: string;
  };
}


export interface SessionMetadata {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  customData?: Record<string, any>;
}

// ============================================================================
// Result Types
// ============================================================================

export interface AssessmentResult {
  sessionId: string;
  userId: string | null;
  dimensionId: DimensionId;
  completedAt: string;
  scores: DimensionScores;
  interpretation: ScoreInterpretation;
  recommendations: string[];
  percentileRank?: number;
  comparisonData?: ComparisonData;
  exportData?: ExportableResult;
}

export interface DimensionScores {
  total: number;
  raw: number;
  normalized: number; // 0-100 scale
  byCategory?: Record<string, number>;
  byInstrument?: Record<string, number>;
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
}

export interface ScoreInterpretation {
  level: 'low' | 'medium' | 'high';
  label: string;
  description: string;
  color: string;
  detailedAnalysis?: string;
}

export interface ComparisonData {
  peerGroup?: string;
  averageScore: number;
  userScore: number;
  percentile: number;
  totalParticipants: number;
}

export interface ExportableResult {
  pdfUrl?: string;
  jsonData: string;
  csvData?: string;
  generatedAt: string;
  expiresAt?: string;
}

// ============================================================================
// Engine Configuration
// ============================================================================

export interface AssessmentEngineConfig {
  dimensions: Record<DimensionId, DimensionConfig>;
  responseScales: Record<ResponseScaleType, ResponseScale>;
  globalSettings: GlobalSettings;
  features: FeatureFlags;
}

export interface GlobalSettings {
  allowAnonymous: boolean;
  sessionTimeoutMinutes: number;
  autoSaveIntervalSeconds: number;
  maxPauseDurationMinutes: number;
  enableProgressTracking: boolean;
  enableTimeTracking: boolean;
  enableDeviceTracking: boolean;
  requireConsentBeforeStart: boolean;
  showProgressBar: boolean;
  allowResume: boolean;
  maxAttemptsPerDimension: number;
}

export interface FeatureFlags {
  enableAIRecommendations: boolean;
  enablePeerComparison: boolean;
  enableHistoricalTracking: boolean;
  enableGamification: boolean;
  enableSocialSharing: boolean;
  enableExport: boolean;
  enablePrint: boolean;
}

// ============================================================================
// API Types
// ============================================================================

export interface StartAssessmentRequest {
  dimensionId: DimensionId;
  userId?: string;
  sessionToken?: string;
  metadata?: SessionMetadata;
}

export interface SubmitResponseRequest {
  sessionId: string;
  questionId: string;
  value: number | string | boolean;
  timeSpentMs: number;
}

export interface CompleteAssessmentRequest {
  sessionId: string;
  finalResponses?: Record<string, AssessmentResponse>;
}

export interface AssessmentError {
  code: string;
  message: string;
  field?: string;
  recoverable: boolean;
  retryAfter?: number;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationRule {
  type: 'required' | 'range' | 'pattern' | 'custom';
  message: string;
  params?: Record<string, any>;
  validator?: (value: any) => boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ============================================================================
// Assessment State Types (for useAssessmentEngine hook)
// ============================================================================

export interface AssessmentState {
  session: AssessmentSession | null;
  currentQuestionIndex: number;
  responses: Record<string, AssessmentResponse | number>;
  status: 'idle' | 'loading' | 'in_progress' | 'submitting' | 'completed' | 'error' | 'paused' | 'abandoned';
  error: AssessmentError | null;
  isLoading: boolean;
  isSubmitting: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  isComplete: boolean;
  progress: number;
  timeRemaining?: number;
  validation: ValidationResult;

  // Legacy support for AssessmentRunner
  step?: 'guide' | 'consent' | 'assessment' | 'results';
  agreement?: {
    read: boolean;
    consent: boolean;
  };
}



export interface AssessmentProgress {
  currentItem: number;
  totalItems: number;
  answeredItems: number;
  percentComplete: number;
  estimatedTimeRemainingMinutes: number;
}

// ============================================================================
// Scoring Result Types
// ============================================================================

export interface ScoringResult {
  rawScore: number;
  maxPossibleScore: number;
  normalizedScore: number; // 0-100
  percentile?: number;
  level: 'low' | 'medium' | 'high';
  categoryScores?: Record<string, number>;
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
  interpretation: string;
  recommendations: string[];
}

export interface ScoringInput {
  responses: Record<string, AssessmentResponse>;
  questions: QuestionConfig[];
  scoringConfig: ScoringConfig;
  responseScale: ResponseScale;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseAssessmentEngineReturn {
  // State
  state: AssessmentState;
  progress: AssessmentProgress;

  // Actions
  startAssessment: (dimensionId: DimensionId, metadata?: SessionMetadata) => Promise<void>;
  submitResponse: (questionId: string, value: number | string | boolean, timeSpentMs?: number) => Promise<void>;
  goToNext: () => void;
  goToPrevious: () => void;
  goToQuestion: (index: number) => void;
  pauseAssessment: () => void;
  resumeAssessment: () => void;
  completeAssessment: () => Promise<AssessmentResult>;
  abandonAssessment: () => void;

  // Helpers
  getCurrentQuestion: () => QuestionConfig | null;
  getQuestionStatus: (questionId: string) => 'unanswered' | 'answered' | 'current' | 'review';
  validateCurrentResponse: () => ValidationResult;
  saveProgress: () => Promise<void>;
}

export interface UseValidationReturn {
  validateResponse: (question: QuestionConfig, value: number | string | boolean) => ValidationResult;
  validateAll: (questions: QuestionConfig[], responses: Map<string, any> | Record<string, any>) => ValidationResult;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  clearErrors: () => void;
}
