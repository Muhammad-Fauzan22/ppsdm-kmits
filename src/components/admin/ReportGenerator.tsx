'use client';

import React, { useState, useCallback } from 'react';

/**
 * Report Generator Component
 * ==========================
 * Automated report generator untuk PDF/PPT dari data spreadsheet
 */

export interface ReportGeneratorProps {
  headers: string[];
  rows: any[][];
  spreadsheetId: string;
  sheetName: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'pdf' | 'ppt' | 'excel';
  description: string;
  icon: string;
  config: any;
}

export interface ReportSchedule {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
}

// Available report templates
const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'summary',
    name: 'Summary Report',
    type: 'pdf',
    description: 'Overview of all data with key metrics',
    icon: '📊',
    config: {
      includeCharts: true,
      includeTables: true,
      includeSummary: true,
    },
  },
  {
    id: 'detailed',
    name: 'Detailed Report',
    type: 'pdf',
    description: 'Complete data export with all details',
    icon: '📋',
    config: {
      includeCharts: false,
      includeTables: true,
      includeSummary: false,
    },
  },
  {
    id: 'presentation',
    name: 'Presentation',
    type: 'ppt',
    description: 'Slide deck for meetings and presentations',
    icon: '📽️',
    config: {
      slidesPerRow: 5,
      includeCharts: true,
      theme: 'professional',
    },
  },
  {
    id: 'analytics',
    name: 'Analytics Report',
    type: 'pdf',
    description: 'Statistical analysis and insights',
    icon: '📈',
    config: {
      includeCharts: true,
      includeStatistics: true,
      includeTrends: true,
    },
  },
  {
    id: 'data-export',
    name: 'Data Export',
    type: 'excel',
    description: 'Raw data export in Excel format',
    icon: '📁',
    config: {
      format: 'xlsx',
      includeHeaders: true,
    },
  },
];

export function ReportGenerator({ headers, rows, spreadsheetId, sheetName }: ReportGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [selectedRange, setSelectedRange] = useState({ startRow: 0, endRow: rows.length - 1 });
  const [selectedColumns, setSelectedColumns] = useState<string[]>(headers);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
  });

  // Handle column selection
  const handleColumnToggle = useCallback((column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  }, []);

  // Handle select all columns
  const handleSelectAllColumns = useCallback(() => {
    setSelectedColumns(headers);
  }, [headers]);

  // Handle clear all columns
  const handleClearAllColumns = useCallback(() => {
    setSelectedColumns([]);
  }, []);

  // Generate report
  const handleGenerateReport = useCallback(async () => {
    if (!selectedTemplate) {
      alert('Please select a report template');
      return;
    }

    if (selectedColumns.length === 0) {
      alert('Please select at least one column');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/admin/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          spreadsheetId,
          sheetName,
          range: selectedRange,
          columns: selectedColumns,
          data: rows.slice(selectedRange.startRow, selectedRange.endRow + 1),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedReports(prev => [
          {
            id: `report-${Date.now()}`,
            template: selectedTemplate,
            url: result.url,
            createdAt: new Date(),
            ...result.metadata,
          },
          ...prev,
        ]);
        
        // Download the report
        if (result.url) {
          window.open(result.url, '_blank');
        }
      } else {
        throw new Error(result.error || 'Report generation failed');
      }
    } catch (error) {
      alert('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedTemplate, selectedColumns, selectedRange, rows, spreadsheetId, sheetName]);

  // Create schedule
  const handleCreateSchedule = useCallback(async () => {
    if (!newSchedule.name) {
      alert('Please enter a schedule name');
      return;
    }

    const schedule: ReportSchedule = {
      id: `schedule-${Date.now()}`,
      name: newSchedule.name,
      frequency: newSchedule.frequency,
      enabled: true,
      lastRun: null,
      nextRun: new Date(),
    };

    setSchedules(prev => [...prev, schedule]);
    setShowScheduleModal(false);
    setNewSchedule({ name: '', frequency: 'weekly' });
  }, [newSchedule]);

  // Toggle schedule
  const handleToggleSchedule = useCallback((scheduleId: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, enabled: !s.enabled } : s
    ));
  }, []);

  // Delete schedule
  const handleDeleteSchedule = useCallback((scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  }, []);

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      ppt: '📽️',
      pptx: '📽️',
      excel: '📊',
      xlsx: '📊',
    };
    return icons[type] || '📁';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📊</span>
              Automated Report Generator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Generate PDF, PPT, or Excel reports from spreadsheet data
            </p>
          </div>
          
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>⏰</span>
            <span>Schedule Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Templates & Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Templates */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Report Templates</h3>
            </div>
            
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'bg-blue-600/20 border-blue-500'
                      : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <div className="text-white font-medium">{template.name}</div>
                      <div className="text-xs uppercase text-slate-400">{template.type}</div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Data Range Selection */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Data Range</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Start Row</label>
                  <input
                    type="number"
                    min="0"
                    max={rows.length - 1}
                    value={selectedRange.startRow}
                    onChange={(e) => setSelectedRange(prev => ({ ...prev, startRow: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">End Row</label>
                  <input
                    type="number"
                    min="0"
                    max={rows.length - 1}
                    value={selectedRange.endRow}
                    onChange={(e) => setSelectedRange(prev => ({ ...prev, endRow: parseInt(e.target.value) || rows.length - 1 }))}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="text-slate-400 text-sm">
                Selected: {selectedRange.endRow - selectedRange.startRow + 1} of {rows.length} rows
              </div>
            </div>
          </div>

          {/* Column Selection */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Columns</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAllColumns}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Select All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={handleClearAllColumns}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {headers.map((header) => (
                  <button
                    key={header}
                    onClick={() => handleColumnToggle(header)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedColumns.includes(header)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {selectedColumns.includes(header) ? '✓ ' : ''}{header}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-slate-400 text-sm">
                {selectedColumns.length} of {headers.length} columns selected
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating || !selectedTemplate || selectedColumns.length === 0}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isGenerating || !selectedTemplate || selectedColumns.length === 0
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:shadow-green-500/25'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Generating Report...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span>📊</span>
                <span>Generate Report</span>
              </span>
            )}
          </button>
        </div>

        {/* Right Column - Generated Reports & Schedules */}
        <div className="space-y-6">
          {/* Generated Reports */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Generated Reports</h3>
            </div>
            
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {generatedReports.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <span className="text-4xl mb-2 block">📭</span>
                  <p className="text-sm">No reports generated yet</p>
                </div>
              ) : (
                generatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(report.template.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {report.template.name}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {new Date(report.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <a
                        href={report.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        ⬇️
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Scheduled Reports */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Scheduled Reports</h3>
            </div>
            
            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
              {schedules.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <span className="text-4xl mb-2 block">⏰</span>
                  <p className="text-sm">No scheduled reports</p>
                </div>
              ) : (
                schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${schedule.enabled ? 'bg-green-500' : 'bg-slate-500'}`} />
                        <span className="text-white text-sm font-medium">{schedule.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleSchedule(schedule.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            schedule.enabled
                              ? 'bg-green-600/20 text-green-400'
                              : 'bg-slate-600 text-slate-400'
                          }`}
                        >
                          {schedule.enabled ? 'On' : 'Off'}
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-400 text-xs">
                      <span className="capitalize">{schedule.frequency}</span>
                      {schedule.nextRun && (
                        <span className="ml-2">• Next: {new Date(schedule.nextRun).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Schedule Report</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Schedule Name</label>
                <input
                  type="text"
                  value={newSchedule.name}
                  onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
                  placeholder="e.g., Weekly Summary Report"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-slate-400 text-sm mb-2">Frequency</label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({ ...newSchedule, frequency: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 bg-slate-900/30 border-t border-slate-700 flex gap-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
