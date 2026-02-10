'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleSheetsService } from '@/lib/google-sheets/google-sheets.service';
import { SpreadsheetEditor } from '@/components/admin/SpreadsheetEditor';
import { PublishButton } from '@/components/admin/PublishButton';
import { TemplateBuilder } from '@/components/admin/TemplateBuilder';
import { ReportGenerator } from '@/components/admin/ReportGenerator';

/**
 * PPSDM KMITS Admin Panel - Spreadsheet Editor
 * =============================================
 * Live spreadsheet interface untuk mengelola konten website
 */

interface SheetData {
  spreadsheetId: string;
  sheetName: string;
  headers: string[];
  rows: any[][];
  metadata?: any;
}

interface PublishStatus {
  isPublishing: boolean;
  lastPublished: Date | null;
  version: number;
  message: string;
}

export default function SpreadsheetEditorPage() {
  const [activeTab, setActiveTab] = useState<'editor' | 'template' | 'report'>('editor');
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>({
    isPublishing: false,
    lastPublished: null,
    version: 1,
    message: '',
  });
  const [selectedRange, setSelectedRange] = useState<string>('A1:Z100');

  const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM';

  // Fetch sheet data
  const fetchSheetData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sheetsService = GoogleSheetsService.getInstance();
      const metadata = await sheetsService.getSpreadsheetMetadata(spreadsheetId);
      const sheets = await sheetsService.getSheets(spreadsheetId);
      
      if (sheets.length === 0) {
        throw new Error('No sheets found in spreadsheet');
      }

      const firstSheet = sheets[0];
      const sheetName = firstSheet.properties?.title || 'Sheet1';
      const range = `${sheetName}!A1:Z100`;
      
      const values = await sheetsService.getSheetData(spreadsheetId, range);
      
      setSheetData({
        spreadsheetId,
        sheetName,
        headers: values.length > 0 ? Object.keys(values[0]) : [],
        rows: values.map(row => Object.values(row)),
        metadata,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sheet data');
      console.error('Error fetching sheet data:', err);
    } finally {
      setLoading(false);
    }
  }, [spreadsheetId]);

  useEffect(() => {
    fetchSheetData();
  }, [fetchSheetData]);

  // Handle publish
  const handlePublish = async (options: {
    notifyMembers?: boolean;
    createBackup?: boolean;
  }) => {
    setPublishStatus(prev => ({
      ...prev,
      isPublishing: true,
      message: 'Publishing to website...',
    }));

    try {
      // Call publish API
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheetId,
          sheetName: sheetData?.sheetName,
          ...options,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPublishStatus(prev => ({
          ...prev,
          isPublishing: false,
          lastPublished: new Date(),
          version: prev.version + 1,
          message: '✅ Successfully published to website!',
        }));
      } else {
        throw new Error(result.error || 'Publish failed');
      }
    } catch (err) {
      setPublishStatus(prev => ({
        ...prev,
        isPublishing: false,
        message: `❌ Publish failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      }));
    }
  };

  // Handle data update
  const handleDataUpdate = async (updates: any[][]) => {
    try {
      const sheetsService = GoogleSheetsService.getInstance();
      const range = `${sheetData?.sheetName}!A1:Z${updates.length}`;
      
      await sheetsService.updateSheetData(spreadsheetId, range, updates);
      
      // Refresh data
      await fetchSheetData();
    } catch (err) {
      console.error('Error updating sheet data:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Spreadsheet Editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Spreadsheet</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchSheetData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">📊</span>
                PPSDM KMITS Admin Panel
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Live Spreadsheet Editor • {sheetData?.sheetName}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <PublishButton
                isPublishing={publishStatus.isPublishing}
                lastPublished={publishStatus.lastPublished}
                version={publishStatus.version}
                onPublish={handlePublish}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Publish Status Banner */}
      {publishStatus.message && (
        <div className={`max-w-7xl mx-auto px-6 py-3 ${
          publishStatus.message.includes('✅') 
            ? 'bg-green-900/20 border-b border-green-500/30' 
            : 'bg-red-900/20 border-b border-red-500/30'
        }`}>
          <p className="text-white text-sm">{publishStatus.message}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex gap-2 bg-slate-800/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            📝 Spreadsheet Editor
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'template'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            🎨 Template Builder
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'report'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            📊 Report Generator
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'editor' && sheetData && (
          <SpreadsheetEditor
            data={sheetData}
            onUpdate={handleDataUpdate}
            onRefresh={fetchSheetData}
          />
        )}
        
        {activeTab === 'template' && sheetData && (
          <TemplateBuilder
            headers={sheetData.headers}
            spreadsheetId={spreadsheetId}
            sheetName={sheetData.sheetName}
          />
        )}
        
        {activeTab === 'report' && sheetData && (
          <ReportGenerator
            headers={sheetData.headers}
            rows={sheetData.rows}
            spreadsheetId={spreadsheetId}
            sheetName={sheetData.sheetName}
          />
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-500 text-sm">
        <p>Auto-sync enabled • Changes saved automatically • Version {publishStatus.version}</p>
      </div>
    </div>
  );
}
