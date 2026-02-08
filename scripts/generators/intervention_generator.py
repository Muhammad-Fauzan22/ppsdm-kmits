"""
Intervention Generator v2.0 - Infinite Learning Factory
========================================================
Generates dynamic interventions with multi-model AI fallback.
"""

import os
import sys
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from utils.ai_provider import ai_provider, generate_json
    from utils.rate_limiter import rate_limiter
    from utils.monitoring import monitor_errors
except ImportError:
    def generate_json(p, s=None):
        import google.generativeai as genai
        model = genai.GenerativeModel('gemini-1.5-flash')
        return json.loads(model.generate_content(p).text)

load_dotenv('.env.local')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


DIMENSIONS = {
    'cognitive': {
        'name': 'Kognitif & Intelektual',
        'focus': ['critical thinking', 'problem solving', 'learning strategies'],
    },
    'self_management': {
        'name': 'Manajemen Diri',
        'focus': ['time management', 'goal setting', 'productivity'],
    },
    'financial': {
        'name': 'Kecerdasan Finansial',
        'focus': ['budgeting', 'saving', 'investing basics'],
    },
    'physical': {
        'name': 'Kesehatan Fisik',
        'focus': ['exercise', 'nutrition', 'sleep'],
    },
    'emotional': {
        'name': 'Kecerdasan Emosional',
        'focus': ['self-awareness', 'empathy', 'communication'],
    },
    'mental_health': {
        'name': 'Kesehatan Mental',
        'focus': ['stress management', 'mindfulness', 'resilience'],
    },
    'character': {
        'name': 'Karakter & Etika',
        'focus': ['integrity', 'leadership', 'responsibility'],
    },
    'spiritual': {
        'name': 'Spiritual',
        'focus': ['purpose', 'gratitude', 'values'],
    },
    'environmental': {
        'name': 'Kesadaran Lingkungan',
        'focus': ['sustainability', 'eco-actions', 'green habits'],
    }
}

INTERVENTION_PROMPT = """Buat {count} intervensi untuk dimensi {dimension_name} ({focus}).

FORMAT JSON array:
[
    {{
        "title": "Judul singkat (max 50 karakter)",
        "description": "Deskripsi detail (2-3 kalimat)",
        "instructions": "Langkah-langkah spesifik",
        "difficulty": "easy|medium|hard",
        "type": "exercise|challenge|reflection|reading",
        "duration_minutes": 15,
        "min_score_threshold": 50,
        "tags": ["tag1", "tag2"]
    }}
]

Buat intervensi praktis untuk mahasiswa Indonesia dengan variasi kesulitan."""


class InterventionGenerator:
    """Intervention generator with multi-model AI fallback."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.stats = {'generated': 0, 'saved': 0, 'errors': 0}
    
    def _get_existing_count(self, dimension: str) -> int:
        try:
            result = self.supabase.table('interventions').select(
                'id', count='exact'
            ).eq('dimension', dimension).execute()
            return result.count or 0
        except:
            return 0
    
    @monitor_errors('intervention_generator')
    def generate(self, dimension: str, count: int = 5) -> Optional[List[Dict]]:
        """Generate interventions for a dimension."""
        rate_limiter.wait('gemini')
        
        dim_info = DIMENSIONS.get(dimension, DIMENSIONS['cognitive'])
        
        prompt = INTERVENTION_PROMPT.format(
            count=count,
            dimension_name=dim_info['name'],
            focus=', '.join(dim_info['focus'])
        )
        
        try:
            interventions = generate_json(prompt)
            if isinstance(interventions, list):
                self.stats['generated'] += len(interventions)
                return interventions
        except Exception as e:
            logger.error(f"Generation error: {e}")
            self.stats['errors'] += 1
        
        return None
    
    def save(self, interventions: List[Dict], dimension: str) -> int:
        """Save interventions to database."""
        saved = 0
        for inter in interventions:
            try:
                record = {
                    'title': inter.get('title', 'Untitled')[:255],
                    'description': inter.get('description', ''),
                    'instructions': inter.get('instructions', ''),
                    'dimension': dimension,
                    'difficulty': inter.get('difficulty', 'easy'),
                    'type': inter.get('type', 'exercise'),
                    'duration_minutes': inter.get('duration_minutes', 15),
                    'min_score_threshold': inter.get('min_score_threshold'),
                    'tags': inter.get('tags', []),
                    'is_active': True
                }
                self.supabase.table('interventions').insert(record).execute()
                saved += 1
                self.stats['saved'] += 1
            except Exception as e:
                logger.debug(f"Save error: {e}")
        return saved
    
    def run(self, limit: int = 6) -> Dict:
        """Run intervention generation pipeline."""
        logger.info("=" * 60)
        logger.info("INTERVENTION GENERATOR v2.0")
        logger.info("=" * 60)
        
        for dimension, info in DIMENSIONS.items():
            existing = self._get_existing_count(dimension)
            needed = max(0, limit - existing)
            
            if needed == 0:
                logger.info(f"{info['name']}: Already has {existing}")
                continue
            
            logger.info(f"Generating {needed} for {info['name']}...")
            
            interventions = self.generate(dimension, needed)
            if interventions:
                saved = self.save(interventions, dimension)
                logger.info(f"  Saved {saved}")
        
        logger.info(f"Summary: {self.stats}")
        return self.stats


def main():
    generator = InterventionGenerator()
    limit = int(os.environ.get('INTERVENTIONS_PER_DIM', '6'))
    generator.run(limit)


if __name__ == "__main__":
    main()
