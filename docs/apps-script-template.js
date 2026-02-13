/**
 * ============================================================
 *  PPSDM KMITS — Google Apps Script Template
 *  Deploy this at script.google.com for your spreadsheet.
 * ============================================================
 *
 *  SETUP:
 *  1. Open your PPSDM spreadsheet in Google Sheets
 *  2. Extensions → Apps Script
 *  3. Paste this entire file
 *  4. Update WEBHOOK_URL and WEBHOOK_SECRET below
 *  5. Save → Deploy → Web app → Execute as "Me", Anyone
 *  6. Add an "onEdit" trigger: Triggers → Add → onEdit
 */

// ─── Configuration ───────────────────────────────────────────────

const CONFIG = {
    WEBHOOK_URL: 'https://ppsdm-kmits.vercel.app/api/sheets/webhook',
    WEBHOOK_SECRET: 'your-webhook-secret-key', // Must match env WEBHOOK_SECRET
    SHEET_NAMES: ['Assessment', 'Activities', 'Members', 'Finances', 'Knowledge', 'Settings'],
};

// ─── doGet: JSON API endpoint ────────────────────────────────────

function doGet(e) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = e.parameter.sheet || 'Activities';
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ error: 'Sheet not found: ' + sheetName })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1).map(function (row) {
        const obj = {};
        headers.forEach(function (header, i) {
            obj[header] = row[i];
        });
        return obj;
    });

    return ContentService.createTextOutput(
        JSON.stringify({
            success: true,
            sheetName: sheetName,
            totalRecords: rows.length,
            data: rows,
        })
    ).setMimeType(ContentService.MimeType.JSON);
}

// ─── onEdit: Webhook trigger ─────────────────────────────────────

function onEditTrigger(e) {
    try {
        var sheetName = e.source.getActiveSheet().getName();

        // Only notify if it's one of our managed sheets
        if (CONFIG.SHEET_NAMES.indexOf(sheetName) === -1) return;

        UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({
                sheetName: sheetName,
                secret: CONFIG.WEBHOOK_SECRET,
                editedBy: Session.getActiveUser().getEmail(),
                timestamp: new Date().toISOString(),
            }),
            muteHttpExceptions: true,
        });

        Logger.log('Webhook sent for sheet: ' + sheetName);
    } catch (err) {
        Logger.log('Webhook error: ' + err.message);
    }
}

// ─── createPPSDMSpreadsheet: One-click setup ─────────────────────

function createPPSDMSpreadsheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Assessment sheet
    var assessmentHeaders = [
        'ID', 'Dimensi', 'Subdimensi', 'Pertanyaan', 'Tipe',
        'Opsi', 'Bobot', 'Sumber', 'Status',
    ];

    // Activities sheet
    var activitiesHeaders = [
        'ID', 'Nama Kegiatan', 'Tanggal', 'Lokasi', 'Penyelenggara',
        'Peserta', 'Anggaran', 'Pengeluaran', 'Dokumen', 'Status', 'Foto',
    ];

    // Members sheet
    var membersHeaders = [
        'NIM', 'Nama', 'Email', 'Angkatan', 'Departemen',
        'Posisi', 'Divisi', 'Skill', 'Proyek', 'Skor Assessment', 'Terakhir Aktif',
    ];

    // Finances sheet
    var financesHeaders = [
        'ID Transaksi', 'Tanggal', 'Deskripsi', 'Kategori', 'Jumlah',
        'Metode Pembayaran', 'Bukti', 'Disetujui', 'Kode Anggaran',
    ];

    // Knowledge sheet
    var knowledgeHeaders = [
        'ID', 'Judul', 'Tipe', 'Kategori', 'Tingkat',
        'Durasi', 'Pembuat', 'Link', 'Tag', 'Rating', 'Unduhan',
    ];

    // Settings sheet
    var settingsHeaders = ['Key', 'Value', 'Deskripsi'];

    var sheetsConfig = [
        { name: 'Assessment', headers: assessmentHeaders },
        { name: 'Activities', headers: activitiesHeaders },
        { name: 'Members', headers: membersHeaders },
        { name: 'Finances', headers: financesHeaders },
        { name: 'Knowledge', headers: knowledgeHeaders },
        { name: 'Settings', headers: settingsHeaders },
    ];

    sheetsConfig.forEach(function (cfg) {
        var sheet = ss.getSheetByName(cfg.name);
        if (!sheet) {
            sheet = ss.insertSheet(cfg.name);
        }

        // Write headers if empty
        if (sheet.getLastRow() === 0) {
            sheet.getRange(1, 1, 1, cfg.headers.length).setValues([cfg.headers]);

            // Format header row
            var headerRange = sheet.getRange(1, 1, 1, cfg.headers.length);
            headerRange.setFontWeight('bold');
            headerRange.setBackground('#1a73e8');
            headerRange.setFontColor('#ffffff');
            sheet.setFrozenRows(1);

            // Auto-resize columns
            for (var i = 1; i <= cfg.headers.length; i++) {
                sheet.autoResizeColumn(i);
            }
        }
    });

    // Add sample Settings data
    var settingsSheet = ss.getSheetByName('Settings');
    if (settingsSheet.getLastRow() <= 1) {
        settingsSheet.getRange(2, 1, 3, 3).setValues([
            ['SITE_NAME', 'PPSDM KMITS', 'Nama situs'],
            ['CACHE_TTL', '300', 'TTL cache dalam detik'],
            ['MAINTENANCE_MODE', 'false', 'Mode maintenance'],
        ]);
    }

    SpreadsheetApp.getUi().alert(
        '✅ PPSDM Spreadsheet berhasil dibuat!\n\n' +
        'Sheets yang dibuat: ' + sheetsConfig.map(function (s) { return s.name; }).join(', ') + '\n\n' +
        'Selanjutnya:\n' +
        '1. Deploy sebagai Web App\n' +
        '2. Tambahkan trigger onEdit → onEditTrigger'
    );
}
