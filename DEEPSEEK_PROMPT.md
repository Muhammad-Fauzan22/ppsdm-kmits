# **MEGA PROMPT: SUPABASE ARCHITECT - PPSDM KMM**

**TUJUAN**: Bertindaklah sebagai **Principal Database Architect** yang ahli dalam PostgreSQL dan Supabase. Tugas Anda adalah menulis **Satu Skrip SQL Lengkap (Single Execution Script)** yang valid dan siap dijalankan di Supabase SQL Editor untuk membangun backend platform **PPSDM KMM**.

---

## **1. KONTEKS SISTEM**
Platform **PPSDM KMM** adalah ekosistem pengembangan mahasiswa holistik berbasis 9 dimensi. Sistem ini membutuhkan database yang sangat relasional, aman (RLS), dan mendukung fitur AI modern.

**Tech Stack**:
- **Database**: PostgreSQL 15+ (Supabase Managed).
- **AI Integration**: Membutuhkan `pgvector` untuk Sementic Search dan RAG.
- **Automation**: Membutuhkan `pg_cron` untuk tugas terjadwal (jika didukung) atau logic trigger yang kuat.
- **Security**: Row Level Security (RLS) WAJIB di setiap tabel.

---

## **2. INSTRUKSI GENERASI SQL**
Hasilkan kode SQL dengan urutan eksekusi berikut:
1.  **Clean Up**: `DROP SCHEMA public CASCADE; CREATE SCHEMA public;` (Opsional/Commented out untuk keamanan).
2.  **Extensions**: Enable semua ekstensi yang diperlukan.
3.  **ENUMs**: Definisikan tipe data ENUM untuk menjaga konsistensi data.
4.  **Tables**: Buat tabel dengan constraint lengkap (PK, FK, CHECK, DEFAULT).
5.  **Indexes**: Optimasi performa query.
6.  **RLS Policies**: Keamanan tingkat baris.
7.  **Functions & Triggers**: Otomatisasi (updated_at, soft delete, gamification logic).
8.  **Seed Data**: Data awal esensial.

---

## **3. SPESIFIKASI SKEMA DATABASE**

### **A. EXTENSIONS**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";      -- Case insensitive text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- For text search
CREATE EXTENSION IF NOT EXISTS "vector";      -- CRITICAL: For AI Embeddings
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- Encryption
```

### **B. ENUM TYPES (Wajib didefinisikan)**
Definisikan ENUM berikut:
- `user_role`: 'student', 'lecturer', 'admin', 'superadmin'
- `dimension_category`: 'leadership', 'ethics', 'technology', 'global_mindset', 'critical_thinking', 'creativity', 'collaboration', 'communication', 'adaptability'
- `assessment_type`: 'sjt', 'likert', 'quiz', 'simulation'
- `resource_type`: 'video', 'article', 'book', 'course', 'podcast'
- `opportunity_type`: 'scholarship', 'internship', 'competition', 'conference'
- `rpi_status`: 'draft', 'submitted', 'approved', 'rejected', 'in_progress', 'completed'

### **C. STRUKTUR TABEL & SYARAT KHUSUS**

#### **1. Core Identity & Profiles**
*   `profiles`:
    *   PK: `id` (UUID).
    *   FK: `user_id` references `auth.users(id)` ON DELETE CASCADE.
    *   Columns: `role` (user_role), `full_name`, `avatar_url`, `gamification_level` (default 1), `xp_total` (default 0), `department`, `year_batch`.
    *   Constraint: `user_id` harus unik.

#### **2. 9 Dimensions Ecosystem**
*   `dimensions`: 9 baris statis untuk dimensi pengembangan.
*   `competencies`: Sub-skill pohon kompetensi.
*   `user_dimension_progress`:
    *   Tracking score per dimensi per user.
    *   Columns: `current_score` (0-100), `level` (Beginner/Intermediate/Advanced/Expert).

#### **3. Smart Assessment Engine**
*   `assessments`: Header master asesmen.
*   `assessment_questions`:
    *   Support JSONB untuk `options` (biar fleksibel).
*   `assessment_sessions`:
    *   Tracking durasi pengerjaan (`started_at`, `finished_at`).
*   `assessment_results`:
    *   **AI Integration**: Kolom `ai_analysis` (TEXT/JSONB) untuk menyimpan hasil generate LLM.
    *   Kolom `spider_web_data` (JSONB) untuk cache visualisasi grafik radar.

#### **4. Learning Library (AI-Powered)**
*   `learning_resources`:
    *   **Vector Embeddings**: Kolom `embedding` (vector(1536)) untuk semantic search.
    *   Kolom `ai_summary` (TEXT).
*   `user_bookmarks`: Many-to-many user ke resource.
*   `collections`: User bisa buat playlist belajar sendiri.

#### **5. RPI (Rencana Pengembangan Individu)**
*   `rpi_plans`: Header plan per semester.
*   `rpi_items`: Detail aktivitas.
    *   Status flow: Draft -> Submitted -> Approved (oleh Dosen Wali).
    *   RLS: Dosen Wali hanya bisa approve mahasiswa bimbingannya.

#### **6. Personal Operating System (POS)**
*   `pos_tasks`: Eisenhower Matrix logic (Urgent/Important boolean flags).
*   `pos_habits`: Streak tracking (`current_streak`, `longest_streak`, `last_checked_in_at`).
*   `pos_focus_logs`: Log Pomodoro session.

#### **7. Gamification & Portfolio**
*   `achievements`: Daftar badge/piala.
*   `user_achievements`: Pivot table user yang unlock achievement.
*   `portfolio_items`: Showcase project mahasiswa.
*   `skill_endorsements`: Mirip LinkedIn, user lain bisa endorse skill.

#### **8. Community & Mentorship**
*   `mentorship_matches`: Pasangan Mentor-Mentee.
*   `mentorship_sessions`: Jadwal temu/bimbingan.
*   `community_posts` & `post_comments`: Forum diskusi sederhana.

---

## **4. SYARAT KEAMANAN (RLS POLICIES)**
Jangan hanya `ENABLE RLS`, tapi tuliskan POLICY konkret:
1.  **Public Read**: Data `dimensions`, `competencies`, `learning_resources` (jika public).
2.  **Self Access**: User bisa CRUD data `profiles`, `pos_tasks` mereka sendiri.
3.  **Supervisor Access**: Dosen Wali bisa SELECT data `profiles` dan `assessment_results` milik mahasiswa yang `supervisor_id`-nya adalah ID dosen tersebut.
4.  **Admin Access**: Admin bypass semua restriction (gunakan fungsi `is_admin()`).

---

## **5. AI & ADVANCED FUNCTIONS**
Buatkan function database berikut:
1.  `match_learning_resources`: Function untuk mencari kemiripan vector (cosine similarity) di tabel `learning_resources`.
2.  `update_updated_at`: Trigger standard.
3.  `handle_new_user`: Trigger otomatis insert ke `public.profiles` saat ada user baru signup di `auth.users`.
4.  `calculate_level`: Function otomatis update level jika XP user bertambah.

---

## **6. DATA SEEDING (Sangat Penting)**
Berikan perintah `INSERT` untuk:
1.  9 Data Dimensi Utama (Leadership, Ethics, Technology, dll).
2.  Beberapa data `competencies` contoh.
3.  Setidaknya 3 user dummy (1 Admin, 1 Dosen, 1 Mahasiswa).

---

**OUTPUT FORMAT**:
Berikan saya **HANYA KODE SQL** di dalam blok kode markdown. Berikan komentar singkat di bagian yang kompleks. Pastikan urutan tabel benar (lookup table duluan sebelum tabel yang mereferensikannya).
