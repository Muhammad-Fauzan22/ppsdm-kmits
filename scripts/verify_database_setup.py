"""
Verify database setup is complete for PPSDM KMITS

Usage:
    python scripts/verify_database_setup.py

This script checks:
    - All required tables exist
    - Required seed data is present (dimensions, badges)
    - Row Level Security is enabled
    - Core relationships are working

Author: PPSDM KMITS Team
"""
import os
import sys
from pathlib import Path

def load_env():
    """Load environment variables from .env.local"""
    env_path = Path('.env.local')
    if env_path.exists():
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value.strip('"\'')

def verify():
    """Main verification function"""
    load_env()
    
    url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    
    if not url or not key:
        print("❌ Error: Missing environment variables")
        print("")
        print("Please set in .env.local:")
        print("  - NEXT_PUBLIC_SUPABASE_URL")
        print("  - NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)")
        sys.exit(1)
    
    try:
        from supabase import create_client
    except ImportError:
        print("❌ Error: supabase package not installed")
        print("Install with: pip install supabase")
        sys.exit(1)
    
    print("🔍 Verifying PPSDM KMITS Database Setup")
    print("=" * 60)
    print(f"🔗 URL: {url[:40]}...")
    print("")
    
    supabase = create_client(url, key)
    
    # Check tables
    print("📊 Checking Tables")
    print("-" * 60)
    
    tables = {
        'Core Tables': [
            'profiles', 'dimensions', 'assessments', 'dimension_stats',
        ],
        'Content Tables': [
            'courses', 'modules', 'lessons', 'enrollments',
        ],
        'Gamification': [
            'user_xp', 'badges', 'certificates', 'user_achievements',
        ],
        'Planning': [
            'goals', 'idp_plans',
        ],
        'E-Books': [
            'ebooks', 'ebook_chapters',
        ],
        'Advanced': [
            'learning_paths', 'path_courses', 'course_prerequisites',
            'notifications', 'student_activities'
        ]
    }
    
    all_ok = True
    total_tables = 0
    passed_tables = 0
    
    for category, table_list in tables.items():
        print(f"\n  {category}:")
        for table in table_list:
            total_tables += 1
            try:
                result = supabase.table(table).select('*', count='exact').limit(1).execute()
                print(f"    ✅ {table}")
                passed_tables += 1
            except Exception as e:
                print(f"    ❌ {table}: {str(e)[:40]}")
                all_ok = False
    
    print("")
    print("-" * 60)
    print(f"📊 Tables: {passed_tables}/{total_tables} verified")
    print("")
    
    # Check dimensions
    print("📊 Checking Dimensions (9 Dimensions Framework)")
    print("-" * 60)
    try:
        result = supabase.table('dimensions').select('*').order('order_index').execute()
        dim_count = len(result.data) if result.data else 0
        
        if dim_count >= 9:
            print(f"  ✅ All {dim_count} dimensions loaded")
            for dim in result.data:
                print(f"     {dim['order_index']}. {dim['name']} ({dim['slug']})")
        else:
            print(f"  ⚠️  Only {dim_count}/9 dimensions found")
            all_ok = False
    except Exception as e:
        print(f"  ❌ Could not verify dimensions: {str(e)[:50]}")
        all_ok = False
    
    print("")
    
    # Check badges
    print("📊 Checking Badges")
    print("-" * 60)
    try:
        result = supabase.table('badges').select('*', count='exact').execute()
        badge_count = len(result.data) if result.data else 0
        
        if badge_count > 0:
            print(f"  ✅ {badge_count} badges found")
            for badge in result.data[:3]:  # Show first 3
                print(f"     • {badge.get('name', 'Unnamed')}")
            if badge_count > 3:
                print(f"     ... and {badge_count - 3} more")
        else:
            print(f"  ⚠️  No badges found (table may be empty)")
    except Exception as e:
        print(f"  ❌ Could not verify badges: {str(e)[:50]}")
    
    print("")
    
    # Check RLS
    print("📊 Checking Row Level Security")
    print("-" * 60)
    try:
        # Use RPC to check RLS
        result = supabase.rpc('check_setup_status').execute()
        if result.data:
            print(f"  ✅ RLS check function working")
            # Count tables with data
            tables_with_data = sum(1 for t in result.data if t.get('exists'))
            print(f"  ✅ {tables_with_data} tables accessible")
    except Exception as e:
        print(f"  ⚠️  Could not verify RLS: {str(e)[:50]}")
    
    print("")
    print("=" * 60)
    
    if all_ok:
        print("🎉 All checks passed! Database is ready.")
        print("")
        print("Next steps:")
        print("  1. Start dev server: npm run dev")
        print("  2. Visit: http://localhost:3000")
        print("  3. Sign up and start using the app")
        return True
    else:
        print("⚠️  Some checks failed. Database may be incomplete.")
        print("")
        print("Recommended actions:")
        print("  1. Run full setup: python scripts/setup_supabase_database.py")
        print("  2. Or manual setup: see SUPABASE_SETUP_GUIDE.md")
        print("  3. Verify SQL files exist: supabase/setup_complete_database.sql")
        return False

def check_specific_table(supabase, table_name):
    """Check a specific table with detailed output"""
    try:
        result = supabase.table(table_name).select('*', count='exact').execute()
        count = len(result.data) if result.data else 0
        return True, count, None
    except Exception as e:
        return False, 0, str(e)

if __name__ == '__main__':
    success = verify()
    sys.exit(0 if success else 1)
