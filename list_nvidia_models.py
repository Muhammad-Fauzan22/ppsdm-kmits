import requests
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv('.env.local')
api_key = os.getenv('NVIDIA_API_KEY')

print("=" * 80)
print("📋 Listing ALL Available Models in NVIDIA API")
print("=" * 80)

headers = {"Authorization": f"Bearer {api_key}"}

try:
    response = requests.get(
        "https://integrate.api.nvidia.com/v1/models",
        headers=headers,
        timeout=15
    )
    
    if response.status_code == 200:
        models = response.json()
        all_models = models.get('data', [])
        
        print(f"\n✓ Total models available: {len(all_models)}\n")
        
        # Group by provider
        providers = {}
        for model in all_models:
            model_id = model.get('id', 'Unknown')
            provider = model_id.split('/')[0] if '/' in model_id else 'other'
            if provider not in providers:
                providers[provider] = []
            providers[provider].append(model_id)
        
        # Print by provider
        for provider in sorted(providers.keys())[:10]:  # First 10 providers
            print(f"\n🏢 {provider.upper()}:")
            for model_id in providers[provider][:5]:  # First 5 models per provider
                print(f"   - {model_id}")
            if len(providers[provider]) > 5:
                print(f"   ... and {len(providers[provider]) - 5} more")
        
        # Check for kimi model specifically
        print(f"\n🔍 Searching for 'kimi' or 'moonshotai' models...")
        kimi_models = [m for m in all_models if 'kimi' in m.get('id', '').lower() or 'moonshotai' in m.get('id', '').lower()]
        if kimi_models:
            print(f"   Found {len(kimi_models)} model(s):")
            for model in kimi_models:
                print(f"   - {model.get('id')}")
        else:
            print(f"   ❌ No Kimi or Moonshotai models found")
            
        # Suggest alternatives
        print(f"\n💡 Recommended models to test:")
        for model in all_models[:5]:
            print(f"   - {model.get('id')}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 80)
