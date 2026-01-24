# RENCANA PENGEMBANGAN: GLOBAL RESOURCE ENGINE (GRE)
**Status**: Draft Awal - Fase 1 (Foundation)
**Target**: Integrasi dengan Ekosistem PPSDM KMITS

---

## 1. Ringkasan Eksekutif
Rencana ini menerjemahkan spesifikasi arsitektur "Global Resource Engine" menjadi langkah-langkah pengembangan taktis. Fokus utama Fase 1 adalah membangun infrastruktur data (Knowledge Graph & Vector Database) dan mekanisme pengumpulan sumber daya dasar (Universal Resource Crawler Network - URCN).

## 2. Peta Jalan Implementasi (Implementation Roadmap)

### **Fase 1: Foundation (Bulan 1-6)**
Fokus: Infrastruktur Inti & Data Ingestion.

#### **Minggu 1-4: Infrastruktur & Database**
- [ ] **Desain Schema Database (Supabase)**:
  - Tabel `gre_resources`: Menyimpan metadata utama (judul, URL, tipe).
  - Tabel `gre_quality_scores`: Menyimpan skor 12 dimensi.
  - Tabel `gre_vectors`: Menyimpan embedding untuk pencarian semantik (Quantum-simulated Search).
- [ ] **Setup Vector Search**: Mengaktifkan `pgvector` untuk memungkinkan pencarian berbasis konteks/semantik.
- [ ] **Modul Core**: Membuat struktur folder `src/lib/gre` di project Next.js.

#### **Minggu 5-12: Component 1 - URCN (Resource Crawler)**
- [ ] **API Integrator**: Membangun script untuk menarik data dari API publik (Google Scholar, OpenAlex, YouTube Edu).
- [ ] **Deduplication Engine**: Algoritma untuk menggabungkan duplikat resource dari berbagai sumber.
- [ ] **Basic Scheduler**: Menggunakan GitHub Actions atau Cron Jobs untuk update berkala.

#### **Minggu 13-20: Component 2 - Quality Assessment (12D-QAM Lite)**
- [ ] **Implementasi 5 Dimensi Prioritas**:
  - *Pedagogical*: Analisis struktur konten (apakah ada silabus/daftar isi?).
  - *Scientific*: Validasi sitasi/referensi (untuk jurnal).
  - *Recency*: Validasi tanggal publikasi.
  - *Technical*: Validasi aksesibilitas link (tidak broken).
  - *Production*: Cek resolusi/kualitas media (via metadata).

#### **Minggu 21-24: User Interface (Portal GRE)**
- [ ] **Search Dashboard**: UI pencarian dengan filter canggih.
- [ ] **Resource Detail Page**: Menampilkan skor kualitas dan rekomendasi terkait.

---

## 3. Arsitektur Teknis (Mapping ke Stack PPSDM)

| Komponen GRE | Teknologi di PPSDM KMITS |
| :--- | :--- |
| **Backend / Graph** | **Supabase (PostgreSQL)**: Relational data + Graph logic via Foreign Keys. |
| **Quantum Engine / Search** | **pgvector**: Menangani "Resource Superposition" (Top-K search) dan "Wave Function Collapse" (Re-ranking via Context). |
| **Crawlers (URCN)** | **Node.js Scripts / Edge Functions**: Menjalankan harvesting data secara terjadwal. |
| **Frontend** | **Next.js (App Router)**: Server Components untuk delivery cepat. |
| **AI Processing** | **OpenAI API / HuggingFace**: Untuk generating summary dan quality scoring otomatis. |

---

## 4. Langkah Selanjutnya (Immediate Action Items)

1.  **Review Schema**: Validasi struktur tabel database yang diusulkan di `implementation_plan.md`.
2.  **API Keys**: Mendaftar akses API untuk sumber data akademik (misal: OpenAlex - Gratis/Open Source).
3.  **Prototyping**: Membuat satu script crawler sederhana untuk membuktikan konsep (Proof of Concept).

---

> Dokumen ini dibuat berdasarkan "ARCHITECTURE SPECIFICATION: GLOBAL RESOURCE ENGINE" dan disesuaikan dengan lingkungan teknis yang ada saat ini.
