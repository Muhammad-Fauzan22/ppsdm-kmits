"""
PDF Factory - Infinite Learning Factory
=======================================
Generates branded PDF workbooks from learning modules.
Uses ReportLab for professional PDF generation.

Features:
- PPSDM KMITS branding
- Table of contents
- Exercises and key takeaways
- Print-friendly format
"""

import os
import sys
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path

# ReportLab for PDF generation
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm, mm
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, PageBreak,
        Table, TableStyle, ListFlowable, ListItem
    )
    from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
except ImportError:
    print("Installing reportlab...")
    os.system(f"{sys.executable} -m pip install reportlab")
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import cm, mm
    from reportlab.lib.colors import HexColor
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, PageBreak,
        Table, TableStyle, ListFlowable, ListItem
    )
    from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.local')

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('pdf_factory.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

# Supabase client
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase credentials!")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Output directory
OUTPUT_DIR = Path("generated_pdfs")
OUTPUT_DIR.mkdir(exist_ok=True)

# Brand colors
BRAND_COLORS = {
    'primary': HexColor('#1E40AF'),      # Blue
    'secondary': HexColor('#059669'),    # Green
    'accent': HexColor('#7C3AED'),       # Purple
    'text': HexColor('#1F2937'),         # Dark gray
    'light_bg': HexColor('#F3F4F6'),     # Light gray
}


def get_custom_styles():
    """Get custom paragraph styles for the PDF."""
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=BRAND_COLORS['primary'],
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Subtitle style
    styles.add(ParagraphStyle(
        name='CustomSubtitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=BRAND_COLORS['text'],
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica',
        leading=20
    ))
    
    # Section heading
    styles.add(ParagraphStyle(
        name='SectionHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=BRAND_COLORS['secondary'],
        spaceBefore=20,
        spaceAfter=10,
        fontName='Helvetica-Bold'
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='BodyText',
        parent=styles['Normal'],
        fontSize=11,
        textColor=BRAND_COLORS['text'],
        alignment=TA_JUSTIFY,
        leading=16,
        spaceBefore=6,
        spaceAfter=6
    ))
    
    # Highlight box
    styles.add(ParagraphStyle(
        name='HighlightBox',
        parent=styles['Normal'],
        fontSize=11,
        textColor=BRAND_COLORS['primary'],
        backColor=BRAND_COLORS['light_bg'],
        borderPadding=10,
        leading=16
    ))
    
    # List item
    styles.add(ParagraphStyle(
        name='ListItem',
        parent=styles['Normal'],
        fontSize=11,
        textColor=BRAND_COLORS['text'],
        leftIndent=20,
        spaceBefore=4,
        spaceAfter=4
    ))
    
    return styles


def build_pdf_content(module: Dict, styles) -> list:
    """Build the PDF content elements from module data."""
    elements = []
    
    title = module.get('title', 'Modul Pembelajaran')
    description = module.get('description', '')
    dimension = module.get('dimension', 'cognitive')
    content = module.get('content', {})
    estimated_minutes = module.get('estimated_minutes', 15)
    
    # Title page
    elements.append(Spacer(1, 3*cm))
    elements.append(Paragraph("PPSDM KMITS", styles['CustomSubtitle']))
    elements.append(Paragraph("📚 Learning Module", styles['CustomSubtitle']))
    elements.append(Spacer(1, 1*cm))
    elements.append(Paragraph(title, styles['CustomTitle']))
    elements.append(Spacer(1, 0.5*cm))
    
    if description:
        elements.append(Paragraph(description, styles['CustomSubtitle']))
    
    elements.append(Spacer(1, 2*cm))
    
    # Module info box
    info_text = f"⏱️ Durasi: {estimated_minutes} menit | 📊 Dimensi: {dimension.replace('_', ' ').title()}"
    elements.append(Paragraph(info_text, styles['HighlightBox']))
    
    elements.append(PageBreak())
    
    # Table of Contents
    elements.append(Paragraph("📋 Daftar Isi", styles['SectionHeading']))
    elements.append(Spacer(1, 0.5*cm))
    
    toc_items = ["1. Pendahuluan", "2. Konsep Kunci", "3. Studi Kasus", "4. Langkah Praktis", "5. Ringkasan"]
    for item in toc_items:
        elements.append(Paragraph(f"• {item}", styles['ListItem']))
    
    elements.append(Spacer(1, 1*cm))
    
    # Learning Objectives
    objectives = content.get('learning_objectives', [])
    if objectives:
        elements.append(Paragraph("🎯 Tujuan Pembelajaran", styles['SectionHeading']))
        for obj in objectives:
            elements.append(Paragraph(f"✓ {obj}", styles['ListItem']))
        elements.append(Spacer(1, 0.5*cm))
    
    # Introduction
    introduction = content.get('introduction', '')
    if introduction:
        elements.append(Paragraph("1. Pendahuluan", styles['SectionHeading']))
        elements.append(Paragraph(introduction, styles['BodyText']))
        elements.append(Spacer(1, 0.5*cm))
    
    # Key Concepts
    concepts = content.get('key_concepts', [])
    if concepts:
        elements.append(Paragraph("2. Konsep Kunci", styles['SectionHeading']))
        
        for i, concept in enumerate(concepts, 1):
            if isinstance(concept, dict):
                concept_title = concept.get('title', f'Konsep {i}')
                explanation = concept.get('explanation', '')
                application = concept.get('application', '')
                
                elements.append(Paragraph(f"<b>{concept_title}</b>", styles['BodyText']))
                if explanation:
                    elements.append(Paragraph(explanation, styles['BodyText']))
                if application:
                    elements.append(Paragraph(f"<i>Aplikasi: {application}</i>", styles['BodyText']))
                elements.append(Spacer(1, 0.3*cm))
    
    # Case Study
    case_study = content.get('case_study', {})
    if isinstance(case_study, dict) and case_study.get('title'):
        elements.append(Paragraph("3. Studi Kasus", styles['SectionHeading']))
        elements.append(Paragraph(f"<b>{case_study.get('title', '')}</b>", styles['BodyText']))
        
        if case_study.get('scenario'):
            elements.append(Paragraph(case_study['scenario'], styles['BodyText']))
        if case_study.get('analysis'):
            elements.append(Paragraph(f"<b>Analisis:</b> {case_study['analysis']}", styles['BodyText']))
        if case_study.get('takeaway'):
            elements.append(Paragraph(f"<b>Kesimpulan:</b> {case_study['takeaway']}", styles['HighlightBox']))
        elements.append(Spacer(1, 0.5*cm))
    
    # Practical Steps
    steps = content.get('practical_steps', [])
    if steps:
        elements.append(Paragraph("4. Langkah Praktis", styles['SectionHeading']))
        for i, step in enumerate(steps, 1):
            elements.append(Paragraph(f"{i}. {step}", styles['ListItem']))
        elements.append(Spacer(1, 0.5*cm))
    
    # Summary
    summary = content.get('summary', '')
    if summary:
        elements.append(Paragraph("5. Ringkasan", styles['SectionHeading']))
        elements.append(Paragraph(summary, styles['HighlightBox']))
    
    # Footer
    elements.append(Spacer(1, 2*cm))
    elements.append(Paragraph("─" * 50, styles['BodyText']))
    footer_text = f"Generated by PPSDM KMITS Learning Factory | {datetime.now().strftime('%d %B %Y')}"
    elements.append(Paragraph(footer_text, styles['CustomSubtitle']))
    
    return elements


def generate_pdf(module: Dict) -> Optional[str]:
    """Generate PDF for a module."""
    module_id = module['id']
    output_path = OUTPUT_DIR / f"{module_id}.pdf"
    
    try:
        styles = get_custom_styles()
        
        doc = SimpleDocTemplate(
            str(output_path),
            pagesize=A4,
            rightMargin=2*cm,
            leftMargin=2*cm,
            topMargin=2*cm,
            bottomMargin=2*cm
        )
        
        elements = build_pdf_content(module, styles)
        doc.build(elements)
        
        return str(output_path)
        
    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        return None


def upload_to_storage(file_path: str, module_id: str) -> Optional[str]:
    """Upload PDF to Supabase Storage."""
    try:
        bucket = 'module-pdfs'
        file_name = f"{module_id}.pdf"
        
        # Check if bucket exists
        try:
            supabase.storage.get_bucket(bucket)
        except:
            supabase.storage.create_bucket(bucket, {'public': True})
        
        # Upload
        with open(file_path, 'rb') as f:
            supabase.storage.from_(bucket).upload(
                file_name,
                f,
                {'content-type': 'application/pdf'}
            )
        
        public_url = supabase.storage.from_(bucket).get_public_url(file_name)
        return public_url
        
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        return None


def save_pdf_format(module_id: str, file_url: str, file_size: int, page_count: int = 1) -> bool:
    """Save PDF format record."""
    try:
        record = {
            'module_id': module_id,
            'format_type': 'pdf',
            'file_url': file_url,
            'file_size_bytes': file_size,
            'page_count': page_count,
            'generator': 'reportlab',
            'mime_type': 'application/pdf'
        }
        
        supabase.table('module_formats').insert(record).execute()
        return True
    except Exception as e:
        logger.error(f"Failed to save format: {e}")
        return False


def get_modules_without_pdf(limit: int = 10) -> list:
    """Get modules without PDF format."""
    try:
        modules_response = supabase.table('learning_modules') \
            .select('id, title, description, dimension, content, estimated_minutes') \
            .limit(limit * 2) \
            .execute()
        
        modules = modules_response.data or []
        
        result = []
        for module in modules:
            existing = supabase.table('module_formats') \
                .select('id') \
                .eq('module_id', module['id']) \
                .eq('format_type', 'pdf') \
                .execute()
            
            if not existing.data:
                result.append(module)
                if len(result) >= limit:
                    break
        
        return result
        
    except Exception as e:
        logger.error(f"Failed to fetch modules: {e}")
        return []


def process_module(module: Dict) -> bool:
    """Process a module to generate PDF."""
    module_id = module['id']
    title = module.get('title', 'Untitled')[:50]
    
    logger.info(f"  📄 Generating PDF: {title}...")
    
    # Generate PDF
    output_path = generate_pdf(module)
    
    if not output_path or not Path(output_path).exists():
        logger.error(f"    ❌ PDF generation failed")
        return False
    
    # Get file info
    file_size = Path(output_path).stat().st_size
    
    # Upload
    file_url = upload_to_storage(output_path, module_id)
    
    if not file_url:
        logger.error(f"    ❌ Upload failed")
        return False
    
    # Save record
    success = save_pdf_format(module_id, file_url, file_size)
    
    if success:
        logger.info(f"    ✅ PDF created ({file_size // 1024}KB)")
        # Cleanup
        try:
            Path(output_path).unlink()
        except:
            pass
        return True
    
    return False


def main():
    """Main entry point."""
    logger.info("🚀 STARTING PDF FACTORY")
    start_time = datetime.utcnow()
    
    limit = int(os.environ.get('PDF_BATCH_SIZE', 10))
    modules = get_modules_without_pdf(limit)
    
    if not modules:
        logger.info("No modules need PDF generation.")
        return
    
    logger.info(f"Found {len(modules)} modules for PDF generation.")
    
    success_count = 0
    
    for module in modules:
        try:
            if process_module(module):
                success_count += 1
        except Exception as e:
            logger.error(f"Module error: {e}")
    
    duration = (datetime.utcnow() - start_time).total_seconds()
    
    logger.info(f"""
╔════════════════════════════════════════╗
║       PDF FACTORY COMPLETE             ║
╠════════════════════════════════════════╣
║ PDFs Created:        {success_count:>16} ║
║ Duration:            {duration:>13.2f}s ║
╚════════════════════════════════════════╝
""")


if __name__ == "__main__":
    main()
