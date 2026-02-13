# PPSDM KMITS — Panduan Pengguna (Non-Teknis)

## Apa itu Spreadsheet PPSDM?

Spreadsheet ini adalah **sumber data utama** untuk website PPSDM KMITS. Semua yang Anda ubah di spreadsheet akan otomatis muncul di website tanpa perlu coding.

---

## Cara Memulai

### 1. Buka Spreadsheet
Buka spreadsheet PPSDM KMITS melalui link yang diberikan admin.

### 2. Pasang Apps Script (Pertama Kali)
1. Klik menu **Extensions → Apps Script**
2. Hapus semua kode yang ada
3. Salin seluruh isi file `spreadsheet-template.gs` dari repository
4. Ganti `WEBHOOK_SECRET` di baris 32 dengan secret yang diberikan admin
5. Klik **Save** (ikon disket)
6. Klik **Deploy → New Deployment → Web App**
7. Pilih "Execute as: Me", "Who has access: Anyone"
8. Klik **Deploy**

### 3. Tambah Trigger Otomatis
1. Di Apps Script, klik ikon jam (Triggers) di sidebar kiri
2. Klik **+ Add Trigger**
3. Pilih: `onEditTrigger` | `From spreadsheet` | `On edit`
4. Klik **Save**

---

## Sheet yang Tersedia

| Sheet | Kegunaan | Ditampilkan di |
|-------|----------|---------------|
| Assessment | Pertanyaan asesmen 9 dimensi | Halaman Asesmen |
| Activities | Kegiatan himpunan | Halaman Kegiatan |
| Members | Data anggota | Dashboard anggota |
| Finances | Transaksi keuangan | Halaman Transparansi |
| Knowledge | Sumber belajar | Perpustakaan |
| Settings | Pengaturan website | Seluruh website |
| TIM_HIMPUNAN | Profil pengurus | Halaman Tentang Kami |
| PETUNJUK | Panduan (sheet ini) | - |

---

## Aturan Penting

1. **Jangan** ubah nama sheet
2. **Jangan** ubah atau hapus baris header (baris pertama)
3. **Jangan** tambah kolom baru tanpa koordinasi dengan developer
4. Format tanggal: `YYYY-MM-DD` (contoh: `2026-03-15`)
5. Untuk beberapa nilai dalam satu kolom, pisahkan dengan tanda pipa `|`
6. Pastikan ID bersifat **unik** dalam setiap sheet
7. Link foto/dokumen harus berupa URL lengkap Google Drive

---

## Sinkronisasi ke Website

- **Otomatis**: Setiap kali Anda mengedit, data dikirim ke website (cache 5 menit)
- **Manual**: Gunakan menu **🎓 PPSDM KMITS → 🔄 Sinkronkan ke Website**

---

## FAQ

**Q: Berapa lama perubahan muncul di website?**  
A: Maksimal 5 menit setelah edit terakhir.

**Q: Bagaimana jika saya tidak sengaja menghapus data?**  
A: Google Sheets menyimpan riwayat versi. Klik File → Version history → See version history.

**Q: Siapa yang bisa mengedit spreadsheet?**  
A: Hanya orang yang diberi akses "Editor" oleh admin.

---

## Kontak Bantuan
- Tim Developer: ppsdm-dev@km.its.ac.id
- Dokumentasi: https://ppsdm-kmits.vercel.app/help
