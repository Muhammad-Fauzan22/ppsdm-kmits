# Ebook Batch Processing System

Sistem batch processing komprehensif untuk mengolah ebook dari Google Drive CSV dan menghasilkan modul pembelajaran Grade A dengan sampul buku.

## 📚 Overview

Sistem ini memproses 100+ ebook dari CSV "EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv" dan menghasilkan:

- 🎯 **Grade A Content** (Quality Score 90+)
- 📖 **Complete Course Structure** (Modules, Lessons, Quizzes)
- 🎨 **Book Cover Images** (Google Books API, Open Library, Placeholder)
- 🎮 **Gamification Elements** (XP, Badges, Progress)
- 🗄️ **Database Integration** (Supabase)

## 🏗️ Architecture

```
EBOOK MANAGEMENT SYSTEM - 📚 DATABASE UTAMA.csv
                    │
                    ▼
    ┌───────────────────────────────┐
    │   batch_process_ebooks.py     │
    │   (Main Batch Processor)      │
    └───────────────────────────────┘
                    │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │ fetch_ │ │generate│ │ Grade A│
   │book_   │ │courses_│ │Pipeline│
   │covers  │ │from_   │ │(15-    │
   │.py     │ │books.py│ │Layer)  │
   └────────┘ └────────┘ └────────┘
        │          │          │
        └──────────┼──────────┘
                   ▼
    ┌───────────────────────────────┐
    │    content_output/{slug}/     │
    │  - course.json                │
    │  - modules.json               │
    │  - lessons.json               │
    │  - quiz_questions.json        │
    │  - cover_image.svg            │
    │  - metadata.json              │
    └───────────────────────────────┘
                   │
                   ▼
    ┌───────────────────────────────┐
    │      Supabase Database        │
    │  - ebooks                     │
    │  - courses_from_ebooks        │
    │  - learning_modules           │
    │  - batch_processing_jobs      │
    └───────────────────────────────┘
```

## 📁 File Structure

```
ppsdm-kmits/
├── scripts/
│   ├── batch_process_ebooks.py      # Main batch processor
│   ├── fetch_book_covers.py         # Book cover fetcher
│   ├── generate_courses_from_books.py # Course generator
│   └── ...
├── src/app/(admin)/ebook-processor/
│   └── page.tsx                     # Admin UI
├── src/app/api/admin/
│   ├── batch-process-ebooks/route.ts # API: Batch processing
│   ├── process-ebook/route.ts       # API: Single book processing
│   └── fetch-book-cover/route.ts    # API: Cover fetching
├── supabase/
│   └── ebook_schema.sql             # Database schema
└── content_output/
    └── {book_slug}/
        ├── course.json
        ├── modules.json
        ├── lessons.json
        ├── quiz_questions.json
        ├── cover_image.svg
        └── metadata.json
```

## 🚀 Usage

### 1. Setup Database

```bash
# Run the schema in Supabase SQL Editor
\i supabase/ebook_schema.sql
```

### 2. Process All Ebooks (Batch)

```bash
# Navigate to scripts folder
cd scripts

# Process all ebooks
python batch_process_ebooks.py

# Process only priority books (first 5)
python batch_process_ebooks.py --priority-only

# Limit to 10 books
python batch_process_ebooks.py --limit 10

# Custom quality target
python batch_process_ebooks.py --target-quality 95
```

### 3. Check Status

```bash
python batch_process_ebooks.py --status
```

### 4. Admin Dashboard

Access the admin dashboard at:
```
http://localhost:3000/admin/ebook-processor
```

Features:
- 📤 Upload CSV file
- 📚 View all ebooks with covers
- ▶️ Batch process button
- 📊 Real-time progress monitoring
- ⭐ Quality scores for each book
- 👁️ Preview generated courses

## 📊 Priority Books

The following books are processed first (high priority):

1. **Buku 1 KDKM dan HDPSDM MUBES V ITS.pdf** - PPSDM Core
2. **Naskah Akademik dan Penyusunan PPSDM KMM ITS.pdf** - Academic Foundation  
3. **Pendidikan Kaum Tertindas - Paulo Freire** - Philosophy of Education
4. **Catatan Seorang Demonstran - Soe Hok Gie** - History/Activism
5. **Sejarah Pergerakan Nasional Indonesia** - National History

## 🎯 Grade A 15-Layer Pipeline

Each book goes through the comprehensive 15-layer pipeline:

| Layer | Name | Description |
|-------|------|-------------|
| 1 | Intelligent Source Acquisition | Download from Google Drive |
| 2 | Multi-Modal Document Processing | PDF text extraction (OCR) |
| 3 | Semantic Chunking & Knowledge Graph | Content segmentation |
| 4 | Cross-Source Validation | Fact-checking |
| 5 | Deep Understanding via Long-Context AI | Content analysis |
| 6 | Pedagogical Structure Analysis | Learning flow design |
| 7 | Bloom's Taxonomy Alignment | Learning objectives |
| 8 | Cultural & Contextual Adaptation | Indonesian context |
| 9 | Multimodal Content Generation | Videos, audio, etc. |
| 10 | Interactive Element Creation | Quizzes, scenarios |
| 11 | Peer Review Simulation | Quality validation |
| 12 | Quality Scoring & Refinement | Grade A optimization |
| 13 | Accessibility Enhancement | WCAG 2.1 compliance |
| 14 | Metadata & Standards Compliance | SCORM/xAPI |
| 15 | Packaging & Delivery Optimization | Final output |

## 📈 Quality Metrics

Target quality: **90+ (Grade A)**

Metrics calculated:
- **Accuracy** (25%): Content correctness
- **Completeness** (15%): Coverage of topics
- **Coherence** (15%): Logical flow
- **Engagement** (10%): Interactive elements
- **Pedagogical** (15%): Learning effectiveness
- **Accessibility** (10%): Universal design
- **Source Diversity** (5%): Multiple perspectives
- **Citation Quality** (5%): References

## 🎨 Book Cover Sources

Covers are fetched in order:

1. **Google Books API** (Primary) - ISBN/title search
2. **Open Library Covers API** (Fallback) - OpenLibrary database
3. **Generated Placeholder** (Default) - SVG with title/author

## 🗄️ Database Schema

### Key Tables

- **`ebooks`**: Ebook metadata and processing status
- **`courses_from_ebooks`**: Generated course information
- **`learning_modules`**: Course modules
- **`book_cover_cache`**: Cover image cache
- **`batch_processing_jobs`**: Batch job tracking

### Views

- `ebooks_with_covers`: Ebooks with cover info
- `courses_with_ebooks`: Courses with ebook details
- `queue_status`: Processing queue status
- `batch_job_summary`: Job summaries

## 🔧 Configuration

Environment variables (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

## 📝 Sample Output

Example output structure for a processed book:

```json
content_output/buku-1-kdkm-dan-hdpsdm-mubes-v-its/
├── course.json              # Course metadata
├── modules.json             # 4 modules
├── lessons.json             # 16 lessons
├── quiz_questions.json      # 40 quiz questions
├── cover_image.svg          # Generated cover
└── metadata.json            # Quality report
```

Sample metadata:
```json
{
  "quality_score": 94.5,
  "grade": "A",
  "modules_count": 4,
  "lessons_count": 16,
  "total_xp": 850,
  "estimated_duration_hours": 12
}
```

## 🎓 Course Structure

Each course includes:

- **4-6 Modules** per book
- **3-5 Lessons** per module
- **10 Quiz Questions** per module
- **1 Practical Assignment** per module
- **Bloom's Taxonomy** alignment (levels 1-6)
- **XP Rewards** and badges
- **Bilingual Content** (Indonesian + English)

## 🔄 Processing Flow

```
1. Read CSV → Get book list with DRIVE_ID
2. For each book:
   a. Download from Google Drive
   b. Extract text (PDF → text)
   c. Run Grade A 15-layer pipeline
   d. Fetch cover from APIs
   e. Generate course structure
   f. Save to content_output/
   g. Insert into Supabase
3. Update batch job status
4. Generate reports
```

## 📊 Monitoring

Real-time monitoring via:

1. **Admin Dashboard**: `/admin/ebook-processor`
2. **Supabase Realtime**: Live updates
3. **Log Files**: `batch_ebook_processing.log`
4. **Progress JSON**: `content_output/batch_progress.json`

## 🛠️ Troubleshooting

### Common Issues

1. **Download Failed**: Check DRIVE_ID and network
2. **OCR Failed**: Ensure PDF is text-searchable
3. **API Rate Limit**: Add delays between requests
4. **Quality Score Low**: Check source material quality

### Logs

```bash
# View processing logs
tail -f batch_ebook_processing.log

# View Python errors
python batch_process_ebooks.py 2>&1 | tee output.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## 📄 License

MIT License - PPSDM KMM ITS

## 📞 Contact

- **Organization**: PPSDM KMM ITS
- **Email**: hmmits2025@gmail.com
- **Repository**: https://github.com/ppsdm-kmm/ebook-processor

---

**Generated by PPSDM KMM Content Factory**
**Version**: 2.0.0
**Last Updated**: February 2026
