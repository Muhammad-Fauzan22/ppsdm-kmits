import { IReportEngine, ReportData, GenerateOptions, ValidationResult, ReportFormat } from '../types';

/**
 * Base class for all report generation engines.
 * Provides comprehensive validation and enforces interface implementation.
 */
export abstract class BaseEngine implements IReportEngine {
  /**
   * Generate a report in the specified format.
   * Must be implemented by subclasses.
   */
  abstract generate(data: ReportData, options: GenerateOptions): Promise<Buffer>;

  /**
   * Validate report data before generation.
   * Subclasses should call super.validate() and extend with format-specific checks.
   */
  validate(data: ReportData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // ── Required fields ──────────────────────────────────────────────────────
    if (!data.reportType) {
      errors.push('Tipe laporan wajib diisi');
    }

    if (!data.userId) {
      errors.push('ID pengguna wajib diisi');
    }

    if (!data.userName || data.userName.trim().length === 0) {
      errors.push('Nama pengguna wajib diisi');
    }

    if (!data.userEmail || data.userEmail.trim().length === 0) {
      errors.push('Email pengguna wajib diisi');
    } else if (!this.isValidEmail(data.userEmail)) {
      errors.push('Format email tidak valid');
    }

    if (!data.assessmentId) {
      errors.push('ID assessment wajib diisi');
    }

    if (!data.generatedAt) {
      errors.push('Tanggal generate wajib diisi');
    }

    // ── Score validation ─────────────────────────────────────────────────────
    if (!data.scores || Object.keys(data.scores).length === 0) {
      warnings.push('Tidak ada data skor yang tersedia');
    } else {
      Object.entries(data.scores).forEach(([key, score]) => {
        if (typeof score.score !== 'number' || score.score < 0) {
          errors.push(`Skor ${key} tidak valid: nilai harus >= 0`);
        }
        if (typeof score.maxScore !== 'number' || score.maxScore <= 0) {
          errors.push(`Skor maksimum ${key} tidak valid: nilai harus > 0`);
        }
        if (score.score > score.maxScore) {
          errors.push(`Skor ${key} (${score.score}) melebihi skor maksimum (${score.maxScore})`);
        }
        if (typeof score.percentage !== 'number' || score.percentage < 0 || score.percentage > 100) {
          errors.push(`Persentase ${key} tidak valid: harus antara 0-100`);
        }
      });
    }

    // ── Overall score validation ─────────────────────────────────────────────
    if (data.overallScore !== undefined) {
      if (typeof data.overallScore !== 'number' || data.overallScore < 0 || data.overallScore > 100) {
        errors.push(`Skor keseluruhan tidak valid: harus antara 0-100, diterima: ${data.overallScore}`);
      }
    }

    // ── Optional field warnings ──────────────────────────────────────────────
    if (!data.strengths || data.strengths.length === 0) {
      warnings.push('Tidak ada data kelebihan yang tersedia');
    }

    if (!data.areasForImprovement || data.areasForImprovement.length === 0) {
      warnings.push('Tidak ada data area perbaikan yang tersedia');
    }

    if (!data.recommendations || data.recommendations.length === 0) {
      warnings.push('Tidak ada data rekomendasi yang tersedia');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get supported formats for this engine.
   * Must be implemented by subclasses.
   */
  abstract getSupportedFormats(): ReportFormat[];

  // ──────────────────────────────────────────────────────────────────────────
  // Protected helpers
  // ──────────────────────────────────────────────────────────────────────────

  protected isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
