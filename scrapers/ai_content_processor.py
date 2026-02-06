#!/usr/bin/env python3
"""
AI Content Processor - BERT-based Categorization
===============================================
Uses multilingual BERT to categorize content into 9 PPSDM dimensions.
Implements quality scoring, duplicate detection, and summarization.

Author: PPSDM KMITS LMS
Version: 4.0
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import json
import re
import hashlib
from datetime import datetime
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
import numpy as np

# Try to import ML libraries
try:
    from transformers import pipeline, AutoTokenizer, AutoModel
    import torch
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_ML = True
except ImportError:
    HAS_ML = False
    print("⚠️ ML libraries not installed. Using fallback categorization.")

# Supabase
try:
    from supabase import create_client, Client
    HAS_SUPABASE = True
except ImportError:
    HAS_SUPABASE = False


@dataclass
class ProcessedContent:
    """Content after AI processing"""
    content_id: str
    title: str
    description: str
    dimensions: List[Dict]  # [{dimension, confidence, reason}]
    quality_score: float
    relevance_score: float
    credibility_score: float
    summary: str
    key_takeaways: List[str]
    keywords: List[str]
    is_duplicate: bool
    duplicate_of: Optional[str]
    language: str
    processing_time_ms: int


class AIContentProcessor:
    """
    AI-powered content processor using BERT for:
    - 9-dimension categorization
    - Quality assessment
    - Duplicate detection
    - Summarization
    """
    
    # 9 PPSDM Dimensions with descriptions for BERT
    DIMENSION_DESCRIPTIONS = {
        'cognitive': {
            'keywords': [
                'intellectual', 'knowledge', 'learning', 'education', 'academic',
                'study', 'research', 'analysis', 'critical thinking', 'problem solving',
                'memory', 'concentration', 'focus', 'intelligence', 'wisdom',
                'akademik', 'belajar', 'penelitian', 'analisis', 'berpikir kritis',
                'knowledge management', 'lifelong learning', 'study skills'
            ],
            'description': 'Intellectual development, learning, academic skills, critical thinking'
        },
        'emotional': {
            'keywords': [
                'emotional intelligence', 'EQ', 'feelings', 'empathy', 'self-awareness',
                'mental health', 'stress management', 'anxiety', 'depression',
                'wellbeing', 'mindfulness', 'self-regulation', 'relationships',
                'kesehatan mental', 'stres', 'kecemasan', 'empati', 'kesadaran diri',
                'emotional resilience', 'psychological wellbeing'
            ],
            'description': 'Emotional intelligence, mental health, self-awareness, empathy'
        },
        'spiritual': {
            'keywords': [
                'spiritual', 'religious', 'faith', 'belief', 'prayer', 'meditation',
                'purpose', 'meaning', 'values', 'ethics', 'morality', 'mindfulness',
                'inner peace', 'self-reflection', 'gratitude', 'compassion',
                'spiritualitas', 'keagamaan', 'iman', 'meditasi', 'makna hidup',
                'character', 'virtue', 'integrity'
            ],
            'description': 'Spiritual growth, values, purpose, character development'
        },
        'physical': {
            'keywords': [
                'health', 'fitness', 'exercise', 'sports', 'nutrition', 'diet',
                'wellness', 'medical', 'healthcare', 'workout', 'gym', 'athletic',
                'kesehatan', 'kebugaran', 'olahraga', 'nutrisi', 'diet',
                'physical activity', 'healthy lifestyle', 'preventive care'
            ],
            'description': 'Physical health, fitness, nutrition, sports, wellness'
        },
        'creative': {
            'keywords': [
                'creativity', 'innovation', 'art', 'design', 'music', 'writing',
                'imagination', 'artistic', 'aesthetic', 'original', 'inventive',
                'kreativitas', 'inovasi', 'seni', 'desain', 'musik', 'menulis',
                'creative thinking', 'artistic expression', 'design thinking'
            ],
            'description': 'Creativity, innovation, artistic expression, design thinking'
        },
        'professional': {
            'keywords': [
                'career', 'job', 'work', 'professional', 'industry', 'business',
                'employment', 'skills', 'competency', 'expertise', 'productivity',
                'karir', 'pekerjaan', 'profesional', 'industri', 'bisnis',
                'work ethic', 'professional development', 'career growth'
            ],
            'description': 'Professional skills, career development, work competency'
        },
        'leadership': {
            'keywords': [
                'leadership', 'management', 'teamwork', 'collaboration', 'communication',
                'influence', 'decision making', 'strategic', 'vision', 'motivation',
                'kepemimpinan', 'manajemen', 'kerja sama', 'komunikasi', 'pengaruh',
                'team building', 'conflict resolution', 'negotiation'
            ],
            'description': 'Leadership, management, teamwork, communication skills'
        },
        'financial': {
            'keywords': [
                'finance', 'money', 'investment', 'saving', 'budget', 'economics',
                'financial literacy', 'wealth', 'income', 'expense', 'debt',
                'keuangan', 'uang', 'investasi', 'tabungan', 'anggaran', 'ekonomi',
                'financial planning', 'money management', 'entrepreneurship'
            ],
            'description': 'Financial literacy, money management, investment, budgeting'
        },
        'environmental': {
            'keywords': [
                'environment', 'sustainability', 'ecology', 'green', 'conservation',
                'climate', 'nature', 'pollution', 'recycling', 'renewable',
                'lingkungan', 'keberlanjutan', 'ekologi', 'alam', 'konservasi',
                'sustainable living', 'eco-friendly', 'carbon footprint'
            ],
            'description': 'Environmental awareness, sustainability, eco-friendly living'
        }
    }
    
    def __init__(self, supabase_url: str = None, supabase_key: str = None):
        self.supabase: Optional[Client] = None
        if HAS_SUPABASE and supabase_url and supabase_key:
            try:
                self.supabase = create_client(supabase_url, supabase_key)
            except Exception as e:
                print(f"Supabase connection failed: {e}")
        
        # Initialize ML models if available
        self.classifier = None
        self.summarizer = None
        self.embedding_model = None
        self.tokenizer = None
        
        if HAS_ML:
            self._init_models()
    
    def _init_models(self):
        """Initialize Hugging Face models"""
        try:
            print("🤖 Loading AI models...")
            
            # Multilingual BERT for classification
            self.classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=0 if torch.cuda.is_available() else -1
            )
            
            # Summarization model
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-large-cnn",
                device=0 if torch.cuda.is_available() else -1
            )
            
            # Sentence embeddings for duplicate detection
            self.tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
            self.embedding_model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
            
            print("✅ AI models loaded successfully")
            
        except Exception as e:
            print(f"⚠️ Error loading ML models: {e}")
            self.classifier = None
            self.summarizer = None
    
    def _get_embedding(self, text: str) -> np.ndarray:
        """Get sentence embedding for text"""
        if not self.embedding_model or not self.tokenizer:
            return np.zeros(384)  # Default embedding size
        
        try:
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=512
            )
            
            with torch.no_grad():
                outputs = self.embedding_model(**inputs)
            
            # Mean pooling
            embeddings = outputs.last_hidden_state.mean(dim=1)
            return embeddings.numpy()[0]
            
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return np.zeros(384)
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity between two texts"""
        emb1 = self._get_embedding(text1)
        emb2 = self._get_embedding(text2)
        
        similarity = cosine_similarity([emb1], [emb2])[0][0]
        return float(similarity)
    
    def _check_duplicates(self, content: Dict, existing_content: List[Dict]) -> Tuple[bool, Optional[str]]:
        """Check if content is duplicate of existing content"""
        content_text = f"{content['title']} {content.get('description', '')}"
        content_hash = hashlib.md5(content_text.encode()).hexdigest()
        
        # Check exact hash match
        for existing in existing_content:
            existing_text = f"{existing['title']} {existing.get('description', '')}"
            existing_hash = hashlib.md5(existing_text.encode()).hexdigest()
            
            if content_hash == existing_hash:
                return True, existing['id']
            
            # Check semantic similarity
            if HAS_ML and self.embedding_model:
                similarity = self._calculate_similarity(content_text, existing_text)
                if similarity > 0.85:  # Threshold for duplicates
                    return True, existing['id']
        
        return False, None
    
    def _categorize_dimensions(self, title: str, description: str) -> List[Dict]:
        """Categorize content into 9 dimensions using keyword matching and ML"""
        text = f"{title} {description}".lower()
        dimensions = []
        
        # Keyword-based scoring
        for dimension, data in self.DIMENSION_DESCRIPTIONS.items():
            score = 0
            matched_keywords = []
            
            for keyword in data['keywords']:
                if keyword.lower() in text:
                    score += 1
                    matched_keywords.append(keyword)
            
            if score > 0:
                # Normalize score (max 10 keywords = 100%)
                confidence = min(100, (score / 5) * 100)
                
                dimensions.append({
                    'dimension': dimension,
                    'confidence': round(confidence, 1),
                    'reason': f"Matched keywords: {', '.join(matched_keywords[:3])}",
                    'matched_keywords': matched_keywords
                })
        
        # Sort by confidence
        dimensions.sort(key=lambda x: x['confidence'], reverse=True)
        
        # If no dimensions matched, default to cognitive (academic content)
        if not dimensions:
            dimensions = [{
                'dimension': 'cognitive',
                'confidence': 50.0,
                'reason': 'Default categorization for academic content',
                'matched_keywords': []
            }]
        
        # Use ML classifier if available for top candidates
        if HAS_ML and self.classifier and dimensions:
            top_candidates = [d['dimension'] for d in dimensions[:3]]
            
            try:
                result = self.classifier(
                    text[:1024],  # Truncate for BERT
                    candidate_labels=[self.DIMENSION_DESCRIPTIONS[d]['description'] for d in top_candidates],
                    multi_label=True
                )
                
                # Update confidence scores
                for i, label in enumerate(result['labels']):
                    dim_key = [k for k, v in self.DIMENSION_DESCRIPTIONS.items() if v['description'] == label][0]
                    for dim in dimensions:
                        if dim['dimension'] == dim_key:
                            # Blend keyword and ML scores
                            dim['confidence'] = round(
                                (dim['confidence'] * 0.4 + result['scores'][i] * 100 * 0.6),
                                1
                            )
                            dim['reason'] += f" | ML confidence: {round(result['scores'][i] * 100, 1)}%"
                
            except Exception as e:
                print(f"ML classification error: {e}")
        
        return dimensions[:3]  # Return top 3 dimensions
    
    def _calculate_quality_score(self, content: Dict) -> float:
        """Calculate content quality score (0-100)"""
        score = 50  # Base score
        
        # Title quality
        title = content.get('title', '')
        if len(title) > 20:
            score += 10
        if len(title) > 50:
            score += 10
        
        # Description quality
        description = content.get('description', '')
        if len(description) > 100:
            score += 10
        if len(description) > 500:
            score += 10
        
        # Has media
        if content.get('image_url') or content.get('video_url'):
            score += 10
        
        # Has author
        if content.get('author'):
            score += 5
        
        # Has publish date
        if content.get('publish_date'):
            score += 5
        
        # Source credibility (simplified)
        credible_sources = ['its.ac.id', 'kemdikbud', 'go.id', 'ac.id', 'edu']
        source_url = content.get('source_url', '')
        if any(src in source_url for src in credible_sources):
            score += 10
        
        return min(100, score)
    
    def _calculate_relevance_score(self, content: Dict, dimensions: List[Dict]) -> float:
        """Calculate relevance score for ITS students (0-100)"""
        score = 50  # Base score
        
        # Higher dimension confidence = higher relevance
        if dimensions:
            avg_confidence = sum(d['confidence'] for d in dimensions) / len(dimensions)
            score += avg_confidence * 0.3
        
        # Indonesian content is more relevant
        if content.get('language') == 'id':
            score += 15
        
        # Fresh content is more relevant
        try:
            publish_date = content.get('publish_date')
            if publish_date:
                from datetime import datetime
                pub_date = datetime.fromisoformat(publish_date.replace('Z', '+00:00'))
                days_old = (datetime.now() - pub_date).days
                if days_old < 7:
                    score += 20
                elif days_old < 30:
                    score += 10
        except:
            pass
        
        # Job/internship content is highly relevant
        if content.get('content_type') in ['job', 'internship']:
            score += 15
        
        return min(100, score)
    
    def _generate_summary(self, text: str) -> str:
        """Generate summary using BART"""
        if not self.summarizer or len(text) < 200:
            # Return first 150 chars if no ML or short text
            return text[:150] + "..." if len(text) > 150 else text
        
        try:
            # Truncate for model
            text = text[:1024]
            
            result = self.summarizer(
                text,
                max_length=100,
                min_length=30,
                do_sample=False
            )
            
            return result[0]['summary_text']
            
        except Exception as e:
            print(f"Summarization error: {e}")
            return text[:150] + "..."
    
    def _extract_key_takeaways(self, text: str) -> List[str]:
        """Extract key takeaways from content"""
        takeaways = []
        
        # Simple extraction based on sentence patterns
        sentences = re.split(r'[.!?]+', text)
        
        for sentence in sentences[:10]:  # Check first 10 sentences
            sentence = sentence.strip()
            
            # Look for indicator phrases
            indicators = [
                'penting', 'important', 'key', 'kunci', 'utama', 'main',
                'harus', 'must', 'should', 'perlu', 'need',
                'tips', 'advice', 'saran', 'cara', 'how to',
                'manfaat', 'benefit', 'keuntungan', 'advantage'
            ]
            
            if any(ind in sentence.lower() for ind in indicators) and len(sentence) > 20:
                takeaways.append(sentence)
            
            if len(takeaways) >= 3:
                break
        
        return takeaways[:3]
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract keywords from text"""
        # Simple keyword extraction (in production, use TF-IDF or RAKE)
        words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
        
        # Filter common words
        stopwords = {'yang', 'dan', 'dengan', 'untuk', 'dari', 'pada', 'ini', 'itu',
                     'the', 'and', 'for', 'with', 'from', 'this', 'that', 'have',
                     'akan', 'bisa', 'ada', 'tidak', 'dapat', 'saja', 'karena'}
        
        keywords = [w for w in words if w not in stopwords]
        
        # Get most common
        from collections import Counter
        most_common = Counter(keywords).most_common(10)
        
        return [k[0] for k in most_common]
    
    def process_content(self, content: Dict) -> ProcessedContent:
        """Process a single content item"""
        import time
        start_time = time.time()
        
        # Categorize dimensions
        dimensions = self._categorize_dimensions(
            content.get('title', ''),
            content.get('description', '')
        )
        
        # Calculate scores
        quality_score = self._calculate_quality_score(content)
        relevance_score = self._calculate_relevance_score(content, dimensions)
        
        # Credibility based on source
        credibility_score = 70  # Default
        if 'its.ac.id' in content.get('source_url', ''):
            credibility_score = 95
        elif any(tld in content.get('source_url', '') for tld in ['.ac.id', '.go.id', '.edu']):
            credibility_score = 85
        
        # Generate summary
        full_text = f"{content.get('title', '')} {content.get('description', '')}"
        summary = self._generate_summary(full_text)
        
        # Extract key takeaways
        key_takeaways = self._extract_key_takeaways(full_text)
        
        # Extract keywords
        keywords = self._extract_keywords(full_text)
        
        # Check for duplicates (would need existing content from DB)
        is_duplicate = False
        duplicate_of = None
        
        processing_time = int((time.time() - start_time) * 1000)
        
        return ProcessedContent(
            content_id=content.get('id', ''),
            title=content.get('title', ''),
            description=content.get('description', ''),
            dimensions=dimensions,
            quality_score=round(quality_score, 1),
            relevance_score=round(relevance_score, 1),
            credibility_score=round(credibility_score, 1),
            summary=summary,
            key_takeaways=key_takeaways,
            keywords=keywords,
            is_duplicate=is_duplicate,
            duplicate_of=duplicate_of,
            language=content.get('language', 'id'),
            processing_time_ms=processing_time
        )
    
    def process_batch(self, contents: List[Dict]) -> List[ProcessedContent]:
        """Process multiple content items"""
        results = []
        
        print(f"🔄 Processing {len(contents)} content items...")
        
        for i, content in enumerate(contents, 1):
            try:
                processed = self.process_content(content)
                results.append(processed)
                
                if i % 10 == 0:
                    print(f"  ✅ Processed {i}/{len(contents)} items")
                
            except Exception as e:
                print(f"  ❌ Error processing item {i}: {e}")
                continue
        
        print(f"✅ Batch processing complete: {len(results)} items processed")
        return results
    
    def save_to_supabase(self, processed: ProcessedContent):
        """Save processed content to Supabase"""
        if not self.supabase:
            print("❌ Supabase not configured")
            return False
        
        try:
            # Update content record
            content_update = {
                'quality_score': processed.quality_score,
                'relevance_score': processed.relevance_score,
                'credibility_score': processed.credibility_score,
                'processing_status': 'ready',
                'processed_at': datetime.now().isoformat(),
                'metadata': {
                    'summary': processed.summary,
                    'key_takeaways': processed.key_takeaways,
                    'keywords': processed.keywords,
                    'processing_time_ms': processed.processing_time_ms
                }
            }
            
            self.supabase.table('scraped_content').update(content_update).eq('id', processed.content_id).execute()
            
            # Insert dimension mappings
            for dim in processed.dimensions:
                mapping = {
                    'content_id': processed.content_id,
                    'dimension': dim['dimension'],
                    'confidence': dim['confidence'],
                    'mapped_by': 'ai',
                    'mapping_reason': dim['reason']
                }
                
                # Upsert to handle reprocessing
                self.supabase.table('content_dimension_mapping').upsert(mapping).execute()
            
            return True
            
        except Exception as e:
            print(f"❌ Error saving to Supabase: {e}")
            return False
    
    def get_unprocessed_content(self, limit: int = 100) -> List[Dict]:
        """Fetch unprocessed content from Supabase"""
        if not self.supabase:
            return []
        
        try:
            result = self.supabase.table('scraped_content')\
                .select('*')\
                .eq('processing_status', 'scraped')\
                .limit(limit)\
                .execute()
            
            return result.data or []
            
        except Exception as e:
            print(f"❌ Error fetching unprocessed content: {e}")
            return []


def main():
    """Main execution for testing"""
    # Get Supabase credentials
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    processor = AIContentProcessor(supabase_url, supabase_key)
    
    # Test with sample content
    test_content = {
        'id': 'test_001',
        'title': 'Cara Mengelola Stres dan Kecemasan Selama Ujian',
        'description': '''
        Ujian akhir semester seringkali menjadi sumber stres bagi mahasiswa.
        Artikel ini membahas teknik manajemen stres yang efektif, termasuk
        mindfulness, teknik pernapasan, dan strategi belajar yang sehat.
        Penting untuk menjaga kesehatan mental selama periode ujian.
        ''',
        'source_url': 'https://example.com/article',
        'language': 'id',
        'content_type': 'article'
    }
    
    print("🧪 Testing AI Content Processor...")
    result = processor.process_content(test_content)
    
    print("\n📊 Processing Results:")
    print(f"Title: {result.title}")
    print(f"\nDimensions:")
    for dim in result.dimensions:
        print(f"  - {dim['dimension']}: {dim['confidence']}% ({dim['reason']})")
    print(f"\nQuality Score: {result.quality_score}")
    print(f"Relevance Score: {result.relevance_score}")
    print(f"Credibility Score: {result.credibility_score}")
    print(f"\nSummary: {result.summary}")
    print(f"\nKey Takeaways: {result.key_takeaways}")
    print(f"\nKeywords: {result.keywords}")
    print(f"\nProcessing Time: {result.processing_time_ms}ms")


if __name__ == "__main__":
    main()
