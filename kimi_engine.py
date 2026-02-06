import requests
import json
import sys

# --- CONFIGURATION (HARDCODED) ---
# Saya sudah menyisipkan API Key Anda langsung di sini sesuai permintaan.
API_KEY = "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"
MODEL = "moonshotai/kimi-k2.5"
URL = "https://integrate.api.nvidia.com/v1/chat/completions"

# --- TARGET PERINTAH PERTAMA ---
# Tugas spesifik untuk proyek PPSDM KM ITS Anda.
TARGET_MASALAH = """
Sempurnakan arsitektur Quantum Content Alchemy Engine untuk LMS PPSDM KM ITS. 
Pastikan integrasi antara Next.js, Supabase, dan AI Pipeline berjalan efisien, 
aman, dan mampu menangani otomatisasi konten edukasi dalam skala besar.
"""

MEGA_PROMPT = f"""
KONTEKS: Anda adalah Senior Systems Architect & Global Research Lead (God-Mode Engineer).

TUGAS: Selesaikan proyek berikut secara komprehensif dari hulu ke hilir:
"{TARGET_MASALAH}"

PROTOKOL BERPIKIR (Deep Thinking):
1. DEEP ANALYSIS: Bedah permintaan ini secara fundamental untuk konteks organisasi mahasiswa di ITS.
2. GLOBAL RESEARCH: Gunakan standar industri terbaik untuk integrasi Next.js dan Supabase.
3. ARCHITECTURE DESIGN: Rancang struktur folder dan skema database yang scalable.

PROTOKOL EKSEKUSI:
- Tuliskan SELURUH kode sumber secara lengkap dan modular.
- Berikan instruksi instalasi library yang diperlukan.
- JANGAN gunakan placeholder. Berikan hasil yang siap pakai (Production Ready).
"""

def run_engine_direct():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Accept": "text/event-stream"
    }

    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": MEGA_PROMPT}],
        "max_tokens": 16384,
        "temperature": 0.7,
        "stream": True, # Menghindari 504 Gateway Timeout
        "chat_template_kwargs": {"thinking": True}
    }

    print(f"\n[🚀] KIMI ENGINE AKTIF: Menjalankan Perintah Pertama...")
    print(f"[📍] Target: {TARGET_MASALAH.strip()}")
    print("-" * 60)

    try:
        # Menggunakan streaming agar terminal langsung menampilkan teks saat Kimi berpikir
        response = requests.post(URL, headers=headers, json=payload, stream=True, timeout=600)
        response.raise_for_status()

        full_content = ""
        for line in response.iter_lines():
            if line:
                line_data = line.decode("utf-8")
                if line_data.startswith("data: "):
                    data_str = line_data[6:]
                    if data_str == "[DONE]":
                        break
                    
                    try:
                        chunk = json.loads(data_str)
                        content = chunk['choices'][0]['delta'].get('content', '')
                        print(content, end='', flush=True) # Output real-time ke layar
                        full_content += content
                    except:
                        continue

        # Otomatis simpan hasil ke file Markdown
        with open("KIMI_OUTPUT_LOG.md", "w", encoding="utf-8") as f:
            f.write(full_content)
            
        print("\n\n" + "-" * 60)
        print(f"[✅] SELESAI! Hasil lengkap disimpan di: KIMI_OUTPUT_LOG.md")

    except Exception as e:
        print(f"\n[!] TERJADI KESALAHAN: {str(e)}")

if __name__ == "__main__":
    run_engine_direct()