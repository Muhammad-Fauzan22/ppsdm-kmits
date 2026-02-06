# PPSDM KMITS - Database Setup Helper for Windows
# ================================================
# Script ini akan membantu Anda setup database Supabase
# 
# Cara menjalankan:
# 1. Buka PowerShell
# 2. Navigate ke folder ppsdm-kmits
# 3. Jalankan: .\setup_database_windows.ps1
# ================================================

Write-Host @"
===============================================================
   PPSDM KMITS - DATABASE SETUP HELPER
===============================================================
"@ -ForegroundColor Cyan

# Cek apakah file SQL ada
$sqlFile = "supabase/setup_complete_database.sql"
$quickFile = "QUICK_SETUP_SQL.sql"

if (Test-Path $sqlFile) {
    Write-Host "✅ File SQL ditemukan: $sqlFile" -ForegroundColor Green
    
    # Copy ke file yang mudah diakses
    Copy-Item $sqlFile $quickFile -Force
    Write-Host "✅ File SQL dicopy ke: $quickFile" -ForegroundColor Green
} else {
    Write-Host "❌ File SQL tidak ditemukan: $sqlFile" -ForegroundColor Red
    exit 1
}

# Buka browser ke Supabase SQL Editor
$supabaseUrl = "https://app.supabase.com/project/xncugiuvaetzjxuyfsko/sql"
Write-Host "`n🌐 Membuka browser ke Supabase SQL Editor..." -ForegroundColor Yellow

try {
    Start-Process $supabaseUrl
    Write-Host "✅ Browser dibuka!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Tidak bisa membuka browser otomatis" -ForegroundColor Yellow
    Write-Host "   Silakan buka manual: $supabaseUrl" -ForegroundColor White
}

# Tampilkan instruksi
Write-Host @"

===============================================================
   INSTRUKSI SETUP (Ikuti langkah-langkah ini):
===============================================================

📋 LANGKAH 1: Buka SQL Editor
   - Browser sudah terbuka (atau buka manual link di atas)
   - Klik "SQL Editor" di sidebar kiri
   - Klik "New query" atau tombol "+"

📋 LANGKAH 2: Copy SQL
   - Buka file: QUICK_SETUP_SQL.sql (di folder ini)
   - Tekan Ctrl+A untuk select all
   - Tekan Ctrl+C untuk copy

📋 LANGKAH 3: Paste ke SQL Editor
   - Kembali ke browser (Supabase SQL Editor)
   - Tekan Ctrl+V di text editor
   - Tunggu sebentar (file besar: ~29KB)

📋 LANGKAH 4: Execute SQL
   - Klik tombol "Run" (▶️) di atas editor
   - Tunggu sampai selesai (10-30 detik)
   - Akan muncul "Success" jika berhasil

📋 LANGKAH 5: Verifikasi
   - Jalankan script verifikasi:
     python scripts/check_and_setup_database.py

===============================================================
   ATAU GUNAKAN METODE ALTERNATIF:
===============================================================

METODE 2: Supabase CLI (jika sudah terinstall)
   npm install -g supabase
   supabase login
   supabase link --project-ref xncugiuvaetzjxuyfsko
   supabase db push

METODE 3: Direct PostgreSQL (Advanced)
   - Dapatkan password dari Supabase Dashboard > Settings > Database
   - Set environment variable: $env:SUPABASE_DB_PASSWORD = "your_password"
   - pip install psycopg2-binary
   - python scripts/auto_setup_database.py

===============================================================
"@ -ForegroundColor White

# Tanya user apakah ingin melihat isi SQL file
$response = Read-Host "`nApakah Anda ingin melihat isi file SQL (y/n)?"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`n--- ISI FILE SQL (10 baris pertama) ---`n" -ForegroundColor Cyan
    Get-Content $quickFile -TotalCount 10
    Write-Host "`n... (file terlalu panjang, buka di text editor) ...`n" -ForegroundColor Gray
}

Write-Host @"
💡 TIPS:
   - File SQL sudah tersedia di: $quickFile
   - Buka dengan Notepad++ atau VS Code untuk copy lebih mudah
   - Pastikan internet stabil saat menjalankan SQL

🚀 Setelah setup selesai, jalankan:
   python scripts/check_and_setup_database.py

"@ -ForegroundColor Green

Read-Host "Tekan Enter untuk keluar..."
