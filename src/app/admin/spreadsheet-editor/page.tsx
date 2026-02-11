'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Eye,
  Edit,
  Save
} from 'lucide-react';
import { SpreadsheetEditor } from '@/components/admin/SpreadsheetEditor';
import { PublishButton } from '@/components/admin/PublishButton';
import { TemplateBuilder } from '@/components/admin/TemplateBuilder';
import { ReportGenerator } from '@/components/admin/ReportGenerator';

export default function SpreadsheetEditorPage() {
  const [activeTab, setActiveTab] = useState('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [lastPublished, setLastPublished] = useState<Date | null>(null);
  const [version, setVersion] = useState(1);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [sheetData, setSheetData] = useState<any[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('Activities');

  // Available sheets
  const availableSheets = [
    { id: 'Activities', name: 'Kegiatan', icon: '📅' },
    { id: 'Members', name: 'Anggota', icon: '👥' },
    { id: 'Finances', name: 'Keuangan', icon: '💰' },
    { id: 'Assessments', name: 'Penilaian', icon: '📊' },
    { id: 'Knowledge', name: 'Pengetahuan', icon: '📚' },
    { id: 'Projects', name: 'Proyek', icon: '🚀' },
  ];

  // Fetch sheet data
  const fetchSheetData = async () => {
    setIsLoading(true);
    setSyncStatus('syncing');
    
    try {
      const response = await fetch(`/api/google-sheets/data?sheet=${selectedSheet}`);
      const result = await response.json();
      
      if (result.success) {
        setSheetData(result.data);
        setLastSyncTime(new Date());
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSheetData();
  }, [selectedSheet]);

  // Handle publish
  const handlePublish = async (options: { notifyMembers?: boolean; createBackup?: boolean }) => {
    setIsPublishing(true);
    
    try {
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullSync: true, ...options }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLastSyncTime(new Date());
        setLastPublished(new Date());
        setVersion(prev => prev + 1);
        setSyncStatus('success');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      setSyncStatus('error');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white dark:bg-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                Spreadsheet Editor
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Kelola data organisasi melalui Google Sheets
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={syncStatus === 'success' ? 'default' : syncStatus === 'error' ? 'destructive' : 'secondary'}>
                {syncStatus === 'syncing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                {syncStatus === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                {syncStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                {syncStatus === 'idle' && 'Ready'}
                {syncStatus === 'syncing' && 'Syncing...'}
                {syncStatus === 'success' && 'Synced'}
                {syncStatus === 'error' && 'Error'}
              </Badge>
              {lastSyncTime && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Last sync: {lastSyncTime.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Editor Tab */}
          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sheet Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pilih Sheet</CardTitle>
                  <CardDescription>
                    Pilih sheet yang ingin diedit
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {availableSheets.map((sheet) => (
                    <button
                      key={sheet.id}
                      onClick={() => setSelectedSheet(sheet.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedSheet === sheet.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sheet.icon}</span>
                        <div>
                          <div className="font-medium">{sheet.name}</div>
                          <div className="text-xs text-slate-500">{sheet.id}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Spreadsheet Editor */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {availableSheets.find(s => s.id === selectedSheet)?.name}
                      </CardTitle>
                      <CardDescription>
                        Edit data langsung di spreadsheet
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchSheetData}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <PublishButton 
                        onPublish={handlePublish} 
                        isPublishing={isPublishing}
                        lastPublished={lastPublished}
                        version={version}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <SpreadsheetEditor
                    data={{
                      spreadsheetId: process.env.SPREADSHEET_ID || '',
                      sheetName: selectedSheet,
                      headers: sheetData.length > 0 ? Object.keys(sheetData[0]) : [],
                      rows: sheetData.map(row => Object.values(row)),
                    }}
                    onUpdate={async (updates) => {
                      // Convert updates back to array of objects
                      const headers = sheetData.length > 0 ? Object.keys(sheetData[0]) : [];
                      const newData = updates.map(row => {
                        const obj: any = {};
                        headers.forEach((header, i) => {
                          obj[header] = row[i];
                        });
                        return obj;
                      });
                      setSheetData(newData);
                    }}
                    onRefresh={fetchSheetData}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Preview halaman website yang akan di-generate dari data spreadsheet.
                Perubahan akan terlihat setelah tombol "Publish" ditekan.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle>Website Preview</CardTitle>
                <CardDescription>
                  Preview halaman {availableSheets.find(s => s.id === selectedSheet)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 min-h-[400px]">
                  <div className="text-center text-slate-500 dark:text-slate-400 py-20">
                    <FileSpreadsheet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Preview akan ditampilkan di sini</p>
                    <p className="text-sm mt-2">
                      Data dari sheet "{selectedSheet}" akan di-generate menjadi halaman website
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <TemplateBuilder
              headers={sheetData.length > 0 ? Object.keys(sheetData[0]) : []}
              spreadsheetId={process.env.SPREADSHEET_ID || ''}
              sheetName={selectedSheet}
            />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <ReportGenerator
              headers={sheetData.length > 0 ? Object.keys(sheetData[0]) : []}
              rows={sheetData.map(row => Object.values(row))}
              spreadsheetId={process.env.SPREADSHEET_ID || ''}
              sheetName={selectedSheet}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
