import React from 'react';
import { X, Download, Printer, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { sanitizeHtml } from '@/lib/sanitize';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    htmlContent: string;
    title?: string;
    onDownload?: () => void;
    onPrint?: () => void;
}

export function PreviewModal({
    isOpen,
    onClose,
    htmlContent,
    title = 'Preview Laporan',
    onDownload,
    onPrint
}: PreviewModalProps) {
    const [zoom, setZoom] = React.useState(100);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
    const handleResetZoom = () => setZoom(100);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0">
                    <DialogTitle>{title}</DialogTitle>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-md bg-muted/50 mr-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-xs w-12 text-center">{zoom}%</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleResetZoom}>
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        </div>

                        {onPrint && (
                            <Button variant="outline" size="sm" onClick={onPrint} className="gap-2">
                                <Printer className="h-4 w-4" />
                                Print
                            </Button>
                        )}

                        {onDownload && (
                            <Button size="sm" onClick={onDownload} className="gap-2">
                                <Download className="h-4 w-4" />
                                Download
                            </Button>
                        )}

                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center">
                    <div
                        className="bg-white shadow-lg origin-top transition-transform duration-200"
                        style={{
                            width: '210mm', // A4 width
                            minHeight: '297mm', // A4 height
                            transform: `scale(${zoom / 100})`,
                            padding: '20mm'
                        }}
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(htmlContent) }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}