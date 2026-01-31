#!/usr/bin/env python3
"""
Master API Orchestrator - Test all available AI models in parallel
Ensures smooth cooperation between different APIs
"""

import os
import sys
import threading
import time
import json
from datetime import datetime
from dotenv import load_dotenv
from queue import Queue

# Load environment variables
load_dotenv('.env.local')

# Configuration
TESTS = {
    'nemotron': {
        'api_key_env': 'NEMOTRON_API_KEY',
        'model': 'nvidia/nemotron-3-nano-30b-a3b',
        'test_question': 'Which number is larger, 9.11 or 9.8? Explain briefly.',
        'type': 'openai'
    },
    'glm4': {
        'api_key_env': 'NVIDIA_API_KEY_GLM4',
        'model': 'z-ai/glm4.7',
        'test_question': 'What is 15 + 27?',
        'type': 'openai'
    },
    'groq': {
        'api_key_env': 'GROQ_API_KEY',
        'model': 'mixtral-8x7b-32768',
        'test_question': 'What is the capital of France?',
        'type': 'groq'
    },
    'openai': {
        'api_key_env': 'OPENAI_API_KEY',
        'model': 'gpt-4o-mini',
        'test_question': 'Count from 1 to 5.',
        'type': 'openai'
    },
}

results = {}
results_lock = threading.Lock()

def test_nemotron():
    """Test NVIDIA Nemotron"""
    try:
        from openai import OpenAI
        
        api_key = os.getenv('NEMOTRON_API_KEY')
        if not api_key:
            return 'SKIP', 'No API key found'
        
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        
        start = time.time()
        completion = client.chat.completions.create(
            model="nvidia/nemotron-3-nano-30b-a3b",
            messages=[{"role": "user", "content": "Which number is larger, 9.11 or 9.8?"}],
            temperature=0.7,
            max_tokens=256,
            stream=False
        )
        elapsed = time.time() - start
        
        response = completion.choices[0].message.content
        return 'SUCCESS', f'Response in {elapsed:.2f}s: {response[:100]}...'
        
    except Exception as e:
        return 'FAILED', f'{type(e).__name__}: {str(e)[:100]}'

def test_glm4():
    """Test NVIDIA GLM4.7"""
    try:
        from openai import OpenAI
        
        api_key = os.getenv('NVIDIA_API_KEY_GLM4')
        if not api_key:
            return 'SKIP', 'No API key found'
        
        client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        
        start = time.time()
        completion = client.chat.completions.create(
            model="z-ai/glm4.7",
            messages=[{"role": "user", "content": "What is 15 + 27?"}],
            temperature=0.7,
            max_tokens=256,
            stream=False
        )
        elapsed = time.time() - start
        
        response = completion.choices[0].message.content
        return 'SUCCESS', f'Response in {elapsed:.2f}s: {response[:100]}...'
        
    except Exception as e:
        return 'FAILED', f'{type(e).__name__}: {str(e)[:100]}'

def test_groq():
    """Test Groq API"""
    try:
        from groq import Groq
        
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            return 'SKIP', 'No API key found'
        
        client = Groq(api_key=api_key)
        
        start = time.time()
        completion = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": "What is the capital of France?"}],
            temperature=0.7,
            max_tokens=256,
        )
        elapsed = time.time() - start
        
        response = completion.choices[0].message.content
        return 'SUCCESS', f'Response in {elapsed:.2f}s: {response[:100]}...'
        
    except Exception as e:
        return 'FAILED', f'{type(e).__name__}: {str(e)[:100]}'

def test_openai():
    """Test OpenAI API"""
    try:
        from openai import OpenAI
        
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return 'SKIP', 'No API key found'
        
        client = OpenAI(api_key=api_key)
        
        start = time.time()
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Count from 1 to 5."}],
            temperature=0.7,
            max_tokens=256,
        )
        elapsed = time.time() - start
        
        response = completion.choices[0].message.content
        return 'SUCCESS', f'Response in {elapsed:.2f}s: {response[:100]}...'
        
    except Exception as e:
        return 'FAILED', f'{type(e).__name__}: {str(e)[:100]}'

def run_test(test_name, test_func):
    """Run a test and store result"""
    print(f"🔄 Testing {test_name}...")
    status, message = test_func()
    with results_lock:
        results[test_name] = {'status': status, 'message': message}

print("=" * 80)
print("🚀 MASTER API ORCHESTRATOR - Testing All AI Models")
print("=" * 80)
print(f"\n⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Testing {len(['nemotron', 'glm4', 'groq', 'openai'])} APIs in parallel...\n")

# Run all tests in parallel
threads = []
for test_name, test_func in [
    ('nemotron', test_nemotron),
    ('glm4', test_glm4),
    ('groq', test_groq),
    ('openai', test_openai),
]:
    t = threading.Thread(target=run_test, args=(test_name, test_func))
    t.start()
    threads.append(t)

# Wait for all tests to complete
for t in threads:
    t.join()

# Print results
print("\n" + "=" * 80)
print("📊 TEST RESULTS")
print("=" * 80)

successful = []
failed = []

for test_name in ['nemotron', 'glm4', 'groq', 'openai']:
    result = results.get(test_name, {})
    status = result.get('status', 'UNKNOWN')
    message = result.get('message', '')
    
    icon = '✅' if status == 'SUCCESS' else '❌' if status == 'FAILED' else '⏭️'
    print(f"\n{icon} {test_name.upper()}")
    print(f"   Status: {status}")
    print(f"   Details: {message}")
    
    if status == 'SUCCESS':
        successful.append(test_name)
    elif status == 'FAILED':
        failed.append(test_name)

print("\n" + "=" * 80)
print(f"✅ Working: {len(successful)} - {', '.join(successful) if successful else 'None'}")
print(f"❌ Failed: {len(failed)} - {', '.join(failed) if failed else 'None'}")
print("=" * 80)

if successful:
    print(f"\n💡 Recommendation: Use {successful[0]} as primary model")
    print(f"   Can create redundancy with: {', '.join(successful[1:])}")

print(f"\n⏰ Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
