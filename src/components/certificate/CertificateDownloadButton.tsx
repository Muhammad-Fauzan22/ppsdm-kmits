
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { CertificateTemplate } from './CertificateTemplate';

// Dynamically import PDFDownloadLink to avoid SSR issues with @react-pdf/renderer
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => <Button disabled variant="outline"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading PDF...</Button>,
    }
);

interface CertificateDownloadButtonProps {
    studentName: string;
    dimension: string;
    score: number;
    date: string;
    id: string; // Unique ID for the certificate
}

export function CertificateDownloadButton(props: CertificateDownloadButtonProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <Button disabled variant="outline"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing...</Button>;
    }

    return (
        <PDFDownloadLink
            document={<CertificateTemplate data={props} />}
            fileName={`Certificate-${props.dimension}-${props.studentName}.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button variant="outline" disabled={loading} className="gap-2 border-brand-blue text-brand-blue hover:bg-brand-blue/10">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {loading ? 'Generating...' : 'Download Certificate'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
