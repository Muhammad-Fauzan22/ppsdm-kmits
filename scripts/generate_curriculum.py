#!/usr/bin/env python3
"""
Generate curriculum using Google Gemini (google.generativeai) and insert into Supabase.
Usage: set environment variables `SUPABASE_URL`, `SUPABASE_ANON_KEY` (or SERVICE_ROLE), and `GOOGLE_AI_KEY`.
"""

import os
import time
import json
from typing import List, Dict, Any

try:
    import google.generativeai as genai
except Exception:
    genai = None

try:
    from supabase import create_client
except Exception:
    create_client = None

SUPABASE_URL = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_ANON_KEY')
GOOGLE_AI_KEY = os.environ.get('GOOGLE_AI_KEY') or os.environ.get('GOOGLE_GENERATIVE_AI_API_KEY')

if genai is None:
    raise ImportError('google.generativeai is not installed. See requirements.txt')

if create_client is None:
    raise ImportError('supabase client not installed. See requirements.txt')

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError('Supabase credentials not set in environment variables')

if not GOOGLE_AI_KEY:
    raise EnvironmentError('Google AI key not set in environment variables')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def _ask_gemini(prompt: str, attempts: int = 3, wait_sec: int = 2) -> str:
    genai.configure(api_key=GOOGLE_AI_KEY)
    for i in range(attempts):
        try:
            # Using chat-like interface; adjust model if needed for Gemini Free Tier
            response = genai.chat.create(model="gemini-lite", messages=[{"role": "user", "content": prompt}])
            # Response content extraction may vary by library version
            content = None
            if hasattr(response, 'candidates'):
                content = response.candidates[0].content
            elif hasattr(response, 'content'):
                content = response.content
            else:
                content = str(response)
            return content
        except Exception as e:
            print(f"Gemini request failed (attempt {i+1}/{attempts}): {e}")
            time.sleep(wait_sec)
    raise RuntimeError('Failed to get response from Gemini after retries')


def _insert_course(course_obj: Dict[str, Any]) -> Dict[str, Any]:
    res = supabase.table('courses').insert(course_obj).execute()
    if res.status_code not in (200, 201):
        raise RuntimeError(f'Failed to insert course: {res.data}')
    # supabase-py returns data in res.data
    return res.data[0]


def _insert_module(module_obj: Dict[str, Any]) -> Dict[str, Any]:
    res = supabase.table('modules').insert(module_obj).execute()
    if res.status_code not in (200, 201):
        raise RuntimeError(f'Failed to insert module: {res.data}')
    return res.data[0]


def _insert_assessment(assessment_obj: Dict[str, Any]) -> Dict[str, Any]:
    res = supabase.table('assessments').insert(assessment_obj).execute()
    if res.status_code not in (200, 201):
        raise RuntimeError(f'Failed to insert assessment: {res.data}')
    return res.data[0]


def generate_course(topic: str) -> Dict[str, Any]:
    """Generate course, modules and quizzes for a given topic.

    Returns the created course record.
    """
    print(f"Generating course for topic: {topic}")

    # 1) Create a basic course record
    course_obj = {
        'title': topic,
        'slug': topic.lower().replace(' ', '-'),
        'description': f'Auto-generated course on {topic}',
        'category': 'Auto-generated',
        'level': 'beginner',
        'is_published': False
    }

    created_course = _insert_course(course_obj)
    course_id = created_course['id']
    print(f"Inserted course id: {course_id}")

    # 2) Ask Gemini to create a 5-module syllabus in JSON format
    prompt = (
        f"Create a detailed syllabus for a course titled '{topic}'. "
        "Return exactly a JSON object with a top-level key 'modules' that is an array of 5 objects. "
        "Each module must contain: title, description, content_markdown, duration_minutes (int), quizzes (array). "
        "Each quiz inside 'quizzes' should include: title, questions (array of question text), total_points. "
        "Do not include any additional commentary or surrounding text."
    )

    raw = _ask_gemini(prompt)
    print("Gemini raw response received; attempting to parse JSON...")

    # Attempt to parse JSON with retry if invalid
    parsed = None
    for attempt in range(3):
        try:
            parsed = json.loads(raw)
            break
        except Exception as e:
            print(f"JSON parse error: {e}; asking Gemini to reformat (retry {attempt+1}/3)")
            # Ask Gemini to provide only JSON
            raw = _ask_gemini("Please provide the previous response as valid JSON only.")
            time.sleep(1)

    if parsed is None:
        raise ValueError('Failed to parse JSON from Gemini')

    modules = parsed.get('modules') if isinstance(parsed, dict) else None
    if not modules or len(modules) == 0:
        raise ValueError('No modules found in Gemini response')

    created_modules = []
    created_assessments = []

    for idx, m in enumerate(modules, start=1):
        module_obj = {
            'course_id': course_id,
            'title': m.get('title') or f'Module {idx}',
            'slug': (m.get('title') or f'module-{idx}').lower().replace(' ', '-'),
            'description': m.get('description') or '',
            'content': m.get('content_markdown') or '',
            'module_order': idx,
            'duration_minutes': m.get('duration_minutes') or 30,
            'learning_outcomes': json.dumps(m.get('learning_outcomes') or []),
            'resources': json.dumps(m.get('resources') or [])
        }
        created_m = _insert_module(module_obj)
        print(f"Inserted module: {created_m['id']} - {created_m['title']}")
        created_modules.append(created_m)

        # Insert quizzes
        quizzes = m.get('quizzes') or []
        for q in quizzes:
            assessment_obj = {
                'module_id': created_m['id'],
                'title': q.get('title') or 'Quiz',
                'assessment_type': 'quiz',
                'description': q.get('description') or '',
                'questions': q.get('questions') or [],
                'total_points': q.get('total_points') or 10,
                'is_graded_by_ai': True,
                'is_published': False
            }
            created_a = _insert_assessment(assessment_obj)
            print(f"Inserted assessment: {created_a['id']} - {created_a['title']}")
            created_assessments.append(created_a)

    # Update course modules_count
    try:
        supabase.table('courses').update({'modules_count': len(created_modules)}).eq('id', course_id).execute()
    except Exception:
        pass

    return {
        'course': created_course,
        'modules': created_modules,
        'assessments': created_assessments
    }


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Generate curriculum and insert into Supabase')
    parser.add_argument('topic', type=str, help='Course topic/title')
    args = parser.parse_args()

    result = generate_course(args.topic)
    print('Generation complete:')
    print(json.dumps(result, indent=2))
