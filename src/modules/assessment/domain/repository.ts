/**
 * Assessment Repository Interface
 * Part of the domain layer - defines the contract for data access
 */

import { Assessment, AssessmentId, Dimension } from './entities';

export interface AssessmentRepository {
  // Queries
  findById(id: AssessmentId): Promise<Assessment | null>;
  findByUserId(userId: string): Promise<Assessment[]>;
  findCompletedByUserId(userId: string): Promise<Assessment[]>;
  findByDimension(dimensionId: number): Promise<Assessment[]>;
  
  // Commands
  save(assessment: Assessment): Promise<void>;
  update(assessment: Assessment): Promise<void>;
  delete(id: AssessmentId): Promise<void>;
  
  // Statistics
  getAverageScoreByDimension(dimensionId: number): Promise<number | null>;
  getCompletionRate(): Promise<number>;
}

export interface DimensionRepository {
  findById(id: number): Promise<Dimension | null>;
  findAll(): Promise<Dimension[]>;
  save(dimension: Dimension): Promise<void>;
}
