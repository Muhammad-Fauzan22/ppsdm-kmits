import { ReportData } from '../types';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Cognitive Assessment Data Aggregator
 * Aggregates and transforms cognitive assessment data for report generation
 */
export class CognitiveAggregator {
  /**
   * Aggregate cognitive assessment data from database
   */
  static async aggregate(assessmentId: string, userId: string): Promise<ReportData> {
    try {
      const supabase = await createClient();
      const assessmentData = await this.fetchAssessmentData(supabase, assessmentId, userId);
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();
      
      return {
        reportType: 'cognitive',
        assessmentId,
        reportId: `cognitive-${assessmentId}`,
        userId,
        userName: profile?.full_name || 'Mahasiswa ITS',
        userEmail: profile?.email || 'mahasiswa@its.ac.id',
        generatedAt: new Date(),
        overallScore: assessmentData.overall_score || 0,
        scores: this.processScores(assessmentData),
        strengths: assessmentData.strengths || this.generateStrengths(assessmentData),
        areasForImprovement: assessmentData.areas_for_improvement || this.generateImprovements(assessmentData),
        recommendations: assessmentData.recommendations || this.generateRecommendations(assessmentData),
        metadata: {
          assessmentId,
          assessmentDate: new Date(assessmentData.created_at),
          dataPoints: this.countDataPoints(assessmentData),
        },
      };
    } catch (error) {
      logger.error('Error aggregating cognitive assessment', { error, assessmentId, userId });
      throw error;
    }
  }

  /**
   * Fetch assessment data from database
   */
  private static async fetchAssessmentData(supabase: any, assessmentId: string, userId: string): Promise<any> {
    // Fetch cognitive dimension assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        id,
        created_at,
        status,
        assessment_results!inner(
          dimension_id,
          raw_score,
          normalized_score,
          percentile_rank,
          question_responses,
          dimensions!inner(
            id,
            name,
            category
          )
        )
      `)
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .eq('status', 'completed')
      .single();

    if (assessmentError) {
      throw new Error(`Failed to fetch assessment: ${assessmentError.message}`);
    }

    if (!assessment) {
      throw new Error('Assessment not found');
    }

    // Filter for cognitive dimension results
    const cognitiveResults = assessment.assessment_results?.filter(
      (ar: any) => ar.dimensions?.category === 'cognitive'
    ) || [];

    // Calculate scores
    const result: any = {
      created_at: assessment.created_at,
      overall_score: 0,
      strengths: [],
      areas_for_improvement: [],
      recommendations: [],
    };

    let totalScore = 0;
    let resultCount = 0;

    // Map cognitive sub-dimensions
    cognitiveResults.forEach((ar: any) => {
      const dimensionName = ar.dimensions?.name?.toLowerCase();
      
      if (dimensionName?.includes('memory') || dimensionName?.includes('memori')) {
        result.memory_score = ar.raw_score || 0;
        result.memory_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('attention') || dimensionName?.includes('perhatian')) {
        result.attention_score = ar.raw_score || 0;
        result.attention_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('reasoning') || dimensionName?.includes('penalaran')) {
        result.reasoning_score = ar.raw_score || 0;
        result.reasoning_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('processing') || dimensionName?.includes('pemotongan')) {
        result.processing_speed_score = ar.raw_score || 0;
        result.processing_speed_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      }
    });

    result.overall_score = resultCount > 0 ? Math.round(totalScore / resultCount) : 0;

    // If no specific cognitive results found, use generic calculation
    if (resultCount === 0 && assessment.assessment_results?.length > 0) {
      assessment.assessment_results.forEach((ar: any, index: number) => {
        const scores = ['memory', 'attention', 'reasoning', 'processing_speed'];
        const scoreName = scores[index % scores.length];
        result[`${scoreName}_score`] = ar.raw_score || 0;
        result[`${scoreName}_percentage`] = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
      });
      result.overall_score = Math.round(totalScore / assessment.assessment_results.length);
    }

    return result;
  }

  /**
   * Process scores into standardized format
   */
  private static processScores(data: any): Record<string, any> {
    const determineLevel = (percentage: number): string => {
      if (percentage >= 80) return 'excellent';
      if (percentage >= 70) return 'good';
      if (percentage >= 60) return 'average';
      return 'needs-improvement';
    };

    return {
      memory: {
        score: data.memory_score || 0,
        percentage: data.memory_percentage || 0,
        dimension: 'memory',
        maxScore: 100,
        level: determineLevel(data.memory_percentage || 0),
        description: 'Kemampuan mengingat dan menyimpan informasi'
      },
      attention: {
        score: data.attention_score || 0,
        percentage: data.attention_percentage || 0,
        dimension: 'attention',
        maxScore: 100,
        level: determineLevel(data.attention_percentage || 0),
        description: 'Kemampuan fokus dan konsentrasi'
      },
      reasoning: {
        score: data.reasoning_score || 0,
        percentage: data.reasoning_percentage || 0,
        dimension: 'reasoning',
        maxScore: 100,
        level: determineLevel(data.reasoning_percentage || 0),
        description: 'Kemampuan penalaran logis dan analitis'
      },
      processingSpeed: {
        score: data.processing_speed_score || 0,
        percentage: data.processing_speed_percentage || 0,
        dimension: 'processingSpeed',
        maxScore: 100,
        level: determineLevel(data.processing_speed_percentage || 0),
        description: 'Kecepatan memproses informasi'
      },
    };
  }

  /**
   * Generate strengths based on high scores
   */
  private static generateStrengths(data: any): string[] {
    const strengths: string[] = [];
    
    if (data.memory_percentage >= 75) {
      strengths.push('Kemampuan memori yang kuat');
    }
    if (data.attention_percentage >= 75) {
      strengths.push('Fokus dan konsentrasi yang baik');
    }
    if (data.reasoning_percentage >= 75) {
      strengths.push('Penalaran logis yang tajam');
    }
    if (data.processing_speed_percentage >= 75) {
      strengths.push('Kecepatan berpikir yang tinggi');
    }

    if (strengths.length === 0) {
      strengths.push('Potensi kognitif yang dapat dikembangkan');
      strengths.push('Kesadaran akan pentingnya asesmen kognitif');
    }

    return strengths;
  }

  /**
   * Generate areas for improvement
   */
  private static generateImprovements(data: any): string[] {
    const improvements: string[] = [];
    
    if (data.memory_percentage < 60) {
      improvements.push('Latih memori dengan teknik mnemonic dan spaced repetition');
    }
    if (data.attention_percentage < 60) {
      improvements.push('Tingkatkan fokus dengan teknik Pomodoro dan eliminasi distraksi');
    }
    if (data.reasoning_percentage < 60) {
      improvements.push('Latih penalaran dengan puzzle, sudoku, dan soal logika');
    }
    if (data.processing_speed_percentage < 60) {
      improvements.push('Latih kecepatan dengan drill dan latihan berulang');
    }

    if (improvements.length === 0) {
      improvements.push('Pertahankan performa kognitif yang baik');
      improvements.push('Tantang diri dengan materi yang lebih kompleks');
    }

    return improvements;
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    recommendations.push('Gunakan teknik active recall saat belajar');
    recommendations.push('Tidur cukup (7-8 jam) untuk optimalisasi fungsi kognitif');
    recommendations.push('Konsumsi makanan kaya antioksidan dan omega-3');

    if (data.memory_percentage < 70) {
      recommendations.push('Gunakan aplikasi flashcard seperti Anki untuk latihan memori');
    }
    if (data.attention_percentage < 70) {
      recommendations.push('Praktikkan mindfulness meditation 10 menit per hari');
    }

    return recommendations;
  }

  /**
   * Count data points for metadata
   */
  private static countDataPoints(data: any): number {
    let count = 0;
    const scoreKeys = ['memory', 'attention', 'reasoning', 'processing_speed'];
    
    scoreKeys.forEach(key => {
      if (data[`${key}_score`] !== undefined) count++;
      if (data[`${key}_percentage`] !== undefined) count++;
    });
    
    if (data.strengths) count += data.strengths.length;
    if (data.areas_for_improvement) count += data.areas_for_improvement.length;
    if (data.recommendations) count += data.recommendations.length;
    
    return count;
  }
}
