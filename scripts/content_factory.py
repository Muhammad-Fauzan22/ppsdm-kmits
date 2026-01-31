#!/usr/bin/env python3
"""
ContentFactory: generate podcast audio, slides (Marp markdown), and images.

Usage: set env vars in .env.local (GOOGLE_GENERATIVE_AI_API_KEY, OPTIONAL NEMOTRON_API_KEY, GOOGLE_SERVICE_ACCOUNT_FILE for Drive upload)

This script is defensive: it saves outputs locally and only uploads to Drive if a service account JSON path is provided via `GOOGLE_SERVICE_ACCOUNT_FILE`.
"""

import os
import json
import time
import subprocess
from typing import List, Dict

from dotenv import load_dotenv

load_dotenv('.env.local')

GOOGLE_KEY = os.getenv('GOOGLE_GENERATIVE_AI_API_KEY') or os.getenv('GOOGLE_AI_KEY')
NEMOTRON_KEY = os.getenv('NEMOTRON_API_KEY') or os.getenv('NVIDIA_API_KEY')
DRIVE_SA = os.getenv('GOOGLE_SERVICE_ACCOUNT_FILE')  # optional: path to service account JSON
DRIVE_FOLDER = os.getenv('GOOGLE_DRIVE_FOLDER_ID')

OUT_DIR = os.path.join(os.path.dirname(__file__), 'output')
os.makedirs(OUT_DIR, exist_ok=True)

def _gen_text_with_gemini(prompt: str, model: str = os.getenv('GEMINI_MODEL', 'gemini-lite')) -> str:
    try:
        import google.generativeai as genai
    except Exception as e:
        raise RuntimeError('google.generativeai not installed') from e

    genai.configure(api_key=GOOGLE_KEY)
    for attempt in range(3):
        try:
            resp = genai.chat.create(model=model, messages=[{"role": "user", "content": prompt}])
            if hasattr(resp, 'candidates') and resp.candidates:
                return resp.candidates[0].content
            if hasattr(resp, 'content'):
                return resp.content
            return str(resp)
        except Exception as e:
            print(f'Gemini attempt {attempt+1} failed: {e}')
            time.sleep(1)
    raise RuntimeError('Gemini failed after retries')

def _gen_text_fallback_nemotron(prompt: str) -> str:
    if not NEMOTRON_KEY:
        raise RuntimeError('No Nemotron key available')
    try:
        from openai import OpenAI
    except Exception as e:
        raise RuntimeError('openai client not installed') from e

    client = OpenAI(base_url='https://integrate.api.nvidia.com/v1', api_key=NEMOTRON_KEY)
    completion = client.chat.completions.create(model='nvidia/nemotron-3-nano-30b-a3b', messages=[{"role":"user","content":prompt}], max_tokens=1024)
    if hasattr(completion, 'choices') and completion.choices:
        choice = completion.choices[0]
        text = None
        if hasattr(choice, 'message') and hasattr(choice.message, 'content'):
            text = choice.message.content
        elif hasattr(choice, 'text'):
            text = choice.text
        return text or str(completion)
    return str(completion)

def generate_podcast_script(topic: str) -> List[Dict[str, str]]:
    prompt = (
        f"Write a conversational podcast script between two hosts (Budi and Siti) on the topic '{topic}'. "
        "Return a JSON array where each item is {\"speaker\": \"A|B\", \"text\": \"...\"}. Keep it ~5-8 minutes spoken length. Tone: academic yet engaging."
    )
    raw = None
    try:
        raw = _gen_text_with_gemini(prompt)
    except Exception as e:
        print('Gemini error:', e)
        try:
            raw = _gen_text_fallback_nemotron(prompt)
        except Exception as e2:
            print('Nemotron fallback failed:', e2)
            raw = None

    if raw:
        try:
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                return parsed
        except Exception:
            parts = [line.strip() for line in raw.splitlines() if line.strip()]
            script = []
            speaker = 'A'
            for p in parts:
                script.append({'speaker': speaker, 'text': p})
                speaker = 'B' if speaker == 'A' else 'A'
            return script

    print('Using local template fallback for podcast script')
    local_script = [
        {'speaker': 'A', 'text': f'Selamat datang di podcast tentang {topic}. Saya Budi.'},
        {'speaker': 'B', 'text': 'Terima kasih, Budi. Saya Siti, dan hari ini kita akan membahas inti materi.'},
        {'speaker': 'A', 'text': 'Mari mulai dengan definisi dan konsep dasar.'},
        {'speaker': 'B', 'text': 'Lalu kita bahas contoh aplikasinya dalam konteks teknik.'},
        {'speaker': 'A', 'text': 'Akhirnya kita rangkum dan berikan tugas singkat untuk pendengar.'}
    ]
    return local_script

def generate_audio_files(script_json: List[Dict[str, str]], out_basename: str = 'podcast_final') -> str:
    try:
        import edge_tts
    except Exception:
        raise RuntimeError('edge-tts not installed')
    try:
        from pydub import AudioSegment
    except Exception:
        AudioSegment = None

    temp_files = []
    for i, seg in enumerate(script_json):
        speaker = seg.get('speaker', 'A')
        text = seg.get('text', '')
        voice = 'id-ID-ArdiNeural' if speaker == 'A' else 'id-ID-GadisNeural'
        out_path = os.path.join(OUT_DIR, f'{out_basename}_{i}.mp3')

        communicate = edge_tts.Communicate(text, voice)
        # Use async save helper
        import asyncio
        try:
            asyncio.run(communicate.save(out_path))
            temp_files.append(out_path)
        except Exception as e:
            print(f'edge-tts save failed for segment {i}: {e}')

    final_path = os.path.join(OUT_DIR, f'{out_basename}.mp3')
    if AudioSegment is None:
        print('pydub not available; returning last segment or list')
        return temp_files[-1] if temp_files else ''

    combined = None
    from pydub import AudioSegment as _AS
    for t in temp_files:
        seg = _AS.from_file(t, format='mp3')
        if combined is None:
            combined = seg
        else:
            combined += _AS.silent(duration=300) + seg

    if combined is not None:
        combined.export(final_path, format='mp3')
        return final_path
    return ''

def generate_slide_content(topic: str, out_name: str = 'slides.md') -> str:
    prompt = (
        f"Create a Marp-compatible Markdown presentation for '{topic}'. Include: Title slide, Agenda, 3 content slides, Conclusion. "
        "Include image placeholders using Pollinations.ai links."
    )
    raw = None
    try:
        raw = _gen_text_with_gemini(prompt)
    except Exception as e:
        print('Gemini for slides error:', e)
        try:
            raw = _gen_text_fallback_nemotron(prompt)
        except Exception as e2:
            print('Nemotron slides fallback failed:', e2)
            raw = None

    if not raw:
        print('Using local slide template fallback')
        raw = (
            f'---\ntitle: {topic}\n---\n\n# {topic}\n\n---\n\n## Agenda\n- Pengantar\n- Konsep Utama\n- Contoh & Aplikasi\n\n---\n\n## Konsep 1\nPenjelasan singkat...\n\n---\n\n## Konsep 2\nPenjelasan singkat...\n\n---\n\n## Kesimpulan\n- Ringkasan poin penting\n')

    md_path = os.path.join(OUT_DIR, out_name)
    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(raw)

    # Try marp-cli (optional)
    try:
        subprocess.run(['marp', md_path, '--pdf', '--allow-local-files'], check=True)
    except Exception:
        pass

    return md_path

def pollinations_image(prompt: str, out_path: str) -> str:
    url = f'https://image.pollinations.ai/prompt/{prompt.replace(" ", "%20")}'
    import requests
    r = requests.get(url, timeout=30)
    if r.status_code == 200:
        with open(out_path, 'wb') as f:
            f.write(r.content)
        return out_path
    raise RuntimeError(f'Image service failed: {r.status_code}')

def upload_to_drive(filepath: str, folder_id: str) -> Dict:
    if not DRIVE_SA:
        print('No GOOGLE_SERVICE_ACCOUNT_FILE provided; skipping Drive upload for', filepath)
        return {}

    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload

    scopes = ['https://www.googleapis.com/auth/drive.file']
    creds = service_account.Credentials.from_service_account_file(DRIVE_SA, scopes=scopes)
    service = build('drive', 'v3', credentials=creds)

    file_metadata = {'name': os.path.basename(filepath), 'parents': [folder_id]}
    media = MediaFileUpload(filepath, resumable=True)
    file = service.files().create(body=file_metadata, media_body=media, fields='id, webViewLink').execute()
    return file

def run_factory(topic: str):
    print('🔎 Generating script...')
    script = generate_podcast_script(topic)
    script_path = os.path.join(OUT_DIR, f'{topic.replace(" ", "_")}_script.json')
    with open(script_path, 'w', encoding='utf-8') as f:
        json.dump(script, f, ensure_ascii=False, indent=2)

    print('🎙️ Generating audio...')
    audio_path = generate_audio_files(script, out_basename=topic.replace(' ', '_'))
    print('✅ Audio generated at', audio_path)

    print('🖼️ Generating slides...')
    md = generate_slide_content(topic, out_name=topic.replace(' ', '_') + '_slides.md')
    print('✅ Slides markdown at', md)

    if DRIVE_SA and DRIVE_FOLDER:
        print('📤 Uploading assets to Google Drive...')
        for p in [script_path, audio_path, md]:
            try:
                res = upload_to_drive(p, DRIVE_FOLDER)
                print('Uploaded:', res.get('webViewLink') or res.get('id'))
            except Exception as e:
                print('Upload failed for', p, e)
    else:
        print('Drive upload skipped (no service account). Save local outputs in', OUT_DIR)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('topic', type=str, help='Topic to generate content for')
    args = parser.parse_args()
    run_factory(args.topic)

import os
import json
import asyncio
import edge_tts
from openai import OpenAI
try:
    from pydub import AudioSegment
except Exception:
    AudioSegment = None
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv('.env.local')

# CONFIGURATION
# Switched to Groq because Gemini Key was revoked
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=GROQ_API_KEY
)

# VOICES (Indonesian Neural)
VOICE_MALE = "id-ID-ArdiNeural"
VOICE_FEMALE = "id-ID-GadisNeural"

class ContentFactory:
    def __init__(self, topic: str):
        self.topic = topic
        self.model = "llama-3.3-70b-versatile"

    def generate_text(self, prompt: str) -> str:
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model=self.model,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API Error: {e}")
            return ""

    def generate_podcast_script(self) -> List[Dict]:
        print(f"Generating Podcast Script for '{self.topic}' (via Groq)...")
        prompt = f"""
        Create a conversational podcast script between two hosts (Budi and Siti) about "{self.topic}".
        Target Audience: Engineering Students at ITS.
        Tone: Academic yet Engaging, like a Tech Podcast.
        Duration: ~3 minutes dialogue.

        Output strictly a JSON List of objects:
        [
            {{"speaker": "Budi", "text": "Hello everyone, welcome back..."}},
            {{"speaker": "Siti", "text": "Hi Budi, today we are discussing..."}}
        ]
        """
        response_text = self.generate_text(prompt)
        try:
            cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
            # Find list syntax
            start = cleaned_text.find('[')
            end = cleaned_text.rfind(']') + 1
            if start != -1 and end != -1:
                cleaned_text = cleaned_text[start:end]
                
            script = json.loads(cleaned_text)
            return script
        except Exception as e:
            print("Error parsing JSON script.")
            # Fallback simple script
            return [
                {"speaker": "Budi", "text": f"Halo semuanya, kita akan membahas {self.topic}."},
                {"speaker": "Siti", "text": "Topik ini sangat menarik untuk teknik."}
            ]

    async def generate_audio_files(self, script: List[Dict], output_file: str = "podcast_final.mp3"):
        print(f"Recording Audio ({len(script)} segments)...")
        
        temp_files = []
        
        for i, line in enumerate(script):
            speaker = line.get('speaker', 'Budi')
            text = line.get('text', '')
            voice = VOICE_MALE if speaker == "Budi" else VOICE_FEMALE
            
            filename = f"temp_{i}_{speaker}.mp3"
            try:
                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(filename)
                temp_files.append(filename)
                print(f"  - [{speaker}] Segment {i+1} saved.")
            except Exception as e:
                print(f"  - Error saving segment {i}: {e}")

        # Merge Audio (Requires ffmpeg installed)
        print("Mixing Audio...")
        if not AudioSegment:
            print("pydub not installed/working. Skipping merge.")
            # Rename first segment as final fallback if merge fails
            if temp_files:
                import shutil
                shutil.copy(temp_files[0], output_file)
            return temp_files

        combined = AudioSegment.empty()
        try:
            for f in temp_files:
                try:
                    sound = AudioSegment.from_mp3(f)
                    combined += sound
                    # Add slight pause between speakers
                    combined += AudioSegment.silent(duration=300) 
                except Exception as e:
                    print(f"Error mixing segment {f}: {e}")
            
            combined.export(output_file, format="mp3")
            print(f"Podcast compiled: {output_file}")
            
            # Cleanup
            for f in temp_files:
                try: os.remove(f)
                except: pass
                
            return output_file
        except Exception as e:
            print(f"Merge failed: {e}")
            return temp_files

    def generate_slide_content(self, output_file: str = "slides.md"):
        print(f"Designing Slides for '{self.topic}' (via Groq)...")
        prompt = f"""
        Create a Marp Markdown Presentation about "{self.topic}".
        Structure:
        1. Title Slide (Title, Subtitle, Author: PPSDM KMITS)
        2. Agenda
        3. Core Concept 1 (with image placeholder)
        4. Core Concept 2 (with image placeholder)
        5. Core Concept 3 (with image placeholder)
        6. Conclusion

        For images, use Pollinations.ai URL format:
        ![bg right](https://image.pollinations.ai/prompt/DESCRIPTION?width=1080&height=720&nologo=true)
        Replace DESCRIPTION with a specific visual description of the slide concept (URL encoded).

        Output raw Markdown.
        """
        response_text = self.generate_text(prompt)
        # Clean basic markdown if needed
        cleaned_text = response_text.replace("```markdown", "").replace("```", "").strip()
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(cleaned_text)
        print(f"Slides generated: {output_file}")
        return output_file

async def main():
    import sys
    topic = sys.argv[1] if len(sys.argv) > 1 else "Dasar Kepemimpinan"
    
    # Save to public/demos for frontend access
    output_dir = "public/demos"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    factory = ContentFactory(topic)
    
    # Files
    safe_topic = topic.replace(' ', '_')
    slide_path = f"{output_dir}/{safe_topic}_slides.md"
    audio_path = f"{output_dir}/{safe_topic}_podcast.mp3"

    # 1. Slides
    factory.generate_slide_content(slide_path)
    
    # 2. Podcast
    script = factory.generate_podcast_script()
    if script:
        await factory.generate_audio_files(script, audio_path)

if __name__ == "__main__":
    asyncio.run(main())
