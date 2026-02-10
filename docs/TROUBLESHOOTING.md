# Panduan Troubleshooting PPSDM KMITS
## Solusi untuk Masalah Umum

---

## 📋 Daftar Isi

1. [Masalah Login](#masalah-login)
2. [Masalah Google Sheets](#masalah-google-sheets)
3. [Masalah Kegiatan](#masalah-kegiatan)
4. [Masalah Keuangan](#masalah-keuangan)
5. [Masalah Knowledge Sharing](#masalah-knowledge-sharing)
6. [Masalah Assessment](#masalah-assessment)
7. [Masalah Notifikasi](#masalah-notifikasi)
8. [Masalah Koneksi Internet](#masalah-koneksi-internet)
9. [Masalah Browser](#masalah-browser)
10. [Kontak Dukungan](#kontak-dukungan)

---

## 🔐 Masalah Login

### Masalah 1: Tidak Bisa Login

**Gejala:**
- Pesan error "Email atau password salah"
- Halaman tidak merespon setelah klik login
- Redirect kembali ke halaman login

**Penyebab:**
- Email atau password salah
- Akun belum diverifikasi
- Koneksi internet bermasalah
- Browser menyimpan cache lama

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa email dan password dengan teliti |
| 2 | Pastikan Caps Lock tidak aktif |
| 3 | Coba reset password jika lupa |
| 4 | Periksa email untuk verifikasi akun |
| 5 | Clear cache browser |
| 6 | Coba gunakan browser lain |

**Reset Password:**
1. Di halaman login, klik **"Lupa Password"**
2. Masukkan email terdaftar
3. Periksa email untuk link reset
4. Buat password baru
5. Login dengan password baru

```
📸 [Screenshot: Reset Password]
```

---

### Masalah 2: Verifikasi Email Tidak Diterima

**Gejala:**
- Tidak menerima email verifikasi
- Email verifikasi masuk ke spam

**Penyebab:**
- Email salah ketik
- Email masuk ke folder spam
- Server email bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa folder spam/promotions |
| 2 | Tambahkan email ke kontak |
| 3 | Minta kirim ulang kode verifikasi |
| 4 | Pastikan email benar |
| 5 | Hubungi admin jika masih tidak menerima |

```
📸 [Screenshot: Folder Spam]
```

---

### Masalah 3: Sesi Login Berakhir

**Gejala:**
- Tiba-tiba logout otomatis
- Harus login ulang sering

**Penyebab:**
- Sesi timeout
- Browser menghapus cookie
- Login dari perangkat lain

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Cek pengaturan sesi timeout |
| 2 | Jangan hapus cookie browser |
| 3 | Logout dari perangkat lain |
| 4 | Gunakan "Ingat Saya" saat login |

```
📸 [Screenshot: Opsi Ingat Saya]
```

---

## 🔗 Masalah Google Sheets

### Masalah 1: Tidak Bisa Menghubungkan Google Sheets

**Gejala:**
- Pesan error saat menghubungkan
- Halaman Google tidak muncul
- Izin ditolak

**Penyebab:**
- Pop-up blocker aktif
- Izin akses ditolak
- Koneksi internet bermasalah
- Akun Google bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Matikan pop-up blocker sementara |
| 2 | Izinkan akses ke Google Sheets |
| 3 | Periksa koneksi internet |
| 4 | Coba login ulang ke akun Google |
| 5 | Hubungkan ulang dari pengaturan |

**Matikan Pop-up Blocker:**
1. Klik ikon pop-up blocker di browser
2. Pilih "Always allow pop-ups from this site"
3. Refresh halaman
4. Coba hubungkan lagi

```
📸 [Screenshot: Pop-up Blocker]
```

---

### Masalah 2: Data Tidak Muncul di Google Sheets

**Gejala:**
- Data di sistem tidak muncul di Sheets
- Sheet kosong
- Data tidak sinkron

**Penyebab:**
- Sinkronisasi gagal
- Izin akses kadaluarsa
- Koneksi internet putus
- Spreadsheet salah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa koneksi internet |
| 2 | Coba sinkronisasi manual |
| 3 | Periksa izin akses Google |
| 4 | Pastikan spreadsheet yang benar |
| 5 | Hubungkan ulang jika perlu |

**Sinkronisasi Manual:**
1. Buka menu **⚙️ Pengaturan**
2. Klik **"Integrasi Google Sheets"**
3. Klik **"Sinkronisasi Sekarang"**
4. Tunggu proses selesai
5. Verifikasi di Google Sheets

```
📸 [Screenshot: Sinkronisasi Manual]
```

---

### Masalah 3: Error Saat Sinkronisasi

**Gejala:**
- Pesan error sinkronisasi
- Proses berhenti di tengah
- Data tidak lengkap

**Penyebab:**
- Data terlalu besar
- Koneksi internet lambat
- Server Google bermasalah
- Format data salah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa koneksi internet |
| 2 | Coba sinkronisasi lagi |
| 3 | Kurangi jumlah data |
| 4 | Tunggu beberapa saat |
| 5 | Hubungi admin jika error berlanjut |

---

## 📅 Masalah Kegiatan

### Masalah 1: Tidak Bisa Menambah Kegiatan

**Gejala:**
- Tombol simpan tidak berfungsi
- Pesan error saat simpan
- Form tidak muncul

**Penyebab:**
- Data tidak lengkap
- Format tanggal salah
- Koneksi internet bermasalah
- Browser bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Isi semua field wajib |
| 2 | Periksa format tanggal |
| 3 | Periksa koneksi internet |
| 4 | Refresh halaman |
| 5 | Coba browser lain |

**Field Wajib:**
- Nama Kegiatan
- Kategori
- Tanggal
- Waktu Mulai
- Waktu Selesai
- Lokasi
- Penanggung Jawab

```
📸 [Screenshot: Field Wajib]
```

---

### Masalah 2: Kegiatan Tidak Muncul di Daftar

**Gejala:**
- Kegiatan yang baru ditambahkan tidak muncul
- Daftar kosong padahal ada data

**Penyebab:**
- Filter aktif
- Kegiatan dihapus
- Cache browser
- Sinkronisasi gagal

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Reset filter |
| 2 | Refresh halaman |
| 3 | Clear cache browser |
| 4 | Cek apakah kegiatan dihapus |
| 5 | Coba tambah ulang |

**Reset Filter:**
1. Klik tombol **"Reset Filter"**
2. Semua kegiatan akan muncul
3. Cari kegiatan yang dicari

```
📸 [Screenshot: Reset Filter]
```

---

### Masalah 3: Tidak Bisa Mengedit Kegiatan

**Gejala:**
- Tombol edit tidak berfungsi
- Form edit tidak muncul
- Perubahan tidak tersimpan

**Penyebab:**
- Tidak memiliki izin
- Kegiatan sudah selesai
- Koneksi internet bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa izin akses |
| 2 | Ubah status ke "Terjadwal" jika sudah selesai |
| 3 | Periksa koneksi internet |
| 4 | Refresh halaman |
| 5 | Hubungi admin jika tidak memiliki izin |

---

## 💰 Masalah Keuangan

### Masalah 1: Tidak Bisa Menambah Transaksi

**Gejala:**
- Tombol simpan tidak berfungsi
- Pesan error saat simpan
- Saldo tidak diperbarui

**Penyebab:**
- Data tidak lengkap
- Format jumlah salah
- Koneksi internet bermasalah
- Tidak memiliki izin

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Isi semua field wajib |
| 2 | Gunakan format jumlah yang benar (Rp) |
| 3 | Periksa koneksi internet |
| 4 | Periksa izin akses |
| 5 | Refresh halaman |

**Format Jumlah yang Benar:**
- Rp 50.000
- Rp 1.000.000
- Rp 500.000

```
📸 [Screenshot: Format Jumlah]
```

---

### Masalah 2: Saldo Tidak Diperbarui

**Gejala:**
- Saldo tidak berubah setelah transaksi
- Saldo salah

**Penyebab:**
- Transaksi gagal disimpan
- Cache browser
- Sinkronisasi gagal

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa apakah transaksi tersimpan |
| 2 | Refresh halaman |
| 3 | Clear cache browser |
| 4 | Sinkronisasi manual |
| 5 | Hitung ulang saldo |

```
📸 [Screenshot: Refresh Halaman]
```

---

### Masalah 3: Laporan Tidak Bisa Dibuat

**Gejala:**
- Tombol generate tidak berfungsi
- Laporan tidak terdownload
- Error saat generate

**Penyebab:**
- Data tidak tersedia
- Koneksi internet bermasalah
- Browser tidak mendukung PDF

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Pastikan ada data di periode yang dipilih |
| 2 | Periksa koneksi internet |
| 3 | Update browser ke versi terbaru |
| 4 | Coba browser lain |
| 5 | Hubungi admin jika error berlanjut |

---

## 📚 Masalah Knowledge Sharing

### Masalah 1: Tidak Bisa Menulis Artikel

**Gejala:**
- Editor tidak muncul
- Tombol simpan tidak berfungsi
- Artikel tidak dipublikasikan

**Penyebab:**
- Data tidak lengkap
- Koneksi internet bermasalah
- Browser tidak mendukung editor
- Tidak memiliki izin

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Isi judul dan konten |
| 2 | Periksa koneksi internet |
| 3 | Update browser ke versi terbaru |
| 4 | Periksa izin akses |
| 5 | Coba browser lain |

---

### Masalah 2: Gambar Tidak Bisa Diupload

**Gejala:**
- Gambar tidak muncul
- Error saat upload
- File terlalu besar

**Penyebab:**
- Format file tidak didukung
- Ukuran file terlalu besar
- Koneksi internet lambat

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Gunakan format JPG, PNG, atau GIF |
| 2 | Kompres gambar jika terlalu besar |
| 3 | Periksa koneksi internet |
| 4 | Coba upload ulang |
| 5 | Gunakan gambar yang lebih kecil |

**Format yang Didukung:**
- JPG/JPEG
- PNG
- GIF
- WebP

**Ukuran Maksimal:** 5 MB

```
📸 [Screenshot: Format Gambar]
```

---

### Masalah 3: Komentar Tidak Bisa Dikirim

**Gejala:**
- Tombol kirim tidak berfungsi
- Komentar tidak muncul
- Error saat kirim

**Penyebab:**
- Komentar kosong
- Koneksi internet bermasalah
- Artikel dikunci

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Tulis komentar |
| 2 | Periksa koneksi internet |
| 3 | Refresh halaman |
| 4 | Periksa apakah artikel dikunci |
| 5 | Hubungi admin jika artikel dikunci |

---

## 📊 Masalah Assessment

### Masalah 1: Tidak Bisa Mengisi Assessment

**Gejala:**
- Assessment tidak muncul
- Tombol mulai tidak berfungsi
- Jawaban tidak tersimpan

**Penyebab:**
- Assessment kadaluarsa
- Sudah mengisi assessment
- Koneksi internet bermasalah
- Tidak memiliki izin

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa deadline assessment |
| 2 | Cek apakah sudah mengisi |
| 3 | Periksa koneksi internet |
| 4 | Periksa izin akses |
| 5 | Hubungi admin jika tidak memiliki izin |

---

### Masalah 2: Jawaban Tidak Tersimpan

**Gejala:**
- Jawaban hilang saat lanjut
- Draft tidak tersimpan
- Assessment harus diulang

**Penyebab:**
- Koneksi internet putus
- Session timeout
- Browser bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa koneksi internet |
| 2 | Gunakan fitur simpan draft |
| 3 | Jangan refresh halaman saat mengisi |
| 4 | Update browser ke versi terbaru |
| 5 | Coba browser lain |

```
📸 [Screenshot: Simpan Draft]
```

---

### Masalah 3: Hasil Assessment Tidak Muncul

**Gejala:**
- Hasil tidak ditampilkan
- Error saat melihat hasil
- Grafik tidak muncul

**Penyebab:**
- Hasil belum dipublikasikan
- Assessment belum selesai
- Koneksi internet bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Tunggu admin mempublikasikan hasil |
| 2 | Pastikan assessment sudah selesai |
| 3 | Periksa koneksi internet |
| 4 | Refresh halaman |
| 5 | Hubungi admin jika hasil tidak muncul |

---

## 🔔 Masalah Notifikasi

### Masalah 1: Tidak Menerima Notifikasi

**Gejala:**
- Tidak menerima email notifikasi
- Tidak menerima push notification
- Notifikasi masuk ke spam

**Penyebab:**
- Notifikasi dimatikan
- Email masuk ke spam
- Browser memblokir notifikasi

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa pengaturan notifikasi |
| 2 | Periksa folder spam |
| 3 | Izinkan notifikasi browser |
| 4 | Tambahkan email ke kontak |
| 5 | Refresh halaman |

**Izinkan Notifikasi Browser:**
1. Klik ikon gembok di address bar
2. Pilih "Allow" untuk notifikasi
3. Refresh halaman

```
📸 [Screenshot: Izinkan Notifikasi]
```

---

### Masalah 2: Notifikasi Terlambat

**Gejala:**
- Notifikasi datang terlambat
- Notifikasi tidak sesuai waktu

**Penyebab:**
- Server delay
- Koneksi internet lambat
- Email provider delay

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa koneksi internet |
| 2 | Refresh halaman |
| 3 | Cek email secara manual |
| 4 | Tunggu beberapa saat |
| 5 | Hubungi admin jika delay berlanjut |

---

## 🌐 Masalah Koneksi Internet

### Masalah 1: Sistem Tidak Bisa Diakses

**Gejala:**
- Halaman tidak bisa dibuka
- Pesan error "No Internet Connection"
- Loading terus menerus

**Penyebab:**
- Koneksi internet putus
- Server down
- DNS bermasalah

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa koneksi internet |
| 2 | Restart router/modem |
| 3 | Coba website lain |
| 4 | Hubungi provider internet |
| 5 | Tunggu beberapa saat jika server down |

```
📸 [Screenshot: No Internet Connection]
```

---

### Masalah 2: Loading Sangat Lambat

**Gejala:**
- Halaman loading lama
- Gambar tidak muncul
- Data tidak dimuat

**Penyebab:**
- Koneksi internet lambat
- Server sibuk
- Cache browser penuh

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Periksa kecepatan internet |
| 2 | Clear cache browser |
| 3 | Tutup tab yang tidak perlu |
| 4 | Tunggu beberapa saat |
| 5 | Coba koneksi lain |

---

## 🌍 Masalah Browser

### Masalah 1: Tampilan Tidak Beres

**Gejala:**
- Tampilan berantakan
- Tombol tidak muncul
- Layout salah

**Penyebab:**
- Browser tidak didukung
- Browser versi lama
- Cache browser

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Update browser ke versi terbaru |
| 2 | Clear cache browser |
| 3 | Coba browser lain (Chrome) |
| 4 | Disable extension yang tidak perlu |
| 5 | Reset browser ke default |

**Browser yang Didukung:**
- Google Chrome (rekomendasi)
- Microsoft Edge
- Mozilla Firefox
- Safari

```
📸 [Screenshot: Browser yang Didukung]
```

---

### Masalah 2: Fitur Tidak Berfungsi

**Gejala:**
- Tombol tidak berfungsi
- Form tidak muncul
- Error JavaScript

**Penyebab:**
- JavaScript dimatikan
- Extension memblokir
- Browser versi lama

**Solusi:**

| Langkah | Tindakan |
|---------|----------|
| 1 | Aktifkan JavaScript |
| 2 | Disable extension yang mencurigakan |
| 3 | Update browser ke versi terbaru |
| 4 | Coba mode incognito |
| 5 | Coba browser lain |

**Aktifkan JavaScript:**
1. Buka pengaturan browser
2. Cari bagian JavaScript
3. Aktifkan JavaScript
4. Refresh halaman

```
📸 [Screenshot: Aktifkan JavaScript]
```

---

## 📞 Kontak Dukungan

### Kapan Menghubungi Dukungan?

Hubungi dukungan jika:
- ✅ Masalah tidak terselesaikan setelah mencoba solusi di atas
- ✅ Error yang tidak terdokumentasi
- ✅ Masalah keamanan
- ✅ Pertanyaan yang tidak terjawab di FAQ

### Cara Menghubungi

| Metode | Kontak | Jam Operasional |
|--------|--------|-----------------|
| **Email** | support@ppsdm-kmits.com | 24/7 |
| **WhatsApp** | +62 812-3456-7890 | 08:00 - 17:00 WIB |
| **Live Chat** | Tersedia di sistem | 08:00 - 17:00 WIB |
| **Telepon** | +62 31-1234-5678 | 08:00 - 17:00 WIB |

### Informasi yang Diperlukan

Saat menghubungi dukungan, siapkan informasi berikut:

| Informasi | Deskripsi |
|-----------|-----------|
| **Nama** | Nama lengkap Anda |
| **Email** | Email terdaftar |
| **Role** | Admin atau Member |
| **Masalah** | Deskripsi masalah |
| **Screenshot** | Screenshot error (jika ada) |
| **Browser** | Browser dan versi yang digunakan |
| **OS** | Sistem operasi yang digunakan |

### Template Email Dukungan

```
Subjek: Masalah PPSDM KMITS - [Nama Masalah]

Halo Tim Dukungan PPSDM KMITS,

Saya mengalami masalah dengan sistem PPSDM KMITS:

Nama: [Nama Anda]
Email: [Email Anda]
Role: [Admin/Member]

Deskripsi Masalah:
[Deskripsi masalah dengan detail]

Langkah yang Sudah Dilakukan:
1. [Langkah 1]
2. [Langkah 2]
3. [Langkah 3]

Screenshot:
[Lampirkan screenshot jika ada]

Browser: [Nama Browser dan Versi]
OS: [Sistem Operasi]

Mohon bantuannya untuk menyelesaikan masalah ini.

Terima kasih,
[Nama Anda]
```

---

## 📝 Checklist Troubleshooting

Gunakan checklist ini sebelum menghubungi dukungan:

### Masalah Login
- [ ] Periksa email dan password
- [ ] Reset password jika lupa
- [ ] Periksa folder spam
- [ ] Clear cache browser
- [ ] Coba browser lain

### Masalah Google Sheets
- [ ] Matikan pop-up blocker
- [ ] Izinkan akses Google
- [ ] Sinkronisasi manual
- [ ] Hubungkan ulang
- [ ] Periksa koneksi internet

### Masalah Umum
- [ ] Periksa koneksi internet
- [ ] Refresh halaman
- [ ] Clear cache browser
- [ ] Update browser
- [ ] Coba browser lain

---

## 🎯 Tips Mencegah Masalah

### Keamanan
- ✅ Gunakan password yang kuat
- ✅ Ganti password secara berkala
- ✅ Jangan berbagi password
- ✅ Logout setelah selesai

### Koneksi
- ✅ Gunakan koneksi internet yang stabil
- ✅ Periksa koneksi sebelum menggunakan sistem
- ✅ Simpan data secara berkala

### Browser
- ✅ Gunakan browser yang direkomendasikan
- ✅ Update browser ke versi terbaru
- ✅ Clear cache secara berkala
- ✅ Disable extension yang tidak perlu

### Data
- ✅ Backup data secara berkala
- ✅ Export data ke Google Sheets
- ✅ Simpan laporan penting

---

**Versi Dokumen:** 1.0  
**Terakhir Diperbarui:** 10 Februari 2026  
**Tim PPSDM KMITS**
