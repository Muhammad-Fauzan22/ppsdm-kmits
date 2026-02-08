import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * UU PDP Compliance: Data Export Endpoint (Pasal 35-37)
 * Generates PDF report of all user data
 */

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore if called from server component
            }
          },
        },
      }
    );

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to export your data.' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Fetch all user data in parallel
    const [
      profileData,
      assessmentSessions,
      assessmentResponses,
      assessmentResults,
      progressData,
      gamificationData,
      journalEntries,
      goalsData,
      activitiesData
    ] = await Promise.all([
      // User profile
      supabase.from('profiles').select('*').eq('id', userId).single(),

      // Assessment sessions
      supabase.from('assessment_sessions').select('*').eq('user_id', userId),

      // Assessment responses
      supabase.from('assessment_responses').select('*').eq('user_id', userId),

      // Assessment results
      supabase.from('assessment_results').select('*').eq('user_id', userId),

      // Progress
      supabase.from('assessment_progress').select('*').eq('user_id', userId),

      // Gamification
      supabase.from('user_gamification').select('*').eq('user_id', userId).single(),

      // Journal
      supabase.from('journal_entries').select('*').eq('user_id', userId),

      // Goals
      supabase.from('user_goals').select('*').eq('user_id', userId),

      // Activities
      supabase.from('user_activities').select('*').eq('user_id', userId)
    ]);

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.276, 841.89]); // A4 size
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 20;

    // Helper function to add text
    const addText = (text: string, x: number, y: number, options: { size?: number; bold?: boolean; color?: any } = {}) => {
      const { size = 12, bold = false, color = rgb(0, 0, 0) } = options;
      page.drawText(text, {
        x,
        y,
        size,
        font: bold ? fontBold : font,
        color,
      });
    };

    // Helper function to add section
    const addSection = (title: string, data: any) => {
      if (yPosition < 100) {
        // Add new page if running out of space
        const newPage = pdfDoc.addPage([595.276, 841.89]);
        yPosition = newPage.getSize().height - 50;
      }

      addText(title, margin, yPosition, { size: 16, bold: true, color: rgb(0.1, 0.3, 0.6) });
      yPosition -= lineHeight * 1.5;

      if (data && Object.keys(data).length > 0) {
        const jsonString = JSON.stringify(data, null, 2);
        const lines = jsonString.split('\n').slice(0, 30); // Limit to 30 lines per section

        lines.forEach((line) => {
          if (yPosition < 50) {
            const newPage = pdfDoc.addPage([595.276, 841.89]);
            yPosition = newPage.getSize().height - 50;
          }

          addText(line.substring(0, 80), margin + 10, yPosition, { size: 9 });
          yPosition -= 12;
        });
      } else {
        addText('No data available', margin + 10, yPosition, { size: 10, color: rgb(0.5, 0.5, 0.5) });
        yPosition -= lineHeight;
      }

      yPosition -= lineHeight; // Space between sections
    };

    // Header
    addText('PPSDM KM ITS - Data Export Report', width / 2 - 150, yPosition, { size: 20, bold: true, color: rgb(0.1, 0.3, 0.6) });
    yPosition -= lineHeight * 2;

    // Export metadata
    addText(`Generated: ${new Date().toLocaleString('id-ID')}`, margin, yPosition);
    yPosition -= lineHeight;
    addText(`User ID: ${userId}`, margin, yPosition);
    yPosition -= lineHeight;
    addText(`Email: ${user.email}`, margin, yPosition);
    yPosition -= lineHeight * 2;

    // Legal notice
    addText('This report is generated in compliance with UU No. 27 Tahun 2022 (Perlindungan Data Pribadi)', margin, yPosition, { size: 10, color: rgb(0.4, 0.4, 0.4) });
    yPosition -= lineHeight;
    addText('Pasal 35-37: Hak Subjek Data untuk mengakses dan memperoleh data pribadi', margin, yPosition, { size: 10, color: rgb(0.4, 0.4, 0.4) });
    yPosition -= lineHeight * 2;

    // Add all data sections
    addSection('1. User Profile', profileData.data);
    addSection('2. Assessment Sessions', assessmentSessions.data);
    addSection('3. Assessment Responses', assessmentResponses.data);
    addSection('4. Assessment Results', assessmentResults.data);
    addSection('5. Progress Data', progressData.data);
    addSection('6. Gamification Data', gamificationData.data);
    addSection('7. Journal Entries', journalEntries.data);
    addSection('8. Goals', goalsData.data);
    addSection('9. Activities', activitiesData.data);

    // Footer with legal text
    const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
    lastPage.drawText('© 2024 PPSDM KM ITS - Data Export Report', {
      x: margin,
      y: 30,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Log export request for compliance
    await supabase.from('data_export_requests').insert({
      user_id: userId,
      format: 'PDF',
      status: 'completed',
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',

      user_agent: request.headers.get('user-agent'),
    });

    // Return PDF
    return new NextResponse(Buffer.from(pdfBytes) as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ppsdm-data-export-${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });


  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate data export. Please try again later.' },
      { status: 500 }
    );
  }
}
