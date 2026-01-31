#!/usr/bin/env python3
"""Test NVIDIA GLM4.7 model via OpenAI client"""

import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv('.env.local')

api_key = os.getenv('NVIDIA_API_KEY_GLM4')
if not api_key:
    print("❌ Error: NVIDIA_API_KEY_GLM4 not found in .env.local")
    sys.exit(1)

_USE_COLOR = sys.stdout.isatty() and os.getenv("NO_COLOR") is None
_REASONING_COLOR = "\033[90m" if _USE_COLOR else ""
_RESET_COLOR = "\033[0m" if _USE_COLOR else ""

print("=" * 80)
print("🚀 Testing NVIDIA GLM4.7 model")
print("=" * 80)

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=api_key
)

try:
    print("\n📡 Sending request...\n")
    print("-" * 80)
    
    completion = client.chat.completions.create(
        model="z-ai/glm4.7",
        messages=[{"role": "user", "content": "Which number is larger, 9.11 or 9.8?"}],
        temperature=1,
        top_p=1,
        max_tokens=8192,
        extra_body={
            "chat_template_kwargs": {
                "enable_thinking": True,
                "clear_thinking": False
            }
        },
        stream=True
    )
    
    print("Response (with thinking):")
    print("-" * 80)
    
    for chunk in completion:
        if not getattr(chunk, "choices", None):
            continue
        if len(chunk.choices) == 0 or getattr(chunk.choices[0], "delta", None) is None:
            continue
        
        delta = chunk.choices[0].delta
        reasoning = getattr(delta, "reasoning_content", None)
        if reasoning:
            print(f"{_REASONING_COLOR}[THINKING: {reasoning}]{_RESET_COLOR}", end="", flush=True)
        
        if getattr(delta, "content", None) is not None:
            print(delta.content, end="", flush=True)
    
    print("\n" + "-" * 80)
    print("\n✓ Response received successfully!")
    print("=" * 80)
    print("✓ NVIDIA GLM4.7 API is working normally!")
    
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {str(e)}")
    sys.exit(1)
