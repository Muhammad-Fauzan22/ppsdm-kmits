#!/usr/bin/env python3
"""
PPSDM KMITS Database Setup (Fixed Connection)
Executes SQL statements directly using psycopg2 with corrected Supabase connection
"""

import os
import sys
import psycopg2
from pathlib import Path

def main():
    print("🚀 PPSDM KMITS Database Setup (Fixed Connection)")
    print("=" * 50)
    
    # 1. Input Password (Wajib karena tidak ada di snippet Anda)
    # Tekan Enter jika passwordnya benar 'Fauzan222019'
    db_password = input("Masukkan Database Password [Default: Fauzan222019]: ") or "Fauzan222019"
    
    # 2. CONFIGURASI BARU (Berdasarkan data "DIRECT_URL" Anda)
    # Host: aws-1-ap-southeast-1.pooler.supabase.com
    # User: postgres.xncugiuvaetzjxuyfsko
    # Port: 5432 (Direct/Session Mode untuk Migrasi)
    
    db_host = "aws-1-ap-southeast-1.pooler.supabase.com"
    db_user = "postgres.xncugiuvaetzjxuyfsko"
    db_name = "postgres"
    db_port = "5432"

    # Menyusun Connection String
    conn_string = f"host={db_host} user={db_user} password={db_password} dbname={db_name} port={db_port}"

    print(f"\n🔗 Connecting to: {db_host}...")
    print(f"👤 User: {db_user}")

    try:
        # Connect ke database
        conn = psycopg2.connect(conn_string)
        conn.autocommit = True 
        cursor = conn.cursor()
        print("✅ Koneksi Berhasil!")

        # Baca file SQL
        sql_file = Path('supabase/setup_complete_database.sql')
        if not sql_file.exists():
            print(f"❌ Error: File tidak ditemukan di {sql_file.absolute()}")
            return

        print(f"📄 Membaca file SQL: {sql_file.name}")
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        print("🔄 Sedang mengeksekusi SQL (Mungkin butuh beberapa detik)...")
        
        # Eksekusi
        cursor.execute(sql_content)
        
        print("\n🎉 SUKSES! Database PPSDM KMITS berhasil di-setup.")
        print("Silakan cek Dashboard Supabase Anda untuk melihat tabel yang baru dibuat.")
        
    except psycopg2.OperationalError as e:
        print("\n❌ GAGAL KONEKSI:")
        print("Kemungkinan Password Salah. Pastikan password DB Anda benar.")
        print(f"Detail: {e}")
    except Exception as e:
        print(f"\n❌ ERROR LAIN: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    main()
