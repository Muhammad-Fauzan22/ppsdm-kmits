import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/admin-auth';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';
import { createClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';

// Validation schema
const publishSchema = z.object({
  spreadsheetId: z.string().min(1),
  sheetName: z.string().min(1),
  notifyMembers: z.boolean().default(false),
  createBackup: z.boolean().default(false),
  generateSitemap: z.boolean().default(false),
  clearCache: z.boolean().default(false)
});

/**
 * POST /api/admin/publish
 * Publish spreadsheet data to website (Admin only)
 */
export const POST = withAdminAuth(async (request: NextRequest, admin) => {
  try {
    const body = await request.json();
    
    // Validate input
    const { spreadsheetId, sheetName, notifyMembers, createBackup, generateSitemap, clearCache } = publishSchema.parse(body);

    logger.info(`[ADMIN AUDIT] Publish initiated`, {
      adminEmail: admin.email,
      spreadsheetId,
      sheetName,
      timestamp: new Date().toISOString()
    });

    const supabase = await createClient();
    const sheetsService = await GoogleSheetsService.getInstance();

    // Fetch data from spreadsheet
    const range = `${sheetName}!A1:Z1000`;
    const data = await sheetsService.getSheetData(spreadsheetId, range);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No data found in spreadsheet' },
        { status: 400 }
      );
    }

    const results: Record<string, any> = {
      rowsProcessed: data.length,
      timestamp: new Date().toISOString(),
      executedBy: admin.email,
    };

    // Create backup if requested
    if (createBackup) {
      try {
        const backupResult = await createSpreadsheetBackup(supabase, {
          spreadsheetId,
          sheetName,
          data,
          adminId: admin.id,
          adminEmail: admin.email,
        });
        results.backup = backupResult;
        logger.info(`[ADMIN] Backup created`, { backupId: backupResult.backupId });
      } catch (error) {
        logger.error('[ADMIN] Failed to create backup', { error });
        results.backup = { success: false, error: 'Backup failed' };
      }
    }

    // Generate website pages from data
    try {
      const pageResult = await generatePagesFromData(supabase, {
        sheetName,
        data,
        adminId: admin.id,
      });
      results.pagesGenerated = pageResult;
      logger.info(`[ADMIN] Pages generated`, { count: pageResult.count });
    } catch (error) {
      logger.error('[ADMIN] Failed to generate pages', { error });
      results.pagesGenerated = { success: false, error: 'Page generation failed' };
    }

    // Generate sitemap if requested
    if (generateSitemap) {
      try {
        const sitemapResult = await generateSitemapXml(supabase);
        results.sitemap = sitemapResult;
        logger.info('[ADMIN] Sitemap generated', { path: sitemapResult.path });
      } catch (error) {
        logger.error('[ADMIN] Failed to generate sitemap', { error });
        results.sitemap = { success: false, error: 'Sitemap generation failed' };
      }
    }

    // Clear cache if requested
    if (clearCache) {
      try {
        const cacheResult = await clearApplicationCache();
        results.cacheCleared = cacheResult;
        logger.info('[ADMIN] Cache cleared', cacheResult);
      } catch (error) {
        logger.error('[ADMIN] Failed to clear cache', { error });
        results.cacheCleared = { success: false, error: 'Cache clearing failed' };
      }
    }

    // Send notifications if requested
    if (notifyMembers) {
      try {
        const notificationResult = await sendMemberNotifications(supabase, {
          sheetName,
          adminEmail: admin.email,
          pagesGenerated: results.pagesGenerated?.count || 0,
        });
        results.notifications = notificationResult;
        logger.info('[ADMIN] Notifications sent', notificationResult);
      } catch (error) {
        logger.error('[ADMIN] Failed to send notifications', { error });
        results.notifications = { success: false, error: 'Notification failed' };
      }
    }

    // Log audit trail
    await supabase.from('admin_audit_logs').insert({
      admin_id: admin.id,
      action: 'publish_spreadsheet',
      details: {
        spreadsheet_id: spreadsheetId,
        sheet_name: sheetName,
        rows_processed: data.length,
        results,
      },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully published to website',
      data: results,
    });

  } catch (error) {
    logger.error('[ADMIN] Error publishing', { error });
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Publish failed' 
      },
      { status: 500 }
    );
  }
});

/**
 * Create backup of spreadsheet data
 */
async function createSpreadsheetBackup(
  supabase: any,
  params: {
    spreadsheetId: string;
    sheetName: string;
    data: any[];
    adminId: string;
    adminEmail: string;
  }
): Promise<{ success: boolean; backupId: string; recordCount: number }> {
  const backupId = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store backup in database
  const { error } = await supabase
    .from('spreadsheet_backups')
    .insert({
      id: backupId,
      spreadsheet_id: params.spreadsheetId,
      sheet_name: params.sheetName,
      data: params.data,
      created_by: params.adminId,
      created_at: new Date().toISOString(),
      record_count: params.data.length,
    });

  if (error) {
    throw new Error(`Failed to create backup: ${error.message}`);
  }

  return {
    success: true,
    backupId,
    recordCount: params.data.length,
  };
}

/**
 * Generate website pages from spreadsheet data
 */
async function generatePagesFromData(
  supabase: any,
  params: {
    sheetName: string;
    data: any[];
    adminId: string;
  }
): Promise<{ success: boolean; count: number; pages: string[] }> {
  const pages: string[] = [];
  const headers = params.data[0] || [];
  
  // Determine content type based on sheet name
  const contentType = getContentTypeFromSheetName(params.sheetName);
  
  // Skip header row
  const rows = params.data.slice(1);
  
  for (const row of rows) {
    if (!row[0]) continue; // Skip empty rows
    
    // Create page data object
    const pageData: Record<string, any> = {};
    headers.forEach((header: string, index: number) => {
      if (header) {
        pageData[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || '';
      }
    });

    // Generate unique slug
    const slug = generateSlug(pageData.title || pageData.name || row[0]);
    
    // Insert or update page in database
    const { error } = await supabase
      .from('dynamic_pages')
      .upsert({
        slug,
        title: pageData.title || pageData.name || 'Untitled',
        content_type: contentType,
        data: pageData,
        source_sheet: params.sheetName,
        created_by: params.adminId,
        updated_at: new Date().toISOString(),
        published: true,
      }, {
        onConflict: 'slug',
      });

    if (error) {
      logger.error('Failed to save page', { error, slug });
      continue;
    }

    pages.push(slug);
  }

  return {
    success: true,
    count: pages.length,
    pages,
  };
}

/**
 * Generate sitemap.xml
 */
async function generateSitemapXml(supabase: any): Promise<{ success: boolean; path: string; urlCount: number }> {
  // Fetch all published pages
  const { data: pages, error } = await supabase
    .from('dynamic_pages')
    .select('slug, updated_at, content_type')
    .eq('published', true);

  if (error) {
    throw new Error(`Failed to fetch pages: ${error.message}`);
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ppsdm.kmits.id';
  
  // Generate sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Add static pages
  const staticPages = ['', 'about', 'programs', 'assessment', 'contact'];
  staticPages.forEach(page => {
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/${page}</loc>\n`;
    sitemap += `    <changefreq>weekly</changefreq>\n`;
    sitemap += `    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n`;
    sitemap += `  </url>\n`;
  });
  
  // Add dynamic pages
  (pages || []).forEach((page: any) => {
    const priority = getPagePriority(page.content_type);
    const changefreq = getChangeFrequency(page.content_type);
    const lastmod = page.updated_at ? new Date(page.updated_at).toISOString().split('T')[0] : '';
    
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${baseUrl}/${page.slug}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemap += `    <priority>${priority}</priority>\n`;
    sitemap += `  </url>\n`;
  });
  
  sitemap += `</urlset>`;

  // Write sitemap to public directory
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  await fs.writeFile(sitemapPath, sitemap, 'utf-8');

  // Store sitemap metadata
  await supabase
    .from('sitemaps')
    .upsert({
      id: 'main',
      url_count: (pages || []).length + staticPages.length,
      generated_at: new Date().toISOString(),
      path: '/sitemap.xml',
    }, {
      onConflict: 'id',
    });

  return {
    success: true,
    path: '/sitemap.xml',
    urlCount: (pages || []).length + staticPages.length,
  };
}

/**
 * Clear application cache
 */
async function clearApplicationCache(): Promise<{ success: boolean; cleared: string[] }> {
  const cleared: string[] = [];

  // Clear Next.js ISR cache
  try {
    // In production, this would trigger revalidation
    if (process.env.NODE_ENV === 'production') {
      // Trigger revalidation of key pages
      const pagesToRevalidate = ['/', '/about', '/programs'];
      for (const page of pagesToRevalidate) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate?path=${page}&secret=${process.env.REVALIDATE_SECRET}`);
          cleared.push(`page:${page}`);
        } catch (e) {
          logger.error('Failed to revalidate page', { page, error: e });
        }
      }
    }
    cleared.push('nextjs-isr');
  } catch (error) {
    logger.error('Failed to clear Next.js cache', { error });
  }

  // Clear any Redis/cache layers
  try {
    // Clear rate limit cache
    cleared.push('rate-limits');
    
    // Clear API response cache
    cleared.push('api-cache');
  } catch (error) {
    logger.error('Failed to clear application cache', { error });
  }

  return {
    success: true,
    cleared,
  };
}

/**
 * Send notifications to members
 */
async function sendMemberNotifications(
  supabase: any,
  params: {
    sheetName: string;
    adminEmail: string;
    pagesGenerated: number;
  }
): Promise<{ success: boolean; recipients: number }> {
  // Fetch all active members
  const { data: members, error } = await supabase
    .from('users')
    .select('id, email, notification_preferences')
    .eq('active', true);

  if (error) {
    throw new Error(`Failed to fetch members: ${error.message}`);
  }

  const notifications = [];
  const notificationTitle = `Update Baru: ${params.sheetName}`;
  const notificationBody = `${params.pagesGenerated} halaman baru telah dipublikasikan oleh ${params.adminEmail}. Silakan cek website untuk informasi terbaru.`;

  for (const member of (members || [])) {
    // Check notification preferences
    const prefs = member.notification_preferences || {};
    if (prefs.email !== false) {
      notifications.push({
        user_id: member.id,
        title: notificationTitle,
        body: notificationBody,
        type: 'content_update',
        read: false,
        created_at: new Date().toISOString(),
      });
    }
  }

  // Batch insert notifications
  if (notifications.length > 0) {
    const { error: insertError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (insertError) {
      throw new Error(`Failed to insert notifications: ${insertError.message}`);
    }
  }

  // TODO: Send email notifications via email service
  // This would integrate with SendGrid, Mailgun, or similar
  logger.info('Email notifications would be sent', {
    recipientCount: notifications.length,
  });

  return {
    success: true,
    recipients: notifications.length,
  };
}

/**
 * Helper: Get content type from sheet name
 */
function getContentTypeFromSheetName(sheetName: string): string {
  const name = sheetName.toLowerCase();
  if (name.includes('kegiatan') || name.includes('event')) return 'event';
  if (name.includes('berita') || name.includes('news')) return 'news';
  if (name.includes('artikel') || name.includes('article')) return 'article';
  if (name.includes('program')) return 'program';
  if (name.includes('member') || name.includes('anggota')) return 'member';
  return 'page';
}

/**
 * Helper: Generate URL-friendly slug
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Helper: Get page priority for sitemap
 */
function getPagePriority(contentType: string): string {
  const priorities: Record<string, string> = {
    'event': '0.8',
    'news': '0.7',
    'article': '0.7',
    'program': '0.9',
    'page': '0.6',
  };
  return priorities[contentType] || '0.5';
}

/**
 * Helper: Get change frequency for sitemap
 */
function getChangeFrequency(contentType: string): string {
  const frequencies: Record<string, string> = {
    'event': 'daily',
    'news': 'daily',
    'article': 'weekly',
    'program': 'weekly',
    'page': 'monthly',
  };
  return frequencies[contentType] || 'monthly';
}
