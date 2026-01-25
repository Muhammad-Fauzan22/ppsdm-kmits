import os
import sys
import json
import logging
from dotenv import load_dotenv

# Add current directory to path so layers can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from layers.core import validate_pdf_input, ocr_and_metadata_extraction, triangulation_validation_and_merge, web_intelligence_aggregation, pedagogical_structure_generator, learning_module_composer, assessment_generator, output_file_generation
from layers.immersive import immersive_content_generator
from layers.adaptive import ai_adaptive_engine
from layers.multimedia import multimedia_generator
from layers.gamification import gamification_engine
from layers.collaboration import collaboration_platform
from layers.credentialing import upload_output_and_metadata, database_logging_and_status_update
from layers.collaboration import project_based_learning_generator
from layers.credentialing import blockchain_credential_system

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

load_dotenv()

def run_pipeline(pdf_url: str, metadata: dict):
    logger.info("🚀 Starting 7-Layer Immersive Learning Pipeline")

    try:
        # --- LAYER 1: Core Processing ---
        logger.info("--- LAYER 1: Core Processing ---")
        
        # 1. Validate PDF Input
        logger.info("1. Validating PDF Input...")
        validated = validate_pdf_input(pdf_url, metadata)
        if not validated["is_valid"]:
            raise Exception("PDF Validation Failed")

        # 2. OCR & Metadata Extraction
        logger.info("2. OCR & Metadata Extraction...")
        ocr_result = ocr_and_metadata_extraction(validated)

        # 3. Triangulation Validation & Merge
        logger.info("3. Triangulation Validation & Merge...")
        ocr_merged = triangulation_validation_and_merge(ocr_result)

        # 4. Web Intelligence Aggregation
        logger.info("4. Web Intelligence Aggregation...")
        web_info = web_intelligence_aggregation(ocr_merged)

        # 5. Pedagogical Structure
        logger.info("5. Pedagogical Structure Generation...")
        pedagogy_struct = pedagogical_structure_generator(web_info)

        # 6. Learning Module Composer
        logger.info("6. Learning Module Composer...")
        module_struct = learning_module_composer(pedagogy_struct)

        # 7. Assessment Generation
        logger.info("7. Assessment Generation...")
        assessment_items = assessment_generator(module_struct)

        # 8. Output File Generation
        logger.info("8. Output File Generation...")
        output_files = output_file_generation(assessment_items)

        # --- LAYER 2: Immersive Content (VR/AR) ---
        logger.info("--- LAYER 2: Immersive Content (VR/AR) ---")
        immersive_assets = immersive_content_generator(output_files)

        # --- LAYER 3: AI Adaptive Engine ---
        logger.info("--- LAYER 3: AI Adaptive Engine ---")
        ai_pathways = ai_adaptive_engine(immersive_assets)

        # --- LAYER 4: Multimedia Generator ---
        logger.info("--- LAYER 4: Multimedia Generator ---")
        multimedia_content = multimedia_generator(ai_pathways)

        # --- LAYER 5: Gamification Engine ---
        logger.info("--- LAYER 5: Gamification Engine ---")
        gamification = gamification_engine(multimedia_content)

        # --- LAYER 6: Collaboration & PBL ---
        logger.info("--- LAYER 6: Collaboration & PBL ---")
        collab_features = collaboration_platform(gamification)
        pbl_assets = project_based_learning_generator(collab_features)

        # --- LAYER 7: Credentialing & Output ---
        logger.info("--- LAYER 7: Credentialing & Output ---")
        credentials = blockchain_credential_system(pbl_assets)
        
        logger.info("Uploading Outputs & Logging...")
        upload_result = upload_output_and_metadata(output_files, credentials)
        db_log = database_logging_and_status_update(upload_result)

        logger.info("✅ Pipeline Completed Successfully!")
        return db_log

    except Exception as e:
        logger.error(f"❌ Pipeline Failed: {str(e)}")
        return {"status": "failed", "error": str(e)}

if __name__ == "__main__":
    # Example Usage
    pdf_url = "https://example.com/sample_book.pdf" 
    metadata = {"title": "Introduction to Quantum Computing", "author": "Dr. Smith"}
    result = run_pipeline(pdf_url, metadata)
    print(json.dumps(result, indent=2))
