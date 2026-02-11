import { ReportData, GenerateOptions, ReportFormat, ReportResponse } from './types';
import { EngineFactory } from './engines';
import { AggregatorFactory } from './data-aggregators';

/**
 * Main Report Generator
 * Orchestrates the report generation process
 */
export class ReportGenerator {
  /**
   * Generate a report
   * @param reportType - Type of report (cognitive, financial, holistic)
   * @param format - Output format (pdf, docx, excel, html)
   * @param assessmentId - ID of the assessment
   * @param userId - ID of the user
   * @param options - Generation options
   * @returns Report response with buffer and metadata
   */
  static async generate(
    reportType: string,
    format: ReportFormat,
    assessmentId: string,
    userId: string,
    options: GenerateOptions = {}
  ): Promise<ReportResponse> {
    const startTime = Date.now();

    try {
      // Step 1: Aggregate data
      const data = await AggregatorFactory.aggregate(reportType, assessmentId, userId);

      // Step 2: Get appropriate engine
      const engine = EngineFactory.getEngine(format);

      // Step 3: Generate report
      const buffer = await engine.generate(data, options);

      // Step 4: Calculate metadata
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          reportId: data.reportId,
          buffer,
          fileName: this.generateFileName(data, format),
          fileSize: buffer.length,
          mimeType: this.getMimeType(format),
          generatedAt: new Date().toISOString(),
        },
        metadata: {
          generationTime,
          reportType,
          format,
          templateVersion: '1.0.0',
          dataPoints: data.metadata?.dataPoints || 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate report preview (HTML)
   * @param reportType - Type of report
   * @param assessmentId - ID of the assessment
   * @param userId - ID of the user
   * @param options - Generation options
   * @returns HTML string
   */
  static async generatePreview(
    reportType: string,
    assessmentId: string,
    userId: string,
    options: GenerateOptions = {}
  ): Promise<string> {
    try {
      // Aggregate data
      const data = await AggregatorFactory.aggregate(reportType, assessmentId, userId);

      // Get HTML engine
      const engine = EngineFactory.getEngine('html');

      // Generate HTML
      const buffer = await engine.generate(data, options);

      // Convert to string
      return buffer.toString('utf-8');
    } catch (error) {
      throw new Error(`Failed to generate preview: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate multiple reports in different formats
   * @param reportType - Type of report
   * @param formats - Array of formats to generate
   * @param assessmentId - ID of the assessment
   * @param userId - ID of the user
   * @param options - Generation options
   * @returns Array of report responses
   */
  static async generateMultiple(
    reportType: string,
    formats: ReportFormat[],
    assessmentId: string,
    userId: string,
    options: GenerateOptions = {}
  ): Promise<ReportResponse[]> {
    const results: ReportResponse[] = [];

    for (const format of formats) {
      try {
        const result = await this.generate(reportType, format, assessmentId, userId, options);
        results.push(result);
      } catch (error) {
        // Continue with other formats even if one fails
      }
    }

    return results;
  }

  /**
   * Get supported formats
   * @returns Array of supported formats
   */
  static getSupportedFormats(): ReportFormat[] {
    return EngineFactory.getSupportedFormats();
  }

  /**
   * Get supported report types
   * @returns Array of supported report types
   */
  static getSupportedReportTypes(): string[] {
    return ['cognitive', 'financial', 'holistic'];
  }

  /**
   * Generate filename for report
   */
  private static generateFileName(data: ReportData, format: ReportFormat): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const userName = data.userName.replace(/\s+/g, '_').toLowerCase();
    const reportType = data.reportType;
    
    const extensions: Record<ReportFormat, string> = {
      pdf: 'pdf',
      docx: 'docx',
      excel: 'xlsx',
      html: 'html',
    };

    return `laporan_${reportType}_${userName}_${timestamp}.${extensions[format]}`;
  }

  /**
   * Get MIME type for format
   */
  private static getMimeType(format: ReportFormat): string {
    const mimeTypes: Record<ReportFormat, string> = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      html: 'text/html',
    };

    return mimeTypes[format];
  }
}
