import { GoogleSheetsService } from '../google-sheets/google-sheets.service';
import { SheetParserEngine } from '../google-sheets/sheet-parser-engine';

/**
 * Dynamic Page Generator
 * Generates website pages automatically from spreadsheet data
 */
export class DynamicPageGenerator {
  private sheetsService: GoogleSheetsService | null = null;
  private parserEngine: SheetParserEngine;
  private pageRules: Record<string, any>;

  constructor() {
    this.parserEngine = new SheetParserEngine();

    // Define page generation rules
    this.pageRules = {
      '/assessment': {
        dataSource: 'assessments',
        template: 'AssessmentPage',
        refreshInterval: 'daily'
      },
      '/activities': {
        dataSource: 'activities',
        template: 'ActivitiesPage',
        refreshInterval: 'realtime'
      },
      '/transparency': {
        dataSource: ['activities', 'finances'],
        template: 'TransparencyDashboard',
        refreshInterval: 'hourly'
      },
      '/members': {
        dataSource: 'members',
        template: 'DirectoryPage',
        refreshInterval: 'weekly'
      },
      '/knowledge': {
        dataSource: 'knowledge',
        template: 'LearningHub',
        refreshInterval: 'daily'
      },
      '/projects': {
        dataSource: 'projects',
        template: 'ProjectsPage',
        refreshInterval: 'daily'
      }
    };
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
   * Generate all website pages from spreadsheet data
   */
  async generateAllPages(): Promise<void> {
    await this.initialize();

    for (const [route, rule] of Object.entries(this.pageRules)) {
      try {
        await this.generatePage(route, rule);
      } catch (error) {
      }
    }
  }

  /**
   * Generate a specific page
   */
  async generatePage(route: string, rule: any): Promise<void> {
    // Fetch and process data
    const data = await this.fetchAndProcessData(rule.dataSource);

    // Apply template
    const html = await this.applyTemplate(rule.template, data);

    // Update website page
    await this.updateWebsitePage(route, html);
  }

  /**
   * Fetch and process data from spreadsheet(s)
   */
  private async fetchAndProcessData(dataSource: string | string[]): Promise<any> {
    const sources = Array.isArray(dataSource) ? dataSource : [dataSource];
    const results: Record<string, any> = {};

    for (const source of sources) {
      // Fetch and parse data from Google Sheets
      const rawData = await this.parserEngine.parseSheetData(
        process.env.SPREADSHEET_ID!,
        source
      );

      // Validate and transform data
      const validatedData = this.parserEngine.transformDataForWebsite(rawData, source);

      // Generate statistics and insights
      const analytics = this.generateAnalytics(validatedData, source);

      results[source] = {
        data: validatedData,
        analytics,
        lastUpdated: new Date().toISOString()
      };
    }

    return results;
  }

  /**
   * Generate analytics for processed data
   */
  private generateAnalytics(data: any[], dataSource: string): any {
    switch (dataSource) {
      case 'activities':
        return this.generateActivityAnalytics(data);
      case 'members':
        return this.generateMemberAnalytics(data);
      case 'finances':
        return this.generateFinancialAnalytics(data);
      case 'assessments':
        return this.generateAssessmentAnalytics(data);
      case 'knowledge':
        return this.generateKnowledgeAnalytics(data);
      case 'projects':
        return this.generateProjectAnalytics(data);
      default:
        return {};
    }
  }

  /**
   * Generate activity analytics
   */
  private generateActivityAnalytics(data: any[]): any {
    const totalActivities = data.length;
    const completedActivities = data.filter(item => item.Status === 'Completed').length;
    const activeActivities = data.filter(item => item.Status === 'Active').length;
    const planningActivities = data.filter(item => item.Status === 'Planning').length;

    const totalBudget = data.reduce((sum, item) => sum + (item.Budget_Allocated || 0), 0);
    const totalSpent = data.reduce((sum, item) => sum + (item.Budget_Used || 0), 0);

    const averageParticipants = data.reduce((sum, item) => {
      const participants = item.Participants_List || [];
      return sum + participants.length;
    }, 0) / totalActivities;

    return {
      totalActivities,
      completedActivities,
      activeActivities,
      planningActivities,
      totalBudget,
      totalSpent,
      averageParticipants: Math.round(averageParticipants),
      budgetUtilization: (totalSpent / totalBudget) * 100
    };
  }

  /**
   * Generate member analytics
   */
  private generateMemberAnalytics(data: any[]): any {
    const totalMembers = data.length;
    const activeMembers = data.filter(item => item.Status === 'Active').length;
    const alumni = data.filter(item => item.Status === 'Alumni').length;

    const yearDistribution: Record<number, number> = {};
    data.forEach(item => {
      const year = item.Year;
      if (year) {
        yearDistribution[year] = (yearDistribution[year] || 0) + 1;
      }
    });

    const departmentDistribution: Record<string, number> = {};
    data.forEach(item => {
      const dept = item.Department;
      if (dept) {
        departmentDistribution[dept] = (departmentDistribution[dept] || 0) + 1;
      }
    });

    return {
      totalMembers,
      activeMembers,
      alumni,
      activeRate: (activeMembers / totalMembers) * 100,
      yearDistribution,
      departmentDistribution
    };
  }

  /**
   * Generate financial analytics
   */
  private generateFinancialAnalytics(data: any[]): any {
    const totalIncome = data
      .filter(item => item.Category === 'Income')
      .reduce((sum, item) => sum + (item.Amount || 0), 0);

    const totalExpense = data
      .filter(item => item.Category !== 'Income')
      .reduce((sum, item) => sum + (item.Amount || 0), 0);

    const balance = totalIncome - totalExpense;

    const categoryBreakdown: Record<string, number> = {};
    data.forEach(item => {
      const category = item.Category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + (item.Amount || 0);
    });

    return {
      totalIncome,
      totalExpense,
      balance,
      categoryBreakdown
    };
  }

  /**
   * Generate assessment analytics
   */
  private generateAssessmentAnalytics(data: any[]): any {
    const totalQuestions = data.length;
    const activeQuestions = data.filter(item => item.Status === 'Active').length;

    const questionTypeDistribution: Record<string, number> = {};
    data.forEach(item => {
      const type = item.Question_Type;
      questionTypeDistribution[type] = (questionTypeDistribution[type] || 0) + 1;
    });

    const dimensionDistribution: Record<string, number> = {};
    data.forEach(item => {
      const dimension = item.Dimension_ID.split('-')[0];
      dimensionDistribution[dimension] = (dimensionDistribution[dimension] || 0) + 1;
    });

    return {
      totalQuestions,
      activeQuestions,
      questionTypeDistribution,
      dimensionDistribution
    };
  }

  /**
   * Generate knowledge repository analytics
   */
  private generateKnowledgeAnalytics(data: any[]): any {
    const totalResources = data.length;

    const typeDistribution: Record<string, number> = {};
    data.forEach(item => {
      const type = item.Type;
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    const categoryDistribution: Record<string, number> = {};
    data.forEach(item => {
      const category = item.Category;
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
    });

    const averageRating = data.reduce((sum, item) => sum + (item.Rating || 0), 0) / totalResources;

    return {
      totalResources,
      typeDistribution,
      categoryDistribution,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalDownloads: data.reduce((sum, item) => sum + (item.Downloads || 0), 0)
    };
  }

  /**
   * Generate project analytics
   */
  private generateProjectAnalytics(data: any[]): any {
    const totalProjects = data.length;
    const completedProjects = data.filter(item => item.Status === 'Completed').length;
    const activeProjects = data.filter(item => item.Status === 'Active').length;

    const totalBudget = data.reduce((sum, item) => sum + (item.Budget || 0), 0);

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      totalBudget
    };
  }

  /**
   * Apply template to data
   */
  private async applyTemplate(template: string, data: any): Promise<string> {
    // In real implementation, this would use a template engine
    // For now, we'll return a simple HTML structure for demonstration
    return `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template} - PPSDM KMITS</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
          }
          .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .data-card {
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 8px;
            background: #fafafa;
          }
          .data-card h2 {
            margin-top: 0;
            color: #555;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 20px;
          }
          .stat {
            text-align: center;
            padding: 10px;
            background: #e3f2fd;
            border-radius: 8px;
          }
          .stat .value {
            font-size: 24px;
            font-weight: bold;
            color: #1976d2;
          }
          .stat .label {
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${template}</h1>
          <div class="stats">
            ${this.renderStats(data)}
          </div>
          <div class="data-grid">
            ${this.renderDataCards(data)}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Render statistics
   */
  private renderStats(data: any): string {
    let statsHtml = '';

    Object.entries(data).forEach(([source, content]: [string, any]) => {
      const analytics = content.analytics;

      Object.entries(analytics).forEach(([key, value]) => {
        if (typeof value === 'number') {
          const label = key.split(/(?=[A-Z])/).join(' ');
          statsHtml += `
            <div class="stat">
              <div class="value">${value.toLocaleString()}</div>
              <div class="label">${label}</div>
            </div>
          `;
        }
      });
    });

    return statsHtml;
  }

  /**
   * Render data cards
   */
  private renderDataCards(data: any): string {
    let cardsHtml = '';

    Object.entries(data).forEach(([source, content]: [string, any]) => {
      content.data.slice(0, 5).forEach((item: any) => {
        cardsHtml += `
          <div class="data-card">
            <h2>${item.name || item.title || item.Activity_Name || item.Full_Name}</h2>
            ${this.renderItemDetails(item)}
          </div>
        `;
      });
    });

    return cardsHtml;
  }

  /**
   * Render item details
   */
  private renderItemDetails(item: any): string {
    let detailsHtml = '';

    Object.entries(item).forEach(([key, value]) => {
      if (typeof value !== 'object' && key !== 'name' && key !== 'title' && key !== 'Activity_Name' && key !== 'Full_Name') {
        const label = key.split(/(?=[A-Z])/).join(' ');
        detailsHtml += `<p><strong>${label}:</strong> ${value}</p>`;
      }
    });

    return detailsHtml;
  }

  /**
   * Update website page
   */
  private async updateWebsitePage(route: string, html: string): Promise<void> {
    // In real implementation, this would update the website pages
    // For now, we'll just log the update
    // TODO: Implement actual page update logic
    // This could be writing to a static file, updating a CMS, or calling an API
  }

  /**
   * Get page rules
   */
  getPageRules(): Record<string, any> {
    return this.pageRules;
  }

  /**
   * Regenerate a specific page by route
   */
  async regeneratePageByRoute(route: string): Promise<void> {
    if (this.pageRules[route]) {
      await this.generatePage(route, this.pageRules[route]);
    } else {
      throw new Error(`Route ${route} not configured`);
    }
  }

  /**
   * Set refresh interval for a specific page
   */
  setRefreshInterval(route: string, interval: string): void {
    if (this.pageRules[route]) {
      this.pageRules[route].refreshInterval = interval;
    }
  }
}
