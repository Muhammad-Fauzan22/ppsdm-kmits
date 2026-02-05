import { AssessmentScore, ReportData } from '../types';

/**
 * Financial Assessment Data Aggregator
 * Aggregates and transforms financial assessment data for report generation
 */
export class FinancialAggregator {
  /**
   * Aggregate financial assessment data from database
   */
  static async aggregate(assessmentId: string, userId: string): Promise<ReportData> {
    // TODO: Implement actual database query
    // This is a placeholder implementation
    
    const assessmentData = await this.fetchAssessmentData(assessmentId, userId);
    
    return {
      reportType: 'financial',
      assessmentId,
      userId,
      userName: assessmentData.user_name || 'Unknown User',
      userEmail: assessmentData.user_email || 'unknown@example.com',
      generatedAt: new Date(),
      overallScore: assessmentData.overall_score || 0,
      financialHealth: assessmentData.financial_health || 'Unknown',
      scores: this.processScores(assessmentData),
      strengths: assessmentData.strengths || [],
      areasForImprovement: assessmentData.areas_for_improvement || [],
      recommendations: assessmentData.recommendations || [],
      metadata: {
        assessmentId,
        assessmentDate: assessmentData.created_at,
        dataPoints: this.countDataPoints(assessmentData),
      },
    };
  }

  /**
   * Fetch assessment data from database
   */
  private static async fetchAssessmentData(assessmentId: string, userId: string): Promise<any> {
    // TODO: Implement actual Supabase query
    // Example:
    // const { data, error } = await supabase
    //   .from('financial_assessments')
    //   .select('*')
    //   .eq('id', assessmentId)
    //   .eq('user_id', userId)
    //   .single();
    
    // Placeholder data
    return {
      user_name: 'Mahasiswa ITS',
      user_email: 'mahasiswa@its.ac.id',
      overall_score: 68,
      financial_health: 'Cukup',
      created_at: new Date().toISOString(),
      strengths: [
        'Pengelolaan anggaran yang baik',
        'Tabungan yang konsisten',
        'Pemahaman dasar keuangan',
      ],
      areas_for_improvement: [
        'Perlu meningkatkan investasi',
        'Perlu mengurangi pengeluaran tidak perlu',
        'Perlu diversifikasi sumber pendapatan',
      ],
      recommendations: [
        'Mulai investasi jangka panjang',
        'Buat rencana pengeluaran bulanan',
        'Cari sumber pendapatan tambahan',
        'Pelajari tentang manajemen investasi',
      ],
      // Score breakdown
      budgeting_score: 75,
      budgeting_percentage: 75,
      saving_score: 70,
      saving_percentage: 70,
      investing_score: 60,
      investing_percentage: 60,
      debt_management_score: 65,
      debt_management_percentage: 65,
      financial_literacy_score: 70,
      financial_literacy_percentage: 70,
    };
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
      percentage: number
    ): AssessmentScore => ({
      score,
      percentage,
      dimension,
      maxScore: 100,
      level: toLevel(percentage),
      description: `${dimension} score: ${percentage}%`,
    });

    return {
      budgeting: createAssessmentScore(
        'Budgeting',
        data.budgeting_score || 0,
        data.budgeting_percentage || 0
      ),
      saving: createAssessmentScore('Saving', data.saving_score || 0, data.saving_percentage || 0),
      investing: createAssessmentScore(
        'Investing',
        data.investing_score || 0,
        data.investing_percentage || 0
      ),
      debtManagement: createAssessmentScore(
        'Debt Management',
        data.debt_management_score || 0,
        data.debt_management_percentage || 0
      ),
      financialLiteracy: createAssessmentScore(
        'Financial Literacy',
        data.financial_literacy_score || 0,
        data.financial_literacy_percentage || 0
      ),
    };
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
