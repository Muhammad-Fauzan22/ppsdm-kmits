import { BaseEngine } from './BaseEngine';
import { ReportData, GenerateOptions, ReportFormat, ValidationResult } from '../types';

/**
 * HTML Report Engine
 * Generates a fully-styled HTML report from assessment data.
 */
export class HtmlEngine extends BaseEngine {
  async generate(data: ReportData, options: GenerateOptions): Promise<Buffer> {
    const validation = this.validate(data);
    if (!validation.isValid) {
      throw new Error(`Report validation failed: ${validation.errors.join(', ')}`);
    }

    const html = this.buildHTML(data, options);
    return Buffer.from(html, 'utf-8');
  }

  validate(data: ReportData): ValidationResult {
    const base = super.validate(data);
    const errors = [...base.errors];
    const warnings = [...base.warnings];

    if (!data.userName) errors.push('Nama pengguna wajib diisi');
    if (!data.userEmail) errors.push('Email pengguna wajib diisi');
    if (!data.assessmentId) errors.push('ID assessment wajib diisi');
    if (!data.generatedAt) errors.push('Tanggal generate wajib diisi');

    if (data.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail)) {
      errors.push('Format email tidak valid');
    }

    if (!data.scores || Object.keys(data.scores).length === 0) {
      warnings.push('Tidak ada data skor yang tersedia');
    }

    if (!data.strengths || data.strengths.length === 0) {
      warnings.push('Tidak ada data kelebihan yang tersedia');
    }

    if (!data.recommendations || data.recommendations.length === 0) {
      warnings.push('Tidak ada data rekomendasi yang tersedia');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  getSupportedFormats(): ReportFormat[] {
    return ['html'];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private getBranding(branding?: string, custom?: GenerateOptions['customBranding']) {
    if (custom) return custom;
    const map: Record<string, { colors: { primary: string; secondary: string } }> = {
      its: { colors: { primary: '#0066cc', secondary: '#ffcc00' } },
      kmm: { colors: { primary: '#6366f1', secondary: '#8b5cf6' } },
    };
    return map[branding ?? 'kmm'] ?? map['kmm'];
  }

  private getLevelColor(level: string): string {
    const colors: Record<string, string> = {
      excellent: '#22c55e',
      good: '#3b82f6',
      average: '#f59e0b',
      'needs-improvement': '#ef4444',
    };
    return colors[level] ?? '#6b7280';
  }

  private buildScoresTable(data: ReportData): string {
    if (!data.scores || Object.keys(data.scores).length === 0) return '';

    const rows = Object.entries(data.scores)
      .map(([, score]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${score.dimension}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${score.score}/${score.maxScore}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${score.percentage.toFixed(1)}%</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
            <span style="background:${this.getLevelColor(score.level)};color:#fff;padding:2px 10px;border-radius:9999px;font-size:12px;">
              ${score.level}
            </span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">${score.description}</td>
        </tr>`)
      .join('');

    return `
      <div class="section">
        <h2>Skor per Dimensi</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f9fafb;">
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Dimensi</th>
              <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Skor</th>
              <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Persentase</th>
              <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #e5e7eb;">Level</th>
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #e5e7eb;">Deskripsi</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  private buildList(title: string, items?: string[]): string {
    if (!items || items.length === 0) return '';
    const lis = items.map(i => `<li style="margin-bottom:6px;">${i}</li>`).join('');
    return `
      <div class="section">
        <h2>${title}</h2>
        <ul style="padding-left:20px;line-height:1.7;">${lis}</ul>
      </div>`;
  }

  private buildHTML(data: ReportData, options: GenerateOptions): string {
    const brand = this.getBranding(options.branding, options.customBranding);
    const primary = brand.colors.primary;
    const secondary = brand.colors.secondary;
    const generatedAt = data.generatedAt instanceof Date
      ? data.generatedAt.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
      : String(data.generatedAt);

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Laporan Assessment – ${data.userName}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; color: #111827; }
    .wrapper { max-width: 900px; margin: 0 auto; background: #fff; }
    .header { background: ${primary}; color: #fff; padding: 32px 40px; }
    .header h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
    .header p { font-size: 14px; opacity: 0.85; }
    .badge { display: inline-block; background: ${secondary}; color: #111; padding: 4px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-top: 10px; }
    .content { padding: 32px 40px; }
    .section { margin-bottom: 32px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; }
    .section h2 { font-size: 18px; font-weight: 700; color: ${primary}; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${secondary}; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .info-item label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    .info-item p { font-size: 15px; font-weight: 600; color: #111827; margin-top: 2px; }
    .overall-score { text-align: center; padding: 24px; background: linear-gradient(135deg, ${primary}15, ${secondary}15); border-radius: 12px; margin-bottom: 32px; }
    .overall-score .score-number { font-size: 72px; font-weight: 800; color: ${primary}; line-height: 1; }
    .overall-score .score-label { font-size: 14px; color: #6b7280; margin-top: 4px; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    @media print { body { background: #fff; } .wrapper { max-width: 100%; } }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <h1>Laporan Assessment Holistik</h1>
      <p>PPSDM KMM – Institut Teknologi Sepuluh Nopember</p>
      <span class="badge">${data.reportType.toUpperCase()}</span>
    </div>

    <div class="content">
      <!-- Participant Info -->
      <div class="section">
        <h2>Informasi Peserta</h2>
        <div class="info-grid">
          <div class="info-item"><label>Nama</label><p>${data.userName}</p></div>
          <div class="info-item"><label>Email</label><p>${data.userEmail}</p></div>
          <div class="info-item"><label>ID Assessment</label><p>${data.assessmentId}</p></div>
          <div class="info-item"><label>Tanggal Generate</label><p>${generatedAt}</p></div>
        </div>
      </div>

      <!-- Overall Score -->
      ${data.overallScore !== undefined ? `
      <div class="overall-score">
        <div class="score-number">${data.overallScore}</div>
        <div class="score-label">Skor Keseluruhan (dari 100)</div>
      </div>` : ''}

      <!-- Scores Table -->
      ${this.buildScoresTable(data)}

      <!-- Strengths -->
      ${this.buildList('Kelebihan', data.strengths)}

      <!-- Areas for Improvement -->
      ${this.buildList('Area yang Perlu Diperbaiki', data.areasForImprovement)}

      <!-- Recommendations -->
      ${this.buildList('Rekomendasi', data.recommendations)}
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} PPSDM KMM – Institut Teknologi Sepuluh Nopember. Laporan ini bersifat rahasia.</p>
      <p style="margin-top:4px;">Digenerate pada: ${generatedAt}</p>
    </div>
  </div>
</body>
</html>`;
  }
}
