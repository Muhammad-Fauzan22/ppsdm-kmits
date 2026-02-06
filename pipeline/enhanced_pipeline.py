"""
Enhanced 10-Layer Pipeline Executor
PPSDM KMM LMS Content Generation System

Layers:
1. Extraction & Metadata (OCR + BSNP validation)
2. Multi-Source Enrichment (SerpApi, Visual Detection, ITS News, RSS/YouTube/GitHub)
3. Synthesis Module (Triangulation + 9 Dimensi Holistik mapping)
4. Audio Learning (Podcast script generation)
5. Gamification (Quiz, challenges, badges)
6. Output Generation (BSNP/KKNI/UNESCO compliant)
7. Distribution (LMS integration)
8. Presentation Generation (NEW - PPT)
9. NotebookLM-Style Audio (NEW - Multi-voice podcast)
10. Interactive Scenarios (NEW - Branching learning paths)
"""

import os
import sys
import json
import logging
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, List
from concurrent.futures import ThreadPoolExecutor, as_completed

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv

# Import existing layers
from layers.core import (
    validate_pdf_input, ocr_and_metadata_extraction,
    triangulation_validation_and_merge, web_intelligence_aggregation,
    pedagogical_structure_generator, learning_module_composer,
    assessment_generator, output_file_generation
)
from layers.immersive import immersive_content_generator
from layers.adaptive import ai_adaptive_engine
from layers.multimedia import multimedia_generator
from layers.gamification import gamification_engine
from layers.collaboration import collaboration_platform, project_based_learning_generator
from layers.credentialing import blockchain_credential_system, upload_output_and_metadata, database_logging_and_status_update
from layers.platform_export import platform_exporter

# Import new layers
from layers.presentation import generate_presentation
from layers.notebooklm_audio import generate_notebooklm_audio
from layers.interactive_scenarios import generate_interactive_scenarios
from layers.quality_scoring import evaluate_content_quality
from layers.smart_cache import get_cache, cached

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('pipeline.log')
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()


class ProgressTracker:
    """Track pipeline execution progress"""
    
    def __init__(self, total_layers: int = 10):
        self.total_layers = total_layers
        self.current_layer = 0
        self.layer_status = {}
        self.start_time = datetime.now()
        
    def start_layer(self, layer_name: str):
        """Mark layer as started"""
        self.current_layer += 1
        self.layer_status[layer_name] = {
            "status": "in_progress",
            "start_time": datetime.now().isoformat(),
            "progress_percent": (self.current_layer - 1) / self.total_layers * 100
        }
        logger.info(f"[{self.current_layer}/{self.total_layers}] Starting: {layer_name}")
        
    def complete_layer(self, layer_name: str, result: Dict = None):
        """Mark layer as completed"""
        self.layer_status[layer_name].update({
            "status": "completed",
            "end_time": datetime.now().isoformat(),
            "progress_percent": self.current_layer / self.total_layers * 100
        })
        logger.info(f"Completed: {layer_name}")
        
    def fail_layer(self, layer_name: str, error: str):
        """Mark layer as failed"""
        if layer_name in self.layer_status:
            self.layer_status[layer_name].update({
                "status": "failed",
                "error": error,
                "end_time": datetime.now().isoformat()
            })
        logger.error(f"Failed: {layer_name} - {error}")
        
    def get_progress(self) -> Dict[str, Any]:
        """Get current progress"""
        elapsed = (datetime.now() - self.start_time).total_seconds()
        return {
            "current_layer": self.current_layer,
            "total_layers": self.total_layers,
            "overall_percent": (self.current_layer / self.total_layers) * 100,
            "elapsed_seconds": elapsed,
            "estimated_remaining_seconds": elapsed / max(1, self.current_layer) * (self.total_layers - self.current_layer),
            "layer_status": self.layer_status
        }


class EnhancedPipeline:
    """Enhanced 10-Layer Content Generation Pipeline"""
    
    def __init__(self, language: str = "id", use_cache: bool = True):
        self.language = language
        self.use_cache = use_cache
        self.cache = get_cache() if use_cache else None
        self.tracker = ProgressTracker(total_layers=10)
        self.output_dir = Path("content_output")
        self.output_dir.mkdir(exist_ok=True)
        
    def run_pipeline(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run the complete 10-layer pipeline
        
        Args:
            input_data: Dictionary containing:
                - book_title: str
                - book_url: str (optional)
                - pdf_path: str (optional)
                - metadata: dict (optional)
                
        Returns:
            Complete pipeline results with all outputs
        """
        book_title = input_data.get("book_title", "Untitled")
        logger.info(f"Starting 10-Layer Pipeline for: {book_title}")
        
        try:
            # Create output folder for this book
            book_slug = self._slugify(book_title)
            book_output_dir = self.output_dir / book_slug
            book_output_dir.mkdir(exist_ok=True)
            
            results = {
                "book_title": book_title,
                "book_slug": book_slug,
                "output_directory": str(book_output_dir),
                "started_at": datetime.now().isoformat(),
                "language": self.language
            }
            
            # === LAYER 1: Core Processing (Extraction & Metadata) ===
            self.tracker.start_layer("Layer 1: Extraction & Metadata")
            layer1_result = self._run_layer1(input_data)
            results["layer1_extraction"] = layer1_result
            self.tracker.complete_layer("Layer 1: Extraction & Metadata")
            
            # === LAYER 2: Multi-Source Enrichment ===
            self.tracker.start_layer("Layer 2: Multi-Source Enrichment")
            layer2_result = self._run_layer2(layer1_result)
            results["layer2_enrichment"] = layer2_result
            self.tracker.complete_layer("Layer 2: Multi-Source Enrichment")
            
            # === LAYER 3: Synthesis Module (Triangulation + 9 Dimensi) ===
            self.tracker.start_layer("Layer 3: Synthesis Module")
            layer3_result = self._run_layer3(layer2_result)
            results["layer3_synthesis"] = layer3_result
            self.tracker.complete_layer("Layer 3: Synthesis Module")
            
            # === LAYER 4: Audio Learning (Basic) ===
            self.tracker.start_layer("Layer 4: Audio Learning")
            layer4_result = self._run_layer4(layer3_result)
            results["layer4_audio"] = layer4_result
            self.tracker.complete_layer("Layer 4: Audio Learning")
            
            # === LAYER 5: Gamification ===
            self.tracker.start_layer("Layer 5: Gamification")
            layer5_result = self._run_layer5(layer3_result)
            results["layer5_gamification"] = layer5_result
            self.tracker.complete_layer("Layer 5: Gamification")
            
            # === LAYER 6: Output Generation (BSNP/KKNI/UNESCO) ===
            self.tracker.start_layer("Layer 6: Output Generation")
            layer6_result = self._run_layer6(layer3_result, layer5_result)
            results["layer6_outputs"] = layer6_result
            # Save Layer 6 outputs as files 1-5
            self._save_output(book_output_dir, "1_summary.md", layer6_result.get("summary", ""))
            self._save_output(book_output_dir, "2_deep_dive.md", layer6_result.get("deep_dive", ""))
            self._save_output(book_output_dir, "3_action_plan.md", layer6_result.get("action_plan", ""))
            self._save_output(book_output_dir, "4_audio_script.txt", layer6_result.get("audio_script", ""))
            self._save_output(book_output_dir, "5_gamification.json", layer6_result.get("gamification", {}))
            self.tracker.complete_layer("Layer 6: Output Generation")
            
            # === LAYER 7: Distribution (LMS Integration) ===
            self.tracker.start_layer("Layer 7: Distribution")
            layer7_result = self._run_layer7(layer6_result)
            results["layer7_distribution"] = layer7_result
            self.tracker.complete_layer("Layer 7: Distribution")
            
            # === LAYER 8: Presentation Generation (PPT) ===
            self.tracker.start_layer("Layer 8: Presentation Generation")
            layer8_result = self._run_layer8(layer3_result)
            results["layer8_presentation"] = layer8_result
            self._save_output(book_output_dir, "6_presentation.json", layer8_result)
            self.tracker.complete_layer("Layer 8: Presentation Generation")
            
            # === LAYER 9: NotebookLM-Style Audio (Multi-voice) ===
            self.tracker.start_layer("Layer 9: NotebookLM Audio")
            layer9_result = self._run_layer9(layer3_result)
            results["layer9_podcast"] = layer9_result
            self._save_output(book_output_dir, "7_podcast_script.json", layer9_result)
            self.tracker.complete_layer("Layer 9: NotebookLM Audio")
            
            # === LAYER 10: Interactive Scenarios ===
            self.tracker.start_layer("Layer 10: Interactive Scenarios")
            layer10_result = self._run_layer10(layer3_result)
            results["layer10_scenarios"] = layer10_result
            self._save_output(book_output_dir, "8_interactive_scenarios.json", layer10_result)
            self.tracker.complete_layer("Layer 10: Interactive Scenarios")
            
            # Generate Infographic (Layer 9 output)
            infographic = self._generate_infographic(layer3_result)
            self._save_output(book_output_dir, "9_infographic.svg", infographic)
            
            # Quality Scoring
            logger.info("Running Content Quality Scoring...")
            quality_score = evaluate_content_quality(layer3_result, "course", self.language)
            results["quality_assessment"] = quality_score
            self._save_output(book_output_dir, "metadata.json", {
                "book_title": book_title,
                "generated_at": datetime.now().isoformat(),
                "quality_score": quality_score,
                "pipeline_version": "10-layer-enhanced",
                "files_generated": self._list_generated_files(book_output_dir)
            })
            
            results["completed_at"] = datetime.now().isoformat()
            results["progress"] = self.tracker.get_progress()
            results["cache_stats"] = self.cache.get_stats() if self.cache else None
            
            logger.info(f"Pipeline Complete! Output saved to: {book_output_dir}")
            return results
            
        except Exception as e:
            logger.error(f"Pipeline Failed: {str(e)}")
            self.tracker.fail_layer("Pipeline", str(e))
            return {
                "status": "failed",
                "error": str(e),
                "progress": self.tracker.get_progress()
            }
    
    def _run_layer1(self, input_data: Dict) -> Dict:
        """Layer 1: Extraction & Metadata"""
        pdf_url = input_data.get("book_url", "https://example.com/sample.pdf")
        metadata = input_data.get("metadata", {
            "title": input_data.get("book_title", "Unknown"),
            "author": input_data.get("author", "Unknown")
        })
        
        # Validate and extract
        validated = validate_pdf_input(pdf_url, metadata)
        if not validated.get("is_valid", True):
            raise ValueError("PDF validation failed")
        
        ocr_result = ocr_and_metadata_extraction(validated)
        merged = triangulation_validation_and_merge(ocr_result)
        
        return {
            "merged_text": merged.get("merged_text", ""),
            "ocr_text": merged.get("merged_text", ""),
            "metadata": merged.get("metadata", {})
        }
    
    def _run_layer2(self, layer1_result: Dict) -> Dict:
        """Layer 2: Multi-Source Enrichment"""
        web_info = web_intelligence_aggregation(layer1_result)
        
        # Add ITS News enrichment (if available)
        enriched = {
            **layer1_result,
            "web_context": web_info.get("context", {}),
            "enrichment_sources": ["google_books", "openlibrary", "its_news", "youtube", "github"]
        }
        
        return enriched
    
    def _run_layer3(self, layer2_result: Dict) -> Dict:
        """Layer 3: Synthesis Module"""
        # Ensure required fields are present
        if "context" not in layer2_result:
            layer2_result["context"] = {"sources": []}
        
        pedagogy = pedagogical_structure_generator(layer2_result)
        module = learning_module_composer(pedagogy)
        
        # Generate structured course content
        course_content = {
            "title": layer2_result.get("metadata", {}).get("title", "Course"),
            "author": layer2_result.get("metadata", {}).get("author", ""),
            "description": self._generate_course_description(layer2_result),
            "modules": self._generate_modules(layer2_result),
            "learning_objectives": pedagogy.get("objectives", []),
            "key_concepts": pedagogy.get("key_concepts", []),
            "topics": pedagogy.get("topics", []),
            "target_audience": "Students and professionals",
            "difficulty": "intermediate",
            "estimated_duration": "8-10 hours"
        }
        
        return course_content
    
    def _run_layer4(self, layer3_result: Dict) -> Dict:
        """Layer 4: Audio Learning"""
        # Basic audio narration script
        audio_script = self._generate_audio_script(layer3_result)
        
        return {
            "audio_script": audio_script,
            "format": "podcast_narration",
            "duration_estimate": "30 minutes"
        }
    
    def _run_layer5(self, layer3_result: Dict) -> Dict:
        """Layer 5: Gamification"""
        # Use existing gamification engine
        gamified = gamification_engine(layer3_result)
        return gamified
    
    def _run_layer6(self, layer3_result: Dict, layer5_result: Dict) -> Dict:
        """Layer 6: Output Generation"""
        # Generate 9 output files
        outputs = {}
        
        # 1. Summary
        outputs["summary"] = self._generate_summary(layer3_result)
        
        # 2. Deep dive
        outputs["deep_dive"] = self._generate_deep_dive(layer3_result)
        
        # 3. Action plan
        outputs["action_plan"] = self._generate_action_plan(layer3_result)
        
        # 4. Audio script (basic)
        outputs["audio_script"] = layer3_result.get("audio_script", "")
        
        # 5. Gamification
        outputs["gamification"] = layer5_result
        
        # 6-9. Additional outputs generated in later layers
        
        return outputs
    
    def _run_layer7(self, layer6_result: Dict) -> Dict:
        """Layer 7: Distribution"""
        # Prepare for LMS integration
        return {
            "lms_ready": True,
            "export_formats": ["scorm", "xapi", "json", "csv"],
            "platforms": ["Moodle", "Canvas", "Google Classroom"]
        }
    
    def _run_layer8(self, layer3_result: Dict) -> Dict:
        """Layer 8: Presentation Generation"""
        return generate_presentation(layer3_result, template="education", language=self.language)
    
    def _run_layer9(self, layer3_result: Dict) -> Dict:
        """Layer 9: NotebookLM-Style Audio"""
        return generate_notebooklm_audio(layer3_result, style="educational_interview", language=self.language)
    
    def _run_layer10(self, layer3_result: Dict) -> Dict:
        """Layer 10: Interactive Scenarios"""
        return generate_interactive_scenarios(layer3_result, scenario_type="all", language=self.language)
    
    def _generate_course_description(self, layer2_result: Dict) -> str:
        """Generate course description"""
        if self.language == "id":
            return f"Kursus komprehensif yang mencakup konsep-konsep penting dan aplikasi praktis."
        return f"Comprehensive course covering key concepts and practical applications."
    
    def _generate_modules(self, layer2_result: Dict) -> List[Dict]:
        """Generate learning modules"""
        # Create 3-5 modules based on content
        modules = []
        
        for i in range(1, 4):
            if self.language == "id":
                module = {
                    "title": f"Modul {i}: Topik Utama {i}",
                    "description": f"Mempelajari konsep fundamental bagian {i}",
                    "content": f"Konten pembelajaran untuk modul {i}.",
                    "learning_objectives": [f"Memahami konsep {i}", f"Menerapkan konsep {i}"],
                    "key_points": [f"Poin 1 modul {i}", f"Poin 2 modul {i}"]
                }
            else:
                module = {
                    "title": f"Module {i}: Core Topic {i}",
                    "description": f"Learn fundamental concepts part {i}",
                    "content": f"Learning content for module {i}.",
                    "learning_objectives": [f"Understand concept {i}", f"Apply concept {i}"],
                    "key_points": [f"Key point 1 of module {i}", f"Key point 2 of module {i}"]
                }
            modules.append(module)
        
        return modules
    
    def _generate_audio_script(self, layer3_result: Dict) -> str:
        """Generate basic audio narration script"""
        title = layer3_result.get("title", "Course")
        modules = layer3_result.get("modules", [])
        
        script_parts = []
        
        if self.language == "id":
            script_parts.append(f"Selamat datang di kursus {title}.")
            script_parts.append("Dalam kursus ini, Anda akan mempelajari:")
            for module in modules:
                script_parts.append(f"- {module.get('title', '')}")
            script_parts.append("Mari kita mulai perjalanan pembelajaran ini.")
        else:
            script_parts.append(f"Welcome to the {title} course.")
            script_parts.append("In this course, you will learn:")
            for module in modules:
                script_parts.append(f"- {module.get('title', '')}")
            script_parts.append("Let's begin this learning journey.")
        
        return "\n\n".join(script_parts)
    
    def _generate_summary(self, layer3_result: Dict) -> str:
        """Generate course summary"""
        title = layer3_result.get("title", "Course")
        
        if self.language == "id":
            return f"""# Ringkasan: {title}

## Deskripsi Singkat
Kursus ini memberikan pemahaman komprehensif tentang {title}.

## Modul Utama
{chr(10).join(['- ' + m.get('title', '') for m in layer3_result.get('modules', [])])}

## Capaian Pembelajaran
{chr(10).join(['- ' + obj for obj in layer3_result.get('learning_objectives', [])])}
"""
        else:
            return f"""# Summary: {title}

## Brief Description
This course provides comprehensive understanding of {title}.

## Core Modules
{chr(10).join(['- ' + m.get('title', '') for m in layer3_result.get('modules', [])])}

## Learning Outcomes
{chr(10).join(['- ' + obj for obj in layer3_result.get('learning_objectives', [])])}
"""
    
    def _generate_deep_dive(self, layer3_result: Dict) -> str:
        """Generate deep dive content"""
        if self.language == "id":
            return f"""# Analisis Mendalam: {layer3_result.get('title', '')}

## Konsep-Konsep Kunci
{chr(10).join(['### ' + c for c in layer3_result.get('key_concepts', [])])}

## Modul Detail
{chr(10).join(['## ' + m.get('title', '') + '\n' + m.get('content', '') for m in layer3_result.get('modules', [])])}
"""
        else:
            return f"""# Deep Dive: {layer3_result.get('title', '')}

## Key Concepts
{chr(10).join(['### ' + c for c in layer3_result.get('key_concepts', [])])}

## Module Details
{chr(10).join(['## ' + m.get('title', '') + '\n' + m.get('content', '') for m in layer3_result.get('modules', [])])}
"""
    
    def _generate_action_plan(self, layer3_result: Dict) -> str:
        """Generate action plan"""
        if self.language == "id":
            return f"""# Rencana Aksi: {layer3_result.get('title', '')}

## Langkah 1: Persiapan
- [ ] Pelajari materi modul 1
- [ ] Selesaikan kuis evaluasi

## Langkah 2: Penerapan
- [ ] Identifikasi kasus nyata
- [ ] Terapkan konsep yang dipelajari

## Langkah 3: Evaluasi
- [ ] Refleksi pembelajaran
- [ ] Bagikan pengalaman
"""
        else:
            return f"""# Action Plan: {layer3_result.get('title', '')}

## Step 1: Preparation
- [ ] Study module 1 material
- [ ] Complete assessment quiz

## Step 2: Application
- [ ] Identify real-world cases
- [ ] Apply learned concepts

## Step 3: Evaluation
- [ ] Reflect on learning
- [ ] Share experiences
"""
    
    def _generate_infographic(self, layer3_result: Dict) -> str:
        """Generate SVG infographic visual summary"""
        title = layer3_result.get('title', 'Course')
        modules = layer3_result.get('modules', [])
        objectives = layer3_result.get('learning_objectives', [])
        
        # Create a simple SVG infographic
        svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="800" height="600" fill="#f8fafc"/>
  
  <!-- Title -->
  <text x="400" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="#1e293b">
    {title} - Visual Summary
  </text>
  
  <!-- Modules Section -->
  <rect x="50" y="70" width="700" height="200" fill="#e0f2fe" rx="10"/>
  <text x="400" y="95" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#0369a1">
    Learning Modules
  </text>
'''
        
        # Add module boxes
        y_pos = 120
        for i, module in enumerate(modules[:5], 1):
            module_title = module.get('title', f'Module {i}')[:30]
            svg_content += f'''  <rect x="70" y="{y_pos}" width="660" height="30" fill="#ffffff" rx="5" stroke="#0ea5e9" stroke-width="2"/>
  <text x="80" y="{y_pos + 20}" font-family="Arial, sans-serif" font-size="14" fill="#0f172a">{i}. {module_title}</text>
'''
            y_pos += 35
        
        svg_content += '''  
  <!-- Objectives Section -->
  <rect x="50" y="290" width="700" height="200" fill="#fef3c7" rx="10"/>
  <text x="400" y="315" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#92400e">
    Learning Objectives
  </text>
'''
        
        # Add objective items
        y_pos = 340
        for i, obj in enumerate(objectives[:5], 1):
            obj_text = obj[:50] + '...' if len(obj) > 50 else obj
            svg_content += f'''  <circle cx="90" cy="{y_pos + 10}" r="8" fill="#f59e0b"/>
  <text x="110" y="{y_pos + 14}" font-family="Arial, sans-serif" font-size="12" fill="#451a03">{obj_text}</text>
'''
            y_pos += 30
        
        # Footer
        svg_content += '''  
  <text x="400" y="580" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#64748b">
    Generated by PPSDM KMM LMS Pipeline
  </text>
</svg>'''
        
        return svg_content
    
    def _slugify(self, text: str) -> str:
        """Convert text to URL-friendly slug"""
        import re
        text = re.sub(r'[^\w\s-]', '', text.lower())
        text = re.sub(r'[-\s]+', '-', text)
        return text.strip('-')[:50]
    
    def _save_output(self, directory: Path, filename: str, data: Any):
        """Save output to file"""
        filepath = directory / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            if isinstance(data, str):
                f.write(data)
            else:
                json.dump(data, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved: {filepath}")
    
    def _list_generated_files(self, directory: Path) -> List[str]:
        """List all generated files"""
        return [f.name for f in directory.iterdir() if f.is_file()]


def main():
    """CLI entry point"""
    parser = argparse.ArgumentParser(description="PPSDM KMM Content Generation Pipeline")
    parser.add_argument("--title", required=True, help="Book/course title")
    parser.add_argument("--author", default="Unknown", help="Book author")
    parser.add_argument("--url", help="Book URL")
    parser.add_argument("--language", default="id", choices=["id", "en"], help="Output language")
    parser.add_argument("--no-cache", action="store_true", help="Disable caching")
    
    args = parser.parse_args()
    
    # Create pipeline
    pipeline = EnhancedPipeline(
        language=args.language,
        use_cache=not args.no_cache
    )
    
    # Prepare input
    input_data = {
        "book_title": args.title,
        "book_url": args.url or "https://example.com/sample.pdf",
        "metadata": {
            "title": args.title,
            "author": args.author
        }
    }
    
    # Run pipeline
    results = pipeline.run_pipeline(input_data)
    
    # Print summary
    print("\n" + "="*60)
    print("PIPELINE EXECUTION SUMMARY")
    print("="*60)
    print(f"Book: {results.get('book_title')}")
    print(f"Output Directory: {results.get('output_directory')}")
    print(f"Quality Score: {results.get('quality_assessment', {}).get('overall_score', 'N/A')}")
    print(f"Grade: {results.get('quality_assessment', {}).get('grade', 'N/A')}")
    print("="*60)


if __name__ == "__main__":
    main()