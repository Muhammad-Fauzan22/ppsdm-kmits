# Panduan Admin PPSDM KMITS
## Panduan Lengkap untuk Pengelola Sistem

---

## 📖 Daftar Isi

1. [Pengantar Admin](#pengantar-admin)
2. [Dashboard Admin](#dashboard-admin)
3. [Manajemen User](#manajemen-user)
4. [Manajemen Kegiatan](#manajemen-kegiatan)
5. [Manajemen Keuangan](#manajemen-keuangan)
6. [Manajemen Assessment](#manajemen-assessment)
7. [Integrasi Google Sheets](#integrasi-google-sheets)
8. [Laporan dan Analytics](#laporan-dan-analytics)
9. [Pengaturan Sistem](#pengaturan-sistem)
10. [Best Practices](#best-practices)

---

## 👨‍💼 Pengantar Admin

### Peran dan Tanggung Jawab Admin

Sebagai Admin PPSDM KMITS, Anda memiliki tanggung jawab penting:

| Tanggung Jawab | Deskripsi |
|----------------|-----------|
| **Manajemen User** | Menambah, mengedit, dan menghapus user |
| **Pengawasan Kegiatan** | Memantau dan menyetujui kegiatan |
| **Manajemen Keuangan** | Mengelola pemasukan dan pengeluaran |
| **Pembuatan Assessment** | Membuat dan mengelola penilaian |
| **Sinkronisasi Data** | Memastikan data tersinkronisasi dengan benar |
| **Laporan** | Membuat dan mengirim laporan berkala |

### Akses Admin

Admin memiliki akses penuh ke semua fitur:

```
📸 [Screenshot: Menu Admin]
```

| Fitur | Akses Admin |
|-------|-------------|
| Dashboard | ✅ Penuh |
| Kegiatan | ✅ Penuh (CRUD) |
| Keuangan | ✅ Penuh |
| Knowledge | ✅ Penuh |
| Assessment | ✅ Penuh |
| Pengaturan | ✅ Penuh |
| User Management | ✅ Penuh |

---

## 📊 Dashboard Admin

### Overview Dashboard

```
📸 [Screenshot: Dashboard Admin]
```

### Widget Dashboard

| Widget | Informasi | Aksi |
|--------|-----------|------|
| **Total Kegiatan** | Jumlah kegiatan aktif | Klik untuk detail |
| **Total Anggota** | Jumlah user terdaftar | Klik untuk daftar |
| **Saldo Kas** | Saldo keuangan saat ini | Klik untuk laporan |
| **Kegiatan Bulan Ini** | Kegiatan bulan berjalan | Klik untuk kalender |
| **Notifikasi** | Alert penting | Klik untuk detail |
| **Sinkronisasi** | Status Google Sheets | Klik untuk sync |

### Melihat Statistik Detail

1. Klik widget yang diinginkan
2. Modal detail akan muncul
3. Gunakan filter untuk spesifikasi data

```
📸 [Screenshot: Modal Detail Widget]
```

---

## 👥 Manajemen User

### Melihat Daftar User

1. Buka menu **⚙️ Pengaturan**
2. Klik **"Manajemen User"**
3. Daftar semua user akan ditampilkan

```
📸 [Screenshot: Daftar User]
```

### Informasi User

| Kolom | Deskripsi |
|-------|-----------|
| **Nama** | Nama lengkap user |
| **Email** | Email terdaftar |
| **Role** | Admin atau Member |
| **Status** | Aktif atau Non-aktif |
| **Terdaftar** | Tanggal pendaftaran |
| **Terakhir Login** | Waktu login terakhir |

### Menambah User Baru

**Langkah 1: Klik Tombol Tambah**
```
📸 [Screenshot: Tombol Tambah User]
```

**Langkah 2: Isi Form User**

| Field | Contoh | Wajib |
|-------|--------|-------|
| **Nama Lengkap** | Ahmad Fauzi | ✅ |
| **Email** | ahmad@example.com | ✅ |
| **Role** | Member | ✅ |
| **Password** | ******** | ✅ |
| **Konfirmasi Password** | ******** | ✅ |

```
📸 [Screenshot: Form Tambah User]
```

**Langkah 3: Simpan**
1. Periksa data yang diinput
2. Klik **"Simpan"**
3. User akan menerima email notifikasi

### Mengedit User

1. Klik ikon ✏️ pada user yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik **"Update"**

```
📸 [Screenshot: Form Edit User]
```

### Menghapus User

⚠️ **Peringatan:** Penghapusan user tidak dapat dibatalkan.

1. Klik ikon 🗑️ pada user
2. Konfirmasi penghapusan
3. Data user akan dihapus dari sistem

```
📸 [Screenshot: Konfirmasi Hapus User]
```

### Mengubah Role User

1. Klik user yang ingin diubah
2. Pilih role baru (Admin/Member)
3. Klik **"Simpan"**

```
📸 [Screenshot: Ubah Role]
```

### Reset Password User

1. Klik user yang ingin di-reset passwordnya
2. Klik **"Reset Password"**
3. User akan menerima email dengan password baru

```
📸 [Screenshot: Reset Password]
```

---

## 📅 Manajemen Kegiatan

### Melihat Semua Kegiatan

1. Buka menu **📅 Kegiatan**
2. Semua kegiatan akan ditampilkan dalam daftar

```
📸 [Screenshot: Daftar Kegiatan]
```

### Filter Kegiatan

Gunakan filter untuk mencari kegiatan spesifik:

| Filter | Opsi |
|--------|------|
| **Status** | Semua, Terjadwal, Selesai, Dibatalkan |
| **Bulan** | Pilih bulan tertentu |
| **Tahun** | Pilih tahun tertentu |
| **Penanggung Jawab** | Pilih user tertentu |

```
📸 [Screenshot: Filter Kegiatan]
```

### Menambah Kegiatan Baru

**Langkah 1: Klik "+ Tambah Kegiatan"**

**Langkah 2: Isi Form Kegiatan**

| Field | Deskripsi | Wajib |
|-------|-----------|-------|
| **Nama Kegiatan** | Judul kegiatan | ✅ |
| **Kategori** | Rapat, Workshop, Event, dll | ✅ |
| **Tanggal** | Tanggal pelaksanaan | ✅ |
| **Waktu Mulai** | Jam mulai | ✅ |
| **Waktu Selesai** | Jam selesai | ✅ |
| **Lokasi** | Tempat pelaksanaan | ✅ |
| **Deskripsi** | Detail kegiatan | ❌ |
| **Penanggung Jawab** | User yang bertanggung jawab | ✅ |
| **Anggaran** | Estimasi biaya | ❌ |
| **Peserta** | Daftar peserta | ❌ |

```
📸 [Screenshot: Form Kegiatan Lengkap]
```

**Langkah 3: Simpan**
1. Klik **"Simpan"**
2. Kegiatan akan muncul di daftar
3. Notifikasi akan dikirim ke peserta

### Mengedit Kegiatan

1. Klik ikon ✏️ pada kegiatan
2. Ubah informasi yang diperlukan
3. Klik **"Update"**
4. Peserta akan menerima notifikasi perubahan

### Mengubah Status Kegiatan

Status kegiatan dapat diubah:

| Status | Deskripsi |
|--------|-----------|
| **Terjadwal** | Kegiatan belum dilaksanakan |
| **Sedang Berlangsung** | Kegiatan sedang berjalan |
| **Selesai** | Kegiatan telah selesai |
| **Dibatalkan** | Kegiatan dibatalkan |

**Cara Mengubah:**
1. Klik kegiatan
2. Pilih status baru
3. Klik **"Update Status"**

```
📸 [Screenshot: Ubah Status Kegiatan]
```

### Menghapus Kegiatan

⚠️ **Peringatan:** Kegiatan yang dihapus akan hilang dari sistem.

1. Klik ikon 🗑️ pada kegiatan
2. Konfirmasi penghapusan
3. Kegiatan akan dihapus

### Export Kegiatan ke Google Sheets

1. Buka menu **📅 Kegiatan**
2. Klik tombol **"Export ke Sheets"**
3. Pilih periode yang diinginkan
4. Klik **"Export"**
5. Data akan muncul di sheet `Kegiatan`

```
📸 [Screenshot: Export Kegiatan]
```

---

## 💰 Manajemen Keuangan

### Overview Keuangan

```
📸 [Screenshot: Dashboard Keuangan]
```

### Widget Keuangan

| Widget | Informasi |
|--------|-----------|
| **Saldo Saat Ini** | Total saldo kas |
| **Pemasukan Bulan Ini** | Total pemasukan bulan berjalan |
| **Pengeluaran Bulan Ini** | Total pengeluaran bulan berjalan |
| **Transaksi Terakhir** | 5 transaksi terbaru |

### Melihat Laporan Keuangan

1. Buka menu **💰 Keuangan**
2. Laporan keuangan akan ditampilkan

```
📸 [Screenshot: Laporan Keuangan]
```

### Filter Laporan

| Filter | Opsi |
|--------|------|
| **Jenis** | Semua, Pemasukan, Pengeluaran |
| **Bulan** | Pilih bulan |
| **Tahun** | Pilih tahun |
| **Kategori** | Pilih kategori transaksi |

### Menambah Transaksi

**Langkah 1: Klik "+ Tambah Transaksi"**

**Langkah 2: Pilih Jenis Transaksi**

| Jenis | Deskripsi |
|-------|-----------|
| **Pemasukan** | Uang masuk (iuran, donasi, dll) |
| **Pengeluaran** | Uang keluar (biaya kegiatan, dll) |

```
📸 [Screenshot: Pilih Jenis Transaksi]
```

**Langkah 3: Isi Form Transaksi**

| Field | Deskripsi | Wajib |
|-------|-----------|-------|
| **Tanggal** | Tanggal transaksi | ✅ |
| **Kategori** | Jenis transaksi | ✅ |
| **Jumlah** | Nominal uang | ✅ |
| **Deskripsi** | Detail transaksi | ✅ |
| **Kegiatan Terkait** | Kegiatan (jika ada) | ❌ |
| **Bukti** | Upload bukti transfer | ❌ |

```
📸 [Screenshot: Form Transaksi]
```

**Langkah 4: Simpan**
1. Klik **"Simpan"**
2. Transaksi akan muncul di laporan
3. Saldo akan otomatis diperbarui

### Mengedit Transaksi

1. Klik transaksi yang ingin diedit
2. Ubah informasi yang diperlukan
3. Klik **"Update"**

### Menghapus Transaksi

⚠️ **Peringatan:** Transaksi yang dihapus tidak dapat dikembalikan.

1. Klik transaksi
2. Klik **"Hapus"**
3. Konfirmasi penghapusan

### Export Laporan ke Google Sheets

1. Buka menu **💰 Keuangan**
2. Klik **"Export ke Sheets"**
3. Pilih periode
4. Klik **"Export"**
5. Data akan muncul di sheet `Keuangan`

### Membuat Laporan Bulanan

1. Buka menu **💰 Keuangan**
2. Klik **"Buat Laporan"**
3. Pilih bulan dan tahun
4. Klik **"Generate"**
5. Laporan akan dibuat dalam format PDF

```
📸 [Screenshot: Generate Laporan]
```

---

## 📊 Manajemen Assessment

### Melihat Assessment

1. Buka menu **📊 Assessment**
2. Daftar assessment akan ditampilkan

```
📸 [Screenshot: Daftar Assessment]
```

### Membuat Assessment Baru

**Langkah 1: Klik "+ Buat Assessment"**

**Langkah 2: Pilih Tipe Assessment**

| Tipe | Deskripsi |
|------|-----------|
| **Kinerja** | Penilaian kinerja anggota |
| **Kepemimpinan** | Penilaian kemampuan kepemimpinan |
| **Kolaborasi** | Penilaian kemampuan kerja tim |
| **Kreativitas** | Penilaian kemampuan kreatif |
| **Custom** | Assessment kustom |

```
📸 [Screenshot: Pilih Tipe Assessment]
```

**Langkah 3: Isi Detail Assessment**

| Field | Deskripsi | Wajib |
|-------|-----------|-------|
| **Nama Assessment** | Judul assessment | ✅ |
| **Deskripsi** | Detail assessment | ❌ |
| **Tanggal Mulai** | Tanggal mulai assessment | ✅ |
| **Tanggal Selesai** | Tanggal selesai assessment | ✅ |
| **Target Peserta** | Pilih peserta | ✅ |

```
📸 [Screenshot: Form Assessment]
```

**Langkah 4: Tambah Pertanyaan**

1. Klik **"+ Tambah Pertanyaan"**
2. Pilih tipe pertanyaan:
   - Pilihan Ganda
   - Skala 1-5
   - Essay
   - Ya/Tidak
3. Isi pertanyaan dan opsi jawaban
4. Klik **"Simpan"**

```
📸 [Screenshot: Form Pertanyaan]
```

**Langkah 5: Publikasikan**
1. Klik **"Publikasikan"**
2. Peserta akan menerima notifikasi
3. Assessment siap diisi

### Melihat Hasil Assessment

1. Klik assessment yang ingin dilihat
2. Hasil akan ditampilkan dalam grafik

```
📸 [Screenshot: Hasil Assessment]
```

### Export Hasil Assessment

1. Buka assessment
2. Klik **"Export Hasil"**
3. Pilih format (PDF/Excel)
4. Klik **"Download"**

---

## 🔗 Integrasi Google Sheets

### Status Sinkronisasi

Cek status sinkronisasi di dashboard:

| Status | Deskripsi |
|--------|-----------|
| 🟢 **Aktif** | Sinkronisasi berjalan normal |
| 🟡 **Pending** | Menunggu sinkronisasi |
| 🔴 **Error** | Terjadi masalah sinkronisasi |

### Sinkronisasi Manual

Jika sinkronisasi otomatis gagal:

1. Buka menu **⚙️ Pengaturan**
2. Klik **"Integrasi Google Sheets"**
3. Klik **"Sinkronisasi Sekarang"**
4. Tunggu proses selesai

```
📸 [Screenshot: Sinkronisasi Manual]
```

### Mapping Data

Pastikan mapping data benar:

| Data Sistem | Sheet | Kolom |
|-------------|-------|-------|
| Kegiatan | `Kegiatan` | A-Z |
| Keuangan | `Keuangan` | A-Z |
| Anggota | `Anggota` | A-Z |
| Assessment | `Assessment` | A-Z |

### Memecahkan Masalah Sinkronisasi

**Masalah: Data tidak muncul**
- ✅ Periksa koneksi internet
- ✅ Pastikan izin akses masih aktif
- ✅ Coba sinkronisasi manual

**Masalah: Error saat sinkronisasi**
- ✅ Logout dan login kembali
- ✅ Hapus koneksi dan hubungkan ulang
- ✅ Periksa log error

---

## 📈 Laporan dan Analytics

### Dashboard Analytics

```
📸 [Screenshot: Dashboard Analytics]
```

### Jenis Laporan

| Laporan | Deskripsi |
|---------|-----------|
| **Laporan Kegiatan** | Ringkasan semua kegiatan |
| **Laporan Keuangan** | Ringkasan keuangan |
| **Laporan Anggota** | Statistik anggota |
| **Laporan Assessment** | Hasil assessment |
| **Laporan Kustom** | Laporan sesuai kebutuhan |

### Membuat Laporan Kustom

1. Buka menu **📈 Analytics**
2. Klik **"+ Buat Laporan"**
3. Pilih tipe laporan
4. Atur parameter
5. Klik **"Generate"**

```
📸 [Screenshot: Buat Laporan Kustom]
```

### Export Laporan

1. Buka laporan yang ingin di-export
2. Klik **"Export"**
3. Pilih format:
   - PDF
   - Excel
   - CSV
4. Klik **"Download"**

---

## ⚙️ Pengaturan Sistem

### Pengaturan Umum

1. Buka menu **⚙️ Pengaturan**
2. Klik **"Umum"**

| Pengaturan | Deskripsi |
|------------|-----------|
| **Nama Organisasi** | Nama organisasi Anda |
| **Logo** | Upload logo organisasi |
| **Warna Tema** | Pilih warna tema |
| **Zona Waktu** | Atur zona waktu |

```
📸 [Screenshot: Pengaturan Umum]
```

### Pengaturan Notifikasi

1. Buka menu **⚙️ Pengaturan**
2. Klik **"Notifikasi"**

| Notifikasi | Aktif/Non-aktif |
|------------|----------------|
| Email notifikasi | ☑️ |
| SMS notifikasi | ☐ |
| Push notification | ☑️ |
| Notifikasi kegiatan | ☑️ |
| Notifikasi keuangan | ☑️ |

```
📸 [Screenshot: Pengaturan Notifikasi]
```

### Pengaturan Backup

1. Buka menu **⚙️ Pengaturan**
2. Klik **"Backup"**

| Opsi | Deskripsi |
|------|-----------|
| **Backup Otomatis** | Aktifkan backup harian |
| **Waktu Backup** | Atur jadwal backup |
| **Lokasi Backup** | Pilih lokasi penyimpanan |
| **Restore** | Restore dari backup |

```
📸 [Screenshot: Pengaturan Backup]
```

### Pengaturan Keamanan

1. Buka menu **⚙️ Pengaturan**
2. Klik **"Keamanan"**

| Pengaturan | Deskripsi |
|------------|-----------|
| **Password Policy** | Atur kebijakan password |
| **Two-Factor Auth** | Aktifkan 2FA |
| **Session Timeout** | Atur waktu timeout |
| **IP Whitelist** | Daftar IP yang diizinkan |

```
📸 [Screenshot: Pengaturan Keamanan]
```

---

## 💡 Best Practices untuk Admin

### Keamanan

1. **Gunakan Password yang Kuat**
   - Minimal 8 karakter
   - Kombinasi huruf, angka, dan simbol
   - Ganti password setiap 3 bulan

2. **Aktifkan Two-Factor Authentication**
   - Tambahkan lapisan keamanan ekstra
   - Gunakan aplikasi authenticator

3. **Kelola Akses User dengan Bijak**
   - Berikan akses sesuai kebutuhan
   - Review akses secara berkala
   - Hapus akses user yang tidak aktif

### Manajemen Data

1. **Backup Secara Berkala**
   - Backup data harian
   - Simpan backup di lokasi aman
   - Test restore secara berkala

2. **Validasi Data Sebelum Input**
   - Periksa data sebelum disimpan
   - Gunakan format yang konsisten
   - Hindari duplikasi data

3. **Monitor Sinkronisasi Google Sheets**
   - Cek status sinkronisasi setiap hari
   - Perbaiki error segera
   - Verifikasi data di Sheets

### Komunikasi

1. **Berikan Notifikasi yang Jelas**
   - Informasikan perubahan sistem
   - Berikan panduan untuk fitur baru
   - Respon pertanyaan dengan cepat

2. **Dokumentasikan Semua Perubahan**
   - Catat perubahan sistem
   - Simpan log aktivitas
   - Buat changelog

### Efisiensi

1. **Gunakan Fitur Otomatisasi**
   - Aktifkan sinkronisasi otomatis
   - Gunakan reminder otomatis
   - Manfaatkan template

2. **Analisis Data Secara Rutin**
   - Review laporan mingguan
   - Identifikasi tren
   - Buat keputusan berdasarkan data

---

## 📞 Dukungan Admin

### Kontak Tim Teknis

- 📧 Email: admin-support@ppsdm-kmits.com
- 📱 WhatsApp: +62 812-3456-7890
- 💬 Live Chat: Tersedia 24/7

### Sumber Daya Tambahan

- 📖 [User Guide](USER_GUIDE.md)
- 🚀 [Quick Start](QUICK_START.md)
- 🔧 [Troubleshooting](TROUBLESHOOTING.md)
- ❓ [FAQ](FAQ.md)
- 🎓 [Training Materials](TRAINING_DAY_1.md)

---

**Versi Dokumen:** 1.0  
**Terakhir Diperbarui:** 10 Februari 2026  
**Tim PPSDM KMITS**
