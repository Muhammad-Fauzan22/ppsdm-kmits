#!/usr/bin/env python3
"""
Test script for QWEN AI API
Usage: python test_qwen_api.py "Your question here"
"""

import os
import sys
import requests
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path="../.env.local")

def test_qwen(prompt: str, max_tokens: int = 1024):
    """Test QWEN API with a prompt."""
    api_key = os.getenv("QWEN_API_KEY")
    
    if not api_key:
        print("❌ Error: QWEN_API_KEY not found in environment variables")
        print("Make sure QWEN_API_KEY is set in your .env.local file")
        sys.exit(1)
    
    print(f"🔑 API Key found: {api_key[:10]}...")
    print(f"📝 Prompt: {prompt}")
    print("-" * 50)
    
    url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": "qwen-turbo-latest",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": max_tokens,
        "temperature": 0.7,
        "top_p": 0.9
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("choices") and len(result["choices"]) > 0:
                content = result["choices"][0]["message"]["content"]
                print("✅ QWEN Response:")
                print("=" * 50)
                print(content)
                print("=" * 50)
                print(f"📊 Model: {result.get('model', 'unknown')}")
                print(f"🔢 Tokens used: {result.get('usage', {}).get('total_tokens', 'N/A')}")
                return True
            else:
                print("❌ Error: No content in response")
                return False
        else:
            print(f"❌ Error: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Interactive mode
        print("🤖 QWEN AI Terminal Test")
        print("Enter your prompt (or 'quit' to exit):")
        while True:
            try:
                user_input = input("\n> ")
                if user_input.lower() in ["quit", "exit", "q"]:
                    print("👋 Goodbye!")
                    break
                if user_input.strip():
                    test_qwen(user_input)
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
    else:
        # Command line mode
        prompt = " ".join(sys.argv[1:])
        success = test_qwen(prompt)
        sys.exit(0 if success else 1)
