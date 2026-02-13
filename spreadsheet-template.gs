/**
 * ============================================================
 *  PPSDM KMITS — Google Apps Script Template (Enhanced)
 *  Deploy this at script.google.com for your spreadsheet.
 * ============================================================
 *
 *  SETUP:
 *  1. Open your PPSDM spreadsheet in Google Sheets
 *  2. Extensions → Apps Script
 *  3. Paste this entire file
 *  4. Update WEBHOOK_URL and WEBHOOK_SECRET below
 *  5. Save → Deploy → Web app → Execute as "Me", Anyone
 *  6. Add an "onEdit" trigger: Triggers → Add → onEdit → onEditTrigger
 *
 *  SHEETS CREATED:
 *  - Assessment    : Item-item asesmen 9 dimensi
 *  - Activities    : Daftar kegiatan himpunan
 *  - Members       : Data anggota
 *  - Finances      : Transaksi keuangan
 *  - Knowledge     : Koleksi sumber belajar
 *  - Settings      : Konfigurasi website
 *  - TIM_HIMPUNAN  : Profil pengurus himpunan
 *  - PETUNJUK      : Panduan penggunaan spreadsheet
 */

// ─── Configuration ───────────────────────────────────────────────

var CONFIG = {
    WEBHOOK_URL: 'https://ppsdm-kmits.vercel.app/api/sheets/webhook',
    WEBHOOK_SECRET: 'your-webhook-secret-key', // Must match env WEBHOOK_SECRET
    SHEET_NAMES: [
        'Assessment', 'Activities', 'Members', 'Finances',
        'Knowledge', 'Settings', 'TIM_HIMPUNAN'
    ],
};

// ─── Custom Menu ─────────────────────────────────────────────────

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('🎓 PPSDM KMITS')
        .addItem('📋 Buat Template Lengkap', 'createPPSDMSpreadsheet')
        .addItem('🔄 Sinkronkan ke Website', 'manualSync')
        .addItem('📖 Buka Petunjuk', 'openPetunjuk')
        .addToUi();
}

function openPetunjuk() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('PETUNJUK');
    if (sheet) {
        ss.setActiveSheet(sheet);
    } else {
        SpreadsheetApp.getUi().alert('Sheet PETUNJUK belum dibuat. Jalankan "Buat Template Lengkap" terlebih dahulu.');
    }
}

function manualSync() {
    try {
        var timestamp = new Date().toISOString();
        var payload = 'all:' + timestamp;

        // Compute HMAC-SHA256 signature
        var signature = computeHmac(payload, CONFIG.WEBHOOK_SECRET);

        UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({
                sheetName: null,
                timestamp: timestamp,
                signature: signature,
                editedBy: Session.getActiveUser().getEmail(),
            }),
            muteHttpExceptions: true,
        });

        SpreadsheetApp.getUi().alert('✅ Data berhasil disinkronkan ke website!');
    } catch (err) {
        SpreadsheetApp.getUi().alert('❌ Gagal sinkronisasi: ' + err.message);
    }
}

// ─── HMAC Helper ─────────────────────────────────────────────────

function computeHmac(message, secret) {
    var signature = Utilities.computeHmacSha256Signature(message, secret);
    return signature.map(function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

// ─── doGet: JSON API endpoint ────────────────────────────────────

function doGet(e) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = e.parameter.sheet || 'Activities';
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
        return ContentService.createTextOutput(
            JSON.stringify({ error: 'Sheet not found: ' + sheetName })
        ).setMimeType(ContentService.MimeType.JSON);
    }

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1).map(function (row) {
        var obj = {};
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

        var timestamp = new Date().toISOString();
        var payload = (sheetName || '') + ':' + timestamp;
        var signature = computeHmac(payload, CONFIG.WEBHOOK_SECRET);

        UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({
                sheetName: sheetName,
                timestamp: timestamp,
                signature: signature,
                editedBy: Session.getActiveUser().getEmail(),
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

    // ── Sheet Definitions ──

    var sheetsConfig = [
        {
            name: 'Assessment',
            headers: ['ID', 'Dimensi', 'Subdimensi', 'Pertanyaan', 'Tipe', 'Opsi', 'Bobot', 'Sumber', 'Status'],
            notes: {
                'ID': 'Format: COG-01, PROD-01, dll',
                'Dimensi': 'Nama dimensi: Kognitif, Produktivitas, dll',
                'Subdimensi': 'Aspek spesifik dalam dimensi',
                'Pertanyaan': 'Teks pertanyaan asesmen',
                'Tipe': 'likert_5 | multiple_choice | open_ended',
                'Opsi': 'Opsi jawaban dipisahkan tanda pipa (|)',
                'Bobot': 'Bobot pertanyaan (angka)',
                'Sumber': 'Referensi/sumber ilmiah',
                'Status': 'Aktif | Nonaktif'
            },
            tabColor: '#4285f4'
        },
        {
            name: 'Activities',
            headers: ['ID', 'Nama Kegiatan', 'Tanggal', 'Lokasi', 'Penyelenggara', 'Peserta', 'Anggaran', 'Pengeluaran', 'Dokumen', 'Status', 'Foto'],
            notes: {
                'ID': 'Format: ACT-001, ACT-002, dll',
                'Nama Kegiatan': 'Nama lengkap kegiatan',
                'Tanggal': 'Format: YYYY-MM-DD',
                'Lokasi': 'Tempat pelaksanaan',
                'Penyelenggara': 'Departemen/divisi penyelenggara',
                'Peserta': 'Nama peserta dipisahkan tanda pipa (|)',
                'Anggaran': 'Anggaran yang disetujui (angka)',
                'Pengeluaran': 'Realisasi pengeluaran (angka)',
                'Dokumen': 'Link Google Drive ke dokumen',
                'Status': 'Rencana | Berlangsung | Selesai | Dibatalkan',
                'Foto': 'Link Google Drive ke foto kegiatan'
            },
            tabColor: '#34a853'
        },
        {
            name: 'Members',
            headers: ['NIM', 'Nama', 'Email', 'Angkatan', 'Departemen', 'Posisi', 'Divisi', 'Skill', 'Proyek', 'Skor Assessment', 'Terakhir Aktif'],
            notes: {
                'NIM': 'Nomor Induk Mahasiswa',
                'Nama': 'Nama lengkap',
                'Email': 'Email ITS',
                'Angkatan': 'Tahun masuk, misal: 2023',
                'Departemen': 'Departemen Teknik Mesin',
                'Posisi': 'Jabatan/posisi di himpunan',
                'Divisi': 'Divisi di himpunan',
                'Skill': 'Keahlian dipisahkan tanda pipa (|)',
                'Proyek': 'ID proyek dipisahkan koma (,)',
                'Skor Assessment': 'Format: COG:85|PROD:78|...',
                'Terakhir Aktif': 'Tanggal terakhir aktif (YYYY-MM-DD)'
            },
            tabColor: '#fbbc04'
        },
        {
            name: 'Finances',
            headers: ['ID Transaksi', 'Tanggal', 'Deskripsi', 'Kategori', 'Jumlah', 'Metode Pembayaran', 'Bukti', 'Disetujui', 'Kode Anggaran'],
            notes: {
                'ID Transaksi': 'Format: TRX-001, TRX-002, dll',
                'Tanggal': 'Tanggal transaksi (YYYY-MM-DD)',
                'Deskripsi': 'Deskripsi singkat transaksi',
                'Kategori': 'Pemasukan | Operasional | Acara | Aset | Lainnya',
                'Jumlah': 'Jumlah dalam Rupiah (angka)',
                'Metode Pembayaran': 'Transfer | Tunai | QRIS | dll',
                'Bukti': 'Link Google Drive ke bukti/kwitansi',
                'Disetujui': 'TRUE atau FALSE',
                'Kode Anggaran': 'Kode anggaran terkait'
            },
            tabColor: '#ea4335'
        },
        {
            name: 'Knowledge',
            headers: ['ID', 'Judul', 'Tipe', 'Kategori', 'Tingkat', 'Durasi', 'Pembuat', 'Link', 'Tag', 'Rating', 'Unduhan'],
            notes: {
                'ID': 'Format: RES-001, RES-002, dll',
                'Judul': 'Judul sumber belajar',
                'Tipe': 'Video | PDF | Artikel | Presentasi',
                'Kategori': 'Contoh: CAD, FEA, Termodinamika, dll',
                'Tingkat': 'Beginner | Intermediate | Advanced',
                'Durasi': 'Estimasi waktu belajar',
                'Pembuat': 'Nama pembuat/kontributor',
                'Link': 'URL atau link Google Drive',
                'Tag': 'Tag/label dipisahkan pipa (|)',
                'Rating': 'Rating 1-5',
                'Unduhan': 'Jumlah unduhan (angka)'
            },
            tabColor: '#a142f4'
        },
        {
            name: 'Settings',
            headers: ['Key', 'Value', 'Deskripsi'],
            notes: {
                'Key': 'Nama konfigurasi (huruf kapital, underscore)',
                'Value': 'Nilai konfigurasi',
                'Deskripsi': 'Penjelasan singkat'
            },
            tabColor: '#607d8b'
        },
        {
            name: 'TIM_HIMPUNAN',
            headers: ['Nama', 'NIM', 'Jabatan', 'Divisi', 'Foto', 'Email', 'LinkedIn', 'Instagram', 'Periode', 'Bio'],
            notes: {
                'Nama': 'Nama lengkap pengurus',
                'NIM': 'Nomor Induk Mahasiswa',
                'Jabatan': 'Ketua | Wakil Ketua | Sekretaris | Bendahara | Kepala Divisi | Staff',
                'Divisi': 'Nama divisi di himpunan',
                'Foto': 'Link Google Drive ke foto profil',
                'Email': 'Email yang bisa dihubungi',
                'LinkedIn': 'URL profil LinkedIn',
                'Instagram': 'Username Instagram (tanpa @)',
                'Periode': 'Periode kepengurusan, misal: 2025/2026',
                'Bio': 'Deskripsi singkat (maks 200 karakter)'
            },
            tabColor: '#ff6d00'
        },
    ];

    // ── Create Each Sheet ──

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
            headerRange.setBackground(cfg.tabColor || '#1a73e8');
            headerRange.setFontColor('#ffffff');
            headerRange.setFontSize(10);
            sheet.setFrozenRows(1);

            // Add notes to headers
            if (cfg.notes) {
                cfg.headers.forEach(function (header, i) {
                    if (cfg.notes[header]) {
                        sheet.getRange(1, i + 1).setNote(cfg.notes[header]);
                    }
                });
            }

            // Auto-resize columns
            for (var i = 1; i <= cfg.headers.length; i++) {
                sheet.autoResizeColumn(i);
            }

            // Set tab color
            if (cfg.tabColor) {
                sheet.setTabColor(cfg.tabColor);
            }
        }
    });

    // ── Sample Settings Data ──

    var settingsSheet = ss.getSheetByName('Settings');
    if (settingsSheet && settingsSheet.getLastRow() <= 1) {
        settingsSheet.getRange(2, 1, 5, 3).setValues([
            ['SITE_NAME', 'PPSDM KMITS', 'Nama situs yang ditampilkan'],
            ['CACHE_TTL', '300', 'TTL cache dalam detik'],
            ['MAINTENANCE_MODE', 'false', 'Mode maintenance (true/false)'],
            ['CONTACT_EMAIL', 'ppsdm@km.its.ac.id', 'Email kontak himpunan'],
            ['ACADEMIC_YEAR', '2025/2026', 'Tahun akademik aktif'],
        ]);
    }

    // ── Create PETUNJUK Sheet ──

    createPetunjukSheet(ss);

    SpreadsheetApp.getUi().alert(
        '✅ PPSDM Spreadsheet berhasil dibuat!\n\n' +
        'Sheets yang dibuat:\n' +
        sheetsConfig.map(function (s) { return '  • ' + s.name; }).join('\n') +
        '\n  • PETUNJUK\n\n' +
        'Selanjutnya:\n' +
        '1. Isi data di masing-masing sheet\n' +
        '2. Deploy sebagai Web App\n' +
        '3. Tambahkan trigger onEdit → onEditTrigger'
    );
}

// ─── PETUNJUK Sheet ──────────────────────────────────────────────

function createPetunjukSheet(ss) {
    var sheet = ss.getSheetByName('PETUNJUK');
    if (!sheet) {
        sheet = ss.insertSheet('PETUNJUK');
    }

    // Clear existing content
    sheet.clear();

    // Set column width
    sheet.setColumnWidth(1, 800);

    // Title
    var titleRange = sheet.getRange('A1');
    titleRange.setValue('📖 PANDUAN PENGGUNAAN SPREADSHEET PPSDM KMITS');
    titleRange.setFontSize(16);
    titleRange.setFontWeight('bold');
    titleRange.setBackground('#1a73e8');
    titleRange.setFontColor('#ffffff');

    // Content rows
    var content = [
        [''],
        ['🎯 TUJUAN'],
        ['Spreadsheet ini adalah satu-satunya sumber kebenaran (Single Source of Truth)'],
        ['untuk seluruh data dinamis yang ditampilkan di website PPSDM KMITS.'],
        ['Semua perubahan yang Anda buat di sini akan otomatis tersinkronisasi ke website.'],
        [''],
        ['📋 DAFTAR SHEET'],
        [''],
        ['1. Assessment — Item-item pertanyaan asesmen 9 dimensi pengembangan'],
        ['   Digunakan untuk menampilkan dan mengolah asesmen di website.'],
        ['   Format ID: COG-01, PROD-01, SPIR-01, dll.'],
        [''],
        ['2. Activities — Daftar kegiatan dan aktivitas himpunan'],
        ['   Data ini ditampilkan di halaman Kegiatan website.'],
        ['   Status: Rencana → Berlangsung → Selesai / Dibatalkan'],
        [''],
        ['3. Members — Data anggota himpunan'],
        ['   Berisi profil seluruh anggota beserta skill dan skor assessment.'],
        ['   Skill dipisahkan tanda pipa (|), contoh: CAD|FEA|Python'],
        [''],
        ['4. Finances — Transaksi keuangan himpunan'],
        ['   Untuk transparansi keuangan. Ditampilkan di halaman Transparansi.'],
        ['   Kategori: Pemasukan | Operasional | Acara | Aset | Lainnya'],
        [''],
        ['5. Knowledge — Sumber belajar dan materi edukasi'],
        ['   Koleksi video, PDF, artikel yang bisa diakses mahasiswa.'],
        ['   Tipe: Video | PDF | Artikel | Presentasi'],
        [''],
        ['6. Settings — Konfigurasi website'],
        ['   Berisi pengaturan global seperti nama situs, mode maintenance, dll.'],
        ['   Format: KEY | VALUE | DESKRIPSI'],
        [''],
        ['7. TIM_HIMPUNAN — Profil pengurus himpunan'],
        ['   Ditampilkan di halaman "Tentang Kami" di website.'],
        ['   Sertakan foto, LinkedIn, dan Instagram untuk transparansi.'],
        [''],
        ['⚡ CARA KERJA SINKRONISASI'],
        [''],
        ['• Setiap kali Anda mengedit data di sheet manapun, perubahan akan'],
        ['  otomatis dikirim ke website dalam waktu 5 menit.'],
        ['• Untuk sinkronisasi manual, gunakan menu: PPSDM KMITS → Sinkronkan ke Website'],
        ['• Website menggunakan cache 5 menit untuk performa optimal.'],
        [''],
        ['📝 ATURAN PENTING'],
        [''],
        ['1. JANGAN mengubah nama sheet (harus persis sesuai daftar di atas)'],
        ['2. JANGAN mengubah atau menghapus baris header (baris 1)'],
        ['3. JANGAN menambah kolom baru tanpa koordinasi dengan tim developer'],
        ['4. Gunakan format tanggal: YYYY-MM-DD (contoh: 2026-03-15)'],
        ['5. Untuk field dengan beberapa nilai, gunakan tanda pipa (|) sebagai pemisah'],
        ['6. Pastikan ID bersifat unik dalam setiap sheet'],
        ['7. Link foto/dokumen harus berupa URL lengkap ke Google Drive'],
        [''],
        ['🆘 BANTUAN'],
        [''],
        ['Jika ada kendala atau pertanyaan, hubungi:'],
        ['• Tim Developer PPSDM: ppsdm-dev@km.its.ac.id'],
        ['• Dokumentasi: https://ppsdm-kmits.vercel.app/help'],
    ];

    var range = sheet.getRange(2, 1, content.length, 1);
    range.setValues(content);

    // Format section headers
    var sectionRows = [3, 8, 38, 45, 54];
    sectionRows.forEach(function (row) {
        var cell = sheet.getRange(row, 1);
        cell.setFontWeight('bold');
        cell.setFontSize(12);
        cell.setBackground('#e8f0fe');
    });

    sheet.setTabColor('#00bcd4');
    sheet.setFrozenRows(1);
}
