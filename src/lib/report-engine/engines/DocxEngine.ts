import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
  convertInchesToTwip,
} from 'docx';
import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat, ValidationResult } from '../types';

/**
 * DOCX Report Engine
 * Generates a styled .docx report using the docx library.
 */
export class DocxEngine extends BaseEngine {
  async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(`Report validation failed: ${validation.errors.join(', ')}`);
    }

    const doc = this.buildDocument(data, options);
    const buffer = await Packer.toBuffer(doc);
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
    return ['docx'];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private heading(text: string, level: (typeof HeadingLevel)[keyof typeof HeadingLevel]) {
    return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
  }

  private para(text: string, bold = false) {
    return new Paragraph({
      children: [new TextRun({ text, bold, size: 22 })],
      spacing: { after: 80 },
    });
  }

  private labelValue(label: string, value: string) {
    return new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 22 }),
        new TextRun({ text: value, size: 22 }),
      ],
      spacing: { after: 80 },
    });
  }

  private buildScoresTable(data: ReportData): Table {
    const headerCells = ['Dimensi', 'Skor', 'Maks', '%', 'Level', 'Deskripsi'].map(
      text =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20 })] })],
          shading: { type: ShadingType.SOLID, color: '6366F1' },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
        })
    );

    const dataRows = Object.values(data.scores!).map((score, i) => {
      const bg = i % 2 === 0 ? 'F9FAFB' : 'FFFFFF';
      const cells = [
        score.dimension,
        String(score.score),
        String(score.maxScore),
        `${score.percentage.toFixed(1)}%`,
        score.level,
        score.description,
      ].map(
        text =>
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text, size: 20 })] })],
            shading: { type: ShadingType.SOLID, color: bg },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
          })
      );
      return new TableRow({ children: cells });
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: headerCells }), ...dataRows],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        insideH: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
        insideV: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
      },
    });
  }

  private buildDocument(data: ReportData, _options: GenerateOptions): Document {
    const generatedAt =
      data.generatedAt instanceof Date
        ? data.generatedAt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
        : String(data.generatedAt);

    const sections: (Paragraph | Table)[] = [
      // Title
      new Paragraph({
        children: [new TextRun({ text: 'LAPORAN ASSESSMENT HOLISTIK', bold: true, size: 36, color: '6366F1' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'PPSDM KMM – Institut Teknologi Sepuluh Nopember', size: 22, color: '6B7280' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
      }),

      // Participant Info
      this.heading('Informasi Peserta', HeadingLevel.HEADING_1),
      this.labelValue('Nama', data.userName),
      this.labelValue('Email', data.userEmail),
      this.labelValue('ID Assessment', data.assessmentId),
      this.labelValue('Tipe Laporan', data.reportType),
      this.labelValue('Tanggal Generate', generatedAt),
      ...(data.overallScore !== undefined
        ? [this.labelValue('Skor Keseluruhan', `${data.overallScore}/100`)]
        : []),
    ];

    // Scores table
    if (data.scores && Object.keys(data.scores).length > 0) {
      sections.push(
        this.heading('Skor per Dimensi', HeadingLevel.HEADING_1),
        this.buildScoresTable(data)
      );
    }

    // Strengths
    if (data.strengths && data.strengths.length > 0) {
      sections.push(this.heading('Kelebihan', HeadingLevel.HEADING_1));
      data.strengths.forEach((s, i) => sections.push(this.para(`${i + 1}. ${s}`)));
    }

    // Areas for improvement
    if (data.areasForImprovement && data.areasForImprovement.length > 0) {
      sections.push(this.heading('Area yang Perlu Diperbaiki', HeadingLevel.HEADING_1));
      data.areasForImprovement.forEach((a, i) => sections.push(this.para(`${i + 1}. ${a}`)));
    }

    // Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      sections.push(this.heading('Rekomendasi', HeadingLevel.HEADING_1));
      data.recommendations.forEach((r, i) => sections.push(this.para(`${i + 1}. ${r}`)));
    }

    // Footer note
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `© ${new Date().getFullYear()} PPSDM KMM ITS. Laporan ini bersifat rahasia.`,
            size: 18,
            color: '9CA3AF',
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 480 },
      })
    );

    return new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          children: sections,
        },
      ],
    });
  }
}
