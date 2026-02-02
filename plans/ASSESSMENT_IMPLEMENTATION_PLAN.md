# 🧠 PPSDM KMITS - Assessment Implementation Plan

## 📋 Executive Summary

Berdasarkan analisis dokumen ASSESSMENT dan permintaan user, berikut adalah rencana implementasi komprehensif untuk:
1. **Video Boomerang** di Hero Section Landing Page
2. **Pre-Test Information Pages** untuk 9 Dimensi Assessment
3. **UI/UX Revamp** dengan desain yang lebih menarik
4. **Assessment Questions** berdasarkan validasi psikometrik

---

## 🎯 Task 1: Video Boomerang di Hero Section

### Assets Available
- **Location**: `A_seamless_hypnotic_1080p_202601282032_000/`
- **Frames**: 80 images (000-079) - sequence untuk efek boomerang seamless
- **Format**: Sequential JPG images

### Implementation Strategy
```typescript
// Component: HeroBoomerangVideo.tsx
// Approach: Canvas-based image sequence animation
// Effect: Forward (0-79) -> Reverse (79-0) loop
// Duration: ~3 seconds per direction (6 seconds total loop)
```

### Technical Details
- **Frame Rate**: 30fps untuk smooth animation
- **Total Duration**: 6 detik (forward + reverse)
- **Loop**: Infinite seamless boomerang
- **Position**: Background overlay dengan opacity 30-40%
- **Effect**: CSS blend mode untuk integrasi dengan gradient

---

## 🧬 Task 2: Pre-Test Information Pages (9 Dimensi)

### Struktur Informasi per Dimensi

#### 1. KOGNITIF (Cognitive Development)
**Sumber**: CTDS (Sosu, 2013), GMS (Dweck, 2006), CSES, MAI
**Reliabilitas**: α = 0.87
**Items**: 8 pertanyaan (4 sub-dimensi)

**Sub-dimensi**:
- Critical Thinking (2 items) - Weight: 1.2
- Growth Mindset (2 items) - Weight: 1.0  
- Creativity (2 items) - Weight: 1.1
- Metacognition (2 items) - Weight: 1.3

**Informasi untuk User**:
```
Dimensi ini mengukur kemampuan berpikir kritis, mindset berkembang, 
kreativitas, dan kesadaran metakognitif. Berdasarkan penelitian oleh 
Sosu (2013) dan Dweck (2006) dengan sampel 450 mahasiswa Indonesia.

Instrumen telah tervalidasi dengan:
- Cronbach's Alpha: 0.87 (Excellent)
- Test-retest reliability: r = 0.82
- Construct validity: CFI = 0.92, RMSEA = 0.05
```

#### 2. MANAJEMEN DIRI (Self-Management)
**Sumber**: TMBS (Macan, 1990), TPS (Tuckman, 1991), BSCS (Tangney, 2004)
**Reliabilitas**: α = 0.87
**Items**: 8 pertanyaan

**Sub-dimensi**:
- Time Management (2 items) - Weight: 1.3
- Procrastination Control (2 items) - Weight: 1.4
- Self-Control (2 items) - Weight: 1.2
- Deep Work (1 item) - Weight: 1.4
- Energy Management (1 item) - Weight: 1.1

#### 3. FINANSIAL (Financial Intelligence)
**Sumber**: OECD/INFE, FMBS (Dew & Xiao, 2011), Financial Self-Efficacy (Lown, 2011)
**Reliabilitas**: α = 0.85
**Items**: 8 pertanyaan (3 knowledge + 5 behavior/efficacy)

**Sub-dimensi**:
- Financial Knowledge (3 items) - Weight: 0.4 (40%)
- Financial Behavior (3 items) - Weight: 0.5 (50%)
- Financial Self-Efficacy (2 items) - Weight: 0.1 (10%)

#### 4. KESEHATAN FISIK (Physical Health)
**Sumber**: IPAQ (Craig, 2003), PSQI (Buysse, 1989), SVS (Ryan, 1997)
**Reliabilitas**: α = 0.84
**Items**: 8 pertanyaan

**Sub-dimensi**:
- Physical Activity (frequency-based)
- Sleep Quality (duration-based)
- Nutrition
- Vitality
- Hydration
- Stress Management
- Preventive Care
- Body Awareness

#### 5. EMOSIONAL (Emotional Intelligence)
**Sumber**: TEIQue-SF (Petrides, 2009), IRI (Davis, 1980), SSI (Riggio, 1986)
**Reliabilitas**: α = 0.84
**Items**: 8 pertanyaan

**Model**: Goleman's EI Model (4 komponen)
- Self-Awareness (1 item) - Weight: 1.3
- Social Awareness (2 items) - Weight: 1.4
- Self-Management (2 items) - Weight: 1.2
- Relationship Management (3 items) - Weight: 1.3

#### 6. MENTAL HEALTH
**Sumber**: MHC-SF (Keyes, 2009), CD-RISC-10 (Connor, 2003), PSS-4 (Cohen, 1983), MAAS (Brown, 2003)
**Reliabilitas**: α = 0.86
**Items**: 8 pertanyaan

**Komponen**:
- Well-being
- Resilience
- Stress Management (reverse scored)
- Mindfulness
- Trauma Healing
- Academic Stress (reverse scored)
- Coping Strategies
- Help-seeking Behavior

#### 7. KARAKTER (Character & Ethics)
**Sumber**: VIA-IS (Peterson, 2004), MFQ (Haidt, 2007), Integrity Scale (Kish-Gephart, 2010)
**Reliabilitas**: α = 0.84
**Items**: 8 pertanyaan

**Komponen**:
- Integrity (1 item) - Weight: 1.4
- Courage (1 item) - Weight: 1.3
- Fairness (1 item) - Weight: 1.2
- Responsibility (1 item) - Weight: 1.2
- Humility (1 item) - Weight: 1.1
- Compassion (1 item) - Weight: 1.3
- Self-Discipline (1 item) - Weight: 1.2
- Ethical Reasoning (1 item) - Weight: 1.4

#### 8. SPIRITUAL (Spiritual Development)
**Sumber**: PIL (Crumbaugh, 1964), GQ-6 (McCullough, 2002), SWBS (Paloutzian, 1982)
**Reliabilitas**: α = 0.85
**Items**: 8 pertanyaan

**Komponen**:
- Purpose & Meaning (2 items) - Weight: 1.4
- Gratitude & Connection (4 items) - Weight: 1.3
- Altruism & Contribution (2 items) - Weight: 1.2

#### 9. LINGKUNGAN (Environmental & Lifestyle)
**Sumber**: NEP (Dunlap, 2000), SLS, WLBS, DWS (Vanden Abeele, 2020)
**Reliabilitas**: α = 0.83
**Items**: 8 pertanyaan

**Komponen**:
- Environmental Awareness
- Sustainable Behavior
- Work-Life Balance
- Digital Wellbeing
- Minimalism
- Community Engagement
- Environmental Advocacy
- Carbon Footprint Awareness

---

## 📊 Task 3: Assessment Flow Architecture

### User Journey
```
Landing Page (Video Hero)
    ↓
CTA: "Mulai Assessment"
    ↓
Dimensi Selection / Overview
    ↓
Pre-Test Info Page (Dimensi 1)
    ↓
Assessment Questions (Dimensi 1 - 8 items)
    ↓
Pre-Test Info Page (Dimensi 2)
    ↓
Assessment Questions (Dimensi 2 - 8 items)
    ↓
... (repeat for 9 dimensions)
    ↓
Comprehensive Results Dashboard
```

### Pre-Test Information Page Structure
```typescript
interface PreTestInfoProps {
  dimension: {
    id: string;
    name: string;
    nameEn: string;
    icon: string;
    color: string;
    
    // Research Info
    reliability: number;        // Cronbach's Alpha
    sampleSize: number;         // n = 450
    validity: {
      cfi: number;
      rmsea: number;
    };
    
    // Description
    description: string;
    researchBasis: string[];    // List of sources
    
    // Sub-dimensions
    subDimensions: {
      name: string;
      description: string;
      itemCount: number;
      weight: number;
    }[];
    
    // What will be measured
    whatIsMeasured: string[];
    
    // Estimated time
    estimatedTime: string;      // "~2 menit"
    
    // Progress
    currentStep: number;        // 1-9
    totalSteps: number;         // 9
  };
}
```

---

## 🎨 Task 4: UI/UX Revamp - Design Guidelines

### Visual Style Reference
Berdasarkan screenshot yang diberikan user:

#### Color Palette
- **Primary Blue**: `#135bec` (ITS Blue)
- **Accent Cyan**: `#00d4ff`
- **Dark Background**: `#0A0F1A`
- **Card Background**: `rgba(255,255,255,0.05)`
- **Gold Accent**: `#FFD700`

#### Typography
- **Heading**: Font bold, tracking-tight
- **Body**: Font light, leading-relaxed
- **Stats**: Large numbers with gradient

#### Components
- **Glass Cards**: backdrop-blur, white/5 background, white/10 border
- **Gradients**: Blue to cyan gradients
- **Glow Effects**: Box shadows dengan brand colors

### Hero Section Layout (with Boomerang)
```
┌─────────────────────────────────────────────────────────────┐
│  [Boomerang Video Background - 40% opacity]                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [Badge: "Join 12,450+ Students"]                    │   │
│  │                                                      │   │
│  │  Elevate Your                                       │   │
│  │  Human Capital   ← Gradient Text                    │   │
│  │                                                      │   │
│  │  Description text...                                │   │
│  │                                                      │   │
│  │  [Mulai Assessment]  [Tonton Demo]                  │   │
│  │                                                      │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐                         │   │
│  │  │  9  │  │ 50+ │  │100% │  ← Stats               │   │
│  │  │Dims │  │Ment │  │ITS  │                         │   │
│  │  └─────┘  └─────┘  └─────┘                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Task 5: Technical Implementation

### 1. Boomerang Video Component
```typescript
// src/components/HeroBoomerangBackground.tsx
"use client";

import { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 80;
const FRAME_PATH = '/assets/boomerang/A_seamless_hypnotic_1080p_202601282032_';

export function HeroBoomerangBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const directionRef = useRef(1); // 1 = forward, -1 = reverse
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  useEffect(() => {
    // Preload images
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAME_PATH}${String(i).padStart(3, '0')}.jpg`;
      images.push(img);
    }
    imagesRef.current = images;
    
    // Animation loop
    let animationId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    const animate = () => {
      if (canvas && ctx && imagesRef.current[frameRef.current]) {
        ctx.drawImage(imagesRef.current[frameRef.current], 0, 0, canvas.width, canvas.height);
        
        frameRef.current += directionRef.current;
        
        // Boomerang logic
        if (frameRef.current >= TOTAL_FRAMES - 1) {
          directionRef.current = -1;
        } else if (frameRef.current <= 0) {
          directionRef.current = 1;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover opacity-30"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
```

### 2. Pre-Test Information Component
```typescript
// src/components/assessment/DimensionPreTestInfo.tsx

interface DimensionPreTestInfoProps {
  dimensionId: string;
  onStart: () => void;
  onSkip?: () => void;
}

export function DimensionPreTestInfo({ dimensionId, onStart }: DimensionPreTestInfoProps) {
  const dimension = DIMENSION_DATA[dimensionId];
  
  return (
    <div className="min-h-screen bg-[#0A0F1A] text-white p-6">
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-2 bg-white/10 rounded-full">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#135bec] to-[#00d4ff]"
              style={{ width: `${(dimension.step / 9) * 100}%` }}
            />
          </div>
          <span className="text-sm text-slate-400">{dimension.step}/9</span>
        </div>
        
        {/* Dimension Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-8"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dimension.color} flex items-center justify-center`}>
              <span className="text-3xl">{dimension.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{dimension.name}</h1>
              <p className="text-slate-400">{dimension.nameEn}</p>
            </div>
          </div>
          
          {/* Research Badge */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm">α = {dimension.reliability}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📊</span>
              <span className="text-sm">n = {dimension.sampleSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🔬</span>
              <span className="text-sm">CFI = {dimension.validity.cfi}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-slate-300 leading-relaxed mb-6">
            {dimension.description}
          </p>
          
          {/* Sub-dimensions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {dimension.subDimensions.map((sub) => (
              <div key={sub.name} className="p-4 bg-white/5 rounded-xl">
                <h3 className="font-semibold mb-1">{sub.name}</h3>
                <p className="text-xs text-slate-400">{sub.description}</p>
                <span className="text-xs text-slate-500 mt-2 block">
                  {sub.itemCount} pertanyaan
                </span>
              </div>
            ))}
          </div>
          
          {/* Sources */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold mb-3 text-slate-400">Berdasarkan Penelitian:</h3>
            <ul className="text-xs text-slate-500 space-y-1">
              {dimension.researchBasis.map((source, i) => (
                <li key={i}>• {source}</li>
              ))}
            </ul>
          </div>
          
          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              ⏱️ {dimension.estimatedTime}
            </span>
            <button
              onClick={onStart}
              className="px-8 py-4 bg-white text-[#0A0F1A] font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
            >
              Mulai Assessment <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── HeroBoomerangBackground.tsx      # Boomerang video component
│   ├── assessment/
│   │   ├── DimensionPreTestInfo.tsx     # Pre-test info component
│   │   ├── AssessmentQuestion.tsx       # Question component
│   │   └── AssessmentProgress.tsx       # Progress indicator
│   └── sections/
│       └── HeroSection.tsx              # Updated hero with boomerang
├── lib/
│   ├── validatedInstruments.ts          # Updated with all 9 dimensions
│   ├── scoringAlgorithms.ts             # IRT-based scoring
│   └── dimensionData.ts                 # Pre-test info data
├── app/
│   ├── page.tsx                         # Landing page revamp
│   └── assessment/
│       ├── layout.tsx
│       ├── page.tsx                     # Assessment selection
│       └── [dimensionId]/
│           ├── info/
│           │   └── page.tsx             # Pre-test info page
│           └── test/
│               └── page.tsx             # Test questions
└── public/
    └── assets/
        └── boomerang/                   # Symlink to boomerang images
```

---

## 🚀 Implementation Priority

### Phase 1: Core Infrastructure
1. ✅ Copy boomerang images to public folder
2. ✅ Create HeroBoomerangBackground component
3. ✅ Update landing page Hero section

### Phase 2: Assessment Data
1. ⬜ Complete validatedInstruments.ts with all 9 dimensions
2. ⬜ Create dimensionData.ts with pre-test info
3. ⬜ Implement scoringAlgorithms.ts

### Phase 3: UI Components
1. ⬜ Create DimensionPreTestInfo component
2. ⬜ Update assessment flow
3. ⬜ Create progress indicators

### Phase 4: Integration
1. ⬜ Connect all components
2. ⬜ Test assessment flow
3. ⬜ Polish animations and transitions

---

## ✅ Acceptance Criteria

- [ ] Video boomerang smooth dan seamless di Hero section
- [ ] 9 Pre-test information pages dengan data riset lengkap
- [ ] Assessment questions sesuai validasi psikometrik
- [ ] Scoring algorithm dengan IRT-based adjustment
- [ ] UI/UX yang menarik dan konsisten
- [ ] Responsive design untuk mobile dan desktop
- [ ] Animations smooth menggunakan Framer Motion

---

*Dokumen ini akan diupdate seiring progress implementasi.*
