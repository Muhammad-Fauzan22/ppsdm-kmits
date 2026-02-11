/**
 * Notification Service for PPSDM KMITS Automation
 * Features: Event reminders, birthday wishes, deadline notifications, weekly digests
 * Integrates with: Email Service, Google Sheets API
 */

import { google } from 'googleapis';

// Types for notifications
export interface NotificationConfig {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
  defaultFromEmail?: string;
  defaultFromName?: string;
}

export interface EventReminder {
  eventId: string;
  eventName: string;
  eventDate: Date;
  eventLocation?: string;
  participants: string[];
  reminderDaysBefore: number[];
  sentReminders: number[];
}

export interface BirthdayWish {
  memberId: string;
  memberName: string;
  memberEmail: string;
  birthDate: Date;
  message?: string;
  sent: boolean;
  sentDate?: Date;
}

export interface DeadlineNotification {
  deadlineId: string;
  deadlineName: string;
  deadlineDate: Date;
  assignees: string[];
  reminderDaysBefore: number[];
  sentReminders: number[];
}

export interface WeeklyDigest {
  weekStart: Date;
  weekEnd: Date;
  activities: ActivitySummary[];
  announcements: string[];
  upcomingEvents: EventSummary[];
  memberHighlights: MemberHighlight[];
}

export interface ActivitySummary {
  activityName: string;
  date: Date;
  participants: number;
  status: string;
}

export interface EventSummary {
  eventName: string;
  date: Date;
  location?: string;
  registrationDeadline?: Date;
}

export interface MemberHighlight {
  memberId: string;
  memberName: string;
  achievement: string;
}

export interface NotificationResult {
  success: boolean;
  sent: number;
  failed: number;
  errors: string[];
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

class NotificationService {
  private config: NotificationConfig;
  private sheetsClient: any = null;

  constructor(config: NotificationConfig = {}) {
    this.config = {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      defaultFromEmail: process.env.NOTIFICATION_FROM_EMAIL || 'noreply@ppsdm-kmits.its.ac.id',
      defaultFromName: 'PPSDM KMITS',
      ...config,
    };
  }

  /**
   * Initialize Google Sheets client
   */
  private async getSheetsClient() {
    if (this.sheetsClient) return this.sheetsClient;

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.sheetsClient = google.sheets({
      version: 'v4',
      auth,
    });

    return this.sheetsClient;
  }

  /**
   * Send event reminders
   */
  async sendEventReminders(
    reminders: EventReminder[],
    spreadsheetId?: string,
    sheetName?: string
  ): Promise<NotificationResult> {
    const result: NotificationResult = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const reminder of reminders) {
      const eventDate = new Date(reminder.eventDate);
      eventDate.setHours(0, 0, 0, 0);

      const daysUntilEvent = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check if we need to send a reminder
      if (reminder.reminderDaysBefore.includes(daysUntilEvent) && !reminder.sentReminders.includes(daysUntilEvent)) {
        try {
          const email = this.generateEventReminderEmail(reminder, daysUntilEvent);

          // Send email to all participants
          for (const participantEmail of reminder.participants) {
            await this.sendEmail(participantEmail, email.subject, email.htmlBody, email.textBody);
          }

          reminder.sentReminders.push(daysUntilEvent);
          result.sent++;

          // Update spreadsheet if provided
          if (spreadsheetId && sheetName) {
            await this.updateReminderStatus(spreadsheetId, sheetName, reminder.eventId, daysUntilEvent);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to send reminder for ${reminder.eventName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    result.success = result.failed === 0;
    return result;
  }

  /**
   * Send birthday wishes
   */
  async sendBirthdayWishes(
    wishes: BirthdayWish[],
    spreadsheetId?: string,
    sheetName?: string
  ): Promise<NotificationResult> {
    const result: NotificationResult = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [],
    };

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    for (const wish of wishes) {
      const birthDate = new Date(wish.birthDate);
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();

      // Check if today is the birthday
      if (birthMonth === todayMonth && birthDay === todayDay && !wish.sent) {
        try {
          const email = this.generateBirthdayEmail(wish);
          await this.sendEmail(wish.memberEmail, email.subject, email.htmlBody, email.textBody);

          wish.sent = true;
          wish.sentDate = new Date();
          result.sent++;

          // Update spreadsheet if provided
          if (spreadsheetId && sheetName) {
            await this.updateBirthdayStatus(spreadsheetId, sheetName, wish.memberId);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to send birthday wish to ${wish.memberName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    result.success = result.failed === 0;
    return result;
  }

  /**
   * Send deadline notifications
   */
  async sendDeadlineNotifications(
    deadlines: DeadlineNotification[],
    spreadsheetId?: string,
    sheetName?: string
  ): Promise<NotificationResult> {
    const result: NotificationResult = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const deadline of deadlines) {
      const deadlineDate = new Date(deadline.deadlineDate);
      deadlineDate.setHours(0, 0, 0, 0);

      const daysUntilDeadline = Math.floor((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Check if we need to send a notification
      if (deadline.reminderDaysBefore.includes(daysUntilDeadline) && !deadline.sentReminders.includes(daysUntilDeadline)) {
        try {
          const email = this.generateDeadlineEmail(deadline, daysUntilDeadline);

          // Send email to all assignees
          for (const assigneeEmail of deadline.assignees) {
            await this.sendEmail(assigneeEmail, email.subject, email.htmlBody, email.textBody);
          }

          deadline.sentReminders.push(daysUntilDeadline);
          result.sent++;

          // Update spreadsheet if provided
          if (spreadsheetId && sheetName) {
            await this.updateDeadlineStatus(spreadsheetId, sheetName, deadline.deadlineId, daysUntilDeadline);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Failed to send deadline notification for ${deadline.deadlineName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    result.success = result.failed === 0;
    return result;
  }

  /**
   * Generate and send weekly digest
   */
  async sendWeeklyDigest(
    digest: WeeklyDigest,
    recipients: string[],
    spreadsheetId?: string,
    sheetName?: string
  ): Promise<NotificationResult> {
    const result: NotificationResult = {
      success: true,
      sent: 0,
      failed: 0,
      errors: [],
    };

    try {
      const email = this.generateWeeklyDigestEmail(digest);

      // Send email to all recipients
      for (const recipientEmail of recipients) {
        await this.sendEmail(recipientEmail, email.subject, email.htmlBody, email.textBody);
        result.sent++;
      }

      // Log digest sent to spreadsheet if provided
      if (spreadsheetId && sheetName) {
        await this.logDigestSent(spreadsheetId, sheetName, digest);
      }
    } catch (error) {
      result.failed = recipients.length;
      result.errors.push(`Failed to send weekly digest: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    result.success = result.failed === 0;
    return result;
  }

  /**
   * Generate event reminder email
   */
  private generateEventReminderEmail(reminder: EventReminder, daysUntilEvent: number): EmailTemplate {
    const subject = daysUntilEvent === 0
      ? `📅 Reminder: ${reminder.eventName} is today!`
      : daysUntilEvent === 1
      ? `📅 Reminder: ${reminder.eventName} is tomorrow!`
      : `📅 Reminder: ${reminder.eventName} in ${daysUntilEvent} days`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .event-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .event-details h3 { margin-top: 0; color: #667eea; }
    .event-details p { margin: 5px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Event Reminder</h1>
    </div>
    <div class="content">
      <p>Dear Member,</p>
      <p>This is a friendly reminder about the upcoming event:</p>
      <div class="event-details">
        <h3>${reminder.eventName}</h3>
        <p><strong>Date:</strong> ${reminder.eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Time:</strong> ${reminder.eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        ${reminder.eventLocation ? `<p><strong>Location:</strong> ${reminder.eventLocation}</p>` : ''}
      </div>
      <p>We look forward to seeing you there!</p>
      <p>Best regards,<br>PPSDM KMITS Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

    const textBody = `
Event Reminder

Dear Member,

This is a friendly reminder about the upcoming event:

Event: ${reminder.eventName}
Date: ${reminder.eventDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${reminder.eventDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
${reminder.eventLocation ? `Location: ${reminder.eventLocation}` : ''}

We look forward to seeing you there!

Best regards,
PPSDM KMITS Team
`;

    return { subject, htmlBody, textBody };
  }

  /**
   * Generate birthday email
   */
  private generateBirthdayEmail(wish: BirthdayWish): EmailTemplate {
    const subject = `🎂 Happy Birthday, ${wish.memberName}!`;
    const message = wish.message || 'Wishing you a wonderful birthday filled with joy and happiness. May this special day bring you lots of memorable moments.';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; }
    .message { background: white; padding: 20px; border-radius: 5px; margin: 15px 0; font-style: italic; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎂 Happy Birthday!</h1>
    </div>
    <div class="content">
      <h2>Dear ${wish.memberName},</h2>
      <div class="message">
        <p>${message}</p>
      </div>
      <p>On behalf of the entire PPSD KMITS family, we wish you a fantastic birthday and a year filled with success and happiness!</p>
      <p>Best regards,<br>PPSDM KMITS Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

    const textBody = `
Happy Birthday, ${wish.memberName}!

Dear ${wish.memberName},

${message}

On behalf of the entire PPSD KMITS family, we wish you a fantastic birthday and a year filled with success and happiness!

Best regards,
PPSDM KMITS Team
`;

    return { subject, htmlBody, textBody };
  }

  /**
   * Generate deadline email
   */
  private generateDeadlineEmail(deadline: DeadlineNotification, daysUntilDeadline: number): EmailTemplate {
    const subject = daysUntilDeadline === 0
      ? `⚠️ Deadline Today: ${deadline.deadlineName}`
      : daysUntilDeadline === 1
      ? `⚠️ Deadline Tomorrow: ${deadline.deadlineName}`
      : `⚠️ Deadline in ${daysUntilDeadline} days: ${deadline.deadlineName}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .deadline-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ff6b6b; }
    .deadline-details h3 { margin-top: 0; color: #ff6b6b; }
    .deadline-details p { margin: 5px 0; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Deadline Reminder</h1>
    </div>
    <div class="content">
      <p>Dear Member,</p>
      <p>This is a reminder about an upcoming deadline:</p>
      <div class="deadline-details">
        <h3>${deadline.deadlineName}</h3>
        <p><strong>Due Date:</strong> ${deadline.deadlineDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p><strong>Time:</strong> ${deadline.deadlineDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>Time Remaining:</strong> ${daysUntilDeadline === 0 ? 'Due today!' : daysUntilDeadline === 1 ? 'Due tomorrow!' : `${daysUntilDeadline} days remaining`}</p>
      </div>
      <p>Please ensure you complete all required tasks before the deadline.</p>
      <p>Best regards,<br>PPSDM KMITS Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

    const textBody = `
Deadline Reminder

Dear Member,

This is a reminder about an upcoming deadline:

Task: ${deadline.deadlineName}
Due Date: ${deadline.deadlineDate.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${deadline.deadlineDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
Time Remaining: ${daysUntilDeadline === 0 ? 'Due today!' : daysUntilDeadline === 1 ? 'Due tomorrow!' : `${daysUntilDeadline} days remaining`}

Please ensure you complete all required tasks before the deadline.

Best regards,
PPSDM KMITS Team
`;

    return { subject, htmlBody, textBody };
  }

  /**
   * Generate weekly digest email
   */
  private generateWeeklyDigestEmail(digest: WeeklyDigest): EmailTemplate {
    const weekStart = digest.weekStart.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const weekEnd = digest.weekEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const subject = `📊 Weekly Digest: ${weekStart} - ${weekEnd}`;

    const activitiesHtml = digest.activities.map(a => `
      <tr>
        <td>${a.activityName}</td>
        <td>${a.date.toLocaleDateString('id-ID')}</td>
        <td>${a.participants}</td>
        <td><span style="color: ${a.status === 'completed' ? 'green' : a.status === 'ongoing' ? 'blue' : 'orange'}">${a.status}</span></td>
      </tr>
    `).join('');

    const upcomingEventsHtml = digest.upcomingEvents.map(e => `
      <tr>
        <td>${e.eventName}</td>
        <td>${e.date.toLocaleDateString('id-ID')}</td>
        <td>${e.location || 'TBD'}</td>
      </tr>
    `).join('');

    const memberHighlightsHtml = digest.memberHighlights.map(m => `
      <li><strong>${m.memberName}</strong> - ${m.achievement}</li>
    `).join('');

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
    .section h3 { margin-top: 0; color: #667eea; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f0f0f0; }
    .announcements ul { padding-left: 20px; }
    .highlights ul { padding-left: 20px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Weekly Digest</h1>
      <p>${weekStart} - ${weekEnd}</p>
    </div>
    <div class="content">
      <div class="section">
        <h3>📋 Activities This Week</h3>
        <table>
          <tr>
            <th>Activity</th>
            <th>Date</th>
            <th>Participants</th>
            <th>Status</th>
          </tr>
          ${activitiesHtml || '<tr><td colspan="4">No activities this week</td></tr>'}
        </table>
      </div>
      <div class="section announcements">
        <h3>📢 Announcements</h3>
        <ul>
          ${digest.announcements.map(a => `<li>${a}</li>`).join('') || '<li>No announcements this week</li>'}
        </ul>
      </div>
      <div class="section">
        <h3>📅 Upcoming Events</h3>
        <table>
          <tr>
            <th>Event</th>
            <th>Date</th>
            <th>Location</th>
          </tr>
          ${upcomingEventsHtml || '<tr><td colspan="3">No upcoming events</td></tr>'}
        </table>
      </div>
      <div class="section highlights">
        <h3>🌟 Member Highlights</h3>
        <ul>
          ${memberHighlightsHtml || '<li>No highlights this week</li>'}
        </ul>
      </div>
      <p>Best regards,<br>PPSDM KMITS Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

    const textBody = `
Weekly Digest: ${weekStart} - ${weekEnd}

Activities This Week:
${digest.activities.map(a => `- ${a.activityName} (${a.date.toLocaleDateString('id-ID')}) - ${a.participants} participants - ${a.status}`).join('\n') || 'No activities this week'}

Announcements:
${digest.announcements.map(a => `- ${a}`).join('\n') || 'No announcements this week'}

Upcoming Events:
${digest.upcomingEvents.map(e => `- ${e.eventName} (${e.date.toLocaleDateString('id-ID')}) - ${e.location || 'TBD'}`).join('\n') || 'No upcoming events'}

Member Highlights:
${digest.memberHighlights.map(m => `- ${m.memberName}: ${m.achievement}`).join('\n') || 'No highlights this week'}

Best regards,
PPSDM KMITS Team
`;

    return { subject, htmlBody, textBody };
  }

  /**
   * Send email (placeholder - integrate with actual email service)
   */
  private async sendEmail(
    to: string,
    subject: string,
    htmlBody: string,
    textBody: string
  ): Promise<void> {
    // TODO: Integrate with actual email service (e.g., SendGrid, Mailgun, Nodemailer)
    // Placeholder implementation
    // In production, this would use an actual email service
    // Example with Nodemailer:
    /*
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: this.config.defaultFromEmail,
      to,
      subject,
      html: htmlBody,
      text: textBody,
    });
    */
  }

  /**
   * Update reminder status in spreadsheet
   */
  private async updateReminderStatus(
    spreadsheetId: string,
    sheetName: string,
    eventId: string,
    daysBefore: number
  ): Promise<void> {
    try {
      const sheets = await this.getSheetsClient();
      // TODO: Implement actual spreadsheet update logic
      } catch (error) {
      }
  }

  /**
   * Update birthday status in spreadsheet
   */
  private async updateBirthdayStatus(
    spreadsheetId: string,
    sheetName: string,
    memberId: string
  ): Promise<void> {
    try {
      const sheets = await this.getSheetsClient();
      // TODO: Implement actual spreadsheet update logic
      } catch (error) {
      }
  }

  /**
   * Update deadline status in spreadsheet
   */
  private async updateDeadlineStatus(
    spreadsheetId: string,
    sheetName: string,
    deadlineId: string,
    daysBefore: number
  ): Promise<void> {
    try {
      const sheets = await this.getSheetsClient();
      // TODO: Implement actual spreadsheet update logic
      } catch (error) {
      }
  }

  /**
   * Log digest sent to spreadsheet
   */
  private async logDigestSent(
    spreadsheetId: string,
    sheetName: string,
    digest: WeeklyDigest
  ): Promise<void> {
    try {
      const sheets = await this.getSheetsClient();
      // TODO: Implement actual spreadsheet update logic
      } catch (error) {
      }
  }

  /**
   * Fetch event reminders from spreadsheet
   */
  async fetchEventReminders(
    spreadsheetId: string,
    sheetName: string
  ): Promise<EventReminder[]> {
    try {
      const sheets = await this.getSheetsClient();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      const headers = rows[0];
      const reminders: EventReminder[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const reminder: EventReminder = {
          eventId: row[headers.indexOf('Event ID')] || '',
          eventName: row[headers.indexOf('Event Name')] || '',
          eventDate: new Date(row[headers.indexOf('Event Date')] || ''),
          eventLocation: row[headers.indexOf('Location')] || undefined,
          participants: (row[headers.indexOf('Participants')] || '').split(',').map((p: string) => p.trim()),
          reminderDaysBefore: (row[headers.indexOf('Reminder Days')] || '7,3,1').split(',').map((d: string) => parseInt(d.trim())),
          sentReminders: (row[headers.indexOf('Sent Reminders')] || '').split(',').map((d: string) => parseInt(d.trim())).filter((d: number) => !isNaN(d)),
        };
        reminders.push(reminder);
      }

      return reminders;
    } catch (error) {
      return [];
    }
  }

  /**
   * Fetch birthday wishes from spreadsheet
   */
  async fetchBirthdayWishes(
    spreadsheetId: string,
    sheetName: string
  ): Promise<BirthdayWish[]> {
    try {
      const sheets = await this.getSheetsClient();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      const headers = rows[0];
      const wishes: BirthdayWish[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const wish: BirthdayWish = {
          memberId: row[headers.indexOf('Member ID')] || '',
          memberName: row[headers.indexOf('Name')] || '',
          memberEmail: row[headers.indexOf('Email')] || '',
          birthDate: new Date(row[headers.indexOf('Birth Date')] || ''),
          message: row[headers.indexOf('Message')] || undefined,
          sent: row[headers.indexOf('Sent')] === 'TRUE',
          sentDate: row[headers.indexOf('Sent Date')] ? new Date(row[headers.indexOf('Sent Date')]) : undefined,
        };
        wishes.push(wish);
      }

      return wishes;
    } catch (error) {
      return [];
    }
  }

  /**
   * Fetch deadline notifications from spreadsheet
   */
  async fetchDeadlineNotifications(
    spreadsheetId: string,
    sheetName: string
  ): Promise<DeadlineNotification[]> {
    try {
      const sheets = await this.getSheetsClient();
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:Z`,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) return [];

      const headers = rows[0];
      const deadlines: DeadlineNotification[] = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const deadline: DeadlineNotification = {
          deadlineId: row[headers.indexOf('Deadline ID')] || '',
          deadlineName: row[headers.indexOf('Deadline Name')] || '',
          deadlineDate: new Date(row[headers.indexOf('Due Date')] || ''),
          assignees: (row[headers.indexOf('Assignees')] || '').split(',').map((a: string) => a.trim()),
          reminderDaysBefore: (row[headers.indexOf('Reminder Days')] || '7,3,1').split(',').map((d: string) => parseInt(d.trim())),
          sentReminders: (row[headers.indexOf('Sent Reminders')] || '').split(',').map((d: string) => parseInt(d.trim())).filter((d: number) => !isNaN(d)),
        };
        deadlines.push(deadline);
      }

      return deadlines;
    } catch (error) {
      return [];
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Export class for testing
export { NotificationService };
