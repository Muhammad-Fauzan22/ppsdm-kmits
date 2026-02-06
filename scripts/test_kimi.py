
import requests
import json
import os
import sys

# Force UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

api_key = sys.argv[1] if len(sys.argv) > 1 else os.getenv("NVIDIA_API_KEY")
if not api_key:
    print("No API Key")
    sys.exit(1)

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"

headers = {
  "Authorization": f"Bearer {api_key}",
  "Accept": "text/event-stream"
}

payload = {
  "model": "moonshotai/kimi-k2.5",
  "messages": [{"role":"user","content":"Hello!"}],
  "max_tokens": 100,
  "temperature": 1.00,
  "top_p": 1.00,
  "stream": True
}

print("Sending request to chat/completions...")
try:
    response = requests.post(invoke_url, headers=headers, json=payload, timeout=60, stream=True)
    print(f"Status Code: {response.status_code}")
    for line in response.iter_lines():
        if line:
            print(f"Chunk: {line.decode('utf-8')[:50]}...")
            break # Just need one to prove it works
except Exception as e:
    print(f"Error: {e}")
