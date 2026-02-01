#!/usr/bin/env python3
"""
Free OCR Pipeline - Hybrid Tesseract + EasyOCR with Consensus Voting
Implements 100% free OCR using open-source libraries

Author: PPSDM KMM Content Factory
Version: 1.0.0
"""

import os
import re
import logging
from typing import Dict, List, Any, Optional, Tuple, Union
from dataclasses import dataclass, field
from pathlib import Path
from enum import Enum
import io
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OCRProvider(Enum):
    """Available OCR providers"""
    TESSERACT = "tesseract"
    EASYOCR = "easyocr"
    CONSENSUS = "consensus"

@dataclass
class OCRResult:
    """Result from OCR processing"""
    text: str
    confidence: float
    provider: str
    pages: int = 1
    language: str = "eng"
    processing_time_ms: float = 0.0
    blocks: List[Dict] = field(default_factory=list)
    
@dataclass
class TextBlock:
    """A block of text with metadata"""
    text: str
    confidence: float
    bbox: Tuple[int, int, int, int]  # x, y, width, height
    page: int = 1

class FreeOCRPipeline:
    """
    Hybrid OCR Pipeline using Tesseract and EasyOCR
    
    Features:
    - Tesseract 5.0+ with LSTM engine
    - EasyOCR with CNN-based recognition
    - Consensus voting for accuracy
    - OpenCV preprocessing
    - Multi-language support
    - PDF and image support
    """
    
    def __init__(self, 
                 use_tesseract: bool = True,
                 use_easyocr: bool = True,
                 consensus_threshold: float = 0.7,
                 languages: List[str] = None):
        """
        Initialize OCR Pipeline
        
        Args:
            use_tesseract: Enable Tesseract OCR
            use_easyocr: Enable EasyOCR
            consensus_threshold: Minimum confidence for consensus
            languages: List of language codes (e.g., ['eng', 'ind'])
        """
        self.use_tesseract = use_tesseract
        self.use_easyocr = use_easyocr
        self.consensus_threshold = consensus_threshold
        self.languages = languages or ['eng']
        
        # Initialize engines
        self.tesseract_available = False
        self.easyocr_available = False
        self.easyocr_reader = None
        
        self._init_tesseract()
        self._init_easyocr()
        
        logger.info(f"OCR Pipeline initialized:")
        logger.info(f"  - Tesseract: {'✓' if self.tesseract_available else '✗'}")
        logger.info(f"  - EasyOCR: {'✓' if self.easyocr_available else '✗'}")
        logger.info(f"  - Languages: {self.languages}")
    
    def _init_tesseract(self):
        """Initialize Tesseract OCR"""
        if not self.use_tesseract:
            return
        
        try:
            import pytesseract
            from PIL import Image
            
            # Test if tesseract is available
            version = pytesseract.get_tesseract_version()
            logger.info(f"  - Tesseract version: {version}")
            
            self.tesseract_available = True
            self.pytesseract = pytesseract
            self.PILImage = Image
            
        except ImportError as e:
            logger.warning(f"Tesseract not available: {e}")
            self.tesseract_available = False
        except Exception as e:
            logger.warning(f"Tesseract initialization failed: {e}")
            self.tesseract_available = False
    
    def _init_easyocr(self):
        """Initialize EasyOCR"""
        if not self.use_easyocr:
            return
        
        try:
            import easyocr
            
            # Initialize reader with specified languages
            # Note: EasyOCR lazy-loads models on first use
            self.easyocr_reader = easyocr.Reader(
                self.languages,
                gpu=False,  # CPU only for compatibility
                verbose=False
            )
            self.easyocr_available = True
            logger.info(f"  - EasyOCR initialized for languages: {self.languages}")
            
        except ImportError as e:
            logger.warning(f"EasyOCR not available: {e}")
            self.easyocr_available = False
        except Exception as e:
            logger.warning(f"EasyOCR initialization failed: {e}")
            self.easyocr_available = False
    
    async def process_document(self, 
                              file_path: Union[str, Path],
                              preprocessing: bool = True) -> Dict[str, Any]:
        """
        Process a document (PDF or image) with OCR
        
        Args:
            file_path: Path to document
            preprocessing: Apply OpenCV preprocessing
            
        Returns:
            Dictionary with extracted text and metadata
        """
        import time
        start_time = time.time()
        
        file_path = Path(file_path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")
        
        logger.info(f"Processing: {file_path.name}")
        
        # Convert to images if PDF
        if file_path.suffix.lower() == '.pdf':
            images = await self._pdf_to_images(file_path)
        else:
            images = [self._load_image(file_path)]
        
        # Process each page
        all_results = []
        for page_num, image in enumerate(images, 1):
            logger.debug(f"  Processing page {page_num}/{len(images)}")
            
            # Preprocess if enabled
            if preprocessing:
                image = self._preprocess_image(image)
            
            # Run OCR engines
            results = await self._run_ocr_engines(image, page_num)
            all_results.extend(results)
        
        # Apply consensus voting if both engines available
        if len(all_results) > 1:
            final_text, confidence = self._consensus_voting(all_results)
        else:
            final_text = all_results[0].text if all_results else ""
            confidence = all_results[0].confidence if all_results else 0.0
        
        processing_time = (time.time() - start_time) * 1000
        
        return {
            'text': final_text,
            'confidence': confidence,
            'pages': len(images),
            'processing_time_ms': processing_time,
            'engines_used': [r.provider for r in all_results],
            'file_name': file_path.name
        }
    
    async def process_image(self, 
                           image_path: Union[str, Path],
                           preprocessing: bool = True) -> OCRResult:
        """
        Process a single image with OCR
        
        Args:
            image_path: Path to image file
            preprocessing: Apply preprocessing
            
        Returns:
            OCRResult with extracted text
        """
        import time
        start_time = time.time()
        
        image = self._load_image(image_path)
        
        if preprocessing:
            image = self._preprocess_image(image)
        
        results = await self._run_ocr_engines(image, page=1)
        
        if len(results) > 1:
            final_text, confidence = self._consensus_voting(results)
        else:
            final_text = results[0].text if results else ""
            confidence = results[0].confidence if results else 0.0
        
        processing_time = (time.time() - start_time) * 1000
        
        return OCRResult(
            text=final_text,
            confidence=confidence,
            provider="consensus" if len(results) > 1 else (results[0].provider if results else "none"),
            pages=1,
            processing_time_ms=processing_time
        )
    
    async def _run_ocr_engines(self, 
                               image,
                               page: int = 1) -> List[OCRResult]:
        """Run all available OCR engines on an image"""
        results = []
        
        # Run Tesseract
        if self.tesseract_available:
            try:
                result = self._run_tesseract(image, page)
                if result.text.strip():
                    results.append(result)
            except Exception as e:
                logger.warning(f"Tesseract failed: {e}")
        
        # Run EasyOCR
        if self.easyocr_available:
            try:
                result = await self._run_easyocr(image, page)
                if result.text.strip():
                    results.append(result)
            except Exception as e:
                logger.warning(f"EasyOCR failed: {e}")
        
        return results
    
    def _run_tesseract(self, image, page: int = 1) -> OCRResult:
        """Run Tesseract OCR on an image"""
        import pytesseract
        
        # Configure Tesseract
        custom_config = r'--oem 3 --psm 6'
        
        # Get detailed data
        data = pytesseract.image_to_data(
            image,
            config=custom_config,
            output_type=pytesseract.Output.DICT
        )
        
        # Extract text blocks with confidence > 60
        blocks = []
        for i, conf in enumerate(data['conf']):
            if int(conf) > 60 and data['text'][i].strip():
                blocks.append(TextBlock(
                    text=data['text'][i],
                    confidence=float(conf) / 100,
                    bbox=(
                        data['left'][i],
                        data['top'][i],
                        data['width'][i],
                        data['height'][i]
                    ),
                    page=page
                ))
        
        # Get full text
        text = pytesseract.image_to_string(image, config=custom_config)
        
        # Calculate average confidence
        confidences = [b.confidence for b in blocks]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.5
        
        return OCRResult(
            text=text,
            confidence=avg_confidence,
            provider="tesseract",
            pages=1,
            blocks=[{
                'text': b.text,
                'confidence': b.confidence,
                'bbox': b.bbox
            } for b in blocks]
        )
    
    async def _run_easyocr(self, image, page: int = 1) -> OCRResult:
        """Run EasyOCR on an image"""
        import numpy as np
        
        # Convert PIL Image to numpy array
        if hasattr(image, 'convert'):
            image_array = np.array(image)
        else:
            image_array = image
        
        # Run OCR
        results = self.easyocr_reader.readtext(image_array)
        
        # Extract text and confidences
        texts = []
        blocks = []
        
        for detection in results:
            bbox, text, conf = detection
            texts.append(text)
            blocks.append(TextBlock(
                text=text,
                confidence=conf,
                bbox=(
                    int(bbox[0][0]),
                    int(bbox[0][1]),
                    int(bbox[2][0] - bbox[0][0]),
                    int(bbox[2][1] - bbox[0][1])
                ),
                page=page
            ))
        
        full_text = '\n'.join(texts)
        
        # Calculate average confidence
        confidences = [b.confidence for b in blocks]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.5
        
        return OCRResult(
            text=full_text,
            confidence=avg_confidence,
            provider="easyocr",
            pages=1,
            blocks=[{
                'text': b.text,
                'confidence': b.confidence,
                'bbox': b.bbox
            } for b in blocks]
        )
    
    def _consensus_voting(self, results: List[OCRResult]) -> Tuple[str, float]:
        """
        Apply consensus voting between OCR results
        
        Strategy:
        1. Use result with higher confidence if difference is significant
        2. Merge results if confidences are similar
        3. Return combined text with weighted confidence
        """
        if len(results) == 1:
            return results[0].text, results[0].confidence
        
        if len(results) == 0:
            return "", 0.0
        
        # Sort by confidence
        sorted_results = sorted(results, key=lambda r: r.confidence, reverse=True)
        best = sorted_results[0]
        second = sorted_results[1] if len(sorted_results) > 1 else None
        
        # If best is significantly better, use it
        if second and best.confidence - second.confidence > 0.2:
            return best.text, best.confidence
        
        # Otherwise, try to merge
        # Simple merge: prefer higher confidence text block by block
        best_lines = best.text.split('\n')
        second_lines = second.text.split('\n') if second else []
        
        merged_lines = []
        max_lines = max(len(best_lines), len(second_lines))
        
        for i in range(max_lines):
            best_line = best_lines[i] if i < len(best_lines) else ""
            second_line = second_lines[i] if i < len(second_lines) else ""
            
            # Use longer line as heuristic for better OCR
            if len(best_line) >= len(second_line):
                merged_lines.append(best_line)
            else:
                merged_lines.append(second_line)
        
        merged_text = '\n'.join(merged_lines)
        
        # Weighted confidence
        weighted_conf = (best.confidence * 0.6) + ((second.confidence if second else 0) * 0.4)
        
        return merged_text, weighted_conf
    
    def _preprocess_image(self, image) -> Any:
        """
        Preprocess image for better OCR using OpenCV
        
        Steps:
        1. Convert to grayscale
        2. Denoise
        3. Apply adaptive thresholding
        4. Deskew if needed
        """
        try:
            import cv2
            import numpy as np
            
            # Convert PIL to OpenCV format
            if hasattr(image, 'convert'):
                img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            else:
                img = image
            
            # Convert to grayscale
            if len(img.shape) == 3:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            else:
                gray = img
            
            # Denoise
            denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
            
            # Apply adaptive thresholding
            thresh = cv2.adaptiveThreshold(
                denoised, 255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                11, 2
            )
            
            # Convert back to PIL for Tesseract compatibility
            return self.PILImage.fromarray(thresh)
            
        except ImportError:
            logger.debug("OpenCV not available, skipping preprocessing")
            return image
        except Exception as e:
            logger.warning(f"Preprocessing failed: {e}")
            return image
    
    async def _pdf_to_images(self, pdf_path: Path) -> List[Any]:
        """Convert PDF to list of PIL Images"""
        try:
            from pdf2image import convert_from_path
            
            images = convert_from_path(
                pdf_path,
                dpi=300,
                fmt='ppm'
            )
            logger.info(f"  Converted PDF to {len(images)} images")
            return images
            
        except ImportError:
            logger.error("pdf2image not installed. Cannot process PDF.")
            raise ImportError("pdf2image required for PDF processing. Install with: pip install pdf2image")
        except Exception as e:
            logger.error(f"PDF conversion failed: {e}")
            raise
    
    def _load_image(self, image_path: Path) -> Any:
        """Load an image file"""
        from PIL import Image
        return Image.open(image_path)
    
    def get_status(self) -> Dict[str, Any]:
        """Get pipeline status"""
        return {
            'tesseract_available': self.tesseract_available,
            'easyocr_available': self.easyocr_available,
            'languages': self.languages,
            'consensus_threshold': self.consensus_threshold,
            'ready': self.tesseract_available or self.easyocr_available
        }


# ==================== UTILITIES ====================

def install_dependencies():
    """Print installation instructions for OCR dependencies"""
    instructions = """
    To use the Free OCR Pipeline, install these dependencies:
    
    1. Tesseract OCR:
       - Ubuntu/Debian: sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-ind
       - macOS: brew install tesseract
       - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
    
    2. Python packages:
       pip install pytesseract Pillow easyocr opencv-python pdf2image
    
    3. Poppler (for PDF processing):
       - Ubuntu/Debian: sudo apt-get install poppler-utils
       - macOS: brew install poppler
       - Windows: Download from https://github.com/oschwartz10612/poppler-windows
    
    4. For GPU acceleration (optional):
       pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    """
    print(instructions)


async def test_ocr():
    """Test OCR pipeline"""
    print("Testing Free OCR Pipeline")
    print("=" * 60)
    
    pipeline = FreeOCRPipeline()
    
    status = pipeline.get_status()
    print(f"\nStatus:")
    print(f"  Tesseract: {'✓ Available' if status['tesseract_available'] else '✗ Not Available'}")
    print(f"  EasyOCR: {'✓ Available' if status['easyocr_available'] else '✗ Not Available'}")
    print(f"  Languages: {', '.join(status['languages'])}")
    
    if not status['ready']:
        print("\n⚠ OCR engines not available. Install dependencies:")
        install_dependencies()
        return
    
    # Create test image with text
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        # Create test image
        img = Image.new('RGB', (400, 100), color='white')
        draw = ImageDraw.Draw(img)
        
        # Try to use a font, fallback to default
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
        except:
            font = ImageFont.load_default()
        
        draw.text((10, 30), "Hello OCR World! 123", fill='black', font=font)
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as f:
            img.save(f.name)
            temp_path = f.name
        
        print(f"\nTesting with sample image...")
        result = await pipeline.process_image(temp_path)
        
        print(f"\nResults:")
        print(f"  Provider: {result.provider}")
        print(f"  Confidence: {result.confidence:.2%}")
        print(f"  Processing Time: {result.processing_time_ms:.0f}ms")
        print(f"  Extracted Text: {result.text.strip()}")
        
        # Cleanup
        os.unlink(temp_path)
        
    except Exception as e:
        print(f"\n✗ Test failed: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 60)


if __name__ == '__main__':
    import asyncio
    asyncio.run(test_ocr())
