import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { AnalyticsSummary, DepartmentStat } from '@/lib/analytics/service';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#1e40af', // Blue 800
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e3a8a', // Blue 900
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b', // Slate 500
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#334155', // Slate 700
        backgroundColor: '#f1f5f9', // Slate 100
        padding: 5,
    },
    statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    statBox: {
        width: '45%',
        padding: 10,
        backgroundColor: '#f8fafc', // Slate 50
        borderWidth: 1,
        borderColor: '#e2e8f0', // Slate 200
        borderRadius: 4,
    },
    statLabel: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginTop: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        alignItems: 'center',
        height: 24,
    },
    tableHeader: {
        backgroundColor: '#f1f5f9',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableCell: {
        width: '50%',
        textAlign: 'left',
        paddingLeft: 5,
        fontSize: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    }
});

interface ReportProps {
    summary: AnalyticsSummary;
    deptStats: DepartmentStat[];
    generatedAt: string;
}

export const AnalyticsReportTemplate = ({ summary, deptStats, generatedAt }: ReportProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>PPSDM KMITS</Text>
                    <Text style={styles.subtitle}>Executive Analytics Report</Text>
                </View>
                <Text style={styles.subtitle}>{generatedAt}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Performance Indicators</Text>
                <View style={styles.statGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Students</Text>
                        <Text style={styles.statValue}>{summary.total_students}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Active (7 Days)</Text>
                        <Text style={styles.statValue}>{summary.active_users_7d}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Average XP</Text>
                        <Text style={styles.statValue}>{summary.avg_xp}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Engagement Rate</Text>
                        <Text style={styles.statValue}>{summary.quest_completion_rate}%</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Department Participation</Text>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Department Name</Text>
                        <Text style={styles.tableCell}>Student Count</Text>
                    </View>
                    {deptStats.map((dept, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{dept.name}</Text>
                            <Text style={styles.tableCell}>{dept.count}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <Text style={styles.footer}>
                Generated automatically by PPSDM KMITS Analytics Engine • {generatedAt}
            </Text>
        </Page>
    </Document>
);
