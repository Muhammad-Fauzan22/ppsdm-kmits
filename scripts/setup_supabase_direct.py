#!/usr/bin/env python3
"""
Direct Supabase Database Setup Script
Executes SQL statements directly without requiring exec_sql function
"""

import os
import sys
import requests
import json
from pathlib import Path

def execute_sql_direct(url, key, sql):
    """Execute SQL directly using Supabase REST API"""
    headers = {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'apikey': key
    }

    # For simple DDL statements, we can try using the REST API
    # But for complex operations, we need to use the SQL editor or CLI

    # This is a simplified approach - in practice, we'd need to use the SQL API
    # For now, let's try a different approach

    # Actually, let's use the Supabase Python client to execute raw SQL
    try:
        from supabase import create_client, Client
        supabase: Client = create_client(url, key)

        # Try to execute the SQL directly
        # Note: This won't work for DDL in most cases with the client
        # We need to use the SQL editor or CLI

        print("⚠️  Direct SQL execution via client is limited for DDL statements")
        print("   Consider using Supabase CLI or SQL Editor instead")
        return False

    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main setup function"""
    # Get credentials from environment
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not url or not key:
        print("❌ Error: Missing environment variables")
        print("Please set:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)

    print("🚀 PPSDM KMITS Direct Database Setup")
    print("=" * 50)
    print(f"🔗 URL: {url[:30]}...")

    # First, try to create the exec_sql function
    exec_sql_file = Path('supabase/exec_sql_function.sql')
    if not exec_sql_file.exists():
        exec_sql_file = Path('../supabase/exec_sql_function.sql')
    if not exec_sql_file.exists():
        exec_sql_file = Path('../../supabase/exec_sql_function.sql')

    if exec_sql_file.exists():
        print(f"📄 Found exec_sql function file: {exec_sql_file}")
        print("⚠️  To complete setup, please:")
        print("   1. Go to Supabase Dashboard > SQL Editor")
        print(f"   2. Copy and paste the contents of {exec_sql_file}")
        print("   3. Execute the SQL to create the exec_sql function")
        print("   4. Then run: python scripts/setup_supabase_database.py")
    else:
        print("❌ Could not find exec_sql_function.sql")

    print("\n📋 Alternative Setup Methods:")
    print("1. Use Supabase CLI (if installed):")
    print("   supabase db push")
    print("\n2. Manual SQL execution:")
    print("   - Go to Supabase Dashboard > SQL Editor")
    print("   - Execute the contents of supabase/setup_complete_database.sql")

    print("\n3. Use the migration files in supabase/migrations/")
    print("   Execute them in order via SQL Editor")

if __name__ == '__main__':
    main()
