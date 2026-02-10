# Training Day 5: Advanced Automation
## Panduan Training Hari Kelima - Otomatisasi Lanjutan

---

## 📋 Overview Training

### Tujuan Training

Setelah mengikuti training ini, peserta akan dapat:
- ✅ Memahami konsep otomatisasi
- ✅ Mengatur notifikasi otomatis
- ✅ Menggunakan reminder otomatis
- ✅ Mengelola assessment otomatis
- ✅ Menggunakan fitur backup otomatis
- ✅ Memahami integrasi lanjutan

### Durasi Training

- **Total Waktu:** 2 jam
- **Teori:** 30 menit
- **Praktik:** 1 jam 30 menit

### Prasyarat

Sebelum mengikuti training ini, peserta harus:
- ✅ Sudah menyelesaikan Training Day 1, 2, 3, dan 4
- ✅ Memiliki akses Admin (untuk fitur otomatisasi)
- ✅ Google Sheets sudah terhubung
- ✅ Memahami dasar semua fitur

---

## 🎓 Materi Training

### Bagian 1: Konsep Otomatisasi (15 Menit)

#### 1.1 Apa itu Otomatisasi?

Otomatisasi adalah proses menggunakan teknologi untuk melakukan tugas-tugas rutin secara otomatis tanpa campur tangan manusia.

```
📸 [Screenshot: Konsep Otomatisasi]
```

#### 1.2 Mengapa Otomatisasi Penting?

| Manfaat | Deskripsi |
|---------|-----------|
| **Efisiensi** | Menghemat waktu dan tenaga |
| **Konsistensi** | Hasil yang konsisten setiap saat |
| **Akurasi** | Mengurangi kesalahan manusia |
| **Skalabilitas** | Mudah untuk scale up |
| **Fokus** | Dapat fokus pada tugas penting |

#### 1.3 Jenis Otomatisasi di PPSDM KMITS

| Jenis | Deskripsi | Contoh |
|------|-----------|--------|
| **Notifikasi Otomatis** | Notifikasi dikirim otomatis | Reminder kegiatan |
| **Reminder Otomatis** | Pengingat otomatis | Reminder assessment |
| **Backup Otomatis** | Backup data otomatis | Backup harian ke Sheets |
| **Sinkronisasi Otomatis** | Sinkronisasi data otomatis | Sync ke Google Sheets |
| **Report Otomatis** | Laporan dibuat otomatis | Laporan bulanan |

#### 1.4 Prinsip Otomatisasi yang Baik

| Prinsip | Deskripsi |
|---------|-----------|
| **Sederhana** | Otomatisasi harus mudah dipahami |
| **Dapat Diandalkan** | Harus bekerja secara konsisten |
| **Dapat Dipantau** | Status otomatisasi dapat dipantau |
| **Dapat Dikonfigurasi** | Mudah diatur sesuai kebutuhan |
| **Dapat Dihentikan** | Dapat dimatikan jika diperlukan |

---

### Bagian 2: Notifikasi Otomatis (20 Menit)

#### 2.1 Buka Pengaturan Notifikasi

**Langkah 1: Buka Menu Pengaturan**
1. Klik menu **⚙️ Pengaturan** di sidebar
2. Klik **"Notifikasi"**

```
📸 [Screenshot: Menu Pengaturan Notifikasi]
```

#### 2.2 Jenis Notifikasi

| Jenis Notifikasi | Deskripsi | Default |
|------------------|-----------|---------|
| **Email Notifikasi** | Notifikasi via email | Aktif |
| **Push Notification** | Notifikasi di browser | Aktif |
| **SMS Notifikasi** | Notifikasi via SMS | Non-aktif |
| **Notifikasi Kegiatan** | Notifikasi kegiatan baru | Aktif |
| **Notifikasi Keuangan** | Notifikasi transaksi | Aktif |
| **Notifikasi Assessment** | Notifikasi assessment | Aktif |
| **Notifikasi Artikel** | Notifikasi artikel baru | Aktif |

```
📸 [Screenshot: Pengaturan Notifikasi]
```

#### 2.3 Mengatur Notifikasi Kegiatan

**Langkah 1: Buka Notifikasi Kegiatan**
1. Di pengaturan notifikasi
2. Cari bagian **"Notifikasi Kegiatan"**
3. Klik **"Konfigurasi"**

```
📸 [Screenshot: Konfigurasi Notifikasi Kegiatan]
```

**Langkah 2: Atur Pengingat**
| Pengaturan | Opsi | Deskripsi |
|------------|------|-----------|
| **Reminder Sebelum** | 1 hari, 3 hari, 1 minggu | Waktu pengingat sebelum kegiatan |
| **Reminder Saat** | Ya/Tidak | Pengingat saat kegiatan dimulai |
| **Reminder Setelah** | Ya/Tidak | Pengingat setelah kegiatan selesai |

**Demo Trainer:**
1. Buka pengaturan notifikasi kegiatan
2. Atur reminder 1 hari sebelum
3. Simpan pengaturan
4. Jelaskan cara kerja

**Praktik Peserta:**
1. Buka pengaturan notifikasi kegiatan
2. Atur reminder sesuai kebutuhan
3. Simpan pengaturan
4. Verifikasi pengaturan

#### 2.4 Mengatur Notifikasi Keuangan

**Langkah 1: Buka Notifikasi Keuangan**
1. Di pengaturan notifikasi
2. Cari bagian **"Notifikasi Keuangan"**
3. Klik **"Konfigurasi"**

```
📸 [Screenshot: Konfigurasi Notifikasi Keuangan]
```

**Langkah 2: Atur Notifikasi**
| Pengaturan | Opsi | Deskripsi |
|------------|------|-----------|
| **Notifikasi Pemasukan** | Ya/Tidak | Notifikasi saat ada pemasukan |
| **Notifikasi Pengeluaran** | Ya/Tidak | Notifikasi saat ada pengeluaran |
| **Notifikasi Saldo Rendah** | Ya/Tidak | Notifikasi jika saldo rendah |
| **Batas Saldo Rendah** | Rp 0 - Rp 10.000.000 | Batas saldo untuk notifikasi |

**Demo Trainer:**
1. Buka pengaturan notifikasi keuangan
2. Atur notifikasi saldo rendah
3. Simpan pengaturan
4. Jelaskan cara kerja

**Praktik Peserta:**
1. Buka pengaturan notifikasi keuangan
2. Atur notifikasi sesuai kebutuhan
3. Simpan pengaturan
4. Verifikasi pengaturan

---

### Bagian 3: Reminder Otomatis (15 Menit)

#### 3.1 Buka Pengaturan Reminder

**Langkah 1: Buka Menu Pengaturan**
1. Klik menu **⚙️ Pengaturan** di sidebar
2. Klik **"Reminder"**

```
📸 [Screenshot: Menu Pengaturan Reminder]
```

#### 3.2 Jenis Reminder

| Jenis Reminder | Deskripsi | Frekuensi |
|----------------|-----------|-----------|
| **Reminder Kegiatan** | Pengingat kegiatan | Sesuai jadwal |
| **Reminder Assessment** | Pengingat assessment | Sesuai deadline |
| **Reminder Iuran** | Pengingat pembayaran iuran | Bulanan |
| **Reminder Laporan** | Pengingat submit laporan | Bulanan |

```
📸 [Screenshot: Daftar Reminder]
```

#### 3.3 Membuat Reminder Baru

**Langkah 1: Klik "+ Buat Reminder"**
1. Klik tombol **"+ Buat Reminder"**
2. Form reminder akan muncul

```
📸 [Screenshot: Tombol Buat Reminder]
```

**Langkah 2: Isi Form Reminder**

| Field | Deskripsi | Contoh | Wajib |
|-------|-----------|--------|-------|
| **Nama Reminder** | Nama reminder | Reminder Rapat Mingguan | ✅ |
| **Tipe** | Tipe reminder | Kegiatan | ✅ |
| **Target** | Target reminder | Semua anggota | ✅ |
| **Waktu** | Waktu pengingat | 1 hari sebelum | ✅ |
| **Pesan** | Pesan reminder | Jangan lupa rapat besok! | ✅ |
| **Frekuensi** | Frekuensi reminder | Sekali | ✅ |

```
📸 [Screenshot: Form Reminder]
```

**Demo Trainer:**
1. Buat reminder untuk kegiatan
2. Isi form dengan lengkap
3. Simpan reminder
4. Jelaskan cara kerja

**Praktik Peserta:**
1. Buat reminder untuk assessment
2. Isi form dengan lengkap
3. Simpan reminder
4. Verifikasi reminder

#### 3.4 Mengedit Reminder

**Langkah 1: Klik Reminder**
1. Cari reminder yang ingin diedit
2. Klik reminder tersebut

**Langkah 2: Ubah Informasi**
1. Ubah informasi yang diperlukan
2. Klik **"Update"**

```
📸 [Screenshot: Edit Reminder]
```

#### 3.5 Menghapus Reminder

**Langkah 1: Klik Ikon Hapus**
1. Cari reminder yang ingin dihapus
2. Klik ikon 🗑️

**Langkah 2: Konfirmasi**
1. Konfirmasi penghapusan
2. Reminder akan dihapus

```
📸 [Screenshot: Hapus Reminder]
```

---

### Bagian 4: Assessment Otomatis (20 Menit)

#### 4.1 Buka Pengaturan Assessment

**Langkah 1: Buka Menu Assessment**
1. Klik menu **📊 Assessment** di sidebar
2. Klik **"Pengaturan"**

```
📸 [Screenshot: Pengaturan Assessment]
```

#### 4.2 Pengaturan Otomatisasi Assessment

| Pengaturan | Opsi | Deskripsi |
|------------|------|-----------|
| **Auto-Create** | Ya/Tidak | Buat assessment otomatis |
| **Frekuensi** | Bulanan, Triwulan, Tahunan | Frekuensi pembuatan |
| **Template** | Pilih template | Template assessment |
| **Auto-Notify** | Ya/Tidak | Notifikasi otomatis |
| **Auto-Remind** | Ya/Tidak | Reminder otomatis |

```
📸 [Screenshot: Pengaturan Otomatisasi Assessment]
```

#### 4.3 Membuat Template Assessment

**Langkah 1: Klik "+ Buat Template"**
1. Klik tombol **"+ Buat Template"**
2. Form template akan muncul

```
📸 [Screenshot: Tombol Buat Template]
```

**Langkah 2: Isi Form Template**

| Field | Deskripsi | Contoh | Wajib |
|-------|-----------|--------|-------|
| **Nama Template** | Nama template | Assessment Kinerja Bulanan | ✅ |
| **Tipe** | Tipe assessment | Kinerja | ✅ |
| **Deskripsi** | Deskripsi template | Penilaian kinerja bulanan | ❌ |
| **Pertanyaan** | Daftar pertanyaan | [Tambah pertanyaan] | ✅ |

```
📸 [Screenshot: Form Template]
```

**Langkah 3: Tambah Pertanyaan**
1. Klik **"+ Tambah Pertanyaan"**
2. Pilih tipe pertanyaan
3. Isi pertanyaan
4. Klik **"Simpan"**

```
📸 [Screenshot: Tambah Pertanyaan]
```

**Demo Trainer:**
1. Buat template assessment
2. Tambah beberapa pertanyaan
3. Simpan template
4. Jelaskan cara kerja

**Praktik Peserta:**
1. Buat template assessment baru
2. Tambah minimal 5 pertanyaan
3. Simpan template
4. Verifikasi template

#### 4.4 Mengatur Jadwal Otomatis

**Langkah 1: Buka Jadwal Otomatis**
1. Di pengaturan assessment
2. Klik **"Jadwal Otomatis"**

```
📸 [Screenshot: Jadwal Otomatis]
```

**Langkah 2: Atur Jadwal**
| Pengaturan | Opsi | Deskripsi |
|------------|------|-----------|
| **Aktifkan** | Ya/Tidak | Aktifkan jadwal otomatis |
| **Frekuensi** | Bulanan, Triwulan, Tahunan | Frekuensi pembuatan |
| **Tanggal** | Pilih tanggal | Tanggal pembuatan |
| **Waktu** | Pilih waktu | Waktu pembuatan |
| **Template** | Pilih template | Template yang digunakan |

**Demo Trainer:**
1. Atur jadwal otomatis
2. Pilih frekuensi bulanan
3. Pilih tanggal 1 setiap bulan
4. Simpan jadwal

**Praktik Peserta:**
1. Atur jadwal otomatis
2. Pilih frekuensi sesuai kebutuhan
3. Pilih template
4. Simpan jadwal

---

### Bagian 5: Backup Otomatis (15 Menit)

#### 5.1 Buka Pengaturan Backup

**Langkah 1: Buka Menu Pengaturan**
1. Klik menu **⚙️ Pengaturan** di sidebar
2. Klik **"Backup"**

```
📸 [Screenshot: Pengaturan Backup]
```

#### 5.2 Pengaturan Backup Otomatis

| Pengaturan | Opsi | Deskripsi |
|------------|------|-----------|
| **Backup Otomatis** | Ya/Tidak | Aktifkan backup otomatis |
| **Frekuensi** | Harian, Mingguan, Bulanan | Frekuensi backup |
| **Waktu** | Pilih waktu | Waktu backup |
| **Lokasi** | Google Sheets, Local | Lokasi penyimpanan |
| **Retensi** | 7 hari, 30 hari, 90 hari | Lama penyimpanan backup |

```
📸 [Screenshot: Pengaturan Backup]
```

#### 5.3 Mengatur Backup Harian

**Demo Trainer:**
1. Aktifkan backup otomatis
2. Pilih frekuensi harian
3. Atur waktu backup
4. Simpan pengaturan

**Praktik Peserta:**
1. Aktifkan backup otomatis
2. Pilih frekuensi sesuai kebutuhan
3. Atur waktu backup
4. Simpan pengaturan

#### 5.4 Melihat Riwayat Backup

**Langkah 1: Klik "Riwayat Backup"**
1. Di pengaturan backup
2. Klik **"Riwayat Backup"**

```
📸 [Screenshot: Riwayat Backup]
```

**Langkah 2: Lihat Daftar Backup**
| Kolom | Deskripsi |
|-------|-----------|
| **Tanggal** | Tanggal backup |
| **Waktu** | Waktu backup |
| **Ukuran** | Ukuran file backup |
| **Status** | Status backup |
| **Aksi** | Download atau restore |

```
📸 [Screenshot: Daftar Backup]
```

#### 5.5 Restore dari Backup

**Langkah 1: Klik "Restore"**
1. Cari backup yang ingin direstore
2. Klik tombol **"Restore"**

```
📸 [Screenshot: Tombol Restore]
```

**Langkah 2: Konfirmasi**
1. Baca peringatan dengan teliti
2. Konfirmasi restore
3. Tunggu proses selesai

⚠️ **Peringatan:** Restore akan menimpa data saat ini.

---

### Bagian 6: Integrasi Lanjutan (15 Menit)

#### 6.1 Integrasi dengan Google Calendar

**Langkah 1: Buka Integrasi**
1. Klik menu **⚙️ Pengaturan**
2. Klik **"Integrasi"**
3. Klik **"Google Calendar"**

```
📸 [Screenshot: Integrasi Google Calendar]
```

**Langkah 2: Hubungkan Google Calendar**
1. Klik **"Hubungkan Google Calendar"**
2. Login ke akun Google
3. Berikan izin akses
4. Pilih calendar

```
📸 [Screenshot: Hubungkan Google Calendar]
```

**Langkah 3: Sinkronisasi Kegiatan**
1. Pilih opsi sinkronisasi:
   - Sinkronisasi dua arah
   - Sinkronisasi dari sistem ke calendar
   - Sinkronisasi dari calendar ke sistem
2. Klik **"Simpan"**

```
📸 [Screenshot: Opsi Sinkronisasi]
```

#### 6.2 Integrasi dengan Email

**Langkah 1: Buka Integrasi Email**
1. Klik menu **⚙️ Pengaturan**
2. Klik **"Integrasi"**
3. Klik **"Email"**

```
📸 [Screenshot: Integrasi Email]
```

**Langkah 2: Konfigurasi Email**
| Pengaturan | Deskripsi |
|------------|-----------|
| **SMTP Server** | Server SMTP |
| **Port** | Port SMTP |
| **Username** | Username email |
| **Password** | Password email |
| **From Email** | Email pengirim |
| **From Name** | Nama pengirim |

```
📸 [Screenshot: Konfigurasi Email]
```

#### 6.3 Integrasi dengan WhatsApp

**Langkah 1: Buka Integrasi WhatsApp**
1. Klik menu **⚙️ Pengaturan**
2. Klik **"Integrasi"**
3. Klik **"WhatsApp"**

```
📸 [Screenshot: Integrasi WhatsApp]
```

**Langkah 2: Hubungkan WhatsApp**
1. Masukkan nomor WhatsApp
2. Klik **"Kirim Kode"**
3. Masukkan kode verifikasi
4. Klik **"Verifikasi"**

```
📸 [Screenshot: Hubungkan WhatsApp]
```

---

## 🎯 Latihan Praktik

### Latihan 1: Atur Notifikasi Otomatis (20 Menit)

**Tujuan:** Peserta dapat mengatur notifikasi otomatis

**Langkah:**
1. Buka pengaturan notifikasi
2. Atur notifikasi kegiatan
3. Atur notifikasi keuangan
4. Simpan pengaturan
5. Verifikasi pengaturan

**Output:**
- [ ] Notifikasi kegiatan diatur
- [ ] Notifikasi keuangan diatur
- [ ] Pengaturan tersimpan
- [ ] Notifikasi berfungsi

### Latihan 2: Buat Reminder Otomatis (15 Menit)

**Tujuan:** Peserta dapat membuat reminder otomatis

**Langkah:**
1. Buka pengaturan reminder
2. Buat reminder baru
3. Isi form dengan lengkap
4. Simpan reminder
5. Verifikasi reminder

**Output:**
- [ ] Reminder berhasil dibuat
- [ ] Data lengkap dan benar
- [ ] Reminder aktif

### Latihan 3: Buat Template Assessment (20 Menit)

**Tujuan:** Peserta dapat membuat template assessment

**Langkah:**
1. Buka pengaturan assessment
2. Buat template baru
3. Tambah minimal 5 pertanyaan
4. Simpan template
5. Verifikasi template

**Output:**
- [ ] Template berhasil dibuat
- [ ] Pertanyaan ditambahkan
- [ ] Template tersimpan

### Latihan 4: Atur Backup Otomatis (15 Menit)

**Tujuan:** Peserta dapat mengatur backup otomatis

**Langkah:**
1. Buka pengaturan backup
2. Aktifkan backup otomatis
3. Pilih frekuensi dan waktu
4. Simpan pengaturan
5. Verifikasi pengaturan

**Output:**
- [ ] Backup otomatis aktif
- [ ] Frekuensi diatur
- [ ] Pengaturan tersimpan

---

## ✅ Checklist Training

Gunakan checklist ini untuk memastikan semua materi tercakup:

### Teori
- [ ] Konsep otomatisasi
- [ ] Manfaat otomatisasi
- [ ] Jenis otomatisasi
- [ ] Prinsip otomatisasi yang baik

### Praktik
- [ ] Atur notifikasi otomatis
- [ ] Buat reminder otomatis
- [ ] Buat template assessment
- [ ] Atur jadwal otomatis
- [ ] Atur backup otomatis
- [ ] Lihat riwayat backup
- [ ] Hubungkan integrasi lanjutan

---

## 📝 Evaluasi Training

### Kuis Singkat

**Pertanyaan 1:** Apa manfaat utama otomatisasi?
- A. Membuat pekerjaan lebih sulit
- B. Menghemat waktu dan tenaga
- C. Meningkatkan kesalahan
- D. Mengurangi konsistensi

**Pertanyaan 2:** Berapa frekuensi backup yang tersedia?
- A. 2
- B. 3
- C. 4
- D. 5

**Pertanyaan 3:** Apa yang terjadi setelah mengatur reminder?
- A. Reminder tidak berfungsi
- B. Reminder dikirim otomatis
- C. Perlu manual kirim
- D. Reminder dihapus

**Pertanyaan 4:** Integrasi apa yang tersedia?
- A. Hanya Google Sheets
- B. Google Calendar, Email, WhatsApp
- C. Hanya Email
- D. Tidak ada integrasi

**Jawaban:** 1-B, 2-B, 3-B, 4-B

### Tugas Praktik

Selesaikan tugas berikut:
1. [ ] Atur notifikasi kegiatan dan keuangan
2. [ ] Buat 2 reminder otomatis
3. [ ] Buat 1 template assessment
4. [ ] Atur backup otomatis
5. [ ] Hubungkan minimal 1 integrasi lanjutan

---

## 📚 Materi Tambahan

### Dokumentasi

- 📖 [User Guide Lengkap](USER_GUIDE.md)
- 👨‍💼 [Admin Guide](ADMIN_GUIDE.md)

### Video Tutorial

- 🎥 Video 1: Notifikasi Otomatis (10 menit)
- 🎥 Video 2: Reminder Otomatis (10 menit)
- 🎥 Video 3: Template Assessment (15 menit)
- 🎥 Video 4: Backup Otomatis (10 menit)

---

## 🎉 Penutup

### Ringkasan Training

Selamat! Anda telah menyelesaikan semua training PPSDM KMITS:

| Training Hari | Topik | Status |
|---------------|-------|--------|
| Day 1 ✅ | Initial Setup | Selesai |
| Day 2 ✅ | Adding Activities | Selesai |
| Day 3 ✅ | Financial Transparency | Selesai |
| Day 4 ✅ | Knowledge Sharing | Selesai |
| Day 5 ✅ | Advanced Automation | Selesai |

### Apa Selanjutnya?

Setelah menyelesaikan semua training, Anda siap untuk:

1. ✅ Menggunakan sistem secara mandiri
2. ✅ Mengelola organisasi dengan efisien
3. ✅ Mengoptimalkan fitur-fitur yang tersedia
4. ✅ Membantu anggota lain menggunakan sistem

### Sertifikat Training

Setelah menyelesaikan semua training:
1. Anda akan menerima sertifikat digital
2. Sertifikat dapat diunduh dari profil
3. Sertifikat dapat dibagikan di LinkedIn

### Dukungan Lanjutan

Jika membutuhkan bantuan lebih lanjut:
- 📧 Email: support@ppsdm-kmits.com
- 📱 WhatsApp: +62 812-3456-7890
- 💬 Live Chat: Tersedia di sistem
- 📚 Dokumentasi: Tersedia di menu Bantuan

### Komunitas

Bergabung dengan komunitas PPSDM KMITS:
- 🌐 Website: https://ppsdm-kmits.vercel.app
- 📱 WhatsApp Group: [Link akan diberikan]
- 📧 Newsletter: Subscribe untuk update terbaru

---

## 🎊 Terima Kasih!

Terima kasih telah mengikuti training PPSDM KMITS. Kami berharap training ini bermanfaat untuk Anda dan organisasi Anda.

Jangan ragu untuk menghubungi kami jika Anda membutuhkan bantuan atau memiliki pertanyaan.

**Sukses untuk Anda dan Organisasi Anda!**

---

**Versi Dokumen:** 1.0  
**Terakhir Diperbarui:** 10 Februari 2026  
**Tim PPSDM KMITS**
