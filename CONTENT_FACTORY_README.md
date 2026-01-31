# ContentFactory: Automated Learning Content Generation

## 🎯 Overview

**ContentFactory** is an AI-powered system that automatically generates high-quality learning materials (Podcast scripts, Audio files, and Marp Slides) from a single topic. It uses a parallel orchestration of free AI APIs to achieve **$0 cost** with **Enterprise-quality** outputs.

## 🏗️ Architecture

```
Topic Input ("Dasar Kepemimpinan")
         ↓
  ┌──────────────────────────────┐
  │   ContentFactory.run()       │
  └──────────────────────────────┘
    ↙            ↓            ↘
[Script Gen]  [Audio Gen]  [Slides Gen]
    ↓            ↓            ↓
  JSON        MP3 (TTS)     Markdown
    ↓            ↓            ↓
Upload→Drive (optional)
```

## 🎬 Features

### 1. **Script Generation** (Podcast Dialogue)
- Uses **Google Gemini 1.5 Flash** or **NVIDIA Nemotron** to generate conversational podcast scripts
- Two-host format: Budi (male) & Siti (female)
- JSON output for easy processing
- Fallback to local templates if APIs fail

### 2. **Audio Generation** (Text-to-Speech)
- Leverages **Microsoft Edge-TTS** (free, unlimited, high-quality neural voices)
- Indonesian voices: `id-ID-ArdiNeural` (male) & `id-ID-GadisNeural` (female)
- Merges individual speaker segments into single MP3 using `pydub`

### 3. **Slide Generation** (Marp Markdown)
- Creates **Marp-compatible Markdown** presentation outlines
- Integrates **Pollinations.ai** for free image placeholders
- Auto-converts to PDF (if `marp` CLI available)

### 4. **Drive Integration** (Optional)
- Uploads generated assets to Google Drive
- Requires `GOOGLE_SERVICE_ACCOUNT_FILE` in `.env.local`
- Supports folder organization via `GOOGLE_DRIVE_FOLDER_ID`

## 📦 Installation

### 1. Install Python dependencies
```bash
cd ppsdm-kmits
python -m pip install -r scripts/requirements.txt
```

### 2. Configure environment variables (`.env.local`)
```dotenv
# Google Gemini API (Primary text generator)
GOOGLE_GENERATIVE_AI_API_KEY=<your-gemini-key>

# NVIDIA Nemotron (Fallback)
NEMOTRON_API_KEY=nvapi-...

# Google Drive (Optional, for auto-upload)
GOOGLE_DRIVE_FOLDER_ID=<your-drive-folder-id>
GOOGLE_SERVICE_ACCOUNT_FILE=/path/to/service-account.json
```

## 🚀 Usage

### Basic: Generate podcast + slides for a topic
```bash
python scripts/content_factory.py "Dasar Kepemimpinan"
```

### Output files created in `scripts/output/`:
```
Dasar_Kepemimpinan_script.json      # Podcast dialogue
Dasar_Kepemimpinan_0.mp3            # Speaker A segments
Dasar_Kepemimpinan_1.mp3            # Speaker B segments
Dasar_Kepemimpinan_slides.md        # Presentation outline
```

### Programmatic usage
```python
from scripts.content_factory import generate_podcast_script, generate_audio_files, generate_slide_content

# 1. Generate script
script = generate_podcast_script("Dasar Kepemimpinan")

# 2. Generate audio
audio_path = generate_audio_files(script, out_basename="my_podcast")

# 3. Generate slides
slides_path = generate_slide_content("Dasar Kepemimpinan")
```

## 🔄 AI Model Orchestration

### Gemini 1.5 Flash (Primary) → Nemotron (Fallback) → Local Template (Last Resort)

**Gemini advantages:**
- Very fast (2-3s)
- Large context window (reads entire documents)
- Free tier: 15 req/min, 1000 req/day

**Nemotron advantages:**
- Open-weights model via NVIDIA cloud
- Good instruction-following
- Unlimited (no rate limits observed)

**Local fallback:**
- Ensures resilience if both external APIs fail
- Returns deterministic template content

## 💾 Output Formats

### Podcast Script (JSON)
```json
[
  {"speaker": "A", "text": "Selamat datang di podcast tentang Dasar Kepemimpinan..."},
  {"speaker": "B", "text": "Terima kasih, Budi..."},
  ...
]
```

### Audio Files (MP3)
- Individual speaker segments (Edge-TTS output)
- Merged final podcast (via pydub)
- Quality: ~24kHz, mono

### Slides (Markdown for Marp)
```markdown
---
title: Dasar Kepemimpinan
---

# Dasar Kepemimpinan

---

## Agenda
- Konsep Dasar
- Teori Kepemimpinan
- Aplikasi Praktis

...
```

## 🔧 Configuration Tuning

| Setting | Default | Purpose |
|---------|---------|---------|
| `GEMINI_MODEL` | `gemini-lite` | Gemini model name |
| `NEMOTRON_API_KEY` | From `.env.local` | Fallback AI provider |
| `GOOGLE_DRIVE_FOLDER_ID` | From `.env.local` | Drive upload destination |
| `GOOGLE_SERVICE_ACCOUNT_FILE` | None (optional) | Service account for Drive auth |

## ⚠️ Known Limitations & Workarounds

| Issue | Cause | Workaround |
|-------|-------|-----------|
| Edge-TTS returns no audio | Network/API issue | Check internet, retry |
| Gemini API key "leaked" | Shared/exposed key | Generate new key in Google AI Studio |
| pydub merge fails | ffmpeg not installed | Install via `chocolatey install ffmpeg` (Windows) or `brew install ffmpeg` (Mac) |
| Marp export to PDF fails | marp CLI not installed | Install via `npm install -g @marp-team/marp-cli` |

## 📊 Cost Analysis

| Component | Cost | Notes |
|-----------|------|-------|
| Gemini API | $0 | Free tier: 15 req/min, 1000/day |
| Nemotron | $0 | NVIDIA free tier, no restrictions observed |
| Edge-TTS | $0 | Microsoft free endpoint, unlimited |
| Pollinations.ai | $0 | Free image generation |
| Google Drive API | $0 | Free tier: unlimited reads/writes |
| **TOTAL** | **$0** | Enterprise-grade for $0 |

## 🔗 Integration with LMS

### Supabase Integration
```python
from supabase import create_client
from scripts.content_factory import generate_podcast_script

# 1. Generate content
script = generate_podcast_script("Topic")

# 2. Store in Supabase (ai_interactions table)
supabase.table('ai_interactions').insert({
    'user_id': user_id,
    'interaction_type': 'content_generation',
    'input_data': {'topic': 'Topic'},
    'output_data': script,
    'model_used': 'Nemotron'
}).execute()
```

### Next.js API Integration
```typescript
// pages/api/generate-content.ts
export async function POST(req: Request) {
  const { topic } = await req.json()
  
  // Call Python backend via shell or HTTP
  const result = await fetch('http://localhost:5000/generate', {
    method: 'POST',
    body: JSON.stringify({ topic })
  })
  
  return Response.json(result)
}
```

## 📈 Future Enhancements

- [ ] **Video Generation**: Combine slides + audio → MP4 using `ffmpeg`
- [ ] **Multi-language support**: Indonesian, English, Mandarin
- [ ] **Custom voice profiles**: Train ElevenLabs or Bark models
- [ ] **Quiz auto-generation**: AI-generated formative assessments
- [ ] **Document extraction**: Auto-detect topics from PDFs → ContentFactory
- [ ] **Real-time dashboard**: WebSocket updates for long-running jobs
- [ ] **Batch processing**: Queue system for multiple topics

## 🤝 Contributing

To improve ContentFactory:
1. Test new AI models in `/scripts/test_*.py`
2. Add fallback chains for resilience
3. Document cost & performance for each model
4. Update `requirements.txt` if adding dependencies

## 📄 License

Part of PPSDM KMITS LMS Project. All outputs are free-to-use for educational purposes.

---

**Generated**: January 31, 2026  
**Version**: 1.0 (Initial Release)  
**Status**: ✅ Production-ready
