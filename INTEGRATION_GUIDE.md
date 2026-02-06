# PPSDM KMM - Complete Integration Guide

This guide covers all integrated APIs, services, and resources for the PPSDM KMM LMS system.

## 📋 Overview

This system integrates multiple AI providers, cloud services, and APIs to create a robust content generation and learning management platform.

## 🔑 API Keys & Configuration

All API keys are stored in `.env.local`. **Never commit this file to version control!**

### AI Providers

| Provider | Environment Variable | Status | Priority |
|----------|---------------------|--------|----------|
| Groq | `GROQ_API_KEY` | ✅ Active | 1 (Fastest) |
| OpenAI | `OPENAI_API_KEY` | ✅ Active | 2 |
| OpenRouter | `OPENROUTER_API_KEY` | ✅ Active | 3 |
| Google AI | `GOOGLE_AI_API_KEY` | ✅ Active | 4 |
| Hugging Face | `HUGGINGFACE_API_KEY` | ✅ Active | 5 |
| Replicate | `REPLICATE_API_TOKEN` | ✅ Active | Image Gen |

### Infrastructure

| Service | Environment Variable | URL/ID |
|---------|---------------------|--------|
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | https://hyszrracdysqgyfpwflu.supabase.co |
| Supabase Key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs...` |
| Supabase Service | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIs...` |
| QStash | `UPSTASH_QSTASH_TOKEN` | `f76d6a1b-493a-4c61-9e38-d953219e265d` |
| Google Drive | `GOOGLE_DRIVE_FOLDER_ID` | `1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf` |
| Google Sheets | `GOOGLE_SHEETS_ID` | `1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM` |
| SerpAPI | `SERPAPI_KEY` | `a89ad239a1eb4ef5d4311397300...` |

## 🤖 AI Provider Router

### Location: `src/lib/ai-providers.ts`

This module provides automatic fallback across multiple AI providers.

### Usage

```typescript
import { generateWithFallback, getAvailableProviders } from '@/lib/ai-providers';

// Generate with automatic fallback
const result = await generateWithFallback({
  prompt: "Create a course outline about leadership",
  systemPrompt: "You are an expert instructional designer",
  temperature: 0.7,
  maxTokens: 2000,
  tier: 'balanced', // 'fast', 'balanced', 'powerful'
});

console.log(result.content);
console.log(result.provider); // Which provider succeeded
console.log(result.latency);  // Response time in ms
```

### Provider Priority

1. **Groq** - Fastest inference (LLaMA models)
2. **OpenAI** - Most reliable (GPT-4o)
3. **OpenRouter** - Best models (Claude, etc.)
4. **Google AI** - Cost-effective (Gemini)
5. **Hugging Face** - Open source models

### Python Script

```bash
# Generate content with fallback
python scripts/multi_api_content_generator.py \
  --prompt "Create a summary of Atomic Habits" \
  --model balanced \
  --output result.json

# Test all providers
python scripts/multi_api_content_generator.py \
  --prompt "Hello" \
  --all
```

## 📁 Google Drive Integration

### Location: `src/lib/google-drive.ts`

Access the 2TB "BUKA BUKU" folder containing e-books.

### Folder Structure

```
📁 BUKA BUKU (2TB)
├── 📁 Leadership
│   ├── 📄 [Leadership] Atomic Habits.pdf
│   └── 📄 [Leadership] 7 Habits.pdf
├── 📁 Technical
│   ├── 📄 [Technical] Clean Code.pdf
│   └── 📄 [Technical] Design Patterns.pdf
└── 📁 Uncategorized
    └── 📄 Random Book.epub
```

### Usage

```typescript
import { listBooksInDrive, downloadBook, DRIVE_FOLDER_ID } from '@/lib/google-drive';

// List all books
const books = await listBooksInDrive();
console.log(`Found ${books.length} books`);

// Download a book
const bookBuffer = await downloadBook('file-id-here');
fs.writeFileSync('book.pdf', bookBuffer);

// Search books
const leadershipBooks = await searchBooks('leadership');
```

## 📊 Google Sheets Integration

### Location: `src/lib/google-sheets.ts`

Track book processing status in real-time.

### Sheet: Processing Log

| Timestamp | Book ID | Book Title | Status | Stage | Message | Duration | AI Provider | Output URL |
|-----------|---------|------------|--------|-------|---------|----------|-------------|------------|

### Status Values

- `pending` - Waiting to be processed
- `processing` - Currently being processed
- `completed` - Successfully completed
- `failed` - Processing failed
- `retrying` - Being retried

### Stages

1. `downloaded` - Book downloaded from Drive
2. `parsed` - Content parsed and extracted
3. `summarized` - Summary generated
4. `modules_generated` - Course modules created
5. `assessments_created` - Quizzes and assessments ready
6. `published` - Published to LMS

### Usage

```typescript
import { logProcessingStatus, getAllBookStatuses } from '@/lib/google-sheets';

// Log processing status
await logProcessingStatus(
  'book-123',
  'Atomic Habits',
  'processing',
  'summarized',
  { provider: 'Groq', duration: 2500 }
);

// Get all statuses
const statuses = await getAllBookStatuses();
const completed = Object.values(statuses).filter(s => s.status === 'completed');
```

## 📬 Upstash QStash Queue

### Location: `src/lib/queue.ts`

Background job processing for asynchronous tasks.

### Features

- Book processing queue
- Content generation jobs
- Drive synchronization
- Scheduled/recurring jobs
- Batch processing

### Usage

```typescript
import { enqueueBookProcessing, enqueueBatchProcessing } from '@/lib/queue';

// Queue a single book
await enqueueBookProcessing('book-123', {
  priority: 5,
  bookTitle: 'Atomic Habits'
});

// Queue batch processing
await enqueueBatchProcessing(['book-1', 'book-2', 'book-3'], {
  batchSize: 10,
  delayBetween: 1000
});

// Schedule recurring sync
await scheduleRecurringJob('sync_drive', '0 */6 * * *'); // Every 6 hours
```

### API Endpoints

Jobs are processed by these API endpoints:

- `POST /api/process-book` - Process a book
- `POST /api/generate-content` - Generate content
- `POST /api/sync-drive` - Sync Drive folder

## 🗄️ Supabase Database

### Connection

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

### Tables

#### books
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drive_id TEXT UNIQUE,
  title TEXT NOT NULL,
  author TEXT,
  format TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### courses
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id),
  title TEXT NOT NULL,
  description TEXT,
  modules JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔍 Search Integration (SerpAPI)

### Usage

```python
import os
import requests

def search_google(query):
    params = {
        'engine': 'google',
        'q': query,
        'api_key': os.getenv('SERPAPI_KEY'),
        'num': 10
    }
    response = requests.get('https://serpapi.com/search', params=params)
    return response.json()
```

## 🎨 Image Generation (Replicate)

### Usage

```python
import replicate

output = replicate.run(
    "stability-ai/stable-diffusion:ac732df...",
    input={"prompt": "a scenic mountain landscape"}
)
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
pip install -r scripts/requirements.txt
```

### 2. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with all API keys
```

### 3. Test Integrations

```bash
# Test all APIs
python scripts/setup_all_integrations.py

# Test specific provider
python scripts/multi_api_content_generator.py \
  --prompt "Hello" \
  --provider groq
```

### 4. Start Development

```bash
npm run dev
```

## 📈 Monitoring & Health Checks

### Check Provider Health

```typescript
import { getProviderHealth } from '@/lib/ai-providers';

const health = await getProviderHealth();
// Returns: { groq: { available: true, latency: 150 }, ... }
```

### Queue Statistics

```typescript
import { getQueueStats } from '@/lib/queue';

const stats = await getQueueStats();
// Returns: { totalMessages, pending, delivered, failed, scheduled }
```

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Rotate API keys** - Periodically update keys
3. **Use service role key only server-side** - Never expose to client
4. **Enable QStash signature verification** - Validate webhooks
5. **Monitor usage** - Track API usage to avoid unexpected bills

## 🛠️ Troubleshooting

### API Key Issues

```bash
# Verify keys are loaded
python scripts/setup_all_integrations.py --test-only

# Check specific provider
python scripts/multi_api_content_generator.py --prompt "test" --provider groq
```

### Supabase Connection

```bash
# Test connection
npx supabase status

# Link project
npx supabase link --project-ref hyszrracdysqgyfpwflu

# Push migrations
npx supabase db push
```

### Queue Issues

```bash
# List scheduled jobs
curl https://qstash.upstash.io/v2/schedules \
  -H "Authorization: Bearer $UPSTASH_QSTASH_TOKEN"
```

## 📚 Resources

- **Google Drive**: https://drive.google.com/drive/folders/1B1g7rSHGQtO1VXEWxSS8Ncbg0R3nxmFf
- **Spreadsheet**: https://docs.google.com/spreadsheets/d/1QEj9aoXDrAu6PKdFX-FNQt5pWlf7VsWMGeeU-PF9tQM
- **Supabase Dashboard**: https://supabase.com/dashboard/project/hyszrracdysqgyfpwflu

## 📞 Support

For issues with:
- **API Keys**: Check provider dashboards
- **Supabase**: Check project dashboard
- **Google Drive**: Verify OAuth consent screen
- **QStash**: Check Upstash dashboard

---

**Last Updated**: 2026-02-01
**Version**: 1.0.0
