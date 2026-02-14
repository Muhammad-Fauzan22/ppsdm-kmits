
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, otherwise use default Helvetica
// Font.register({ family: 'Open Sans', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        border: '5px solid #1e293b', // Slate-800 border
    },
    borderParams: {
        margin: 10,
        padding: 30,
        border: '2px solid #cbd5e1', // Slate-300 inner border
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0f172a', // Slate-900
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b', // Slate-500
        marginBottom: 30,
    },
    recipient: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        borderBottom: '1px solid #94a3b8',
        paddingBottom: 5,
        marginBottom: 20,
        minWidth: 300,
        textAlign: 'center',
    },
    text: {
        fontSize: 12,
        color: '#334155', // Slate-700
        marginBottom: 5,
        textAlign: 'center',
    },
    dimension: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3b82f6', // Blue-500
        marginTop: 10,
        marginBottom: 20,
    },
    scoreSection: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f8fafc',
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    footer: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 20,
        borderTop: '1px solid #e2e8f0',
    },
    signatureBlock: {
        alignItems: 'center',
    },
    signatureLine: {
        width: 150,
        borderBottom: '1px solid #000',
        marginBottom: 5,
    },
    signatureText: {
        fontSize: 10,
        color: '#64748b',
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 20
    },
    logo: {
        width: 60,
        height: 60,
    }
});

interface CertificateData {
    studentName: string;
    dimension: string;
    score: number;
    date: string;
    id: string; // Certificate ID / UUID
}

interface CertificateTemplateProps {
    data: CertificateData;
}

export const CertificateTemplate: React.FC<CertificateTemplateProps> = ({ data }) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.borderParams}>
                <View style={styles.header}>
                    <Text style={styles.subtitle}>PPSDM KMITS - HOLISTIC DEVELOPMENT</Text>
                    <Text style={styles.title}>CERTIFICATE OF COMPLETION</Text>
                </View>

                <Text style={styles.text}>This certifies that</Text>

                <Text style={styles.recipient}>{data.studentName}</Text>

                <Text style={styles.text}>Has successfully completed the assessment for the dimension of</Text>

                <Text style={styles.dimension}>{data.dimension}</Text>

                <View style={styles.scoreSection}>
                    <Text style={styles.score}>Score Achieved: {data.score} / 100</Text>
                    <Text style={{ fontSize: 10, color: '#64748b', marginTop: 5 }}>
                        Certificate ID: {data.id}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.signatureBlock}>
                        <Text style={{ fontSize: 10, marginBottom: 30 }}>{data.date}</Text>
                        <Text style={styles.signatureText}>Date Issues</Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        {/* Placeholder Signature */}
                        <View style={[styles.signatureLine, { borderBottomStyle: 'dotted' }]} />
                        <Text style={[styles.signatureText, { fontWeight: 'bold' }]}>PPSDM System</Text>
                        <Text style={styles.signatureText}>Verified Automatically</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);
