import { jsPDF } from 'jspdf';
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat, ValidationResult } from '../types';

/**
 * PDF Report Engine
 * Generates a styled PDF report using jsPDF.
 * 
 * Note: For complex layouts with charts, consider using @react-pdf/renderer
 * on the client side. This engine is for server-side PDF generation.
 */
export class PdfEngine extends BaseEngine {
  async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(`Report validation failed: ${validation.errors.join(', ')}`);
    }

    const pdf = this.buildPDF(data, options);
    const arrayBuffer = pdf.output('arraybuffer');
    return Buffer.from(arrayBuffer);
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
    return ['pdf'];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
  }

  private getPrimaryColor(options: GenerateOptions): string {
    if (options.customBranding?.colors?.primary) return options.customBranding.colors.primary;
    return options.branding === 'its' ? '#0066CC' : '#6366F1';
  }

  private getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      excellent: '#22C55E',
      good: '#3B82F6',
      average: '#F59E0B',
      'needs-improvement': '#EF4444',
    };
    return colors[level] ?? '#6B7280';
  }

  private addPageHeader(pdf: jsPDF, primaryColor: string, pageNum: number): void {
    const [r, g, b] = this.hexToRgb(primaryColor);
    pdf.setFillColor(r, g, b);
    pdf.rect(0, 0, 210, 18, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.text('PPSDM KMM – Institut Teknologi Sepuluh Nopember', 10, 11);
    pdf.text(`Halaman ${pageNum}`, 200, 11, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
  }

  private addPageFooter(pdf: jsPDF): void {
    const pageHeight = pdf.internal.pageSize.height;
    pdf.setDrawColor(229, 231, 235);
    pdf.line(10, pageHeight - 14, 200, pageHeight - 14);
    pdf.setFontSize(8);
    pdf.setTextColor(156, 163, 175);
    pdf.text(
      `© ${new Date().getFullYear()} PPSDM KMM ITS. Laporan ini bersifat rahasia.`,
      105,
      pageHeight - 8,
      { align: 'center' }
    );
    pdf.setTextColor(0, 0, 0);
  }

  private buildPDF(data: ReportData, options: GenerateOptions): jsPDF {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const primaryColor = this.getPrimaryColor(options);
    const [pr, pg, pb] = this.hexToRgb(primaryColor);
    let pageNum = 1;
    let y = 25;

    const addPage = () => {
      this.addPageFooter(pdf);
      pdf.addPage();
      pageNum++;
      this.addPageHeader(pdf, primaryColor, pageNum);
      y = 28;
    };

    const checkPageBreak = (needed: number) => {
      if (y + needed > 270) addPage();
    };

    // ── Page 1 Header ──────────────────────────────────────────────────────
    this.addPageHeader(pdf, primaryColor, pageNum);

    // Title block
    pdf.setFillColor(pr, pg, pb);
    pdf.rect(10, 22, 190, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LAPORAN ASSESSMENT HOLISTIK', 105, 33, { align: 'center' });
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('PPSDM KMM – Institut Teknologi Sepuluh Nopember', 105, 42, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    y = 58;

    // ── Participant Info ───────────────────────────────────────────────────
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(pr, pg, pb);
    pdf.text('Informasi Peserta', 10, y);
    y += 6;
    pdf.setDrawColor(pr, pg, pb);
    pdf.line(10, y, 200, y);
    y += 6;

    const generatedAt =
      data.generatedAt instanceof Date
        ? data.generatedAt.toLocaleDateString('id-ID')
        : String(data.generatedAt);

    const infoItems = [
      ['Nama', data.userName],
      ['Email', data.userEmail],
      ['ID Assessment', data.assessmentId],
      ['Tipe Laporan', data.reportType],
      ['Tanggal Generate', generatedAt],
      ...(data.overallScore !== undefined ? [['Skor Keseluruhan', `${data.overallScore}/100`]] : []),
    ];

    pdf.setFontSize(10);
    infoItems.forEach(([label, value]) => {
      checkPageBreak(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(55, 65, 81);
      pdf.text(`${label}:`, 12, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 24, 39);
      pdf.text(value, 60, y);
      y += 7;
    });

    // ── Scores Table ───────────────────────────────────────────────────────
    if (data.scores && Object.keys(data.scores).length > 0) {
      y += 6;
      checkPageBreak(20);

      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(pr, pg, pb);
      pdf.text('Skor per Dimensi', 10, y);
      y += 6;
      pdf.setDrawColor(pr, pg, pb);
      pdf.line(10, y, 200, y);
      y += 6;

      // Table header
      pdf.setFillColor(pr, pg, pb);
      pdf.rect(10, y, 190, 8, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Dimensi', 12, y + 5.5);
      pdf.text('Skor', 90, y + 5.5);
      pdf.text('%', 110, y + 5.5);
      pdf.text('Level', 125, y + 5.5);
      pdf.text('Deskripsi', 155, y + 5.5);
      y += 8;

      Object.values(data.scores).forEach((score, i) => {
        checkPageBreak(9);
        const rowBg = i % 2 === 0 ? [249, 250, 251] : [255, 255, 255];
        pdf.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
        pdf.rect(10, y, 190, 8, 'F');

        pdf.setTextColor(17, 24, 39);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);

        const dimText = pdf.splitTextToSize(score.dimension, 75);
        pdf.text(dimText[0], 12, y + 5.5);
        pdf.text(`${score.score}/${score.maxScore}`, 90, y + 5.5);
        pdf.text(`${score.percentage.toFixed(1)}%`, 110, y + 5.5);

        // Level badge
        const [lr, lg, lb] = this.hexToRgb(this.getLevelColor(score.level));
        pdf.setFillColor(lr, lg, lb);
        pdf.roundedRect(123, y + 1.5, 28, 5, 1, 1, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7.5);
        pdf.text(score.level, 137, y + 5.5, { align: 'center' });

        pdf.setTextColor(107, 114, 128);
        pdf.setFontSize(8);
        const descText = pdf.splitTextToSize(score.description, 42);
        pdf.text(descText[0], 155, y + 5.5);

        y += 8;
      });
    }

    // ── Strengths ──────────────────────────────────────────────────────────
    if (data.strengths && data.strengths.length > 0) {
      y += 6;
      checkPageBreak(20);

      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(pr, pg, pb);
      pdf.text('Kelebihan', 10, y);
      y += 6;
      pdf.setDrawColor(pr, pg, pb);
      pdf.line(10, y, 200, y);
      y += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 24, 39);
      data.strengths.forEach((s, i) => {
        checkPageBreak(8);
        const lines = pdf.splitTextToSize(`${i + 1}. ${s}`, 185);
        pdf.text(lines, 12, y);
        y += lines.length * 6;
      });
    }

    // ── Recommendations ────────────────────────────────────────────────────
    if (data.recommendations && data.recommendations.length > 0) {
      y += 6;
      checkPageBreak(20);

      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(pr, pg, pb);
      pdf.text('Rekomendasi', 10, y);
      y += 6;
      pdf.setDrawColor(pr, pg, pb);
      pdf.line(10, y, 200, y);
      y += 6;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 24, 39);
      data.recommendations.forEach((r, i) => {
        checkPageBreak(8);
        const lines = pdf.splitTextToSize(`${i + 1}. ${r}`, 185);
        pdf.text(lines, 12, y);
        y += lines.length * 6;
      });
    }

    this.addPageFooter(pdf);
    return pdf;
  }
}
