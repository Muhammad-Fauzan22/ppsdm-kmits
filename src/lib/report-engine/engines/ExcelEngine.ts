
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat } from '../types';

export class ExcelEngine extends BaseEngine {
    async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
        // Mock implementation for Excel generation
        return Buffer.from(`Excel Report for ${data.userName}`);
    }

    getSupportedFormats(): ReportFormat[] {
        return ['excel'];
    }
}