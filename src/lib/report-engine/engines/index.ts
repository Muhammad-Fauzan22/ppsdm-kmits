/**
 * Report Engines Module
 * Exports all report generation engines
 */

export { BaseEngine } from './BaseEngine';
export { PdfEngine } from './PdfEngine';
export { DocxEngine } from './DocxEngine';
export { ExcelEngine } from './ExcelEngine';
export { HtmlEngine } from './HtmlEngine';

// Engine factory for easy instantiation
import { PdfEngine } from './PdfEngine';
import { DocxEngine } from './DocxEngine';
import { ExcelEngine } from './ExcelEngine';
import { HtmlEngine } from './HtmlEngine';
import { ReportFormat } from '../types';

export class EngineFactory {
  /**
   * Get appropriate engine for format
   */
  static getEngine(format: ReportFormat) {
    switch (format) {
      case 'pdf':
        return new PdfEngine();
      case 'docx':
        return new DocxEngine();
      case 'excel':
        return new ExcelEngine();
      case 'html':
        return new HtmlEngine();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Get all supported formats
   */
  static getSupportedFormats(): ReportFormat[] {
    return ['pdf', 'docx', 'excel', 'html'];
  }
}
