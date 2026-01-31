# 🕷️ PPSDM KMITS Scraper System

Sistem scraping otomatis untuk mengumpulkan konten edukatif dan informasi dari berbagai sumber.

## 📋 Fitur

### 🎯 Comprehensive ITS Scraper (NEW)
**`its_comprehensive_scraper.py`** - Scraper yang mengambil data dari SEMUA bagian website resmi ITS sesuai struktur menu:

**Main Menu (Top Bar):**
- ✓ Calon Mahasiswa (Admission, Beasiswa, Jalur Masuk)
- ✓ Mahasiswa (Portal, Prestasi, Organisasi)
- ✓ Mahasiswa Baru (Registrasi, Biaya, Fasilitas)
- ✓ Dosen & Staf (Penelitian, Hibah, Karir)
- ✓ Orang Tua (Panduan, Keuangan, FAQ)
- ✓ Alumni (Tracer Study, Job Vacancy, Networking)

**Secondary Menu (Main Navigation):**
- ✓ Profil ITS (Sejarah, Visi-Misi, Pimpinan, Fakultas)
- ✓ Pendaftaran (Sarjana, Magister, Doktor, Vokasi, Internasional)
- ✓ Kuliah di ITS (Program S1, S2, S3, MBKM, Internasional)
- ✓ Riset (Pusat Riset, Publikasi, Hibah, Repository)
- ✓ Inovasi (Inkubator, Startup, Paten, Techno Park)
- ✓ Inisiatif (ITS Goes Global, Sustainability, Smart Campus)
- ✓ Layanan (Akademik, Perpustakaan, Asrama, Karir)
- ✓ Berita (Terkini, Pengumuman, Event, Prestasi)

### Other Scrapers
- **ITS News Scraper**: Mengumpulkan berita dari website resmi ITS
- **YouTube Aggregator**: Aggregasi video edukatif dari channel teknologi
- **GitHub Trending**: Repository trending berdasarkan bahasa pemrograman
- **Automated Scheduling**: Berjalan otomatis via GitHub Actions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd ppsdm-kmits
pip install -r scrapers/requirements.txt
```

### 2. Setup Environment Variables

```bash
# Linux/Mac
export SUPABASE_URL="your-supabase-url"
export SUPABASE_KEY="your-supabase-key"
export YOUTUBE_API_KEY="your-youtube-api-key"
export GITHUB_TOKEN="your-github-token"  # Optional

# Windows PowerShell
$env:SUPABASE_URL="your-supabase-url"
$env:SUPABASE_KEY="your-supabase-key"
```

### 3. Run Scrapers

#### 🎯 Comprehensive ITS Scraper (Recommended)

```bash
# Scrape ALL ITS sections (complete website scraping)
python scrapers/its_comprehensive_scraper.py --all --json --supabase --stats

# Scrape specific section only
python scrapers/its_comprehensive_scraper.py --section berita --news-pages 5
python scrapers/its_comprehensive_scraper.py --section profil_its
python scrapers/its_comprehensive_scraper.py --section pendaftaran

# Scrape with custom delay (be more polite)
python scrapers/its_comprehensive_scraper.py --all --delay 5 --json
```

**Available Sections:**
- `calon_mahasiswa` - Informasi untuk calon mahasiswa
- `mahasiswa` - Portal dan info mahasiswa
- `mahasiswa_baru` - Registrasi dan orientasi
- `dosen_staf` - Info dosen dan staf
- `orang_tua` - Panduan untuk orang tua
- `alumni` - Portal alumni
- `profil_its` - Profil dan sejarah ITS
- `pendaftaran` - Jalur pendaftaran
- `kuliah_di_its` - Program studi
- `riset` - Penelitian dan publikasi
- `inovasi` - Inovasi dan startup
- `inisiatif` - Inisiatif strategis
- `layanan` - Layanan kampus
- `berita` - Berita dan pengumuman

#### Other Scrapers

```bash
# ITS News
python scrapers/its_news_scraper.py --pages 3 --json

# YouTube Videos
python scrapers/youtube_aggregator.py --max-results 5 --json

# GitHub Trending
python scrapers/github_trending.py --multi --since weekly --json
```

## 📊 Database Schema

Jalankan SQL ini di Supabase SQL Editor:

```sql
-- Tabel berita
CREATE TABLE scraped_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    link TEXT NOT NULL UNIQUE,
    image_url TEXT,
    date TIMESTAMP,
    categories TEXT[],
    scraped_at TIMESTAMP DEFAULT NOW()
);

-- Tabel video
CREATE TABLE scraped_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    video_id VARCHAR(100) NOT NULL UNIQUE,
    thumbnail_url TEXT,
    channel VARCHAR(100),
    url TEXT NOT NULL,
    published_at TIMESTAMP,
    tags TEXT[],
    scraped_at TIMESTAMP DEFAULT NOW()
);

-- Tabel repository
CREATE TABLE scraped_repos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    full_name VARCHAR(300),
    description TEXT,
    url TEXT NOT NULL,
    stars INTEGER DEFAULT 0,
    forks INTEGER DEFAULT 0,
    language VARCHAR(50),
    topics TEXT[],
    trending_period VARCHAR(20),
    scraped_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(full_name, trending_period)
);
```

## ⚙️ GitHub Actions Automation

Scraper berjalan otomatis setiap hari jam 9 pagi WIB. Untuk menjalankan manual:

1. Buka tab "Actions" di repository GitHub
2. Pilih workflow "Daily Content Scraping"
3. Klik "Run workflow"

## 📁 Struktur Folder

```
scrapers/
├── __init__.py              # Package initialization
├── its_news_scraper.py      # ITS berita scraper
├── youtube_aggregator.py    # YouTube video aggregator
├── github_trending.py       # GitHub trending scraper
├── event_aggregator.py      # Event aggregator (placeholder)
├── requirements.txt         # Dependencies
└── README.md               # Dokumentasi ini
```

## 🛡️ Legal & Etika

- Hanya scrape data publik
- Respect rate limits (3 detik delay)
- Patuhi robots.txt
- Gunakan untuk tujuan edukasi

## 🔧 Troubleshooting

### Import Error
```bash
pip install supabase requests beautifulsoup4
```

### API Key Error
Pastikan environment variables sudah di-set dengan benar.

### Windows Unicode Error
Sudah di-fix dengan `sys.stdout.reconfigure(encoding='utf-8')`

## 📞 Support

Hubungi tim PPSDM KMITS untuk bantuan.
