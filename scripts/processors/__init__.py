"""
Processors Package - Infinite Learning Factory
===============================================
"""

from .quality_filter import IndonesianQualityFilter, QualityScore
from .plagiarism_checker import PlagiarismChecker, SimilarityResult

__all__ = [
    'IndonesianQualityFilter',
    'QualityScore',
    'PlagiarismChecker',
    'SimilarityResult',
]
