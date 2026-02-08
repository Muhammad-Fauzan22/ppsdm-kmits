import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * UU PDP Compliance: Data Export Endpoint
 * Allows users to download all their personal data as PDF
 * Reference: UU No. 27 Tahun 2022, Pasal 35-37
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

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to export your data.' },
        { status: 401 }
      );
    }

    const userId = user.id;
    const exportTimestamp = new Date().toISOString();
    const reportId = `EXP-${Date.now()}`;

    // Fetch all user data from various tables
    const [
      profileData,
      assessmentSessions,
      assessmentResponses,
      assessmentResults,
      progressData,
      gamificationData,
      journalEntries,
      goalsData
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

      // Progress tracking
      supabase
        .from('assessment_progress')
        .select('*')
        .eq('user_id', userId),

      // Gamification data
      supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single(),

      // Journal entries
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }),

      // Goals
      supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    ]);

    // Generate PDF Report
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.276, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let yPosition = height - 50;
    const lineHeight = 20;
    const margin = 50;

    // Header
    page.drawText('PPSDM KM ITS - DATA EXPORT REPORT', {
      x: margin,
      y: yPosition,
      size: 18,
      font: fontBold,
      color: rgb(0.004, 0.22, 0.5), // ITS Blue
    });
    yPosition -= lineHeight * 2;

    // Report metadata
    page.drawText(`Report ID: ${reportId}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= lineHeight;

    page.drawText(`Generated: ${new Date(exportTimestamp).toLocaleString('id-ID')}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= lineHeight;

    page.drawText(`User ID: ${userId}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= lineHeight * 2;

    // Legal Notice
    page.drawText('LEGAL NOTICE:', {
      x: margin,
      y: yPosition,
      size: 11,
      font: fontBold,
      color: rgb(0.8, 0, 0),
    });
    yPosition -= lineHeight;

    page.drawText('This report contains personal data as defined under UU No. 27 Tahun 2022', {
      x: margin,
      y: yPosition,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= lineHeight;

    page.drawText('on Personal Data Protection (Perlindungan Data Pribadi).', {
      x: margin,
      y: yPosition,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPosition -= lineHeight * 2;

    // User Profile Section
    if (profileData.data) {
      page.drawText('1. USER PROFILE', {
        x: margin,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight * 1.5;

      const profile = profileData.data;
      const profileFields = [
        `Full Name: ${profile.full_name || 'N/A'}`,
        `Email: ${user.email || 'N/A'}`,
        `NRP: ${profile.nrp || 'N/A'}`,
        `Department: ${profile.department || 'N/A'}`,
        `Faculty: ${profile.faculty || 'N/A'}`,
        `Study Program: ${profile.study_program || 'N/A'}`,
        `Entry Year: ${profile.entry_year || 'N/A'}`,
        `Phone: ${profile.phone || 'N/A'}`,
        `Date of Birth: ${profile.date_of_birth || 'N/A'}`,
        `Account Created: ${new Date(user.created_at).toLocaleString('id-ID')}`,
        `Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('id-ID') : 'N/A'}`,
      ];

      for (const field of profileFields) {
        if (yPosition < 100) {
          // Add new page if running out of space
          const newPage = pdfDoc.addPage([595.276, 841.89]);
          yPosition = newPage.getSize().height - 50;
        }
        
        page.drawText(field, {
          x: margin + 10,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= lineHeight;
      }
      yPosition -= lineHeight;
    }

    // Assessment Summary
    const sessionCount = assessmentSessions.data?.length || 0;
    const responseCount = assessmentResponses.data?.length || 0;
    const resultsCount = assessmentResults.data?.length || 0;

    if (yPosition < 150) {
      const newPage = pdfDoc.addPage([595.276, 841.89]);
      yPosition = newPage.getSize().height - 50;
    }

    page.drawText('2. ASSESSMENT SUMMARY', {
      x: margin,
      y: yPosition,
      size: 14,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight * 1.5;

    const assessmentSummary = [
      `Total Assessment Sessions: ${sessionCount}`,
      `Total Responses Recorded: ${responseCount}`,
      `Completed Assessments: ${resultsCount}`,
    ];

    for (const item of assessmentSummary) {
      page.drawText(item, {
        x: margin + 10,
        y: yPosition,
        size: 10,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPosition -= lineHeight;
    }
    yPosition -= lineHeight;

    // Detailed Assessment Results
    if (assessmentResults.data && assessmentResults.data.length > 0) {
      if (yPosition < 200) {
        const newPage = pdfDoc.addPage([595.276, 841.89]);
        yPosition = newPage.getSize().height - 50;
      }

      page.drawText('3. ASSESSMENT RESULTS', {
        x: margin,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight * 1.5;

      for (const result of assessmentResults.data.slice(0, 20)) { // Limit to 20 results
        if (yPosition < 100) {
          const newPage = pdfDoc.addPage([595.276, 841.89]);
          yPosition = newPage.getSize().height - 50;
        }

        const resultText = `${result.dimension?.toUpperCase() || 'Unknown'} - Score: ${result.score || 'N/A'}/100`;
        page.drawText(resultText, {
          x: margin + 10,
          y: yPosition,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1),
        });
        yPosition -= lineHeight;

        const dateText = `  Completed: ${result.created_at ? new Date(result.created_at).toLocaleString('id-ID') : 'N/A'}`;
        page.drawText(dateText, {
          x: margin + 10,
          y: yPosition,
          size: 9,
          font,
          color: rgb(0.4, 0.4, 0.4),
        });
        yPosition -= lineHeight;

        if (result.interpretation) {
          const interpretationText = `  Interpretation: ${result.interpretation.substring(0, 80)}${result.interpretation.length > 80 ? '...' : ''}`;
          page.drawText(interpretationText, {
            x: margin + 10,
            y: yPosition,
            size: 9,
            font,
            color: rgb(0.3, 0.3, 0.3),
          });
          yPosition -= lineHeight;
        }
        yPosition -= lineHeight / 2;
      }
    }

    // Progress Data
    if (progressData.data && progressData.data.length > 0) {
      if (yPosition < 150) {
        const newPage = pdfDoc.addPage([595.276, 841.89]);
        yPosition = newPage.getSize().height - 50;
      }

      page.drawText('4. PROGRESS TRACKING', {
        x: margin,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight * 1.5;

      for (const progress of progressData.data) {
        if (yPosition < 100) {
          const newPage = pdfDoc.addPage([595.276, 841.89]);
          yPosition = newPage.getSize().height - 50;
        }

        const progressText = `${progress.dimension?.toUpperCase() || 'Unknown'} - Status: ${progress.status || 'N/A'}`;
        page.drawText(progressText, {
          x: margin + 10,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= lineHeight;
      }
      yPosition -= lineHeight;
    }

    // Gamification Data
    if (gamificationData.data) {
      if (yPosition < 150) {
        const newPage = pdfDoc.addPage([595.276, 841.89]);
        yPosition = newPage.getSize().height - 50;
      }

      page.drawText('5. GAMIFICATION STATUS', {
        x: margin,
        y: yPosition,
        size: 14,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight * 1.5;

      const gamification = gamificationData.data;
      const gamificationFields = [
        `Current Level: ${gamification.current_level || 1}`,
        `Total XP: ${gamification.total_xp || 0}`,
        `Achievements Unlocked: ${gamification.achievements?.length || 0}`,
        `Current Streak: ${gamification.current_streak || 0} days`,
      ];

      for (const field of gamificationFields) {
        page.drawText(field, {
          x: margin + 10,
          y: yPosition,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= lineHeight;
      }
      yPosition -= lineHeight;
    }

    // Footer with legal text
    const pages = pdfDoc.getPages();
    for (const pdfPage of pages) {
      const { height: pageHeight } = pdfPage.getSize();
      pdfPage.drawText('© 2024 PPSDM KM ITS - Data Export under UU No. 27/2022', {
        x: margin,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      pdfPage.drawText(`Page ${pages.indexOf(pdfPage) + 1} of ${pages.length}`, {
        x: width - margin - 50,
        y: 30,
        size: 8,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Log export for compliance audit
    await supabase.from('data_export_logs').insert({
      user_id: userId,
      report_id: reportId,
      exported_at: exportTimestamp,
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      data_categories: ['profile', 'assessments', 'progress', 'gamification', 'journal', 'goals']
    });

    // Return PDF as downloadable file
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ppsdm-data-export-${userId}-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Cache-Control': 'no-store, private',
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
