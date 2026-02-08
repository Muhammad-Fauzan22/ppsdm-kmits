"""
Quiz Generator v2.0 - Infinite Learning Factory
================================================
Generates HOTS MCQ quizzes with multi-model AI fallback.
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


QUIZ_PROMPT = """Anda adalah Pakar Asesmen Pendidikan yang membuat soal kuis berkualitas tinggi.

MODUL: {title}
DIMENSI: {dimension}
KONTEN:
{content}

TUGAS: Buat {num_questions} soal pilihan ganda (MCQ) berdasarkan konten di atas.

KRITERIA SOAL:
1. Higher-Order Thinking Skills (HOTS) - analisis, evaluasi, aplikasi
2. Relevan dengan kehidupan mahasiswa Indonesia
3. Skenario dunia nyata, bukan hafalan
4. Distractor yang masuk akal

FORMAT OUTPUT (JSON array):
[
    {{
        "question": "Pertanyaan yang jelas dan spesifik",
        "options": [
            {{"key": "A", "text": "Opsi A"}},
            {{"key": "B", "text": "Opsi B"}},
            {{"key": "C", "text": "Opsi C"}},
            {{"key": "D", "text": "Opsi D"}}
        ],
        "correct_answer": "B",
        "explanation": "Penjelasan mengapa B benar",
        "difficulty": "easy|medium|hard",
        "skill_tested": "analysis|application|evaluation"
    }}
]

Gunakan bahasa Indonesia yang jelas. Variasikan tingkat kesulitan."""


class QuizGenerator:
    """Quiz generator with multi-model AI fallback."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.stats = {'processed': 0, 'generated': 0, 'errors': 0}
    
    def _get_modules_without_quiz(self, limit: int = 10) -> List[Dict]:
        """Get modules that need quizzes."""
        try:
            modules = self.supabase.table('learning_modules').select(
                'id, title, content_json, dimension'
            ).eq('status', 'published').limit(limit * 2).execute()
            
            result = []
            for m in modules.data or []:
                existing = self.supabase.table('module_quizzes').select('id').eq(
                    'module_id', m['id']
                ).execute()
                
                if not existing.data:
                    result.append(m)
                    if len(result) >= limit:
                        break
            
            return result
        except Exception as e:
            logger.error(f"Fetch error: {e}")
            return []
    
    @monitor_errors('quiz_generator')
    def generate_quiz(self, module: Dict, num_questions: int = 5) -> Optional[List[Dict]]:
        """Generate quiz for a module."""
        rate_limiter.wait('gemini')
        
        title = module.get('title', '')
        content = module.get('content_json', {})
        dimension = module.get('dimension', 'cognitive')
        
        content_text = json.dumps(content, ensure_ascii=False)[:3000] if isinstance(content, dict) else str(content)[:3000]
        
        prompt = QUIZ_PROMPT.format(
            title=title,
            dimension=dimension,
            content=content_text,
            num_questions=num_questions
        )
        
        try:
            questions = generate_json(prompt)
            return questions if isinstance(questions, list) else None
        except Exception as e:
            logger.error(f"Quiz generation error: {e}")
            return None
    
    def save_quiz(self, module_id: str, questions: List[Dict]) -> bool:
        """Save quiz to database."""
        try:
            record = {
                'module_id': module_id,
                'title': 'Kuis Evaluasi Pembelajaran',
                'questions': questions,
                'question_count': len(questions),
                'passing_score': 70,
                'time_limit_seconds': len(questions) * 120,
                'status': 'active'
            }
            
            self.supabase.table('module_quizzes').insert(record).execute()
            return True
        except Exception as e:
            logger.error(f"Save error: {e}")
            return False
    
    def run(self, limit: int = 10) -> Dict:
        """Run quiz generation pipeline."""
        logger.info("=" * 60)
        logger.info("QUIZ GENERATOR v2.0")
        logger.info("=" * 60)
        
        modules = self._get_modules_without_quiz(limit)
        logger.info(f"Found {len(modules)} modules needing quizzes")
        
        for module in modules:
            self.stats['processed'] += 1
            logger.info(f"Generating quiz: {module.get('title', '')[:40]}...")
            
            questions = self.generate_quiz(module)
            
            if questions and self.save_quiz(module['id'], questions):
                self.stats['generated'] += 1
                logger.info(f"  Created {len(questions)} questions")
            else:
                self.stats['errors'] += 1
        
        logger.info(f"Summary: {self.stats}")
        return self.stats


def main():
    generator = QuizGenerator()
    limit = int(os.environ.get('QUIZ_BATCH_SIZE', '10'))
    generator.run(limit)


if __name__ == "__main__":
    main()
