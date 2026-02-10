# Training Day 1: Initial Setup
## Panduan Training Hari Pertama - Setup Awal Sistem

---

## 📋 Overview Training

### Tujuan Training

Setelah mengikuti training ini, peserta akan dapat:
- ✅ Memahami konsep dasar PPSDM KMITS
- ✅ Melakukan login ke sistem
- ✅ Menghubungkan Google Sheets
- ✅ Mengelola profil pengguna
- ✅ Memahami dasar navigasi sistem

### Durasi Training

- **Total Waktu:** 2 jam
- **Teori:** 30 menit
- **Praktik:** 1 jam 30 menit

### Peserta Training

| Peran | Jumlah |
|-------|--------|
| Admin | 2-3 orang |
| Member | 5-10 orang |
| Total | 7-13 orang |

### Persiapan Sebelum Training

Sebelum memulai training, pastikan:

| Item | Status |
|------|--------|
| Laptop/Perangkat | ☐ Siap |
| Koneksi Internet | ☐ Stabil |
| Akun Google | ☐ Siap |
| Akun PPSDM KMITS | ☐ Sudah dibuat |
| Browser Chrome | ☐ Terinstall |

---

## 🎓 Materi Training

### Bagian 1: Pengantar Sistem (15 Menit)

#### 1.1 Apa itu PPSDM KMITS?

PPSDM KMITS adalah sistem manajemen organisasi yang terintegrasi dengan Google Sheets untuk memudahkan:

```
📸 [Screenshot: Landing Page PPSDM KMITS]
```

**Fitur Utama:**
- 📅 Manajemen kegiatan
- 💰 Manajemen keuangan
- 📚 Knowledge sharing
- 📊 Assessment dan evaluasi
- 🔗 Integrasi Google Sheets

#### 1.2 Mengapa Menggunakan PPSDM KMITS?

| Manfaat | Deskripsi |
|---------|-----------|
| **Efisiensi** | Semua data terpusat dalam satu sistem |
| **Transparansi** | Keuangan dan kegiatan dapat dipantau |
| **Kolaborasi** | Mudah berbagi informasi antar anggota |
| **Otomatisasi** | Tugas rutin dapat diotomatisasi |
| **Backup** | Data otomatis tersinkronisasi ke Google Sheets |

#### 1.3 Arsitektur Sistem

```
📸 [Diagram: Arsitektur Sistem]
```

**Komponen Sistem:**
1. **Frontend** - Interface pengguna (Next.js)
2. **Backend** - Server dan API
3. **Database** - Penyimpanan data (Supabase)
4. **Google Sheets** - Integrasi untuk backup dan kolaborasi

---

### Bagian 2: Login dan Autentikasi (15 Menit)

#### 2.1 Membuka Website

**Langkah 1: Buka Browser**
1. Klik ikon Google Chrome
2. Tunggu browser terbuka

**Langkah 2: Kunjungi Website**
1. Ketik URL: `https://ppsdm-kmits.vercel.app`
2. Tekan Enter

```
📸 [Screenshot: Halaman Login]
```

#### 2.2 Melakukan Login

**Demo Trainer:**
1. Masukkan email: `admin@ppsdm-kmits.com`
2. Masukkan password: `********`
3. Klik tombol **"Masuk"**

**Praktik Peserta:**
1. Buka website PPSDM KMITS
2. Masukkan email dan password Anda
3. Klik **"Masuk"**
4. Tunggu proses login selesai

```
📸 [Screenshot: Form Login]
```

#### 2.3 Verifikasi Email (Jika Diperlukan)

Jika ini pertama kali login:

1. Periksa email Anda
2. Cari email dari PPSDM KMITS
3. Salin kode verifikasi
4. Masukkan kode di halaman login
5. Klik **"Verifikasi"**

```
📸 [Screenshot: Verifikasi Email]
```

#### 2.4 Dashboard Pertama

Setelah berhasil login, Anda akan melihat Dashboard:

```
📸 [Screenshot: Dashboard Pertama]
```

**Komponen Dashboard:**
- **Sidebar Kiri** - Menu navigasi
- **Header Atas** - Profil dan notifikasi
- **Area Konten** - Widget dan informasi
- **Status Bar** - Status sistem

---

### Bagian 3: Menghubungkan Google Sheets (30 Menit)

#### 3.1 Apa itu Integrasi Google Sheets?

Integrasi Google Sheets memungkinkan:
- 📊 Data otomatis tersinkronisasi
- 📤 Export data untuk laporan
- 🔄 Backup data otomatis
- 👥 Kolaborasi dengan tim

#### 3.2 Buka Pengaturan Integrasi

**Langkah 1: Buka Menu Pengaturan**
1. Klik menu **⚙️ Pengaturan** di sidebar
2. Menu pengaturan akan terbuka

```
📸 [Screenshot: Menu Pengaturan]
```

**Langkah 2: Cari Bagian Integrasi**
1. Scroll ke bawah
2. Cari bagian **"Integrasi"**
3. Klik **"Google Sheets"**

```
📸 [Screenshot: Bagian Integrasi]
```

#### 3.3 Hubungkan Akun Google

**Demo Trainer:**
1. Klik tombol **"Hubungkan Google Sheets"**
2. Login ke akun Google
3. Berikan izin akses

**Praktik Peserta:**
1. Klik **"Hubungkan Google Sheets"**
2. Login dengan akun Google Anda
3. Baca permintaan izin
4. Klik **"Allow"** atau **"Izinkan"**

```
📸 [Screenshot: Tombol Hubungkan]
```

```
📸 [Screenshot: Izin Google]
```

#### 3.4 Pilih atau Buat Spreadsheet

**Opsi A: Buat Spreadsheet Baru (Rekomendasi)**

1. Klik **"Buat Spreadsheet Baru"**
2. Beri nama: `PPSDM KMITS Data`
3. Klik **"Buat"**

```
📸 [Screenshot: Buat Spreadsheet Baru]
```

**Opsi B: Gunakan Spreadsheet yang Ada**

1. Klik **"Pilih Spreadsheet"**
2. Pilih dari daftar
3. Klik **"Pilih"**

#### 3.5 Verifikasi Koneksi

Setelah menghubungkan:

1. Tunggu notifikasi **"Koneksi Berhasil"**
2. Periksa daftar sheet yang dibuat:
   - `Kegiatan`
   - `Keuangan`
   - `Anggota`
   - `Assessment`

```
📸 [Screenshot: Konfirmasi Koneksi]
```

#### 3.6 Cek di Google Sheets

**Langkah 1: Buka Google Sheets**
1. Buka tab baru
2. Kunjungi: `sheets.google.com`

**Langkah 2: Buka Spreadsheet**
1. Cari spreadsheet `PPSDM KMITS Data`
2. Klik untuk membuka

**Langkah 3: Verifikasi Sheet**
1. Periksa sheet yang dibuat
2. Pastikan semua sheet ada

```
📸 [Screenshot: Spreadsheet di Google Sheets]
```

---

### Bagian 4: Mengelola Profil Pengguna (20 Menit)

#### 4.1 Melihat Profil

**Langkah 1: Buka Profil**
1. Klik foto profil di pojok kanan atas
2. Klik **"Profil"**

```
📸 [Screenshot: Menu Profil]
```

**Langkah 2: Lihat Informasi**
1. Nama lengkap
2. Email
3. Role (Admin/Member)
4. Tanggal pendaftaran
5. Terakhir login

```
📸 [Screenshot: Halaman Profil]
```

#### 4.2 Mengedit Profil

**Demo Trainer:**
1. Klik **"Edit Profil"**
2. Ubah nama dan bio
3. Upload foto
4. Klik **"Simpan"**

**Praktik Peserta:**
1. Klik **"Edit Profil"**
2. Ubah informasi berikut:
   - Nama lengkap
   - Bio (deskripsi singkat)
   - No. HP
   - Alamat
3. Upload foto profil (opsional)
4. Klik **"Simpan"**

```
📸 [Screenshot: Edit Profil]
```

#### 4.3 Mengubah Password

**Langkah 1: Buka Pengaturan**
1. Klik foto profil
2. Klik **"Pengaturan"**

**Langkah 2: Klik "Ubah Password"**

**Langkah 3: Isi Form**
1. Password lama
2. Password baru
3. Konfirmasi password baru

```
📸 [Screenshot: Ubah Password]
```

**Tips Password yang Kuat:**
- Minimal 8 karakter
- Kombinasi huruf besar dan kecil
- Gunakan angka dan simbol
- Jangan gunakan password yang sama untuk akun lain

#### 4.4 Pengaturan Notifikasi

**Langkah 1: Buka Pengaturan Notifikasi**
1. Buka menu **Pengaturan**
2. Klik **"Notifikasi"**

**Langkah 2: Atur Notifikasi**
Pilih notifikasi yang ingin diaktifkan:

| Notifikasi | Aktif/Non-aktif |
|------------|----------------|
| Email notifikasi | ☑️ |
| Push notification | ☑️ |
| Notifikasi kegiatan | ☑️ |
| Notifikasi assessment | ☑️ |

```
📸 [Screenshot: Pengaturan Notifikasi]
```

---

### Bagian 5: Dasar Navigasi Sistem (20 Menit)

#### 5.1 Kenali Menu Utama

```
📸 [Screenshot: Sidebar Menu]
```

| Menu | Fungsi | Akses |
|------|--------|-------|
| 🏠 **Dashboard** | Ringkasan aktivitas | Semua |
| 📅 **Kegiatan** | Manajemen kegiatan | Semua |
| 💰 **Keuangan** | Laporan keuangan | Admin |
| 📚 **Knowledge** | Berbagi pengetahuan | Semua |
| 📊 **Assessment** | Evaluasi dan penilaian | Admin |
| ⚙️ **Pengaturan** | Konfigurasi sistem | Admin |
| ❓ **Bantuan** | Panduan dan FAQ | Semua |

#### 5.2 Cara Navigasi

**Demo Trainer:**
1. Klik setiap menu
2. Jelaskan fungsi masing-masing
3. Tunjukkan cara kembali ke dashboard

**Praktik Peserta:**
1. Klik menu **📅 Kegiatan**
2. Klik menu **📚 Knowledge**
3. Klik menu **📊 Assessment**
4. Kembali ke dashboard dengan klik logo

#### 5.3 Menggunakan Breadcrumb

Breadcrumb membantu navigasi:

```
📸 [Screenshot: Breadcrumb]
```

**Contoh:**
`Dashboard > Kegiatan > Detail Kegiatan`

Klik bagian breadcrumb untuk kembali ke halaman sebelumnya.

#### 5.4 Menggunakan Search

Cari fitur atau informasi:

1. Klik ikon 🔍 di pojok kanan
2. Ketik kata kunci
3. Tekan Enter
4. Hasil pencarian akan muncul

```
📸 [Screenshot: Search]
```

---

## 🎯 Latihan Praktik

### Latihan 1: Login dan Dashboard (10 Menit)

**Tujuan:** Peserta dapat login dan mengenal dashboard

**Langkah:**
1. Buka website PPSDM KMITS
2. Login dengan akun Anda
3. Identifikasi komponen dashboard
4. Klik setiap widget untuk melihat detail

**Output:**
- [ ] Berhasil login
- [ ] Mengenal komponen dashboard
- [ ] Dapat melihat detail widget

### Latihan 2: Hubungkan Google Sheets (15 Menit)

**Tujuan:** Peserta dapat menghubungkan Google Sheets

**Langkah:**
1. Buka pengaturan integrasi
2. Hubungkan akun Google
3. Buat spreadsheet baru
4. Verifikasi koneksi
5. Cek di Google Sheets

**Output:**
- [ ] Google Sheets terhubung
- [ ] Sheet otomatis dibuat
- [ ] Data terverifikasi di Sheets

### Latihan 3: Edit Profil (10 Menit)

**Tujuan:** Peserta dapat mengedit profil

**Langkah:**
1. Buka halaman profil
2. Edit informasi profil
3. Upload foto (opsional)
4. Simpan perubahan

**Output:**
- [ ] Profil berhasil diedit
- [ ] Foto profil terupload (jika ada)
- [ ] Perubahan tersimpan

### Latihan 4: Navigasi Sistem (10 Menit)

**Tujuan:** Peserta dapat menavigasi sistem

**Langkah:**
1. Klik setiap menu
2. Jelaskan fungsi masing-masing
3. Gunakan breadcrumb
4. Coba fitur search

**Output:**
- [ ] Semua menu dapat diakses
- [ ] Breadcrumb berfungsi
- [ ] Search berfungsi

---

## ✅ Checklist Training

Gunakan checklist ini untuk memastikan semua materi tercakup:

### Teori
- [ ] Pengantar sistem PPSDM KMITS
- [ ] Manfaat menggunakan sistem
- [ ] Arsitektur sistem
- [ ] Konsep integrasi Google Sheets

### Praktik
- [ ] Login ke sistem
- [ ] Verifikasi email (jika diperlukan)
- [ ] Mengenal dashboard
- [ ] Menghubungkan Google Sheets
- [ ] Verifikasi koneksi
- [ ] Edit profil
- [ ] Ubah password
- [ ] Atur notifikasi
- [ ] Navigasi menu
- [ ] Gunakan breadcrumb
- [ ] Coba fitur search

---

## 📝 Evaluasi Training

### Kuis Singkat

**Pertanyaan 1:** Apa fungsi utama PPSDM KMITS?
- A. Manajemen keuangan saja
- B. Manajemen organisasi terintegrasi
- C. Hanya assessment
- D. Hanya knowledge sharing

**Pertanyaan 2:** Berapa lama waktu yang dibutuhkan untuk setup awal?
- A. 5 menit
- B. 15 menit
- C. 30 menit
- D. 1 jam

**Pertanyaan 3:** Apa yang terjadi setelah menghubungkan Google Sheets?
- A. Data akan hilang
- B. Sheet otomatis dibuat
- C. Tidak ada yang terjadi
- D. Perlu manual input

**Pertanyaan 4:** Bagaimana cara kembali ke dashboard?
- A. Refresh halaman
- B. Klik logo
- C. Logout dan login
- D. Tutup browser

**Jawaban:** 1-B, 2-B, 3-B, 4-B

### Feedback Peserta

Mohon isi feedback training:

| Aspek | Skala 1-5 |
|-------|----------|
| Pemahaman materi | ⭐⭐⭐⭐⭐ |
| Kejelasan instruktur | ⭐⭐⭐⭐⭐ |
| Waktu training | ⭐⭐⭐⭐⭐ |
| Kualitas materi | ⭐⭐⭐⭐⭐ |

**Komentar/Saran:**
```
_________________________
_________________________
_________________________
```

---

## 📚 Materi Tambahan

### Dokumentasi

- 📖 [User Guide Lengkap](USER_GUIDE.md)
- 🚀 [Quick Start](QUICK_START.md)
- 👨‍💼 [Admin Guide](ADMIN_GUIDE.md)
- 👤 [Member Guide](MEMBER_GUIDE.md)

### Video Tutorial

- 🎥 Video 1: Login dan Dashboard (5 menit)
- 🎥 Video 2: Hubungkan Google Sheets (10 menit)
- 🎥 Video 3: Edit Profil (5 menit)
- 🎥 Video 4: Navigasi Sistem (5 menit)

### Sumber Daya

- 🌐 Website: https://ppsdm-kmits.vercel.app
- 📧 Email: support@ppsdm-kmits.com
- 📱 WhatsApp: +62 812-3456-7890

---

## 🎉 Penutup

### Apa Selanjutnya?

Setelah menyelesaikan Training Day 1, Anda siap untuk:

| Training Hari | Topik | Waktu |
|---------------|-------|-------|
| Day 1 ✅ | Initial Setup | 2 jam |
| Day 2 | Adding Activities | 2 jam |
| Day 3 | Financial Transparency | 2 jam |
| Day 4 | Knowledge Sharing | 2 jam |
| Day 5 | Advanced Automation | 2 jam |

### Tugas Rumah

Sebelum training Day 2:

1. ✅ Login ke sistem setiap hari
2. ✅ Cek sinkronisasi Google Sheets
3. ✅ Update profil jika belum lengkap
4. ✅ Baca dokumentasi tambahan

### Kontak Dukungan

Jika ada pertanyaan setelah training:

- 📧 Email: training@ppsdm-kmits.com
- 📱 WhatsApp: +62 812-3456-7890
- 💬 Live Chat: Tersedia di sistem

---

**Versi Dokumen:** 1.0  
**Terakhir Diperbarui:** 10 Februari 2026  
**Tim PPSDM KMITS**
