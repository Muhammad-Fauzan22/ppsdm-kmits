'use client';

import React, { useState, useCallback, useRef } from 'react';

/**
 * Template Builder Component
 * ==========================
 * Drag-and-drop page components untuk membangun template website
 */

interface TemplateBuilderProps {
  headers: string[];
  spreadsheetId: string;
  sheetName: string;
}

interface Component {
  id: string;
  type: 'header' | 'text' | 'image' | 'list' | 'table' | 'card' | 'hero' | 'footer' | 'form';
  name: string;
  icon: string;
  description: string;
  config?: any;
}

interface PlacedComponent extends Component {
  columnMapping: Record<string, string>;
  styles?: any;
}

interface PageTemplate {
  id: string;
  name: string;
  components: PlacedComponent[];
  createdAt: Date;
  updatedAt: Date;
}

// Available components
const AVAILABLE_COMPONENTS: Component[] = [
  {
    id: 'hero',
    type: 'hero',
    name: 'Hero Section',
    icon: '🎯',
    description: 'Large banner with title and subtitle',
  },
  {
    id: 'header',
    type: 'header',
    name: 'Page Header',
    icon: '📝',
    description: 'Section heading with text',
  },
  {
    id: 'text',
    type: 'text',
    name: 'Text Block',
    icon: '📄',
    description: 'Paragraph of text content',
  },
  {
    id: 'image',
    type: 'image',
    name: 'Image',
    icon: '🖼️',
    description: 'Image with caption',
  },
  {
    id: 'list',
    type: 'list',
    name: 'List',
    icon: '📋',
    description: 'Bulleted or numbered list',
  },
  {
    id: 'table',
    type: 'table',
    name: 'Table',
    icon: '📊',
    description: 'Data table with rows and columns',
  },
  {
    id: 'card',
    type: 'card',
    name: 'Card',
    icon: '🃏',
    description: 'Card with image, title, and content',
  },
  {
    id: 'form',
    type: 'form',
    name: 'Form',
    icon: '📝',
    description: 'Contact or feedback form',
  },
  {
    id: 'footer',
    type: 'footer',
    name: 'Footer',
    icon: '🔗',
    description: 'Page footer with links',
  },
];

export function TemplateBuilder({ headers, spreadsheetId, sheetName }: TemplateBuilderProps) {
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<PlacedComponent | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showColumnMapper, setShowColumnMapper] = useState(false);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<PageTemplate | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle component add (click instead of drag)
  const handleAddComponent = useCallback((component: Component) => {
    const newComponent: PlacedComponent = {
      ...component,
      columnMapping: {},
    };
    
    setPlacedComponents(prev => [...prev, newComponent]);
    setSelectedComponent(newComponent);
    setShowColumnMapper(true);
  }, []);

  // Handle component reorder
  const handleReorderComponent = useCallback((fromIndex: number, toIndex: number) => {
    setPlacedComponents(prev => {
      const newComponents = [...prev];
      const [removed] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, removed);
      return newComponents;
    });
  }, []);

  // Handle column mapping
  const handleColumnMapping = useCallback((componentId: string, column: string, spreadsheetColumn: string) => {
    setPlacedComponents(prev => prev.map(comp => {
      if (comp.id === componentId) {
        return {
          ...comp,
          columnMapping: {
            ...comp.columnMapping,
            [column]: spreadsheetColumn,
          },
        };
      }
      return comp;
    }));
  }, []);

  // Remove component
  const handleRemoveComponent = useCallback((componentId: string) => {
    setPlacedComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  }, [selectedComponent]);

  // Save template
  const handleSaveTemplate = useCallback(async () => {
    const template: PageTemplate = {
      id: `template-${Date.now()}`,
      name: `Template ${templates.length + 1}`,
      components: placedComponents,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTemplates(prev => [...prev, template]);
    setCurrentTemplate(template);
  }, [placedComponents, templates]);

  // Export template
  const handleExportTemplate = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/export-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: currentTemplate || {
            id: `template-${Date.now()}`,
            name: 'Exported Template',
            components: placedComponents,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          spreadsheetId,
          sheetName,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Template exported successfully!');
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Error exporting template:', error);
      alert('Failed to export template');
    } finally {
      setIsExporting(false);
    }
  }, [currentTemplate, placedComponents, spreadsheetId, sheetName]);

  // Get component-specific fields
  const getComponentFields = (type: Component['type']): string[] => {
    const fieldMap: Record<Component['type'], string[]> = {
      hero: ['title', 'subtitle', 'backgroundImage', 'ctaText', 'ctaLink'],
      header: ['text', 'level'],
      text: ['content'],
      image: ['url', 'alt', 'caption'],
      list: ['items', 'type'],
      table: ['data', 'headers'],
      card: ['title', 'content', 'image', 'link'],
      form: ['fields', 'action'],
      footer: ['links', 'copyright'],
    };
    return fieldMap[type] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎨</span>
              Visual Template Builder
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Click components to add them to your page template
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Preview Mode Toggle */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  previewMode === 'desktop'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🖥️ Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  previewMode === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                📱 Mobile
              </button>
            </div>

            <button
              onClick={handleSaveTemplate}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              💾 Save Template
            </button>
            
            <button
              onClick={handleExportTemplate}
              disabled={isExporting || placedComponents.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isExporting || placedComponents.length === 0
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
              }`}
            >
              {isExporting ? '⏳ Exporting...' : '📤 Export as Page'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Available Components */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Components</h3>
            </div>
            
            <div className="p-4 space-y-2">
              {AVAILABLE_COMPONENTS.map((component) => (
                <button
                  key={component.id}
                  onClick={() => handleAddComponent(component)}
                  className="w-full p-3 rounded-lg border bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{component.icon}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{component.name}</div>
                      <div className="text-slate-400 text-xs">{component.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Templates */}
          {templates.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden mt-4">
              <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
                <h3 className="text-white font-semibold">Saved Templates</h3>
              </div>
              <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setCurrentTemplate(template);
                      setPlacedComponents(template.components);
                    }}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      currentTemplate?.id === template.id
                        ? 'bg-blue-600/20 border-blue-500'
                        : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    <div className="text-white text-sm font-medium">{template.name}</div>
                    <div className="text-slate-400 text-xs mt-1">
                      {template.components.length} components
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold">Canvas</h3>
              <span className="text-slate-400 text-sm">
                {placedComponents.length} components
              </span>
            </div>
            
            <div className={`p-4 min-h-[500px] bg-slate-900/30 ${
              previewMode === 'mobile' ? 'max-w-md mx-auto' : ''
            }`}>
              {placedComponents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500">
                  <span className="text-6xl mb-4">📦</span>
                  <p className="text-lg font-medium">Canvas is empty</p>
                  <p className="text-sm mt-2">Click components from the left to start building</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {placedComponents.map((component, index) => (
                    <div
                      key={component.id}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedComponent?.id === component.id
                          ? 'bg-purple-600/20 border-purple-500'
                          : 'bg-slate-700/50 border-slate-600'
                      }`}
                      onClick={() => setSelectedComponent(component)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{component.icon}</span>
                          <div>
                            <div className="text-white font-medium">{component.name}</div>
                            <div className="text-slate-400 text-xs">
                              {Object.keys(component.columnMapping).length} fields mapped
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {index > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorderComponent(index, index - 1);
                              }}
                              className="text-slate-400 hover:text-white"
                            >
                              ↑
                            </button>
                          )}
                          {index < placedComponents.length - 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorderComponent(index, index + 1);
                              }}
                              className="text-slate-400 hover:text-white"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveComponent(component.id);
                            }}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Column Mapping */}
                      <div className="space-y-2">
                        {getComponentFields(component.type).map((field) => (
                          <div key={field} className="flex items-center gap-2">
                            <label className="text-slate-400 text-xs w-24 capitalize">
                              {field}:
                            </label>
                            <select
                              value={component.columnMapping[field] || ''}
                              onChange={(e) => handleColumnMapping(component.id, field, e.target.value)}
                              className="flex-1 px-2 py-1 bg-slate-800 border border-slate-600 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select column...</option>
                              {headers.map((header) => (
                                <option key={header} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden sticky top-24">
            <div className="bg-slate-900/50 px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Live Preview</h3>
            </div>
            
            <div 
              ref={canvasRef}
              className={`p-4 bg-white min-h-[500px] ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
              }`}
            >
              {placedComponents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p className="text-sm">Add components to see preview</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {placedComponents.map((component) => (
                    <div key={component.id} className="border border-slate-200 rounded p-4">
                      {/* Simple preview based on component type */}
                      {component.type === 'hero' && (
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 rounded">
                          <h1 className="text-2xl font-bold">
                            {component.columnMapping.title || 'Hero Title'}
                          </h1>
                          <p className="mt-2 opacity-90">
                            {component.columnMapping.subtitle || 'Hero Subtitle'}
                          </p>
                        </div>
                      )}
                      
                      {component.type === 'header' && (
                        <h2 className="text-xl font-bold text-slate-800">
                          {component.columnMapping.text || 'Header Text'}
                        </h2>
                      )}
                      
                      {component.type === 'text' && (
                        <p className="text-slate-600">
                          {component.columnMapping.content || 'Text content will appear here...'}
                        </p>
                      )}
                      
                      {component.type === 'card' && (
                        <div className="bg-slate-50 rounded p-4">
                          <h3 className="font-semibold text-slate-800">
                            {component.columnMapping.title || 'Card Title'}
                          </h3>
                          <p className="text-sm text-slate-600 mt-2">
                            {component.columnMapping.content || 'Card content...'}
                          </p>
                        </div>
                      )}
                      
                      {component.type === 'list' && (
                        <ul className="list-disc list-inside text-slate-600">
                          <li>Item 1</li>
                          <li>Item 2</li>
                          <li>Item 3</li>
                        </ul>
                      )}
                      
                      {component.type === 'table' && (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Column 1</th>
                              <th className="text-left py-2">Column 2</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2">Data 1</td>
                              <td className="py-2">Data 2</td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                      
                      {component.type === 'footer' && (
                        <div className="bg-slate-100 rounded p-4 text-center text-sm text-slate-600">
                          <p>© 2024 PPSDM KMITS</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
