"""
Master Orchestrator v2.0 - Infinite Learning Factory
=====================================================
Enhanced with proper error handling and monitoring.
"""

import os
import sys
import time
import logging
import argparse
from datetime import datetime
from typing import Dict, List

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv

load_dotenv('.env.local')
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class Orchestrator:
    """Pipeline orchestrator with phase control."""
    
    def __init__(self):
        self.stats = {
            'start_time': datetime.utcnow().isoformat(),
            'phases_run': [],
            'errors': [],
            'totals': {}
        }
    
    def run_phase(self, phase: str, func, *args, **kwargs) -> Dict:
        """Run a phase with error handling."""
        logger.info(f"\n{'='*60}")
        logger.info(f"🚀 PHASE: {phase}")
        logger.info('='*60)
        
        start = time.time()
        result = {}
        
        try:
            result = func(*args, **kwargs)
            self.stats['phases_run'].append(phase)
            self.stats['totals'][phase] = result
            logger.info(f"✅ {phase} completed in {time.time()-start:.1f}s")
        except Exception as e:
            logger.error(f"❌ {phase} failed: {e}")
            self.stats['errors'].append({'phase': phase, 'error': str(e)})
        
        return result
    
    def harvest(self) -> Dict:
        """Phase 1: Harvest content from all sources."""
        from harvesters import RSSAggregator, YouTubeHarvester, AcademicHarvester
        
        results = {}
        
        # RSS
        try:
            rss = RSSAggregator()
            results['rss'] = rss.run()
        except Exception as e:
            logger.warning(f"RSS harvester error: {e}")
        
        # YouTube
        try:
            yt = YouTubeHarvester()
            results['youtube'] = yt.run(max_videos_per_channel=3)
        except Exception as e:
            logger.warning(f"YouTube harvester error: {e}")
        
        # Academic
        try:
            academic = AcademicHarvester()
            results['academic'] = academic.run()
        except Exception as e:
            logger.warning(f"Academic harvester error: {e}")
        
        return results
    
    def process(self) -> Dict:
        """Phase 2: Process and classify content."""
        from processors import IndonesianQualityFilter, PlagiarismChecker
        from processors.dimension_classifier import DimensionClassifier
        
        results = {}
        
        # Classify dimensions
        try:
            classifier = DimensionClassifier()
            results['classifier'] = classifier.run(limit=30)
        except Exception as e:
            logger.warning(f"Classifier error: {e}")
        
        # Quality filter
        try:
            qf = IndonesianQualityFilter()
            results['quality'] = qf.process_batch(limit=30)
        except Exception as e:
            logger.warning(f"Quality filter error: {e}")
        
        # Plagiarism check
        try:
            pc = PlagiarismChecker()
            pc.load_existing_content(limit=200)
            results['plagiarism'] = pc.get_stats()
        except Exception as e:
            logger.warning(f"Plagiarism checker error: {e}")
        
        return results
    
    def generate(self) -> Dict:
        """Phase 3: Generate learning content."""
        from generators import ModuleGenerator, QuizGenerator, InterventionGenerator
        
        results = {}
        
        # Modules
        try:
            mg = ModuleGenerator()
            results['modules'] = mg.run(limit=5)
        except Exception as e:
            logger.warning(f"Module generator error: {e}")
        
        # Quizzes
        try:
            qg = QuizGenerator()
            results['quizzes'] = qg.run(limit=5)
        except Exception as e:
            logger.warning(f"Quiz generator error: {e}")
        
        # Interventions
        try:
            ig = InterventionGenerator()
            results['interventions'] = ig.run(limit=5)
        except Exception as e:
            logger.warning(f"Intervention generator error: {e}")
        
        return results
    
    def convert(self) -> Dict:
        """Phase 4: Convert to alternative formats."""
        # Import converters if available
        results = {}
        
        try:
            from generators.audio_factory import AudioFactory
            af = AudioFactory()
            results['audio'] = af.run(limit=3)
        except Exception as e:
            logger.warning(f"Audio factory error: {e}")
        
        try:
            from generators.pdf_factory import PDFFactory
            pf = PDFFactory()
            results['pdf'] = pf.run(limit=3)
        except Exception as e:
            logger.warning(f"PDF factory error: {e}")
        
        return results
    
    def run_full_pipeline(self) -> Dict:
        """Run all phases in sequence."""
        logger.info("\n" + "🏭"*30)
        logger.info("INFINITE LEARNING FACTORY v2.0")
        logger.info("🏭"*30 + "\n")
        
        self.run_phase("HARVEST", self.harvest)
        self.run_phase("PROCESS", self.process)
        self.run_phase("GENERATE", self.generate)
        self.run_phase("CONVERT", self.convert)
        
        self.stats['end_time'] = datetime.utcnow().isoformat()
        
        # Summary
        logger.info("\n" + "="*60)
        logger.info("📊 PIPELINE SUMMARY")
        logger.info("="*60)
        logger.info(f"Phases completed: {len(self.stats['phases_run'])}")
        logger.info(f"Errors: {len(self.stats['errors'])}")
        
        return self.stats


def main():
    parser = argparse.ArgumentParser(description='Learning Factory Orchestrator')
    parser.add_argument('--phase', choices=['harvest', 'process', 'generate', 'convert', 'all'],
                       default='all', help='Pipeline phase to run')
    args = parser.parse_args()
    
    orchestrator = Orchestrator()
    
    if args.phase == 'all':
        orchestrator.run_full_pipeline()
    elif args.phase == 'harvest':
        orchestrator.run_phase("HARVEST", orchestrator.harvest)
    elif args.phase == 'process':
        orchestrator.run_phase("PROCESS", orchestrator.process)
    elif args.phase == 'generate':
        orchestrator.run_phase("GENERATE", orchestrator.generate)
    elif args.phase == 'convert':
        orchestrator.run_phase("CONVERT", orchestrator.convert)


if __name__ == "__main__":
    main()
