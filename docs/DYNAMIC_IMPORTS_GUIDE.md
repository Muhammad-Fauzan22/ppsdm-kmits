# Dynamic Imports dengan Loading Skeletons

## Overview

File [`dynamic-imports.ts`](../src/lib/dynamic-imports.ts) menyediakan konfigurasi untuk lazy-loading komponen visualisasi dengan loading skeleton yang sesuai. Ini meningkatkan UX dengan menampilkan placeholder yang relevan saat komponen sedang dimuat.

## Komponen yang Tersedia

### 1. CognitiveSunburst
- **Path**: `@/components/assessment/CognitiveSunburst`
- **Skeleton**: `CognitiveSunburstSkeleton`
- **SSR**: `false`
- **Deskripsi**: Visualisasi hierarki 4 level untuk perkembangan kognitif

### 2. Sunburst
- **Path**: `@/components/visualizations/Sunburst`
- **Skeleton**: `SunburstSkeleton`
- **SSR**: `false`
- **Deskripsi**: Komponen sunburst visualisasi hierarki umum

### 3. HolisticRadarChart
- **Path**: `@/components/assessment/HolisticRadarChart`
- **Skeleton**: `HolisticRadarChartSkeleton`
- **SSR**: `false`
- **Deskripsi**: Radar chart 9-sumbu untuk visualisasi perkembangan holistik

## Cara Menggunakan

### Import dari dynamic-imports.ts

```tsx
import { CognitiveSunburst, Sunburst, HolisticRadarChart } from '@/lib/dynamic-imports';

// Gunakan komponen seperti biasa
<CognitiveSunburst data={cognitiveData} />
<Sunburst data={sunburstData} />
<HolisticRadarChart data={radarData} pdi={75} balanceIndex={0.85} />
```

### Import Skeleton Langsung

Jika Anda hanya membutuhkan komponen skeleton:

```tsx
import { 
  CognitiveSunburstSkeleton, 
  SunburstSkeleton, 
  HolisticRadarChartSkeleton 
} from '@/components/ui/Skeletons';

// Gunakan skeleton untuk loading state
<CognitiveSunburstSkeleton />
<SunburstSkeleton />
<HolisticRadarChartSkeleton />
```

### Akses Konfigurasi Programatik

```tsx
import { DYNAMIC_IMPORTS_CONFIG } from '@/lib/dynamic-imports';

// Akses konfigurasi komponen
const config = DYNAMIC_IMPORTS_CONFIG.CognitiveSunburst;
console.log(config.ssr); // false
console.log(config.loading); // 'CognitiveSunburstSkeleton'
```

## Struktur Skeleton

### CognitiveSunburstSkeleton
- Header dengan title dan subtitle
- Tombol zoom/reset (4 tombol)
- Grid 2 kolom:
  - Kolom kiri: Sunburst visualization (lingkaran 400x400)
  - Kolom kanan: Side panel dengan:
    - Overall score card
    - Sub-dimensions list (4 item)
    - Selected node details

### SunburstSkeleton
- Header dengan title dan subtitle
- Sunburst visualization (lingkaran 400x400)
- Detail panel dengan:
  - Overall score card
  - Sub-dimensions list (4 item)

### HolisticRadarChartSkeleton
- Header dengan title dan subtitle
- PDI Display (lingkaran progress)
- Balance Index
- Grid 4 kolom:
  - Kolom 1-3: Radar chart (lingkaran 450x450)
  - Kolom 4: Side panel dengan:
    - Quadrant analysis (3 kuadran)
    - Legend
- Bottom stats (3 kolom)

## Keuntungan Menggunakan Dynamic Imports

1. **Code Splitting**: Komponen hanya dimuat saat dibutuhkan
2. **Better UX**: Loading skeleton memberikan feedback visual yang relevan
3. **Performance**: Mengurangi initial bundle size
4. **SSR Disabled**: Komponen visualisasi berat tidak perlu di-render di server

## Contoh Implementasi Lengkap

```tsx
'use client';

import { CognitiveSunburst, HolisticRadarChart } from '@/lib/dynamic-imports';
import { useState, useEffect } from 'react';

export function AssessmentDashboard() {
  const [cognitiveData, setCognitiveData] = useState(null);
  const [radarData, setRadarData] = useState(null);

  useEffect(() => {
    // Fetch data
    fetchCognitiveData().then(setCognitiveData);
    fetchRadarData().then(setRadarData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Cognitive Sunburst akan menampilkan skeleton saat loading */}
      {cognitiveData && (
        <CognitiveSunburst data={cognitiveData} />
      )}

      {/* Holistic Radar Chart akan menampilkan skeleton saat loading */}
      {radarData && (
        <HolisticRadarChart 
          data={radarData} 
          pdi={75} 
          balanceIndex={0.85} 
        />
      )}
    </div>
  );
}
```

## Troubleshooting

### Error: "Cannot redeclare exported variable"
Pastikan Anda tidak mengimpor komponen skeleton dari dua sumber yang berbeda. Gunakan hanya satu cara:
- Import dari `@/components/ui/Skeletons` untuk skeleton langsung
- Import dari `@/lib/dynamic-imports` untuk komponen dengan lazy loading

### Skeleton tidak muncul
Pastikan komponen di-import dari `@/lib/dynamic-imports` dan bukan dari path komponen aslinya.

### TypeScript Error
Pastikan semua komponen skeleton di-export dengan `export function` di file `Skeletons.tsx`.

## Referensi

- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Code Splitting](https://react.dev/reference/react/lazy)
- [Skeleton Loading Pattern](https://ui.shadcn.com/docs/components/skeleton)
