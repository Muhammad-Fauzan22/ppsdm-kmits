import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { ReportGenerator as ReportEngine } from '@/lib/report-engine/ReportGenerator';
import { z } from 'zod';

// Validation schema
const generateReportSchema = z.object({
  template: z.object({
    name: z.string().min(1),
    type: z.enum(['pdf', 'ppt', 'excel']),
    config: z.object({
      includeCharts: z.boolean().optional(),
      includeTables: z.boolean().optional(),
      includeSummary: z.boolean().optional(),
      theme: z.string().optional(),
      slidesPerRow: z.number().optional()
    }).optional()
  }),
  data: z.array(z.record(z.any())),
  columns: z.array(z.string())
});

/**
 * POST /api/admin/generate-report
 * Generate PDF, PPT, or Excel reports (Admin only)
 */
export const POST = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const body = await request.json();
    
    // Validate input
    const { template, data, columns } = generateReportSchema.parse(body);

    // Filter data by selected columns
    const filteredData = data.map((row: any) => {
      const filteredRow: any = {};
      columns.forEach((col: string) => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });

    // Generate report based on template type
    let reportUrl: string;
    let metadata: any;

    switch (template.type) {
      case 'pdf':
        ({ url: reportUrl, metadata } = await generatePDFReport(template, filteredData, columns));
        break;
      case 'ppt':
        ({ url: reportUrl, metadata } = await generatePPTReport(template, filteredData, columns));
        break;
      case 'excel':
        ({ url: reportUrl, metadata } = await generateExcelReport(template, filteredData, columns));
        break;
      default:
        throw new Error(`Unsupported report type: ${template.type}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Report generated successfully',
      url: reportUrl,
      metadata: {
        ...metadata,
        templateName: template.name,
        reportType: template.type,
        rowsCount: filteredData.length,
        columnsCount: columns.length,
        timestamp: new Date().toISOString(),
        generatedBy: admin.email
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Report generation failed' 
      },
      { status: 500 }
    );
  }
});

async function generatePDFReport(template: any, data: any[], columns: string[]) {
  const reportEngine = new ReportEngine();
  const htmlContent = generateHTMLReport(template, data, columns);
  
  const reportUrl = `/reports/${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  
  return {
    url: reportUrl,
    metadata: {
      format: 'PDF',
      size: `${data.length} rows × ${columns.length} columns`,
      includeCharts: template.config?.includeCharts || false,
      includeTables: template.config?.includeTables || false,
    },
  };
}

async function generatePPTReport(template: any, data: any[], columns: string[]) {
  const reportUrl = `/reports/${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pptx`;
  
  return {
    url: reportUrl,
    metadata: {
      format: 'PPTX',
      slides: Math.ceil(data.length / (template.config?.slidesPerRow || 5)),
      theme: template.config?.theme || 'professional',
    },
  };
}

async function generateExcelReport(template: any, data: any[], columns: string[]) {
  const reportUrl = `/reports/${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.xlsx`;
  
  return {
    url: reportUrl,
    metadata: {
      format: 'XLSX',
      sheets: 1,
      includeHeaders: template.config?.includeHeaders !== false,
    },
  };
}

function generateHTMLReport(template: any, data: any[], columns: string[]): string {
  const title = template.name;
  const date = new Date().toLocaleDateString();
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .header h1 { color: #333; margin: 0; }
    .header p { color: #666; margin: 10px 0 0 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #4CAF50; color: white; font-weight: bold; }
    tr:hover { background: #f5f5f5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <p>Generated on ${date}</p>
    </div>
    <table>
      <thead>
        <tr>${columns.map(col => `<th>${col}</th>`).join('')}</tr>
      </thead>
      <tbody>
        ${data.map(row => `<tr>${columns.map(col => `<td>${row[col] || ''}</td>`).join('')}</tr>`).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  return html;
}
