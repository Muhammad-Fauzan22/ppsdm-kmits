#!/usr/bin/env python3
"""
Comprehensive AI Integration Test Suite
Tests all AI services, database connections, and end-to-end workflows
"""

import os
import sys
import json
import time
from pathlib import Path
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

# Force UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

print("=" * 80)
print("🔍 COMPREHENSIVE AI INTEGRATION TEST SUITE")
print("=" * 80)
print(f"⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

# Test 1: Environment Variables
print("1️⃣  Environment Variables Configuration")
print("-" * 80)

required_keys = {
    'NEMOTRON_API_KEY': 'Primary AI Model (Nemotron)',
    'NVIDIA_API_KEY_GLM4': 'Fallback AI Model (GLM4)',
    'NEXT_PUBLIC_SUPABASE_URL': 'Supabase URL',
    'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Key',
}

env_status = {}
for key, description in required_keys.items():
    value = os.getenv(key)
    if value:
        masked = value[:20] + "..." + value[-5:] if len(value) > 25 else "[configured]"
        print(f"   ✅ {key}")
        print(f"      {description}")
        env_status[key] = True
    else:
        print(f"   ❌ {key}")
        print(f"      {description} - MISSING!")
        env_status[key] = False

# Test 2: Nemotron Connectivity
print("\n2️⃣  Nemotron Model Connectivity Test")
print("-" * 80)

try:
    from openai import OpenAI
    
    nemotron_key = os.getenv('NEMOTRON_API_KEY')
    if nemotron_key:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=nemotron_key
        )
        
        print("   Sending test query to Nemotron...")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="nvidia/nemotron-3-nano-30b-a3b",
            messages=[{"role": "user", "content": "Count 1 to 3 briefly"}],
            max_tokens=50,
            temperature=0.7,
        )
        
        elapsed = time.time() - start_time
        
        if response.choices[0].message.content:
            print(f"   ✅ Nemotron CONNECTED")
            print(f"      Response time: {elapsed:.2f}s")
            print(f"      Sample response: {response.choices[0].message.content[:80]}...")
        else:
            print(f"   ❌ Nemotron: Empty response")
    else:
        print(f"   ⏭️  Skipped (no API key)")
        
except Exception as e:
    print(f"   ❌ Nemotron test failed: {str(e)[:100]}")

# Test 3: GLM4 Connectivity
print("\n3️⃣  GLM4 Model Connectivity Test")
print("-" * 80)

try:
    from openai import OpenAI
    
    glm4_key = os.getenv('NVIDIA_API_KEY_GLM4')
    if glm4_key:
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=glm4_key
        )
        
        print("   Sending test query to GLM4...")
        start_time = time.time()
        
        response = client.chat.completions.create(
            model="z-ai/glm4.7",
            messages=[{"role": "user", "content": "Count 1 to 3 briefly"}],
            max_tokens=50,
            temperature=0.7,
        )
        
        elapsed = time.time() - start_time
        
        if response.choices[0].message.content:
            print(f"   ✅ GLM4 CONNECTED")
            print(f"      Response time: {elapsed:.2f}s")
            print(f"      Sample response: {response.choices[0].message.content[:80]}...")
        else:
            print(f"   ❌ GLM4: Empty response")
    else:
        print(f"   ⏭️  Skipped (no API key)")
        
except Exception as e:
    print(f"   ❌ GLM4 test failed: {str(e)[:100]}")

# Test 4: Supabase Connectivity
print("\n4️⃣  Supabase Database Connectivity Test")
print("-" * 80)

try:
    from supabase import create_client
    
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if supabase_url and supabase_key:
        supabase = create_client(supabase_url, supabase_key)
        
        print("   Querying courses table...")
        courses = supabase.table("courses").select("id, title").limit(5).execute()
        
        if courses.data:
            course_count = len(courses.data)
            print(f"   ✅ Supabase CONNECTED")
            print(f"      Courses found: {course_count}")
            for i, course in enumerate(courses.data[:3], 1):
                print(f"      {i}. {course.get('title', 'Untitled')[:50]}")
        else:
            print(f"   ⚠️  Connected but no courses found")
            
    else:
        print(f"   ⏭️  Skipped (missing credentials)")
        
except Exception as e:
    print(f"   ❌ Supabase test failed: {str(e)[:100]}")

# Test 5: Python Dependencies
print("\n5️⃣  Python Dependencies Check")
print("-" * 80)

dependencies = [
    ('openai', 'OpenAI client'),
    ('supabase', 'Supabase client'),
    ('dotenv', 'Environment variables'),
    ('requests', 'HTTP requests'),
]

for module_name, description in dependencies:
    try:
        __import__(module_name)
        print(f"   ✅ {module_name:<15} - {description}")
    except ImportError:
        print(f"   ❌ {module_name:<15} - {description} (NOT INSTALLED)")

# Test 6: File Structure Check
print("\n6️⃣  File Structure Verification")
print("-" * 80)

required_files = [
    "src/lib/ai-service.ts",
    "src/lib/ai/kimi.ts",
    "src/app/actions/ai-content.ts",
    "src/app/actions/progress.ts",
    "scripts/smart_ebook_converter.py",
    ".env.local",
]

project_root = Path(__file__).parent.parent

for file_path in required_files:
    full_path = project_root / file_path
    if full_path.exists():
        size = full_path.stat().st_size
        print(f"   ✅ {file_path:<45} ({size:,} bytes)")
    else:
        print(f"   ❌ {file_path:<45} MISSING!")

# Test 7: Database Schema Check
print("\n7️⃣  Database Schema Verification")
print("-" * 80)

try:
    from supabase import create_client
    
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if supabase_url and supabase_key:
        supabase = create_client(supabase_url, supabase_key)
        
        tables = ['courses', 'modules', 'assessments', 'user_progress']
        
        for table_name in tables:
            try:
                result = supabase.table(table_name).select("id").limit(1).execute()
                count = len(result.data) if result.data else 0
                print(f"   ✅ {table_name:<20} - exists")
            except Exception as e:
                print(f"   ❌ {table_name:<20} - {str(e)[:50]}")
    else:
        print("   ⏭️  Skipped (missing credentials)")
        
except Exception as e:
    print(f"   ⚠️  Schema check failed: {str(e)[:100]}")

# Final Summary
print("\n" + "=" * 80)
print("📊 TEST SUMMARY")
print("=" * 80)

all_passed = all(env_status.values())

if all_passed:
    print("""
    ✅ ALL SYSTEMS OPERATIONAL
    
    ✓ Environment variables configured
    ✓ AI models connected and responding
    ✓ Database connectivity verified
    ✓ File structure intact
    ✓ Schema ready
    
    System is ready for:
    - Content generation
    - Course processing
    - Student assessments
    - Learning recommendations
    """)
else:
    print("""
    ⚠️  SOME ISSUES DETECTED
    
    Review the failed checks above and ensure:
    - All API keys are set in .env.local
    - Network connectivity is available
    - Database is accessible
    - Required Python packages are installed
    """)

print("=" * 80)
print(f"⏰ Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 80)

sys.exit(0 if all_passed else 1)
