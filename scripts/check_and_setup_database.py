#!/usr/bin/env python3
"""
Check and Setup PPSDM KMITS Database
This script checks if required tables exist and sets them up if needed.

Usage:
    python scripts/check_and_setup_database.py

Author: PPSDM KMITS Team
"""
import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path
from typing import List, Dict, Optional, Tuple

# Required tables from setup_complete_database.sql
REQUIRED_TABLES = [
    # Core Tables
    'profiles', 'dimensions', 'assessments', 'dimension_stats',
    # Content Tables
    'courses', 'modules', 'lessons', 'enrollments',
    # Gamification
    'user_xp', 'xp_history', 'badges', 'user_badges', 'certificates',
    # Planning
    'goals', 'idps',
    # E-Books
    'ebooks', 'courses_from_ebooks',
    # Social
    'study_groups', 'group_members'
]

# Tables that should have seed data
SEED_DATA_TABLES = {
    'dimensions': 9,  # 9 dimensions
    'badges': 7       # 7 default badges
}

def load_env_file() -> Dict[str, str]:
    """Load environment variables from .env.local"""
    env_vars = {}
    env_path = Path('.env.local')
    
    if not env_path.exists():
        # Try parent directory
        env_path = Path(__file__).parent.parent / '.env.local'
    
    if env_path.exists():
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if '=' in line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    value = value.strip().strip('"\'')
                    env_vars[key] = value
                    os.environ[key] = value
    
    return env_vars

def get_supabase_credentials() -> Tuple[Optional[str], Optional[str]]:
    """Get Supabase URL and key from environment"""
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    return url, key

def make_supabase_request(
    url: str, 
    key: str, 
    endpoint: str, 
    method: str = 'GET',
    data: Optional[Dict] = None
) -> Tuple[bool, Optional[Dict]]:
    """Make a request to Supabase REST API"""
    headers = {
        'apikey': key,
        'Authorization': f'Bearer {key}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    full_url = f"{url}/rest/v1/{endpoint}"
    
    try:
        if method == 'GET':
            req = urllib.request.Request(full_url, headers=headers, method='GET')
        else:
            json_data = json.dumps(data).encode('utf-8') if data else None
            req = urllib.request.Request(full_url, data=json_data, headers=headers, method=method)
        
        with urllib.request.urlopen(req, timeout=30) as response:
            response_body = response.read().decode('utf-8')
            if response_body:
                return True, json.loads(response_body)
            return True, {}
            
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            error_json = json.loads(error_body)
            return False, error_json
        except:
            return False, {'error': error_body, 'code': e.code}
    except Exception as e:
        return False, {'error': str(e)}

def check_table_exists(url: str, key: str, table_name: str) -> bool:
    """Check if a table exists by attempting to query it"""
    success, result = make_supabase_request(
        url, key, 
        f"{table_name}?select=*&limit=1",
        'GET'
    )
    return success

def get_table_count(url: str, key: str, table_name: str) -> int:
    """Get the count of records in a table"""
    success, result = make_supabase_request(
        url, key,
        f"{table_name}?select=*",
        'GET'
    )
    if success and isinstance(result, list):
        return len(result)
    return 0

def execute_sql_via_rpc(url: str, key: str, sql: str) -> Tuple[bool, Optional[str]]:
    """Execute SQL via Supabase RPC (if exec_sql function exists)"""
    success, result = make_supabase_request(
        url, key,
        "rpc/exec_sql",
        'POST',
        {'query': sql}
    )
    if success:
        return True, None
    return False, str(result.get('message', result.get('error', 'Unknown error')))

def check_database_status(url: str, key: str) -> Dict:
    """Check the status of all required tables"""
    print("🔍 Checking Database Status...")
    print("=" * 60)
    
    status = {
        'tables': {},
        'seed_data': {},
        'missing_tables': [],
        'all_exist': True
    }
    
    for table in REQUIRED_TABLES:
        exists = check_table_exists(url, key, table)
        status['tables'][table] = exists
        
        if exists:
            count = get_table_count(url, key, table)
            status['tables'][table] = {'exists': True, 'count': count}
            print(f"  ✅ {table}: {count} records")
        else:
            status['tables'][table] = {'exists': False, 'count': 0}
            status['missing_tables'].append(table)
            status['all_exist'] = False
            print(f"  ❌ {table}: NOT FOUND")
    
    # Check seed data
    print("\n📊 Checking Seed Data...")
    print("-" * 60)
    
    for table, expected_count in SEED_DATA_TABLES.items():
        if status['tables'].get(table, {}).get('exists', False):
            actual_count = status['tables'][table]['count']
            has_data = actual_count >= expected_count
            status['seed_data'][table] = {
                'expected': expected_count,
                'actual': actual_count,
                'ok': has_data
            }
            if has_data:
                print(f"  ✅ {table}: {actual_count}/{expected_count} records")
            else:
                print(f"  ⚠️  {table}: {actual_count}/{expected_count} records (needs seed data)")
        else:
            status['seed_data'][table] = {
                'expected': expected_count,
                'actual': 0,
                'ok': False
            }
            print(f"  ❌ {table}: Table not found")
    
    return status

def read_sql_file() -> Optional[str]:
    """Read the SQL setup file"""
    sql_paths = [
        'ppsdm-kmits/supabase/setup_complete_database.sql',
        'supabase/setup_complete_database.sql',
        './supabase/setup_complete_database.sql',
        Path(__file__).parent.parent / 'supabase' / 'setup_complete_database.sql'
    ]
    
    for path in sql_paths:
        p = Path(path)
        if p.exists():
            print(f"📄 Found SQL file: {p}")
            with open(p, 'r', encoding='utf-8') as f:
                return f.read()
    
    return None

def setup_database_manual_instructions():
    """Print manual setup instructions"""
    print("\n" + "=" * 60)
    print("📋 MANUAL DATABASE SETUP REQUIRED")
    print("=" * 60)
    print("""
Since the Supabase MCP server is not connected and automated SQL 
execution requires the exec_sql RPC function, please follow these 
manual steps:

1. Go to Supabase Dashboard:
   https://app.supabase.com/project/_/sql

2. Open the SQL Editor

3. Copy the ENTIRE contents of:
   supabase/setup_complete_database.sql

4. Paste into the SQL Editor and click "Run"

5. Verify the setup by running this script again:
   python scripts/check_and_setup_database.py

Alternative: Use Supabase CLI
-----------------------------
If you have the Supabase CLI installed:

    supabase db reset
    supabase db push

Or execute the SQL file directly:
    
    psql $DATABASE_URL -f supabase/setup_complete_database.sql
""")
    print("=" * 60)

def main():
    """Main function"""
    print("🚀 PPSDM KMITS Database Check & Setup")
    print("=" * 60)
    
    # Load environment variables
    load_env_file()
    
    # Get credentials
    url, key = get_supabase_credentials()
    
    if not url or not key:
        print("❌ Error: Missing Supabase credentials")
        print("")
        print("Please set the following environment variables:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY")
        print("")
        print("These should be in your .env.local file")
        return False
    
    print(f"🔗 Supabase URL: {url[:40]}...")
    print(f"🔑 API Key: {key[:20]}...")
    print("")
    
    # Check database status
    status = check_database_status(url, key)
    
    print("\n" + "=" * 60)
    
    if status['all_exist']:
        print("🎉 All required tables exist!")
        
        # Check if seed data is complete
        seed_ok = all(s['ok'] for s in status['seed_data'].values())
        
        if seed_ok:
            print("✅ Database is fully set up and ready to use!")
            print("")
            print("Summary:")
            print(f"  - {len(REQUIRED_TABLES)} tables verified")
            print(f"  - 9 dimensions loaded")
            print(f"  - 7 badges loaded")
            return True
        else:
            print("⚠️  Tables exist but seed data may be incomplete")
            print("You may need to run the SQL setup to ensure all seed data is present")
            setup_database_manual_instructions()
            return False
    else:
        missing_count = len(status['missing_tables'])
        print(f"❌ {missing_count} tables are missing:")
        for table in status['missing_tables']:
            print(f"   - {table}")
        
        print("")
        print("Database setup is required!")
        
        # Try to read SQL file
        sql_content = read_sql_file()
        if sql_content:
            print(f"\n📄 SQL file loaded ({len(sql_content)} characters)")
            print("")
            setup_database_manual_instructions()
        else:
            print("❌ Could not find setup_complete_database.sql")
        
        return False

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
