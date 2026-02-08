"""
Dimension Classifier v2.0 - Infinite Learning Factory
======================================================
Enhanced with multi-model AI fallback and Indonesian NLP.
"""

import os
import sys
import json
import logging
from typing import Dict, List, Optional, Tuple

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

try:
    from utils.ai_provider import ai_provider, generate_json
    from utils.rate_limiter import rate_limiter
    from utils.monitoring import monitor_errors
except ImportError:
    import google.generativeai as genai
    def generate_json(p, s=None):
        model = genai.GenerativeModel('gemini-1.5-flash')
        return json.loads(model.generate_content(p).text)

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# 9 Dimensions of PPSDM
DIMENSIONS = {
    'cognitive': {
        'name': 'Kognitif & Akademik',
        'description': 'Kemampuan berpikir, belajar, dan pengetahuan akademik',
        'keywords': ['belajar', 'pengetahuan', 'analisis', 'logika', 'riset', 'teknologi', 'sains']
    },
    'self_management': {
        'name': 'Manajemen Diri',
        'description': 'Kemampuan mengatur waktu, produktivitas, dan mencapai tujuan',
        'keywords': ['manajemen waktu', 'produktivitas', 'disiplin', 'fokus', 'target', 'perencanaan']
    },
    'financial': {
        'name': 'Literasi Finansial',
        'description': 'Pemahaman keuangan, investasi, dan pengelolaan uang',
        'keywords': ['keuangan', 'investasi', 'tabungan', 'anggaran', 'bisnis', 'ekonomi']
    },
    'physical': {
        'name': 'Kesehatan Fisik',
        'description': 'Kesehatan tubuh, olahraga, dan gaya hidup sehat',
        'keywords': ['kesehatan', 'olahraga', 'nutrisi', 'tidur', 'kebugaran', 'fisik']
    },
    'emotional': {
        'name': 'Kecerdasan Emosional',
        'description': 'Kemampuan mengelola emosi dan hubungan sosial',
        'keywords': ['emosi', 'empati', 'komunikasi', 'hubungan', 'sosial', 'ekspresi']
    },
    'mental_health': {
        'name': 'Kesehatan Mental',
        'description': 'Kesejahteraan psikologis dan penanganan stres',
        'keywords': ['mental', 'stres', 'kecemasan', 'mindfulness', 'terapi', 'psikologi']
    },
    'character': {
        'name': 'Karakter & Integritas',
        'description': 'Nilai-nilai moral, etika, dan kepemimpinan',
        'keywords': ['karakter', 'integritas', 'jujur', 'etika', 'moral', 'kepemimpinan']
    },
    'spiritual': {
        'name': 'Spiritual',
        'description': 'Keimanan, makna hidup, dan nilai spiritual',
        'keywords': ['spiritual', 'ibadah', 'keimanan', 'makna hidup', 'syukur', 'sabar']
    },
    'environmental': {
        'name': 'Kesadaran Lingkungan',
        'description': 'Kepedulian terhadap lingkungan dan keberlanjutan',
        'keywords': ['lingkungan', 'alam', 'ekologi', 'daur ulang', 'konservasi', 'hijau']
    }
}

CLASSIFICATION_PROMPT = """Analisis konten berikut dan tentukan dimensi pengembangan mahasiswa yang paling relevan.

KONTEN:
{content}

DIMENSI YANG TERSEDIA:
1. cognitive - Kognitif & Akademik (belajar, pengetahuan, riset)
2. self_management - Manajemen Diri (waktu, produktivitas) 
3. financial - Literasi Finansial (keuangan, investasi)
4. physical - Kesehatan Fisik (olahraga, nutrisi)
5. emotional - Kecerdasan Emosional (empati, hubungan)
6. mental_health - Kesehatan Mental (stres, mindfulness)
7. character - Karakter & Integritas (etika, moral)
8. spiritual - Spiritual (keimanan, makna hidup)
9. environmental - Kesadaran Lingkungan (ekologi, konservasi)

Berikan respons dalam format JSON:
{{
    "primary_dimension": "kode_dimensi",
    "secondary_dimension": "kode_dimensi_atau_null",
    "confidence": 0.0-1.0,
    "reasoning": "alasan singkat dalam 1 kalimat"
}}"""


class DimensionClassifier:
    """Classify content into 9 PPSDM dimensions."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.stats = {'processed': 0, 'classified': 0, 'errors': 0}
    
    def _keyword_classify(self, text: str) -> Tuple[str, float]:
        """Fallback keyword-based classification."""
        text_lower = text.lower()
        scores = {}
        
        for dim_key, dim_info in DIMENSIONS.items():
            score = sum(1 for kw in dim_info['keywords'] if kw in text_lower)
            scores[dim_key] = score
        
        best_dim = max(scores, key=scores.get)
        confidence = min(0.9, scores[best_dim] / 10)
        
        return best_dim, confidence
    
    @monitor_errors('dimension_classifier')
    def classify(self, content: str, title: str = "") -> Dict:
        """Classify content into a dimension."""
        rate_limiter.wait('gemini')
        
        text = f"{title}\n\n{content[:3000]}"
        prompt = CLASSIFICATION_PROMPT.format(content=text)
        
        try:
            result = generate_json(prompt)
            
            if result and 'primary_dimension' in result:
                dim = result['primary_dimension']
                # Validate dimension
                if dim in DIMENSIONS:
                    return {
                        'dimension': dim,
                        'secondary': result.get('secondary_dimension'),
                        'confidence': result.get('confidence', 0.7),
                        'reasoning': result.get('reasoning', ''),
                        'method': 'ai'
                    }
        except:
            pass
        
        # Fallback to keywords
        dim, conf = self._keyword_classify(text)
        return {
            'dimension': dim,
            'secondary': None,
            'confidence': conf,
            'reasoning': 'Keyword-based classification',
            'method': 'keyword'
        }
    
    def process_batch(self, limit: int = 20) -> Dict:
        """Process batch of unclassified content."""
        try:
            result = self.supabase.table('raw_materials').select('*').is_(
                'detected_dimension', None
            ).limit(limit).execute()
            
            for row in result.data:
                self.stats['processed'] += 1
                
                classification = self.classify(
                    row.get('content', ''),
                    row.get('title', '')
                )
                
                # Update record
                self.supabase.table('raw_materials').update({
                    'detected_dimension': classification['dimension'],
                    'metadata': {
                        **row.get('metadata', {}),
                        'classification': classification
                    }
                }).eq('id', row['id']).execute()
                
                self.stats['classified'] += 1
                logger.info(f"  → {classification['dimension']} ({classification['confidence']:.0%})")
            
            return self.stats
            
        except Exception as e:
            logger.error(f"Batch processing failed: {e}")
            self.stats['errors'] += 1
            return self.stats
    
    def run(self, limit: int = 20) -> Dict:
        logger.info("=" * 60)
        logger.info("🎯 DIMENSION CLASSIFIER v2.0")
        logger.info("=" * 60)
        
        result = self.process_batch(limit)
        
        logger.info("=" * 60)
        logger.info(f"📊 SUMMARY: {result}")
        return result


def main():
    classifier = DimensionClassifier()
    limit = int(os.environ.get('CLASSIFIER_BATCH_SIZE', '20'))
    classifier.run(limit)


if __name__ == "__main__":
    main()
