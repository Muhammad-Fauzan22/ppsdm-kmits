"""
Content Quality Scoring Module
Auto-evaluate generated content quality across multiple dimensions
"""

from typing import Dict, Any, List, Tuple
import json
import re


class ContentQualityScorer:
    """
    Evaluate content quality across multiple dimensions:
    - Comprehensiveness
    - Accuracy
    - Pedagogical Value
    - Engagement
    - Language Quality
    - Structure & Organization
    """
    
    DIMENSIONS = {
        "comprehensiveness": {
            "weight": 0.20,
            "description": "Coverage of key topics and concepts"
        },
        "accuracy": {
            "weight": 0.25,
            "description": "Factual correctness and precision"
        },
        "pedagogical_value": {
            "weight": 0.20,
            "description": "Educational effectiveness and learning support"
        },
        "engagement": {
            "weight": 0.15,
            "description": "Ability to maintain learner interest"
        },
        "language_quality": {
            "weight": 0.10,
            "description": "Grammar, clarity, and readability"
        },
        "structure": {
            "weight": 0.10,
            "description": "Logical organization and flow"
        }
    }
    
    def __init__(self, language: str = "id"):
        self.language = language
        
    def score_content(self, content: Dict[str, Any], content_type: str = "course") -> Dict[str, Any]:
        """
        Score generated content across all quality dimensions
        
        Args:
            content: The generated content to evaluate
            content_type: Type of content (course, quiz, scenario, etc.)
            
        Returns:
            Comprehensive quality report
        """
        print(f"   [Quality Scoring] Evaluating {content_type} content...")
        
        scores = {}
        
        # Evaluate each dimension
        scores["comprehensiveness"] = self._score_comprehensiveness(content, content_type)
        scores["accuracy"] = self._score_accuracy(content, content_type)
        scores["pedagogical_value"] = self._score_pedagogical_value(content, content_type)
        scores["engagement"] = self._score_engagement(content, content_type)
        scores["language_quality"] = self._score_language_quality(content, content_type)
        scores["structure"] = self._score_structure(content, content_type)
        
        # Calculate weighted overall score
        overall_score = sum(
            scores[dim]["score"] * self.DIMENSIONS[dim]["weight"]
            for dim in self.DIMENSIONS
        )
        
        # Generate recommendations
        recommendations = self._generate_recommendations(scores)
        
        # Determine quality grade
        grade = self._calculate_grade(overall_score)
        
        return {
            "overall_score": round(overall_score, 2),
            "grade": grade,
            "quality_level": self._get_quality_level(overall_score),
            "dimension_scores": scores,
            "recommendations": recommendations,
            "improvement_areas": self._identify_improvement_areas(scores),
            "strengths": self._identify_strengths(scores),
            "pass_threshold": overall_score >= 70,
            "detailed_analysis": self._generate_detailed_analysis(scores, content)
        }
    
    def _score_comprehensiveness(self, content: Dict, content_type: str) -> Dict:
        """Score content comprehensiveness"""
        score = 70  # Base score
        details = []
        
        # Check for modules/sections
        if "modules" in content:
            module_count = len(content["modules"])
            if module_count >= 5:
                score += 15
                details.append(f"Excellent: {module_count} modules provided")
            elif module_count >= 3:
                score += 10
                details.append(f"Good: {module_count} modules provided")
            else:
                score -= 10
                details.append(f"Needs work: Only {module_count} modules")
        
        # Check for learning objectives
        if "learning_objectives" in content:
            obj_count = len(content["learning_objectives"])
            if obj_count >= 3:
                score += 10
                details.append(f"Clear learning objectives: {obj_count}")
        
        # Check for key concepts
        if "key_concepts" in content:
            concept_count = len(content["key_concepts"])
            if concept_count >= 5:
                score += 5
                details.append(f"Comprehensive key concepts: {concept_count}")
        
        return {"score": min(100, score), "details": details}
    
    def _score_accuracy(self, content: Dict, content_type: str) -> Dict:
        """Score factual accuracy (requires human verification)"""
        score = 75  # Assume reasonable accuracy
        details = []
        
        # Check for citations/references
        content_text = json.dumps(content)
        if "source" in content_text.lower() or "reference" in content_text.lower():
            score += 10
            details.append("Sources/references included")
        
        # Check for specific data points (numbers, dates)
        numbers_found = len(re.findall(r'\d+', content_text))
        if numbers_found > 10:
            details.append(f"Contains {numbers_found} data points - verify accuracy")
        
        # Flag for expert review
        details.append("⚠️ Requires subject matter expert verification")
        
        return {"score": min(100, score), "details": details}
    
    def _score_pedagogical_value(self, content: Dict, content_type: str) -> Dict:
        """Score educational effectiveness"""
        score = 65
        details = []
        
        # Check for Bloom's taxonomy levels
        bloom_indicators = {
            "remember": ["define", "identify", "list", "name"],
            "understand": ["explain", "describe", "summarize", "interpret"],
            "apply": ["apply", "use", "demonstrate", "implement"],
            "analyze": ["analyze", "compare", "contrast", "differentiate"],
            "evaluate": ["evaluate", "assess", "critique", "justify"],
            "create": ["create", "design", "develop", "construct"]
        }
        
        content_text = json.dumps(content).lower()
        bloom_coverage = []
        
        for level, verbs in bloom_indicators.items():
            if any(verb in content_text for verb in verbs):
                bloom_coverage.append(level)
        
        if len(bloom_coverage) >= 4:
            score += 20
            details.append(f"Excellent Bloom's coverage: {', '.join(bloom_coverage)}")
        elif len(bloom_coverage) >= 2:
            score += 10
            details.append(f"Good Bloom's coverage: {', '.join(bloom_coverage)}")
        else:
            details.append("Limited cognitive level variety")
        
        # Check for assessment items
        if "assessments" in content or "questions" in content:
            score += 10
            details.append("Assessment items included")
        
        # Check for practical examples
        if "example" in content_text or "case study" in content_text:
            score += 5
            details.append("Practical examples included")
        
        return {"score": min(100, score), "details": details}
    
    def _score_engagement(self, content: Dict, content_type: str) -> Dict:
        """Score engagement potential"""
        score = 60
        details = []
        
        content_text = json.dumps(content)
        
        # Check for interactive elements
        interactive_elements = ["quiz", "activity", "exercise", "scenario", "game"]
        found_interactive = [e for e in interactive_elements if e in content_text.lower()]
        
        if found_interactive:
            score += 15
            details.append(f"Interactive elements: {', '.join(found_interactive)}")
        
        # Check for multimedia references
        multimedia = ["image", "video", "audio", "animation", "interactive"]
        found_multimedia = [m for m in multimedia if m in content_text.lower()]
        
        if found_multimedia:
            score += 10
            details.append(f"Multimedia elements: {', '.join(found_multimedia)}")
        
        # Check for storytelling elements
        story_indicators = ["story", "scenario", "case", "example", "journey"]
        if any(s in content_text.lower() for s in story_indicators):
            score += 10
            details.append("Narrative elements present")
        
        # Check for gamification
        if "badge" in content_text.lower() or "point" in content_text.lower() or "xp" in content_text.lower():
            score += 5
            details.append("Gamification elements present")
        
        return {"score": min(100, score), "details": details}
    
    def _score_language_quality(self, content: Dict, content_type: str) -> Dict:
        """Score language quality"""
        score = 80
        details = []
        
        content_text = json.dumps(content)
        
        # Check text length (indicates sufficient detail)
        word_count = len(content_text.split())
        if word_count > 1000:
            score += 5
            details.append(f"Substantial content: {word_count} words")
        
        # Check for readability indicators
        avg_sentence_length = word_count / max(1, content_text.count('.') + content_text.count('!') + content_text.count('?'))
        
        if 10 <= avg_sentence_length <= 20:
            score += 5
            details.append(f"Good sentence length: {avg_sentence_length:.1f} words")
        elif avg_sentence_length > 25:
            score -= 5
            details.append(f"Long sentences detected: {avg_sentence_length:.1f} words average")
        
        # Language-specific checks
        if self.language == "id":
            # Check for common Indonesian writing issues
            formal_indicators = ["adalah", "yaitu", "yakni", "dengan demikian"]
            informal_count = sum(1 for w in ["gitu", "gini", "kan", "dong"] if w in content_text.lower())
            if informal_count > 5:
                score -= 10
                details.append(f"Informal language detected ({informal_count} instances)")
        else:
            # English checks
            passive_indicators = ["is done", "was made", "were found", "is being", "has been"]
            passive_count = sum(1 for p in passive_indicators if p in content_text.lower())
            if passive_count > 10:
                details.append(f"Consider reducing passive voice ({passive_count} instances)")
        
        return {"score": min(100, score), "details": details}
    
    def _score_structure(self, content: Dict, content_type: str) -> Dict:
        """Score organization and structure"""
        score = 70
        details = []
        
        # Check for clear hierarchy
        if "modules" in content:
            modules = content["modules"]
            if all("title" in m for m in modules):
                score += 10
                details.append("All modules have titles")
            
            if all("content" in m or "description" in m for m in modules):
                score += 10
                details.append("All modules have content/descriptions")
        
        # Check for logical flow indicators
        flow_words = ["first", "second", "third", "next", "then", "finally", 
                      "pertama", "kedua", "ketiga", "selanjutnya", "terakhir"]
        content_text = json.dumps(content).lower()
        
        found_flow = [w for w in flow_words if w in content_text]
        if found_flow:
            score += 5
            details.append(f"Logical flow indicators: {', '.join(found_flow[:3])}")
        
        # Check for summary/conclusion
        if "summary" in content_text or "conclusion" in content_text or "kesimpulan" in content_text:
            score += 5
            details.append("Summary/conclusion present")
        
        return {"score": min(100, score), "details": details}
    
    def _calculate_grade(self, score: float) -> str:
        """Calculate letter grade"""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def _get_quality_level(self, score: float) -> str:
        """Get quality level description"""
        if score >= 90:
            return "Excellent - Ready for production"
        elif score >= 80:
            return "Good - Minor improvements suggested"
        elif score >= 70:
            return "Acceptable - Some improvements needed"
        elif score >= 60:
            return "Needs Work - Significant improvements required"
        else:
            return "Poor - Major revision needed"
    
    def _generate_recommendations(self, scores: Dict) -> List[str]:
        """Generate improvement recommendations"""
        recommendations = []
        
        # Find lowest scoring dimensions
        sorted_dims = sorted(scores.items(), key=lambda x: x[1]["score"])
        
        for dim, data in sorted_dims[:3]:
            if data["score"] < 70:
                recommendations.append(
                    f"Improve {dim}: {self.DIMENSIONS[dim]['description']} (current: {data['score']})"
                )
        
        return recommendations
    
    def _identify_improvement_areas(self, scores: Dict) -> List[str]:
        """Identify areas needing improvement"""
        areas = []
        for dim, data in scores.items():
            if data["score"] < 70:
                areas.append(dim)
        return areas
    
    def _identify_strengths(self, scores: Dict) -> List[str]:
        """Identify content strengths"""
        strengths = []
        for dim, data in scores.items():
            if data["score"] >= 80:
                strengths.append(dim)
        return strengths
    
    def _generate_detailed_analysis(self, scores: Dict, content: Dict) -> Dict[str, Any]:
        """Generate detailed analysis"""
        return {
            "total_dimensions_evaluated": len(scores),
            "dimensions_above_80": sum(1 for s in scores.values() if s["score"] >= 80),
            "dimensions_below_60": sum(1 for s in scores.values() if s["score"] < 60),
            "average_dimension_score": round(
                sum(s["score"] for s in scores.values()) / len(scores), 2
            ),
            "content_size_bytes": len(json.dumps(content)),
            "evaluation_timestamp": "auto-generated"
        }


# Adapter function
def evaluate_content_quality(content: Dict[str, Any],
                             content_type: str = "course",
                             language: str = "id") -> Dict[str, Any]:
    """
    Evaluate content quality
    
    Args:
        content: Content to evaluate
        content_type: Type of content
        language: Language code
        
    Returns:
        Quality assessment report
    """
    scorer = ContentQualityScorer(language=language)
    return scorer.score_content(content, content_type)


if __name__ == "__main__":
    # Test
    test_content = {
        "title": "Sample Course",
        "modules": [
            {"title": "Module 1", "content": "Content here", "description": "Description"},
            {"title": "Module 2", "content": "Content here", "description": "Description"},
            {"title": "Module 3", "content": "Content here", "description": "Description"}
        ],
        "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
        "key_concepts": ["Concept A", "Concept B", "Concept C", "Concept D", "Concept E"],
        "assessments": [{"question": "Q1"}, {"question": "Q2"}]
    }
    
    result = evaluate_content_quality(test_content, language="en")
    print(f"Overall Score: {result['overall_score']}")
    print(f"Grade: {result['grade']}")
    print(f"Quality Level: {result['quality_level']}")