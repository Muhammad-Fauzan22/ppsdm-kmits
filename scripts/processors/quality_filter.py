"""
Indonesian Quality Filter - Infinite Learning Factory
======================================================
Enhanced quality filter with Indonesian NLP support.
Includes Sastrawi stemming and Indonesian readability metrics.
"""

import os
import sys
import re
import math
import logging
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

# Indonesian NLP
try:
    from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
    from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
    SASTRAWI_AVAILABLE = True
except ImportError:
    SASTRAWI_AVAILABLE = False

# Language detection
try:
    from langdetect import detect
    LANGDETECT_AVAILABLE = True
except ImportError:
    LANGDETECT_AVAILABLE = False

load_dotenv('.env.local')
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class QualityScore:
    """Quality assessment result."""
    overall_score: float
    readability_score: float
    relevance_score: float
    pedagogical_score: float
    language: str
    word_count: int
    is_acceptable: bool
    details: Dict


# Indonesian educational keywords by dimension
DIMENSION_KEYWORDS = {
    'cognitive': [
        'belajar', 'pengetahuan', 'keterampilan', 'analisis', 'pemahaman',
        'logika', 'berpikir', 'kritis', 'kreatif', 'inovasi', 'riset',
        'penelitian', 'teknologi', 'sains', 'matematika', 'akademik'
    ],
    'self_management': [
        'manajemen', 'waktu', 'produktivitas', 'disiplin', 'fokus',
        'prioritas', 'perencanaan', 'target', 'tujuan', 'motivasi',
        'kebiasaan', 'rutinitas', 'efisiensi', 'organisasi'
    ],
    'financial': [
        'keuangan', 'uang', 'investasi', 'tabungan', 'anggaran',
        'pengeluaran', 'pendapatan', 'bisnis', 'ekonomi', 'wirausaha',
        'modal', 'saham', 'properti', 'aset', 'hutang'
    ],
    'physical': [
        'kesehatan', 'olahraga', 'nutrisi', 'tidur', 'kebugaran',
        'tubuh', 'fisik', 'energi', 'stamina', 'imunitas',
        'pola makan', 'vitamin', 'protein', 'hidup sehat'
    ],
    'emotional': [
        'emosi', 'perasaan', 'empati', 'ekspresi', 'hubungan',
        'komunikasi', 'sosial', 'keluarga', 'teman', 'cinta',
        'marah', 'sedih', 'bahagia', 'kecemasan'
    ],
    'mental_health': [
        'mental', 'psikologi', 'stres', 'depresi', 'kecemasan',
        'terapi', 'mindfulness', 'meditasi', 'relaksasi', 'ketenangan',
        'trauma', 'self-care', 'healing', 'dukungan'
    ],
    'character': [
        'karakter', 'integritas', 'jujur', 'tanggung jawab', 'etika',
        'moral', 'nilai', 'prinsip', 'kepemimpinan', 'teladan',
        'amanah', 'adil', 'bijaksana', 'hormat'
    ],
    'spiritual': [
        'spiritual', 'ibadah', 'doa', 'keimanan', 'agama',
        'tuhan', 'makna hidup', 'tujuan hidup', 'syukur', 'sabar',
        'ikhlas', 'tawakkal', 'keberkahan'
    ],
    'environmental': [
        'lingkungan', 'alam', 'ekologi', 'keberlanjutan', 'daur ulang',
        'sampah', 'polusi', 'konservasi', 'hijau', 'energi terbarukan',
        'iklim', 'bumi', 'hutan', 'laut'
    ]
}

# Indonesian stopwords (common words to ignore)
STOPWORDS_ID = {
    'yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu', 'untuk', 'dengan',
    'pada', 'adalah', 'akan', 'juga', 'atau', 'ada', 'tidak', 'dalam',
    'kita', 'kami', 'mereka', 'bisa', 'dapat', 'lebih', 'sudah', 'telah',
    'saya', 'kamu', 'dia', 'anda', 'oleh', 'sebagai', 'bahwa', 'karena',
    'jika', 'maka', 'sehingga', 'namun', 'tetapi', 'hanya', 'saat', 'ketika'
}


class IndonesianNLP:
    """Indonesian NLP utilities."""
    
    def __init__(self):
        self.stemmer = None
        self.stopword_remover = None
        
        if SASTRAWI_AVAILABLE:
            try:
                self.stemmer = StemmerFactory().createStemmer()
                self.stopword_remover = StopWordRemoverFactory().createStopWordRemover()
                logger.info("Sastrawi initialized")
            except Exception as e:
                logger.warning(f"Sastrawi init failed: {e}")
    
    def stem(self, text: str) -> str:
        """Stem Indonesian text."""
        if self.stemmer:
            return self.stemmer.stem(text)
        return text
    
    def remove_stopwords(self, text: str) -> str:
        """Remove Indonesian stopwords."""
        if self.stopword_remover:
            return self.stopword_remover.remove(text)
        words = text.lower().split()
        return ' '.join(w for w in words if w not in STOPWORDS_ID)
    
    def tokenize(self, text: str) -> List[str]:
        """Tokenize text into words."""
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        return [w for w in text.split() if len(w) > 1]
    
    def count_syllables_id(self, word: str) -> int:
        """Count syllables in Indonesian word."""
        vowels = 'aiueoAIUEO'
        count = sum(1 for char in word if char in vowels)
        return max(1, count)


class IndonesianQualityFilter:
    """Enhanced quality filter with Indonesian support."""
    
    def __init__(self):
        self.supabase: Client = create_client(
            os.environ.get('NEXT_PUBLIC_SUPABASE_URL', ''),
            os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '')
        )
        self.nlp = IndonesianNLP()
        self.min_quality = float(os.environ.get('MIN_QUALITY_SCORE', '0.4'))
        self.stats = {'processed': 0, 'passed': 0, 'rejected': 0}
    
    def detect_language(self, text: str) -> str:
        """Detect content language."""
        if LANGDETECT_AVAILABLE:
            try:
                return detect(text[:1000])
            except:
                pass
        # Simple heuristic
        id_words = {'yang', 'dan', 'untuk', 'dengan', 'adalah', 'dalam'}
        words = set(text.lower().split()[:100])
        if len(words & id_words) > 3:
            return 'id'
        return 'en'
    
    def calc_readability_id(self, text: str) -> float:
        """Calculate Indonesian readability (0-1 scale)."""
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
        
        if not sentences:
            return 0.0
        
        words = self.nlp.tokenize(text)
        if len(words) < 10:
            return 0.0
        
        avg_sentence_len = len(words) / len(sentences)
        total_syllables = sum(self.nlp.count_syllables_id(w) for w in words)
        avg_syllables = total_syllables / len(words)
        
        # Indonesian Flesch-Kincaid adaptation
        # Lower sentence length and syllables = easier to read
        score = 206.835 - (1.015 * avg_sentence_len) - (84.6 * avg_syllables)
        
        # Normalize to 0-1
        return max(0, min(1, score / 100))
    
    def calc_relevance(self, text: str, dimension: Optional[str] = None) -> float:
        """Calculate educational relevance score."""
        words = set(self.nlp.tokenize(text.lower()))
        
        if dimension and dimension in DIMENSION_KEYWORDS:
            keywords = set(DIMENSION_KEYWORDS[dimension])
            matches = len(words & keywords)
            return min(1.0, matches / 5)
        
        # Check all dimensions
        best_score = 0
        for dim_keywords in DIMENSION_KEYWORDS.values():
            matches = len(words & set(dim_keywords))
            score = min(1.0, matches / 5)
            best_score = max(best_score, score)
        
        return best_score
    
    def calc_pedagogical(self, text: str) -> float:
        """Calculate pedagogical value."""
        score = 0.5
        text_lower = text.lower()
        
        # Has structure indicators
        if any(x in text_lower for x in ['langkah', 'cara', 'tips', 'panduan', 'tutorial']):
            score += 0.1
        if any(x in text_lower for x in ['contoh', 'misalnya', 'seperti']):
            score += 0.1
        if any(x in text_lower for x in ['kesimpulan', 'rangkuman', 'pelajaran']):
            score += 0.1
        
        # Has actionable content
        if any(x in text_lower for x in ['lakukan', 'coba', 'praktik', 'latihan']):
            score += 0.1
        
        # Has references
        if any(x in text_lower for x in ['menurut', 'penelitian', 'studi', 'data']):
            score += 0.1
        
        return min(1.0, score)
    
    def assess_quality(self, text: str, dimension: Optional[str] = None) -> QualityScore:
        """Full quality assessment."""
        self.stats['processed'] += 1
        
        lang = self.detect_language(text)
        word_count = len(text.split())
        
        # Calculate scores
        readability = self.calc_readability_id(text)
        relevance = self.calc_relevance(text, dimension)
        pedagogical = self.calc_pedagogical(text)
        
        # Weighted overall score
        overall = (readability * 0.3) + (relevance * 0.4) + (pedagogical * 0.3)
        
        is_acceptable = overall >= self.min_quality and word_count >= 50
        
        if is_acceptable:
            self.stats['passed'] += 1
        else:
            self.stats['rejected'] += 1
        
        return QualityScore(
            overall_score=overall,
            readability_score=readability,
            relevance_score=relevance,
            pedagogical_score=pedagogical,
            language=lang,
            word_count=word_count,
            is_acceptable=is_acceptable,
            details={
                'min_threshold': self.min_quality,
                'dimension': dimension,
                'sastrawi_available': SASTRAWI_AVAILABLE
            }
        )
    
    def process_batch(self, limit: int = 50) -> Dict:
        """Process batch of unfiltered content."""
        try:
            result = self.supabase.table('raw_materials').select('*').eq(
                'is_processed', False
            ).is_('quality_score', 'null').limit(limit).execute()
            
            updated = 0
            for row in result.data:
                content = row.get('content', '')
                dimension = row.get('detected_dimension')
                
                score = self.assess_quality(content, dimension)
                
                # Update record
                self.supabase.table('raw_materials').update({
                    'quality_score': score.overall_score,
                    'is_relevant': score.is_acceptable,
                    'metadata': {
                        **row.get('metadata', {}),
                        'quality_details': {
                            'readability': score.readability_score,
                            'relevance': score.relevance_score,
                            'pedagogical': score.pedagogical_score,
                            'language': score.language
                        }
                    }
                }).eq('id', row['id']).execute()
                
                updated += 1
            
            return {'updated': updated, **self.stats}
            
        except Exception as e:
            logger.error(f"Batch processing failed: {e}")
            return {'error': str(e)}
    
    def get_stats(self) -> Dict:
        return self.stats


def main():
    print("=" * 60)
    print("🇮🇩 INDONESIAN QUALITY FILTER")
    print("=" * 60)
    
    qf = IndonesianQualityFilter()
    
    batch_size = int(os.environ.get('QUALITY_BATCH_SIZE', '50'))
    result = qf.process_batch(batch_size)
    
    print(f"\n📊 Results: {result}")


if __name__ == "__main__":
    main()
