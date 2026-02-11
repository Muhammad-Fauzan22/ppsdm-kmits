import { useState, useCallback } from 'react';
import { ReportFormat, GenerateOptions } from '@/lib/report-engine/types';

interface UseReportGeneratorReturn {
  generateReport: (
    reportType: string,
    format: ReportFormat,
    assessmentId: string,
    userId: string,
    options?: GenerateOptions
  ) => Promise<void>;
  generatePreview: (
    reportType: string,
    assessmentId: string,
    userId: string,
    options?: GenerateOptions
  ) => Promise<string>;
  isLoading: boolean;
  error: string | null;
  downloadUrl: string | null;
  previewHtml: string | null;
}

/**
 * Hook for report generation
 */
export function useReportGenerator(): UseReportGeneratorReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  /**
   * Generate report
   */
  const generateReport = useCallback(async (
    reportType: string,
    format: ReportFormat,
    assessmentId: string,
    userId: string,
    options: GenerateOptions = {}
  ) => {
    setIsLoading(true);
    setError(null);
    setDownloadUrl(null);

    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          format,
          assessmentId,
          userId,
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      // Create blob from response
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setDownloadUrl(url);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = response.headers.get('X-Report-Id') || `report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate preview
   */
  const generatePreview = useCallback(async (
    reportType: string,
    assessmentId: string,
    userId: string,
    options: GenerateOptions = {}
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    setPreviewHtml(null);

    try {
      const response = await fetch('/api/reports/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          assessmentId,
          userId,
          options,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate preview');
      }

      const html = await response.text();
      setPreviewHtml(html);
      
      return html;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateReport,
    generatePreview,
    isLoading,
    error,
    downloadUrl,
    previewHtml,
  };
}
