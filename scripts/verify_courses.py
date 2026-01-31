#!/usr/bin/env python3
"""Verify that courses are loaded in Supabase"""

from pathlib import Path
from dotenv import load_dotenv
import os
from supabase import create_client

env_path = Path(__file__).parent.parent / ".env.local"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("❌ Missing Supabase credentials")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Count courses
courses = supabase.table("courses").select("id").execute()
total_courses = len(courses.data)

# Count modules
modules = supabase.table("modules").select("id").execute()
total_modules = len(modules.data)

print("\n" + "="*70)
print("📊 DATABASE VERIFICATION")
print("="*70)
print(f"\n✅ Total Courses in Database: {total_courses}")
print(f"✅ Total Modules in Database: {total_modules}")

# Sample some courses
sample_courses = supabase.table("courses").select("id, title, category").limit(10).execute()
print(f"\n📚 Sample Courses:")
for i, course in enumerate(sample_courses.data, 1):
    print(f"   {i}. {course['title'][:50]}... [{course['category']}]")

print("\n" + "="*70)
print(f"🚀 Website ready at: http://localhost:3000")
print(f"   Navigate to: /dashboard/courses")
print("="*70)
