/**
 * Upstash QStash Queue Integration
 * 
 * Background job processing with QStash
 * Token: f76d6a1b-493a-4c61-9e38-d953219e265d
 */

import { Client as QStashClient } from '@upstash/qstash';

// Initialize QStash client
const qstash = new QStashClient({
  token: process.env.UPSTASH_QSTASH_TOKEN || '',
});

export interface QueueMessage {
  id: string;
  type: JobType;
  payload: Record<string, unknown>;
  priority?: number;
  retries?: number;
  delay?: number;
}

export type JobType =
  | 'process_book'
  | 'generate_content'
  | 'create_assessment'
  | 'sync_drive'
  | 'scrape_website'
  | 'send_notification'
  | 'cleanup';

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
  attempts: number;
}

/**
 * Enqueue a book for processing
 */
export async function enqueueBookProcessing(
  bookId: string,
  options?: {
    priority?: number;
    delay?: number;
    bookTitle?: string;
  }
): Promise<{ messageId: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const result = await qstash.publishJSON({
    url: `${baseUrl}/api/process-book`,
    body: {
      bookId,
      bookTitle: options?.bookTitle,
      priority: options?.priority || 5,
    },
    delay: options?.delay,
    retries: 3,
  });

  console.log(`Enqueued book ${bookId} for processing, messageId: ${result.messageId}`);

  return { messageId: result.messageId };
}

/**
 * Enqueue content generation job
 */
export async function enqueueContentGeneration(
  bookId: string,
  moduleId: string,
  contentType: 'summary' | 'deep_dive' | 'quiz' | 'assessment',
  options?: {
    priority?: number;
    delay?: number;
  }
): Promise<{ messageId: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const result = await qstash.publishJSON({
    url: `${baseUrl}/api/generate-content`,
    body: {
      bookId,
      moduleId,
      contentType,
      priority: options?.priority || 3,
    },
    delay: options?.delay,
    retries: 3,
  });

  return { messageId: result.messageId };
}

/**
 * Enqueue Drive sync job
 */
export async function enqueueDriveSync(
  folderId?: string,
  options?: {
    priority?: number;
    delay?: number;
  }
): Promise<{ messageId: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const result = await qstash.publishJSON({
    url: `${baseUrl}/api/sync-drive`,
    body: {
      folderId: folderId || process.env.GOOGLE_DRIVE_FOLDER_ID,
      priority: options?.priority || 2,
    },
    delay: options?.delay,
    retries: 2,
  });

  return { messageId: result.messageId };
}

/**
 * Enqueue a batch of books for processing
 */
export async function enqueueBatchProcessing(
  bookIds: string[],
  options?: {
    batchSize?: number;
    delayBetween?: number;
  }
): Promise<{ messageIds: string[] }> {
  const messageIds: string[] = [];
  const batchSize = options?.batchSize || 10;
  const delayBetween = options?.delayBetween || 1000; // 1 second

  for (let i = 0; i < bookIds.length; i += batchSize) {
    const batch = bookIds.slice(i, i + batchSize);

    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map((bookId, index) =>
        enqueueBookProcessing(bookId, {
          priority: 5,
          delay: (i + index) * delayBetween,
        })
      )
    );

    messageIds.push(...batchResults.map(r => r.messageId));
  }

  console.log(`Enqueued ${bookIds.length} books in batches, total messages: ${messageIds.length}`);

  return { messageIds };
}

/**
 * Schedule a recurring job
 */
export async function scheduleRecurringJob(
  jobType: JobType,
  cronExpression: string,
  payload?: Record<string, unknown>
): Promise<{ scheduleId: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const result = await qstash.schedules.create({
    destination: `${baseUrl}/api/jobs/${jobType}`,
    cron: cronExpression,
    body: JSON.stringify(payload || {}),
  });

  console.log(`Scheduled recurring job ${jobType} with cron: ${cronExpression}`);

  return { scheduleId: result.scheduleId };
}

/**
 * Delete a scheduled job
 */
export async function deleteScheduledJob(scheduleId: string): Promise<void> {
  await qstash.schedules.delete(scheduleId);
  console.log(`Deleted scheduled job: ${scheduleId}`);
}

/**
 * List all scheduled jobs
 */
export async function listScheduledJobs(): Promise<
  Array<{
    scheduleId: string;
    destination: string;
    cron: string;
    createdAt: number;
  }>
> {
  const schedules = await qstash.schedules.list();

  return schedules.map(schedule => ({
    scheduleId: schedule.scheduleId,
    destination: schedule.destination,
    cron: schedule.cron || 'N/A',
    createdAt: schedule.createdAt,
  }));
}

// Export default
const queue = {
  enqueueBook: enqueueBookProcessing,
  enqueueContent: enqueueContentGeneration,
  enqueueDriveSync,
  enqueueBatch: enqueueBatchProcessing,
  scheduleRecurring: scheduleRecurringJob,
  deleteSchedule: deleteScheduledJob,
  listSchedules: listScheduledJobs,
  qstash,
};

export default queue;
