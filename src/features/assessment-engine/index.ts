/**
 * Assessment Engine - Main Barrel Export
 * 
 * Generic Assessment Engine untuk PPSDM KMITS
 * Mendukung 9 dimensi dengan konfigurasi yang fleksibel
 */

// Core Types
export type {
  DimensionId,
  DimensionConfig,
  InstrumentConfig,
  QuestionConfig,
  ResponseScaleType,
  ResponseScale,
  ScoringConfig,
  ScoringAlgorithmType,
  ScoreThresholds,
  ThresholdConfig,
  AssessmentResponse,
  AssessmentResult,
  AssessmentSession,
  SessionMetadata,
  DimensionScores,
  ScoreInterpretation,
  ComparisonData,
  ExportableResult,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationRule,
  RecommendationMap,
  AssessmentState,
  AssessmentProgress,
  ScoringResult,
  ScoringInput,
  UseAssessmentEngineReturn,
  UseValidationReturn,
  StartAssessmentRequest,
  SubmitResponseRequest,
  CompleteAssessmentRequest,
  AssessmentEngineConfig,
  GlobalSettings,
  FeatureFlags
} from './core/types';


// Components
export {
  AssessmentRunner,
  ProgressTracker,
  QuestionRenderer,
  Navigation,
  Timer
} from './components';

// Hooks
export {
  useAssessmentEngine,
  useValidation
} from './hooks';

// Utils
export {
  calculateScore,
  normalizeScore,
  calculatePercentile,
  calculateWeightedScore,
  applyReverseScoring
} from './utils';

// Config
export { dimensionConfigs } from './config/dimensions';
