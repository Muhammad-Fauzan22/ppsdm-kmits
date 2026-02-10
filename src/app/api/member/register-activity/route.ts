import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';

/**
 * API Route: Register for Activity
 * 
 * POST /api/member/register-activity
 * 
 * Request Body:
 * {
 *   activityId: string;
 *   memberId?: string;
 * }
 * 
 * Response:
 * {
 *   success: boolean;
 *   message: string;
 *   data?: any;
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, memberId } = body;

    // Validate required fields
    if (!activityId) {
      return NextResponse.json(
        { success: false, message: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Get member ID from session or request body
    const currentMemberId = memberId || 'current_member_id'; // In production, get from auth session

    // Initialize Google Sheets service
    const sheetsService = GoogleSheetsService.getInstance();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

    // Fetch current activities data
    const activitiesData = await sheetsService.getSheetData(spreadsheetId, 'Activities');
    
    // Find the activity
    const activityIndex = activitiesData.findIndex((a: any) => a.id === activityId);
    
    if (activityIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Activity not found' },
        { status: 404 }
      );
    }

    const activity = activitiesData[activityIndex] as any;

    // Check if activity is still available
    if (activity.status !== 'upcoming') {
      return NextResponse.json(
        { success: false, message: 'Activity is not available for registration' },
        { status: 400 }
      );
    }

    // Check if max participants reached
    const currentParticipants = parseInt(activity.currentParticipants) || 0;
    const maxParticipants = parseInt(activity.maxParticipants) || 50;

    if (currentParticipants >= maxParticipants) {
      return NextResponse.json(
        { success: false, message: 'Activity is fully booked' },
        { status: 400 }
      );
    }

    // Check if already registered
    if (activity.registrationStatus === 'registered') {
      return NextResponse.json(
        { success: false, message: 'Already registered for this activity' },
        { status: 400 }
      );
    }

    // Update activity data
    const updatedActivity = {
      ...activity,
      currentParticipants: (currentParticipants + 1).toString(),
      registrationStatus: 'registered',
      registeredAt: new Date().toISOString(),
    };

    // Update the specific row in Google Sheets
    // Note: Row index + 2 because of header row and 0-based index
    const rowIndex = activityIndex + 2;
    
    // Prepare update values for the relevant columns
    // Assuming column indices: currentParticipants (column G), registrationStatus (column H), registeredAt (column I)
    await sheetsService.updateSheetData(
      spreadsheetId,
      `Activities!G${rowIndex}:I${rowIndex}`,
      [[
        updatedActivity.currentParticipants,
        updatedActivity.registrationStatus,
        updatedActivity.registeredAt,
      ]]
    );

    // Log registration to a separate sheet for tracking
    await sheetsService.appendSheetData(
      spreadsheetId,
      'ActivityRegistrations!A:E',
      [[
        new Date().toISOString(),
        currentMemberId,
        activityId,
        activity.name,
        'registered',
      ]]
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for activity',
      data: {
        activityId,
        activityName: activity.name,
        registeredAt: updatedActivity.registeredAt,
        currentParticipants: updatedActivity.currentParticipants,
      },
    });

  } catch (error) {
    console.error('Error registering for activity:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to register for activity',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/member/register-activity
 * 
 * Get registration status for an activity
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activityId = searchParams.get('activityId');
    const memberId = searchParams.get('memberId');

    if (!activityId) {
      return NextResponse.json(
        { success: false, message: 'Activity ID is required' },
        { status: 400 }
      );
    }

    const sheetsService = GoogleSheetsService.getInstance();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

    // Fetch activities data
    const activitiesData = await sheetsService.getSheetData(spreadsheetId, 'Activities');
    
    // Find the activity
    const activity = activitiesData.find((a: any) => a.id === activityId);
    
    if (!activity) {
      return NextResponse.json(
        { success: false, message: 'Activity not found' },
        { status: 404 }
      );
    }

    // Check registration status
    const currentMemberId = memberId || 'current_member_id';
    
    // Fetch registrations to check if this member is registered
    const registrationsData = await sheetsService.getSheetData(spreadsheetId, 'ActivityRegistrations');
    const registration = registrationsData.find((r: any) => 
      r.activityId === activityId && r.memberId === currentMemberId
    );

    return NextResponse.json({
      success: true,
      data: {
        activityId,
        activityName: activity.name,
        registrationStatus: activity.registrationStatus || 'not_registered',
        currentParticipants: parseInt(activity.currentParticipants) || 0,
        maxParticipants: parseInt(activity.maxParticipants) || 50,
        isRegistered: !!registration,
        registeredAt: registration?.registeredAt || null,
      },
    });

  } catch (error) {
    console.error('Error getting registration status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get registration status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/member/register-activity
 * 
 * Cancel registration for an activity
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { activityId, memberId } = body;

    if (!activityId) {
      return NextResponse.json(
        { success: false, message: 'Activity ID is required' },
        { status: 400 }
      );
    }

    const currentMemberId = memberId || 'current_member_id';
    const sheetsService = GoogleSheetsService.getInstance();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

    // Fetch activities data
    const activitiesData = await sheetsService.getSheetData(spreadsheetId, 'Activities');
    
    // Find the activity
    const activityIndex = activitiesData.findIndex((a: any) => a.id === activityId);
    
    if (activityIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Activity not found' },
        { status: 404 }
      );
    }

    const activity = activitiesData[activityIndex] as any;

    // Check if activity allows cancellation
    if (activity.status !== 'upcoming') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel registration for this activity' },
        { status: 400 }
      );
    }

    // Update activity data
    const currentParticipants = parseInt(activity.currentParticipants) || 0;
    const updatedActivity = {
      ...activity,
      currentParticipants: Math.max(0, currentParticipants - 1).toString(),
      registrationStatus: 'cancelled',
      cancelledAt: new Date().toISOString(),
    };

    // Update the specific row in Google Sheets
    const rowIndex = activityIndex + 2;
    
    await sheetsService.updateSheetData(
      spreadsheetId,
      `Activities!G${rowIndex}:J${rowIndex}`,
      [[
        updatedActivity.currentParticipants,
        updatedActivity.registrationStatus,
        updatedActivity.registeredAt || '',
        updatedActivity.cancelledAt,
      ]]
    );

    // Update registration log
    const registrationsData = await sheetsService.getSheetData(spreadsheetId, 'ActivityRegistrations');
    const registrationIndex = registrationsData.findIndex((r: any) => 
      r.activityId === activityId && r.memberId === currentMemberId
    );

    if (registrationIndex !== -1) {
      const regRowIndex = registrationIndex + 2;
      await sheetsService.updateSheetData(
        spreadsheetId,
        `ActivityRegistrations!E${regRowIndex}`,
        [['cancelled']]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully cancelled registration',
      data: {
        activityId,
        activityName: activity.name,
        cancelledAt: updatedActivity.cancelledAt,
      },
    });

  } catch (error) {
    console.error('Error cancelling registration:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to cancel registration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
