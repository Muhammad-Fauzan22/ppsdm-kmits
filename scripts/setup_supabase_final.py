#!/usr/bin/env python3
"""
Final Automated Supabase Database Setup
Creates exec_sql function and executes all SQL statements
"""

import os
import sys
import requests
import json
import time
from pathlib import Path

def create_exec_sql_function(url, key):
    """Create the exec_sql function using direct SQL execution"""
    print("🔧 Creating exec_sql function...")

    create_function_sql = """
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS void AS $$
    BEGIN
      EXECUTE query;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
    REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM anon;
    REVOKE EXECUTE ON FUNCTION exec_sql(text) FROM authenticated;
    """

    headers = {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'apikey': key
    }

    # Try to execute the function creation using raw SQL endpoint
    try:
        # Use the SQL endpoint directly
        response = requests.post(
            f"{url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={'query': create_function_sql}
        )

        if response.status_code == 200:
            print("✅ exec_sql function created successfully")
            return True
        else:
            print(f"⚠️  Function creation response: {response.status_code} - {response.text}")
            return False

    except Exception as e:
        print(f"❌ Error creating function: {e}")
        return False

def execute_sql_via_rest(url, key, sql):
    """Execute SQL via Supabase REST API"""
    headers = {
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'apikey': key
    }

    try:
        response = requests.post(
            f"{url}/rest/v1/rpc/exec_sql",
            headers=headers,
            json={'query': sql}
        )

        if response.status_code == 200:
            return True, "Success"
        else:
            return False, f"HTTP {response.status_code}: {response.text}"

    except Exception as e:
        return False, str(e)

def setup_database():
    """Setup database using REST API"""

    # Get credentials from environment
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

    if not url or not key:
        print("❌ Error: Missing environment variables")
        print("Please set:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        sys.exit(1)

    print("🚀 PPSDM KMITS Final Automated Database Setup")
    print("=" * 50)
    print(f"🔗 URL: {url[:30]}...")

    # Find the SQL file
    sql_paths = [
        'ppsdm-kmits/supabase/setup_complete_database.sql',
        'supabase/setup_complete_database.sql',
        './supabase/setup_complete_database.sql',
    ]

    sql_file = None
    for path in sql_paths:
        if Path(path).exists():
            sql_file = path
            break

    if not sql_file:
        print("❌ Error: Could not find setup_complete_database.sql")
        sys.exit(1)

    print(f"📄 Reading SQL file: {sql_file}")

    # Read SQL file
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql = f.read()

    print(f"📊 SQL size: {len(sql)} characters")

    # First, try to create the exec_sql function
    if not create_exec_sql_function(url, key):
        print("⚠️  Could not create exec_sql function, trying alternative approach...")

        # Alternative: Try to execute SQL directly using the raw SQL endpoint
        # This might work for some statements
        print("🔄 Trying direct SQL execution...")

    # Split SQL into smaller chunks to avoid payload limits
    statements = []
    current_statement = []
    in_function = False
    in_dollar_block = False
    dollar_tag = None

    lines = sql.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Skip comments and empty lines
        if not in_function and not in_dollar_block and (not stripped or stripped.startswith('--')):
            i += 1
            continue

        current_statement.append(line)

        # Check for function start
        if 'CREATE OR REPLACE FUNCTION' in stripped.upper() or 'CREATE FUNCTION' in stripped.upper():
            in_function = True

        # Check for dollar-quoted blocks
        if not in_dollar_block and '$$' in stripped:
            in_dollar_block = True
        elif in_dollar_block and '$$' in stripped:
            in_dollar_block = False

        # Check for statement end
        if stripped.endswith(';') and not in_function and not in_dollar_block:
            statements.append('\n'.join(current_statement))
            current_statement = []
            in_function = False
        elif in_function and 'LANGUAGE ' in stripped.upper():
            # Function definition ends with LANGUAGE
            statements.append('\n'.join(current_statement))
            current_statement = []
            in_function = False

        i += 1

    # Add any remaining statement
    if current_statement:
        stmt = '\n'.join(current_statement).strip()
        if stmt:
            statements.append(stmt)

    print(f"📝 Parsed {len(statements)} SQL statements")
    print("")

    success_count = 0
    error_count = 0
    errors = []

    for i, statement in enumerate(statements, 1):
        stmt_preview = statement[:80].replace('\n', ' ').strip()
        print(f"[{i}/{len(statements)}] {stmt_preview}...", end=' ')

        success, error_msg = execute_sql_via_rest(url, key, statement)

        if success:
            success_count += 1
            print("✅")
        else:
            error_count += 1
            print(f"❌ ({error_msg[:50]})")
            errors.append({
                'statement_num': i,
                'error': error_msg,
                'preview': stmt_preview
            })

        # Small delay to avoid rate limiting
        time.sleep(0.1)

    print("")
    print("=" * 50)
    print(f"📊 Summary: {success_count} success, {error_count} errors")

    if error_count == 0:
        print("🎉 Database setup complete!")
        return True
    else:
        print("")
        print("⚠️  Some statements failed. Details:")
        for err in errors[:5]:  # Show first 5 errors
            print(f"  - Statement {err['statement_num']}: {err['error'][:80]}")
        if len(errors) > 5:
            print(f"  ... and {len(errors) - 5} more errors")
        return False

def main():
    """Main setup function"""
    print("Installing dependencies...")
    os.system("pip install requests")

    success = setup_database()
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
