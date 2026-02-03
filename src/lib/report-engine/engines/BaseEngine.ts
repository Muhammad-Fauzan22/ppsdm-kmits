
import { IReportEngine, ReportData, GenerateOptions, ValidationResult, ReportFormat } from '../types';

/**
 * Base class for all report generation engines
 * Provides common functionality and enforces interface implementation
 */
export abstract class BaseEngine implements IReportEngine {
    /**
     * Generate a report in the specified format
     */
    abstract generate(data: ReportData, options: GenerateOptions): Promise<Buffer>;

    /**
     * Validate report data before generation
     */
    validate(data: ReportData): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (!data.reportType) {
            errors.push('Report type is required');
        }
        if (!data.userId) {
            errors.push('User ID is required');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Get supported formats for this engine
     */
    abstract getSupportedFormats(): ReportFormat[];
}