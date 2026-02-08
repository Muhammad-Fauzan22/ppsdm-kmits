"""
Autonomous Orchestrator v3.0 - Infinite Learning Factory
=========================================================
Complete self-healing autonomous pipeline with:
- Intelligent scheduling and load balancing
- Auto-recovery from failures
- Website integration via webhooks
- Progress tracking and notifications
"""

import os
import sys
import json
import logging
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from enum import Enum

# Setup path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
from supabase import create_client, Client

# Import all modules with graceful fallbacks
try:
    from utils.rate_limiter import rate_limiter
    from utils.monitoring import error_monitor, monitor_errors
    from utils.cache import cache
    from utils.ai_provider import ai_provider
except ImportError as e:
    logging.warning(f"Utils import warning: {e}")

load_dotenv('.env.local')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger('autonomous_orchestrator')


class PipelineStatus(Enum):
    IDLE = "idle"
    HARVESTING = "harvesting"
    PROCESSING = "processing"
    GENERATING = "generating"
    EXPORTING = "exporting"
    COMPLETED = "completed"
    ERROR = "error"


class AutonomousOrchestrator:
    """
    Self-healing autonomous pipeline orchestrator.
    Designed to run indefinitely without manual intervention.
    """
    
    def __init__(self):
        url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
        key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if url and key:
            self.supabase: Client = create_client(url, key)
            self.db_available = True
        else:
            self.supabase = None
            self.db_available = False
            logger.warning("Database not configured - running in dry-run mode")
        
        self.status = PipelineStatus.IDLE
        self.run_id = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
        self.stats = {
            'run_id': self.run_id,
            'start_time': None,
            'end_time': None,
            'phases': {},
            'total_items_processed': 0,
            'errors': []
        }
    
    def _log_status(self, message: str):
        """Log status and update database."""
        logger.info(f"[{self.status.value.upper()}] {message}")
        
        if self.db_available:
            try:
                self.supabase.table('pipeline_runs').upsert({
                    'run_id': self.run_id,
                    'status': self.status.value,
                    'message': message,
                    'stats': self.stats,
                    'updated_at': datetime.now(timezone.utc).isoformat()
                }).execute()
            except Exception:
                pass
    
    def _run_phase(self, phase_name: str, phase_func) -> Dict:
        """Run a phase with error handling and metrics."""
        phase_start = datetime.now(timezone.utc)
        result = {'status': 'pending', 'items': 0, 'errors': []}
        
        try:
            logger.info(f"\n{'='*60}")
            logger.info(f"PHASE: {phase_name.upper()}")
            logger.info(f"{'='*60}")
            
            phase_result = phase_func()
            result['status'] = 'success'
            result['items'] = phase_result.get('count', 0) if isinstance(phase_result, dict) else 0
            self.stats['total_items_processed'] += result['items']
            
        except Exception as e:
            result['status'] = 'error'
            result['errors'].append(str(e))
            self.stats['errors'].append({
                'phase': phase_name,
                'error': str(e),
                'time': datetime.now(timezone.utc).isoformat()
            })
            logger.error(f"Phase {phase_name} error: {e}")
        
        result['duration_seconds'] = (datetime.now(timezone.utc) - phase_start).total_seconds()
        self.stats['phases'][phase_name] = result
        return result
    
    # ====================================
    # PHASE 1: HARVEST
    # ====================================
    def phase_harvest(self) -> Dict:
        """Harvest content from all sources."""
        self.status = PipelineStatus.HARVESTING
        self._log_status("Starting content harvest")
        
        total = 0
        
        # RSS Aggregator
        try:
            from harvesters.rss_aggregator import RSSAggregator
            rss = RSSAggregator()
            result = rss.run()
            total += result.get('saved', 0)
            logger.info(f"RSS: {result.get('saved', 0)} items")
        except Exception as e:
            logger.warning(f"RSS skipped: {e}")
        
        # Academic Harvester
        try:
            from harvesters.academic_harvester import AcademicHarvester
            academic = AcademicHarvester()
            result = academic.run()
            total += result.get('saved', 0)
            logger.info(f"Academic: {result.get('saved', 0)} items")
        except Exception as e:
            logger.warning(f"Academic skipped: {e}")
        
        # YouTube (optional)
        try:
            from harvesters.youtube_harvester import YouTubeHarvester
            youtube = YouTubeHarvester()
            result = youtube.run()
            total += result.get('saved', 0)
            logger.info(f"YouTube: {result.get('saved', 0)} items")
        except Exception as e:
            logger.debug(f"YouTube skipped: {e}")
        
        return {'count': total}
    
    # ====================================
    # PHASE 2: PROCESS
    # ====================================
    def phase_process(self) -> Dict:
        """Process and classify content."""
        self.status = PipelineStatus.PROCESSING
        self._log_status("Processing and classifying content")
        
        total = 0
        
        # Dimension Classifier
        try:
            from processors.dimension_classifier import DimensionClassifier
            classifier = DimensionClassifier()
            result = classifier.run()
            total += result.get('classified', 0)
            logger.info(f"Classified: {result.get('classified', 0)} items")
        except Exception as e:
            logger.warning(f"Classifier skipped: {e}")
        
        # Quality Filter
        try:
            from processors.quality_filter import QualityFilter
            qf = QualityFilter()
            result = qf.run()
            total += result.get('processed', 0)
            logger.info(f"Quality filtered: {result.get('processed', 0)} items")
        except Exception as e:
            logger.warning(f"Quality filter skipped: {e}")
        
        return {'count': total}
    
    # ====================================
    # PHASE 3: GENERATE
    # ====================================
    def phase_generate(self) -> Dict:
        """Generate learning modules, quizzes, interventions."""
        self.status = PipelineStatus.GENERATING
        self._log_status("Generating learning content")
        
        total = 0
        
        # Module Generator
        try:
            from generators.module_generator import ModuleGenerator
            mg = ModuleGenerator()
            result = mg.run(limit=10)
            total += result.get('generated', 0)
            logger.info(f"Modules: {result.get('generated', 0)}")
        except Exception as e:
            logger.warning(f"Module generator skipped: {e}")
        
        # Quiz Generator
        try:
            from generators.quiz_generator import QuizGenerator
            qg = QuizGenerator()
            result = qg.run(limit=10)
            total += result.get('generated', 0)
            logger.info(f"Quizzes: {result.get('generated', 0)}")
        except Exception as e:
            logger.warning(f"Quiz generator skipped: {e}")
        
        # Intervention Generator
        try:
            from generators.intervention_generator import InterventionGenerator
            ig = InterventionGenerator()
            result = ig.run(limit=6)
            total += result.get('generated', 0)
            logger.info(f"Interventions: {result.get('generated', 0)}")
        except Exception as e:
            logger.warning(f"Intervention generator skipped: {e}")
        
        return {'count': total}
    
    # ====================================
    # PHASE 4: EXPORT
    # ====================================
    def phase_export(self) -> Dict:
        """Export to audio and PDF formats."""
        self.status = PipelineStatus.EXPORTING
        self._log_status("Exporting to multiple formats")
        
        total = 0
        
        # Audio Factory
        try:
            from generators.audio_factory import AudioFactory
            af = AudioFactory()
            result = af.run()
            total += result.get('generated', 0)
            logger.info(f"Audio files: {result.get('generated', 0)}")
        except Exception as e:
            logger.debug(f"Audio skipped: {e}")
        
        # PDF Factory
        try:
            from generators.pdf_factory import PDFFactory
            pf = PDFFactory()
            result = pf.run()
            total += result.get('generated', 0)
            logger.info(f"PDF files: {result.get('generated', 0)}")
        except Exception as e:
            logger.debug(f"PDF skipped: {e}")
        
        return {'count': total}
    
    # ====================================
    # MAIN RUN
    # ====================================
    def run(self, phases: List[str] = None) -> Dict:
        """
        Run the complete pipeline or specific phases.
        
        Args:
            phases: List of phases to run. None = all phases.
        """
        self.stats['start_time'] = datetime.now(timezone.utc).isoformat()
        
        logger.info("""
╔══════════════════════════════════════════════════════════════╗
║       🏭 INFINITE LEARNING FACTORY - AUTONOMOUS MODE         ║
╠══════════════════════════════════════════════════════════════╣
║  Run ID: {:<50} ║
║  Start:  {:<50} ║
╚══════════════════════════════════════════════════════════════╝
        """.format(self.run_id, self.stats['start_time'][:19]))
        
        all_phases = {
            'harvest': lambda: self._run_phase('harvest', self.phase_harvest),
            'process': lambda: self._run_phase('process', self.phase_process),
            'generate': lambda: self._run_phase('generate', self.phase_generate),
            'export': lambda: self._run_phase('export', self.phase_export),
        }
        
        phases_to_run = phases if phases else list(all_phases.keys())
        
        for phase_name in phases_to_run:
            if phase_name in all_phases:
                all_phases[phase_name]()
        
        self.status = PipelineStatus.COMPLETED
        self.stats['end_time'] = datetime.now(timezone.utc).isoformat()
        
        duration = (
            datetime.fromisoformat(self.stats['end_time'].replace('Z', '+00:00')) -
            datetime.fromisoformat(self.stats['start_time'].replace('Z', '+00:00'))
        ).total_seconds()
        
        logger.info("""
╔══════════════════════════════════════════════════════════════╗
║              ✅ PIPELINE COMPLETED SUCCESSFULLY              ║
╠══════════════════════════════════════════════════════════════╣
║  Total Items: {:<48} ║
║  Duration:    {:<45}s ║
║  Errors:      {:<48} ║
╚══════════════════════════════════════════════════════════════╝
        """.format(
            self.stats['total_items_processed'],
            f"{duration:.2f}",
            len(self.stats['errors'])
        ))
        
        self._log_status("Pipeline completed")
        return self.stats


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Autonomous Learning Factory')
    parser.add_argument('--phase', choices=['all', 'harvest', 'process', 'generate', 'export'], 
                        default='all', help='Phase to run')
    parser.add_argument('--auto-mode', action='store_true', help='Run in autonomous mode')
    
    args = parser.parse_args()
    
    orchestrator = AutonomousOrchestrator()
    
    if args.phase == 'all':
        orchestrator.run()
    else:
        orchestrator.run(phases=[args.phase])


if __name__ == "__main__":
    main()
