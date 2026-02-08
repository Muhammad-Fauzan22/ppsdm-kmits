"""
Module Generator v2.0 - Infinite Learning Factory
==================================================
Enhanced with multi-model fallback and quality checks.
"""

import os
import sys
import json
import logging
import hashlib
from datetime import datetime
from typing import Dict, List, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from utils.ai_provider import ai_provider, generate, generate_json
    from utils.rate_limiter import rate_limiter
    from utils.monitoring import monitor_errors
except ImportError:
    import google.generativeai as genai
    def generate(p, s=None):
        model = genai.GenerativeModel('gemini-1.5-flash')
        return model.generate_content(p).text
    def generate_json(p, s=None):
        return json.loads(generate(p))

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """Kamu adalah pembuat konten edukasi profesional untuk pengembangan mahasiswa Indonesia.
Buatlah modul pembelajaran yang:
- Relevan untuk mahasiswa Indonesia (umur 18-25 tahun)
- Menggunakan Bahasa Indonesia yang baik
- Menyertakan contoh konkret dan aplikatif
- Memiliki struktur yang jelas (pendahuluan, inti, kesimpulan)
- Mengandung elemen praktis yang bisa langsung diterapkan"""

MODULE_PROMPT = """Berdasarkan materi berikut, buatlah modul pembelajaran lengkap.

MATERI SUMBER:
{content}

DIMENSI: {dimension}
TOPIK: {title}

Buatlah modul dengan format JSON:
{{
    "title": "Judul modul yang menarik (maks 100 karakter)",
    "slug": "judul-dalam-format-slug",
    "description": "Deskripsi singkat 1-2 kalimat",
    "difficulty": "beginner|intermediate|advanced",
    "estimated_duration_minutes": 15-45,
    "learning_objectives": ["Tujuan 1", "Tujuan 2", "Tujuan 3"],
    "content_sections": [
        {{
            "title": "Judul Bagian",
            "content": "Konten lengkap bagian ini (min 200 kata)",
            "key_points": ["Poin 1", "Poin 2"]
        }}
    ],
    "practical_exercises": [
        {{
            "title": "Judul Latihan",
            "instructions": "Instruksi detail",
            "expected_outcome": "Hasil yang diharapkan"
        }}
    ],
    "summary": "Rangkuman modul dalam 2-3 kalimat",
    "further_reading": ["Sumber tambahan 1", "Sumber tambahan 2"]
}}

Pastikan konten berkualitas tinggi dan mudah dipahami."""


class ModuleGenerator:
    """Learning module generator with AI fallback."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.stats = {'processed': 0, 'generated': 0, 'errors': 0}
    
    def _get_unprocessed_materials(self, limit: int = 10) -> List[Dict]:
        """Get quality-filtered materials for module generation."""
        try:
            result = self.supabase.table('raw_materials').select('*').eq(
                'is_processed', False
            ).eq(
                'is_relevant', True
            ).gte(
                'quality_score', 0.4
            ).order('quality_score', desc=True).limit(limit).execute()
            return result.data
        except Exception as e:
            logger.error(f"Failed to get materials: {e}")
            return []
    
    def _make_slug(self, title: str) -> str:
        """Generate URL-friendly slug."""
        import re
        slug = title.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'[\s_]+', '-', slug)
        slug = slug[:80]
        return slug + '-' + hashlib.md5(title.encode()).hexdigest()[:6]
    
    @monitor_errors('module_generator')
    def generate_module(self, material: Dict) -> Optional[Dict]:
        """Generate a learning module from raw material."""
        rate_limiter.wait('gemini')
        
        title = material.get('title', 'Untitled')
        content = material.get('content', '')[:8000]
        dimension = material.get('detected_dimension', 'cognitive')
        
        prompt = MODULE_PROMPT.format(
            content=content,
            dimension=dimension,
            title=title
        )
        
        try:
            module_data = generate_json(prompt, SYSTEM_PROMPT)
            
            if not module_data:
                logger.warning("Empty response from AI")
                return None
            
            # Ensure required fields
            if 'slug' not in module_data:
                module_data['slug'] = self._make_slug(module_data.get('title', title))
            
            # Build module record
            module = {
                'title': module_data.get('title', title)[:500],
                'slug': module_data['slug'],
                'description': module_data.get('description', '')[:1000],
                'dimension': dimension,
                'difficulty': module_data.get('difficulty', 'intermediate'),
                'estimated_duration': module_data.get('estimated_duration_minutes', 20),
                'status': 'draft',
                'content_json': {
                    'learning_objectives': module_data.get('learning_objectives', []),
                    'sections': module_data.get('content_sections', []),
                    'exercises': module_data.get('practical_exercises', []),
                    'summary': module_data.get('summary', ''),
                    'further_reading': module_data.get('further_reading', [])
                },
                'source_material_id': material.get('id'),
                'quality_score': material.get('quality_score', 0.5),
                'metadata': {
                    'source_title': title,
                    'generated_at': datetime.utcnow().isoformat(),
                }
            }
            
            return module
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error: {e}")
            return None
        except Exception as e:
            logger.error(f"Generation error: {e}")
            return None
    
    def save_module(self, module: Dict, material_id: str) -> bool:
        """Save module and mark material as processed."""
        try:
            # Save module
            self.supabase.table('learning_modules').insert(module).execute()
            
            # Mark material as processed
            self.supabase.table('raw_materials').update({
                'is_processed': True
            }).eq('id', material_id).execute()
            
            return True
        except Exception as e:
            logger.error(f"Save failed: {e}")
            return False
    
    def run(self, limit: int = 10) -> Dict:
        """Run module generation pipeline."""
        logger.info("=" * 60)
        logger.info("📖 MODULE GENERATOR v2.0")
        logger.info("=" * 60)
        
        materials = self._get_unprocessed_materials(limit)
        logger.info(f"Found {len(materials)} materials to process")
        
        for material in materials:
            self.stats['processed'] += 1
            logger.info(f"Processing: {material.get('title', '')[:50]}...")
            
            module = self.generate_module(material)
            
            if module:
                if self.save_module(module, material['id']):
                    self.stats['generated'] += 1
                    logger.info(f"  ✓ Generated: {module['title'][:40]}...")
                else:
                    self.stats['errors'] += 1
            else:
                self.stats['errors'] += 1
        
        logger.info("=" * 60)
        logger.info(f"📊 SUMMARY: {self.stats}")
        return self.stats


def main():
    generator = ModuleGenerator()
    limit = int(os.environ.get('MODULE_BATCH_SIZE', '10'))
    generator.run(limit)


if __name__ == "__main__":
    main()
