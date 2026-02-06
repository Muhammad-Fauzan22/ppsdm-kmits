# Laporan Audit Keamanan PPSDM KMITS

## Ringkasan Umum
Laporan audit keamanan komprehensif untuk aplikasi PPSDM KMITS. Audit ini meliputi analisis codebase, arsitektur, autentikasi, otorisasi, konfigurasi server, dan implementasi keamanan aplikasi.

## Tanggal Audit
2026-02-05

## Scope Audit
1. Analisis keamanan codebase dan arsitektur aplikasi
2. Identifikasi vulnerabilities OWASP Top 10
3. Audit autentikasi dan otorisasi (JWT, session management)
4. Check konfigurasi SSL/TLS dan keamanan komunikasi
5. Evaluasi keamanan database dan query handling
6. Analisis keamanan API dan CORS configuration
7. Evaluasi implementasi keamanan sisi klien dan server

## Hasil Audit

### 1. Arsitektur Keamanan Umum

#### 1.1 Strukutur Codebase
- **Framework**: Next.js 14+ dengan TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth dengan email/password dan Google OAuth
- **Hosting**: Vercel/Cloudflare Pages
- **Monitoring**: Sentry untuk error tracking dan performance monitoring

#### 1.2 Kelebihan Arsitektur
- Penggunaan TypeScript untuk type safety
- Arsitektur Next.js yang secure (App Router, Server Components)
- Implementasi middleware Edge untuk security headers
- Konfigurasi CSP (Content Security Policy) di `next.config.mjs`
- Rate limiting untuk endpoint autentikasi

### 2. Vulnerabilities OWASP Top 10

#### 2.1 A1: Broken Access Control (Kontrol Akses Rusak)

**Issue 1: Admin API tanpa autentikasi otorisasi**
- Lokasi: `src/app/api/admin/process-ebook/route.ts`
- Severity: **High**
- Deskripsi: Endpoint admin tidak memverifikasi apakah user memiliki role admin sebelum memproses permintaan
- Rekomendasi: Tambahkan middleware otorisasi untuk memeriksa role admin

**Issue 2: Assessment API tanpa autentikasi**
- Lokasi: `src/app/api/assessment/route.ts`
- Severity: **Medium**
- Deskripsi: Endpoint assessment menerima userId dari request body tanpa memverifikasi apakah user terautentikasi
- Rekomendasi: Gunakan session user dari autentikasi Supabase daripada menerima userId dari body

#### 2.2 A2: Cryptographic Failures (Gagal Kriptografi)

**Issue 3: Missing HTTP Strict Transport Security (HSTS) preload**
- Lokasi: `src/middleware.ts` dan `next.config.mjs`
- Severity: **Low**
- Deskripsi: HSTS header tidak memiliki flag `preload` yang direkomendasikan
- Rekomendasi: Tambahkan `preload` flag ke HSTS header

#### 2.3 A3: Injection (Injeksi)

**Issue 4: Sanitization HTML yang tidak memadai**
- Lokasi: `src/lib/utils/sanitization.ts`
- Severity: **Medium**
- Deskripsi: Implementasi sanitizeHtml custom tidak sekuat DOMPurify, dapat di bypass oleh serangan XSS
- Rekomendasi: Gunakan DOMPurify library yang teruji untuk sanitasi HTML

**Issue 5: Sanitization SQL yang tidak memadai**
- Lokasi: `src/lib/utils/sanitization.ts`
- Severity: **High**
- Deskripsi: Fungsi `sanitizeSqlParam` menggunakan pendekatan regex yang tidak efektif untuk mencegah SQL injection
- Rekomendasi: Selalu gunakan parameterized queries dengan Supabase client

#### 2.4 A4: Insecure Design (Desain Tidak Aman)

**Issue 6: Rate limiting in-memory**
- Lokasi: `src/lib/rate-limit.ts` dan `src/middleware/rateLimiter.ts`
- Severity: **Medium**
- Deskripsi: Rate limit store menggunakan in-memory storage yang reset ketika server restart
- Rekomendasi: Gunakan Redis (Upstash) untuk rate limiting persistente

**Issue 7: Public profiles are viewable by everyone**
- Lokasi: `supabase/production_schema_and_rls.sql`
- Severity: **Medium**
- Deskripsi: Policy RLS untuk tabel profiles memungkinkan semua user melihat profil semua orang
- Rekomendasi: Batasi akses ke profil hanya untuk user yang bersangkutan dan admin

#### 2.5 A5: Security Misconfiguration (Konfigurasi Keamanan Salah)

**Issue 8: CORS konfigurasi terlalu longgar**
- Lokasi: `src/middleware.ts`
- Severity: **High**
- Deskripsi: Preflight requests mengizinkan semua origin (`*`)
- Rekomendasi: Batasi origin yang diizinkan ke domain aplikasi saja

**Issue 9: Missing security headers in API routes**
- Lokasi: `src/app/api/` (beberapa route)
- Severity: **Medium**
- Deskripsi: Beberapa endpoint API tidak menerapkan security headers yang konsisten
- Rekomendasi: Pastikan semua endpoint API menggunakan middleware security headers

#### 2.6 A6: Vulnerable and Outdated Components (Komponen Rentan dan Ketinggalan Versi)

**Issue 10: Dependencies dengan vulnerabilities**
- Lokasi: `package.json`
- Severity: **Medium**
- Deskripsi: Memungkinkan ada dependencies dengan CVE yang belum diperbarui
- Rekomendasi: Lakukan audit reguler dengan `npm audit` dan perbarui dependencies

#### 2.7 A7: Identification and Authentication Failures (Gagal Identifikasi dan Autentikasi)

**Issue 11: Weak password policy**
- Lokasi: `src/app/api/auth/signup/route.ts`
- Severity: **Medium**
- Deskripsi: Password policy hanya membutuhkan minimal 6 karakter tanpa kebutuhan karakter khusus
- Rekomendasi: Gunakan schema validasi yang sama dengan `registerSchema` di `src/lib/validators.ts`

#### 2.8 A8: Software and Data Integrity Failures (Gagal Integritas Perangkat Lunak dan Data)

**Issue 12: Missing subresource integrity (SRI)**
- Lokasi: `src/app/layout.tsx`
- Severity: **Low**
- Deskripsi: Font dari Google Fonts tidak menggunakan SRI hash
- Rekomendasi: Tambahkan SRI hash untuk semua resource eksternal

#### 2.9 A9: Security Logging and Monitoring Failures (Gagal Logging dan Monitoring Keamanan)

**Issue 13: Missing audit logging for user actions**
- Lokasi: `src/app/api/` (beberapa route)
- Severity: **Medium**
- Deskripsi: Tidak ada logging untuk aksi sensitif seperti update profile atau assessment
- Rekomendasi: Implementasi audit logging untuk semua aksi yang memodifikasi data

#### 2.10 A10: Server-Side Request Forgery (SSRF)

**Issue 14: Missing input validation for URLs**
- Lokasi: `src/lib/utils/sanitization.ts`
- Severity: **Medium**
- Deskripsi: Fungsi `sanitizeUrl` tidak memverifikasi hostnames yang diizinkan
- Rekomendasi: Tambahkan whitelist untuk domain yang diizinkan

### 3. Autentikasi dan Otorisasi

#### 3.1 Implementasi Autentikasi
- **Metode**: Supabase Auth dengan JWT tokens
- **Flow**: Email/Password login, Google OAuth
- **Rate Limiting**: Ada (5 attempts/15 minutes) di `src/lib/rate-limit.ts`
- **Password Policy**: Lemah (min 6 karakter) di signup endpoint

#### 3.2 Session Management
- **Storage**: Cookies dengan httpOnly dan secure flags (di production)
- **Refresh Token**: Dipakai oleh Supabase client
- **Session Validation**: Done via `supabase.auth.getUser()`

#### 3.3 Otorisasi
- **Role Check**: Ada di `src/lib/supabase/server.ts` (`isAdmin()` function)
- **Role Source**: User metadata di `app_metadata.role`
- **RLS Policies**: Didefinisikan di `supabase/production_schema_and_rls.sql`

### 4. Keamanan Database

#### 4.1 Struktur Database
- **Tabel**: profiles, holistic_scores, activities
- **RLS**: Diaktifkan untuk semua tabel
- **FK Constraints**: Ada untuk referensi antar tabel
- **Indexes**: Tidak terlihat di schema audit

#### 4.2 RLS Policies
```sql
-- profiles: Public readable, user can update own
-- holistic_scores: User can view own, admin can view all
-- activities: User can CRUD own
```

#### 4.3 Keamanan Query
- Menggunakan Supabase client dengan parameterized queries
- Tidak ada penggunaan raw SQL queries yang berbahaya

### 5. Konfigurasi SSL/TLS dan Komunikasi

#### 5.1 HTTPS Configuration
- **HSTS**: Ada di middleware dan next.config
- **Certificate**: Harus menggunakan CA yang terpercaya (Vercel/Cloudflare)
- **TLS Version**: Harus TLS 1.2 atau lebih baru

#### 5.2 Security Headers
```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'self';
```

### 6. Keamanan API

#### 6.1 API Routes Structure
- Lokasi: `src/app/api/`
- Jumlah Routes: ~50+ endpoints
- Method Support: GET, POST, PUT, DELETE, OPTIONS

#### 6.2 CORS Configuration
```typescript
// src/middleware.ts
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type, Authorization',
```

#### 6.3 CSRF Protection
- Implementasi custom di `src/lib/security/csrf.ts`
- Token disimpan di cookie httpOnly
- Validation di server side
- Diterapkan di endpoints yang memodifikasi data

### 7. Keamanan Sisi Klien

#### 7.1 XSS Protection
- **DOMPurify**: Ada di `src/lib/xss-protection.ts` (server side)
- **Sanitization**: Fungsi custom di `src/lib/utils/sanitization.ts`
- **CSP**: Mengizinkan 'unsafe-inline' dan 'unsafe-eval' (perlu diperbaiki)

#### 7.2 Input Validation
- **Zod Schema**: Digunakan di beberapa endpoints (login, signup)
- **Custom Validators**: Ada di `src/lib/validators.ts`
- **Sanitization**: Ada di `src/lib/utils/sanitization.ts`

### 8. Monitoring dan Incident Response

#### 8.1 Error Tracking
- **Sentry**: Terintegrasi di client dan server side
- **Konfigurasi**: `sentry.client.config.ts` dan `sentry.server.config.ts`
- **Features**: Error tracking, performance monitoring, session replay

#### 8.2 Logging
- **Console Logs**: Digunakan di beberapa file
- **Audit Logging**: Ada untuk admin operations di `src/lib/supabase-admin.ts`
- **Missing**: Logging untuk user actions dan security events

### 9. Rekomendasi Perbaikan

#### 9.1 Peringkat Kritis (High)
1. **Tambahkan autentikasi admin** - Lindungi endpoint admin dengan middleware otorisasi
2. **Perbaiki CORS configuration** - Batasi origin yang diizinkan
3. **Ganti sanitasi SQL** - Hapus fungsi sanitizeSqlParam dan gunakan parameterized queries
4. **Perbaiki sanitasi HTML** - Gunakan DOMPurify untuk semua sanitasi HTML

#### 9.2 Peringkat Tinggi (High)
1. **Perbaiki otorisasi assessment API** - Gunakan session user daripada userId dari body
2. **Ganti rate limiting storage** - Pindah ke Redis untuk persistensi
3. **Perbaiki password policy** - Gunakan schema validasi yang kuat
4. **Batasi akses profil** - Ubah RLS policy untuk tabel profiles

#### 9.3 Peringkat Sedang (Medium)
1. **Tambahkan audit logging** - Log semua aksi sensitif
2. **Perbaiki input validation URL** - Tambahkan whitelist domain
3. **Perbaiki HSTS header** - Tambahkan preload flag
4. **Tambahkan SRI untuk fonts** - Lindungi resource eksternal

#### 9.4 Peringkat Rendah (Low)
1. **Perbarui dependencies** - Lakukan npm audit secara reguler
2. **Tambahkan indexes database** - Optimalkan kinerja query
3. **Implementasi security headers konsisten** - Pastikan semua endpoint memiliki headers yang sama

### 10. Rencana Tindakan
1. **Phase 1 (1-2 weeks)**: Perbaiki vulnerabilities kritis dan tinggi
2. **Phase 2 (2-3 weeks)**: Perbaiki vulnerabilities sedang
3. **Phase 3 (3-4 weeks)**: Perbaiki vulnerabilities rendah dan optimasi
4. **Phase 4 (Continuing)**: Monitoring dan audit reguler

### 11. Catatan Tambahan
- Semua perubahan harus diuji di staging environment
- Lakukan penetration testing setelah implementasi perbaikan
- Dokumentasikan semua perubahan keamanan
- Train tim development tentang best practices keamanan

## Penutup
Aplikasi PPSDM KMITS memiliki dasar keamanan yang baik, tetapi ada beberapa area yang membutuhkan perbaikan. Implementasi perbaikan sesuai rencana tindakan di atas akan meningkatkan keamanan aplikasi secara signifikan.
