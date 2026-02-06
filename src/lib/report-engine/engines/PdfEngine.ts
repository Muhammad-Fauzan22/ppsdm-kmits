
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat } from '../types';

export class PdfEngine extends BaseEngine {
    async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
        // Mock implementation for PDF generation
        return Buffer.from(`PDF Report for ${data.userName}`);
    }

    getSupportedFormats(): ReportFormat[] {
        return ['pdf'];
    }
}