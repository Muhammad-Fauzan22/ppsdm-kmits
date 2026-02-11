import { AssessmentScore, ReportData } from '../types';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

/**
 * Financial Assessment Data Aggregator
 * Aggregates and transforms financial assessment data for report generation
 */
export class FinancialAggregator {
  /**
   * Aggregate financial assessment data from database
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

      // Determine financial health
      const overallScore = assessmentData.overall_score || 0;
      let financialHealth = 'Perlu Perhatian';
      if (overallScore >= 85) financialHealth = 'Sangat Sehat';
      else if (overallScore >= 70) financialHealth = 'Sehat';
      else if (overallScore >= 50) financialHealth = 'Cukup';
      
      return {
        reportType: 'financial',
        assessmentId,
        userId,
        userName: profile?.full_name || 'Mahasiswa ITS',
        userEmail: profile?.email || 'mahasiswa@its.ac.id',
        generatedAt: new Date(),
        overallScore,
        financialHealth,
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
      logger.error('Error aggregating financial assessment', { error, assessmentId, userId });
      throw error;
    }
  }

  /**
   * Fetch assessment data from database
   */
  private static async fetchAssessmentData(supabase: any, assessmentId: string, userId: string): Promise<any> {
    // Fetch financial dimension assessment
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

    // Filter for financial dimension results
    const financialResults = assessment.assessment_results?.filter(
      (ar: any) => ar.dimensions?.category === 'financial'
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

    // Map financial sub-dimensions
    financialResults.forEach((ar: any) => {
      const dimensionName = ar.dimensions?.name?.toLowerCase();
      
      if (dimensionName?.includes('budget') || dimensionName?.includes('anggaran')) {
        result.budgeting_score = ar.raw_score || 0;
        result.budgeting_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('saving') || dimensionName?.includes('tabungan')) {
        result.saving_score = ar.raw_score || 0;
        result.saving_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('invest') || dimensionName?.includes('investasi')) {
        result.investing_score = ar.raw_score || 0;
        result.investing_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('debt') || dimensionName?.includes('utang')) {
        result.debt_management_score = ar.raw_score || 0;
        result.debt_management_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      } else if (dimensionName?.includes('literacy') || dimensionName?.includes('literasi')) {
        result.financial_literacy_score = ar.raw_score || 0;
        result.financial_literacy_percentage = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
        resultCount++;
      }
    });

    result.overall_score = resultCount > 0 ? Math.round(totalScore / resultCount) : 0;

    // If no specific financial results found, use generic calculation
    if (resultCount === 0 && assessment.assessment_results?.length > 0) {
      const categories = ['budgeting', 'saving', 'investing', 'debt_management', 'financial_literacy'];
      assessment.assessment_results.forEach((ar: any, index: number) => {
        const category = categories[index % categories.length];
        result[`${category}_score`] = ar.raw_score || 0;
        result[`${category}_percentage`] = ar.normalized_score || 0;
        totalScore += ar.normalized_score || 0;
      });
      result.overall_score = Math.round(totalScore / assessment.assessment_results.length);
    }

    return result;
  }

  /**
   * Process scores into standardized format
   */
  private static processScores(data: any): Record<string, AssessmentScore> {
    const toLevel = (percentage: number): AssessmentScore['level'] => {
      if (percentage >= 85) return 'excellent';
      if (percentage >= 70) return 'good';
      if (percentage >= 50) return 'average';
      return 'needs-improvement';
    };

    const createAssessmentScore = (
      dimension: string,
      score: number,
      percentage: number,
      description: string
    ): AssessmentScore => ({
      score,
      percentage,
      dimension,
      maxScore: 100,
      level: toLevel(percentage),
      description,
    });

    return {
      budgeting: createAssessmentScore(
        'budgeting',
        data.budgeting_score || 0,
        data.budgeting_percentage || 0,
        'Kemampuan membuat dan mengikuti anggaran'
      ),
      saving: createAssessmentScore(
        'saving',
        data.saving_score || 0,
        data.saving_percentage || 0,
        'Kebiasaan menabung dan emergency fund'
      ),
      investing: createAssessmentScore(
        'investing',
        data.investing_score || 0,
        data.investing_percentage || 0,
        'Pemahaman dan praktik investasi'
      ),
      debtManagement: createAssessmentScore(
        'debt_management',
        data.debt_management_score || 0,
        data.debt_management_percentage || 0,
        'Manajemen utang dan kredit'
      ),
      financialLiteracy: createAssessmentScore(
        'financial_literacy',
        data.financial_literacy_score || 0,
        data.financial_literacy_percentage || 0,
        'Pengetahuan konsep keuangan dasar'
      ),
    };
  }

  /**
   * Generate strengths based on high scores
   */
  private static generateStrengths(data: any): string[] {
    const strengths: string[] = [];
    
    if (data.budgeting_percentage >= 75) {
      strengths.push('Disiplin dalam membuat dan mengikuti anggaran');
    }
    if (data.saving_percentage >= 75) {
      strengths.push('Kebiasaan menabung yang konsisten');
    }
    if (data.investing_percentage >= 75) {
      strengths.push('Pemahaman investasi yang baik');
    }
    if (data.debt_management_percentage >= 75) {
      strengths.push('Manajemen utang yang bijak');
    }
    if (data.financial_literacy_percentage >= 75) {
      strengths.push('Literasi keuangan yang kuat');
    }

    if (strengths.length === 0) {
      strengths.push('Kesadaran akan pentingnya kesehatan finansial');
      strengths.push('Kemauan untuk belajar mengelola keuangan');
    }

    return strengths;
  }

  /**
   * Generate areas for improvement
   */
  private static generateImprovements(data: any): string[] {
    const improvements: string[] = [];
    
    if (data.budgeting_percentage < 60) {
      improvements.push('Buat anggaran bulanan dan catat setiap pengeluaran');
    }
    if (data.saving_percentage < 60) {
      improvements.push('Mulai menyisihkan 10-20% pendapatan untuk tabungan');
    }
    if (data.investing_percentage < 60) {
      improvements.push('Pelajari dasar-dasar investasi dan instrumen investasi');
    }
    if (data.debt_management_percentage < 60) {
      improvements.push('Hindari utang konsumtif dan bayar tepat waktu');
    }
    if (data.financial_literacy_percentage < 60) {
      improvements.push('Baca buku atau ikuti kursus literasi keuangan');
    }

    if (improvements.length === 0) {
      improvements.push('Tetap pertahankan kebiasaan finansial yang baik');
      improvements.push('Eksplorasi instrumen investasi yang lebih beragam');
    }

    return improvements;
  }

  /**
   * Generate personalized recommendations
   */
  private static generateRecommendations(data: any): string[] {
    const recommendations: string[] = [];

    recommendations.push('Gunakan aplikasi budgeting untuk tracking pengeluaran');
    recommendations.push('Buat emergency fund minimal 3-6 bulan pengeluaran');

    if (data.budgeting_percentage < 70) {
      recommendations.push('Ikuti metode 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan');
    }
    if (data.investing_percentage < 70) {
      recommendations.push('Mulai investasi dengan instrumen rendah risiko seperti reksadana pasar uang');
    }
    if (data.saving_percentage < 70) {
      recommendations.push('Aktifkan autodebet untuk memastikan konsistensi menabung');
    }

    recommendations.push('Review kondisi keuangan secara berkala (bulanan/kwartalan)');

    return recommendations;
  }

  /**
   * Count data points for metadata
   */
  private static countDataPoints(data: any): number {
    let count = 0;
    const scoreKeys = ['budgeting', 'saving', 'investing', 'debt_management', 'financial_literacy'];
    
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
