#!/usr/bin/env python3
"""
PPSDM KMITS - Automated Database Setup
========================================
Script otomatis untuk setup database Supabase.
Mencoba beberapa metode: Direct PostgreSQL, Supabase CLI, atau memberikan instruksi manual.

Author: PPSDM KMITS Team
"""
import os
import sys
import subprocess
import urllib.request
import urllib.error
import json
from pathlib import Path

# Konfigurasi
SQL_FILE = "supabase/setup_complete_database.sql"
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', 'https://xncugiuvaetzjxuyfsko.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

def print_header(text):
    """Print header dengan format yang rapi"""
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def print_step(step_num, text):
    """Print step dengan nomor"""
    print(f"\n📌 Step {step_num}: {text}")

def check_environment():
    """Cek environment variables"""
    print_step(1, "Mengecek Environment Variables")
    
    env_path = Path('.env.local')
    if env_path.exists():
        print("  ✅ File .env.local ditemukan")
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value.strip('"\'')
    else:
        print("  ⚠️  File .env.local tidak ditemukan")
    
    global SUPABASE_URL, SUPABASE_KEY
    SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL)
    SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("  ❌ Error: Environment variables tidak lengkap")
        print("  Diperlukan: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY")
        return False
    
    print(f"  ✅ Supabase URL: {SUPABASE_URL[:40]}...")
    print(f"  ✅ API Key: {SUPABASE_KEY[:20]}...")
    return True

def check_sql_file():
    """Cek apakah file SQL ada"""
    print_step(2, "Mengecek File SQL")
    
    sql_path = Path(SQL_FILE)
    if not sql_path.exists():
        print(f"  ❌ File {SQL_FILE} tidak ditemukan")
        return None
    
    content = sql_path.read_text(encoding='utf-8')
    print(f"  ✅ File ditemukan: {len(content)} karakter")
    return content

def try_supabase_cli(sql_content):
    """Coba menggunakan Supabase CLI"""
    print_step(3, "Mencoba Supabase CLI")
    
    try:
        # Cek apakah supabase CLI terinstall
        result = subprocess.run(['supabase', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"  ✅ Supabase CLI ditemukan: {result.stdout.strip()}")
            
            # Simpan SQL ke file temporary
            temp_sql = Path('temp_setup.sql')
            temp_sql.write_text(sql_content, encoding='utf-8')
            
            # Coba push menggunakan CLI
            print("  🔄 Mencoba push schema...")
            result = subprocess.run(['supabase', 'db', 'push'], 
                                  capture_output=True, text=True, timeout=60)
            
            temp_sql.unlink()  # Hapus file temporary
            
            if result.returncode == 0:
                print("  ✅ Database setup berhasil via CLI!")
                return True
            else:
                print(f"  ⚠️  CLI push gagal: {result.stderr[:200]}")
                return False
        else:
            print("  ⚠️  Supabase CLI tidak terinstall")
            return False
    except FileNotFoundError:
        print("  ⚠️  Supabase CLI tidak ditemukan di PATH")
        return False
    except Exception as e:
        print(f"  ⚠️  Error saat menggunakan CLI: {str(e)[:100]}")
        return False

def try_direct_postgres(sql_content):
    """Coba koneksi langsung ke PostgreSQL"""
    print_step(4, "Mencoba Direct PostgreSQL Connection")
    
    # Cek apakah psycopg2 atau pg8000 tersedia
    try:
        import psycopg2
        print("  ✅ psycopg2 ditemukan")
        db_lib = 'psycopg2'
    except ImportError:
        try:
            import pg8000
            print("  ✅ pg8000 ditemukan")
            db_lib = 'pg8000'
        except ImportError:
            print("  ⚠️  Tidak ada PostgreSQL driver (psycopg2/pg8000)")
            print("  Install dengan: pip install psycopg2-binary")
            return False
    
    # Coba dapatkan database password dari user
    db_password = os.getenv('SUPABASE_DB_PASSWORD')
    if not db_password:
        print("  ⚠️  Database password tidak ditemukan di environment")
        print("  💡 Tips: Set SUPABASE_DB_PASSWORD di .env.local")
        return False
    
    # Extract project ref dari URL
    project_ref = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')
    db_host = f"db.{project_ref}.supabase.co"
    
    try:
        if db_lib == 'psycopg2':
            conn = psycopg2.connect(
                host=db_host,
                port=5432,
                database="postgres",
                user="postgres",
                password=db_password,
                sslmode="require"
            )
        else:
            conn = pg8000.connect(
                host=db_host,
                port=5432,
                database="postgres",
                user="postgres",
                password=db_password,
                ssl_context=True
            )
        
        print("  ✅ Berhasil konek ke PostgreSQL")
        
        # Eksekusi SQL
        cursor = conn.cursor()
        
        # Split SQL statements
        statements = [s.strip() for s in sql_content.split(';') if s.strip()]
        
        success_count = 0
        for i, stmt in enumerate(statements):
            try:
                cursor.execute(stmt)
                success_count += 1
                if (i + 1) % 10 == 0:
                    print(f"  🔄 Progress: {i+1}/{len(statements)} statements...")
            except Exception as e:
                print(f"  ⚠️  Statement {i+1} gagal: {str(e)[:50]}")
                continue
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"  ✅ {success_count}/{len(statements)} statements berhasil!")
        return success_count > len(statements) * 0.8  # 80% success rate
        
    except Exception as e:
        print(f"  ❌ Gagal konek ke PostgreSQL: {str(e)[:100]}")
        return False

def try_rest_api():
    """Cek apakah tables sudah ada via REST API"""
    print_step(5, "Mengecek Status Database via REST API")
    
    tables_to_check = [
        'profiles', 'dimensions', 'assessments', 'courses', 
        'modules', 'lessons', 'enrollments', 'user_xp', 'badges'
    ]
    
    existing = []
    missing = []
    
    for table in tables_to_check:
        try:
            url = f"{SUPABASE_URL}/rest/v1/{table}?select=id&limit=1"
            req = urllib.request.Request(
                url,
                headers={
                    'apikey': SUPABASE_KEY,
                    'Authorization': f'Bearer {SUPABASE_KEY}'
                }
            )
            
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    existing.append(table)
                else:
                    missing.append(table)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                missing.append(table)
            else:
                missing.append(table)
        except Exception as e:
            missing.append(table)
    
    print(f"  ✅ Tables existing: {len(existing)}")
    print(f"  ❌ Tables missing: {len(missing)}")
    
    if existing:
        print(f"     Existing: {', '.join(existing[:5])}{'...' if len(existing) > 5 else ''}")
    if missing:
        print(f"     Missing: {', '.join(missing[:5])}{'...' if len(missing) > 5 else ''}")
    
    return len(missing) == 0

def create_exec_sql_function():
    """Coba buat exec_sql function via REST API"""
    print_step(6, "Mencoba membuat exec_sql function")
    
    # SQL untuk membuat function exec_sql
    create_function_sql = """
    CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
    RETURNS VOID AS $$
    BEGIN
        EXECUTE sql_query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """
    
    # Sayangnya, kita tidak bisa eksekusi ini tanpa SQL Editor
    # Jadi kita hanya bisa memberikan instruksi
    print("  ⚠️  Tidak bisa membuat function via REST API (memerlukan SQL Editor)")
    return False

def generate_manual_instructions(sql_content):
    """Generate instruksi manual untuk setup"""
    print_header("INSTRUKSI SETUP MANUAL")
    
    print("""
╔══════════════════════════════════════════════════════════════════════╗
║  METODE 1: Supabase Dashboard (Paling Mudah)                          ║
╚══════════════════════════════════════════════════════════════════════╝

1. Buka browser dan kunjungi:
   https://app.supabase.com/project/xncugiuvaetzjxuyfsko/sql

2. Klik "SQL Editor" di sidebar kiri

3. Klik "New query" atau "+" untuk query baru

4. Copy SELURUH isi file ini:
   supabase/setup_complete_database.sql
   (Total: {} karakter)

5. Paste ke SQL Editor

6. Klik tombol "Run" (▶️)

7. Tunggu sampai selesai (biasanya 10-30 detik)

8. Verifikasi dengan menjalankan:
   python scripts/check_and_setup_database.py

╔══════════════════════════════════════════════════════════════════════╗
║  METODE 2: Supabase CLI (Jika sudah terinstall)                       ║
╚══════════════════════════════════════════════════════════════════════╝

1. Install Supabase CLI jika belum:
   npm install -g supabase

2. Login ke Supabase:
   supabase login

3. Link project:
   supabase link --project-ref xncugiuvaetzjxuyfsko

4. Push schema:
   supabase db push

   Atau reset database:
   supabase db reset

╔══════════════════════════════════════════════════════════════════════╗
║  METODE 3: Direct PostgreSQL (Advanced)                              ║
╚══════════════════════════════════════════════════════════════════════╝

1. Dapatkan database password dari:
   Supabase Dashboard > Settings > Database > Connection string

2. Set environment variable:
   set SUPABASE_DB_PASSWORD=your_password_here

3. Install psycopg2:
   pip install psycopg2-binary

4. Jalankan script ini lagi

╔══════════════════════════════════════════════════════════════════════╗
║  VERIFIKASI SETUP                                                     ║
╚══════════════════════════════════════════════════════════════════════╝

Setelah setup selesai, verifikasi dengan:

   python scripts/check_and_setup_database.py

Atau cek langsung di SQL Editor:

   SELECT tablename FROM pg_tables WHERE schemaname = 'public';

   SELECT * FROM dimensions ORDER BY order_index;

   SELECT * FROM badges;

""".format(len(sql_content)))

def main():
    """Main execution"""
    print_header("PPSDM KMITS - AUTOMATED DATABASE SETUP")
    print("Memulai proses setup database otomatis...")
    
    # Step 1: Cek environment
    if not check_environment():
        print("\n❌ Setup gagal: Environment tidak lengkap")
        sys.exit(1)
    
    # Step 2: Cek SQL file
    sql_content = check_sql_file()
    if not sql_content:
        print("\n❌ Setup gagal: File SQL tidak ditemukan")
        sys.exit(1)
    
    # Step 3: Cek status database saat ini
    is_setup_complete = try_rest_api()
    
    if is_setup_complete:
        print_header("✅ DATABASE SUDAH SETUP!")
        print("Semua tables sudah ada. Tidak perlu setup ulang.")
        sys.exit(0)
    
    # Step 4: Coba berbagai metode otomatis
    print_header("MENCOBA METODE OTOMATIS")
    
    # Coba Supabase CLI
    if try_supabase_cli(sql_content):
        print_header("✅ SETUP BERHASIL VIA CLI!")
        try_rest_api()
        sys.exit(0)
    
    # Coba Direct PostgreSQL
    if try_direct_postgres(sql_content):
        print_header("✅ SETUP BERHASIL VIA DIRECT POSTGRESQL!")
        try_rest_api()
        sys.exit(0)
    
    # Step 5: Jika semua metode otomatis gagal, berikan instruksi manual
    print_header("METODE OTOMATIS GAGAL")
    print("Semua metode otomatis tidak berhasil.")
    print("Ini normal karena keterbatasan security Supabase.")
    
    generate_manual_instructions(sql_content)
    
    # Simpan SQL ke clipboard-friendly file
    quick_sql = Path('QUICK_SETUP_SQL.sql')
    quick_sql.write_text(sql_content, encoding='utf-8')
    print(f"\n💡 Tips: File SQL juga disalin ke: {quick_sql.absolute()}")
    print("    Buka file ini, copy semua isinya, paste ke SQL Editor Supabase")
    
    print_header("SETUP MEMERLUKAN INTERVENSI MANUAL")
    print("Silakan ikuti instruksi METODE 1 di atas (Supabase Dashboard)")
    print("Ini adalah metode paling mudah dan reliable.")

if __name__ == '__main__':
    main()
