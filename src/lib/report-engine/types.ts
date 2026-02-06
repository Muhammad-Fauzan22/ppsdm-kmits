
export type ReportFormat = 'pdf' | 'docx' | 'excel' | 'html';
export type ReportType = 'cognitive' | 'financial' | 'holistic' | 'custom';

export interface AssessmentScore {
    dimension: string;
    score: number;
    maxScore: number;
    percentage: number;
    level: 'excellent' | 'good' | 'average' | 'needs-improvement';
    description: string;
}

export interface ReportData {
    reportType: ReportType;
    assessmentId: string;
    userId: string;
    userName: string;
    userEmail: string;
    generatedAt: Date;
    timeframe?: {
        startDate: Date;
        endDate: Date;
    };
    overallScore?: number;
    scores?: Record<string, AssessmentScore>;
    strengths?: string[];
    areasForImprovement?: string[];
    recommendations?: string[];
    [key: string]: any; // Allow flexibility for specific report types
}

export interface GenerateOptions {
    format?: ReportFormat;
    watermark?: boolean;
    passwordProtected?: boolean;
    branding?: 'its' | 'kmm' | 'custom';
    customBranding?: {
        logo?: string;
        colors?: {
            primary: string;
            secondary: string;
        };
    };
    includeCharts?: boolean;
    includeRecommendations?: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface ReportResponse {
    success: boolean;
    data: {
        reportId: string;
        buffer: Buffer;
        fileName: string;
        fileSize: number;
        mimeType: string;
        generatedAt: string;
    };
    metadata: {
        generationTime: number;
        reportType: string;
        format: ReportFormat;
        templateVersion: string;
        dataPoints: number;
    };
}

export interface ReportGenerationResult {
    success: boolean;
    data: {
        reportId: string;
        downloadUrl: string;
        previewUrl?: string;
        fileSize: number;
        generatedAt: Date;
        expiresAt?: Date;
    };
}

export interface IReportEngine {
    generate(data: ReportData, options: GenerateOptions): Promise<Buffer>;
    validate(data: ReportData): ValidationResult;
    getSupportedFormats(): ReportFormat[];
}