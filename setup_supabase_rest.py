#!/usr/bin/env python3
"""
PPSDM KMITS - Supabase Database Setup via REST API
Executes SQL file directly using Supabase REST API
"""

import os
import sys
import requests
import json
from pathlib import Path

def execute_sql_via_rest(sql_content, url, service_key):
    """Execute SQL via Supabase REST API"""
    headers = {
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'apikey': service_key
    }

    # Split SQL into individual statements
    statements = [stmt.strip() for stmt in sql_content.split(';') if stmt.strip()]

    print(f"📋 Found {len(statements)} SQL statements to execute")

    success_count = 0
    error_count = 0

    for i, stmt in enumerate(statements, 1):
        if not stmt:
            continue

        print(f"🔄 Executing statement {i}/{len(statements)}...")

        # Use the SQL API endpoint
        sql_url = f"{url}/rest/v1/rpc/exec_sql"
        payload = {
            "query": stmt
        }

        try:
            response = requests.post(sql_url, headers=headers, json=payload, timeout=30)

            if response.status_code == 200:
                print(f"  ✅ Statement {i} executed successfully")
                success_count += 1
            else:
                print(f"  ❌ Statement {i} failed: {response.status_code}")
                print(f"     Response: {response.text[:200]}")
                error_count += 1

        except Exception as e:
            print(f"  ❌ Statement {i} error: {str(e)}")
            error_count += 1

    return success_count, error_count

def main():
    print("🚀 PPSDM KMITS Database Setup via REST API")
    print("=" * 50)

    # Get credentials from environment
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not url or not service_key:
        print("❌ Error: Missing environment variables")
        print("Please ensure .env.local contains:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)

    print(f"🔗 Connecting to: {url}")

    # Read SQL file
    sql_file = Path('supabase/setup_complete_database.sql')
    if not sql_file.exists():
        print("❌ Error: setup_complete_database.sql not found")
        sys.exit(1)

    print(f"📄 Reading SQL file: {sql_file}")
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql_content = f.read()

    print(f"📊 SQL file size: {len(sql_content)} characters")

    # Execute SQL
    success_count, error_count = execute_sql_via_rest(sql_content, url, service_key)

    print("\n" + "=" * 50)
    print("📊 EXECUTION SUMMARY")
    print("=" * 50)
    print(f"✅ Successful statements: {success_count}")
    print(f"❌ Failed statements: {error_count}")
    print(f"📈 Success rate: {(success_count/(success_count+error_count)*100):.1f}%")

    if error_count == 0:
        print("\n🎉 Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Verify tables in Supabase Dashboard")
        print("2. Check RLS policies are active")
        print("3. Start your Next.js app: npm run dev")
    else:
        print(f"\n⚠️  Setup completed with {error_count} errors")
        print("Some statements may have failed - check Supabase logs")

if __name__ == '__main__':
    main()
