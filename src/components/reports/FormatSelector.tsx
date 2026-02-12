import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, FileCode, FileSpreadsheet, Globe, Check } from 'lucide-react';
import { ReportFormat } from '@/lib/report-engine/types';

interface FormatSelectorProps {
    selectedFormat: ReportFormat;
    onFormatChange: (format: ReportFormat) => void;
    disabled?: boolean;
}

export function FormatSelector({
    selectedFormat,
    onFormatChange,
    disabled
}: FormatSelectorProps) {
    const formats = [
        {
            value: 'pdf',
            label: 'PDF',
            description: 'Format dokumen portabel yang cocok untuk cetak dan berbagi',
            icon: FileText,
            color: 'text-red-500',
            bgColor: 'bg-red-50'
        },
        {
            value: 'docx',
            label: 'Word (DOCX)',
            description: 'Format dokumen Microsoft Word yang dapat diedit',
            icon: FileCode,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            value: 'excel',
            label: 'Excel (XLSX)',
            description: 'Format spreadsheet Microsoft Excel untuk analisis data',
            icon: FileSpreadsheet,
            color: 'text-green-500',
            bgColor: 'bg-green-50'
        },
        {
            value: 'html',
            label: 'HTML',
            description: 'Format halaman web untuk preview dan integrasi',
            icon: Globe,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50'
        }
    ] as const;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formats.map((format) => {
                const isSelected = selectedFormat === format.value;
                const Icon = format.icon;

                return (
                    <Card
                        key={format.value}
                        className={`
              relative p-4 cursor-pointer transition-all border-2
              ${isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/50'}
              ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
            `}
                        onClick={() => !disabled && onFormatChange(format.value as ReportFormat)}
                    >
                        {isSelected && (
                            <div className="absolute top-2 right-2 text-primary">
                                <Check className="h-5 w-5" />
                            </div>
                        )}

                        <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg ${format.bgColor}`}>
                                <Icon className={`h-6 w-6 ${format.color}`} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-semibold text-sm leading-none">{format.label}</h4>
                                <p className="text-xs text-muted-foreground pr-4">
                                    {format.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}