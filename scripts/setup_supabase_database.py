"""
Automated Supabase Database Setup Script
Runs all SQL configurations automatically

Usage:
    python scripts/setup_supabase_database.py

Prerequisites:
    - Set environment variables:
        NEXT_PUBLIC_SUPABASE_URL
        SUPABASE_SERVICE_ROLE_KEY (required for automated setup)
    - Install supabase-py: pip install supabase

Author: PPSDM KMITS Team
"""
import os
import sys
from pathlib import Path

def setup_database():
    """Main setup function"""
    # Get credentials from environment
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Need service role key for DDL
    
    if not url or not key:
        print("❌ Error: Missing environment variables")
        print("")
        print("Please set the following in your .env.local file:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        print("")
        print("Get your Service Role Key from:")
        print("  https://app.supabase.com/project/_/settings/api")
        sys.exit(1)
    
    # Import supabase here to handle import errors gracefully
    try:
        from supabase import create_client, Client
    except ImportError:
        print("❌ Error: supabase package not installed")
        print("")
        print("Install with: pip install supabase")
        print("")
        print("Or run: ./scripts/one_click_setup.sh")
        sys.exit(1)
    
    print("🚀 PPSDM KMITS Database Setup")
    print("=" * 50)
    print(f"🔗 Connecting to: {url[:30]}...")
    
    supabase: Client = create_client(url, key)
    
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
        # Try to find it relative to script location
        script_dir = Path(__file__).parent.parent
        possible_path = script_dir / 'supabase' / 'setup_complete_database.sql'
        if possible_path.exists():
            sql_file = str(possible_path)
        else:
            print("❌ Error: Could not find setup_complete_database.sql")
            print("Searched in:")
            for path in sql_paths:
                print(f"  - {path}")
            sys.exit(1)
    
    print(f"📄 Reading SQL file: {sql_file}")
    
    # Read SQL file
    with open(sql_file, 'r', encoding='utf-8') as f:
        sql = f.read()
    
    print(f"📊 SQL size: {len(sql)} characters")
    print("")
    
    # Split SQL into statements
    # Handle $$ blocks for functions
    statements = []
    current_statement = []
    in_dollar_block = False
    dollar_tag = None
    
    lines = sql.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Skip empty lines and comments at the top level
        stripped = line.strip()
        if not in_dollar_block and (not stripped or stripped.startswith('--')):
            i += 1
            continue
        
        # Check for dollar-quoted string start
        if not in_dollar_block:
            if '$$' in stripped:
                in_dollar_block = True
                current_statement.append(line)
            elif stripped.endswith(';'):
                current_statement.append(line)
                statements.append('\n'.join(current_statement))
                current_statement = []
            else:
                current_statement.append(line)
        else:
            # Inside dollar block
            current_statement.append(line)
            if '$$' in stripped and stripped != '$$':
                # End of dollar block found
                in_dollar_block = False
                # Check if statement ends here
                if stripped.endswith(';'):
                    statements.append('\n'.join(current_statement))
                    current_statement = []
        
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
        stmt_preview = statement[:60].replace('\n', ' ')
        print(f"[{i}/{len(statements)}] {stmt_preview}...", end=' ')
        
        try:
            # Use RPC to execute raw SQL
            result = supabase.rpc('exec_sql', {'query': statement}).execute()
            success_count += 1
            print("✅")
        except Exception as e:
            error_count += 1
            error_msg = str(e)[:80]
            print(f"❌ ({error_msg})")
            errors.append({
                'statement_num': i,
                'error': str(e),
                'preview': stmt_preview
            })
    
    print("")
    print("=" * 50)
    print(f"📊 Summary: {success_count} success, {error_count} errors")
    
    if error_count == 0:
        print("🎉 Database setup complete!")
        print("")
        verify_setup(supabase)
        return True
    else:
        print("")
        print("⚠️  Some statements failed. Details:")
        for err in errors[:5]:  # Show first 5 errors
            print(f"  - Statement {err['statement_num']}: {err['error'][:50]}")
        if len(errors) > 5:
            print(f"  ... and {len(errors) - 5} more errors")
        return False

def verify_setup(supabase):
    """Verify all tables created"""
    print("🔍 Verifying setup...")
    print("")
    
    tables = [
        'profiles', 'dimensions', 'assessments', 'dimension_stats',
        'goals', 'idp_plans', 'courses', 'modules', 'lessons', 
        'enrollments', 'ebooks', 'ebook_chapters', 'user_xp', 
        'badges', 'certificates', 'course_prerequisites',
        'learning_paths', 'path_courses', 'user_achievements',
        'notifications', 'student_activities'
    ]
    
    verified = 0
    failed = 0
    
    for table in tables:
        try:
            # Try to get count
            result = supabase.table(table).select('*', count='exact').limit(1).execute()
            count = result.count if result.count is not None else 'OK'
            print(f"  ✅ {table}: {count}")
            verified += 1
        except Exception as e:
            # Table might not exist or other error
            error_short = str(e)[:40]
            print(f"  ❌ {table}: {error_short}")
            failed += 1
    
    print("")
    print(f"📊 Tables verified: {verified}/{len(tables)}")
    
    # Check dimensions count
    try:
        result = supabase.table('dimensions').select('*', count='exact').execute()
        dim_count = len(result.data) if result.data else 0
        print(f"📊 Dimensions loaded: {dim_count}/9")
        if dim_count >= 9:
            print("  ✅ All 9 dimensions present")
        else:
            print("  ⚠️  Some dimensions missing")
    except Exception as e:
        print(f"  ❌ Could not verify dimensions: {str(e)[:50]}")
    
    # Check badges count
    try:
        result = supabase.table('badges').select('*', count='exact').execute()
        badge_count = len(result.data) if result.data else 0
        print(f"📊 Badges loaded: {badge_count}")
    except Exception as e:
        print(f"  ⚠️  Could not verify badges (table may be empty)")

if __name__ == '__main__':
    success = setup_database()
    sys.exit(0 if success else 1)
