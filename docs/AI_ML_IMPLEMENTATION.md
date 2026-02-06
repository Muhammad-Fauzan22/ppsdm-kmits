# AI/ML Implementation - PPSDM KMITS

## Overview

PPSDM KMITS mengimplementasikan pendekatan hybrid AI/ML yang menggabungkan:
- **Cloud-based AI Services** (Kimi, Nemotron, GLM4, QWEN) untuk analisis kompleks
- **Local TensorFlow.js Models** untuk processing cepat dan privacy-preserving

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PPSDM KMITS Application                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │  AI Analytics    │    │   Local ML UI     │              │
│  │   Component      │    │   Components      │              │
│  └────────┬─────────┘    └────────┬─────────┘              │
│           │                       │                         │
│           └───────────┬───────────┘                         │
│                       │                                     │
│           ┌───────────▼───────────┐                         │
│           │  AI Service Layer     │                         │
│           │  (Queuing + Caching)  │                         │
│           └───────────┬───────────┘                         │
│                       │                                     │
│       ┌───────────────┼───────────────┐                     │
│       │               │               │                     │
│  ┌────▼────┐    ┌────▼────┐    ┌────▼────┐                │
│  │  Kimi   │    │Nemotron │    │  GLM4   │                │
│  │  K2.5   │    │         │    │         │                │
│  └─────────┘    └─────────┘    └─────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## AI Services

### Service Layer (`src/lib/ai/ai-service.ts`)

Enhanced AI Service Layer dengan fitur:

| Feature | Description |
|---------|-------------|
| **Request Queuing** | Antrian permintaan dengan prioritas (high/normal/low) |
| **Rate Limiting** | Batas 100 permintaan per menit |
| **Fallback Mechanism** | Otomatis switch antar model jika gagal |
| **Response Caching** | Cache response selama 1 jam |

#### Usage

```typescript
import { aiService } from '@/lib/ai/ai-service';

const response = await aiService.generate({
  prompt: 'Analyze student performance data',
  maxTokens: 1500,
  temperature: 0.7,
  useCache: true,
  priority: 'normal',
});

console.log(response.content);
console.log(response.model); // Model yang digunakan
console.log(response.latency); // Waktu response dalam ms
```

### Available Models

| Model | Provider | Primary Use | API Key |
|-------|----------|-------------|---------|
| **Kimi K2.5** | Moonshot AI/NVIDIA | Complex reasoning, multi-modal | `NVIDIA_API_KEY` |
| **Nemotron-3** | NVIDIA | Fast inference, general tasks | `NEMOTRON_API_KEY` |
| **GLM-4.7** | Zhipu AI | Reasoning, code generation | `NVIDIA_API_KEY_GLM4` |
| **QWEN** | Alibaba | Conversation, Q&A | `QWEN_API_KEY` |

### Fallback Order

```
Kimi K2.5 → Nemotron → GLM4 → QWEN → Rule-based Fallback
```

## Local ML Service (`src/lib/ml/local-ml.ts`)

Browser-based ML service menggunakan rule-based algorithms dan TF.js-compatible methods.

### Features

| Method | Description |
|--------|-------------|
| `predictSentiment()` | Analisis sentimen (positive/negative/neutral) |
| `extractKeywords()` | Ekstraksi kata kunci menggunakan TF-IDF |
| `calculateReadingLevel()` | Kalkulasi tingkat keterbacaan (Flesch-Kincaid) |
| `analyzeText()` | Analisis teks komprehensif |
| `categorizeText()` | Kategorisasi teks ke predefined categories |
| `calculateSimilarity()` | Hitung similarity antar dua teks (Jaccard) |

### Usage

```typescript
import { localML } from '@/lib/ml/local-ml';

// Initialize
await localML.initialize();

// Sentiment Analysis
const sentiment = await localML.predictSentiment(
  'This course was amazing and very helpful!'
);
console.log(sentiment.sentiment); // 'positive'
console.log(sentiment.confidence); // 0.85

// Keyword Extraction
const keywords = await localML.extractKeywords(
  'Machine learning algorithms are transforming healthcare',
  5
);
console.log(keywords.keywords); // ['machine', 'learning', 'healthcare', ...]

// Reading Level
const readingLevel = await localML.calculateReadingLevel(text);
console.log(readingLevel.score); // Flesch Reading Ease score
console.log(readingLevel.description); // 'Easy', 'Standard### Performance Metrics

| Operation', etc.
```

 | Time | Memory |
|-----------|------|--------|
| Initialization | ~100ms | ~1MB |
| Sentiment Analysis | <10ms | - |
| Keyword Extraction | <20ms | - |
| Reading Level | <15ms | - |

## AI Analytics Component (`src/components/ai/AIAnalytics.tsx`)

Komponen React untuk menganalisis data assessment dengan AI.

### Props

```typescript
interface AIAnalyticsProps {
  data: AssessmentData;           // Data assessment
  onInsightsGenerated?: (insights: AIInsight[]) => void;  // Callback
  showLocalAnalysis?: boolean;     // Tampilkan analisis lokal (default: true)
  showAIAnalysis?: boolean;        // Tampilkan analisis AI (default: true)
}

interface AssessmentData {
  dimensionScores: Record<string, number>;
  completedAt: Date;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    answer: string;
    timeSpent: number;
  }>;
  studentName?: string;
  assessmentType?: string;
}
```

### Output

```typescript
interface AIInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  confidence: number;  // 0.0 - 1.0
  priority?: 'high' | 'medium' | 'low';
}
```

### Usage Example

```tsx
import AIAnalytics from '@/components/ai/AIAnalytics';

const assessmentData = {
  dimensionScores: {
    'Cognitive': 85,
    'Emotional': 72,
    'Social': 68,
    'Spiritual': 90,
  },
  completedAt: new Date(),
  timeSpent: 1200,
  answers: [
    { questionId: '1', answer: 'I often help others', timeSpent: 45 },
    // ...
  ],
  studentName: 'John Doe',
  assessmentType: 'Holistic Assessment',
};

<AIAnalytics 
  data={assessmentData}
  showLocalAnalysis={true}
  showAIAnalysis={true}
  onInsightsGenerated={(insights) => {
    console.log('Generated insights:', insights);
  }}
/>
```

## Environment Variables

```bash
# AI Services API Keys
NVIDIA_API_KEY=your_nvidia_api_key
NEMOTRON_API_KEY=your_nemotron_api_key
NVIDIA_API_KEY_GLM4=your_glm4_api_key
QWEN_API_KEY=your_qwen_api_key
```

## Free AI/ML Resources

### GPU & Compute
| Resource | Free Tier | URL |
|----------|-----------|-----|
| Google Colab | Free GPU/TPU | https://colab.research.google.com |
| Kaggle Notebooks | Free GPU | https://www.kaggle.com |
| Gradient | Free GPU hours | https://gradient.run |

### ML Libraries
| Library | License | URL |
|---------|---------|-----|
| TensorFlow.js | Apache 2.0 | https://www.tensorflow.org/js |
| ONNX Runtime | MIT | https://onnxruntime.ai |
| Transformers.js | Apache 2.0 | https://huggingface.co/docs/transformers.js |

### AI APIs (Free Tier)
| Service | Free Tier | URL |
|---------|-----------|-----|
| NVIDIA NIM | 1K requests/mo | https://developer.nvidia.com/nim |
| Hugging Face | 30K requests/mo | https://huggingface.co/inference-api |
| Groq | Free tier available | https://groq.com |

## Best Practices

### 1. Error Handling
```typescript
try {
  const response = await aiService.generate({ prompt: '...' });
  console.log(response.content);
} catch (error) {
  console.error('AI service failed:', error);
  // Fallback to rule-based analysis
}
```

### 2. Rate Limiting
```typescript
// Monitor queue status
const status = aiService.getQueueStatus();
if (status.queueLength > 10) {
  // Show loading indicator to user
}
```

### 3. Caching Strategy
```typescript
// Enable caching for repeated requests
await aiService.generate({
  prompt: 'General learning tips',
  useCache: true,  // Cache enabled
});
```

### 4. Local ML for Privacy
```typescript
// Use local ML for sensitive data
const sentiment = await localML.predictSentiment(
  studentFeedback  // Processed locally, never sent to server
);
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| AI requests timing out | Check API keys, enable fallback |
| Local ML not initializing | Refresh page, check console errors |
| Rate limiting active | Wait 60 seconds or reduce requests |
| No insights generated | Check data format, use fallback mode |

### Debug Mode

```typescript
// Enable debug logging
console.log('[AI] Request:', request);
console.log('[AI] Response:', response);
console.log('[AI] Queue status:', aiService.getQueueStatus());
```

## Changelog

### v1.0.0 (2024)
- Initial AI/ML implementation
- Kimi K2.5, Nemotron, GLM4, QWEN integration
- Local ML service with sentiment analysis
- AI Analytics component

## License

MIT License - See project root for details.

---

**PPSDM KMITS** - Intelligent Learning Management System
