import os
import sys
import psycopg2
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables dari file .env.local
load_dotenv('.env.local')

def main():
    print("🚀 PPSDM KMITS Database Setup via Direct Connection")

    # KITA BUTUH CONNECTION STRING, BUKAN URL API
    # Format biasanya: postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
    # Password adalah password database yang Anda buat saat bikin project (BUKAN API KEY)
    db_password = input("Masukkan Database Password Anda: ")
    project_ref = "xncugiuvaetzjxuyfsko" # Dari URL supabase Anda

    # Connection string standar Supabase (Transaction Pooler)
    db_url = f"postgres://postgres.{project_ref}:{db_password}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

    print(f"🔗 Connecting to database...")

    try:
        # Connect ke database
        conn = psycopg2.connect(db_url)
        conn.autocommit = True # Penting agar script langsung dieksekusi
        cursor = conn.cursor()

        # Baca file SQL
        sql_file = Path('supabase/setup_complete_database.sql')
        if not sql_file.exists():
            print("❌ Error: File SQL tidak ditemukan")
            return

        print(f"📄 Membaca file: {sql_file}")
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        print("🔄 Mengeksekusi SQL (ini mungkin memakan waktu)...")

        # Psycopg2 pintar menangani file SQL besar tanpa perlu split manual
        cursor.execute(sql_content)

        print("🎉 SUKSES! Database berhasil di-setup.")

    except psycopg2.Error as e:
        print(f"❌ Error Database: {e}")
    except Exception as e:
        print(f"❌ Error Umum: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    main()
