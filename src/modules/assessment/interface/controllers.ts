/**
 * Assessment Interface Layer - API Controllers
 * Handles HTTP requests and responses
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  StartAssessmentUseCase,
  CompleteAssessmentUseCase,
  GetUserProgressUseCase,
  GetAssessmentStatisticsUseCase
} from '../application/use-cases';
import { SupabaseAssessmentRepository, SupabaseDimensionRepository } from '../infrastructure/repositories';
import { z } from 'zod';

// Initialize repositories
const assessmentRepo = new SupabaseAssessmentRepository();
const dimensionRepo = new SupabaseDimensionRepository();

// Initialize use cases
const startAssessmentUseCase = new StartAssessmentUseCase(assessmentRepo, dimensionRepo);
const completeAssessmentUseCase = new CompleteAssessmentUseCase(assessmentRepo);
const getUserProgressUseCase = new GetUserProgressUseCase(assessmentRepo);
const getStatisticsUseCase = new GetAssessmentStatisticsUseCase(assessmentRepo, dimensionRepo);

// Validation schemas
const startAssessmentSchema = z.object({
  dimensionId: z.number().int().positive()
});

const completeAssessmentSchema = z.object({
  assessmentId: z.string().uuid(),
  score: z.number().min(0).max(100)
});

// API Route Handlers
export class AssessmentController {
  // POST /api/assessments/start
  static async startAssessment(req: NextRequest): Promise<NextResponse> {
    try {
      // Get current user from session
      const userId = await getCurrentUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const body = await req.json();
      const { dimensionId } = startAssessmentSchema.parse(body);

      const assessment = await startAssessmentUseCase.execute({
        userId,
        dimensionId
      });

      return NextResponse.json({
        success: true,
        data: {
          id: assessment.getId().getValue(),
          dimensionId: assessment.getDimension().getId(),
          dimensionName: assessment.getDimension().getName(),
          startedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  }

  // POST /api/assessments/complete
  static async completeAssessment(req: NextRequest): Promise<NextResponse> {
    try {
      const userId = await getCurrentUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const body = await req.json();
      const { assessmentId, score } = completeAssessmentSchema.parse(body);

      const result = await completeAssessmentUseCase.execute({
        assessmentId,
        score
      });

      return NextResponse.json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Invalid input', details: error.errors },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  }

  // GET /api/assessments/progress
  static async getUserProgress(req: NextRequest): Promise<NextResponse> {
    try {
      const userId = await getCurrentUserId(req);
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const progress = await getUserProgressUseCase.execute(userId);

      return NextResponse.json({
        success: true,
        data: progress
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  // GET /api/assessments/statistics
  static async getStatistics(req: NextRequest): Promise<NextResponse> {
    try {
      const stats = await getStatisticsUseCase.execute();

      return NextResponse.json({
        success: true,
        data: stats
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}

// Helper function to get current user ID from session
async function getCurrentUserId(req: NextRequest): Promise<string | null> {
  // This is a simplified version - in production, extract from JWT or session
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  // TODO: Implement proper JWT verification
  // For now, return a mock user ID for testing
  return 'mock-user-id';
}

// Export individual route handlers for Next.js API routes
export const POST_start = AssessmentController.startAssessment;
export const POST_complete = AssessmentController.completeAssessment;
export const GET_progress = AssessmentController.getUserProgress;
export const GET_statistics = AssessmentController.getStatistics;
