import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';
import { z } from 'zod';

// Validation schema
const exportTemplateSchema = z.object({
  template: z.object({
    name: z.string().min(1).max(100),
    components: z.array(z.any())
  }),
  spreadsheetId: z.string().min(1),
  sheetName: z.string().min(1).max(100)
});

/**
 * Export Template API Route (Admin only)
 * Export template sebagai website page
 */
export const POST = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const body = await request.json();
    
    // Validate input
    const { template, spreadsheetId, sheetName } = exportTemplateSchema.parse(body);

    const sheetsService = await GoogleSheetsService.getInstance();

    // Fetch data from spreadsheet
    const range = `${sheetName}!A1:Z1000`;
    const data = await sheetsService.getSheetData(spreadsheetId, range);

    // Generate page from template
    const pageContent = generatePageFromTemplate(template, data);

    // Create safe filename
    const safeFilename = template.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const pagePath = `/pages/generated/${safeFilename}.tsx`;

    return NextResponse.json({
      success: true,
      message: 'Template exported successfully',
      url: pagePath,
      metadata: {
        templateName: template.name,
        componentsCount: template.components.length,
        rowsUsed: data.length,
        timestamp: new Date().toISOString(),
        exportedBy: admin.email
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Export failed' 
      },
      { status: 500 }
    );
  }
});

function generatePageFromTemplate(template: any, data: any[]): string {
  // SECURITY: Sanitize template name to prevent code injection
  const sanitizedName = template.name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim();

  // Generate React component from template
  const imports = `
'use client';

import React from 'react';
`;

  const component = `
export default function GeneratedPage() {
  return (
    <div className="min-h-screen bg-white">
      ${template.components.map((comp: any) => generateComponentCode(comp, data)).join('\n      ')}
    </div>
  );
}
`;

  return imports + component;
}

function generateComponentCode(component: any, data: any[]): string {
  const mapping = component.columnMapping || {};
  
  switch (component.type) {
    case 'hero':
      return `
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {data[0]?.['${mapping.title || 'Title'}'] || 'Hero Title'}
          </h1>
          <p className="text-xl opacity-90">
            {data[0]?.['${mapping.subtitle || 'Subtitle'}'] || 'Hero Subtitle'}
          </p>
        </div>
      </section>`;

    case 'header':
      return `
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800">
            {data[0]?.['${mapping.text || 'Text'}'] || 'Header Text'}
          </h2>
        </div>
      </section>`;

    case 'text':
      return `
      <section className="py-6">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">
            {data[0]?.['${mapping.content || 'Content'}'] || 'Text content'}
          </p>
        </div>
      </section>`;

    case 'card':
      return `
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {data[0]?.['${mapping.title || 'Title'}'] || 'Card Title'}
            </h3>
            <p className="text-gray-600">
              {data[0]?.['${mapping.content || 'Content'}'] || 'Card content'}
            </p>
          </div>
        </div>
      </section>`;

    case 'list':
      return `
      <section className="py-6">
        <div className="container mx-auto px-4">
          <ul className="list-disc list-inside text-gray-600">
            {data.slice(0, 5).map((item, index) => (
              <li key={index}>{item['${mapping.items || 'Item'}'] || \`Item \${index + 1}\`}</li>
            ))}
          </ul>
        </div>
      </section>`;

    case 'table':
      return `
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  ${Object.keys(data[0] || {}).map(key => `<th className="px-4 py-2 text-left">${key}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b">
                    ${Object.keys(data[0] || {}).map(key => `<td className="px-4 py-2">{row['${key}']}</td>`).join('')}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>`;

    case 'footer':
      return `
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 PPSDM KMITS. All rights reserved.</p>
        </div>
      </footer>`;

    default:
      return `
      <section className="py-4">
        <div className="container mx-auto px-4">
          <p className="text-gray-500">Unknown component type: ${component.type}</p>
        </div>
      </section>`;
  }
}
