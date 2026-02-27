import ExcelJS from 'exceljs';
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat, ValidationResult } from '../types';

/**
 * Excel Report Engine
 * Generates a styled .xlsx report using ExcelJS.
 */
export class ExcelEngine extends BaseEngine {
  async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(`Report validation failed: ${validation.errors.join(', ')}`);
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PPSDM KMM ITS';
    workbook.created = new Date();

    this.buildSummarySheet(workbook, data, options);
    if (data.scores && Object.keys(data.scores).length > 0) {
      this.buildScoresSheet(workbook, data);
    }
    if (data.recommendations && data.recommendations.length > 0) {
      this.buildRecommendationsSheet(workbook, data);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  validate(data: ReportData): ValidationResult {
    const base = super.validate(data);
    const errors = [...base.errors];
    const warnings = [...base.warnings];

    if (!data.userName) errors.push('Nama pengguna wajib diisi');
    if (!data.userEmail) errors.push('Email pengguna wajib diisi');
    if (!data.assessmentId) errors.push('ID assessment wajib diisi');

    if (!data.scores || Object.keys(data.scores).length === 0) {
      warnings.push('Tidak ada data skor yang tersedia');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  getSupportedFormats(): ReportFormat[] {
    return ['excel'];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private getPrimaryColor(options: GenerateOptions): string {
    if (options.customBranding?.colors?.primary) {
      return options.customBranding.colors.primary.replace('#', '');
    }
    return options.branding === 'its' ? '0066CC' : '6366F1';
  }

  private buildSummarySheet(
    workbook: ExcelJS.Workbook,
    data: ReportData,
    options: GenerateOptions
  ): void {
    const sheet = workbook.addWorksheet('Ringkasan');
    const primaryColor = this.getPrimaryColor(options);

    // Title
    sheet.mergeCells('A1:D1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'LAPORAN ASSESSMENT HOLISTIK – PPSDM KMM ITS';
    titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${primaryColor}` } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 36;

    // Info rows
    const infoRows = [
      ['Nama', data.userName],
      ['Email', data.userEmail],
      ['ID Assessment', data.assessmentId],
      ['Tipe Laporan', data.reportType],
      ['Tanggal Generate', data.generatedAt instanceof Date
        ? data.generatedAt.toLocaleDateString('id-ID')
        : String(data.generatedAt)],
      ['Skor Keseluruhan', data.overallScore !== undefined ? `${data.overallScore}/100` : 'N/A'],
    ];

    infoRows.forEach(([label, value], i) => {
      const row = sheet.getRow(i + 3);
      const labelCell = row.getCell(1);
      const valueCell = row.getCell(2);

      labelCell.value = label;
      labelCell.font = { bold: true };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };

      valueCell.value = value;

      row.height = 22;
    });

    // Column widths
    sheet.getColumn(1).width = 22;
    sheet.getColumn(2).width = 40;
    sheet.getColumn(3).width = 20;
    sheet.getColumn(4).width = 20;
  }

  private buildScoresSheet(workbook: ExcelJS.Workbook, data: ReportData): void {
    const sheet = workbook.addWorksheet('Skor Dimensi');

    // Header row
    const headerRow = sheet.addRow(['Dimensi', 'Skor', 'Maks', 'Persentase (%)', 'Level', 'Deskripsi']);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        bottom: { style: 'medium', color: { argb: 'FF4F46E5' } },
      };
    });
    headerRow.height = 28;

    const levelColors: Record<string, string> = {
      excellent: 'FF22C55E',
      good: 'FF3B82F6',
      average: 'FFF59E0B',
      'needs-improvement': 'FFEF4444',
    };

    Object.values(data.scores!).forEach((score, i) => {
      const row = sheet.addRow([
        score.dimension,
        score.score,
        score.maxScore,
        score.percentage.toFixed(1),
        score.level,
        score.description,
      ]);

      // Alternate row background
      if (i % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
        });
      }

      // Color the level cell
      const levelCell = row.getCell(5);
      const color = levelColors[score.level] ?? 'FF6B7280';
      levelCell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      levelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
      levelCell.alignment = { horizontal: 'center' };

      row.height = 22;
    });

    // Column widths
    sheet.getColumn(1).width = 28;
    sheet.getColumn(2).width = 10;
    sheet.getColumn(3).width = 10;
    sheet.getColumn(4).width = 16;
    sheet.getColumn(5).width = 20;
    sheet.getColumn(6).width = 50;
  }

  private buildRecommendationsSheet(workbook: ExcelJS.Workbook, data: ReportData): void {
    const sheet = workbook.addWorksheet('Rekomendasi');

    sheet.addRow(['#', 'Rekomendasi']).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } };
    });

    data.recommendations!.forEach((rec, i) => {
      const row = sheet.addRow([i + 1, rec]);
      if (i % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } };
        });
      }
      row.height = 22;
    });

    sheet.getColumn(1).width = 6;
    sheet.getColumn(2).width = 80;
    sheet.getColumn(2).alignment = { wrapText: true };
  }
}
