# Dokumentasi Spreadsheet Templates PPSDM KMMITS

> **Panduan Lengkap untuk Pengelolaan Data Master**
> 
> Dokumentasi ini menjelaskan struktur, aturan, dan cara penggunaan spreadsheet templates untuk 6 master data utama sistem PPSDM KMMITS.

---

## 📋 Daftar Isi

1. [Activities Template](#1-activities-template)
2. [Members Template](#2-members-template)
3. [Finances Template](#3-finances-template)
4. [Assessments Template](#4-assessments-template)
5. [Knowledge Template](#5-knowledge-template)
6. [Projects Template](#6-projects-template)
7. [Panduan Umum](#panduan-umum)

---

## 1. ACTIVITIES TEMPLATE

### 📊 Struktur Kolom

| No | Kolom | Tipe Data | Wajib | Deskripsi |
|----|-------|-----------|-------|-----------|
| 1 | `activity_id` | Text | Ya | ID unik kegiatan (format: ACT-YYYY-XXXX) |
| 2 | `activity_name` | Text | Ya | Nama kegiatan |
| 3 | `activity_type` | Dropdown | Ya | Jenis kegiatan |
| 4 | `category` | Dropdown | Ya | Kategori kegiatan |
| 5 | `description` | Text | Tidak | Deskripsi lengkap kegiatan |
| 6 | `start_date` | Date | Ya | Tanggal mulai kegiatan |
| 7 | `end_date` | Date | Ya | Tanggal selesai kegiatan |
| 8 | `location` | Text | Ya | Lokasi pelaksanaan |
| 9 | `status` | Dropdown | Ya | Status kegiatan |
| 10 | `budget` | Currency | Tidak | Anggaran kegiatan |
| 11 | `actual_cost` | Currency | Tidak | Biaya aktual |
| 12 | `organizer` | Text | Ya | Penanggung jawab |
| 13 | `participants_count` | Number | Tidak | Jumlah peserta |
| 14 | `created_at` | Date | Ya | Tanggal pembuatan data |
| 15 | `updated_at` | Date | Ya | Tanggal terakhir update |

### ✅ Data Validation Rules

#### Kolom `activity_id`
- **Format**: `ACT-YYYY-XXXX` (contoh: ACT-2024-0001)
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 20 karakter

#### Kolom `activity_name`
- **Panjang**: 5-200 karakter
- **Tidak boleh kosong**

#### Kolom `activity_type` (Dropdown)
```
- Pelatihan
- Workshop
- Seminar
- Kompetisi
- Kunjungan
- Rapat
- Lainnya
```

#### Kolom `category` (Dropdown)
```
- Akademik
- Non-Akademik
- Organisasi
- Sosial
- Kepemimpinan
- Kewirausahaan
- Teknis
```

#### Kolom `start_date` dan `end_date`
- **Format**: DD/MM/YYYY
- **Validasi**: `end_date` harus >= `start_date`

#### Kolom `status` (Dropdown)
```
- Terencana
- Sedang Berjalan
- Selesai
- Dibatalkan
- Ditunda
```

#### Kolom `budget` dan `actual_cost`
- **Format**: Angka dengan 2 desimal
- **Minimum**: 0
- **Tidak boleh negatif**

#### Kolom `participants_count`
- **Tipe**: Bilangan bulat
- **Minimum**: 0
- **Tidak boleh negatif**

### 📝 Contoh Data

| activity_id | activity_name | activity_type | category | description | start_date | end_date | location | status | budget | actual_cost | organizer | participants_count | created_at | updated_at |
|-------------|---------------|---------------|----------|-------------|------------|----------|----------|--------|--------|-------------|-----------|-------------------|------------|------------|
| ACT-2024-0001 | Pelatihan Kepemimpinan Dasar | Pelatihan | Kepemimpinan | Pelatihan dasar untuk calon pengurus baru | 15/01/2024 | 17/01/2024 | Aula Gedung A | Selesai | 5.000.000 | 4.750.000 | Budi Santoso | 25 | 10/01/2024 | 18/01/2024 |
| ACT-2024-0002 | Workshop Web Development | Workshop | Teknis | Workshop pembuatan website modern | 20/01/2024 | 22/01/2024 | Lab Komputer | Sedang Berjalan | 3.000.000 | - | Ahmad Rizki | 15 | 15/01/2024 | 20/01/2024 |
| ACT-2024-0003 | Seminar Karir | Seminar | Akademik | Seminar persiapan karir setelah lulus | 25/02/2024 | 25/02/2024 | Auditorium | Terencana | 2.500.000 | - | Siti Aminah | 100 | 20/01/2024 | 20/01/2024 |

### 🧮 Formula yang Digunakan

#### 1. Menghitung Durasi (Hari)
```
=DATEDIF(start_date, end_date, "D") + 1
```
**Penjelasan**: Menghitung jumlah hari kegiatan

#### 2. Menghitung Selisih Budget
```
=budget - actual_cost
```
**Penjelasan**: Selisih antara anggaran dan biaya aktual

#### 3. Menghitung Persentase Penggunaan Budget
```
=IF(budget>0, (actual_cost/budget)*100, 0)
```
**Penjelasan**: Persentase penggunaan anggaran

#### 4. Status Otomatis Berdasarkan Tanggal
```
=IF(TODAY()<start_date, "Terencana", 
   IF(TODAY()<=end_date, "Sedang Berjalan", "Selesai"))
```
**Penjelasan**: Menentukan status berdasarkan tanggal hari ini

#### 5. Biaya per Peserta
```
=IF(participants_count>0, actual_cost/participants_count, 0)
```
**Penjelasan**: Menghitung biaya per peserta

### 🎨 Conditional Formatting Rules

#### 1. Status Berdasarkan Warna
- **Terencana**: Background hijau muda (`#C6F6D5`)
- **Sedang Berjalan**: Background kuning (`#FEFCBF`)
- **Selesai**: Background biru muda (`#BEE3F8`)
- **Dibatalkan**: Background merah muda (`#FED7D7`)
- **Ditunda**: Background abu-abu (`#E2E8F0`)

#### 2. Over Budget Warning
- **Kondisi**: `actual_cost > budget`
- **Format**: Teks merah tebal, background merah muda

#### 3. Deadline Mendekat (7 hari)
- **Kondisi**: `AND(end_date-TODAY()<=7, end_date>=TODAY())`
- **Format**: Teks oranye tebal

#### 4. Kegiatan Selesai
- **Kondisi**: `status="Selesai"`
- **Format**: Teks hijau, strikethrough

#### 5. Budget Tidak Terisi
- **Kondisi**: `AND(budget="", status<>"Terencana")`
- **Format**: Background kuning, border merah

### 🔽 Dropdown Menu Options

#### activity_type
```
Pelatihan
Workshop
Seminar
Kompetisi
Kunjungan
Rapat
Lainnya
```

#### category
```
Akademik
Non-Akademik
Organisasi
Sosial
Kepemimpinan
Kewirausahaan
Teknis
```

#### status
```
Terencana
Sedang Berjalan
Selesai
Dibatalkan
Ditunda
```

---

## 2. MEMBERS TEMPLATE

### 📊 Struktur Kolom

| No | Kolom | Tipe Data | Wajib | Deskripsi |
|----|-------|-----------|-------|-----------|
| 1 | `member_id` | Text | Ya | ID unik anggota (format: MEM-YYYY-XXXX) |
| 2 | `full_name` | Text | Ya | Nama lengkap |
| 3 | `nim` | Text | Ya | Nomor Induk Mahasiswa |
| 4 | `email` | Email | Ya | Email aktif |
| 5 | `phone` | Text | Ya | Nomor telepon |
| 6 | `gender` | Dropdown | Ya | Jenis kelamin |
| 7 | `birth_date` | Date | Ya | Tanggal lahir |
| 8 | `study_program` | Dropdown | Ya | Program studi |
| 9 | `batch` | Number | Ya | Angkatan |
| 10 | `division` | Dropdown | Tidak | Divisi/Departemen |
| 11 | `position` | Dropdown | Tidak | Jabatan |
| 12 | `join_date` | Date | Ya | Tanggal bergabung |
| 13 | `status` | Dropdown | Ya | Status keanggotaan |
| 14 | `address` | Text | Tidak | Alamat lengkap |
| 15 | `skills` | Text | Tidak | Keahlian (pisahkan dengan koma) |
| 16 | `emergency_contact` | Text | Ya | Kontak darurat |
| 17 | `emergency_phone` | Text | Ya | Nomor kontak darurat |
| 18 | `created_at` | Date | Ya | Tanggal pembuatan data |
| 19 | `updated_at` | Date | Ya | Tanggal terakhir update |

### ✅ Data Validation Rules

#### Kolom `member_id`
- **Format**: `MEM-YYYY-XXXX` (contoh: MEM-2024-0001)
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 20 karakter

#### Kolom `full_name`
- **Panjang**: 3-100 karakter
- **Format**: Huruf dan spasi saja

#### Kolom `nim`
- **Format**: 14 digit angka
- **Unik**: Tidak boleh ada duplikat
- **Contoh**: `5024211001`

#### Kolom `email`
- **Format**: Valid email address
- **Domain**: Harus menggunakan domain `its.ac.id` atau `gmail.com`
- **Unik**: Tidak boleh ada duplikat

#### Kolom `phone`
- **Format**: 10-15 digit angka
- **Diawali**: `08` atau `62`

#### Kolom `gender` (Dropdown)
```
- Laki-laki
- Perempuan
```

#### Kolom `birth_date`
- **Format**: DD/MM/YYYY
- **Validasi**: Umur minimal 15 tahun

#### Kolom `study_program` (Dropdown)
```
- Teknik Mesin
- Teknik Sipil
- Teknik Elektro
- Teknik Kimia
- Teknik Industri
- Teknik Perkapalan
- Teknik Sistem Perkapalan
- Teknik Material
- Teknik Fisika
- Teknik Informatika
- Sistem Informasi
- Desain Produk Industri
- Teknik Lingkungan
- Perencanaan Wilayah dan Kota
- Teknik Kelautan
- Teknik Oseanografi
- Lainnya
```

#### Kolom `batch`
- **Tipe**: Bilangan bulat
- **Range**: 2000-2030
- **Contoh**: 2024

#### Kolom `division` (Dropdown)
```
- BPH (Badan Pengurus Harian)
- PSDM (Pengembangan Sumber Daya Mahasiswa)
- Humas (Hubungan Masyarakat)
- Medinfo (Media dan Informasi)
- Kaderisasi
- Keuangan
- Pengabdian Masyarakat
- Minat dan Bakat
- Belum Ada
```

#### Kolom `position` (Dropdown)
```
- Ketua
- Wakil Ketua
- Sekretaris
- Bendahara
- Koordinator Divisi
- Staff
- Anggota
- Alumni
```

#### Kolom `status` (Dropdown)
```
- Aktif
- Non-Aktif
- Alumni
- Cuti
- Dikeluarkan
```

### 📝 Contoh Data

| member_id | full_name | nim | email | phone | gender | birth_date | study_program | batch | division | position | join_date | status | skills | emergency_contact | emergency_phone | created_at | updated_at |
|-----------|-----------|-----|-------|-------|--------|------------|---------------|-------|----------|----------|-----------|--------|--------|-------------------|-----------------|------------|------------|
| MEM-2024-0001 | Budi Santoso | 5024211001 | budi@its.ac.id | 081234567890 | Laki-laki | 15/05/2002 | Teknik Mesin | 2021 | PSDM | Koordinator Divisi | 01/09/2021 | Aktif | Leadership, Public Speaking, Event Management | Ahmad Santoso | 081234567891 | 01/09/2021 | 10/01/2024 |
| MEM-2024-0002 | Siti Aminah | 5024211002 | siti@its.ac.id | 081234567891 | Perempuan | 20/08/2002 | Teknik Informatika | 2021 | Humas | Staff | 01/09/2021 | Aktif | Graphic Design, Social Media, Content Creation | Haryanto | 081234567892 | 01/09/2021 | 10/01/2024 |
| MEM-2024-0003 | Ahmad Rizki | 5023211001 | ahmad@its.ac.id | 081234567892 | Laki-laki | 10/03/2003 | Teknik Elektro | 2022 | Belum Ada | Anggota | 15/01/2024 | Aktif | Programming, Electronics, IoT | Budi Rizki | 081234567893 | 15/01/2024 | 15/01/2024 |

### 🧮 Formula yang Digunakan

#### 1. Menghitung Umur
```
=DATEDIF(birth_date, TODAY(), "Y")
```
**Penjelasan**: Menghitung umur dalam tahun

#### 2. Menghitung Masa Keanggotaan (Bulan)
```
=DATEDIF(join_date, TODAY(), "M")
```
**Penjelasan**: Menghitung lama menjadi anggota dalam bulan

#### 3. Validasi Email ITS
```
=IF(ISNUMBER(SEARCH("@its.ac.id", email)), "Valid", "Perlu Verifikasi")
```
**Penjelasan**: Memeriksa apakah email menggunakan domain ITS

#### 4. Jumlah Skill
```
=IF(skills="", 0, LEN(skills)-LEN(SUBSTITUTE(skills, ",", ""))+1)
```
**Penjelasan**: Menghitung jumlah skill yang dimiliki

#### 5. Status Alumni Otomatis
```
=IF(DATEDIF(join_date, TODAY(), "Y")>=4, "Alumni", status)
```
**Penjelasan**: Otomatis mengubah status menjadi alumni setelah 4 tahun

### 🎨 Conditional Formatting Rules

#### 1. Status Berdasarkan Warna
- **Aktif**: Background hijau muda (`#C6F6D5`)
- **Non-Aktif**: Background abu-abu (`#E2E8F0`)
- **Alumni**: Background biru muda (`#BEE3F8`)
- **Cuti**: Background kuning (`#FEFCBF`)
- **Dikeluarkan**: Background merah muda (`#FED7D7`)

#### 2. Email Tidak Valid
- **Kondisi**: `AND(ISERROR(SEARCH("@", email)), email<>"")`
- **Format**: Teks merah tebal

#### 3. NIM Tidak Valid
- **Kondisi**: `OR(LEN(nim)<>14, ISERROR(VALUE(nim)))`
- **Format**: Teks merah, background kuning

#### 4. Anggota Baru (< 1 bulan)
- **Kondisi**: `DATEDIF(join_date, TODAY(), "M")<1`
- **Format**: Background hijau terang, border hijau tebal

#### 5. Jabatan Kosong untuk Anggota Aktif
- **Kondisi**: `AND(status="Aktif", position="")`
- **Format**: Background kuning, border oranye

### 🔽 Dropdown Menu Options

#### gender
```
Laki-laki
Perempuan
```

#### study_program
```
Teknik Mesin
Teknik Sipil
Teknik Elektro
Teknik Kimia
Teknik Industri
Teknik Perkapalan
Teknik Sistem Perkapalan
Teknik Material
Teknik Fisika
Teknik Informatika
Sistem Informasi
Desain Produk Industri
Teknik Lingkungan
Perencanaan Wilayah dan Kota
Teknik Kelautan
Teknik Oseanografi
Lainnya
```

#### division
```
BPH (Badan Pengurus Harian)
PSDM (Pengembangan Sumber Daya Mahasiswa)
Humas (Hubungan Masyarakat)
Medinfo (Media dan Informasi)
Kaderisasi
Keuangan
Pengabdian Masyarakat
Minat dan Bakat
Belum Ada
```

#### position
```
Ketua
Wakil Ketua
Sekretaris
Bendahara
Koordinator Divisi
Staff
Anggota
Alumni
```

#### status
```
Aktif
Non-Aktif
Alumni
Cuti
Dikeluarkan
```

---

## 3. FINANCES TEMPLATE

### 📊 Struktur Kolom

| No | Kolom | Tipe Data | Wajib | Deskripsi |
|----|-------|-----------|-------|-----------|
| 1 | `transaction_id` | Text | Ya | ID unik transaksi (format: FIN-YYYY-XXXX) |
| 2 | `transaction_date` | Date | Ya | Tanggal transaksi |
| 3 | `transaction_type` | Dropdown | Ya | Jenis transaksi |
| 4 | `category` | Dropdown | Ya | Kategori transaksi |
| 5 | `description` | Text | Ya | Deskripsi transaksi |
| 6 | `amount` | Currency | Ya | Jumlah uang |
| 7 | `payment_method` | Dropdown | Ya | Metode pembayaran |
| 8 | `related_activity` | Text | Tidak | Kegiatan terkait |
| 9 | `related_member` | Text | Tidak | Anggota terkait |
| 10 | `receipt_number` | Text | Tidak | Nomor bukti/kwitansi |
| 11 | `approved_by` | Text | Ya | Yang menyetujui |
| 12 | `status` | Dropdown | Ya | Status transaksi |
| 13 | `notes` | Text | Tidak | Catatan tambahan |
| 14 | `created_at` | Date | Ya | Tanggal pembuatan data |
| 15 | `updated_at` | Date | Ya | Tanggal terakhir update |

### ✅ Data Validation Rules

#### Kolom `transaction_id`
- **Format**: `FIN-YYYY-XXXX` (contoh: FIN-2024-0001)
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 20 karakter

#### Kolom `transaction_date`
- **Format**: DD/MM/YYYY
- **Validasi**: Tidak boleh di masa depan

#### Kolom `transaction_type` (Dropdown)
```
- Pemasukan
- Pengeluaran
```

#### Kolom `category` (Dropdown)
```
Untuk Pemasukan:
- Iuran Anggota
- Sponsorship
- Donasi
- Penjualan Merchandise
- Pendapatan Kegiatan
- Lainnya

Untuk Pengeluaran:
- Operasional
- Kegiatan
- Perlengkapan
- Konsumsi
- Transportasi
- Lainnya
```

#### Kolom `description`
- **Panjang**: 5-500 karakter
- **Tidak boleh kosong**

#### Kolom `amount`
- **Format**: Angka dengan 2 desimal
- **Minimum**: 0
- **Tidak boleh negatif**

#### Kolom `payment_method` (Dropdown)
```
- Tunai
- Transfer Bank
- E-Wallet (GoPay, OVO, dll)
- QRIS
- Cek/Giro
```

#### Kolom `receipt_number`
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 50 karakter

#### Kolom `status` (Dropdown)
```
- Pending
- Disetujui
- Ditolak
- Selesai
```

### 📝 Contoh Data

| transaction_id | transaction_date | transaction_type | category | description | amount | payment_method | related_activity | related_member | receipt_number | approved_by | status | notes | created_at | updated_at |
|-----------------|------------------|------------------|----------|-------------|--------|----------------|------------------|----------------|----------------|-------------|--------|-------|------------|------------|
| FIN-2024-0001 | 05/01/2024 | Pemasukan | Iuran Anggota | Iuran bulanan Januari 2024 | 2.500.000 | Transfer Bank | - | - | INV-2024-001 | Budi Santoso | Selesai | - | 05/01/2024 | 05/01/2024 |
| FIN-2024-0002 | 10/01/2024 | Pengeluaran | Operasional | Pembayaran listrik dan internet | 500.000 | Transfer Bank | - | - | INV-2024-002 | Siti Aminah | Selesai | Pembayaran bulanan | 10/01/2024 | 10/01/2024 |
| FIN-2024-0003 | 15/01/2024 | Pengeluaran | Kegiatan | Konsumsi pelatihan kepemimpinan | 1.200.000 | Tunai | ACT-2024-0001 | - | INV-2024-003 | Ahmad Rizki | Selesai | 25 orang x Rp 48.000 | 15/01/2024 | 15/01/2024 |
| FIN-2024-0004 | 20/01/2024 | Pemasukan | Sponsorship | Sponsorship dari PT ABC | 10.000.000 | Transfer Bank | ACT-2024-0002 | - | INV-2024-004 | Budi Santoso | Disetujui | - | 20/01/2024 | 20/01/2024 |

### 🧮 Formula yang Digunakan

#### 1. Total Pemasukan
```
=SUMIF(transaction_type, "Pemasukan", amount)
```
**Penjelasan**: Menghitung total semua pemasukan

#### 2. Total Pengeluaran
```
=SUMIF(transaction_type, "Pengeluaran", amount)
```
**Penjelasan**: Menghitung total semua pengeluaran

#### 3. Saldo Akhir
```
=SUMIF(transaction_type, "Pemasukan", amount) - SUMIF(transaction_type, "Pengeluaran", amount)
```
**Penjelasan**: Menghitung saldo akhir (pemasukan - pengeluaran)

#### 4. Total per Kategori
```
=SUMIFS(amount, category, "Kegiatan", transaction_type, "Pengeluaran")
```
**Penjelasan**: Menghitung total pengeluaran untuk kategori tertentu

#### 5. Rasio Pengeluaran terhadap Pemasukan
```
=IF(SUMIF(transaction_type, "Pemasukan", amount)>0, 
   (SUMIF(transaction_type, "Pengeluaran", amount)/SUMIF(transaction_type, "Pemasukan", amount))*100, 
   0)
```
**Penjelasan**: Persentase pengeluaran dari total pemasukan

#### 6. Rata-rata Transaksi per Bulan
```
=AVERAGEIFS(amount, transaction_date, ">="&DATE(YEAR(TODAY()), MONTH(TODAY()), 1), 
            transaction_date, "<="&EOMONTH(TODAY(), 0))
```
**Penjelasan**: Rata-rata transaksi dalam bulan berjalan

### 🎨 Conditional Formatting Rules

#### 1. Jenis Transaksi Berdasarkan Warna
- **Pemasukan**: Background hijau muda (`#C6F6D5`), teks hijau tua
- **Pengeluaran**: Background merah muda (`#FED7D7`), teks merah tua

#### 2. Status Berdasarkan Warna
- **Pending**: Background kuning (`#FEFCBF`)
- **Disetujui**: Background hijau muda (`#C6F6D5`)
- **Ditolak**: Background merah muda (`#FED7D7`)
- **Selesai**: Background biru muda (`#BEE3F8`)

#### 3. Jumlah Besar (> Rp 5.000.000)
- **Kondisi**: `amount>5000000`
- **Format**: Teks tebal, background kuning, border tebal

#### 4. Saldo Negatif
- **Kondisi**: `saldo_akhir<0`
- **Format**: Teks merah tebal, background merah muda

#### 5. Transaksi Tanpa Bukti
- **Kondisi**: `AND(receipt_number="", status<>"Pending")`
- **Format**: Background kuning, border oranye

#### 6. Transaksi Belum Disetujui (> 7 hari)
- **Kondisi**: `AND(status="Pending", TODAY()-transaction_date>7)`
- **Format**: Teks merah tebal, background merah muda

### 🔽 Dropdown Menu Options

#### transaction_type
```
Pemasukan
Pengeluaran
```

#### category
```
Iuran Anggota
Sponsorship
Donasi
Penjualan Merchandise
Pendapatan Kegiatan
Operasional
Kegiatan
Perlengkapan
Konsumsi
Transportasi
Lainnya
```

#### payment_method
```
Tunai
Transfer Bank
E-Wallet (GoPay, OVO, dll)
QRIS
Cek/Giro
```

#### status
```
Pending
Disetujui
Ditolak
Selesai
```

---

## 4. ASSESSMENTS TEMPLATE

### 📊 Struktur Kolom

| No | Kolom | Tipe Data | Wajib | Deskripsi |
|----|-------|-----------|-------|-----------|
| 1 | `assessment_id` | Text | Ya | ID unik penilaian (format: ASM-YYYY-XXXX) |
| 2 | `member_id` | Text | Ya | ID anggota yang dinilai |
| 3 | `member_name` | Text | Ya | Nama anggota |
| 4 | `assessment_type` | Dropdown | Ya | Jenis penilaian |
| 5 | `assessment_date` | Date | Ya | Tanggal penilaian |
| 6 | `period` | Text | Ya | Periode penilaian |
| 7 | `assessor` | Text | Ya | Penilai |
| 8 | `cognitive_score` | Number | Ya | Skor kognitif (0-100) |
| 9 | `emotional_score` | Number | Ya | Skor emosional (0-100) |
| 10 | `physical_score` | Number | Ya | Skor fisik (0-100) |
| 11 | `mental_score` | Number | Ya | Skor mental (0-100) |
| 12 | `character_score` | Number | Ya | Skor karakter (0-100) |
| 13 | `spiritual_score` | Number | Ya | Skor spiritual (0-100) |
| 14 | `environmental_score` | Number | Ya | Skor lingkungan (0-100) |
| 15 | `total_score` | Number | Ya | Total skor rata-rata |
| 16 | `grade` | Text | Ya | Predikat |
| 17 | `feedback` | Text | Tidak | Feedback penilai |
| 18 | `improvement_plan` | Text | Tidak | Rencana perbaikan |
| 19 | `status` | Dropdown | Ya | Status penilaian |
| 20 | `created_at` | Date | Ya | Tanggal pembuatan data |
| 21 | `updated_at` | Date | Ya | Tanggal terakhir update |

### ✅ Data Validation Rules

#### Kolom `assessment_id`
- **Format**: `ASM-YYYY-XXXX` (contoh: ASM-2024-0001)
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 20 karakter

#### Kolom `member_id`
- **Format**: Harus sesuai dengan format member_id
- **Validasi**: Harus ada di data Members

#### Kolom `assessment_type` (Dropdown)
```
- Penilaian Bulanan
- Penilaian Semester
- Penilaian Tahunan
- Penilaian Khusus
- Self Assessment
- Peer Assessment
```

#### Kolom `assessment_date`
- **Format**: DD/MM/YYYY
- **Validasi**: Tidak boleh di masa depan

#### Kolom `period`
- **Format**: `YYYY-MM` atau `YYYY-Semester X`
- **Contoh**: `2024-01` atau `2024-Semester 1`

#### Kolom Skor (cognitive_score, emotional_score, dll)
- **Tipe**: Bilangan bulat
- **Range**: 0-100
- **Tidak boleh kosong**

#### Kolom `total_score`
- **Tipe**: Bilangan bulat
- **Range**: 0-100
- **Dihitung otomatis dari rata-rata semua skor

#### Kolom `grade` (Dropdown)
```
- A (Sangat Baik)
- B (Baik)
- C (Cukup)
- D (Kurang)
- E (Sangat Kurang)
```

#### Kolom `status` (Dropdown)
```
- Draft
- Disetujui
- Ditolak
- Selesai
```

### 📝 Contoh Data

| assessment_id | member_id | member_name | assessment_type | assessment_date | period | assessor | cognitive_score | emotional_score | physical_score | mental_score | character_score | spiritual_score | environmental_score | total_score | grade | feedback | improvement_plan | status | created_at | updated_at |
|---------------|-----------|-------------|-----------------|-----------------|--------|----------|-----------------|-----------------|-----------------|--------------|-----------------|-----------------|---------------------|-------------|-------|----------|------------------|--------|------------|------------|
| ASM-2024-0001 | MEM-2024-0001 | Budi Santoso | Penilaian Bulanan | 31/01/2024 | 2024-01 | Ahmad Rizki | 85 | 90 | 80 | 88 | 92 | 85 | 87 | 87 | B | Performa sangat baik, perlu tingkatkan aspek fisik | Program olahraga rutin 3x seminggu | Selesai | 31/01/2024 | 31/01/2024 |
| ASM-2024-0002 | MEM-2024-0002 | Siti Aminah | Penilaian Bulanan | 31/01/2024 | 2024-01 | Budi Santoso | 92 | 88 | 85 | 90 | 95 | 90 | 88 | 90 | A | Konsisten dalam semua aspek, contoh yang baik | Lanjutkan program mentoring untuk anggota baru | Selesai | 31/01/2024 | 31/01/2024 |
| ASM-2024-0003 | MEM-2024-0003 | Ahmad Rizki | Penilaian Bulanan | 31/01/2024 | 2024-01 | Siti Aminah | 78 | 75 | 82 | 80 | 85 | 80 | 78 | 80 | B | Perlu pengembangan di aspek kognitif dan emosional | Ikuti workshop soft skill dan leadership | Selesai | 31/01/2024 | 31/01/2024 |

### 🧮 Formula yang Digunakan

#### 1. Total Score (Rata-rata)
```
=AVERAGE(cognitive_score, emotional_score, physical_score, mental_score, character_score, spiritual_score, environmental_score)
```
**Penjelasan**: Menghitung rata-rata dari semua skor

#### 2. Grade Otomatis
```
=IF(total_score>=90, "A (Sangat Baik)",
   IF(total_score>=80, "B (Baik)",
      IF(total_score>=70, "C (Cukup)",
         IF(total_score>=60, "D (Kurang)", "E (Sangat Kurang)"))))
```
**Penjelasan**: Menentukan predikat berdasarkan total skor

#### 3. Rata-rata per Kategori
```
=AVERAGEIF(period, "2024-01", cognitive_score)
```
**Penjelasan**: Menghitung rata-rata skor kognitif untuk periode tertentu

#### 4. Peringkat Anggota
```
=RANK(total_score, total_score_range, 0)
```
**Penjelasan**: Menentukan peringkat anggota berdasarkan total skor

#### 5. Persentase Peningkatan
```
=IF(previous_score>0, ((current_score-previous_score)/previous_score)*100, 0)
```
**Penjelasan**: Menghitung persentase peningkatan dari penilaian sebelumnya

#### 6. Skor Tertinggi dan Terendah
```
=MAX(cognitive_score_range)
=MIN(cognitive_score_range)
```
**Penjelasan**: Menemukan skor tertinggi dan terendah

### 🎨 Conditional Formatting Rules

#### 1. Grade Berdasarkan Warna
- **A (Sangat Baik)**: Background hijau (`#48BB78`), teks putih
- **B (Baik)**: Background biru hijau (`#38B2AC`), teks putih
- **C (Cukup)**: Background kuning (`#ECC94B`), teks hitam
- **D (Kurang)**: Background oranye (`#ED8936`), teks putih
- **E (Sangat Kurang)**: Background merah (`#F56565`), teks putih

#### 2. Skor Tinggi (>= 90)
- **Kondisi**: `cognitive_score>=90`
- **Format**: Teks hijau tebal, background hijau muda

#### 3. Skor Rendah (< 60)
- **Kondisi**: `cognitive_score<60`
- **Format**: Teks merah tebal, background merah muda

#### 4. Status Berdasarkan Warna
- **Draft**: Background abu-abu (`#E2E8F0`)
- **Disetujui**: Background hijau muda (`#C6F6D5`)
- **Ditolak**: Background merah muda (`#FED7D7`)
- **Selesai**: Background biru muda (`#BEE3F8`)

#### 5. Top Performer (Top 10%)
- **Kondisi**: `RANK(total_score, range)<=CEILING(COUNT(range)*0.1, 1)`
- **Format**: Background emas (`#F6E05E`), border emas tebal

#### 6. Perlu Perhatian (Skor < 70)
- **Kondisi**: `total_score<70`
- **Format**: Background merah muda, border merah tebal

### 🔽 Dropdown Menu Options

#### assessment_type
```
Penilaian Bulanan
Penilaian Semester
Penilaian Tahunan
Penilaian Khusus
Self Assessment
Peer Assessment
```

#### grade
```
A (Sangat Baik)
B (Baik)
C (Cukup)
D (Kurang)
E (Sangat Kurang)
```

#### status
```
Draft
Disetujui
Ditolak
Selesai
```

---

## 5. KNOWLEDGE TEMPLATE

### 📊 Struktur Kolom

| No | Kolom | Tipe Data | Wajib | Deskripsi |
|----|-------|-----------|-------|-----------|
| 1 | `knowledge_id` | Text | Ya | ID unik pengetahuan (format: KNL-YYYY-XXXX) |
| 2 | `title` | Text | Ya | Judul materi |
| 3 | `category` | Dropdown | Ya | Kategori materi |
| 4 | `type` | Dropdown | Ya | Tipe materi |
| 5 | `description` | Text | Ya | Deskripsi singkat |
| 6 | `content` | Text | Tidak | Konten lengkap |
| 7 | `author` | Text | Ya | Penulis/pembuat |
| 8 | `created_date` | Date | Ya | Tanggal pembuatan |
| 9 | `last_updated` | Date | Ya | Tanggal terakhir update |
| 10 | `tags` | Text | Tidak | Tag (pisahkan dengan koma) |
| 11 | `difficulty_level` | Dropdown | Ya | Tingkat kesulitan |
| 12 | `estimated_duration` | Number | Tidak | Durasi estimasi (menit) |
| 13 | `language` | Dropdown | Ya | Bahasa |
| 14 | `file_url` | Text | Tidak | URL file/attachment |
| 15 | `related_knowledge` | Text | Tidak | Materi terkait |
| 16 | `view_count` | Number | Ya | Jumlah dilihat |
| 17 | `download_count` | Number | Ya | Jumlah diunduh |
| 18 | `rating` | Number | Ya | Rating (1-5) |
| 19 | `status` | Dropdown | Ya | Status materi |
| 20 | `created_at` | Date | Ya | Tanggal pembuatan data |
| 21 | `updated_at` | Date | Ya | Tanggal terakhir update |

### ✅ Data Validation Rules

#### Kolom `knowledge_id`
- **Format**: `KNL-YYYY-XXXX` (contoh: KNL-2024-0001)
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 20 karakter

#### Kolom `title`
- **Panjang**: 5-200 karakter
- **Tidak boleh kosong**

#### Kolom `category` (Dropdown)
```
- Leadership
- Manajemen Organisasi
- Public Speaking
- Event Management
- Technical Skills
- Soft Skills
- Financial Management
- Project Management
- Communication
- Team Building
- Problem Solving
- Decision Making
- Lainnya
```

#### Kolom `type` (Dropdown)
```
- Artikel
- Video
- E-Book
- Slide Presentasi
- Infografis
- Podcast
- Modul Pelatihan
- Template
- Checklist
- Lainnya
```

#### Kolom `description`
- **Panjang**: 10-500 karakter
- **Tidak boleh kosong**

#### Kolom `difficulty_level` (Dropdown)
```
- Pemula
- Menengah
- Lanjutan
- Expert
```

#### Kolom `estimated_duration`
- **Tipe**: Bilangan bulat
- **Minimum**: 1
- **Satuan**: Menit

#### Kolom `language` (Dropdown)
```
- Bahasa Indonesia
- English
- Bahasa Indonesia & English
```

#### Kolom `rating`
- **Tipe**: Bilangan bulat
- **Range**: 1-5
- **Default**: 0

#### Kolom `status` (Dropdown)
```
- Draft
- Published
- Archived
- Private
```

### 📝 Contoh Data

| knowledge_id | title | category | type | description | author | created_date | last_updated | tags | difficulty_level | estimated_duration | language | file_url | view_count | download_count | rating | status | created_at | updated_at |
|--------------|-------|----------|------|-------------|--------|--------------|--------------|------|------------------|---------------------|----------|----------|------------|-----------------|--------|--------|------------|------------|
| KNL-2024-0001 | Dasar-Dasar Kepemimpinan | Leadership | Modul Pelatihan | Panduan lengkap dasar kepemimpinan untuk mahasiswa | Budi Santoso | 01/01/2024 | 15/01/2024 | leadership, manajemen, soft skill | Pemula | 60 | Bahasa Indonesia | https://drive.google.com/... | 150 | 45 | 4.5 | Published | 01/01/2024 | 15/01/2024 |
| KNL-2024-0002 | Public Speaking untuk Pemula | Public Speaking | Video | Tutorial public speaking dasar dengan contoh praktis | Siti Aminah | 05/01/2024 | 10/01/2024 | public speaking, komunikasi, presentasi | Pemula | 45 | Bahasa Indonesia | https://youtube.com/... | 200 | 80 | 4.8 | Published | 05/01/2024 | 10/01/2024 |
| KNL-2024-0003 | Manajemen Keuangan Organisasi | Financial Management | E-Book | Buku panduan manajemen keuangan untuk organisasi mahasiswa | Ahmad Rizki | 10/01/2024 | 20/01/2024 | keuangan, manajemen, budgeting | Menengah | 120 | Bahasa Indonesia | https://drive.google.com/... | 100 | 30 | 4.2 | Published | 10/01/2024 | 20/01/2024 |
| KNL-2024-0004 | Event Management Checklist | Event Management | Checklist | Checklist lengkap untuk mengelola event dari awal hingga akhir | Budi Santoso | 15/01/2024 | 15/01/2024 | event, manajemen, checklist | Menengah | 30 | Bahasa Indonesia | https://docs.google.com/... | 75 | 25 | 4.0 | Published | 15/01/2024 | 15/01/2024 |

### 🧮 Formula yang Digunakan

#### 1. Total Engagement
```
=view_count + download_count
```
**Penjelasan**: Total interaksi dengan materi

#### 2. Engagement Rate
```
=IF(view_count>0, (download_count/view_count)*100, 0)
```
**Penjelasan**: Persentase pengguna yang mengunduh materi

#### 3. Rating dalam Bintang
```
=REPT("★", rating) & REPT("☆", 5-rating)
```
**Penjelasan**: Menampilkan rating dalam format bintang

#### 4. Materi Terpopuler (Top 10)
```
=IF(RANK(view_count, view_count_range)<=10, "Top 10", "")
```
**Penjelasan**: Menandai materi yang masuk 10 terpopuler

#### 5. Umur Materi (Hari)
```
=DATEDIF(created_date, TODAY(), "D")
```
**Penjelasan**: Menghitung umur materi dalam hari

#### 6. Rata-rata Rating per Kategori
```
=AVERAGEIF(category, "Leadership", rating)
```
**Penjelasan**: Menghitung rata-rata rating untuk kategori tertentu

### 🎨 Conditional Formatting Rules

#### 1. Status Berdasarkan Warna
- **Draft**: Background abu-abu (`#E2E8F0`)
- **Published**: Background hijau muda (`#C6F6D5`)
- **Archived**: Background kuning (`#FEFCBF`)
- **Private**: Background biru muda (`#BEE3F8`)

#### 2. Tingkat Kesulitan Berdasarkan Warna
- **Pemula**: Background hijau (`#48BB78`), teks putih
- **Menengah**: Background kuning (`#ECC94B`), teks hitam
- **Lanjutan**: Background oranye (`#ED8936`), teks putih
- **Expert**: Background merah (`#F56565`), teks putih

#### 3. Rating Tinggi (>= 4.5)
- **Kondisi**: `rating>=4.5`
- **Format**: Teks emas tebal, background kuning emas

#### 4. Rating Rendah (< 3.0)
- **Kondisi**: `rating<3`
- **Format**: Teks merah tebal, background merah muda

#### 5. Materi Populer (View > 100)
- **Kondisi**: `view_count>100`
- **Format**: Background hijau muda, border hijau tebal

#### 6. Materi Butuh Update (> 6 bulan)
- **Kondisi**: `DATEDIF(last_updated, TODAY(), "M")>6`
- **Format**: Background kuning, border oranye

#### 7. Rating Bintang
- **Kondisi**: `rating>=4`
- **Format**: Teks emas

### 🔽 Dropdown Menu Options

#### category
```
Leadership
Manajemen Organisasi
Public Speaking
Event Management
Technical Skills
Soft Skills
Financial Management
Project Management
Communication
Team Building
Problem Solving
Decision Making
Lainnya
```

#### type
```
Artikel
Video
E-Book
Slide Presentasi
Infografis
Podcast
Modul Pelatihan
Template
Checklist
Lainnya
```

#### difficulty_level
```
Pemula
Menengah
Lanjutan
Expert
```

#### language
```
Bahasa Indonesia
English
Bahasa Indonesia & English
```

#### status
```
Draft
Published
Archived
Private
```

---

## 6. PROJECTS TEMPLATE

### 📊 Struktur Kolom

| No | Kolom | Tipe Data | Wajib | Deskripsi |
|----|-------|-----------|-------|-----------|
| 1 | `project_id` | Text | Ya | ID unik proyek (format: PRJ-YYYY-XXXX) |
| 2 | `project_name` | Text | Ya | Nama proyek |
| 3 | `project_type` | Dropdown | Ya | Jenis proyek |
| 4 | `category` | Dropdown | Ya | Kategori proyek |
| 5 | `description` | Text | Ya | Deskripsi proyek |
| 6 | `start_date` | Date | Ya | Tanggal mulai |
| 7 | `end_date` | Date | Ya | Tanggal selesai (target) |
| 8 | `actual_end_date` | Date | Tidak | Tanggal selesai aktual |
| 9 | `status` | Dropdown | Ya | Status proyek |
| 10 | `priority` | Dropdown | Ya | Prioritas |
| 11 | `budget` | Currency | Ya | Anggaran |
| 12 | `actual_cost` | Currency | Tidak | Biaya aktual |
| 13 | `progress` | Percentage | Ya | Progress (%) |
| 14 | `project_manager` | Text | Ya | Project manager |
| 15 | `team_members` | Text | Tidak | Anggota tim (pisahkan dengan koma) |
| 16 | `milestones` | Text | Tidak | Milestone proyek |
| 17 | `risks` | Text | Tidak | Risiko yang diidentifikasi |
| 18 | `deliverables` | Text | Tidak | Deliverables/output |
| 19 | `notes` | Text | Tidak | Catatan tambahan |
| 20 | `created_at` | Date | Ya | Tanggal pembuatan data |
| 21 | `updated_at` | Date | Ya | Tanggal terakhir update |

### ✅ Data Validation Rules

#### Kolom `project_id`
- **Format**: `PRJ-YYYY-XXXX` (contoh: PRJ-2024-0001)
- **Unik**: Tidak boleh ada duplikat
- **Panjang**: Maksimal 20 karakter

#### Kolom `project_name`
- **Panjang**: 5-200 karakter
- **Tidak boleh kosong**

#### Kolom `project_type` (Dropdown)
```
- Internal
- Eksternal
- Kolaborasi
- Riset
- Pengembangan
- Lainnya
```

#### Kolom `category` (Dropdown)
```
- Event
- Program
- Kampanye
- Infrastruktur
- Sistem
- Publikasi
- Pelatihan
- Lainnya
```

#### Kolom `description`
- **Panjang**: 10-1000 karakter
- **Tidak boleh kosong**

#### Kolom `start_date` dan `end_date`
- **Format**: DD/MM/YYYY
- **Validasi**: `end_date` harus >= `start_date`

#### Kolom `status` (Dropdown)
```
- Perencanaan
- Sedang Berjalan
- Review
- Selesai
- Ditunda
- Dibatalkan
```

#### Kolom `priority` (Dropdown)
```
- Rendah
- Sedang
- Tinggi
- Kritis
```

#### Kolom `budget` dan `actual_cost`
- **Format**: Angka dengan 2 desimal
- **Minimum**: 0
- **Tidak boleh negatif**

#### Kolom `progress`
- **Tipe**: Persentase
- **Range**: 0-100
- **Format**: 0% - 100%

### 📝 Contoh Data

| project_id | project_name | project_type | category | description | start_date | end_date | actual_end_date | status | priority | budget | actual_cost | progress | project_manager | team_members | milestones | risks | deliverables | created_at | updated_at |
|------------|--------------|--------------|----------|-------------|------------|----------|-----------------|--------|----------|--------|-------------|----------|-----------------|--------------|------------|-------|-------------|------------|------------|
| PRJ-2024-0001 | Website PPSDM KMMITS | Internal | Sistem | Pengembangan website resmi PPSDM KMMITS | 01/01/2024 | 31/03/2024 | - | Sedang Berjalan | Tinggi | 15.000.000 | 8.500.000 | 57% | Ahmad Rizki | Budi Santoso, Siti Aminah | Desain UI/UX, Frontend, Backend, Testing | Delay dari developer, Bug pada integrasi API | Website live, Dokumentasi teknis | 01/01/2024 | 20/01/2024 |
| PRJ-2024-0002 | Pelatihan Kepemimpinan Batch 5 | Internal | Pelatihan | Program pelatihan kepemimpinan untuk anggota baru | 15/01/2024 | 15/02/2024 | - | Sedang Berjalan | Tinggi | 10.000.000 | 3.000.000 | 30% | Budi Santoso | Siti Aminah, Ahmad Rizki | Kurikulum, Materi, Pelaksanaan, Evaluasi | Peserta kurang, Fasilitas tidak memadai | 25 alumni terlatih, Modul pelatihan | 10/01/2024 | 20/01/2024 |
| PRJ-2024-0003 | Kampanye Rekrutmen 2024 | Eksternal | Kampanye | Kampanye rekrutmen anggota baru tahun 2024 | 01/02/2024 | 28/02/2024 | - | Perencanaan | Sedang | 5.000.000 | - | 0% | Siti Aminah | Budi Santoso, Ahmad Rizki | Desain poster, Sosial media, Open recruitment, Interview | Target tidak tercapai, Kompetisi dengan ormawa lain | 50 anggota baru, Database anggota | 15/01/2024 | 20/01/2024 |
| PRJ-2024-0004 | Sistem Manajemen Keuangan | Internal | Sistem | Pengembangan sistem manajemen keuangan otomatis | 01/03/2024 | 30/06/2024 | - | Perencanaan | Kritis | 25.000.000 | - | 0% | Ahmad Rizki | Budi Santoso, Siti Aminah | Analisis kebutuhan, Desain database, Development, Testing, Deployment | Kompleksitas sistem tinggi, Keterbatasan resource | Sistem live, User manual, Training | 20/01/2024 | 20/01/2024 |

### 🧮 Formula yang Digunakan

#### 1. Durasi Proyek (Hari)
```
=DATEDIF(start_date, end_date, "D") + 1
```
**Penjelasan**: Menghitung durasi proyek dalam hari

#### 2. Sisa Waktu (Hari)
```
=IF(status<>"Selesai", DATEDIF(TODAY(), end_date, "D"), 0)
```
**Penjelasan**: Menghitung sisa waktu hingga deadline

#### 3. Persentase Penggunaan Budget
```
=IF(budget>0, (actual_cost/budget)*100, 0)
```
**Penjelasan**: Persentase penggunaan anggaran

#### 4. Selisih Budget
```
=budget - actual_cost
```
**Penjelasan**: Selisih antara anggaran dan biaya aktual

#### 5. Status Otomatis Berdasarkan Progress
```
=IF(progress=0, "Perencanaan",
   IF(progress<100, "Sedang Berjalan",
      IF(progress=100, "Selesai", "Review")))
```
**Penjelasan**: Menentukan status berdasarkan progress

#### 6. Keterlambatan (Hari)
```
=IF(AND(actual_end_date<>"", actual_end_date>end_date), 
   DATEDIF(end_date, actual_end_date, "D"), 0)
```
**Penjelasan**: Menghitung keterlambatan jika ada

#### 7. Jumlah Anggota Tim
```
=IF(team_members="", 0, LEN(team_members)-LEN(SUBSTITUTE(team_members, ",", ""))+1)
```
**Penjelasan**: Menghitung jumlah anggota tim

#### 8. Progress per Hari
```
=IF(DATEDIF(start_date, TODAY(), "D")>0, progress/DATEDIF(start_date, TODAY(), "D"), 0)
```
**Penjelasan**: Rata-rata progress per hari

### 🎨 Conditional Formatting Rules

#### 1. Status Berdasarkan Warna
- **Perencanaan**: Background abu-abu (`#E2E8F0`)
- **Sedang Berjalan**: Background biru muda (`#BEE3F8`)
- **Review**: Background kuning (`#FEFCBF`)
- **Selesai**: Background hijau muda (`#C6F6D5`)
- **Ditunda**: Background oranye (`#FED7D7`)
- **Dibatalkan**: Background merah muda (`#FED7D7`)

#### 2. Prioritas Berdasarkan Warna
- **Rendah**: Background hijau (`#48BB78`), teks putih
- **Sedang**: Background kuning (`#ECC94B`), teks hitam
- **Tinggi**: Background oranye (`#ED8936`), teks putih
- **Kritis**: Background merah (`#F56565`), teks putih

#### 3. Progress Bar Visual
- **0-25%**: Background merah muda
- **26-50%**: Background kuning
- **51-75%**: Background biru muda
- **76-100%**: Background hijau muda

#### 4. Deadline Mendekat (7 hari)
- **Kondisi**: `AND(status<>"Selesai", end_date-TODAY()<=7, end_date>=TODAY())`
- **Format**: Teks merah tebal, background merah muda

#### 5. Over Budget
- **Kondisi**: `actual_cost>budget`
- **Format**: Teks merah tebal, background merah muda

#### 6. Terlambat
- **Kondisi**: `AND(actual_end_date<>"", actual_end_date>end_date)`
- **Format**: Teks merah tebal, background merah muda

#### 7. Proyek Selesai Tepat Waktu
- **Kondisi**: `AND(status="Selesai", actual_end_date<=end_date)`
- **Format**: Teks hijau tebal, background hijau muda

#### 8. Progress Stagnan (> 7 hari tanpa update)
- **Kondisi**: `AND(status="Sedang Berjalan", TODAY()-updated_at>7)`
- **Format**: Background kuning, border oranye

### 🔽 Dropdown Menu Options

#### project_type
```
Internal
Eksternal
Kolaborasi
Riset
Pengembangan
Lainnya
```

#### category
```
Event
Program
Kampanye
Infrastruktur
Sistem
Publikasi
Pelatihan
Lainnya
```

#### status
```
Perencanaan
Sedang Berjalan
Review
Selesai
Ditunda
Dibatalkan
```

#### priority
```
Rendah
Sedang
Tinggi
Kritis
```

---

## 📖 PANDUAN UMUM

### Cara Menggunakan Spreadsheet Templates

#### 1. Membuat File Baru
1. Buka Google Sheets atau Microsoft Excel
2. Buat file baru untuk setiap master data
3. Beri nama file sesuai dengan template:
   - `Activities_Template.xlsx`
   - `Members_Template.xlsx`
   - `Finances_Template.xlsx`
   - `Assessments_Template.xlsx`
   - `Knowledge_Template.xlsx`
   - `Projects_Template.xlsx`

#### 2. Menambahkan Header
1. Baris pertama: Tambahkan semua nama kolom sesuai struktur
2. Baris kedua: Tambahkan tipe data dan keterangan
3. Baris ketiga: Tambahkan contoh data

#### 3. Mengatur Data Validation (Google Sheets)
1. Pilih sel/kolom yang ingin diatur
2. Klik **Data** → **Data validation**
3. Pilih tipe validasi:
   - **List of items**: Untuk dropdown
   - **Number**: Untuk angka
   - **Text**: Untuk teks
   - **Date**: Untuk tanggal
4. Masukkan nilai yang diizinkan
5. Klik **Done**

#### 4. Mengatur Data Validation (Microsoft Excel)
1. Pilih sel/kolom yang ingin diatur
2. Klik **Data** → **Data Validation**
3. Pilih tab **Settings**
4. Pilih tipe validasi dari dropdown **Allow**
5. Masukkan nilai yang diizinkan
6. Klik **OK**

#### 5. Menambahkan Formula
1. Klik sel tempat formula akan ditempatkan
2. Ketik `=` diikuti dengan formula
3. Tekan **Enter**
4. Drag ke bawah untuk menerapkan ke sel lain

#### 6. Mengatur Conditional Formatting (Google Sheets)
1. Pilih sel/kolom yang ingin diformat
2. Klik **Format** → **Conditional formatting**
3. Pilih tipe kondisi:
   - **Is equal to**: Untuk nilai spesifik
   - **Greater than**: Untuk nilai lebih besar dari
   - **Less than**: Untuk nilai lebih kecil dari
   - **Custom formula is**: Untuk formula kustom
4. Atur format (warna, tebal, miring, dll)
5. Klik **Done**

#### 7. Mengatur Conditional Formatting (Microsoft Excel)
1. Pilih sel/kolom yang ingin diformat
2. Klik **Home** → **Conditional Formatting**
3. Pilih tipe kondisi:
   - **Highlight Cells Rules**: Untuk nilai spesifik
   - **Top/Bottom Rules**: Untuk nilai tertinggi/terendah
   - **New Rule**: Untuk aturan kustom
4. Atur format
5. Klik **OK**

### Tips dan Best Practices

#### ✅ DO (Yang Harus Dilakukan)
1. **Selalu gunakan format yang konsisten** untuk tanggal (DD/MM/YYYY)
2. **Validasi data sebelum input** untuk menghindari error
3. **Gunakan dropdown** untuk kolom dengan pilihan terbatas
4. **Backup data secara berkala** untuk mencegah kehilangan data
5. **Gunakan formula otomatis** untuk mengurangi kesalahan manual
6. **Dokumentasikan perubahan** di kolom `notes` atau `updated_at`
7. **Gunakan conditional formatting** untuk visualisasi data yang lebih baik
8. **Lock header row** agar tetap terlihat saat scroll

#### ❌ DON'T (Yang Tidak Boleh Dilakukan)
1. **Jangan mengubah format ID** yang sudah ditentukan
2. **Jangan menghapus kolom** yang wajib diisi
3. **Jangan menggunakan spasi berlebihan** di awal/akhir teks
4. **Jangan menggabungkan data** dalam satu sel (kecuali tags)
5. **Jangan menggunakan formula manual** jika ada formula otomatis
6. **Jangan mengubah struktur kolom** tanpa persetujuan
7. **Jangan menginput data duplikat** untuk ID yang unik
8. **Jangan mengabaikan warning** dari data validation

### Troubleshooting

#### Masalah: Dropdown tidak muncul
**Solusi**:
- Pastikan data validation sudah diatur dengan benar
- Cek apakah cell sudah dipilih dengan benar
- Pastikan opsi "Show dropdown list in cell" aktif

#### Masalah: Formula menghasilkan error
**Solusi**:
- Cek apakah referensi cell sudah benar
- Pastikan tipe data sesuai (angka, teks, tanggal)
- Gunakan `IFERROR` untuk menangani error

#### Masalah: Conditional formatting tidak bekerja
**Solusi**:
- Pastikan kondisi sudah benar
- Cek apakah cell yang diformat sesuai dengan kondisi
- Hapus dan buat ulang conditional formatting

#### Masalah: Data tidak tersimpan
**Solusi**:
- Pastikan koneksi internet stabil (untuk Google Sheets)
- Cek kuota penyimpanan
- Simpan file secara manual

### Hubungi Support

Jika mengalami masalah yang tidak dapat diselesaikan:
- **Email**: support@ppsdm-kmmits.its.ac.id
- **WhatsApp**: +62 812-3456-7890
- **Slack**: #support-ppsdm

---

## 📚 Referensi Tambahan

### Dokumentasi Terkait
- [User Guide PPSDM KMMITS](./USER_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Security Guidelines](./SECURITY_GUIDELINES.md)

### Video Tutorial
- [Cara Menggunakan Spreadsheet Templates](https://youtube.com/...)
- [Data Validation di Google Sheets](https://youtube.com/...)
- [Conditional Formatting di Excel](https://youtube.com/...)

### Template Download
- [Activities Template (.xlsx)](../templates/Activities_Template.xlsx)
- [Members Template (.xlsx)](../templates/Members_Template.xlsx)
- [Finances Template (.xlsx)](../templates/Finances_Template.xlsx)
- [Assessments Template (.xlsx)](../templates/Assessments_Template.xlsx)
- [Knowledge Template (.xlsx)](../templates/Knowledge_Template.xlsx)
- [Projects Template (.xlsx)](../templates/Projects_Template.xlsx)

---

## 📝 Changelog

### Versi 1.0 (10 Februari 2026)
- Initial release
- Dokumentasi lengkap untuk 6 master data
- Struktur kolom, data validation, formula, dan conditional formatting
- Contoh data untuk setiap template
- Panduan penggunaan untuk pengguna non-technical

---

**© 2026 PPSDM KMMITS - Institut Teknologi Sepuluh Nopember**
