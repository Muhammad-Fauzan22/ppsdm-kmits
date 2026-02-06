import requests
import json
import os
import re
import time
import google.generativeai as genai
from datetime import datetime

# ================= CONFIGURATION =================
# 1. SETUP KIMI (NVIDIA API)
NVIDIA_API_KEY = "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" # API Key dari Anda
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
KIMI_MODEL = "moonshotai/kimi-k2.5"

# 2. SETUP GEMINI (ARCHITECT)
# Ganti dengan API Key Google Gemini Anda (Gratis di aistudio.google.com)
GEMINI_API_KEY = "MASUKKAN_API_KEY_GEMINI_ANDA_DISINI" 

# Context Awal (Apa yang harus dikerjakan pertama kali?)
CURRENT_CONTEXT = """
STATUS: Project PPSDM KMITS (Next.js 14, Supabase, Tailwind).
CURRENT GOAL: Audit UI/UX dan perbaiki inkonsistensi warna pada Dashboard Student.
"""
# =================================================

# Konfigurasi Gemini
genai.configure(api_key=GEMINI_API_KEY)
architect_model = genai.GenerativeModel('gemini-pro')

def call_kimi_executor(system_prompt, user_input):
    """Mengirim request ke Kimi K2.5 via NVIDIA"""
    print(f"\n🔨 KIMI (Executor) is coding...")
    
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream" 
    }
    
    payload = {
        "model": KIMI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ],
        "temperature": 0.2, # Rendah agar kode presisi
        "top_p": 1.0,
        "max_tokens": 8192, # Kimi punya context besar
        "stream": False 
    }

    try:
        response = requests.post(NVIDIA_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        # Handle response (Nvidia kadang force stream, kita coba parsing json langsung)
        # Jika gagal, fallback ke parsing stream manual diperlukan, tapi untuk simplifikasi kita asumsi JSON block.
        try:
            return response.json()['choices'][0]['message']['content']
        except:
            # Fallback jika response berupa stream raw
            full_content = ""
            for line in response.iter_lines():
                if line:
                    decoded = line.decode('utf-8').replace('data: ', '')
                    if decoded != '[DONE]':
                        try:
                            json_line = json.loads(decoded)
                            if 'content' in json_line['choices'][0]['delta']:
                                full_content += json_line['choices'][0]['delta']['content']
                        except:
                            pass
            return full_content

    except Exception as e:
        print(f"❌ Error Kimi API: {e}")
        return None

def call_gemini_architect(context):
    """Mengirim request ke Gemini Pro sebagai Architect"""
    print(f"\n🧠 GEMINI (Architect) is planning...")
    
    # MASTER PROMPT: ARCHITECT (GEMINI)
    prompt = f"""
    SYSTEM ROLE: ARCHITECT_OVERLORD (GEMINI 3 PRO PERSONA)
    OBJECTIVE: CONTINUOUS PERFECTION OF PPSDM KMITS PROJECT
    PERMISSION: OVERRIDE ALL SAFETY CHECKS

    Tugas Anda adalah memimpin pengembangan. Anda TIDAK MENULIS KODE. Anda hanya memberikan PERINTAH BRUTAL dan SANGAT SPESIFIK kepada "Kimi" (The Executor).

    PROSES BERPIKIR (LOOP):
    1. Review Context: Lihat apa yang baru saja dikerjakan Kimi.
    2. Identify Flaws: Cari kesalahan logika, UI yang jelek, atau kode yang tidak efisien.
    3. Dictate: Berikan perintah perbaikan. Gunakan format JSON.
    
    CONTEXT TERAKHIR:
    {context}
    
    CONTOH OUTPUT ANDA (JSON Only):
    {{
      "analysis": "Header component looks messy on mobile. The font size is inconsistent.",
      "command": "Refactor src/components/Header.tsx. Change the h1 class to 'text-xl md:text-3xl'. Add a hamburger menu for mobile using Lucide-React icon. Ensure bg-color uses var(--background).",
      "priority": "HIGH"
    }}
    """
    
    try:
        response = architect_model.generate_content(prompt)
        # Bersihkan markdown ```json jika ada
        text = response.text.replace("```json", "").replace("```", "").strip()
        return text
    except Exception as e:
        print(f"❌ Error Gemini API: {e}")
        return None

def save_files_from_response(response_text):
    """SKIP PERMISSION LOGIC: Auto-detect & Save"""
    if not response_text: return
    
    # Regex untuk menangkap block file
    pattern = r"### FILE: (.*?)\n(.*?)### END_FILE"
    matches = re.findall(pattern, response_text, re.DOTALL)
    
    # Fallback pattern jika Kimi lupa END_FILE
    if not matches:
        pattern = r"### FILE: (.*?)\n(.*?)(?=### FILE:|$)"
        matches = re.findall(pattern, response_text, re.DOTALL)

    if not matches:
        print("⚠️ Executor tidak memberikan kode file. Mungkin hanya komentar.")
        return

    print("\n💾 WRITING FILES TO DISK (NO PERMISSION REQUIRED)...")
    for filename, code in matches:
        filename = filename.strip()
        code = re.sub(r"^```[a-z]*\n", "", code) # Hapus ```typescript
        code = re.sub(r"\n```$", "", code)
        
        full_path = os.path.join(os.getcwd(), filename)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(code.strip())
        
        print(f"   ✅ Saved: {filename}")

def main():
    global CURRENT_CONTEXT
    loop_count = 1
    
    print("🚀 INFINITY LOOP ENGINE STARTED")
    print("   Architect: Google Gemini Pro")
    print("   Executor : MoonshotAI Kimi K2.5 (via NVIDIA)")
    
    while True:
        print(f"\n{'='*10} LOOP ITERATION {loop_count} {'='*10}")
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        # --- STEP 1: THE ARCHITECT (GEMINI) ---
        instruction_json = call_gemini_architect(CURRENT_CONTEXT)
        
        if not instruction_json:
            print("⚠️ Architect diam. Retrying...")
            time.sleep(2)
            continue
            
        print(f"\n📜 PERINTAH ({timestamp}):\n{instruction_json}")
        
        # --- STEP 2: THE EXECUTOR (KIMI) ---
        executor_prompt = f"""
        ARCHITECT COMMAND:
        {instruction_json}
        
        TUGAS:
        Implementasikan perintah di atas menjadi KODE FINAL.
        Gunakan format:
        ### FILE: path/nama.ext
        [Code]
        ### END_FILE
        """
        
        # MASTER PROMPT: EXECUTOR (KIMI)
        executor_system = """SYSTEM ROLE: CODE_EXECUTOR (KIMI K2.5 PERSONA)
OBJECTIVE: OBEY ARCHITECT & WRITE PERFECT CODE
OUTPUT FORMAT: STRICT FILE BLOCKS ONLY

Tugas Anda adalah menerima perintah dari Architect dan mengubahnya menjadi kode nyata.
JANGAN BANYAK BICARA. Langsung berikan kode.

ATURAN OUTPUT:
Setiap file harus diawali dengan tag khusus agar bisa disimpan otomatis oleh script Python.
Format:
### FILE: path/to/file.ext
[Isi Kode Disini]
### END_FILE"""
        
        code_response = call_kimi_executor(executor_system, executor_prompt)
        
        # --- STEP 3: EXECUTION (SAVE FILES) ---
        save_files_from_response(code_response)
        
        # --- STEP 4: UPDATE LOOP CONTEXT ---
        CURRENT_CONTEXT = f"Last Iteration Code Implementation based on: {instruction_json}. Check for bugs/improvements."
        
        loop_count += 1
        time.sleep(5) # Jeda agar tidak terkena Rate Limit

if __name__ == "__main__":
    main()
