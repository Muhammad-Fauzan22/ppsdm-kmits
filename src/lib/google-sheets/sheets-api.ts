/**
 * Sheets API — High-Level Data Access Layer
 *
 * Provides typed, validated, transformed data from Google Sheets.
 * Falls back to empty arrays if Sheets API is unavailable.
 */

import {
    SHEET_NAMES,
    type ActivityItem,
    type ParsedActivity,
    type MemberItem,
    type ParsedMember,
    type FinanceItem,
    type FinanceSummary,
    type KnowledgeItem,
    type ParsedKnowledge,
    type AssessmentItem,
    type SettingItem,
} from './sheets-types';

// ─── Helpers ─────────────────────────────────────────────────────

function parsePipeSeparated(value: string | undefined | null): string[] {
    if (!value || typeof value !== 'string') return [];
    return value.split('|').map((s) => s.trim()).filter(Boolean);
}

function parseScores(raw: string | undefined | null): Record<string, number> {
    const scores: Record<string, number> = {};
    if (!raw) return scores;
    raw.split('|').forEach((pair) => {
        const [key, val] = pair.split(':');
        if (key && val) scores[key.trim()] = parseFloat(val) || 0;
    });
    return scores;
}

function safeNumber(val: any): number {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}

// ─── Service Instance (lazy) ─────────────────────────────────────

async function getService() {
    const { GoogleSheetsService } = await import('./google-sheets.service');
    return GoogleSheetsService.getInstance();
}

function getSpreadsheetId(): string {
    return process.env.SPREADSHEET_ID || process.env.GOOGLE_SHEETS_ID || '';
}

async function fetchSheet<T>(sheetName: string): Promise<T[]> {
    try {
        const service = await getService();
        const id = getSpreadsheetId();
        if (!id) {
            console.warn(`[sheets-api] No SPREADSHEET_ID configured`);
            return [];
        }
        return (await service.getSheetData(id, sheetName)) as T[];
    } catch (err) {
        console.error(`[sheets-api] Failed to fetch "${sheetName}":`, err);
        return [];
    }
}

// ─── Activities ──────────────────────────────────────────────────

export async function getActivities(): Promise<ParsedActivity[]> {
    const raw = await fetchSheet<ActivityItem>(SHEET_NAMES.ACTIVITIES);
    return raw.map((item) => ({
        ...item,
        Anggaran: safeNumber(item.Anggaran),
        Pengeluaran: safeNumber(item.Pengeluaran),
        Peserta: parsePipeSeparated(item.Peserta as unknown as string),
        selisihAnggaran: safeNumber(item.Anggaran) - safeNumber(item.Pengeluaran),
    }));
}

export async function getActivitiesByStatus(
    status: ActivityItem['Status']
): Promise<ParsedActivity[]> {
    const all = await getActivities();
    return all.filter((a) => a.Status === status);
}

// ─── Members ─────────────────────────────────────────────────────

export async function getMembers(): Promise<ParsedMember[]> {
    const raw = await fetchSheet<MemberItem>(SHEET_NAMES.MEMBERS);
    return raw.map((m) => {
        const skorAssessment = parseScores(m['Skor Assessment']);
        const values = Object.values(skorAssessment);
        const skorRataRata = values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;

        return {
            ...m,
            Skill: parsePipeSeparated(m.Skill as unknown as string),
            Proyek: m.Proyek
                ? String(m.Proyek).split(',').map((p) => p.trim()).filter(Boolean)
                : [],
            skorAssessment,
            skorRataRata: Math.round(skorRataRata * 10) / 10,
        };
    });
}

export async function getMemberByNim(nim: string): Promise<ParsedMember | null> {
    const all = await getMembers();
    return all.find((m) => m.NIM === nim) || null;
}

// ─── Finances ────────────────────────────────────────────────────

export async function getFinances(): Promise<FinanceItem[]> {
    const raw = await fetchSheet<FinanceItem>(SHEET_NAMES.FINANCES);
    return raw.map((f) => ({
        ...f,
        Jumlah: safeNumber(f.Jumlah),
    }));
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
    const data = await getFinances();

    const totalPemasukan = data
        .filter((f) => f.Kategori === 'Pemasukan')
        .reduce((sum, f) => sum + safeNumber(f.Jumlah), 0);

    const totalPengeluaran = data
        .filter((f) => f.Kategori !== 'Pemasukan')
        .reduce((sum, f) => sum + safeNumber(f.Jumlah), 0);

    const perKategori: Record<string, number> = {};
    data.forEach((f) => {
        const cat = f.Kategori || 'Lainnya';
        perKategori[cat] = (perKategori[cat] || 0) + safeNumber(f.Jumlah);
    });

    return {
        totalPemasukan,
        totalPengeluaran,
        saldo: totalPemasukan - totalPengeluaran,
        perKategori,
        transaksiTerakhir: data.slice(-5).reverse(),
    };
}

// ─── Knowledge ───────────────────────────────────────────────────

export async function getKnowledgeResources(): Promise<ParsedKnowledge[]> {
    const raw = await fetchSheet<KnowledgeItem>(SHEET_NAMES.KNOWLEDGE);
    return raw.map((k) => ({
        ...k,
        Rating: safeNumber(k.Rating),
        Unduhan: safeNumber(k.Unduhan),
        Tag: parsePipeSeparated(k.Tag as unknown as string),
    }));
}

export async function getKnowledgeByCategory(
    category: string
): Promise<ParsedKnowledge[]> {
    const all = await getKnowledgeResources();
    return all.filter((k) => k.Kategori?.toLowerCase() === category.toLowerCase());
}

// ─── Assessments ─────────────────────────────────────────────────

export async function getAssessmentItems(): Promise<AssessmentItem[]> {
    const raw = await fetchSheet<AssessmentItem>(SHEET_NAMES.ASSESSMENT);
    return raw.map((a) => ({
        ...a,
        Bobot: safeNumber(a.Bobot),
    }));
}

export async function getAssessmentsByDimension(
    dimension: string
): Promise<AssessmentItem[]> {
    const all = await getAssessmentItems();
    return all.filter((a) => a.Dimensi?.toLowerCase() === dimension.toLowerCase());
}

// ─── Settings ────────────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, string>> {
    const raw = await fetchSheet<SettingItem>(SHEET_NAMES.SETTINGS);
    const map: Record<string, string> = {};
    raw.forEach((s) => {
        if (s.Key) map[s.Key] = s.Value || '';
    });
    return map;
}

// ─── Cache Management ────────────────────────────────────────────

export async function invalidateSheetCache(sheetName?: string): Promise<void> {
    try {
        const { deleteFromRedis } = await import('../redis');
        const id = getSpreadsheetId();

        if (sheetName) {
            await deleteFromRedis(`sheet:${id}:${sheetName}`);
        } else {
            // Invalidate all sheet caches
            const sheets = Object.values(SHEET_NAMES);
            await Promise.all(
                sheets.map((name) => deleteFromRedis(`sheet:${id}:${name}`))
            );
        }
    } catch (err) {
        console.error('[sheets-api] Cache invalidation failed:', err);
    }
}
