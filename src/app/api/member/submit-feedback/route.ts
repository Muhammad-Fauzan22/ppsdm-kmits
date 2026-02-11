import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';

/**
 * API Route: Submit Activity Feedback
 * 
 * POST /api/member/submit-feedback
 * 
 * Request Body:
 * {
 *   activityId: string;
 *   memberId?: string;
 *   rating: number; // 1-5
 *   comment: string;
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
    const { activityId, memberId, rating, comment } = body;

    // Validate required fields
    if (!activityId) {
      return NextResponse.json(
        { success: false, message: 'Activity ID is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Comment is required' },
        { status: 400 }
      );
    }

    // Get member ID from session or request body
    const currentMemberId = memberId || 'current_member_id'; // In production, get from auth session

    // Initialize Google Sheets service
    const sheetsService = await GoogleSheetsService.getInstance();
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

    // Check if activity is completed
    if (activity.status !== 'completed') {
      return NextResponse.json(
        { success: false, message: 'Feedback can only be submitted for completed activities' },
        { status: 400 }
      );
    }

    // Check if feedback already submitted
    if (activity.feedbackSubmitted === 'true') {
      return NextResponse.json(
        { success: false, message: 'Feedback already submitted for this activity' },
        { status: 400 }
      );
    }

    // Check if member attended the activity
    if (activity.registrationStatus !== 'attended' && activity.registrationStatus !== 'completed') {
      return NextResponse.json(
        { success: false, message: 'You must attend the activity to submit feedback' },
        { status: 400 }
      );
    }

    // Submit feedback to Feedback sheet
    await sheetsService.appendSheetData(
      spreadsheetId,
      'Feedback!A:F',
      [[
        new Date().toISOString(),
        currentMemberId,
        activityId,
        activity.name,
        rating.toString(),
        comment,
      ]]
    );

    // Update activity to mark feedback as submitted
    const rowIndex = activityIndex + 2;
    
    await sheetsService.updateSheetData(
      spreadsheetId,
      `Activities!J${rowIndex}`,
      [['true']]
    );

    // Calculate average rating for the activity
    const feedbackData = await sheetsService.getSheetData(spreadsheetId, 'Feedback');
    const activityFeedbacks = feedbackData.filter((f: any) => f.activityId === activityId);
    
    const totalRating = activityFeedbacks.reduce((sum: number, f: any) => sum + parseInt(f.rating), 0);
    const averageRating = (totalRating / activityFeedbacks.length).toFixed(1);

    // Update activity with average rating
    await sheetsService.updateSheetData(
      spreadsheetId,
      `Activities!K${rowIndex}`,
      [[averageRating]]
    );

    // Trigger certificate generation if rating >= 4
    let certificateGenerated = false;
    if (rating >= 4 && !activity.certificateGenerated) {
      // In a real implementation, this would generate a PDF certificate
      certificateGenerated = true;
      
      // Mark certificate as generated
      await sheetsService.updateSheetData(
        spreadsheetId,
        `Activities!L${rowIndex}`,
        [['true']]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        activityId,
        activityName: activity.name,
        rating,
        comment,
        submittedAt: new Date().toISOString(),
        averageRating,
        certificateGenerated,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit feedback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/member/submit-feedback
 * 
 * Get feedback for an activity
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activityId = searchParams.get('activityId');

    if (!activityId) {
      return NextResponse.json(
        { success: false, message: 'Activity ID is required' },
        { status: 400 }
      );
    }

    const sheetsService = await GoogleSheetsService.getInstance();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

    // Fetch feedback data
    const feedbackData = await sheetsService.getSheetData(spreadsheetId, 'Feedback');
    
    // Filter feedback for the specific activity
    const activityFeedbacks = feedbackData.filter((f: any) => f.activityId === activityId);

    // Calculate statistics
    const totalFeedbacks = activityFeedbacks.length;
    const averageRating = totalFeedbacks > 0
      ? (activityFeedbacks.reduce((sum: number, f: any) => sum + parseInt(f.rating), 0) / totalFeedbacks).toFixed(1)
      : '0.0';

    // Rating distribution
    const ratingDistribution = {
      5: activityFeedbacks.filter((f: any) => parseInt(f.rating) === 5).length,
      4: activityFeedbacks.filter((f: any) => parseInt(f.rating) === 4).length,
      3: activityFeedbacks.filter((f: any) => parseInt(f.rating) === 3).length,
      2: activityFeedbacks.filter((f: any) => parseInt(f.rating) === 2).length,
      1: activityFeedbacks.filter((f: any) => parseInt(f.rating) === 1).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        activityId,
        totalFeedbacks,
        averageRating,
        ratingDistribution,
        feedbacks: activityFeedbacks.map((f: any) => ({
          submittedAt: f.timestamp,
          memberId: f.memberId,
          rating: parseInt(f.rating),
          comment: f.comment,
        })),
      },
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get feedback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/member/submit-feedback
 * 
 * Update existing feedback
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackId, rating, comment } = body;

    // Validate required fields
    if (!feedbackId) {
      return NextResponse.json(
        { success: false, message: 'Feedback ID is required' },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Comment is required' },
        { status: 400 }
      );
    }

    const sheetsService = await GoogleSheetsService.getInstance();
    const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';

    // Fetch feedback data
    const feedbackData = await sheetsService.getSheetData(spreadsheetId, 'Feedback');
    
    // Find the feedback
    const feedbackIndex = feedbackData.findIndex((f: any) => f.id === feedbackId);
    
    if (feedbackIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Feedback not found' },
        { status: 404 }
      );
    }

    const feedback = feedbackData[feedbackIndex] as any;

    // Update feedback
    const rowIndex = feedbackIndex + 2;
    
    await sheetsService.updateSheetData(
      spreadsheetId,
      `Feedback!E${rowIndex}:F${rowIndex}`,
      [[
        rating.toString(),
        comment,
      ]]
    );

    // Recalculate average rating for the activity
    const activityFeedbacks = feedbackData.filter((f: any) => f.activityId === feedback.activityId);
    const totalRating = activityFeedbacks.reduce((sum: number, f: any) => 
      sum + (f.id === feedbackId ? rating : parseInt(f.rating)), 0
    );
    const averageRating = (totalRating / activityFeedbacks.length).toFixed(1);

    // Update activity with new average rating
    const activitiesData = await sheetsService.getSheetData(spreadsheetId, 'Activities');
    const activityIndex = activitiesData.findIndex((a: any) => a.id === feedback.activityId);
    
    if (activityIndex !== -1) {
      const actRowIndex = activityIndex + 2;
      await sheetsService.updateSheetData(
        spreadsheetId,
        `Activities!K${actRowIndex}`,
        [[averageRating]]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback updated successfully',
      data: {
        feedbackId,
        rating,
        comment,
        updatedAt: new Date().toISOString(),
        averageRating,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update feedback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
