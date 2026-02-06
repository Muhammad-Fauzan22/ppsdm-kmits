/**
 * Data Aggregators Module
 * Exports all data aggregators for report generation
 */

export { CognitiveAggregator } from './CognitiveAggregator';
export { FinancialAggregator } from './FinancialAggregator';
export { HolisticAggregator } from './HolisticAggregator';

// Aggregator factory for easy instantiation
import { CognitiveAggregator } from './CognitiveAggregator';
import { FinancialAggregator } from './FinancialAggregator';
import { HolisticAggregator } from './HolisticAggregator';
import { ReportData } from '../types';

export class AggregatorFactory {
  /**
   * Get appropriate aggregator for report type
   */
  static getAggregator(reportType: string) {
    switch (reportType) {
      case 'cognitive':
        return CognitiveAggregator;
      case 'financial':
        return FinancialAggregator;
      case 'holistic':
        return HolisticAggregator;
      default:
        throw new Error(`Unsupported report type: ${reportType}`);
    }
  }

  /**
   * Aggregate data for report
   */
  static async aggregate(reportType: string, assessmentId: string, userId: string): Promise<ReportData> {
    const aggregator = this.getAggregator(reportType);
    return await aggregator.aggregate(assessmentId, userId);
  }
}
