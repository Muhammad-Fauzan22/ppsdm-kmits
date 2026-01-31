
import os
import json
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env.local')

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def restore_course(json_path: str):
    print(f"📂 Loading backup: {json_path}...")
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("File not found.")
        return

    curriculum = data.get('curriculum')
    full_content = data.get('content')
    quizzes = data.get('quizzes')

    if not curriculum:
        print("Invalid backup format.")
        return

    print("\n💾 SAVING TO DATABASE...")
    
    try:
        # 1. Course
        res = supabase.table('courses').insert({
            "title": curriculum['title'],
            "description": curriculum['description'],
            "published": True,
            "category": "Restored Backup"
        }).execute()
        course_id = res.data[0]['id']
        print(f"✅ Course: {curriculum['title']}")
        
        for i, mod in enumerate(curriculum['modules']):
            # 2. Module
            res_mod = supabase.table('modules').insert({
                "course_id": course_id,
                "title": mod['title'],
                "description": mod['description'],
                "order_index": i
            }).execute()
            module_id = res_mod.data[0]['id']
            print(f"  - Module: {mod['title']}")
            
            # 3. Lessons
            for j, lesson in enumerate(mod['lessons']):
                content = full_content.get(lesson['title'], "Content missing.")
                
                supabase.table('lessons').insert({
                    "module_id": module_id,
                    "title": lesson['title'],
                    "content": content,
                    "order_index": j
                }).execute()
                print(f"    - Lesson: {lesson['title']}")
                
            # 4. Quiz
            mod_quiz = quizzes.get(mod['title'], [])
            if mod_quiz:
                res_quiz = supabase.table('quizzes').insert({
                    "module_id": module_id,
                    "course_id": course_id,
                    "title": f"Quiz: {mod['title']}"
                }).execute()
                quiz_id = res_quiz.data[0]['id']
                
                for q in mod_quiz:
                    supabase.table('questions').insert({
                        "quiz_id": quiz_id,
                        "text": q['question'],
                        "options": q['options'],
                        "correct_answer": q['correct_answer'],
                        "explanation": q.get('explanation', '')
                    }).execute()
                print(f"    - Quiz: {len(mod_quiz)} Questions")
                
        print("\n✨ Restore Complete!")
        
    except Exception as e:
        print(f"\n❌ Restore Failed: {e}")
        print("Ensure you have run 'supabase/lms_full_schema.sql' in your Supabase SQL Editor.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/restore_course.py <backup_file.json>")
    else:
        restore_course(sys.argv[1])
