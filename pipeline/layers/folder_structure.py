import os
from typing import Dict, Any

class AutoFolderManager:
    """Automatically organize input and output files"""
    
    def create_project_structure(self, job_id, book_title):
        """Create organized folder structure for each book"""
        print(f"   [Layer Helper] Creating Auto-Folder Structure for {book_title}...")
        
        sanitized_title = "".join([c for c in book_title if c.isalnum() or c in (' ', '-', '_')]).strip().replace(' ', '_')
        base_path = f"BUKA_BUKU/{job_id}_{sanitized_title}"
        
        structure = {
            "input": {
                "pdf": f"{base_path}/00_INPUT/PDF/{book_title}.pdf",
                "metadata": f"{base_path}/00_INPUT/METADATA/metadata.json",
                "cover_image": f"{base_path}/00_INPUT/IMAGES/cover.jpg"
            },
            "processing": {
                "ocr_raw": f"{base_path}/01_PROCESSING/OCR/raw_results.json",
                "triangulation": f"{base_path}/01_PROCESSING/TRIANGULATION/merged_text.json",
                "web_intel": f"{base_path}/01_PROCESSING/WEB_INTEL/sources.json"
            },
            "output": {
                "learning_module": f"{base_path}/02_OUTPUT/LEARNING_MODULE/",
                "gamification": f"{base_path}/02_OUTPUT/GAMIFICATION/",
                "multimedia": f"{base_path}/02_OUTPUT/MULTIMEDIA/",
                "ai_components": f"{base_path}/02_OUTPUT/AI_COMPANION/",
                "platform_exports": f"{base_path}/02_OUTPUT/PLATFORM_EXPORTS/",
                "certification": f"{base_path}/02_OUTPUT/CERTIFICATION/"
            },
            "documentation": f"{base_path}/03_DOCUMENTATION/"
        }
        
        # In a real scenario, we would os.makedirs() here. 
        # For mock, we just return the structure map.
        
        return structure

    def sanitize_name(self, name):
        return "".join([c for c in name if c.isalnum() or c in (' ', '-', '_')]).strip().replace(' ', '_')

    def create_google_drive_structure(self, structure):
        pass # Mock
