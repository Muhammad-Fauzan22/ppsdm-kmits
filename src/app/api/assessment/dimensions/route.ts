/**
 * API Route: /api/assessment/dimensions
 * 
 * Returns all 9 dimensions with their metadata
 * Public endpoint - no authentication required
 */

import { NextRequest, NextResponse } from 'next/server';
import { DIMENSION_DATA } from '@/lib/dimensionData';

export async function GET(request: NextRequest) {
  try {
    // Validate DIMENSION_DATA is loaded
    if (!DIMENSION_DATA || Object.keys(DIMENSION_DATA).length === 0) {
      console.error('DIMENSION_DATA is empty or undefined');
      return NextResponse.json(
        {
          success: false,
          error: 'Dimension data not loaded',
          message: 'The dimension configuration data failed to load',
        },
        { status: 500 }
      );
    }

    // Transform dimension data for API response
    const dimensions = Object.values(DIMENSION_DATA).map(dim => ({

      id: dim.id,
      name: dim.name,
      nameEn: dim.nameEn,
      tagline: dim.tagline,
      description: dim.description,
      color: dim.color,
      gradient: dim.gradient,
      icon: dim.icon,
      reliability: dim.reliability,
      sampleSize: dim.sampleSize,
      validity: dim.validity,
      estimatedTime: dim.estimatedTime,
      step: dim.step,
      totalSteps: dim.totalSteps,
      subDimensions: dim.subDimensions.map(sub => ({
        id: sub.id,
        name: sub.name,
        nameEn: sub.nameEn,
        description: sub.description,
        itemCount: sub.itemCount,
      })),
      interpretationLevels: dim.interpretationLevels,
    }));

    return NextResponse.json({
      success: true,
      data: {
        dimensions,
        totalDimensions: dimensions.length,
        totalEstimatedTime: getTotalAssessmentTime(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    console.error('Error fetching dimensions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dimensions',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

function getTotalAssessmentTime(): string {
  const totalMinutes = Object.values(DIMENSION_DATA).reduce(
    (sum, dim) => sum + parseInt(dim.estimatedTime.replace(/\D/g, '')),
    0
  );
  return `~${Math.ceil(totalMinutes / 5) * 5} menit`;
}
