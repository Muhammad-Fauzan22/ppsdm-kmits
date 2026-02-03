import requests
import os
import sys

# Ambil API Key dari environment variable
api_key = os.getenv("NVIDIA_API_KEY")

def tanya_kimi(prompt):
    invoke_url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "moonshotai/kimi-k2.5",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 16384,
        "temperature": 1.0,
        "stream": False,
        "chat_template_kwargs": {"thinking": True}
    }
    
    response = requests.post(invoke_url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        return f"Error: {response.text}"

if __name__ == "__main__":
    # Mengambil input dari argumen terminal atau pipa (pipe)
    user_input = sys.stdin.read() if not sys.stdin.isatty() else " ".join(sys.argv[1:])
    if user_input:
        print(tanya_kimi(user_input))