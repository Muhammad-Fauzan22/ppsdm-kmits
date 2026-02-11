import { NextResponse } from 'next/server';
import { ReportGenerator } from '@/lib/report-engine';

/**
 * GET /api/reports/templates
 * Get available report templates
 */
export async function GET() {
  try {
    const supportedTypes = ReportGenerator.getSupportedReportTypes();
    const supportedFormats = ReportGenerator.getSupportedFormats();

    const templates = supportedTypes.map((type) => ({
      id: type,
      name: getTemplateName(type),
      description: getTemplateDescription(type),
      supportedFormats,
      icon: getTemplateIcon(type),
    }));

    return NextResponse.json({
      success: true,
      data: {
        templates,
        supportedFormats,
        supportedReportTypes: supportedTypes,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}

/**
 * Get template name
 */
function getTemplateName(type: string): string {
  const names: Record<string, string> = {
    cognitive: 'Laporan Penilaian Kognitif',
    financial: 'Laporan Penilaian Keuangan',
    holistic: 'Laporan Pengembangan Holistik',
  };
  return names[type] || type;
}

/**
 * Get template description
 */
function getTemplateDescription(type: string): string {
  const descriptions: Record<string, string> = {
    cognitive: 'Laporan komprehensif penilaian kemampuan kognitif meliputi memori, perhatian, penalaran, dan kecepatan pemrosesan.',
    financial: 'Laporan analisis kesehatan keuangan meliputi penganggaran, tabungan, investasi, manajemen utang, dan literasi keuangan.',
    holistic: 'Laporan pengembangan holistik yang mencakup semua dimensi pengembangan diri: kognitif, emosional, sosial, fisik, spiritual, karakter, keuangan, dan manajemen diri.',
  };
  return descriptions[type] || '';
}

/**
 * Get template icon
 */
function getTemplateIcon(type: string): string {
  const icons: Record<string, string> = {
    cognitive: '🧠',
    financial: '💰',
    holistic: '🌟',
  };
  return icons[type] || '📄';
}
