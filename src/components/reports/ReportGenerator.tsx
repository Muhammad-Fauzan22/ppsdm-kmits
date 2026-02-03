'use client';

import { useState } from 'react';
import { useReportGenerator } from '@/hooks/useReportGenerator';
import { ReportFormat, GenerateOptions } from '@/lib/report-engine/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Download, Eye, Loader2, FileText, FileSpreadsheet, FileCode, Globe } from 'lucide-react';

interface ReportGeneratorProps {
  reportType: string;
  assessmentId: string;
  userId: string;
  userName?: string;
}

export function ReportGeneratorComponent({
  reportType,
  assessmentId,
  userId,
  userName = 'Mahasiswa',
}: ReportGeneratorProps) {
  const { generateReport, generatePreview, isLoading, error, previewHtml } = useReportGenerator();
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [showPreview, setShowPreview] = useState(false);
  const [options, setOptions] = useState<GenerateOptions>({});

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText, description: 'Format dokumen portabel' },
    { value: 'docx', label: 'Word (DOCX)', icon: FileCode, description: 'Format dokumen Microsoft Word' },
    { value: 'excel', label: 'Excel (XLSX)', icon: FileSpreadsheet, description: 'Format spreadsheet Microsoft Excel' },
    { value: 'html', label: 'HTML', icon: Globe, description: 'Format halaman web' },
  ];

  const handleGenerate = async () => {
    await generateReport(reportType, selectedFormat, assessmentId, userId, options);
  };

  const handlePreview = async () => {
    await generatePreview(reportType, assessmentId, userId, options);
    setShowPreview(true);
  };

  const getFormatIcon = (format: ReportFormat) => {
    const option = formatOptions.find(opt => opt.value === format);
    return option ? option.icon : FileText;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Generate Laporan
        </CardTitle>
        <CardDescription>
          Pilih format laporan yang diinginkan dan klik tombol generate untuk mengunduh laporan penilaian Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Type Info */}
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Informasi Laporan</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><strong>Tipe:</strong> {reportType}</p>
            <p><strong>ID Penilaian:</strong> {assessmentId}</p>
            <p><strong>Nama:</strong> {userName}</p>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label htmlFor="format">Format Laporan</Label>
          <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as ReportFormat)}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Pilih format laporan" />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <Label>Opsi Tambahan</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeCharts || false}
                onChange={(e) => setOptions({ ...options, includeCharts: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Sertakan grafik dan visualisasi</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={options.includeRecommendations || false}
                onChange={(e) => setOptions({ ...options, includeRecommendations: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Sertakan rekomendasi</span>
            </label>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate & Download
              </>
            )}
          </Button>
          <Button
            onClick={handlePreview}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            )}
          </Button>
        </div>

        {/* Preview Modal */}
        {showPreview && previewHtml && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Preview Laporan</h3>
                <Button
                  onClick={() => setShowPreview(false)}
                  variant="ghost"
                  size="sm"
                >
                  Tutup
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                  className="prose max-w-none"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
