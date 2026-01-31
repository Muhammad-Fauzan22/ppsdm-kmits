#!/usr/bin/env python3
"""Test NVIDIA Nemotron-3-nano model via OpenAI client"""

import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv('.env.local')

api_key = os.getenv('NVIDIA_API_KEY')
if not api_key:
    print("❌ Error: NVIDIA_API_KEY not found in .env.local")
    sys.exit(1)

_USE_COLOR = sys.stdout.isatty() and os.getenv("NO_COLOR") is None
_REASONING_COLOR = "\033[90m" if _USE_COLOR else ""
_RESET_COLOR = "\033[0m" if _USE_COLOR else ""

print("=" * 80)
print("🚀 Testing NVIDIA Nemotron-3-nano-30b model")
print("=" * 80)

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=api_key
)

try:
    print("\n📡 Sending request...\n")
    print("-" * 80)
    
    completion = client.chat.completions.create(
        model="nvidia/nemotron-3-nano-30b-a3b",
        messages=[{"role": "user", "content": "Which number is larger, 9.11 or 9.8?"}],
        temperature=1,
        top_p=1,
        max_tokens=8192,
        extra_body={
            "reasoning_budget": 16384,
            "chat_template_kwargs": {"enable_thinking": True}
        },
        stream=True
    )
    
    print("Response (with reasoning):")
    print("-" * 80)
    
    for chunk in completion:
        if not chunk.choices:
            continue
        
        reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
        if reasoning:
            print(f"{_REASONING_COLOR}[REASONING: {reasoning}]{_RESET_COLOR}", end="")
        
        if chunk.choices[0].delta.content is not None:
            print(chunk.choices[0].delta.content, end="", flush=True)
    
    print("\n" + "-" * 80)
    print("\n✓ Response received successfully!")
    print("=" * 80)
    print("✓ NVIDIA Nemotron API is working normally!")
    
except Exception as e:
    print(f"\n❌ Error: {type(e).__name__}: {str(e)}")
    sys.exit(1)
