# 🚀 PPSDM KMITS - Manual Database Setup Instructions

## ⚠️ Penting: Eksekusi Manual Diperlukan

Karena fungsi `exec_sql` belum tersedia di database, Anda perlu mengeksekusi schema secara manual melalui Supabase Dashboard.

---

## 📋 Langkah-Langkah Eksekusi

### Step 1: Buka Supabase Dashboard

```
🔗 URL: https://supabase.com/dashboard/project/xncugiuvaetzjxuyfsko
```

### Step 2: Navigasi ke SQL Editor

1. Login ke Supabase Dashboard
2. Klik **"SQL Editor"** di sidebar kiri
3. Klik **"New Query"** (tombol +)

### Step 3: Eksekusi File SQL Berurutan

#### File 1: Create exec_sql Function
**File**: `supabase/create_exec_sql_function.sql`

```sql
-- Copy seluruh isi file ini ke SQL Editor
-- Lalu klik "Run"
```

#### File 2: Main Schema
**File**: `supabase/complete_integrated_schema.sql`

```sql
-- Copy seluruh isi file ini ke SQL Editor
-- Lalu klik "Run"
```

#### File 3: RLS Policies
**File**: `supabase/rls_policies.sql`

```sql
-- Copy seluruh isi file ini ke SQL Editor
-- Lalu klik "Run"
```

---

## ✅ Verifikasi Setup

Setelah eksekusi, jalankan query berikut untuk memverifikasi:

```sql
-- 1. Check jumlah tabel
SELECT COUNT(*) as total_tables 
FROM pg_tables 
WHERE schemaname = 'public';

-- 2. Check dimensions (harus ada 9)
SELECT slug, name, order_index 
FROM dimensions 
ORDER BY order_index;

-- 3. Check badges (harus ada 7)
SELECT slug, name, xp_reward 
FROM badges 
ORDER BY xp_reward;

-- 4. Check extensions
SELECT extname, extversion 
FROM pg_extension;

-- 5. Check RLS enabled
SELECT COUNT(*) as rls_enabled_tables
FROM pg_tables 
WHERE schemaname = 'public' AND rowsecurity = true;
```

---

## 🎯 Hasil yang Diharapkan

### Jumlah Tabel: 40+
### Dimensions: 9 records
```
1. spiritual - Kecerdasan Spiritual
2. emotional - Kecerdasan Emosional
3. intellectual - Kecerdasan Intelektual
4. physical - Kesehatan Fisik
5. social - Kecerdasan Sosial
6. financial - Kecerdasan Finansial
7. occupational - Kecerdasan Okupasional
8. environmental - Kecerdasan Lingkungan
9. character - Karakter
```

### Badges: 7 records
```
1. knowledge-seeker - 25 XP
2. early-bird - 50 XP
3. community-helper - 75 XP
4. streak-master - 100 XP
5. goal-crusher - 100 XP
6. assessment-ace - 150 XP
7. course-champion - 200 XP
```

---

## 🔧 Troubleshooting

### Error: "Function exec_sql not found"
**Solusi**: Eksekusi file `create_exec_sql_function.sql` terlebih dahulu

### Error: "Permission denied"
**Solusi**: Pastikan Anda menggunakan service_role key atau login sebagai admin

### Error: "Extension not found"
**Solusi**: Enable extensions di Dashboard:
1. Database → Extensions
2. Enable: `uuid-ossp`, `pgcrypto`, `vector`

### Error: "Table already exists"
**Solusi**: Schema sudah pernah dieksekusi. Untuk reset:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Lalu eksekusi ulang schema
```

---

## 📁 Daftar File SQL

| File | Lokasi | Tujuan |
|------|--------|--------|
| `create_exec_sql_function.sql` | `supabase/` | Membuat fungsi exec_sql |
| `complete_integrated_schema.sql` | `supabase/` | Schema lengkap 40+ tabel |
| `rls_policies.sql` | `supabase/` | RLS policies & seed data |

---

## 🎉 Setelah Setup Berhasil

Database Anda akan memiliki:
- ✅ 40+ tabel lengkap
- ✅ 9 dimensions framework
- ✅ 7 badges gamification
- ✅ RLS policies aktif
- ✅ Triggers & functions
- ✅ Storage buckets
- ✅ Seed data (fakultas, departemen, content sources)

---

## 📞 Butuh Bantuan?

Lihat dokumentasi lengkap di:
- `DATABASE_RESET_AND_SETUP_GUIDE.md`
- `SCHEMA_EXECUTION_SUMMARY.md`

---

**PPSDM KMITS Team** | 2025
