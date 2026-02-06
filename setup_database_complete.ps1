# PPSDM KMITS - Complete Database Setup Script
# ================================================
# Script ini akan mengecek dan setup database Supabase secara otomatis
# 
# Cara menjalankan:
#   .\setup_database_complete.ps1
# ================================================

$ErrorActionPreference = "Stop"

Write-Host @"
===============================================================
   PPSDM KMITS - COMPLETE DATABASE SETUP
===============================================================
"@ -ForegroundColor Cyan

# Konfigurasi
$ProjectRef = "xncugiuvaetzjxuyfsko"
$SupabaseUrl = "https://$ProjectRef.supabase.co"
$SqlFile = "supabase/setup_complete_database.sql"
$QuickSqlFile = "QUICK_SETUP_SQL.sql"

# Fungsi untuk print header
function Write-Header($text) {
    Write-Host "`n===============================================================" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "===============================================================" -ForegroundColor Cyan
}

# Fungsi untuk print success
function Write-Success($text) {
    Write-Host "  ✅ $text" -ForegroundColor Green
}

# Fungsi untuk print error
function Write-Error($text) {
    Write-Host "  ❌ $text" -ForegroundColor Red
}

# Fungsi untuk print warning
function Write-Warning($text) {
    Write-Host "  ⚠️  $text" -ForegroundColor Yellow
}

# Fungsi untuk print info
function Write-Info($text) {
    Write-Host "  ℹ️  $text" -ForegroundColor White
}

# Step 1: Cek Environment Variables
Write-Header "STEP 1: Mengecek Environment Variables"

$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Success "File .env.local ditemukan"
    
    # Load environment variables
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]*)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim() -replace '^["'']|["'']$'
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Warning "File .env.local tidak ditemukan"
}

$supabaseUrl = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL", "Process")
$supabaseKey = [Environment]::GetEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY", "Process")

if (-not $supabaseKey) {
    $supabaseKey = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY", "Process")
}

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Error "Environment variables tidak lengkap"
    Write-Info "Diperlukan: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY"
    exit 1
}

Write-Success "Supabase URL: $($supabaseUrl.Substring(0, [Math]::Min(40, $supabaseUrl.Length)))..."
Write-Success "API Key: $($supabaseKey.Substring(0, [Math]::Min(20, $supabaseKey.Length)))..."

# Step 2: Cek File SQL
Write-Header "STEP 2: Mengecek File SQL"

if (-not (Test-Path $SqlFile)) {
    Write-Error "File SQL tidak ditemukan: $SqlFile"
    exit 1
}

$sqlContent = Get-Content $SqlFile -Raw
$sqlLength = $sqlContent.Length
Write-Success "File SQL ditemukan: $sqlLength karakter"

# Copy ke file yang mudah diakses
Copy-Item $SqlFile $QuickSqlFile -Force
Write-Success "File SQL dicopy ke: $QuickSqlFile"

# Step 3: Cek Status Database
Write-Header "STEP 3: Mengecek Status Database"

$tablesToCheck = @(
    "profiles", "dimensions", "assessments", "dimension_stats",
    "courses", "modules", "lessons", "enrollments",
    "user_xp", "badges", "goals", "idps"
)

$existingTables = @()
$missingTables = @()

foreach ($table in $tablesToCheck) {
    try {
        $uri = "$SupabaseUrl/rest/v1/$table`?select=id&limit=1"
        $headers = @{
            "apikey" = $supabaseKey
            "Authorization" = "Bearer $supabaseKey"
        }
        
        $response = Invoke-RestMethod -Uri $uri -Headers $headers -Method GET -TimeoutSec 10
        $existingTables += $table
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404) {
            $missingTables += $table
        } else {
            $missingTables += $table
        }
    }
}

Write-Host "`n  📊 Hasil Pengecekan:" -ForegroundColor White
Write-Success "Tables existing: $($existingTables.Count)"
if ($missingTables.Count -gt 0) {
    Write-Error "Tables missing: $($missingTables.Count)"
    Write-Host "     Missing: $($missingTables -join ', ')" -ForegroundColor Red
}

# Step 4: Setup Database jika diperlukan
if ($missingTables.Count -eq 0) {
    Write-Header "✅ DATABASE SUDAH LENGKAP!"
    Write-Success "Semua tables sudah ada. Tidak perlu setup ulang."
    
    # Verifikasi seed data
    Write-Header "STEP 5: Verifikasi Seed Data"
    
    try {
        $uri = "$SupabaseUrl/rest/v1/dimensions?select=*"
        $headers = @{
            "apikey" = $supabaseKey
            "Authorization" = "Bearer $supabaseKey"
        }
        $dimensions = Invoke-RestMethod -Uri $uri -Headers $headers -Method GET
        Write-Success "Dimensions: $($dimensions.Count) records"
        
        $uri = "$SupabaseUrl/rest/v1/badges?select=*"
        $badges = Invoke-RestMethod -Uri $uri -Headers $headers -Method GET
        Write-Success "Badges: $($badges.Count) records"
        
        if ($dimensions.Count -ge 9 -and $badges.Count -ge 7) {
            Write-Header "🎉 SETUP DATABASE BERHASIL & LENGKAP!"
            Write-Success "9 Dimensions dan 7+ Badges tersedia"
            Write-Info "Database siap digunakan!"
        } else {
            Write-Warning "Seed data mungkin belum lengkap"
        }
    } catch {
        Write-Error "Gagal verifikasi seed data: $_"
    }
    
    exit 0
}

# Step 5: Setup Database
Write-Header "STEP 5: Setup Database"
Write-Warning "Database belum setup. Memulai proses setup..."

# Coba metode 1: Supabase CLI
Write-Host "`n  🔄 Mencoba Metode 1: Supabase CLI" -ForegroundColor Yellow

try {
    $cliVersion = supabase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Supabase CLI ditemukan: $cliVersion"
        
        # Simpan SQL ke temp file
        $tempSql = "temp_setup.sql"
        Set-Content -Path $tempSql -Value $sqlContent -Encoding UTF8
        
        Write-Info "Menjalankan supabase db push..."
        supabase db push
        
        Remove-Item $tempSql -ErrorAction SilentlyContinue
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Setup berhasil via CLI!"
            exit 0
        }
    }
} catch {
    Write-Warning "Supabase CLI tidak tersedia atau gagal"
}

# Coba metode 2: Direct PostgreSQL
Write-Host "`n  🔄 Mencoba Metode 2: Direct PostgreSQL" -ForegroundColor Yellow

$dbPassword = [Environment]::GetEnvironmentVariable("SUPABASE_DB_PASSWORD", "Process")

if (-not $dbPassword) {
    Write-Warning "SUPABASE_DB_PASSWORD tidak ditemukan di environment"
    Write-Info "Dapatkan password dari: Supabase Dashboard > Settings > Database"
} else {
    try {
        # Cek apakah psycopg2 tersedia
        $pythonCheck = python -c "import psycopg2; print('OK')" 2>&1
        if ($pythonCheck -eq "OK") {
            Write-Success "psycopg2 tersedia"
            
            # Jalankan setup via Python
            Write-Info "Menjalankan setup via Direct PostgreSQL..."
            python scripts/auto_setup_database.py
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Setup berhasil via Direct PostgreSQL!"
                exit 0
            }
        } else {
            Write-Warning "psycopg2 tidak tersedia. Install dengan: pip install psycopg2-binary"
        }
    } catch {
        Write-Warning "Gagal konek via Direct PostgreSQL: $_"
    }
}

# Jika semua metode otomatis gagal, gunakan manual
Write-Header "METODE MANUAL (Paling Reliable)"

Write-Host @"

╔══════════════════════════════════════════════════════════════════════╗
║  SETUP MANUAL VIA SUPABASE DASHBOARD                                  ║
╚══════════════════════════════════════════════════════════════════════╝

📋 LANGKAH-LANGKAH:

1. 🌐 Buka browser (sudah terbuka otomatis):
   https://app.supabase.com/project/$ProjectRef/sql

2. 📝 Buka SQL Editor:
   - Klik "SQL Editor" di sidebar kiri
   - Klik "New query" atau tombol "+"

3. 📋 Copy SQL:
   - Buka file: $QuickSqlFile
   - Tekan Ctrl+A untuk select all
   - Tekan Ctrl+C untuk copy

4. 📥 Paste ke SQL Editor:
   - Kembali ke browser
   - Tekan Ctrl+V di text editor
   - Tunggu sebentar (file: $sqlLength karakter)

5. ▶️ Execute:
   - Klik tombol "Run" di atas editor
   - Tunggu sampai selesai (10-30 detik)
   - Akan muncul "Success" jika berhasil

6. ✅ Verifikasi:
   - Jalankan: python scripts/check_and_setup_database.py

"@ -ForegroundColor White

# Buka browser
try {
    Start-Process "https://app.supabase.com/project/$ProjectRef/sql"
    Write-Success "Browser dibuka ke Supabase SQL Editor"
} catch {
    Write-Warning "Tidak bisa membuka browser otomatis"
    Write-Info "Buka manual: https://app.supabase.com/project/$ProjectRef/sql"
}

# Tanya user apakah ingin melihat isi SQL
$response = Read-Host "`nApakah Anda ingin melihat isi file SQL (y/n)?"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "`n--- ISI FILE SQL (20 baris pertama) ---`n" -ForegroundColor Cyan
    Get-Content $QuickSqlFile -TotalCount 20
    Write-Host "`n... (file terlalu panjang, buka di text editor untuk lengkapnya) ...`n" -ForegroundColor Gray
}

Write-Header "💡 TIPS"
Write-Info "File SQL tersedia di: $(Resolve-Path $QuickSqlFile)"
Write-Info "Buka dengan VS Code atau Notepad++ untuk copy lebih mudah"
Write-Info "Pastikan internet stabil saat menjalankan SQL"

Write-Header "🚀 SETUP SELESAI"
Write-Info "Setelah menjalankan SQL di Supabase Dashboard,"
Write-Info "verifikasi dengan menjalankan:"
Write-Host "   python scripts/check_and_setup_database.py" -ForegroundColor Yellow

Read-Host "`nTekan Enter untuk keluar..."
