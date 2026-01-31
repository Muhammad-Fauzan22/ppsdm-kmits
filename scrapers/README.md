# 🕷️ PPSDM KMITS Scraper System

Sistem scraping otomatis untuk mengumpulkan konten edukatif dan informasi dari berbagai sumber.

## 📋 Fitur

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
