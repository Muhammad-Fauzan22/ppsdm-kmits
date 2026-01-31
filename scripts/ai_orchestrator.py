#!/usr/bin/env python3
"""
Unified Multi-Model AI System
Primary: NVIDIA Nemotron-3-nano (Fast, reliable)
Fallback: NVIDIA GLM4.7 (Thinking capability)
Strategy: Use both models for maximum capability
"""

import os
import sys
import json
from dotenv import load_dotenv
from openai import OpenAI
from typing import Optional, Tuple
from enum import Enum

load_dotenv('.env.local')

class ModelStrategy(Enum):
    FAST = "fast"          # Use Nemotron (fastest)
    THINKING = "thinking"  # Use GLM4 (extended thinking)
    BOTH = "both"          # Use both models, compare results

class AIOrchestrator:
    def __init__(self):
        self.nemotron_key = os.getenv('NEMOTRON_API_KEY')
        self.glm4_key = os.getenv('NVIDIA_API_KEY_GLM4')
        self.base_url = "https://integrate.api.nvidia.com/v1"
        
        if not self.nemotron_key or not self.glm4_key:
            raise ValueError("Missing required API keys")
    
    def query_nemotron(self, prompt: str, max_tokens: int = 1024) -> Optional[str]:
        """Fast response from Nemotron"""
        try:
            client = OpenAI(base_url=self.base_url, api_key=self.nemotron_key)
            
            completion = client.chat.completions.create(
                model="nvidia/nemotron-3-nano-30b-a3b",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                top_p=0.9,
                max_tokens=max_tokens,
                stream=False
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"⚠️  Nemotron failed: {e}")
            return None
    
    def query_glm4(self, prompt: str, max_tokens: int = 1024, use_thinking: bool = True) -> Optional[str]:
        """Extended thinking response from GLM4"""
        try:
            client = OpenAI(base_url=self.base_url, api_key=self.glm4_key)
            
            extra_body = {}
            if use_thinking:
                extra_body["chat_template_kwargs"] = {
                    "enable_thinking": True,
                    "clear_thinking": False
                }
            
            completion = client.chat.completions.create(
                model="z-ai/glm4.7",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=max_tokens,
                extra_body=extra_body,
                stream=False
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"⚠️  GLM4 failed: {e}")
            return None
    
    def query(self, prompt: str, strategy: ModelStrategy = ModelStrategy.FAST, 
              max_tokens: int = 1024) -> dict:
        """
        Unified query interface
        Returns dict with response(s) and metadata
        """
        result = {
            "prompt": prompt,
            "strategy": strategy.value,
            "responses": {},
            "timestamp": str(os.popen('powershell -c "Get-Date"').read().strip())
        }
        
        if strategy == ModelStrategy.FAST:
            print(f"⚡ Using Nemotron (fast)...")
            response = self.query_nemotron(prompt, max_tokens)
            if response:
                result["responses"]["nemotron"] = response
                result["primary"] = "nemotron"
            else:
                print(f"📌 Falling back to GLM4...")
                response = self.query_glm4(prompt, max_tokens, use_thinking=False)
                if response:
                    result["responses"]["glm4"] = response
                    result["primary"] = "glm4_fallback"
        
        elif strategy == ModelStrategy.THINKING:
            print(f"🧠 Using GLM4 (extended thinking)...")
            response = self.query_glm4(prompt, max_tokens, use_thinking=True)
            if response:
                result["responses"]["glm4"] = response
                result["primary"] = "glm4"
            else:
                print(f"📌 Falling back to Nemotron...")
                response = self.query_nemotron(prompt, max_tokens)
                if response:
                    result["responses"]["nemotron"] = response
                    result["primary"] = "nemotron_fallback"
        
        elif strategy == ModelStrategy.BOTH:
            print(f"🔄 Using both models for comparison...")
            nemotron_response = self.query_nemotron(prompt, max_tokens)
            glm4_response = self.query_glm4(prompt, max_tokens, use_thinking=True)
            
            if nemotron_response:
                result["responses"]["nemotron"] = nemotron_response
            if glm4_response:
                result["responses"]["glm4"] = glm4_response
            
            result["primary"] = "both"
        
        return result

# Example usage
if __name__ == "__main__":
    try:
        print("=" * 80)
        print("🚀 UNIFIED AI ORCHESTRATOR SYSTEM")
        print("=" * 80)
        
        orchestrator = AIOrchestrator()
        
        # Test 1: Fast response
        print("\n1️⃣  FAST MODE (Nemotron)")
        print("-" * 80)
        result = orchestrator.query(
            "Explain quantum computing in 2 sentences",
            strategy=ModelStrategy.FAST
        )
        print(f"\n✓ Primary Model: {result['primary']}")
        for model, response in result['responses'].items():
            print(f"\n{model.upper()}:")
            print(response[:200] + "..." if len(response) > 200 else response)
        
        # Test 2: Thinking response
        print("\n\n2️⃣  THINKING MODE (GLM4)")
        print("-" * 80)
        result = orchestrator.query(
            "Solve: If John has 5 apples and gives 2 to Mary, how many does he have left?",
            strategy=ModelStrategy.THINKING
        )
        print(f"\n✓ Primary Model: {result['primary']}")
        for model, response in result['responses'].items():
            print(f"\n{model.upper()}:")
            print(response[:200] + "..." if len(response) > 200 else response)
        
        # Test 3: Both models for comparison
        print("\n\n3️⃣  COMPARISON MODE (Both Models)")
        print("-" * 80)
        result = orchestrator.query(
            "What is 99 + 1?",
            strategy=ModelStrategy.BOTH,
            max_tokens=256
        )
        print(f"\n✓ Models Used: {len(result['responses'])}")
        for model, response in result['responses'].items():
            print(f"\n{model.upper()}:")
            print(response)
        
        print("\n" + "=" * 80)
        print("✅ ORCHESTRATOR READY FOR PRODUCTION USE")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
