/**
 * Spreadsheet-First Architecture — Type Definitions
 * All 6 master sheet data types for PPSDM KMITS
 */

// ─── Sheet Name Constants ────────────────────────────────────────
export const SHEET_NAMES = {
    ASSESSMENT: 'Assessment',
    ACTIVITIES: 'Activities',
    MEMBERS: 'Members',
    FINANCES: 'Finances',
    KNOWLEDGE: 'Knowledge',
    SETTINGS: 'Settings',
} as const;

export type SheetName = (typeof SHEET_NAMES)[keyof typeof SHEET_NAMES];

// ─── Assessment Sheet ────────────────────────────────────────────
export interface AssessmentItem {
    ID: string;                // e.g. "COG-01"
    Dimensi: string;           // e.g. "Kognitif"
    Subdimensi: string;        // e.g. "Critical Thinking"
    Pertanyaan: string;        // Question text
    Tipe: 'likert_5' | 'multiple_choice' | 'open_ended';
    Opsi: string;              // Pipe-separated options
    Bobot: number;             // Weight
    Sumber: string;            // Source reference
    Status: 'Aktif' | 'Nonaktif';
}

// ─── Activities Sheet ────────────────────────────────────────────
export interface ActivityItem {
    ID: string;                // e.g. "ACT-001"
    'Nama Kegiatan': string;
    Tanggal: string;           // ISO date string
    Lokasi: string;
    Penyelenggara: string;
    Peserta: string;           // Pipe-separated names
    Anggaran: number;
    Pengeluaran: number;
    Dokumen: string;           // Drive link
    Status: 'Rencana' | 'Berlangsung' | 'Selesai' | 'Dibatalkan';
    Foto: string;              // Photos link
}

/** Parsed activity with arrays instead of pipe-separated strings */
export interface ParsedActivity extends Omit<ActivityItem, 'Peserta'> {
    Peserta: string[];
    selisihAnggaran: number;
}

// ─── Members Sheet ───────────────────────────────────────────────
export interface MemberItem {
    NIM: string;
    Nama: string;
    Email: string;
    Angkatan: string;
    Departemen: string;
    Posisi: string;
    Divisi: string;
    Skill: string;             // Pipe-separated skills
    Proyek: string;            // Comma-separated project IDs
    'Skor Assessment': string; // e.g. "COG:85|PROD:78"
    'Terakhir Aktif': string;
}

export interface ParsedMember extends Omit<MemberItem, 'Skill' | 'Proyek' | 'Skor Assessment'> {
    Skill: string[];
    Proyek: string[];
    skorAssessment: Record<string, number>;
    skorRataRata: number;
}

// ─── Finances Sheet ──────────────────────────────────────────────
export interface FinanceItem {
    'ID Transaksi': string;    // e.g. "TRX-001"
    Tanggal: string;
    Deskripsi: string;
    Kategori: 'Pemasukan' | 'Operasional' | 'Acara' | 'Aset' | 'Lainnya';
    Jumlah: number;
    'Metode Pembayaran': string;
    Bukti: string;             // Drive link to receipt
    Disetujui: string;         // "TRUE" or "FALSE"
    'Kode Anggaran': string;
}

export interface FinanceSummary {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
    perKategori: Record<string, number>;
    transaksiTerakhir: FinanceItem[];
}

// ─── Knowledge Sheet ─────────────────────────────────────────────
export interface KnowledgeItem {
    ID: string;                // e.g. "RES-001"
    Judul: string;
    Tipe: 'Video' | 'PDF' | 'Artikel' | 'Presentasi';
    Kategori: string;          // e.g. "CAD"
    Tingkat: 'Beginner' | 'Intermediate' | 'Advanced';
    Durasi: string;
    Pembuat: string;
    Link: string;
    Tag: string;               // Pipe-separated tags
    Rating: number;
    Unduhan: number;
}

export interface ParsedKnowledge extends Omit<KnowledgeItem, 'Tag'> {
    Tag: string[];
}

// ─── Settings Sheet ──────────────────────────────────────────────
export interface SettingItem {
    Key: string;
    Value: string;
    Deskripsi: string;
}

// ─── API Response Wrappers ───────────────────────────────────────
export interface SheetsApiResponse<T> {
    success: boolean;
    data: T;
    meta: {
        source: 'cache' | 'sheets';
        fetchedAt: string;
        sheetName: string;
        totalRecords: number;
    };
    error?: string;
}
