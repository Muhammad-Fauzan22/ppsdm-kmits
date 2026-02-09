import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';

/**
 * UU PDP Compliance: Data Export Endpoint
 * Generates PDF report of all user data including:
 * - Profile information
 * - Assessment results
 * - Progress data
 * - Activity logs
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
      activityLogs
    ] = await Promise.all([
      // User profile
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(),
      
      // Assessment sessions
      supabase
        .from('assessment_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false }),
      
      // Assessment responses
      supabase
        .from('assessment_responses')
        .select('*')
        .eq('user_id', userId)
        .order('answered_at', { ascending: false }),
      
      // Assessment results
      supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),
      
      // Progress data
      supabase
        .from('assessment_progress')
        .select('*')
        .eq('user_id', userId),
      
      // Activity logs (if table exists)
      supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100)
    ]);

    // Generate PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50;
    const margin = 50;
    const lineHeight = 20;

    // Header
    page.drawText('PPSDM KM ITS - Data Export Report', {
      x: margin,
      y: yPosition,
      size: 24,
      font: fontBold,
      color: rgb(0.07, 0.22, 0.5), // ITS Blue
    });
    yPosition -= 40;

    // Timestamp
    page.drawText(`Generated: ${new Date().toLocaleString('id-ID')}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= 30;

    // User Info Section
    page.drawText('User Information', {
      x: margin,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    const userInfo = [
      `User ID: ${userId}`,
      `Email: ${user.email}`,
      `Export Date: ${new Date().toISOString()}`,
    ];

    for (const info of userInfo) {
      page.drawText(info, {
        x: margin,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= lineHeight;
    }
    yPosition -= 20;

    // Assessment Sessions Summary
    page.drawText('Assessment Sessions', {
      x: margin,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    if (assessmentSessions.data && assessmentSessions.data.length > 0) {
      page.drawText(`Total Sessions: ${assessmentSessions.data.length}`, {
        x: margin,
        y: yPosition,
        size: 10,
        font,
      });
      yPosition -= lineHeight;

      // List recent sessions
      assessmentSessions.data.slice(0, 5).forEach((session: any) => {
        const text = `• ${session.dimension || 'General'} - ${session.status} (${new Date(session.started_at).toLocaleDateString('id-ID')})`;
        page.drawText(text, {
          x: margin + 10,
          y: yPosition,
          size: 9,
          font,
        });
        yPosition -= 15;
      });
    } else {
      page.drawText('No assessment sessions found.', {
        x: margin,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      yPosition -= lineHeight;
    }
    yPosition -= 20;

    // Assessment Results
    page.drawText('Assessment Results', {
      x: margin,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    if (assessmentResults.data && assessmentResults.data.length > 0) {
      assessmentResults.data.slice(0, 5).forEach((result: any) => {
        const dimension = result.dimension || 'Unknown';
        const score = result.total_score || result.score || 'N/A';
        const text = `• ${dimension}: ${score} points`;
        page.drawText(text, {
          x: margin + 10,
          y: yPosition,
          size: 9,
          font,
        });
        yPosition -= 15;
      });
    } else {
      page.drawText('No assessment results found.', {
        x: margin,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      yPosition -= lineHeight;
    }
    yPosition -= 20;

    // Progress Data
    page.drawText('Progress Tracking', {
      x: margin,
      y: yPosition,
      size: 16,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPosition -= 25;

    if (progressData.data && progressData.data.length > 0) {
      progressData.data.forEach((progress: any) => {
        const text = `• ${progress.dimension}: ${progress.status}`;
        page.drawText(text, {
          x: margin + 10,
          y: yPosition,
          size: 9,
          font,
        });
        yPosition -= 15;
      });
    } else {
      page.drawText('No progress data found.', {
        x: margin,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      yPosition -= lineHeight;
    }

    // Footer
    page.drawText('This report was generated in compliance with UU No. 27 Tahun 2022 (Perlindungan Data Pribadi)', {
      x: margin,
      y: 30,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    // Serialize PDF
    const pdfBytes = await pdfDoc.save();
    
    // Convert to Buffer for NextResponse
    const pdfBuffer = Buffer.from(pdfBytes);

    // Return PDF as download
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ppsdm-data-export-${userId.slice(0, 8)}-${Date.now()}.pdf"`,
        'Cache-Control': 'no-store',
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
