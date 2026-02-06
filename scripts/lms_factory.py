
import os
import json
import time
import google.generativeai as genai
from supabase import create_client, Client
from typing import List, Dict, Any, Optional

# Load environment
from dotenv import load_dotenv
load_dotenv('.env.local')

# 1. Setup Supabase
supabase_url: str = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# 2. Setup Gemini (Google AI)
GOOGLE_API_KEY = os.environ.get("GOOGLE_GENERATIVE_AI_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Missing GOOGLE_GENERATIVE_AI_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp') # Or gemini-pro

def generate_curriculum(topic: str) -> Dict[str, Any]:
    """
    Generates a full course curriculum (5 modules) for a given topic.
    Returns JSON structure.
    """
    prompt = f"""
    Create a comprehensive university-level course curriculum for the topic: "{topic}".
    The output MUST be valid JSON with the following structure:
    {{
      "title": "Course Title",
      "description": "Short description",
      "modules": [
        {{
          "title": "Module 1 Title",
          "description": "Module description",
          "lessons": [
            {{ "title": "Lesson 1.1 Title", "content_outline": "What covers..." }},
            {{ "title": "Lesson 1.2 Title", "content_outline": "What covers..." }}
          ],
          "quiz_questions": [
             {{ "question": "Q1 text", "options": ["A", "B", "C", "D"], "correct_answer": "A", "explanation": "Why correct" }}
          ]
        }}
      ]
    }}
    Generate exactly 5 modules. Each module should have 3 lessons and 2 quiz questions.
    Ensure the JSON is raw, no markdown formatting (```json ... ```).
    """
    
    print(f"🤖 User asked Gemini to generate curriculum for: {topic}...")
    try:
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print(f"❌ Error generating/parsing JSON: {e}")
        return None

def save_course_to_db(course_data: Dict[str, Any]):
    """
    Inserts nested course data into Supabase tables: courses -> modules -> lessons, quizzes
    """
    print("💾 Saving to Supabase...")
    
    # 1. Insert Course
    res = supabase.table('courses').insert({
        "title": course_data['title'],
        "description": course_data.get('description', ''),
        "published": True,
        "category": "Generated"
    }).execute()
    
    if not res.data:
        print("❌ Failed to insert course")
        return
        
    course_id = res.data[0]['id']
    print(f"✅ Course Created: {course_data['title']} ({course_id})")
    
    # 2. Loop Modules
    for i, mod in enumerate(course_data['modules']):
        res_mod = supabase.table('modules').insert({
            "course_id": course_id,
            "title": mod['title'],
            "description": mod.get('description', ''),
            "order_index": i
        }).execute()
        
        module_id = res_mod.data[0]['id']
        print(f"  ├─ Module {i+1}: {mod['title']}")
        
        # 3. Loop Lessons
        if 'lessons' in mod:
            for j, lesson in enumerate(mod['lessons']):
                # We can generate full content here later with Nemotron
                # For now just title
                supabase.table('lessons').insert({
                    "module_id": module_id,
                    "title": lesson['title'],
                    "content": f"# {lesson['title']}\n\n{lesson.get('content_outline', 'Content coming soon...')}", 
                    "order_index": j
                }).execute()
                print(f"  │  ├─ Lesson: {lesson['title']}")
        
        # 4. Create Quiz (Optional based on schema)
        if 'quiz_questions' in mod and mod['quiz_questions']:
            res_quiz = supabase.table('quizzes').insert({
                "module_id": module_id,
                "course_id": course_id,
                "title": f"Quiz: {mod['title']}"
            }).execute()
            
            quiz_id = res_quiz.data[0]['id']
            
            # Insert Questions
            for q in mod['quiz_questions']:
                supabase.table('questions').insert({
                    "quiz_id": quiz_id,
                    "text": q['question'],
                    "options": q['options'],
                    "correct_answer": q['correct_answer'],
                    "explanation": q.get('explanation', '')
                }).execute()
            print(f"  │  └─ Quiz Created with {len(mod['quiz_questions'])} questions")

def main():
    topic = input("Enter a course topic to generate: ")
    if not topic:
        topic = "Introduction to Artificial Intelligence Engineers"
    
    data = generate_curriculum(topic)
    if data:
        save_course_to_db(data)
        print("\n✨ Mission Complete! Course is live in Database.")
    else:
        print("Failed to generate curriculum.")

if __name__ == "__main__":
    main()
