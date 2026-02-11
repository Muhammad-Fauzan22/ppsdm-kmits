'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Spreadsheet Editor Component
 * ============================
 * Live spreadsheet interface dengan real-time preview dan validation
 */

export interface SheetData {
  spreadsheetId: string;
  sheetName: string;
  headers: string[];
  rows: any[][];
  metadata?: any;
}

export interface CellData {
  value: string;
  isValid: boolean;
  validationMessage?: string;
  isModified: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'url' | 'number' | 'date' | 'regex' | 'enum';
  pattern?: string;
  values?: string[];
  message?: string;
}

export interface ColumnConfig {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  validation?: ValidationRule;
  width?: number;
  editable?: boolean;
  color?: string;
}

interface SpreadsheetEditorProps {
  data: SheetData;
  onUpdate: (updates: any[][]) => Promise<void>;
  onRefresh: () => Promise<void>;
}

// Default column configurations
const DEFAULT_COLUMN_CONFIGS: Record<string, ColumnConfig> = {
  'ID': { name: 'ID', type: 'text', editable: false, color: '#6366f1' },
  'Title': { name: 'Title', type: 'text', editable: true, validation: { type: 'required', message: 'Title is required' } },
  'Description': { name: 'Description', type: 'text', editable: true },
  'Status': { 
    name: 'Status', 
    type: 'select', 
    editable: true, 
    validation: { type: 'enum', values: ['Active', 'Inactive', 'Draft'], message: 'Must be Active, Inactive, or Draft' } 
  },
  'Date': { name: 'Date', type: 'date', editable: true, validation: { type: 'date', message: 'Invalid date format' } },
  'Email': { name: 'Email', type: 'text', editable: true, validation: { type: 'email', message: 'Invalid email format' } },
  'URL': { name: 'URL', type: 'text', editable: true, validation: { type: 'url', message: 'Invalid URL format' } },
  'Count': { name: 'Count', type: 'number', editable: true, validation: { type: 'number', message: 'Must be a number' } },
};

// Validation functions
const validateCell = (value: string, rule?: ValidationRule): { isValid: boolean; message?: string } => {
  if (!rule) return { isValid: true };
  
  if (rule.type === 'required' && !value.trim()) {
    return { isValid: false, message: rule.message || 'This field is required' };
  }
  
  if (rule.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { isValid: false, message: rule.message || 'Invalid email format' };
    }
  }
  
  if (rule.type === 'url' && value) {
    try {
      new URL(value);
    } catch {
      return { isValid: false, message: rule.message || 'Invalid URL format' };
    }
  }
  
  if (rule.type === 'number' && value) {
    if (isNaN(Number(value))) {
      return { isValid: false, message: rule.message || 'Must be a number' };
    }
  }
  
  if (rule.type === 'date' && value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { isValid: false, message: rule.message || 'Invalid date format' };
    }
  }
  
  if (rule.type === 'enum' && value && rule.values) {
    if (!rule.values.includes(value)) {
      return { isValid: false, message: rule.message || `Must be one of: ${rule.values.join(', ')}` };
    }
  }
  
  if (rule.type === 'regex' && value && rule.pattern) {
    const regex = new RegExp(rule.pattern);
    if (!regex.test(value)) {
      return { isValid: false, message: rule.message || 'Invalid format' };
    }
  }
  
  return { isValid: true };
};

export function SpreadsheetEditor({ data, onUpdate, onRefresh }: SpreadsheetEditorProps) {
  const [cells, setCells] = useState<CellData[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState<number[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);

  // Initialize cells from data
  useEffect(() => {
    const initialCells: CellData[][] = [];
    
    // Initialize column configs
    const configs: ColumnConfig[] = data.headers.map(header => 
      DEFAULT_COLUMN_CONFIGS[header] || {
        name: header,
        type: 'text',
        editable: true,
      }
    );
    setColumnConfigs(configs);
    
    // Initialize cells
    for (let row = 0; row < data.rows.length; row++) {
      const rowCells: CellData[] = [];
      for (let col = 0; col < data.headers.length; col++) {
        const value = String(data.rows[row]?.[col] || '');
        const config = configs[col];
        const validation = validateCell(value, config.validation);
        
        rowCells.push({
          value,
          isValid: validation.isValid,
          validationMessage: validation.message,
          isModified: false,
        });
      }
      initialCells.push(rowCells);
    }
    
    setCells(initialCells);
    setFilteredRows(data.rows.map((_, i) => i));
  }, [data]);

  // Filter rows based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRows(data.rows.map((_, i) => i));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered: number[] = [];
    
    for (let row = 0; row < cells.length; row++) {
      for (let col = 0; col < cells[row].length; col++) {
        if (cells[row][col].value.toLowerCase().includes(query)) {
          filtered.push(row);
          break;
        }
      }
    }
    
    setFilteredRows(filtered);
  }, [searchQuery, cells]);

  // Handle cell value change
  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    setCells(prev => {
      const newCells = [...prev];
      const config = columnConfigs[col];
      const validation = validateCell(value, config.validation);
      
      newCells[row][col] = {
        value,
        isValid: validation.isValid,
        validationMessage: validation.message,
        isModified: true,
      };
      
      return newCells;
    });
    setHasUnsavedChanges(true);
  }, [columnConfigs]);

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const updates = cells.map(row => row.map(cell => cell.value));
      await onUpdate(updates);
      setHasUnsavedChanges(false);
      
      // Reset modified flags
      setCells(prev => prev.map(row => row.map(cell => ({ ...cell, isModified: false }))));
    } catch (error) {
      } finally {
      setIsSaving(false);
    }
  }, [cells, onUpdate]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditingCell({ row: row + 1, col });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setEditingCell({ row, col: col + 1 });
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  }, []);

  // Get cell background color based on state
  const getCellBackgroundColor = (cell: CellData, col: number): string => {
    const config = columnConfigs[col];
    
    if (cell.isModified) return 'bg-yellow-500/20';
    if (!cell.isValid && showValidation) return 'bg-red-500/20';
    if (config?.color) return `${config.color}20`;
    return 'bg-slate-800/50';
  };

  // Get cell border color
  const getCellBorderColor = (cell: CellData): string => {
    if (!cell.isValid && showValidation) return 'border-red-500';
    if (cell.isModified) return 'border-yellow-500';
    return 'border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cells..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="text-slate-400 text-sm">
              {filteredRows.length} of {cells.length} rows
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowValidation(!showValidation)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showValidation 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {showValidation ? '✓ Validation On' : '✗ Validation Off'}
            </button>
            
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              🔄 Refresh
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                hasUnsavedChanges && !isSaving
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isSaving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div 
          ref={tableRef}
          className={`overflow-auto ${previewMode === 'mobile' ? 'max-w-md mx-auto' : ''}`}
          style={{ maxHeight: '600px' }}
        >
          <table className="w-full border-collapse">
            {/* Header Row */}
            <thead className="bg-slate-900/50 sticky top-0 z-10">
              <tr>
                <th className="w-10 px-2 py-3 bg-slate-900 border-b border-r border-slate-700 text-slate-500 text-xs font-medium">
                  #
                </th>
                {data.headers.map((header, col) => (
                  <th
                    key={col}
                    className="px-4 py-3 bg-slate-900 border-b border-r border-slate-700 text-white text-sm font-semibold whitespace-nowrap min-w-[150px]"
                  >
                    <div className="flex items-center gap-2">
                      <span>{header}</span>
                      {columnConfigs[col]?.validation?.type === 'required' && (
                        <span className="text-red-400">*</span>
                      )}
                      {!columnConfigs[col]?.editable && (
                        <span className="text-slate-500 text-xs">🔒</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Data Rows */}
            <tbody>
              {filteredRows.map((rowIndex, displayIndex) => (
                <tr 
                  key={rowIndex}
                  className={`hover:bg-slate-700/30 transition-colors ${
                    selectedCell?.row === rowIndex ? 'bg-blue-500/10' : ''
                  }`}
                >
                  <td className="px-2 py-2 bg-slate-900/30 border-b border-r border-slate-700 text-slate-500 text-xs text-center">
                    {displayIndex + 1}
                  </td>
                  {cells[rowIndex]?.map((cell, col) => {
                    const config = columnConfigs[col];
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === col;
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === col;
                    
                    return (
                      <td
                        key={col}
                        className={`px-2 py-2 border-b border-r border-slate-700 min-w-[150px] ${getCellBackgroundColor(cell, col)} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => {
                          setSelectedCell({ row: rowIndex, col });
                          if (config?.editable) {
                            setEditingCell({ row: rowIndex, col });
                          }
                        }}
                      >
                        {isEditing && config?.editable ? (
                          <input
                            type={config.type === 'number' ? 'number' : 'text'}
                            value={cell.value}
                            onChange={(e) => handleCellChange(rowIndex, col, e.target.value)}
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, col)}
                            autoFocus
                            className={`w-full px-2 py-1 bg-white text-slate-900 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!cell.isValid ? 'ring-2 ring-red-500' : ''}`}
                          />
                        ) : (
                          <div className="relative">
                            <span className={`text-sm ${!cell.isValid ? 'text-red-400' : 'text-slate-200'}`}>
                              {cell.value || <span className="text-slate-600 italic">empty</span>}
                            </span>
                            {!cell.isValid && showValidation && (
                              <div className="absolute top-full left-0 mt-1 px-2 py-1 bg-red-900 text-red-200 text-xs rounded whitespace-nowrap z-20">
                                {cell.validationMessage}
                              </div>
                            )}
                            {cell.isModified && (
                              <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"></span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-semibold mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500 rounded"></div>
            <span className="text-slate-300">Modified</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded"></div>
            <span className="text-slate-300">Invalid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800/50 border border-slate-700 rounded"></div>
            <span className="text-slate-300">Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-400">*</span>
            <span className="text-slate-300">Required field</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">🔒</span>
            <span className="text-slate-300">Read-only</span>
          </div>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-semibold mb-3">Preview Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode === 'desktop'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode === 'mobile'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📱 Mobile
          </button>
        </div>
      </div>
    </div>
  );
}
