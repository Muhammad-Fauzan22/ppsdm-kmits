import { ReportData } from '../types';

/**
 * Cognitive Assessment Data Aggregator
 * Aggregates and transforms cognitive assessment data for report generation
 */
export class CognitiveAggregator {
  /**
   * Aggregate cognitive assessment data from database
   */
  static async aggregate(assessmentId: string, userId: string): Promise<ReportData> {
    // TODO: Implement actual database query
    // This is a placeholder implementation
    
    const assessmentData = await this.fetchAssessmentData(assessmentId, userId);
    
    return {
      reportType: 'cognitive',
      assessmentId,
      reportId: `cognitive-${assessmentId}`,
      userId,
      userName: assessmentData.user_name || 'Unknown User',
      userEmail: assessmentData.user_email || 'unknown@example.com',
      generatedAt: new Date(),
      overallScore: assessmentData.overall_score || 0,
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
    //   .from('cognitive_assessments')
    //   .select('*')
    //   .eq('id', assessmentId)
    //   .eq('user_id', userId)
    //   .single();
    
    // Placeholder data
    return {
      user_name: 'Mahasiswa ITS',
      user_email: 'mahasiswa@its.ac.id',
      overall_score: 75,
      created_at: new Date().toISOString(),
      strengths: [
        'Kemampuan analisis yang kuat',
        'Pemecahan masalah yang efektif',
        'Pemikiran kritis yang baik',
      ],
      areas_for_improvement: [
        'Perlu meningkatkan kreativitas',
        'Perlu mengembangkan kemampuan abstrak',
      ],
      recommendations: [
        'Ikuti workshop kreativitas',
        'Latihan pemecahan masalah kompleks',
        'Baca literatur tentang pemikiran abstrak',
      ],
      // Score breakdown
      memory_score: 80,
      memory_percentage: 80,
      attention_score: 75,
      attention_percentage: 75,
      reasoning_score: 70,
      reasoning_percentage: 70,
      processing_speed_score: 78,
      processing_speed_percentage: 78,
    };
  }

  /**
   * Process scores into standardized format
   */
  private static processScores(data: any): Record<string, any> {
    return {
      memory: {
        score: data.memory_score || 0,
        percentage: data.memory_percentage || 0,
        dimension: 'memory',
        maxScore: 100,
        level: data.memory_percentage >= 80 ? 'excellent' : 
               data.memory_percentage >= 70 ? 'good' : 
               data.memory_percentage >= 60 ? 'average' : 'needs-improvement',
        description: 'Skor kinerja memori'
      },
      attention: {
        score: data.attention_score || 0,
        percentage: data.attention_percentage || 0,
        dimension: 'attention',
        maxScore: 100,
        level: data.attention_percentage >= 80 ? 'excellent' : 
               data.attention_percentage >= 70 ? 'good' : 
               data.attention_percentage >= 60 ? 'average' : 'needs-improvement',
        description: 'Skor kinerja perhatian'
      },
      reasoning: {
        score: data.reasoning_score || 0,
        percentage: data.reasoning_percentage || 0,
        dimension: 'reasoning',
        maxScore: 100,
        level: data.reasoning_percentage >= 80 ? 'excellent' : 
               data.reasoning_percentage >= 70 ? 'good' : 
               data.reasoning_percentage >= 60 ? 'average' : 'needs-improvement',
        description: 'Skor kinerja penalaran'
      },
      processingSpeed: {
        score: data.processing_speed_score || 0,
        percentage: data.processing_speed_percentage || 0,
        dimension: 'processingSpeed',
        maxScore: 100,
        level: data.processing_speed_percentage >= 80 ? 'excellent' : 
               data.processing_speed_percentage >= 70 ? 'good' : 
               data.processing_speed_percentage >= 60 ? 'average' : 'needs-improvement',
        description: 'Skor kecepatan pemrosesan'
      },
    };
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
