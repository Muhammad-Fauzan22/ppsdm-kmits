import { GoogleSheetsService } from './google-sheets.service';

/**
 * Sheet Parser Engine
 * Handles parsing and validation of spreadsheet data
 */
export class SheetParserEngine {
  private sheetsService: GoogleSheetsService;
  private validationRules: Record<string, any>;

  constructor() {
    this.sheetsService = GoogleSheetsService.getInstance();
    this.validationRules = this.getDefaultValidationRules();
  }

  /**
   * Get default validation rules for each sheet type
   */
  private getDefaultValidationRules() {
    return {
      activities: {
        Activity_ID: {
          type: 'string',
          required: true,
          pattern: /^ACT-\d{4}-\d{3}$/
        },
        Activity_Name: {
          type: 'string',
          required: true,
          minLength: 3
        },
        Date_Time: {
          type: 'datetime',
          format: 'YYYY-MM-DD HH:mm',
          required: true
        },
        Location: {
          type: 'string',
          required: true
        },
        Organizer: {
          type: 'string',
          required: true
        },
        Participants_List: {
          type: 'list',
          separator: '|',
          maxItems: 50
        },
        Budget_Allocated: {
          type: 'number',
          min: 0,
          max: 10000000,
          required: true
        },
        Budget_Used: {
          type: 'number',
          min: 0,
          max: 10000000,
          required: true
        },
        Status: {
          type: 'string',
          required: true,
          allowedValues: ['Planning', 'Active', 'Completed', 'Cancelled']
        }
      },
      members: {
        NIM: {
          type: 'string',
          required: true,
          pattern: /^\d{10}$/,
          unique: true
        },
        Full_Name: {
          type: 'string',
          required: true
        },
        Email: {
          type: 'email',
          domain: 'student.its.ac.id',
          required: true
        },
        Year: {
          type: 'number',
          min: 2000,
          max: new Date().getFullYear() + 4
        },
        Department: {
          type: 'string',
          required: true
        },
        Position: {
          type: 'string',
          allowedValues: ['Anggota Biasa', 'Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara']
        },
        Status: {
          type: 'string',
          allowedValues: ['Active', 'Inactive', 'Alumni']
        }
      },
      finances: {
        Transaction_ID: {
          type: 'string',
          required: true,
          pattern: /^TRX-\d{4}-\d{3}$/
        },
        Date: {
          type: 'date',
          format: 'YYYY-MM-DD',
          required: true
        },
        Description: {
          type: 'string',
          required: true
        },
        Category: {
          type: 'string',
          required: true,
          allowedValues: ['Income', 'Operational', 'Event', 'Asset', 'Other']
        },
        Amount: {
          type: 'number',
          required: true
        },
        Payment_Method: {
          type: 'string',
          allowedValues: ['Transfer', 'Cash', 'Credit Card', 'Other']
        },
        Verified: {
          type: 'boolean',
          required: true
        }
      },
      assessments: {
        Dimension_ID: {
          type: 'string',
          required: true,
          pattern: /^[A-Z]{3}-\d{2}$/
        },
        Dimension_Name: {
          type: 'string',
          required: true
        },
        Question_Text: {
          type: 'string',
          required: true
        },
        Question_Type: {
          type: 'string',
          required: true,
          allowedValues: ['likert_5', 'multiple_choice', 'open_ended']
        },
        Weight: {
          type: 'number',
          min: 0.1,
          max: 5,
          required: true
        },
        Status: {
          type: 'string',
          allowedValues: ['Active', 'Inactive']
        }
      },
      knowledge: {
        Resource_ID: {
          type: 'string',
          required: true,
          pattern: /^RES-\d{3}$/
        },
        Title: {
          type: 'string',
          required: true
        },
        Type: {
          type: 'string',
          required: true,
          allowedValues: ['Video Tutorial', 'PDF', 'Article', 'Presentation']
        },
        Category: {
          type: 'string',
          required: true
        },
        Difficulty: {
          type: 'string',
          allowedValues: ['Beginner', 'Intermediate', 'Advanced']
        },
        Rating: {
          type: 'number',
          min: 0,
          max: 5
        }
      }
    };
  }

  /**
   * Parse and validate data from a specific sheet
   */
  async parseSheetData(spreadsheetId: string, sheetName: string): Promise<any[]> {
    const rawData = await this.sheetsService.getSheetData(spreadsheetId, sheetName);
    const rules = this.validationRules[sheetName.toLowerCase()] || {};
    
    return rawData.map((item, index) => {
      const validatedItem: any = {};
      const errors: string[] = [];

      // Validate each field
      Object.entries(rules).forEach(([field, rule]) => {
        const value = item[field];
        
        // Check required field
        if (rule.required && (!value || value === '')) {
          errors.push(`Field ${field} is required`);
          return;
        }

        // Skip validation if field is optional and empty
        if (!rule.required && (!value || value === '')) {
          return;
        }

        // Type validation
        if (!this.validateType(value, rule.type)) {
          errors.push(`Field ${field} must be of type ${rule.type}`);
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`Field ${field} does not match required format`);
        }

        // Range validation
        if (rule.min !== undefined && value < rule.min) {
          errors.push(`Field ${field} must be at least ${rule.min}`);
        }

        if (rule.max !== undefined && value > rule.max) {
          errors.push(`Field ${field} must be at most ${rule.max}`);
        }

        // Allowed values validation
        if (rule.allowedValues && !rule.allowedValues.includes(value)) {
          errors.push(`Field ${field} must be one of: ${rule.allowedValues.join(', ')}`);
        }

        validatedItem[field] = value;
      });

      return {
        ...validatedItem,
        _rawIndex: index,
        _validationErrors: errors,
        _isValid: errors.length === 0
      };
    });
  }

  /**
   * Validate data type
   */
  private validateType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return !isNaN(Number(value));
      case 'boolean':
        const boolVal = String(value).toLowerCase();
        return ['true', 'false', '1', '0', 'yes', 'no'].includes(boolVal);
      case 'date':
        return !isNaN(Date.parse(value));
      case 'datetime':
        return !isNaN(Date.parse(value));
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      case 'list':
        return typeof value === 'string';
      default:
        return true;
    }
  }

  /**
   * Clean and transform data for website usage
   */
  transformDataForWebsite(data: any[], sheetName: string): any[] {
    return data.map(item => {
      const transformed: any = {};

      Object.keys(item).forEach(key => {
        if (!key.startsWith('_')) {
          const value = item[key];
          
          // Transform common field types
          switch (key) {
            case 'Budget_Allocated':
            case 'Budget_Used':
            case 'Amount':
              transformed[key] = parseFloat(value) || 0;
              break;
            case 'Date':
            case 'Date_Time':
            case 'Last_Updated':
              transformed[key] = new Date(value).toISOString();
              break;
            case 'Verified':
            case 'Active':
              transformed[key] = ['true', '1', 'yes'].includes(String(value).toLowerCase());
              break;
            case 'Participants_List':
            case 'Skills':
            case 'Projects':
              if (typeof value === 'string' && value) {
                transformed[key] = value.split('|').map((item: string) => item.trim());
              } else {
                transformed[key] = [];
              }
              break;
            default:
              transformed[key] = value;
          }
        }
      });

      return transformed;
    }).filter(item => item._isValid);
  }

  /**
   * Get validation report for parsed data
   */
  getValidationReport(data: any[]): any {
    const totalRecords = data.length;
    const validRecords = data.filter(item => item._isValid).length;
    const invalidRecords = totalRecords - validRecords;

    const errorsByField: Record<string, number> = {};
    data.forEach(item => {
      item._validationErrors.forEach((error: string) => {
        const fieldMatch = error.match(/Field (.*?) is/);
        if (fieldMatch) {
          const field = fieldMatch[1];
          errorsByField[field] = (errorsByField[field] || 0) + 1;
        }
      });
    });

    return {
      totalRecords,
      validRecords,
      invalidRecords,
      errorsByField,
      detailedErrors: data
        .filter(item => !item._isValid)
        .map(item => ({
          index: item._rawIndex,
          errors: item._validationErrors
        }))
    };
  }

  /**
   * Auto-generate IDs for new records
   */
  generateId(prefix: string, existingIds: string[]): string {
    const year = new Date().getFullYear();
    let maxNumber = 0;

    existingIds.forEach(id => {
      const match = id.match(new RegExp(`${prefix}-${year}-(\\d+)`));
      if (match) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    return `${prefix}-${year}-${String(nextNumber).padStart(3, '0')}`;
  }
}
