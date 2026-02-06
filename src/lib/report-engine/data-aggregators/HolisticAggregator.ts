import { ReportData, AssessmentScore } from '../types';

/**
 * Holistic Assessment Data Aggregator
 * Aggregates and transforms holistic assessment data for report generation
 */
export class HolisticAggregator {
  /**
   * Aggregate holistic assessment data from database
   */
  static async aggregate(assessmentId: string, userId: string): Promise<ReportData> {
    const assessmentData = await this.fetchAssessmentData(assessmentId, userId);

    return {
      reportType: 'holistic',
      assessmentId,
      reportId: `holistic-${assessmentId}`,
      userId,
      userName: assessmentData.user_name || 'Unknown User',
      userEmail: assessmentData.user_email || 'unknown@example.com',
      generatedAt: new Date(),
      overallScore: assessmentData.overall_score || 0,
      holisticHealth: assessmentData.holistic_health || 'Unknown',
      scores: this.processScores(assessmentData),
      strengths: assessmentData.strengths || [],
      areasForImprovement: assessmentData.areas_for_improvement || [],
      recommendations: assessmentData.recommendations || [],
      metadata: {
        assessmentId,
        assessmentDate: new Date(assessmentData.created_at),
        dataPoints: this.countDataPoints(assessmentData),
      },
    };
  }

  /**
   * Create score object
   */
  private static createScore(
    score: number,
    percentage: number,
    dimension: string,
    description: string
  ): AssessmentScore {
    return {
      score: score || 0,
      maxScore: 100,
      percentage: percentage || 0,
      dimension,
      description,
      level: this.getLevelLabel(percentage || 0),
    };
  }

  /**
   * Get level label based on percentage
   */
  private static getLevelLabel(percentage: number): 'excellent' | 'good' | 'average' | 'needs-improvement' {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'average';
    return 'needs-improvement';
  }

  /**
   * Process scores from assessment data
   */
  private static processScores(data: any): Record<string, AssessmentScore> {
    return {
      cognitive: this.createScore(
        data.cognitive_score,
        data.cognitive_percentage,
        'cognitive',
        'Skor kognitif dan intelektual'
      ),
      emotional: this.createScore(
        data.emotional_score,
        data.emotional_percentage,
        'emotional',
        'Skor kecerdasan emosional'
      ),
      social: this.createScore(
        data.social_score,
        data.social_percentage,
        'social',
        'Skor keterampilan sosial'
      ),
      physical: this.createScore(
        data.physical_score,
        data.physical_percentage,
        'physical',
        'Skor kesehatan fisik'
      ),
      spiritual: this.createScore(
        data.spiritual_score,
        data.spiritual_percentage,
        'spiritual',
        'Skor spiritual'
      ),
      character: this.createScore(
        data.character_score,
        data.character_percentage,
        'character',
        'Skor karakter'
      ),
      financial: this.createScore(
        data.financial_score,
        data.financial_percentage,
        'financial',
        'Skor literasi finansial'
      ),
      selfManagement: this.createScore(
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
  private static async fetchAssessmentData(assessmentId: string, userId: string): Promise<any> {
    // TODO: Implement actual Supabase query
    // Placeholder data
    return {
      user_name: 'Mahasiswa ITS',
      user_email: 'mahasiswa@its.ac.id',
      overall_score: 72,
      holistic_health: 'Baik',
      created_at: new Date().toISOString(),
      strengths: [
        'Keseimbangan yang baik antara dimensi pengembangan',
        'Komitmen tinggi terhadap pengembangan diri',
        'Kemampuan adaptasi yang kuat',
      ],
      areas_for_improvement: [
        'Perlu meningkatkan kesehatan fisik',
        'Perlu mengembangkan keterampilan sosial',
        'Perlu meningkatkan kesejahteraan mental',
      ],
      recommendations: [
        'Ikuti program kebugaran fisik',
        'Bergabung dengan komunitas sosial',
        'Praktikkan mindfulness dan meditasi',
      ],
      cognitive_score: 75,
      cognitive_percentage: 75,
      emotional_score: 68,
      emotional_percentage: 68,
      social_score: 70,
      social_percentage: 70,
      physical_score: 65,
      physical_percentage: 65,
      spiritual_score: 72,
      spiritual_percentage: 72,
      character_score: 78,
      character_percentage: 78,
      financial_score: 70,
      financial_percentage: 70,
      self_management_score: 74,
      self_management_percentage: 74,
    };
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
