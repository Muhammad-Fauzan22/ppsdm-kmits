import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * UU PDP Compliance - Data Export Endpoint
 * Generates PDF report of all user data for data portability rights
 * 
 * @route GET /api/user/export
 * @returns PDF file with all user assessment data
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
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Fetch all user data in parallel
    const [
      profileData,
      sessionsData,
      responsesData,
      resultsData,
      progressData,
      achievementsData
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
        .order('created_at', { ascending: false }),
      
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
      
      // Achievements
      supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
    ]);

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    let yPosition = height - 50;
    
    // Helper function to add text
    const addText = (text: string, size: number, isBold = false, x = 50) => {
      const font = isBold ? helveticaBold : helveticaFont;
      page.drawText(text, {
        x,
        y: yPosition,
        size,
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -= size + 5;
    };

    // Helper function to add new page if needed
    const checkNewPage = () => {
      if (yPosition < 100) {
        page = pdfDoc.addPage([595.28, 841.89]);
        yPosition = height - 50;
      }
    };

    // PDF Header
    addText('PPSDM KM ITS - Data Export Report', 20, true);
    addText(`Generated: ${new Date().toLocaleString('id-ID')}`, 12);
    addText(`User ID: ${userId}`, 12);
    addText(`Email: ${user.email}`, 12);
    yPosition -= 20;

    // Profile Section
    addText('PROFIL PENGGUNA', 16, true);
    if (profileData.data) {
      const profile = profileData.data;
      addText(`Nama: ${profile.full_name || 'N/A'}`, 11);
      addText(`NRP: ${profile.nrp || 'N/A'}`, 11);
      addText(`Fakultas: ${profile.fakultas || 'N/A'}`, 11);
      addText(`Departemen: ${profile.departemen || 'N/A'}`, 11);
      addText(`Angkatan: ${profile.angkatan || 'N/A'}`, 11);
      addText(`Bergabung: ${profile.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : 'N/A'}`, 11);
    } else {
      addText('Profil tidak ditemukan', 11);
    }
    yPosition -= 15;
    checkNewPage();

    // Assessment Sessions
    addText('RIWAYAT ASESMEN', 16, true);
    addText(`Total Sesi: ${sessionsData.data?.length || 0}`, 11);
    yPosition -= 10;
    
    if (sessionsData.data && sessionsData.data.length > 0) {
      sessionsData.data.slice(0, 10).forEach((session: any, index: number) => {
        checkNewPage();
        addText(`${index + 1}. Dimensi: ${session.dimension || 'N/A'}`, 10, true);
        addText(`   Status: ${session.status || 'N/A'}`, 10);
        addText(`   Mulai: ${session.started_at ? new Date(session.started_at).toLocaleString('id-ID') : 'N/A'}`, 10);
        addText(`   Selesai: ${session.completed_at ? new Date(session.completed_at).toLocaleString('id-ID') : 'N/A'}`, 10);
        yPosition -= 5;
      });
      
      if (sessionsData.data.length > 10) {
        addText(`... dan ${sessionsData.data.length - 10} sesi lainnya`, 10);
      }
    } else {
      addText('Tidak ada riwayat asesmen', 11);
    }
    yPosition -= 15;
    checkNewPage();

    // Assessment Results
    addText('HASIL ASESMEN', 16, true);
    if (resultsData.data && resultsData.data.length > 0) {
      resultsData.data.forEach((result: any, index: number) => {
        checkNewPage();
        addText(`${index + 1}. ${result.dimension || 'N/A'}`, 11, true);
        addText(`   Skor: ${result.score || 'N/A'}`, 10);
        addText(`   Kategori: ${result.category || 'N/A'}`, 10);
        addText(`   Tanggal: ${result.created_at ? new Date(result.created_at).toLocaleDateString('id-ID') : 'N/A'}`, 10);
        yPosition -= 5;
      });
    } else {
      addText('Tidak ada hasil asesmen', 11);
    }
    yPosition -= 15;
    checkNewPage();

    // Progress Data
    addText('PROGRESS PENGERJAAN', 16, true);
    if (progressData.data && progressData.data.length > 0) {
      progressData.data.forEach((progress: any) => {
        checkNewPage();
        addText(`- ${progress.dimension}: ${progress.status || 'N/A'}`, 10);
      });
    } else {
      addText('Tidak ada data progress', 11);
    }
    yPosition -= 15;
    checkNewPage();

    // Achievements
    addText('PENCAPAIAN', 16, true);
    if (achievementsData.data && achievementsData.data.length > 0) {
      addText(`Total Achievement: ${achievementsData.data.length}`, 11);
      achievementsData.data.slice(0, 5).forEach((achievement: any, index: number) => {
        checkNewPage();
        addText(`${index + 1}. ${achievement.name || 'N/A'}`, 10, true);
        addText(`   ${achievement.description || ''}`, 9);
      });
    } else {
      addText('Tidak ada pencapaian', 11);
    }
    yPosition -= 15;
    checkNewPage();

    // Footer
    addText('---', 12);
    addText('Dokumen ini dibuat sesuai dengan UU No. 27 Tahun 2022', 9);
    addText('tentang Perlindungan Data Pribadi (PDP)', 9);
    addText('PPSDM KM ITS - Platform Pengembangan Mahasiswa', 9);

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();

    // Log export for compliance audit
    await supabase.from('data_export_logs').insert({
      user_id: userId,
      exported_at: new Date().toISOString(),
      export_type: 'full_data_pdf',
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown'
    });

    // Return PDF as downloadable file
    return new NextResponse(Buffer.from(pdfBytes), {

      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ppsdm-data-export-${userId}-${Date.now()}.pdf"`,
        'Cache-Control': 'no-store, private',
      },
    });

  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate data export' },
      { status: 500 }
    );
  }
}
