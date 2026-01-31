import requests
import os
from dotenv import load_dotenv
from urllib.parse import urljoin

# Load environment variables
load_dotenv('.env.local')
api_key = os.getenv('NVIDIA_API_KEY')

print("=" * 80)
print("🔍 NVIDIA API Connection Diagnostic")
print("=" * 80)

# Test 1: Basic connectivity
print("\n1️⃣  Testing basic connectivity to NVIDIA...")
try:
    response = requests.get("https://integrate.api.nvidia.com", timeout=10)
    print(f"   ✓ Can reach NVIDIA domain (Status: {response.status_code})")
except Exception as e:
    print(f"   ❌ Cannot reach NVIDIA domain: {e}")
    exit(1)

# Test 2: Check API key validity with simpler request
print("\n2️⃣  Testing API key with status check...")
headers = {"Authorization": f"Bearer {api_key}"}

try:
    # Try different endpoints
    endpoints = [
        "https://integrate.api.nvidia.com/v1/auth/token",
        "https://integrate.api.nvidia.com/v1/models",
        "https://integrate.api.nvidia.com/v1/chat/completions",
    ]
    
    for endpoint in endpoints:
        print(f"\n   Testing: {endpoint}")
        try:
            response = requests.get(endpoint, headers=headers, timeout=10)
            print(f"   Status: {response.status_code}")
            if response.status_code in [200, 405]:  # 405 = Method Not Allowed (GET not supported)
                print(f"   ✓ Endpoint responds (API key appears valid)")
                break
            elif response.status_code == 401:
                print(f"   ❌ Unauthorized - API key might be invalid")
            else:
                print(f"   Response: {response.text[:100]}")
        except requests.exceptions.Timeout:
            print(f"   ⏱️  Timeout")
        except Exception as e:
            print(f"   Error: {e}")
            
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: List available models
print("\n3️⃣  Testing model availability...")
try:
    url = "https://integrate.api.nvidia.com/v1/models"
    response = requests.get(url, headers=headers, timeout=15)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        models = response.json()
        print(f"   ✓ Available models:")
        for model in models.get('data', [])[:5]:
            print(f"      - {model.get('id', 'Unknown')}")
except Exception as e:
    print(f"   Error: {e}")

# Test 4: Simple chat request with minimal params
print("\n4️⃣  Testing minimal chat request...")
try:
    response = requests.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json={
            "model": "moonshotai/kimi-k2.5",
            "messages": [{"role": "user", "content": "Hi"}],
            "max_tokens": 100,
        },
        timeout=120  # 2 minute timeout
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.text[:200]}")
    
except requests.exceptions.Timeout:
    print(f"   ⏱️  Timeout - API server not responding")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 80)
print("Diagnostic complete!")
print("=" * 80)
