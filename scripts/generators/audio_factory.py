"""
Audio Factory - Infinite Learning Factory
=========================================
Converts learning modules to high-quality podcast audio.
Uses Edge TTS (Microsoft free) for Indonesian voice synthesis.

Features:
- Indonesian voice (id-ID-ArdiNeural)
- Podcast-style dialogue generation
- Background music mixing (optional)
- Automatic upload to Supabase Storage
"""

import os
import sys
import asyncio
import logging
import tempfile
from datetime import datetime
from typing import Optional, Dict, Any
from pathlib import Path

# Edge TTS for free text-to-speech
try:
    import edge_tts
except ImportError:
    print("Installing edge-tts...")
    os.system(f"{sys.executable} -m pip install edge-tts")
    import edge_tts

from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local')

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('audio_factory.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# Supabase client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase credentials!")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# TTS Configuration
VOICES = {
    'id_male': 'id-ID-ArdiNeural',      # Indonesian male (natural)
    'id_female': 'id-ID-GadisNeural',   # Indonesian female
    'en_male': 'en-US-GuyNeural',       # English male
    'en_female': 'en-US-JennyNeural',   # English female
}

DEFAULT_VOICE = 'id_male'

# Output directory
OUTPUT_DIR = Path("generated_audio")
OUTPUT_DIR.mkdir(exist_ok=True)


def extract_text_from_module(module: Dict) -> str:
    """Extract readable text from module content for TTS."""
    title = module.get('title', 'Modul Pembelajaran')
    description = module.get('description', '')
    content = module.get('content', {})
    
    # Build script
    parts = []
    
    # Introduction
    parts.append(f"Selamat datang di modul pembelajaran: {title}.")
    parts.append("")
    
    if description:
        parts.append(description)
        parts.append("")
    
    # Main content
    if isinstance(content, dict):
        # Introduction section
        intro = content.get('introduction', '')
        if intro:
            parts.append("Mari kita mulai.")
            parts.append(intro)
            parts.append("")
        
        # Key concepts
        concepts = content.get('key_concepts', [])
        if concepts:
            parts.append("Berikut adalah konsep-konsep kunci yang perlu Anda pahami.")
            for i, concept in enumerate(concepts, 1):
                if isinstance(concept, dict):
                    parts.append(f"Konsep {i}: {concept.get('title', '')}")
                    parts.append(concept.get('explanation', ''))
                    if concept.get('application'):
                        parts.append(f"Cara menerapkannya: {concept.get('application', '')}")
                    parts.append("")
        
        # Case study
        case_study = content.get('case_study', {})
        if isinstance(case_study, dict) and case_study.get('title'):
            parts.append("Sekarang mari kita lihat studi kasus.")
            parts.append(f"Judul: {case_study.get('title', '')}")
            parts.append(case_study.get('scenario', ''))
            parts.append(case_study.get('analysis', ''))
            parts.append(f"Kesimpulan: {case_study.get('takeaway', '')}")
            parts.append("")
        
        # Practical steps
        steps = content.get('practical_steps', [])
        if steps:
            parts.append("Berikut adalah langkah-langkah praktis yang bisa Anda lakukan.")
            for i, step in enumerate(steps, 1):
                parts.append(f"Langkah {i}: {step}")
            parts.append("")
        
        # Summary
        summary = content.get('summary', '')
        if summary:
            parts.append("Ringkasan modul ini.")
            parts.append(summary)
    
    elif isinstance(content, str):
        parts.append(content)
    
    # Closing
    parts.append("")
    parts.append("Demikian modul pembelajaran ini. Terima kasih telah mendengarkan.")
    parts.append("Terus belajar dan berkembang!")
    
    # Join and clean
    full_text = " ".join(parts)
    # Clean up for TTS
    full_text = full_text.replace('\n\n', '. ')
    full_text = full_text.replace('\n', ' ')
    full_text = full_text.replace('  ', ' ')
    
    return full_text


async def generate_audio(text: str, output_path: str, voice: str = None) -> bool:
    """Generate audio file using Edge TTS."""
    if not voice:
        voice = VOICES.get(DEFAULT_VOICE, VOICES['id_male'])
    elif voice in VOICES:
        voice = VOICES[voice]
    
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)
        return True
    except Exception as e:
        logger.error(f"TTS generation failed: {e}")
        return False


def upload_to_storage(file_path: str, module_id: str) -> Optional[str]:
    """Upload audio file to Supabase Storage."""
    try:
        bucket = 'module-audio'
        file_name = f"{module_id}.mp3"
        
        # Check if bucket exists, create if not
        try:
            supabase.storage.get_bucket(bucket)
        except:
            supabase.storage.create_bucket(bucket, {'public': True})
        
        # Upload file
        with open(file_path, 'rb') as f:
            result = supabase.storage.from_(bucket).upload(
                file_name,
                f,
                {'content-type': 'audio/mpeg'}
            )
        
        # Get public URL
        public_url = supabase.storage.from_(bucket).get_public_url(file_name)
        return public_url
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        return None


def save_audio_format(module_id: str, file_url: str, file_size: int, duration: int) -> bool:
    """Save audio format record to database."""
    try:
        record = {
            'module_id': module_id,
            'format_type': 'audio',
            'file_url': file_url,
            'file_size_bytes': file_size,
            'duration_seconds': duration,
            'generator': 'edge-tts',
            'mime_type': 'audio/mpeg'
        }
        
        supabase.table('module_formats').insert(record).execute()
        return True
    except Exception as e:
        logger.error(f"Failed to save format record: {e}")
        return False


def get_modules_without_audio(limit: int = 10) -> list:
    """Get modules that don't have audio format yet."""
    try:
        # Get all modules
        modules_response = supabase.table('learning_modules') \
            .select('id, title, content, dimension') \
            .eq('status', 'draft') \
            .limit(limit * 2) \
            .execute()
        
        modules = modules_response.data or []
        
        # Filter out those with audio
        result = []
        for module in modules:
            existing = supabase.table('module_formats') \
                .select('id') \
                .eq('module_id', module['id']) \
                .eq('format_type', 'audio') \
                .execute()
            
            if not existing.data:
                result.append(module)
                if len(result) >= limit:
                    break
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to fetch modules: {e}")
        return []


async def process_module(module: Dict) -> bool:
    """Process a single module to generate audio."""
    module_id = module['id']
    title = module.get('title', 'Untitled')[:50]
    
    logger.info(f"  🎙️ Generating audio: {title}...")
    
    # Extract text
    text = extract_text_from_module(module)
    
    if len(text) < 100:
        logger.warning(f"    ⚠️ Text too short, skipping")
        return False
    
    # Limit text length (Edge TTS has limits)
    if len(text) > 5000:
        text = text[:5000] + ". Untuk konten lengkap, silakan baca modul tertulisnya."
    
    # Generate audio
    output_path = OUTPUT_DIR / f"{module_id}.mp3"
    
    success = await generate_audio(text, str(output_path))
    
    if not success or not output_path.exists():
        logger.error(f"    ❌ Audio generation failed")
        return False
    
    # Get file info
    file_size = output_path.stat().st_size
    
    # Estimate duration (rough: 150 words per minute)
    word_count = len(text.split())
    duration_seconds = int((word_count / 150) * 60)
    
    # Upload to storage
    file_url = upload_to_storage(str(output_path), module_id)
    
    if not file_url:
        logger.error(f"    ❌ Upload failed")
        return False
    
    # Save format record
    success = save_audio_format(module_id, file_url, file_size, duration_seconds)
    
    if success:
        logger.info(f"    ✅ Audio created ({duration_seconds}s)")
        # Clean up local file
        try:
            output_path.unlink()
        except:
            pass
        return True
    
    return False


async def generate_batch(limit: int = 5):
    """Generate audio for a batch of modules."""
    logger.info(f"🎙️ Generating audio for up to {limit} modules...")
    
    modules = get_modules_without_audio(limit)
    
    if not modules:
        logger.info("No modules need audio generation.")
        return 0
    
    logger.info(f"Found {len(modules)} modules for audio generation.")
    
    success_count = 0
    
    for module in modules:
        try:
            if await process_module(module):
                success_count += 1
        except Exception as e:
            logger.error(f"Module processing error: {e}")
    
    return success_count


def main():
    """Main entry point."""
    logger.info("🚀 STARTING AUDIO FACTORY")
    start_time = datetime.utcnow()
    
    # Run async batch processing
    limit = int(os.environ.get('AUDIO_BATCH_SIZE', 5))
    success_count = asyncio.run(generate_batch(limit))
    
    duration = (datetime.utcnow() - start_time).total_seconds()
    
    logger.info(f"""
╔════════════════════════════════════════╗
║      AUDIO FACTORY COMPLETE            ║
╠════════════════════════════════════════╣
║ Audio Files Created: {success_count:>16} ║
║ Duration:            {duration:>13.2f}s ║
╚════════════════════════════════════════╝
""")


if __name__ == "__main__":
    main()
