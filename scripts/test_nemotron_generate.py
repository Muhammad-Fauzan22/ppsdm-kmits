#!/usr/bin/env python3
import os, json
from dotenv import load_dotenv
load_dotenv('.env.local')
from openai import OpenAI

key = os.getenv('NEMOTRON_API_KEY') or os.getenv('NVIDIA_API_KEY_GLM4') or os.getenv('NVIDIA_MULTI_API_KEY')
if not key:
    print('No Nemotron key found')
    raise SystemExit(1)

client = OpenAI(base_url='https://integrate.api.nvidia.com/v1', api_key=key)
prompt = '''Write a conversational podcast script between two hosts (Budi and Siti) about "Dasar Kepemimpinan". Return a JSON array where each item is {"speaker": "A|B", "text": "..."}. Keep it ~5-8 minutes spoken length. Tone: academic yet engaging.'''

print('Sending request to Nemotron...')
resp = client.chat.completions.create(model='nvidia/nemotron-3-nano-30b-a3b', messages=[{'role':'user','content':prompt}], max_tokens=2048)

# Try to extract content
out = ''
try:
    out = resp.choices[0].message.content
except Exception:
    try:
        out = resp.choices[0].text
    except Exception:
        out = str(resp)

path = 'scripts/output/Dasar_Kepemimpinan_script_nemotron.json'
os.makedirs('scripts/output', exist_ok=True)
with open(path,'w',encoding='utf-8') as f:
    # attempt to parse JSON from out; if not JSON, wrap as simple alternating lines
    try:
        parsed = json.loads(out)
        json.dump(parsed, f, ensure_ascii=False, indent=2)
    except Exception:
        lines = [l.strip() for l in out.splitlines() if l.strip()]
        arr = []
        s='A'
        for l in lines:
            arr.append({'speaker': s, 'text': l})
            s = 'B' if s=='A' else 'A'
        json.dump(arr, f, ensure_ascii=False, indent=2)

print('✅ Saved Nemotron script to', path)
print('Script content (first 500 chars):')
with open(path,'r',encoding='utf-8') as f:
    content = f.read()
    print(content[:500])
