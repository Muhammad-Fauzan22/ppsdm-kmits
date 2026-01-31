from openai import OpenAI
import os
import time
from dotenv import load_dotenv

load_dotenv('.env.local')

def test_model(name, model_id, api_key_var, base_url="https://integrate.api.nvidia.com/v1"):
    key = os.getenv(api_key_var)
    if not key:
        print(f"❌ {name}: Missing Key ({api_key_var})")
        return

    client = OpenAI(base_url=base_url, api_key=key, timeout=10.0) # 10s timeout
    try:
        print(f"Testing {name}...", end=" ", flush=True)
        start = time.time()
        client.chat.completions.create(
            model=model_id,
            messages=[{"role":"user", "content":"Hi"}],
            max_tokens=1
        )
        print(f"✅ ONLINE ({time.time()-start:.2f}s)")
    except Exception as e:
        print(f"❌ OFFLINE ({e})")

print("--- DIAGNOSTIC START ---")
test_model("Nemotron", "nvidia/nemotron-3-nano-30b-a3b", "NEMOTRON_API_KEY")
test_model("DeepSeek", "deepseek-ai/deepseek-v3.2", "NVIDIA_MULTI_API_KEY")
test_model("Mistral", "mistralai/mistral-large-3-675b-instruct-2512", "NVIDIA_MULTI_API_KEY")
test_model("GLM", "z-ai/glm4.7", "GLM_API_KEY")
print("--- DIAGNOSTIC END ---")
