"""Layer 8: Presentation Generation (PPT)"""
from typing import Dict, Any, List
import json
from dataclasses import dataclass, asdict


@dataclass
class SlideContent:
    title: str
    content: List[str]
    layout: str = "title_and_content"
    notes: str = ""


class PresentationGenerator:
    def __init__(self, language: str = "id"):
        self.language = language
        
    def generate_presentation(self, book_content: Dict[str, Any], template: str = "education") -> Dict[str, Any]:
        print(f"   [Layer 8] Generating Presentation (PPT)...")
        
        title = book_content.get("title", "Learning Module")
        modules = book_content.get("modules", [])
        key_concepts = book_content.get("key_concepts", [])
        learning_objectives = book_content.get("learning_objectives", [])
        
        slides = []
        slides.append(self._create_title_slide(title, book_content))
        
        if learning_objectives:
            slides.append(self._create_objectives_slide(learning_objectives))
        
        slides.append(self._create_overview_slide(modules))
        
        for i, module in enumerate(modules, 1):
            slides.extend(self._create_module_slides(module, i))
        
        if key_concepts:
            slides.append(self._create_key_concepts_slide(key_concepts))
        
        slides.append(self._create_activity_slide())
        slides.append(self._create_summary_slide(learning_objectives))
        slides.append(self._create_closing_slide())
        
        return {
            "title": title,
            "template": template,
            "slides": [asdict(slide) for slide in slides],
            "total_slides": len(slides),
            "estimated_duration": f"{len(slides) * 2} minutes"
        }
    
    def _create_title_slide(self, title: str, book_content: Dict) -> SlideContent:
        author = book_content.get("author", "")
        content = [f"By: {author}"] if author else []
        return SlideContent(title=title, content=content, layout="title_slide")
    
    def _create_objectives_slide(self, objectives: List[str]) -> SlideContent:
        title = "Tujuan Pembelajaran" if self.language == "id" else "Learning Objectives"
        return SlideContent(title=title, content=[f"- {obj}" for obj in objectives[:5]])
    
    def _create_overview_slide(self, modules: List[Dict]) -> SlideContent:
        title = "Agenda" if self.language == "id" else "Overview"
        items = [f"{i+1}. {m.get('title', f'Module {i+1}')}" for i, m in enumerate(modules)]
        return SlideContent(title=title, content=items)
    
    def _create_module_slides(self, module: Dict, num: int) -> List[SlideContent]:
        slides = []
        title = module.get("title", f"Module {num}")
        desc = module.get("description", "")
        content = module.get("content", "")[:300]
        
        slides.append(SlideContent(title=title, content=[desc], layout="section_header"))
        if content:
            slides.append(SlideContent(title=title, content=[content]))
        
        key_points = module.get("key_points", module.get("key_concepts", []))
        if key_points:
            slides.append(SlideContent(
                title="Key Takeaways" if self.language == "en" else "Poin Utama",
                content=[f"- {p}" for p in key_points[:4]]
            ))
        return slides
    
    def _create_key_concepts_slide(self, concepts: List[str]) -> SlideContent:
        title = "Konsep Kunci" if self.language == "id" else "Key Concepts"
        return SlideContent(title=title, content=[f"- {c}" for c in concepts[:6]], layout="two_column")
    
    def _create_activity_slide(self) -> SlideContent:
        title = "Aktivitas & Diskusi" if self.language == "id" else "Activity & Discussion"
        if self.language == "id":
            content = ["Bagaimana menerapkan konsep ini?", "Diskusikan dengan rekan", "Identifikasi contoh nyata"]
        else:
            content = ["How to apply these concepts?", "Discuss with peers", "Identify real examples"]
        return SlideContent(title=title, content=content)
    
    def _create_summary_slide(self, objectives: List[str]) -> SlideContent:
        title = "Ringkasan" if self.language == "id" else "Summary"
        if self.language == "id":
            content = ["Konsep-konsep utama telah dibahas", "Siap untuk implementasi"]
        else:
            content = ["Key concepts covered", "Ready for implementation"]
        return SlideContent(title=title, content=content)
    
    def _create_closing_slide(self) -> SlideContent:
        title = "Terima Kasih" if self.language == "id" else "Thank You"
        content = ["Pertanyaan?" if self.language == "id" else "Questions?", "support@ppsdm-kmm.ac.id"]
        return SlideContent(title=title, content=content, layout="title_slide")


def generate_presentation(book_content: Dict[str, Any], template: str = "education", language: str = "id") -> Dict[str, Any]:
    generator = PresentationGenerator(language=language)
    return generator.generate_presentation(book_content, template)


if __name__ == "__main__":
    test = {"title": "Test Course", "modules": [{"title": "Mod 1", "content": "Test"}], "key_concepts": ["A", "B"], "learning_objectives": ["Obj 1"]}
    print(generate_presentation(test, language="en"))