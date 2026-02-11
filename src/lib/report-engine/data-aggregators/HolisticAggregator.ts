import { ReportData, AssessmentScore } from '../types';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Holistic Assessment Data Aggregator
 * Aggregates and transforms holistic assessment data for report generation
 */
export class HolisticAggregator {
  /**
   * Aggregate holistic assessment data from database
   */
  static async aggregate(assessmentId: string, userId: string): Promise<ReportData> {
    try {
      const supabase = await createClient();
      const assessmentData = await this.fetchAssessmentData(supabase, assessmentId, userId);

      // Fetch user profile for name/email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', userId)
        .single();

      // Calculate holistic health status
      const overallScore = assessmentData.overall_score || 0;
      let holisticHealth = 'Perlu Perhatian';
      if (overallScore >= 80) holisticHealth = 'Sangat Baik';
      else if (overallScore >= 60) holisticHealth = 'Baik';
      else if (overallScore >= 40) holisticHealth = 'Cukup';

      return {
        reportType: 'holistic',
        assessmentId,
        reportId: `holistic-${assessmentId}`,
        userId,
        userName: profile?.full_name || 'Mahasiswa ITS',
        userEmail: profile?.email || 'mahasiswa@its.ac.id',
        generatedAt: new Date(),
        overallScore,
        holisticHealth,
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
      logger.error('Error aggregating holistic assessment', { error, assessmentId, userId });
      throw error;
    }
  }

  /**
   * Process scores from assessment data
   */
  private static processScores(data: any): Record<string, AssessmentScore> {
    const createScore = (
      score: number,
      percentage: number,
      dimension: string,
      description: string
    ): AssessmentScore => {
      // Determine level based on percentage
      let level: 'excellent' | 'good' | 'average' | 'needs-improvement';
      if (percentage >= 80) {
        level = 'excellent';
      } else if (percentage >= 60) {
        level = 'good';
      } else if (percentage >= 40) {
        level = 'average';
      } else {
        level = 'needs-improvement';
      }

      return {
        score: score || 0,
        maxScore: 100,
        percentage: percentage || 0,
        dimension,
        level,
        description,
      };
    };

    return {
      cognitive: createScore(
        data.cognitive_score,
        data.cognitive_percentage,
        'cognitive',
        'Skor kognitif dan intelektual'
      ),
      emotional: createScore(
        data.emotional_score,
        data.emotional_percentage,
        'emotional',
        'Skor kecerdasan emosional'
      ),
      social: createScore(
        data.social_score,
        data.social_percentage,
        'social',
        'Skor keterampilan sosial'
      ),
      physical: createScore(
        data.physical_score,
        data.physical_percentage,
        'physical',
        'Skor kesehatan fisik'
      ),
      spiritual: createScore(
        data.spiritual_score,
        data.spiritual_percentage,
        'spiritual',
        'Skor spiritual'
      ),
      character: createScore(
        data.character_score,
        data.character_percentage,
        'character',
        'Skor karakter'
      ),
      financial: createScore(
        data.financial_score,
        data.financial_percentage,
        'financial',
        'Skor literasi finansial'
      ),
      selfManagement: createScore(
        data.self_management_score,
        data.self_management_percentage,
        'selfManagement',
        'Skor manajemen diri'
      ),
    };
  }

  /**
   * Fetch assessment data from database
   */
  private static async fetchAssessmentData(supabase: any, assessmentId: string, userId: string): Promise<any> {
    // Fetch assessment with results
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

    // Transform results into dimension scores
    const result: any = {
      created_at: assessment.created_at,
      overall_score: 0,
      strengths: [],
      areas_for_improvement: [],
      recommendations: [],
    };

    let totalScore = 0;
    let dimensionCount = 0;

    assessment.assessment_results?.forEach((ar: any) => {
      const dimensionName = ar.dimensions?.name?.toLowerCase().replace(/\s+/g, '_');
      if (dimensionName) {
        result[`${dimensionName}_score`] = ar.raw_score || 0;
        result[`${dimensionName}_percentage`] = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        dimensionCount++;
      }
    });

    result.overall_score = dimensionCount > 0 ? Math.round(totalScore / dimensionCount) : 0;

    return result;
  }

  /**
   * Generate strengths based on high-scoring dimensions
   */
  private static generateStrengths(data: any): string[] {
    const strengths: string[] = [];
    const dimensions = [
      { name: 'cognitive', label: 'Kognitif', threshold: 75 },
      { name: 'emotional', label: 'Emosional', threshold: 75 },
      { name: 'social', label: 'Sosial', threshold: 75 },
      { name: 'physical', label: 'Fisik', threshold: 75 },
      { name: 'spiritual', label: 'Spiritual', threshold: 75 },
      { name: 'character', label: 'Karakter', threshold: 75 },
      { name: 'financial', label: 'Finansial', threshold: 75 },
      { name: 'self_management', label: 'Manajemen Diri', threshold: 75 },
    ];

    dimensions.forEach(dim => {
      const score = data[`${dim.name}_percentage`];
      if (score >= dim.threshold) {
        strengths.push(`${dim.label} yang kuat (${score}%)`);
      }
    });

    if (strengths.length === 0) {
      strengths.push('Komitmen terhadap pengembangan diri');
      strengths.push('Kesadaran akan pentingnya asesmen holistik');
    }

    return strengths;
  }

  /**
   * Generate areas for improvement based on low-scoring dimensions
   */
  private static generateImprovements(data: any): string[] {
    const improvements: string[] = [];
    const dimensions = [
      { name: 'cognitive', label: 'kognitif' },
      { name: 'emotional', label: 'emosional' },
      { name: 'social', label: 'sosial' },
      { name: 'physical', label: 'fisik' },
      { name: 'spiritual', label: 'spiritual' },
      { name: 'character', label: 'karakter' },
      { name: 'financial', label: 'finansial' },
      { name: 'self_management', label: 'manajemen diri' },
    ];

    dimensions.forEach(dim => {
      const score = data[`${dim.name}_percentage`];
      if (score < 50) {
        improvements.push(`Perlu peningkatan di dimensi ${dim.label} (${score}%)`);
      }
    });

    if (improvements.length === 0) {
      improvements.push('Pertahankan keseimbangan antar dimensi');
      improvements.push('Terus kembangkan semua aspek holistik');
    }

    return improvements;
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    // Add recommendations based on lowest scores
    if (data.physical_percentage < 60) {
      recommendations.push('Ikuti program kebugaran fisik regular (minimal 3x seminggu)');
    }
    if (data.emotional_percentage < 60) {
      recommendations.push('Praktikkan mindfulness dan teknik manajemen stress');
    }
    if (data.social_percentage < 60) {
      recommendations.push('Bergabung dengan komunitas atau organisasi kampus');
    }
    if (data.financial_percentage < 60) {
      recommendations.push('Ikuti workshop literasi finansial dan buat anggaran bulanan');
    }
    if (data.cognitive_percentage < 60) {
      recommendations.push('Gunakan teknik active recall dan spaced repetition saat belajar');
    }

    // Add general recommendations
    if (recommendations.length < 3) {
      recommendations.push('Buat rencana pengembangan diri (PDP) berdasarkan hasil asesmen');
      recommendations.push('Lakukan evaluasi berkala setiap bulan');
    }

    return recommendations;
  }

  /**
   * Count data points for metadata
   */
  private static countDataPoints(data: any): number {
    let count = 0;
    const scoreKeys = [
      'cognitive',
      'emotional',
      'social',
      'physical',
      'spiritual',
      'character',
      'financial',
      'self_management'
    ];

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
