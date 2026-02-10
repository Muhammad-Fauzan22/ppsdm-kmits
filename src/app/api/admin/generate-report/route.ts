import { NextRequest, NextResponse } from 'next/server';
import { ReportGenerator as ReportEngine } from '@/lib/report-engine/ReportGenerator';

/**
 * Generate Report API Route
 * =========================
 * Generate PDF, PPT, or Excel reports dari data spreadsheet
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, spreadsheetId, sheetName, range, columns, data } = body;

    if (!template || !data || !columns) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

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
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Report generation failed' 
      },
      { status: 500 }
    );
  }
}

async function generatePDFReport(template: any, data: any[], columns: string[]) {
  // TODO: Implement PDF generation using a library like jsPDF or puppeteer
  // For now, return a mock URL
  
  const reportEngine = new ReportEngine();
  
  // Generate HTML content for PDF
  const htmlContent = generateHTMLReport(template, data, columns);
  
  // Convert HTML to PDF
  // const pdfBuffer = await reportEngine.generatePDF(htmlContent);
  
  // Save to storage and get URL
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
  // TODO: Implement PPT generation using a library like pptxgenjs
  // For now, return a mock URL
  
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
  // TODO: Implement Excel generation using a library like xlsx or exceljs
  // For now, return a mock URL
  
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
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    .header h1 {
      color: #333;
      margin: 0;
    }
    .header p {
      color: #666;
      margin: 10px 0 0 0;
    }
    .summary {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .summary h2 {
      margin-top: 0;
      color: #333;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }
    .stat {
      background: white;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #4CAF50;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
    }
    .stat-value {
      color: #333;
      font-size: 24px;
      font-weight: bold;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #4CAF50;
      color: white;
      font-weight: bold;
    }
    tr:hover {
      background: #f5f5f5;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <p>Generated on ${date}</p>
    </div>
`;

  // Add summary section if configured
  if (template.config?.includeSummary) {
    html += `
    <div class="summary">
      <h2>Summary</h2>
      <div class="stats">
        <div class="stat">
          <div class="stat-label">Total Records</div>
          <div class="stat-value">${data.length}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Columns</div>
          <div class="stat-value">${columns.length}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Date Range</div>
          <div class="stat-value">${date}</div>
        </div>
      </div>
    </div>
`;
  }

  // Add data table
  if (template.config?.includeTables) {
    html += `
    <h2>Data</h2>
    <table>
      <thead>
        <tr>
          ${columns.map(col => `<th>${col}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            ${columns.map(col => `<td>${row[col] || ''}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
`;
  }

  html += `
    <div class="footer">
      <p>Generated by PPSDM KMITS Admin Panel</p>
    </div>
  </div>
</body>
</html>
`;

  return html;
}
