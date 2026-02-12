import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileCode, FileSpreadsheet, Globe, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ReportFormat } from '@/lib/report-engine/types';

interface DownloadItem {
    id: string;
    reportType: string;
    format: ReportFormat;
    fileName: string;
    fileSize: number;
    generatedAt: string;
    status: 'completed' | 'pending' | 'failed';
    url?: string;
}

interface DownloadManagerProps {
    downloads: DownloadItem[];
    onDownload?: (item: DownloadItem) => void;
    onDelete?: (id: string) => void;
    onClearAll?: () => void;
}

export function DownloadManager({
    downloads,
    onDownload,
    onDelete,
    onClearAll
}: DownloadManagerProps) {
    const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());

    const getFormatIcon = (format: ReportFormat) => {
        switch (format) {
            case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
            case 'docx': return <FileCode className="h-5 w-5 text-blue-500" />;
            case 'excel': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
            case 'html': return <Globe className="h-5 w-5 text-orange-500" />;
            default: return <FileText className="h-5 w-5" />;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return null;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const completedDownloads = downloads.filter(d => d.status === 'completed');
    const failedDownloads = downloads.filter(d => d.status === 'failed');

    if (downloads.length === 0) {
        return (
            <Card className="p-8 text-center text-muted-foreground bg-muted/20 border-dashed">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada riwayat unduhan</p>
                <p className="text-sm mt-1">Generate laporan untuk melihatnya di sini</p>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-full bg-white dark:bg-slate-900">
            <div className="p-4 border-b flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Riwayat Unduhan</h3>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Selesai: {completedDownloads.length}
                        </span>
                        {failedDownloads.length > 0 && (
                            <span className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="h-3 w-3" />
                                Gagal: {failedDownloads.length}
                            </span>
                        )}
                    </div>
                </div>
                {onClearAll && downloads.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Bersihkan
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-auto divide-y">
                {downloads.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                        <div className="flex-shrink-0">
                            {getFormatIcon(item.format)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium truncate">{item.fileName}</h4>
                                <Badge variant={item.status === 'completed' ? 'secondary' : 'outline'} className="text-[10px] h-5">
                                    {item.format.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    {getStatusIcon(item.status)}
                                    {item.status === 'completed' ? formatFileSize(item.fileSize) : item.status}
                                </span>
                                <span>
                                    {new Date(item.generatedAt).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {item.status === 'completed' && onDownload && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onDownload(item)}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}