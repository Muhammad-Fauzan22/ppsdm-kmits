/**
 * Assessment Module - Public API
 * Export all domain, application, and interface components
 */

// Domain
export {
  Assessment,
  AssessmentId,
  Dimension,
  Score,
  UserAssessmentAggregate,
  AssessmentCompletedEvent,
  AssessmentStartedEvent
} from './domain/entities';

export type { DomainEvent } from './domain/entities';

export type {
  AssessmentRepository,
  DimensionRepository
} from './domain/repository';

// Application
export {
  StartAssessmentUseCase,
  CompleteAssessmentUseCase,
  GetUserProgressUseCase,
  GetAssessmentStatisticsUseCase
} from './application/use-cases';

export type {
  StartAssessmentDTO,
  CompleteAssessmentDTO,
  AssessmentResultDTO
} from './application/use-cases';

// Infrastructure
export {
  SupabaseAssessmentRepository,
  SupabaseDimensionRepository
} from './infrastructure/repositories';

// Interface
export {
  AssessmentController,
  POST_start,
  POST_complete,
  GET_progress,
  GET_statistics
} from './interface/controllers';
