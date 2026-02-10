# PPSDM KMITS Admin Panel - Panduan Penggunaan

## Overview

Admin Panel PPSDM KMITS adalah interface berbasis spreadsheet yang memungkinkan pengelolaan konten website secara real-time dengan integrasi Google Sheets.

## Fitur Utama

### 1. Live Spreadsheet Editor

Editor spreadsheet dengan fitur:
- **Real-time preview** - Perubahan langsung terlihat di website
- **Validation rules** - Validasi data dengan color coding
- **Template columns** - Konsistensi format kolom
- **Search & filter** - Cari dan filter data dengan mudah
- **Keyboard navigation** - Navigasi cepat dengan keyboard

#### Validation Rules yang Tersedia:
- `required` - Field wajib diisi
- `email` - Validasi format email
- `url` - Validasi format URL
- `number` - Validasi angka
- `date` - Validasi tanggal
- `enum` - Pilihan dari daftar tertentu
- `regex` - Validasi dengan pattern regex

#### Color Coding:
- 🟡 **Kuning** - Cell yang dimodifikasi
- 🔴 **Merah** - Cell dengan data tidak valid
- ⚪ **Putih/Abu** - Cell normal
- 🔒 **Gembok** - Read-only column

### 2. One-Click Publish

Tombol publish dengan opsi:
- **Publish to Website** - Generate semua pages otomatis
- **Notify Members** - Kirim notifikasi ke semua members
- **Create Backup** - Backup versi sebelum publish
- **Generate Sitemap** - Update sitemap untuk SEO
- **Clear Cache** - Bersihkan CDN dan browser cache

#### Version History:
- Tracking semua versi yang dipublish
- Restore ke versi sebelumnya
- View perubahan antar versi

### 3. Visual Template Builder

Builder template dengan drag-and-drop:
- **9 Component Types**:
  - 🎯 Hero Section
  - 📝 Page Header
  - 📄 Text Block
  - 🖼️ Image
  - 📋 List
  - 📊 Table
  - 🃏 Card
  - 📝 Form
  - 🔗 Footer

#### Fitur:
- Map spreadsheet columns ke component fields
- Live preview di desktop dan mobile
- Save dan load templates
- Export sebagai website page

### 4. Automated Report Generator

Generator laporan otomatis:
- **Report Templates**:
  - 📊 Summary Report (PDF)
  - 📋 Detailed Report (PDF)
  - 📽️ Presentation (PPT)
  - 📈 Analytics Report (PDF)
  - 📁 Data Export (Excel)

#### Fitur:
- Select data range dari spreadsheet
- Choose columns untuk diinclude
- Schedule automated reports (daily/weekly/monthly)
- Download reports langsung

## Struktur File

```
ppsdm-kmits/
├── src/
│   ├── app/
│   │   └── admin/
│   │       └── spreadsheet-editor/
│   │           └── page.tsx          # Main admin page
│   ├── components/
│   │   └── admin/
│   │       ├── SpreadsheetEditor.tsx # Spreadsheet editor component
│   │       ├── PublishButton.tsx     # Publish button component
│   │       ├── TemplateBuilder.tsx   # Template builder component
│   │       ├── ReportGenerator.tsx   # Report generator component
│   │       └── index.ts              # Export index
│   └── lib/
│       └── google-sheets/
│           ├── google-sheets.service.ts # Google Sheets service
│           └── sheet-parser-engine.ts   # Sheet parser engine
└── docs/
    └── ADMIN_PANEL_GUIDE.md          # Dokumentasi ini
```

## API Routes

### POST `/api/admin/publish`

Publish spreadsheet data ke website.

**Request Body:**
```json
{
  "spreadsheetId": "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM",
  "sheetName": "Sheet1",
  "notifyMembers": true,
  "createBackup": true,
  "generateSitemap": true,
  "clearCache": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully published to website",
  "data": {
    "rowsProcessed": 100,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST `/api/admin/export-template`

Export template sebagai website page.

**Request Body:**
```json
{
  "template": {
    "id": "template-123",
    "name": "My Template",
    "components": [...]
  },
  "spreadsheetId": "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM",
  "sheetName": "Sheet1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template exported successfully",
  "url": "/pages/generated/my-template.tsx",
  "metadata": {
    "templateName": "My Template",
    "componentsCount": 5,
    "rowsUsed": 100
  }
}
```

### POST `/api/admin/generate-report`

Generate report dari data spreadsheet.

**Request Body:**
```json
{
  "template": {
    "id": "summary",
    "name": "Summary Report",
    "type": "pdf",
    "config": {
      "includeCharts": true,
      "includeTables": true,
      "includeSummary": true
    }
  },
  "spreadsheetId": "1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM",
  "sheetName": "Sheet1",
  "range": {
    "startRow": 0,
    "endRow": 99
  },
  "columns": ["Title", "Description", "Status"],
  "data": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "url": "/reports/summary-report-1234567890.pdf",
  "metadata": {
    "format": "PDF",
    "size": "100 rows × 3 columns",
    "includeCharts": true,
    "includeTables": true
  }
}
```

## Environment Variables

Tambahkan ke `.env.local`:

```env
# Google Sheets Configuration
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=your-redirect-uri
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf
```

## Setup Google Sheets API

### 1. Create Google Cloud Project

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru
3. Enable Google Sheets API dan Google Drive API

### 2. Create Service Account

1. Buka IAM & Admin > Service Accounts
2. Create service account
3. Download JSON key file
4. Simpan sebagai `credentials.json`

### 3. Share Spreadsheet

1. Buka Google Sheet yang akan digunakan
2. Share dengan service account email
3. Berikan permission "Editor"

### 4. Configure Environment

Copy `credentials.json` ke root project dan update `.env.local`:

```env
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

## Penggunaan

### Mengakses Admin Panel

Buka browser dan navigasi ke:
```
http://localhost:3000/admin/spreadsheet-editor
```

### Edit Data di Spreadsheet

1. Klik cell yang ingin diedit
2. Ketik nilai baru
3. Tekan Enter atau klik cell lain
4. Cell yang dimodifikasi akan berwarna kuning
5. Klik "Save Changes" untuk menyimpan

### Publish ke Website

1. Klik tombol "Publish to Website"
2. Pilih opsi publish:
   - ✓ Notify Members
   - ✓ Create Backup
   - ✓ Generate Sitemap
   - ✓ Clear Cache
3. Klik "Publish Now"
4. Tunggu proses publish selesai

### Build Template

1. Buka tab "Template Builder"
2. Klik component dari panel kiri
3. Map spreadsheet columns ke component fields
4. Lihat live preview di panel kanan
5. Klik "Save Template" untuk menyimpan
6. Klik "Export as Page" untuk generate page

### Generate Report

1. Buka tab "Report Generator"
2. Pilih report template
3. Set data range (start row dan end row)
4. Select columns yang ingin diinclude
5. Klik "Generate Report"
6. Report akan otomatis didownload

### Schedule Automated Report

1. Klik "Schedule Report" button
2. Masukkan nama schedule
3. Pilih frequency (daily/weekly/monthly)
4. Klik "Create Schedule"
5. Report akan otomatis digenerate sesuai schedule

## Troubleshooting

### Error: "Failed to load sheet data"

**Solusi:**
- Pastikan `GOOGLE_APPLICATION_CREDENTIALS` path benar
- Pastikan service account memiliki akses ke spreadsheet
- Cek apakah Google Sheets API sudah di-enable

### Error: "Publish failed"

**Solusi:**
- Pastikan semua data valid (tidak ada cell merah)
- Cek koneksi internet
- Pastikan API routes sudah benar

### Error: "Export failed"

**Solusi:**
- Pastikan template memiliki minimal satu component
- Pastikan semua fields sudah di-map ke columns
- Cek apakah folder `pages/generated` ada

### Error: "Report generation failed"

**Solusi:**
- Pastikan data range valid
- Pastikan minimal satu column dipilih
- Cek apakah library report generation sudah terinstall

## Best Practices

### 1. Data Validation

- Selalu gunakan validation rules untuk kolom penting
- Pastikan semua required fields diisi
- Validasi data sebelum publish

### 2. Version Control

- Selalu create backup sebelum publish
- Gunakan version history untuk tracking perubahan
- Restore ke versi sebelumnya jika ada error

### 3. Template Management

- Beri nama template yang deskriptif
- Save template yang sering digunakan
- Reuse template untuk halaman serupa

### 4. Report Scheduling

- Schedule reports di waktu low traffic
- Gunakan frequency yang sesuai dengan kebutuhan
- Monitor report generation logs

## Security Considerations

1. **Environment Variables** - Jangan commit `.env.local` ke git
2. **Service Account** - Limit permissions service account
3. **API Routes** - Implement authentication dan authorization
4. **Data Validation** - Validasi semua input data
5. **Rate Limiting** - Implement rate limiting untuk API

## Future Enhancements

- [ ] Multi-language support
- [ ] Advanced filtering dan sorting
- [ ] Custom validation rules
- [ ] Real-time collaboration
- [ ] Undo/redo functionality
- [ ] Import/Export templates
- [ ] Advanced report templates
- [ ] Email notifications
- [ ] Webhook integrations
- [ ] Audit logging

## Support

Untuk bantuan atau pertanyaan:
- Email: support@ppsdm-kmits.its.ac.id
- Documentation: `/docs`
- Issue Tracker: GitHub Issues

## Changelog

### v1.0.0 (2024-01-01)
- Initial release
- Live Spreadsheet Editor
- One-Click Publish
- Visual Template Builder
- Automated Report Generator
