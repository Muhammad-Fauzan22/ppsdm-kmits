import { GoogleSheetsService } from '../google-sheets/google-sheets.service';
import { DynamicPageGenerator } from '../website-generator/dynamic-page-generator';

/**
 * Real-Time Sync Engine
 * Detects spreadsheet changes and automatically updates the website
 */
export class RealTimeSyncEngine {
  private sheetsService: GoogleSheetsService | null = null;
  private pageGenerator: DynamicPageGenerator;
  private watchedSheets: Map<string, any>;
  private syncIntervals: Map<string, NodeJS.Timeout>;

  constructor() {
    this.pageGenerator = new DynamicPageGenerator();
    this.watchedSheets = new Map();
    this.syncIntervals = new Map();
    this.setupGoogleSheetsWebhook();
    this.setupPeriodicSync();
  }

  /**
   * Initialize the service
   */
  private async initialize(): Promise<void> {
    if (!this.sheetsService) {
      this.sheetsService = await GoogleSheetsService.getInstance();
    }
  }

  /**
   * Setup Google Sheets webhook for real-time change detection
   */
  private setupGoogleSheetsWebhook(): void {
    // In a real implementation, this would register a webhook with Google Sheets API
    // to receive notifications when the spreadsheet changes
    
    // For now, we'll simulate webhook setup with periodic checking
    }

  /**
   * Setup periodic sync based on page rules
   */
  private setupPeriodicSync(): void {
    const pageRules = this.pageGenerator.getPageRules();
    
    Object.entries(pageRules).forEach(([route, rule]) => {
      const interval = this.getIntervalDuration(rule.refreshInterval);
      
      if (interval > 0) {
        const syncInterval = setInterval(async () => {
          try {
            await this.pageGenerator.regeneratePageByRoute(route);
            } catch (error) {
            }
        }, interval);
        
        this.syncIntervals.set(route, syncInterval);
      }
    });

    }

  /**
   * Get interval duration in milliseconds
   */
  private getIntervalDuration(interval: string): number {
    switch (interval.toLowerCase()) {
      case 'realtime':
        return 30000; // 30 seconds
      case 'hourly':
        return 3600000; // 1 hour
      case 'daily':
        return 86400000; // 24 hours
      case 'weekly':
        return 604800000; // 7 days
      default:
        return 3600000; // Default to 1 hour
    }
  }

  /**
   * Handle spreadsheet change event
   */
  async onSpreadsheetChange(changeEvent: any): Promise<void> {
    const { spreadsheetId, sheetName, changes } = changeEvent;
    
    // Determine which website pages need update based on sheet name
    const pagesToUpdate = this.mapSheetToPages(sheetName);
    
    // Regenerate affected pages
    for (const route of pagesToUpdate) {
      try {
        await this.pageGenerator.regeneratePageByRoute(route);
        await this.sendChangeNotifications(route, sheetName, changes);
        } catch (error) {
        }
    }
  }

  /**
   * Map sheet name to affected pages
   */
  private mapSheetToPages(sheetName: string): string[] {
    const mapping: Record<string, string[]> = {
      'Activities': ['/activities', '/transparency'],
      'Members': ['/members'],
      'Finances': ['/transparency'],
      'Assessments': ['/assessment'],
      'Knowledge': ['/knowledge'],
      'Projects': ['/projects']
    };
    
    return mapping[sheetName] || [];
  }

  /**
   * Send notifications about changes
   */
  private async sendChangeNotifications(route: string, sheetName: string, changes: any): Promise<void> {
    // In a real implementation, this would send:
    // 1. Email notifications to admin users
    // 2. Push notifications to members
    // 3. Slack/WhatsApp notifications to committee
    
    // TODO: Implement actual notification system
  }

  /**
   * Watch a specific sheet for changes
   */
  watchSheet(spreadsheetId: string, sheetName: string): void {
    if (!this.watchedSheets.has(spreadsheetId)) {
      this.watchedSheets.set(spreadsheetId, new Set());
    }
    
    const sheets = this.watchedSheets.get(spreadsheetId);
    if (!sheets.has(sheetName)) {
      sheets.add(sheetName);
      }
  }

  /**
   * Unwatch a specific sheet
   */
  unwatchSheet(spreadsheetId: string, sheetName: string): void {
    if (this.watchedSheets.has(spreadsheetId)) {
      const sheets = this.watchedSheets.get(spreadsheetId);
      if (sheets.has(sheetName)) {
        sheets.delete(sheetName);
        }
    }
  }

  /**
   * Get watched sheets information
   */
  getWatchedSheets(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    this.watchedSheets.forEach((sheets, spreadsheetId) => {
      result[spreadsheetId] = Array.from(sheets);
    });
    return result;
  }

  /**
   * Stop all sync intervals
   */
  stopSync(): void {
    this.syncIntervals.forEach((interval, route) => {
      clearInterval(interval);
      });
    this.syncIntervals.clear();
  }

  /**
   * Start all sync intervals
   */
  startSync(): void {
    this.setupPeriodicSync();
  }

  /**
   * Check for changes in all watched sheets
   */
  async checkForChanges(): Promise<void> {
    const watchedSheets = this.getWatchedSheets();
    
    for (const [spreadsheetId, sheetNames] of Object.entries(watchedSheets)) {
      for (const sheetName of sheetNames) {
        try {
          const changes = await this.detectChanges(spreadsheetId, sheetName);
          
          if (changes.length > 0) {
            await this.onSpreadsheetChange({
              spreadsheetId,
              sheetName,
              changes
            });
          }
        } catch (error) {
          }
      }
    }
  }

  /**
   * Detect changes in a specific sheet
   */
  private async detectChanges(spreadsheetId: string, sheetName: string): Promise<any[]> {
    // In a real implementation, this would compare current data with stored version
    // using checksums or last modified timestamps
    
    // For now, we'll just return a dummy change
    return [
      {
        type: 'update',
        timestamp: new Date().toISOString(),
        description: 'Sheet content updated'
      }
    ];
  }

  /**
   * Manually trigger a sync for all pages
   */
  async triggerFullSync(): Promise<void> {
    try {
      await this.pageGenerator.generateAllPages();
      } catch (error) {
      throw new Error('Full sync failed');
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus(): any {
    const intervalStatus: Record<string, any> = {};
    
    this.syncIntervals.forEach((interval, route) => {
      const rule = this.pageGenerator.getPageRules()[route];
      intervalStatus[route] = {
        interval: rule.refreshInterval,
        isActive: true
      };
    });
    
    return {
      watchedSheets: this.getWatchedSheets(),
      syncIntervals: intervalStatus,
      lastSyncTime: new Date().toISOString()
    };
  }
}
