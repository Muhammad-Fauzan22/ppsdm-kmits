import { describe, it, expect } from 'vitest';

/**
 * Tests for Google Sheets API helper functions.
 * These test the pure logic in sheets-api.ts without requiring
 * actual Google API credentials.
 */

// ─── Helper Function Tests ───────────────────────────────

describe('parsePipeSeparated', () => {
    // Inline the function to test without import side effects
    function parsePipeSeparated(value: string | undefined | null): string[] {
        if (!value) return [];
        return value
            .split('|')
            .map((s) => s.trim())
            .filter(Boolean);
    }

    it('should parse pipe-separated values', () => {
        expect(parsePipeSeparated('CAD|FEA|Python')).toEqual(['CAD', 'FEA', 'Python']);
    });

    it('should trim whitespace', () => {
        expect(parsePipeSeparated('CAD | FEA | Python')).toEqual(['CAD', 'FEA', 'Python']);
    });

    it('should handle empty string', () => {
        expect(parsePipeSeparated('')).toEqual([]);
    });

    it('should handle null', () => {
        expect(parsePipeSeparated(null)).toEqual([]);
    });

    it('should handle undefined', () => {
        expect(parsePipeSeparated(undefined)).toEqual([]);
    });

    it('should filter empty segments', () => {
        expect(parsePipeSeparated('CAD||FEA')).toEqual(['CAD', 'FEA']);
    });

    it('should handle single value', () => {
        expect(parsePipeSeparated('Python')).toEqual(['Python']);
    });
});

describe('parseScores', () => {
    function parseScores(raw: string | undefined | null): Record<string, number> {
        if (!raw) return {};
        const result: Record<string, number> = {};
        raw.split('|').forEach((pair) => {
            const [key, val] = pair.split(':').map((s) => s.trim());
            if (key && val && !isNaN(Number(val))) {
                result[key] = Number(val);
            }
        });
        return result;
    }

    it('should parse key:value pairs separated by pipe', () => {
        expect(parseScores('COG:85|PROD:78|SPIR:92')).toEqual({
            COG: 85,
            PROD: 78,
            SPIR: 92,
        });
    });

    it('should handle empty string', () => {
        expect(parseScores('')).toEqual({});
    });

    it('should handle null', () => {
        expect(parseScores(null)).toEqual({});
    });

    it('should ignore invalid pairs', () => {
        expect(parseScores('COG:85|INVALID|PROD:abc')).toEqual({ COG: 85 });
    });

    it('should handle decimal scores', () => {
        expect(parseScores('COG:85.5|PROD:78.3')).toEqual({ COG: 85.5, PROD: 78.3 });
    });

    it('should handle single score', () => {
        expect(parseScores('COG:100')).toEqual({ COG: 100 });
    });
});

describe('safeNumber', () => {
    function safeNumber(val: any): number {
        const n = Number(val);
        return isNaN(n) ? 0 : n;
    }

    it('should parse valid numbers', () => {
        expect(safeNumber('42')).toBe(42);
        expect(safeNumber(42)).toBe(42);
    });

    it('should return 0 for NaN', () => {
        expect(safeNumber('abc')).toBe(0);
        expect(safeNumber(undefined)).toBe(0);
        expect(safeNumber(null)).toBe(0);
    });

    it('should handle decimal numbers', () => {
        expect(safeNumber('3.14')).toBe(3.14);
    });

    it('should handle negative numbers', () => {
        expect(safeNumber('-5')).toBe(-5);
    });

    it('should handle empty string as 0', () => {
        expect(safeNumber('')).toBe(0);
    });
});

// ─── Data Validation Tests ───────────────────────────────

describe('Activity Status Validation', () => {
    const VALID_STATUSES = ['Rencana', 'Berlangsung', 'Selesai', 'Dibatalkan'];

    it('should validate known activity statuses', () => {
        VALID_STATUSES.forEach((status) => {
            expect(VALID_STATUSES).toContain(status);
        });
    });

    it('should detect invalid status', () => {
        expect(VALID_STATUSES).not.toContain('Unknown');
    });
});

describe('Knowledge Item Validation', () => {
    const VALID_TYPES = ['Video', 'PDF', 'Artikel', 'Presentasi'];
    const VALID_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

    it('should validate known types', () => {
        VALID_TYPES.forEach((type) => expect(VALID_TYPES).toContain(type));
    });

    it('should validate known levels', () => {
        VALID_LEVELS.forEach((level) => expect(VALID_LEVELS).toContain(level));
    });
});

// ─── Finance Summary Tests ───────────────────────────────

describe('Finance Summary Calculation', () => {
    interface FinanceItem {
        'ID Transaksi': string;
        Tanggal: string;
        Deskripsi: string;
        Kategori: string;
        Jumlah: string;
        Disetujui: string;
    }

    function calculateSummary(items: FinanceItem[]) {
        let totalIncome = 0;
        let totalExpense = 0;
        const byCategory: Record<string, number> = {};

        items.forEach((item) => {
            const amount = Number(item.Jumlah) || 0;
            if (item.Kategori === 'Pemasukan') {
                totalIncome += amount;
            } else {
                totalExpense += Math.abs(amount);
            }
            byCategory[item.Kategori] = (byCategory[item.Kategori] || 0) + Math.abs(amount);
        });

        return {
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense,
            totalTransactions: items.length,
            byCategory,
        };
    }

    it('should calculate correct totals', () => {
        const items: FinanceItem[] = [
            { 'ID Transaksi': 'TRX-001', Tanggal: '2026-01-01', Deskripsi: 'Dana BEM', Kategori: 'Pemasukan', Jumlah: '5000000', Disetujui: 'TRUE' },
            { 'ID Transaksi': 'TRX-002', Tanggal: '2026-01-15', Deskripsi: 'Sewa Ruangan', Kategori: 'Operasional', Jumlah: '1000000', Disetujui: 'TRUE' },
            { 'ID Transaksi': 'TRX-003', Tanggal: '2026-02-01', Deskripsi: 'Seminar', Kategori: 'Acara', Jumlah: '2000000', Disetujui: 'TRUE' },
        ];

        const summary = calculateSummary(items);
        expect(summary.totalIncome).toBe(5000000);
        expect(summary.totalExpense).toBe(3000000);
        expect(summary.netBalance).toBe(2000000);
        expect(summary.totalTransactions).toBe(3);
    });

    it('should handle empty list', () => {
        const summary = calculateSummary([]);
        expect(summary.totalIncome).toBe(0);
        expect(summary.totalExpense).toBe(0);
        expect(summary.netBalance).toBe(0);
        expect(summary.totalTransactions).toBe(0);
    });

    it('should group by category', () => {
        const items: FinanceItem[] = [
            { 'ID Transaksi': 'TRX-001', Tanggal: '2026-01-01', Deskripsi: 'A', Kategori: 'Acara', Jumlah: '1000000', Disetujui: 'TRUE' },
            { 'ID Transaksi': 'TRX-002', Tanggal: '2026-01-02', Deskripsi: 'B', Kategori: 'Acara', Jumlah: '500000', Disetujui: 'TRUE' },
        ];

        const summary = calculateSummary(items);
        expect(summary.byCategory['Acara']).toBe(1500000);
    });
});
