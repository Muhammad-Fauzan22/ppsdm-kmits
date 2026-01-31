
import os
import shutil
import json
import time
import concurrent.futures
from openai import OpenAI
from supabase import create_client, Client
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Import Drive Manager
try:
    from drive_manager import DriveManager
except ImportError:
    DriveManager = None

try:
    from content_factory import generate_podcast_script, generate_audio_files, generate_slide_content
    CONTENT_FACTORY_AVAILABLE = True
except ImportError:
    CONTENT_FACTORY_AVAILABLE = False

load_dotenv('.env.local')

# ==============================================================================
# 1. SETUP & CONFIGURATION
# ==============================================================================

# Supabase Client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# AI Models Configuration
MODELS = {
    "planner": {
        "id": "deepseek-ai/deepseek-v3.2", 
        "api_key": os.environ.get("NVIDIA_MULTI_API_KEY"),
        "base_url": "https://integrate.api.nvidia.com/v1",
        "role": "Curriculum Architect"
    },
    "writer": {
        "id": "nvidia/nemotron-3-nano-30b-a3b",
        "api_key": os.environ.get("NEMOTRON_API_KEY"),
        "base_url": "https://integrate.api.nvidia.com/v1",
        "role": "Content Developer"
    },
    "examiner": {
        "id": "mistralai/mistral-large-3-675b-instruct-2512",
        "api_key": os.environ.get("NVIDIA_MULTI_API_KEY"),
        "base_url": "https://integrate.api.nvidia.com/v1",
        "role": "Assessment Specialist"
    }
}

# ==============================================================================
# 2. AI AGENT FACTORY
# ==============================================================================

def query_ai(role_key: str, prompt: str, system_prompt: str = "You are a helpful assistant.", json_mode: bool = False) -> str:
    """
    Generic function to query any of the configured AI models.
    """
    config = MODELS[role_key]
    if not config["api_key"]:
        print(f"MISSING {role_key.upper()} API Key!")
        return ""

    client = OpenAI(base_url=config["base_url"], api_key=config["api_key"])
    
    # print(f"AI: {config['role']} ({config['id']}) is working...", end="", flush=True)
    
    try:
        completion = client.chat.completions.create(
            model=config["id"],
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7 if not json_mode else 0.1,
            top_p=0.95,
            max_tokens=4096,
            stream=False 
        )
        response = completion.choices[0].message.content
        # print(" DONE.")
        return response
    except Exception as e:
        print(f" FAILED: {e}")
        return ""

# ==============================================================================
# 3. WORKFLOW STEPS
# ==============================================================================

def step_1_plan_curriculum(topic: str) -> Dict[str, Any]:
    print(f"\nPHASE 1: Designing Curriculum for '{topic}' (DeepSeek)...")
    
    prompt = f"""
    Design a comprehensive university-level course curriculum for: "{topic}".
    
    Output MUST be valid JSON (no markdown formatting) with this structure:
    {{
      "title": "Course Title",
      "description": "2-sentence overview",
      "modules": [
        {{
          "title": "Module Title",
          "description": "Module objectives",
          "lessons": [
            {{ "title": "Lesson Title", "concept_notes": "Key specific concepts to cover in 100 words" }}
          ]
        }}
      ]
    }}
    
    Requirements:
    - Create exactly 3 Modules.
    - Each Module must have 2 Lessons.
    - Total 6 Lessons.
    """
    
    json_str = query_ai("planner", prompt, system_prompt="You are an expert Instructional Designer. Output raw JSON only.", json_mode=True)
    json_str = json_str.replace("```json", "").replace("```", "").strip()
    
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        print("JSON Parsing Failed. Retrying...")
        return None

def step_2_write_lesson(lesson_title: str, concept_notes: str, course_context: str) -> str:
    print(f"  [Parallel] Writing Lesson: {lesson_title} (Nemotron)...")
    
    prompt = f"""
    Write a detailed, engaging course lesson titled "{lesson_title}".
    
    Context: This is part of the course "{course_context}".
    Concept Notes: {concept_notes}
    
    Format:
    - Start with a real-world hook/example.
    - Use clear headings (##).
    - Include a "Key Concept" callout (> blockquote).
    - Provide a code snippet or practical example if applicable.
    - End with a "Summary" section.
    
    Output strictly Markdown content.
    """
    
    # Simulate thinking time for effect if needed, but here we just call
    content = query_ai("writer", prompt, system_prompt="You are a Professor known for clear, engaging explanations.")
    print(f"  [Done] Lesson '{lesson_title}' Generated.")
    return content

def step_3_generate_quiz(module_content: str, module_title: str) -> List[Dict[str, Any]]:
    print(f"  [Parallel] Generating Quiz for '{module_title}' (Mistral)...")
    
    prompt = f"""
    Create a 3-question multiple-choice quiz based on this content:
    
    {module_content[:2500]}... (truncated)
    
    Output JSON format only:
    [
      {{
        "question": "Question text?",
        "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
        "correct_answer": "A) Option 1",
        "explanation": "Why it is correct."
      }}
    ]
    """
    
    json_str = query_ai("examiner", prompt, system_prompt="You are a strict Examiner. Output raw JSON array only.", json_mode=True)
    json_str = json_str.replace("```json", "").replace("```", "").strip()
    
    try:
        data = json.loads(json_str)
        print(f"  [Done] Quiz for '{module_title}' Generated.")
        return data
    except:
        return []

# ==============================================================================
# 4. ORCHESTRATOR
# ==============================================================================

def save_to_supabase(curriculum: Dict, full_content: Dict[str, str], quizzes: Dict[str, List]):
    print("\nSAVING TO DATABASE...")
    
    # 1. Course
    res = supabase.table('courses').insert({
        "title": curriculum['title'],
        "description": curriculum['description'],
        "published": True,
        "category": "AI Generated"
    }).execute()
    course_id = res.data[0]['id']
    print(f"Course: {curriculum['title']}")
    
    for i, mod in enumerate(curriculum['modules']):
        # 2a. Media Generation (Hybrid CDN)
        podcast_url = None
        slide_url = None
        if CONTENT_FACTORY_AVAILABLE:
            try:
                print(f"    - Generating Media for '{mod['title']}'...")
                # Podcast
                script = generate_podcast_script(mod['title'])
                audio_file = generate_audio_files(script, out_basename=f"mod_{i}_{mod['title'].replace(' ', '_')}")
                
                # Move to public/demos
                if audio_file and os.path.exists(audio_file):
                    dest_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'demos')
                    os.makedirs(dest_dir, exist_ok=True)
                    dest_file = os.path.join(dest_dir, os.path.basename(audio_file))
                    shutil.move(audio_file, dest_file)
                    podcast_url = f"/demos/{os.path.basename(audio_file)}"
                
                # Slides
                slide_file = generate_slide_content(mod['title'], out_name=f"mod_{i}_{mod['title'].replace(' ', '_')}_slides.md")
                if slide_file and os.path.exists(slide_file):
                    dest_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'demos')
                    os.makedirs(dest_dir, exist_ok=True)
                    dest_file = os.path.join(dest_dir, os.path.basename(slide_file))
                    shutil.move(slide_file, dest_file)
                    slide_url = f"/demos/{os.path.basename(slide_file)}"

            except Exception as e:
                print(f"    ! Media generation failed: {e}")

        res_mod = supabase.table('modules').insert({
            "course_id": course_id,
            "title": mod['title'],
            "description": mod['description'],
            "order_index": i,
            "podcast_url": podcast_url,
            "slide_url": slide_url
        }).execute()
        module_id = res_mod.data[0]['id']
        print(f"  - Module: {mod['title']}")
        
        # 3. Lessons
        for j, lesson in enumerate(mod['lessons']):
            content = full_content.get(lesson['title'], "Content generation failed.")
            
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

def upload_to_drive(drive: DriveManager, curriculum: Dict, full_content: Dict):
    if not drive or not drive.service:
        return

    print("\nUPLOADING TO GOOGLE DRIVE...")
    root_folder = os.environ.get("GOOGLE_DRIVE_FOLDER_ID")
    
    # Create Course Folder
    course_folder_id = drive.create_folder(curriculum['title'], parent_id=root_folder)
    
    for mod in curriculum['modules']:
        # Create Module Folder
        mod_folder_id = drive.create_folder(mod['title'], parent_id=course_folder_id)
        
        for lesson in mod['lessons']:
            title = lesson['title']
            content = full_content.get(title, "")
            
            # Save temp file
            safe_title = "".join([c for c in title if c.isalpha() or c.isdigit() or c==' ']).strip()
            filename = f"{safe_title}.md"
            with open(filename, "w", encoding="utf-8") as f:
                f.write(content)
            
            # Upload
            drive.upload_file(filename, filename, parent_id=mod_folder_id)
            
            # Clean up
            os.remove(filename)

def main():
    print("STARTING AI UNIVERSITY BUILDER V2 (Parallel + Drive)")
    
    # Initialize Drive
    drive = None
    if DriveManager:
        drive = DriveManager()
    
    import sys
    if len(sys.argv) > 1:
        user_topic = sys.argv[1]
        print(f"Topic received from CLI: '{user_topic}'")
    else:
        user_topic = input("\nEnter Topic (default: 'Python for Data Science'): ") or "Python for Data Science"
    
    # PHASE 1: PLAN
    curriculum = step_1_plan_curriculum(user_topic)
    if not curriculum: return

    full_content_map = {}
    quizzes_map = {}
    
    # PHASE 2: EXECUTE PARALLEL (Lessons)
    print("\nPHASE 2: Parallel Content Production (Nemotron)...")
    
    lessons_to_generate = []
    for mod in curriculum['modules']:
        for lesson in mod['lessons']:
            lessons_to_generate.append((lesson['title'], lesson['concept_notes']))
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_to_lesson = {
            executor.submit(step_2_write_lesson, title, notes, curriculum['title']): title 
            for title, notes in lessons_to_generate
        }
        
        for future in concurrent.futures.as_completed(future_to_lesson):
            title = future_to_lesson[future]
            try:
                content = future.result()
                full_content_map[title] = content
            except Exception as e:
                print(f"  x Lesson '{title}' failed: {e}")

    # PHASE 3: EXECUTE PARALLEL (Quizzes)
    print("\nPHASE 3: Parallel Assessment Generation (Mistral)...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        future_to_mod = {}
        for mod in curriculum['modules']:
            # Aggregate content for the module
            mod_content = ""
            for lesson in mod['lessons']:
                mod_content += full_content_map.get(lesson['title'], "") + "\n\n"
            
            future = executor.submit(step_3_generate_quiz, mod_content, mod['title'])
            future_to_mod[future] = mod['title']
            
        for future in concurrent.futures.as_completed(future_to_mod):
            mod_title = future_to_mod[future]
            try:
                quiz_data = future.result()
                quizzes_map[mod_title] = quiz_data
            except Exception as e:
                print(f"  x Quiz '{mod_title}' failed: {e}")

    # BACKUP JSON
    filename = f"{user_topic.replace(' ', '_').lower()}_course.json"
    full_data = {"curriculum": curriculum, "content": full_content_map, "quizzes": quizzes_map}
    with open(filename, "w") as f:
        json.dump(full_data, f, indent=2)
    print(f"\nBACKUP SAVED: {filename}")

    # PHASE 4: DB SAVE
    try:
        save_to_supabase(curriculum, full_content_map, quizzes_map)
    except Exception as e:
        print(f"\nDATABASE ERROR: {e}")

    # PHASE 5: DRIVE UPLOAD
    if drive:
        upload_to_drive(drive, curriculum, full_content_map)
    else:
        print("\nDrive Upload Skipped (Credentials missing).")

    print("\nALL SYSTEMS GO. Course Created Successfully.")

if __name__ == "__main__":
    main()
