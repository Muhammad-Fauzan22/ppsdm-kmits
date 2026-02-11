/**
 * Notification API Route
 * POST /api/automation/notify
 * Sends automated notifications (event reminders, birthday wishes, deadlines, weekly digests)
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService, NotificationResult } from '@/lib/automation/notification-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface NotifyRequest {
  type: 'event_reminders' | 'birthday_wishes' | 'deadline_notifications' | 'weekly_digest';
  data?: any;
  spreadsheetId?: string;
  sheetName?: string;
}

interface NotifyResponse {
  success: boolean;
  result?: NotificationResult;
  error?: string;
  executionTime: number;
}

export async function POST(request: NextRequest): Promise<NextResponse<NotifyResponse>> {
  const startTime = Date.now();

  try {
    const body: NotifyRequest = await request.json();

    if (!body.type) {
      return NextResponse.json({
        success: false,
        error: 'type is required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    let result: NotificationResult;

    switch (body.type) {
      case 'event_reminders':
        result = await notificationService.sendEventReminders(
          body.data || [],
          body.spreadsheetId,
          body.sheetName
        );
        break;

      case 'birthday_wishes':
        result = await notificationService.sendBirthdayWishes(
          body.data || [],
          body.spreadsheetId,
          body.sheetName
        );
        break;

      case 'deadline_notifications':
        result = await notificationService.sendDeadlineNotifications(
          body.data || [],
          body.spreadsheetId,
          body.sheetName
        );
        break;

      case 'weekly_digest':
        result = await notificationService.sendWeeklyDigest(
          body.data || {},
          body.data?.recipients || [],
          body.spreadsheetId,
          body.sheetName
        );
        break;

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown notification type: ${body.type}`,
          executionTime: Date.now() - startTime,
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      result,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}

/**
 * GET /api/automation/notify
 * Fetch notification data from spreadsheet
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const spreadsheetId = searchParams.get('spreadsheetId');
    const sheetName = searchParams.get('sheetName');

    if (!type || !spreadsheetId || !sheetName) {
      return NextResponse.json({
        success: false,
        error: 'type, spreadsheetId, and sheetName are required',
        executionTime: Date.now() - startTime,
      }, { status: 400 });
    }

    let data: any;

    switch (type) {
      case 'event_reminders':
        data = await notificationService.fetchEventReminders(spreadsheetId, sheetName);
        break;

      case 'birthday_wishes':
        data = await notificationService.fetchBirthdayWishes(spreadsheetId, sheetName);
        break;

      case 'deadline_notifications':
        data = await notificationService.fetchDeadlineNotifications(spreadsheetId, sheetName);
        break;

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown notification type: ${type}`,
          executionTime: Date.now() - startTime,
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data,
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      executionTime: Date.now() - startTime,
    }, { status: 500 });
  }
}
