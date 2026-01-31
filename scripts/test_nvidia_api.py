import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

# Get API key from environment
api_key = os.getenv('NVIDIA_API_KEY')

if not api_key:
    print("❌ Error: NVIDIA_API_KEY not found in .env.local")
    exit(1)

print(f"✓ API Key loaded successfully")

invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
stream = False  # Non-streaming untuk test awal

headers = {
    "Authorization": f"Bearer {api_key}",
    "Accept": "application/json"
}

payload = {
    "model": "moonshotai/kimi-k2.5",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 512,
    "temperature": 0.7,
    "top_p": 0.9,
    "stream": False,
}

print("\n📡 Sending request to NVIDIA API (non-streaming)...")
print(f"Model: {payload['model']}")
print(f"Timeout: 60 seconds\n")

try:
    response = requests.post(invoke_url, headers=headers, json=payload, timeout=60)
    
    print(f"Response Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        print("✓ API Connection successful!\n")
        print("=" * 80)
        print("Response:")
        print("-" * 80)
        import json
        result = response.json()
        print(json.dumps(result, indent=2))
        print("-" * 80)
        print("\n✓ API working normally!")
        
    else:
        print(f"❌ API Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.Timeout:
    print("❌ Error: Request timed out after 60 seconds")
    print("   Possible causes:")
    print("   - API server is slow/overloaded")
    print("   - Network connection issue")
    print("   - API key might be invalid")
    
except requests.exceptions.ConnectionError as e:
    print(f"❌ Error: Connection failed")
    print(f"   Details: {str(e)}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {str(e)}")
