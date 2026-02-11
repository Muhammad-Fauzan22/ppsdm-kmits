/**
 * Assessment Application Layer - Use Cases
 * Contains application-specific business rules
 */

import { Assessment, AssessmentId, Dimension, Score, UserAssessmentAggregate } from '../domain/entities';
import { AssessmentRepository, DimensionRepository } from '../domain/repository';

// DTOs
export interface StartAssessmentDTO {
  userId: string;
  dimensionId: number;
}

export interface CompleteAssessmentDTO {
  assessmentId: string;
  score: number;
}

export interface AssessmentResultDTO {
  id: string;
  userId: string;
  dimensionName: string;
  score: number;
  grade: string;
  isPassing: boolean;
  completedAt?: Date;
}

// Use Case: Start Assessment
export class StartAssessmentUseCase {
  constructor(
    private assessmentRepo: AssessmentRepository,
    private dimensionRepo: DimensionRepository
  ) {}

  async execute(dto: StartAssessmentDTO): Promise<Assessment> {
    // Validate dimension exists
    const dimension = await this.dimensionRepo.findById(dto.dimensionId);
    if (!dimension) {
      throw new Error('Dimension not found');
    }

    // Check if user already has an incomplete assessment for this dimension
    const existingAssessments = await this.assessmentRepo.findByUserId(dto.userId);
    const incompleteAssessment = existingAssessments.find(
      a => !a.isCompleted() && a.getDimension().getId() === dto.dimensionId
    );

    if (incompleteAssessment) {
      return incompleteAssessment;
    }

    // Create new assessment
    const assessmentId = new AssessmentId(crypto.randomUUID());
    const assessment = Assessment.create(assessmentId, dto.userId, dimension);

    await this.assessmentRepo.save(assessment);

    return assessment;
  }
}

// Use Case: Complete Assessment
export class CompleteAssessmentUseCase {
  constructor(private assessmentRepo: AssessmentRepository) {}

  async execute(dto: CompleteAssessmentDTO): Promise<AssessmentResultDTO> {
    // Find assessment
    const assessmentId = new AssessmentId(dto.assessmentId);
    const assessment = await this.assessmentRepo.findById(assessmentId);

    if (!assessment) {
      throw new Error('Assessment not found');
    }

    if (assessment.isCompleted()) {
      throw new Error('Assessment already completed');
    }

    // Complete assessment with score
    const score = new Score(dto.score);
    assessment.complete(score);

    await this.assessmentRepo.update(assessment);

    // Return DTO
    return {
      id: assessment.getId().getValue(),
      userId: assessment.getUserId(),
      dimensionName: assessment.getDimension().getName(),
      score: score.getValue(),
      grade: score.getGrade(),
      isPassing: score.isPassing(),
      completedAt: new Date()
    };
  }
}

// Use Case: Get User Progress
export class GetUserProgressUseCase {
  constructor(private assessmentRepo: AssessmentRepository) {}

  async execute(userId: string): Promise<{
    totalAssessments: number;
    completedAssessments: number;
    averageScore: number | null;
    progress: number;
  }> {
    const assessments = await this.assessmentRepo.findByUserId(userId);
    const aggregate = new UserAssessmentAggregate(userId);
    
    assessments.forEach(a => aggregate.addAssessment(a));

    return {
      totalAssessments: assessments.length,
      completedAssessments: aggregate.getCompletedAssessments().length,
      averageScore: aggregate.getAverageScore(),
      progress: aggregate.getProgress()
    };
  }
}

// Use Case: Get Assessment Statistics
export class GetAssessmentStatisticsUseCase {
  constructor(
    private assessmentRepo: AssessmentRepository,
    private dimensionRepo: DimensionRepository
  ) {}

  async execute(): Promise<{
    completionRate: number;
    averageScoresByDimension: Array<{
      dimensionId: number;
      dimensionName: string;
      averageScore: number | null;
    }>;
  }> {
    const dimensions = await this.dimensionRepo.findAll();
    const completionRate = await this.assessmentRepo.getCompletionRate();

    const averageScoresByDimension = await Promise.all(
      dimensions.map(async (dim) => ({
        dimensionId: dim.getId(),
        dimensionName: dim.getName(),
        averageScore: await this.assessmentRepo.getAverageScoreByDimension(dim.getId())
      }))
    );

    return {
      completionRate,
      averageScoresByDimension
    };
  }
}
