
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat } from '../types';

export class HtmlEngine extends BaseEngine {
  async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
    // Mock implementation for HTML generation
    return Buffer.from(`<html><body><h1>HTML Report for ${data.userName}</h1></body></html>`);
  }

  getSupportedFormats(): ReportFormat[] {
    return ['html'];
  }
}
