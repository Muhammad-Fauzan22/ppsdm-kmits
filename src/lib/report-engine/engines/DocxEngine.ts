
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat } from '../types';

export class DocxEngine extends BaseEngine {
    async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
        // Mock implementation for DOCX generation
        return Buffer.from(`DOCX Report for ${data.userName}`);
    }

    getSupportedFormats(): ReportFormat[] {
        return ['docx'];
    }
}