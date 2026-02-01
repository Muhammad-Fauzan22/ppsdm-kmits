#!/usr/bin/env python3
"""
Test script for Grade A Pipeline with Atomic Habits
"""

import os
import sys
import asyncio
from pathlib import Path

# Add project to path
sys.path.insert(0, str(Path(__file__).parent))

# Load environment variables from .env.local
from dotenv import load_dotenv
load_dotenv('.env.local')

from pipeline.grade_a_pipeline import GradeAPipeline

async def main():
    print("=" * 80)
    print("GRADE A PIPELINE TEST - ATOMIC HABITS")
    print("=" * 80)
    
    # Show available API keys
    print("\nAPI Configuration:")
    print(f"  NVIDIA_MISTRAL_API_KEY: {'✓' if os.getenv('NVIDIA_MISTRAL_API_KEY') else '✗'}")
    print(f"  NVIDIA_DEEPSEEK_API_KEY: {'✓' if os.getenv('NVIDIA_DEEPSEEK_API_KEY') else '✗'}")
    print(f"  NVIDIA_STOCKMARK_API_KEY: {'✓' if os.getenv('NVIDIA_STOCKMARK_API_KEY') else '✗'}")
    print(f"  OPENROUTER_API_KEY: {'✓' if os.getenv('OPENROUTER_API_KEY') else '✗'}")
    print(f"  OPENROUTER_PALMYRA_API_KEY: {'✓' if os.getenv('OPENROUTER_PALMYRA_API_KEY') else '✗'}")
    
    # Initialize pipeline
    pipeline = GradeAPipeline(target_quality=90.0, max_iterations=3)
    await pipeline.initialize()
    
    # Run pipeline
    state = await pipeline.execute(
        book_title="Atomic Habits",
        book_author="James Clear"
    )
    
    # Print results
    print("\n" + "=" * 80)
    print("FINAL RESULTS")
    print("=" * 80)
    print(f"Book: {state.book_title}")
    print(f"Quality Score: {state.metrics.overall_score:.1f}/100")
    print(f"Grade: {state.metrics.grade.value}")
    print(f"Target Achieved: {'✓ YES' if state.metrics.overall_score >= 90 else '✗ NO'}")
    print(f"Output Directory: {state.output_dir}")
    print(f"Files Generated: {len(list(state.output_dir.glob('*')))}")
    print("=" * 80)
    
    # Return success if Grade A achieved
    return state.metrics.overall_score >= 90

if __name__ == '__main__':
    try:
        from dotenv import load_dotenv
    except ImportError:
        print("Installing python-dotenv...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "python-dotenv"])
        from dotenv import load_dotenv
    
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
