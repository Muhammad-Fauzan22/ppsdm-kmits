import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { ASSETS } from '@/config/assets'; // Import Asset Dinamis (Catatan: @react-pdf mungkin butuh fetch manual untuk remote image, tapi kita coba direct URL dulu)

// SETUP FONT
Font.register({
    family: 'Friz Quadrata',
    src: '/fonts/Friz-Quadrata-Std.ttf',
});

Font.register({
    family: 'Work Sans',
    src: 'https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.ttf',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKDp.ttf', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/worksans/v19/QGYsz_wNahGAdqQ43Rh_fKd3.ttf', fontWeight: 'bold' },
    ]
});

// STYLE GUIDE
const styles = StyleSheet.create({
    page: { padding: 50, fontFamily: 'Work Sans', fontSize: 11, color: '#231F20' }, // Nero Black

    // HEADER SECTION (Grid System Hal 6)
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#013880', paddingBottom: 15 },
    logo: { width: 70, height: 70, marginRight: 20 },
    institutionContainer: { flexDirection: 'column' },
    institutionName: { fontFamily: 'Friz Quadrata', fontSize: 18, color: '#013880', textTransform: 'uppercase', lineHeight: 1.2 }, // ITS Blue
    documentTitle: { fontSize: 14, marginTop: 5, color: '#666', letterSpacing: 1 },

    // STUDENT INFO
    infoContainer: { marginBottom: 30, padding: 15, backgroundColor: '#F8FAFC', borderRadius: 4 },
    infoRow: { flexDirection: 'row', marginBottom: 4 },
    infoLabel: { width: 100, fontWeight: 'bold', color: '#013880' },
    infoValue: { flex: 1 },

    // TABLE
    tableHeader: { flexDirection: 'row', backgroundColor: '#013880', color: 'white', padding: 8, fontSize: 10, fontWeight: 'bold' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', padding: 8, fontSize: 10 },
    colYear: { width: '15%', textAlign: 'center' },
    colActivity: { width: '55%' },
    colCategory: { width: '30%', textAlign: 'right' },

    // FOOTER
    footer: { marginTop: 50, marginLeft: 'auto', width: 200, textAlign: 'center' },
    signatureLine: { marginTop: 60, borderBottomWidth: 1, borderBottomColor: 'black' },

    // WATERMARK
    watermark: { position: 'absolute', top: 300, left: 100, opacity: 0.03, transform: 'rotate(-45deg)', fontSize: 80, color: '#013880', zIndex: -1 }
});

interface TranscriptProps {
    student: { name: string; nrp: string; department: string; cohort: number };
    activities: any[];
}

export const TranscriptDocument = ({ student, activities }: TranscriptProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* 1. BRANDING: LAMBANG BUNDAR (Official Seal) - Dynamic */}
            {/* Note: React-PDF supports remote URLs. */}
            {/* We use specific CORS proxy or direct link if permitted. drive.google.com/uc is usually fine. */}
            <View style={styles.header}>
                <Image src={ASSETS.its.lambang} style={styles.logo} />
                <View style={styles.institutionContainer}>
                    <Text style={styles.institutionName}>Institut Teknologi</Text>
                    <Text style={styles.institutionName}>Sepuluh Nopember</Text>
                    <Text style={styles.documentTitle}>TRANSKRIP PENGEMBANGAN SDM</Text>
                </View>
            </View>

            {/* 2. STUDENT INFO */}
            <View style={styles.infoContainer}>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Nama</Text><Text style={styles.infoValue}>: {student.name}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>NRP</Text><Text style={styles.infoValue}>: {student.nrp}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Departemen</Text><Text style={styles.infoValue}>: {student.department}</Text></View>
                <View style={styles.infoRow}><Text style={styles.infoLabel}>Angkatan</Text><Text style={styles.infoValue}>: {student.cohort}</Text></View>
            </View>

            {/* 3. TABLE OF ACTIVITIES */}
            <View>
                <View style={styles.tableHeader}>
                    <Text style={styles.colYear}>Tahun</Text>
                    <Text style={styles.colActivity}>Nama Kegiatan / Prestasi</Text>
                    <Text style={styles.colCategory}>Dimensi Pengembangan</Text>
                </View>

                {activities.length > 0 ? activities.map((act, i) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={styles.colYear}>{new Date(act.activity_date || act.created_at).getFullYear()}</Text>
                        <Text style={styles.colActivity}>{act.title}</Text>
                        <Text style={styles.colCategory}>{act.category}</Text>
                    </View>
                )) : (
                    <View style={[styles.tableRow, { padding: 20, justifyContent: 'center' }]}>
                        <Text style={{ color: '#999', fontStyle: 'italic' }}>Belum ada aktivitas terekam.</Text>
                    </View>
                )}
            </View>

            {/* 4. LEGAL SIGNATURE */}
            <View style={styles.footer}>
                <Text>Surabaya, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                <Text style={{ marginTop: 5, fontSize: 10 }}>a.n. Direktur Kemahasiswaan</Text>
                <Text style={{ fontSize: 10 }}>Kasubdit Pengembangan Karakter</Text>

                {/* Space Tanda Tangan */}
                <View style={styles.signatureLine} />

                <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Dr. Eng. Nama Pejabat, S.T.</Text>
                <Text style={{ fontSize: 9 }}>NIP. 19800101 200501 1 001</Text>
            </View>

            <Text style={styles.watermark}>OFFICIAL DOCUMENT</Text>
        </Page>
    </Document>
);
